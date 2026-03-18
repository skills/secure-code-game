// ⚠️ Do not edit — this file is part of the ProdBot engine. In the real world, the assistant's internals are managed by its vendor.
/**
 * bash.js — Sandboxed bash command validator and persistent shell executor.
 *
 * This module is the security layer of ProdBot. Before any command runs,
 * it passes through two checks:
 *   1. A denylist of dangerous command patterns (regex-based)
 *   2. Path validation to prevent escaping the sandbox directory
 *
 * Commands are executed inside a persistent bash shell process. This means
 * that shell state (variables, working directory) persists between commands,
 * just like a real terminal. The shell's working directory is locked to the
 * sandbox folder on startup.
 *
 * A unique marker is echoed after each command. ProdBot reads stdout until
 * it sees the marker, then returns everything before it as the command output.
 *
 * Key security concepts demonstrated:
 *   - Denylist filtering: blocking known-dangerous patterns
 *   - Path confinement: preventing directory traversal attacks
 *   - Execution sandboxing: restricting where commands run via `cwd`
 *   - Persistent shell: state survives across commands (like a real terminal)
 */

import { spawn } from "node:child_process";
import path from "node:path";
import chalk from "chalk";

/**
 * Regex patterns for commands that should never be executed.
 * Each pattern uses \b (word boundary) to avoid false positives —
 * e.g., \bsudo\b matches "sudo" but not "pseudocode".
 */
const DENIED_PATTERNS = [
    /\bsudo\b/,                                       // privilege escalation
    /\brm\s+(-[^\s]*\s+)*\/\s*$/,                     // rm / (delete root)
    /\brm\s+-[^\s]*r[^\s]*f|rm\s+-[^\s]*f[^\s]*r/,   // rm -rf or rm -fr (recursive force delete)
    /\bchmod\b/,                                       // changing file permissions
    /\bchown\b/,                                       // changing file ownership
    /\bmkfs\b/,                                        // formatting filesystems
    /\bdd\b/,                                          // low-level disk operations
    /\bcurl\b.*\|\s*(ba)?sh/,                          // downloading and piping to shell
    /\bwget\b.*\|\s*(ba)?sh/,                          // same as above with wget
    /\bexec\b/,                                        // replacing the shell process
];

/**
 * Validates a bash command before execution.
 *
 * Checks performed (in order):
 *   1. Command is not empty
 *   2. Command does not match any denied pattern
 *   3. Command does not reference ~ (expands to $HOME at runtime)
 *   4. Command is not bare "cd" (defaults to $HOME)
 *   5. Command does not use absolute paths (e.g., /etc/...)
 *   6. Command does not use path traversal (..) to escape the sandbox
 *   7. (Level 3+) Additional hardened checks to block shell tricks
 *
 * @param {string} cmd - The bash command to validate
 * @param {string} sandboxDir - The absolute path to the sandbox directory
 * @param {number} [level=1] - Current game level (higher = stricter)
 * @param {Object} [memoryContext={}] - System memory entries (Level 4+)
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateCommand(cmd, sandboxDir, level = 1, memoryContext = {}) {
    const trimmed = cmd.trim();
    if (!trimmed) return { valid: false, reason: "Empty command" };

    // Check against the denylist (always enforced, regardless of memory)
    for (const pattern of DENIED_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { valid: false, reason: `Blocked: command matches denied pattern` };
        }
    }

    // Reject tilde expansion — ~ resolves to $HOME at runtime, escaping the sandbox
    if (/(?:^|\s)~/.test(trimmed)) {
        return { valid: false, reason: "Home directory references (~) are not allowed" };
    }

    // Reject bare "cd" with no arguments — defaults to $HOME
    if (/^\s*cd\s*$/.test(trimmed)) {
        return { valid: false, reason: "Bare 'cd' navigates to home directory and is not allowed" };
    }

    // Reject absolute paths — commands must only use relative paths within the sandbox
    if (/(?:^|\s)\/[^\s]/.test(trimmed)) {
        return { valid: false, reason: "Absolute paths are not allowed" };
    }

    // Level 4+: workspace scope from system memory relaxes path checks
    const hasWorkspaceScope = level >= 4 && memoryContext.scope === "workspace";

    // Reject path traversal — ".." could escape the sandbox directory
    if (!hasWorkspaceScope && /(?:^|\s|\/)\.\.(\/|$|\s)/.test(trimmed)) {
        return { valid: false, reason: "Path traversal (..) is not allowed" };
    }

    // Level 3+: hardened checks to block Level 1 bypass techniques
    if (level >= 3 && !hasWorkspaceScope) {
        // Block variable assignments containing ".." (e.g., D=.., X=../)
        if (/=\s*\.\./.test(trimmed)) {
            return { valid: false, reason: "Variable assignments with '..' are not allowed" };
        }

        // Block backtick execution (could hide path traversal)
        if (/`/.test(trimmed)) {
            return { valid: false, reason: "Backtick execution is not allowed" };
        }

        // Block $(...) subshell expansion (could hide path traversal)
        if (/\$\(/.test(trimmed)) {
            return { valid: false, reason: "Subshell expansion $() is not allowed" };
        }

        // Block base64 decode piped to execution
        if (/base64\s+(-d|--decode)/.test(trimmed)) {
            return { valid: false, reason: "Base64 decoding is not allowed" };
        }

        // Block printf with hex/octal escapes (could encode "..")
        if (/printf\s+.*\\x|printf\s+.*\\[0-7]{3}/.test(trimmed)) {
            return { valid: false, reason: "Printf with escape sequences is not allowed" };
        }

        // Block eval (could reconstruct blocked commands)
        if (/\beval\b/.test(trimmed)) {
            return { valid: false, reason: "eval is not allowed" };
        }
    }

    return { valid: true };
}

/**
 * PersistentShell — A long-lived bash process that retains state between commands.
 *
 * Instead of spawning a new process per command (execSync), we keep a single
 * bash process running. Commands are written to its stdin, and we read stdout
 * until a unique marker appears, signaling the end of that command's output.
 *
 * This means variables, aliases, and working directory changes persist across
 * commands — just like a real terminal session.
 */
