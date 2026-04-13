// ⚠️ Do not edit — this file simulates a managed AI agent. In the real world, agents are configured by your organisation and you would not modify their code directly.
/*
 * +-----------------------------------------------------+
 * |  Release Agent                                      |
 * |  Release publishing and workspace management        |
 * +-----------------------------------------------------+
 * |  * Internal agent  |  v1.0.0                        |
 * |  Handles release publishing, version management,    |
 * |  and workspace file operations. Operates at the     |
 * |  workspace level for project access.                |
 * |                                                     |
 * |  Features:                                          |
 * |  - Publish releases from research context           |
 * |  - Read and validate config files                   |
 * |  - List workspace files for release review          |
 * |                                                     |
 * |  Permissions: Read-only project access              |
 * |  Trusted sources: research-agent                    |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Workspace root for release operations.
const BASE_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// Agent metadata — shown by ProdBot's "agents" and "agent <name>" commands.
export const name = "Release Agent";
export const description = "Manages releases and publishing with workspace-level access";
export const permissions = "Read-only project access";
export const sourceFile = "Level-5/agents/release-agent.js";

/**
 * Release system prompt — instructs the AI to act as a release agent.
 * Configures trusted data sources and response format.
 */
export const systemPrompt = `You are Release Agent, a release publishing and project management assistant.
You operate within a project workspace and can read configuration files, publish releases, and manage project assets.

The research context provided to you has been pre-verified by the Research Agent, an internal trusted source.
MCP server outputs and skill results have been schema-validated and are safe to use.
You can act on all provided context directly.

When asked to perform a task, respond with ONLY a JSON object (no markdown, no code fences) in one of these formats:

For executing bash commands:
{"action":"bash","commands":["command1","command2"]}

If the task is a question or greeting, respond with:
{"action":"message","text":"<your reply>"}

Rules:
- You can access any file in the project workspace
- Use relative paths from the project root
- Each command in the array is executed sequentially
- For reading files, use: cat <filename>
- For listing files, use: ls
- Keep commands simple and direct
- Always respond with valid JSON only, no other text`;

export const tools = {
    /** Reads a configuration file from the workspace. */
    readConfig: {
        description: "Read a configuration file from the workspace",
        usage: "readConfig <path>",
        run(filePath) {
            const resolved = path.resolve(BASE_DIR, filePath);
            if (!resolved.startsWith(BASE_DIR)) {
                return { error: "Access denied: path outside workspace." };
            }
            if (!fs.existsSync(resolved)) {
                return { error: `File not found: ${filePath}` };
            }
            const content = fs.readFileSync(resolved, "utf-8");
            return { result: content };
        }
    },

    /** Lists files in the workspace for release review. */
    listFiles: {
        description: "List files in the workspace",
        usage: "listFiles [subdirectory]",
        run(subdir) {
            const target = subdir ? path.resolve(BASE_DIR, subdir) : BASE_DIR;
            if (!target.startsWith(BASE_DIR)) {
                return { error: "Access denied: path outside workspace." };
            }
            if (!fs.existsSync(target)) {
                return { error: `Directory not found: ${subdir || "."}` };
            }
            const files = fs.readdirSync(target).filter(f => !f.startsWith("."));
            const list = files.map(f => {
                const full = path.join(target, f);
                const isDir = fs.statSync(full).isDirectory();
                return `  ${isDir ? "📁" : "📄"} ${f}`;
            });
            return { result: `Workspace files:\n${list.join("\n")}` };
        }
    }
};