export class PersistentShell {
    constructor(sandboxDir, level = 1, getMemoryContext = () => ({})) {
        this.sandboxDir = sandboxDir;
        this.level = level;
        this.getMemoryContext = getMemoryContext;
        this.shell = null;
        this._spawn();
    }

    /** Spawn (or respawn) the bash process with cwd locked to the sandbox. */
    _spawn() {
        this.shell = spawn("bash", ["--norc", "--noprofile"], {
            cwd: this.sandboxDir,
            env: { ...process.env, PS1: "", PS2: "" },
            stdio: ["pipe", "pipe", "pipe"],
        });

        // If the shell exits unexpectedly, mark it as dead so we can respawn
        this.shell.on("exit", () => {
            this.shell = null;
        });
    }

    /**
     * Execute a command in the persistent shell.
     *
     * How it works:
     *   1. Generate a unique marker string
     *   2. Write the command to stdin, followed by `echo <marker>`
     *   3. Read stdout until the marker appears
     *   4. Return everything before the marker as the output
     *
     * The marker acts as a delimiter — without it, we'd have no way to know
     * when the command's output ends and the shell is ready for the next one.
     *
     * @param {string} cmd - The bash command to execute
     * @returns {Promise<{ success: boolean, output?: string, error?: string }>}
     */
    executeCommand(cmd) {
        const validation = validateCommand(cmd, this.sandboxDir, this.level, this.getMemoryContext());
        if (!validation.valid) {
            return Promise.resolve({ success: false, error: validation.reason });
        }

        // Respawn if the shell died
        if (!this.shell) {
            this._spawn();
        }

        return new Promise((resolve) => {
            const marker = `__PRODBOT_${Date.now()}_${Math.floor(Math.random() * 1e9)}__`;
            let stdout = "";
            let stderr = "";

            const onStdout = (chunk) => {
                stdout += chunk.toString();
                // Check if the marker has appeared in the output
                if (stdout.includes(marker)) {
                    cleanup();
                    // Everything before the marker is the command's output
                    const output = stdout.split(marker)[0];
                    if (stderr.trim()) {
                        resolve({ success: true, output: output + stderr });
                    } else {
                        resolve({ success: true, output });
                    }
                }
            };

            const onStderr = (chunk) => {
                stderr += chunk.toString();
            };

            const cleanup = () => {
                this.shell.stdout.off("data", onStdout);
                this.shell.stderr.off("data", onStderr);
            };

            this.shell.stdout.on("data", onStdout);
            this.shell.stderr.on("data", onStderr);

            // Write the command, then echo the marker on a new line.
            // The marker tells us where this command's output ends.
            this.shell.stdin.write(`${cmd}\necho ${marker}\n`);
        });
    }

    /** Clean up the shell process when ProdBot exits. */
    destroy() {
        if (this.shell) {
            this.shell.kill();
            this.shell = null;
        }
    }
}
