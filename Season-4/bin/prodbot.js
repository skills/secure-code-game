#!/usr/bin/env node
// ⚠️ Do not edit — this file is the ProdBot game engine. In the real world,
// the assistant's code is managed by its vendor and you would not modify it directly.

// Suppress the punycode deprecation warning (DEP0040) from the openai package
process.removeAllListeners("warning");
process.on("warning", (warning) => {
    if (warning.name === "DeprecationWarning" && warning.code === "DEP0040") return;
    console.warn(warning);
});

/**
 * prodbot.js — The main CLI entry point for ProdBot.
 *
 * This is the file that runs when you type `prodbot` in the terminal.
 * It ties together all the modules:
 *   - ai.js: sends user input to the LLM and gets structured commands back
 *   - bash.js: validates and executes those commands in a sandbox
 *   - banner.js: shows ASCII art when --banner flag is used
 *
 * The REPL (Read-Eval-Print Loop) flow:
 *   1. Show welcome box → wait for user input
 *   2. Send input to AI → get back bash commands or a message
 *   3. For each bash command: validate → show to user → ask y/n → execute
 *   4. Display results → loop back to step 1
 *
 * All bash commands are confined to the sandbox directory:
 *   Season-4/Level-1/prodbot-activities/
 *
 * The sandbox is created automatically on startup if it doesn't exist.
 */

import readline from "node:readline";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import chalk from "chalk";
import { showBanner } from "../lib/banner.js";
import { sendToAI } from "../lib/ai.js";
import { validateCommand, PersistentShell } from "../lib/bash.js";

// Stores the sources from the last web search so the player can review them.
let lastSources = [];

// Level configuration — flags, sandbox paths, and web directories per level.
const LEVELS = {
    1: { flag: "BYPA55ED", dir: "Level-1" },
    2: { flag: "INDIR3CT", dir: "Level-2", webDir: "web" },
    3: { flag: "EXCE55IV", dir: "Level-3", webDir: "web", mcpDir: "mcp" },
    4: { flag: "M3MORY1", dir: "Level-4", skillsDir: "skills" },
    5: { flag: "D3PUTY", dir: "Level-5", webDir: "web", mcpDir: "mcp", skillsDir: "skills", agentsDir: "agents" },
};

let currentLevel = 1;

/**
 * Resolve the sandbox directory relative to this script's location.
 * import.meta.url gives us the file:// URL of the current module,
 * which we convert to a filesystem path and navigate to the sandbox.
 */
const SEASON_DIR = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    ".."
);

function sandboxDir(level) {
    return path.join(SEASON_DIR, LEVELS[level].dir, "prodbot-activities");
}

function webDir(level) {
    if (!LEVELS[level].webDir) return null;
    return path.join(SEASON_DIR, LEVELS[level].dir, LEVELS[level].webDir);
}

function mcpDir(level) {
    if (!LEVELS[level].mcpDir) return null;
    return path.join(SEASON_DIR, LEVELS[level].dir, LEVELS[level].mcpDir);
}

function skillsDir(level) {
    if (!LEVELS[level].skillsDir) return null;
    return path.join(SEASON_DIR, LEVELS[level].dir, LEVELS[level].skillsDir);
}

function agentsDir(level) {
    if (!LEVELS[level].agentsDir) return null;
    return path.join(SEASON_DIR, LEVELS[level].dir, LEVELS[level].agentsDir);
}

// Loaded MCP servers for the current level.
let mcpServers = {};

// Loaded skills for the current level.
let skills = {};

// Loaded agents for the current level.
let agents = {};
let agentConfig = {};

// Track which directory the web server is serving (for open all).
let webServerDir = null;

/**
 * Loads MCP servers from the level's mcp/ directory.
 * Each .js file exports: name, description, scope, sourceFile, tools.
 */
async function loadMcpServers(level) {
    mcpServers = {};
    const dir = mcpDir(level);
    if (!dir || !fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
    for (const file of files) {
        try {
            const filePath = path.join(dir, file);
            const mod = await import(`file://${filePath}`);
            const key = file.replace(".js", "");
            mcpServers[key] = mod;
        } catch (err) {
            // Skip MCP servers that fail to load
        }
    }
}

/**
 * Loads skills from the level's skills/ directory.
 * Each skill is a directory following the agentskills.io specification,
 * containing a SKILL.md file with YAML frontmatter and a handler.js
 * script that exports: name, command, description, and a run() function.
 * Also supports flat .js files for backwards compatibility.
 */
async function loadSkills(level) {
    skills = {};
    const dir = skillsDir(level);
    if (!dir || !fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        try {
            if (entry.isDirectory()) {
                const handlerPath = path.join(dir, entry.name, "handler.js");
                if (fs.existsSync(handlerPath)) {
                    const mod = await import(`file://${handlerPath}`);
                    skills[mod.command] = mod;
                }
            } else if (entry.name.endsWith(".js")) {
                const filePath = path.join(dir, entry.name);
                const mod = await import(`file://${filePath}`);
                skills[mod.command] = mod;
            }
        } catch (err) {
            // Skip skills that fail to load
        }
    }
}

/**
 * Loads agents from the level's agents/ directory.
 * Each .js file exports: name, description, permissions, sourceFile, tools.
 * Also loads agents/config.json for trust and scope configuration.
 */
async function loadAgents(level) {
    agents = {};
    agentConfig = {};
    const dir = agentsDir(level);
    if (!dir || !fs.existsSync(dir)) return;

    // Load agent config
    const configPath = path.join(dir, "config.json");
    if (fs.existsSync(configPath)) {
        try {
            agentConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch { /* ignore config parse errors */ }
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
    for (const file of files) {
        try {
            const filePath = path.join(dir, file);
            const mod = await import(`file://${filePath}`);
            const key = file.replace(".js", "");
            agents[key] = mod;
        } catch (err) {
            // Skip agents that fail to load
        }
    }
}

// ─── Memory System ─────────────────────────────────────────────────────
// ProdBot's memory stores user preferences and system entries in .memory.
// User entries: key=value (from "remember" command)
// System entries: [system:ttl=N] key=value (from skills only)
// TTL=0 means persistent (no expiry). TTL>0 decrements after each command.

const MEMORY_FILE = () => path.join(SANDBOX_DIR, ".memory");

/** Reads all memory entries from the .memory file. */
function readMemoryFile() {
    const file = MEMORY_FILE();
    if (!fs.existsSync(file)) return [];
    const lines = fs.readFileSync(file, "utf-8").split("\n").filter(l => l.trim());
    return lines.map(line => {
        const sysMatch = line.match(/^\[system:ttl=(\d+)\]\s*(\w+)=(.*)$/);
        if (sysMatch) {
            return { type: "system", ttl: parseInt(sysMatch[1]), key: sysMatch[2], value: sysMatch[3] };
        }
        const userMatch = line.match(/^(\w+)=(.*)$/);
        if (userMatch) {
            return { type: "user", key: userMatch[1], value: userMatch[2] };
        }
        return null;
    }).filter(Boolean);
}

/** Writes all entries back to the .memory file. */
function saveMemoryFile(entries) {
    const lines = entries.map(e => {
        if (e.type === "system") return `[system:ttl=${e.ttl}] ${e.key}=${e.value}`;
        return `${e.key}=${e.value}`;
    });
    fs.writeFileSync(MEMORY_FILE(), lines.join("\n") + "\n");
}

/** Adds a user-level memory entry. */
function writeMemoryEntry(key, value) {
    const entries = readMemoryFile().filter(e => !(e.type === "user" && e.key === key));
    entries.push({ type: "user", key, value });
    saveMemoryFile(entries);
}

/** Adds a system-level memory entry (used by skills only). */
function writeSystemMemoryEntry(key, value, ttl) {
    const entries = readMemoryFile().filter(e => !(e.type === "system" && e.key === key));
    entries.push({ type: "system", ttl, key, value });
    saveMemoryFile(entries);
}

/** Removes a memory entry by key (user or system). */
function forgetMemoryEntry(key) {
    const entries = readMemoryFile().filter(e => e.key !== key);
    saveMemoryFile(entries);
}

/** Decrements TTLs on system entries and removes expired ones. */
function decrementTTLs() {
    const entries = readMemoryFile();
    const updated = [];
    for (const e of entries) {
        if (e.type === "system" && e.ttl > 0) {
            e.ttl -= 1;
            if (e.ttl > 0) updated.push(e);
            // ttl reached 0 from >0: remove (expired)
        } else {
            updated.push(e); // user entries or ttl=0 system entries persist
        }
    }
    saveMemoryFile(updated);
}

/** Returns system memory entries as a key-value object for the validator. */
function getSystemMemoryContext() {
    const entries = readMemoryFile().filter(e => e.type === "system");
    const ctx = {};
    for (const e of entries) ctx[e.key] = e.value;
    return ctx;
}

/** Shows the memory command output with entries grouped by type. */
function showMemory() {
    const entries = readMemoryFile();
    if (entries.length === 0) {
        console.log(chalk.gray("  No preferences saved. Use: remember <key>=<value>"));
        return;
    }
    console.log();
    console.log(chalk.hex("#FF00FF")("  Memory:"));
    let prevType = null;
    for (const e of entries) {
        // Add spacing between groups of different entry types
        if (prevType !== null && prevType !== e.type) {
            console.log();
        }
        if (e.type === "system") {
            const ttlLabel = e.ttl === 0 ? "persistent" : `ttl=${e.ttl}`;
            console.log(chalk.gray(`    [system:${ttlLabel}] `) + chalk.white(`${e.key}`) + chalk.gray(` = ${e.value}`));
        } else {
            console.log(chalk.white(`    ${e.key}`) + chalk.gray(` = ${e.value}`));
        }
        prevType = e.type;
    }
    console.log();
}

/** Builds a context object that skills receive when they run. */
function buildSkillContext() {
    return {
        readMemory: readMemoryFile,
        writeMemory: writeMemoryEntry,
        writeSystemMemory: writeSystemMemoryEntry,
        sandboxDir: SANDBOX_DIR,
        levelDir: path.join(SEASON_DIR, LEVELS[currentLevel].dir),
    };
}

// ─── End Memory System ─────────────────────────────────────────────────

// Create the initial sandbox directory if it doesn't exist yet.
let SANDBOX_DIR = sandboxDir(1);
if (!fs.existsSync(SANDBOX_DIR)) {
    fs.mkdirSync(SANDBOX_DIR, { recursive: true });
}

// Create a persistent shell instance — one long-lived bash process that
// retains state (variables, cwd) between commands, like a real terminal.
let shell = new PersistentShell(SANDBOX_DIR, currentLevel, getSystemMemoryContext);

/**
 * Displays the welcome box when ProdBot starts.
 * Uses chalk for colored terminal output and Unicode box-drawing characters
 * (╭, ╮, │, ╰, ╯) to create a bordered message box.
 */
function showWelcome() {
    const m = chalk.hex("#FF00FF");
    const g = chalk.hex("#20C20E");
    const w = chalk.white;

    const lvl = LEVELS[currentLevel];
    const sandboxLabel = `${lvl.dir}/prodbot-activities/`;

    const width = 60;
    const top = m("╭" + "─".repeat(width) + "╮");
    const bot = m("╰" + "─".repeat(width) + "╯");
    const pad = (str, len) => str + " ".repeat(Math.max(0, len - stripAnsi(str).length));
    const line = (str) => m("│") + " " + pad(str, width - 1) + m("│");

    console.log();
    console.log(top);
    console.log(line(g("🤖  Productivity Bot - Welcome to Level " + currentLevel)));
    console.log(line(w("    Describe a task to get started.")));
    console.log(line(""));
    console.log(line(w("Enter " + chalk.yellowBright("?") + " to see all commands.")));
    console.log(line(w("Sandbox: " + chalk.gray(sandboxLabel))));
    if (currentLevel === 2) {
        console.log(line(w("Web search: " + chalk.hex("#20C20E")("enabled"))));
    }
    if (currentLevel >= 3 && currentLevel < 4) {
        const count = Object.keys(mcpServers).length;
        console.log(line(w("MCP tools: " + chalk.hex("#20C20E")(`${count} connected`) + chalk.gray(" (sandbox-scoped)"))));
    }
    if (currentLevel >= 4 && currentLevel < 5) {
        const count = Object.keys(skills).length;
        console.log(line(w("Skills: " + chalk.hex("#20C20E")(`${count} org-approved`) + chalk.gray(" (Skills Committee)"))));
    }
    if (currentLevel >= 5) {
        const count = Object.keys(agents).length;
        console.log(line(w("Agents: " + chalk.hex("#20C20E")(`${count} connected`) + chalk.gray(" (multi-agent orchestration)"))));
    }
    console.log(line(w("ProdBot uses AI, so always check for mistakes.")));
    console.log(bot);

    if (currentLevel >= 2) {
        console.log();
        console.log(chalk.gray("  💡 Previous exploits may still work — but each level"));
        console.log(chalk.gray("     introduces a distinct vulnerability worth discovering."));
    }

    // Task description for each level
    if (currentLevel === 1) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    Your company has started a pilot with ProdBot. It generates"));
        console.log(chalk.gray("    bash commands inside a sandbox. Use natural language to get"));
        console.log(chalk.gray("    ProdBot to reveal the contents of password.txt."));
    } else if (currentLevel === 2) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot can now browse the web. It fetches pages and"));
        console.log(chalk.gray("    summarises what it finds. Make ProdBot read password.txt"));
        console.log(chalk.gray("    to advance to the next level."));
    } else if (currentLevel === 3) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot connects to MCP servers and chains tools into"));
        console.log(chalk.gray("    agentic workflows. Make ProdBot read password.txt"));
        console.log(chalk.gray("    to advance to the next level."));
    } else if (currentLevel === 4) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot now runs org-approved skills and stores persistent"));
        console.log(chalk.gray("    memory. Make ProdBot read password.txt to advance to"));
        console.log(chalk.gray("    the next level."));
    } else if (currentLevel === 5) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot delegates to six specialised agents with shared tools,"));
        console.log(chalk.gray("    skills, and web. Everything is claimed to be pre-verified and"));
        console.log(chalk.gray("    sandbox-scoped. Make ProdBot read password.txt to complete"));
        console.log(chalk.gray("    the game."));
    }

    // Example prompts to help the player get started
    if (currentLevel === 1) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Try:"));
        console.log(chalk.gray('    "Create a file called hello.txt with Hello World"'));
        console.log(chalk.gray('    "List all files"'));
        console.log(chalk.gray('    "Show me what is in the current directory"'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  Commands:"));
        console.log(chalk.gray("    ?            ") + chalk.gray("Show all commands and help"));
        console.log(chalk.gray("    level <n>    ") + chalk.gray("Jump to a specific level"));
        console.log(chalk.gray("    remember <key>=<value> ") + chalk.gray("Save a preference"));
        console.log(chalk.gray("    forget <key> ") + chalk.gray("Remove a saved preference"));
        console.log(chalk.gray("    memory       ") + chalk.gray("View saved preferences"));
    } else if (currentLevel === 2) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Try:"));
        console.log(chalk.gray('    "New York weather forecast"'));
        console.log(chalk.gray('    "Find flights on Skyscanner"'));
        console.log(chalk.gray('    "Latest ESPN scores"'));
        console.log(chalk.gray('    "Search Airbnb rentals"'));
        console.log(chalk.gray('    "Find products on Amazon"'));
        console.log(chalk.gray('    "Latest Reddit discussions"'));
        console.log(chalk.gray('    "Latest Sky Sports scores"'));
        console.log(chalk.gray('    "Search eBay listings"'));
        console.log(chalk.gray('    "Find jobs on LinkedIn"'));
        console.log(chalk.gray('    "Latest Bloomberg news"'));
        console.log(chalk.gray('    "Yahoo Finance stock prices"'));
        console.log(chalk.gray('    "What is the Accuweather forecast?"'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  Commands:"));
        console.log(chalk.gray("    open all     ") + chalk.gray("Browse the simulated web"));
        console.log(chalk.gray("    remember <key>=<value> ") + chalk.gray("Save a preference"));
        console.log(chalk.gray("    forget <key> ") + chalk.gray("Remove a saved preference"));
        console.log(chalk.gray("    memory       ") + chalk.gray("View saved preferences"));
        console.log(chalk.gray("    level <n>    ") + chalk.gray("Jump to a specific level"));
        console.log(chalk.gray("    ?            ") + chalk.gray("Show all commands and help"));
    } else if (currentLevel === 3) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Try:"));
        console.log(chalk.gray('    "Research Apple\'s stock"'));
        console.log(chalk.gray('    "Deep dive into Nvidia"'));
        console.log(chalk.gray('    "Analyse Tesla for me"'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  These prompts trigger an agentic workflow:"));
        console.log(chalk.gray("    User Prompt → ") + chalk.hex("#20C20E")("📈 Finance") + chalk.gray(" → ") + chalk.hex("#0770E3")("🌐 Web") + chalk.gray(" → ") + chalk.hex("#FF00FF")("📊 Report") + chalk.gray(" → ") + chalk.hex("#F0A030")("☁️  Cloud Backup"));
        console.log();
        console.log(chalk.hex("#20C20E")("    📈 Finance MCP") + chalk.gray("  →  stock prices + market overview"));
        console.log(chalk.hex("#0770E3")("    🌐 Web MCP    ") + chalk.gray("  →  online news & research"));
        console.log(chalk.hex("#F0A030")("    ☁️  Cloud MCP  ") + chalk.gray("  →  auto-saves report to backup"));
        console.log();
        console.log(chalk.hex("#FF00FF")("  You can also run individual MCP server functions:"));
        console.log(chalk.gray('    "Stock price of AAPL"'));
        console.log(chalk.gray('    "Browse Bloomberg for news"'));
        console.log(chalk.gray('    "Back up a file to cloud"'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  Commands:"));
        console.log(chalk.gray("    tools        ") + chalk.gray("List installed MCP tools"));
        console.log(chalk.gray("    tool <name>  ") + chalk.gray("Inspect a specific MCP tool"));
        console.log(chalk.gray("    remember <key>=<value> ") + chalk.gray("Save a preference"));
        console.log(chalk.gray("    forget <key> ") + chalk.gray("Remove a saved preference"));
        console.log(chalk.gray("    memory       ") + chalk.gray("View saved preferences"));
        console.log(chalk.gray("    level <n>    ") + chalk.gray("Jump to a specific level"));
        console.log(chalk.gray("    ?            ") + chalk.gray("Show all commands and help"));
    } else if (currentLevel === 4) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Try:"));
        console.log(chalk.gray('    skills'));
        console.log(chalk.gray('    run <skill-name>'));
        console.log();
        for (const [cmd, sk] of Object.entries(skills)) {
            const icon = { standup: "📋", snippets: "💾", "env-setup": "⚙️ ", "meeting-notes": "📝", onboarding: "🚀", "team-sync": "🔄" }[cmd] || "🔧";
            console.log(chalk.gray(`    ${icon} ${cmd.padEnd(16)}`) + chalk.gray(`  ${sk.description}`));
        }
        console.log();
        console.log(chalk.hex("#FF00FF")("  Commands:"));
        console.log(chalk.gray("    skills       ") + chalk.gray("List org-approved skills"));
        console.log(chalk.gray("    skill <name> ") + chalk.gray("View skill details"));
        console.log(chalk.gray("    run <name>   ") + chalk.gray("Execute an installed skill"));
        console.log(chalk.gray("    remember <key>=<value> ") + chalk.gray("Save a preference"));
        console.log(chalk.gray("    forget <key> ") + chalk.gray("Remove a saved preference"));
        console.log(chalk.gray("    memory       ") + chalk.gray("View saved preferences"));
        console.log(chalk.gray("    level <n>    ") + chalk.gray("Jump to a specific level"));
        console.log(chalk.gray("    ?            ") + chalk.gray("Show all commands and help"));
    } else if (currentLevel === 5) {
        console.log();
        console.log(chalk.hex("#FF00FF")("  Try:"));
        console.log();
        console.log(chalk.hex("#FF00FF")("    Single-agent:"));
        console.log(chalk.gray('      "sync team status"'));
        console.log(chalk.gray('      "triage issues"'));
        console.log(chalk.gray('      "review recent changes"'));
        console.log(chalk.gray('      "generate docs"'));
        console.log(chalk.hex("#FF00FF")("    Multi-agent:"));
        console.log(chalk.gray('      "triage and review new PRs"'));
        console.log(chalk.gray('      "generate docs from latest changes"'));
        console.log(chalk.gray('      "research contributing guidelines and summarise"'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  Agents:"));
        for (const [key, ag] of Object.entries(agents)) {
            const meta = AGENT_ICONS[key] || { icon: "🤖", color: "#AAAAAA" };
            console.log(chalk.hex(meta.color)(`    ${meta.icon} ${ag.name.padEnd(16)}`) + chalk.gray(`  ${ag.permissions}`));
        }
        console.log();
        console.log(chalk.hex("#FF00FF")("  Tools:"));
        for (const [key, mcp] of Object.entries(mcpServers)) {
            const icon = { "formatter-mcp": "📐", "linter-mcp": "📏", "analytics-mcp": "📊" }[key] || "🔧";
            console.log(chalk.gray(`    ${icon} ${(mcp.name || key).padEnd(18)}`) + chalk.gray(`  ${mcp.scope || ""}`));
        }
        console.log();
        console.log(chalk.hex("#FF00FF")("  Skills:"));
        for (const [cmd, sk] of Object.entries(skills)) {
            const icon = { summarise: "📝", label: "🏷️", "draft-pr": "📄" }[cmd] || "🔧";
            console.log(chalk.gray(`    ${icon} ${cmd.padEnd(16)}`) + chalk.gray(`  ${sk.description}`));
        }
        console.log();
        console.log(chalk.hex("#3fb950")("  🔒 Trust & Safety:"));
        console.log(chalk.gray('    All agents are sandbox-scoped or read-only.'));
        console.log(chalk.gray('    Agent-to-agent data is pre-verified internally.'));
        console.log(chalk.gray('    MCP servers and skills are schema-validated before use.'));
        console.log(chalk.gray('    Custom tools are sandboxed and cannot access workspace files.'));
        console.log(chalk.gray('    No agent can access files outside its designated scope.'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  Inspect:"));
        console.log(chalk.gray('    agent <name>    tool <name>    skill <name>'));
        console.log();
        console.log(chalk.hex("#FF00FF")("  Commands:"));
        console.log(chalk.gray("    agents       ") + chalk.gray("List connected agents"));
        console.log(chalk.gray("    tools        ") + chalk.gray("List installed MCP tools"));
        console.log(chalk.gray("    skills       ") + chalk.gray("List org-approved skills"));
        console.log(chalk.gray("    run <name>   ") + chalk.gray("Execute an installed skill"));
        console.log(chalk.gray("    open all     ") + chalk.gray("Browse the simulated web"));
        console.log(chalk.gray("    remember <key>=<value> ") + chalk.gray("Save a preference"));
        console.log(chalk.gray("    forget <key> ") + chalk.gray("Remove a saved preference"));
        console.log(chalk.gray("    memory       ") + chalk.gray("View saved preferences"));
        console.log(chalk.gray("    level <n>    ") + chalk.gray("Jump to a specific level"));
        console.log(chalk.gray("    ?            ") + chalk.gray("Show all commands and help"));
    }
    console.log();
}

/** Prints available commands and example usage. */
function showHelp() {
    console.log();

    // Task reminder per level
    if (currentLevel === 1) {
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    Your company has started a pilot with ProdBot. It generates"));
        console.log(chalk.gray("    bash commands inside a sandbox. Use natural language to get"));
        console.log(chalk.gray("    ProdBot to reveal the contents of password.txt."));
    } else if (currentLevel === 2) {
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot can now browse the web. It fetches pages and"));
        console.log(chalk.gray("    summarises what it finds. Make ProdBot read password.txt"));
        console.log(chalk.gray("    to advance to the next level."));
    } else if (currentLevel === 3) {
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot connects to MCP servers and chains tools into"));
        console.log(chalk.gray("    agentic workflows. Make ProdBot read password.txt"));
        console.log(chalk.gray("    to advance to the next level."));
    } else if (currentLevel === 4) {
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot now runs org-approved skills and stores persistent"));
        console.log(chalk.gray("    memory. Make ProdBot read password.txt to advance to"));
        console.log(chalk.gray("    the next level."));
    } else if (currentLevel === 5) {
        console.log(chalk.hex("#FF00FF")("  Task:"));
        console.log(chalk.gray("    ProdBot delegates to six specialised agents with shared tools,"));
        console.log(chalk.gray("    skills, and web. Everything is claimed to be pre-verified and"));
        console.log(chalk.gray("    sandbox-scoped. Make ProdBot read password.txt to complete"));
        console.log(chalk.gray("    the game."));
    }

    // Commands section — level-specific first, then common
    console.log();
    console.log(chalk.hex("#FF00FF")("  Commands:"));
    if (currentLevel === 2 || currentLevel >= 5) {
        console.log(chalk.white("    open <n>     ") + chalk.gray("Open web source N in browser"));
        console.log(chalk.white("    open all     ") + chalk.gray("Browse the simulated web"));
    }
    if (currentLevel === 3 || currentLevel >= 5) {
        console.log(chalk.white("    tools        ") + chalk.gray("List installed MCP tools"));
        console.log(chalk.white("    tool <name>  ") + chalk.gray("Inspect a specific MCP tool"));
    }
    if (currentLevel >= 4) {
        console.log(chalk.white("    skills       ") + chalk.gray("List org-approved skills"));
        console.log(chalk.white("    skill <name> ") + chalk.gray("View skill details"));
        console.log(chalk.white("    run <name>   ") + chalk.gray("Execute an installed skill"));
    }
    if (currentLevel >= 5) {
        console.log(chalk.white("    agents       ") + chalk.gray("List connected agents"));
        console.log(chalk.white("    agent <name> ") + chalk.gray("Inspect a specific agent"));
        console.log(chalk.white("    web          ") + chalk.gray("List available web pages"));
    }
    console.log(chalk.white("    remember <key>=<value> ") + chalk.gray("Save a preference"));
    console.log(chalk.white("    forget <key> ") + chalk.gray("Remove a saved preference"));
    console.log(chalk.white("    memory       ") + chalk.gray("View saved preferences"));
    console.log(chalk.white("    level <n>    ") + chalk.gray("Jump to a specific level"));
    console.log(chalk.white("    ?            ") + chalk.gray("Show this help message"));
    console.log(chalk.white("    exit         ") + chalk.gray("Exit ProdBot"));

    // Examples matching the welcome Try: for each level
    console.log();
    console.log(chalk.hex("#FF00FF")("  Examples:"));
    if (currentLevel === 1) {
        console.log(chalk.gray('    "Create a file called hello.txt with Hello World"'));
        console.log(chalk.gray('    "List all files"'));
        console.log(chalk.gray('    "Show me what is in the current directory"'));
    } else if (currentLevel === 2) {
        console.log(chalk.gray('    "New York weather forecast"'));
        console.log(chalk.gray('    "Find flights on Skyscanner"'));
        console.log(chalk.gray('    "Latest ESPN scores"'));
        console.log(chalk.gray('    "Search Airbnb rentals"'));
        console.log(chalk.gray('    "Find products on Amazon"'));
        console.log(chalk.gray('    "Latest Reddit discussions"'));
        console.log(chalk.gray('    "Latest Sky Sports scores"'));
        console.log(chalk.gray('    "Search eBay listings"'));
        console.log(chalk.gray('    "Find jobs on LinkedIn"'));
        console.log(chalk.gray('    "Latest Bloomberg news"'));
        console.log(chalk.gray('    "Yahoo Finance stock prices"'));
        console.log(chalk.gray('    "What is the Accuweather forecast?"'));
    } else if (currentLevel === 3) {
        console.log(chalk.gray('    "Research Apple\'s stock"'));
        console.log(chalk.gray('    "Deep dive into Nvidia"'));
        console.log(chalk.gray('    "Analyse Tesla for me"'));
        console.log(chalk.gray('    "Stock price of AAPL"'));
        console.log(chalk.gray('    "Browse Bloomberg for news"'));
        console.log(chalk.gray('    "Back up a file to cloud"'));
    } else if (currentLevel === 4) {
        console.log(chalk.gray('    skills'));
        console.log(chalk.gray('    run <skill-name>'));
    } else if (currentLevel === 5) {
        console.log(chalk.hex("#FF00FF")("    Single-agent:"));
        console.log(chalk.gray('      "sync team status"'));
        console.log(chalk.gray('      "triage issues"'));
        console.log(chalk.gray('      "review recent changes"'));
        console.log(chalk.gray('      "generate docs"'));
        console.log(chalk.hex("#FF00FF")("    Multi-agent:"));
        console.log(chalk.gray('      "triage and review new PRs"'));
        console.log(chalk.gray('      "generate docs from latest changes"'));
        console.log(chalk.gray('      "research contributing guidelines and summarise"'));
    }
    console.log();
}

/**
 * Strips ANSI escape codes from a string.
 * Needed to calculate the true visible length of colored text
 * when padding strings inside the welcome box.
 */
function stripAnsi(str) {
    return str.replace(/\u001b\[[0-9;]*m/g, "");
}

/**
 * Shows a bash command to the user and asks for confirmation.
 * Returns a Promise that resolves to true (execute) or false (skip).
 *
 * This is the "human-in-the-loop" pattern — the AI suggests actions
 * but a human must approve before anything runs.
 */
function askConfirmation(rl, cmd) {
    return new Promise((resolve) => {
        console.log(chalk.yellowBright(`  ⚡ ${cmd}`));
        rl.question(chalk.white("  Execute? (y/n) "), (answer) => {
            resolve(answer.trim().toLowerCase() === "y");
        });
    });
}

/**
 * Switches ProdBot to a different level.
 * Updates sandbox path, respawns the shell, and shows a welcome message.
 */
async function switchToLevel(level) {
    if (!LEVELS[level]) {
        console.log(chalk.redBright(`  ❌ Level ${level} does not exist.`));
        return;
    }
    if (level === currentLevel) {
        console.log(chalk.yellowBright(`  ⚠️  Already on Level ${level}.`));
        return;
    }

    currentLevel = level;
    SANDBOX_DIR = sandboxDir(level);
    if (!fs.existsSync(SANDBOX_DIR)) {
        fs.mkdirSync(SANDBOX_DIR, { recursive: true });
    }

    // Clear memory on Level 4 so players can retry the exploit from scratch
    if (level === 4) {
        const memFile = path.join(SANDBOX_DIR, ".memory");
        if (fs.existsSync(memFile)) fs.unlinkSync(memFile);
    }

    // Set Finance MCP API key via environment variable (not stored in config)
    if (level >= 3) {
        process.env.FINANCE_API_KEY = LEVELS[2].flag;
    }

    // Respawn the shell in the new sandbox
    shell.destroy();
    shell = new PersistentShell(SANDBOX_DIR, currentLevel, getSystemMemoryContext);
    // Load MCP servers and skills if available for this level
    await loadMcpServers(level);
    await loadSkills(level);
    await loadAgents(level);

    showWelcome();
}

/**
 * Web search — scans the web/ directory for pages matching the query.
 *
 * Simulates an internet search by keyword-matching filenames and content
 * against the player's query. Returns the HTML content of the best match.
 * Shows interactive thinking with emojis so the player sees what ProdBot
 * is doing — which pages it scans, which one it picks.
 */
async function webSearch(query) {
    const dir = webDir(currentLevel);
    if (!dir || !fs.existsSync(dir)) return null;

    const files = fs.readdirSync(dir).filter(f => f.endsWith(".html") && f !== "index.html");
    if (files.length === 0) return null;

    const queryLower = query.toLowerCase();
    console.log(chalk.cyanBright("  🔍 Searching the web..."));
    console.log(chalk.gray("  🌐 Scanning " + files.length + " websites..."));

    // Score each page by keyword overlap with the query
    const scored = [];
    for (const file of files) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const siteName = file.replace(".html", "").replace(/-/g, " ");

        // Simple scoring: count query words that appear in filename or content
        const words = queryLower.split(/\s+/).filter(w => w.length > 2);
        let score = 0;
        const contentLower = content.toLowerCase();
        for (const word of words) {
            if (siteName.includes(word)) score += 3;
            if (contentLower.includes(word)) score += 1;
        }
        if (score > 0) scored.push({ file, filePath, content, score });
    }

    if (scored.length === 0) {
        console.log(chalk.gray("  📭 No relevant results found."));
        return null;
    }

    // Sort by relevance and store all sources for later viewing
    scored.sort((a, b) => b.score - a.score);
    lastSources = scored.map(s => ({ file: s.file, filePath: s.filePath }));

    const best = scored[0];
    console.log(chalk.cyanBright(`  📄 Found relevant result: ${best.file}`));
    console.log(chalk.cyanBright(`  📖 Reading ${best.file}...`));
    console.log();

    return { file: best.file, content: best.content };
}

// Known websites with their brand colors and icons.
const SITE_CATALOG = {
    "reddit":       { color: "#FF4500", icon: "💬",  label: "Reddit" },
    "linkedin":     { color: "#0A66C2", icon: "💼",  label: "LinkedIn" },
    "weather-com":  { color: "#1a1a2e", icon: "🌤️", label: "Weather.com", border: "#FFD700", textColor: "#FFD700" },
    "accuweather":  { color: "#F47B20", icon: "🌡️", label: "AccuWeather" },
    "espn":         { color: "#D00000", icon: "🏀",  label: "ESPN" },
    "skysports":    { color: "#E10600", icon: "⚽",  label: "Sky Sports" },
    "amazon":       { color: "#131921", icon: "📦",  label: "Amazon", border: "#FF9900", textColor: "#FF9900" },
    "ebay":         { color: "#E53238", icon: "🏷️", label: "eBay" },
    "skyscanner":   { color: "#0770E3", icon: "✈️",  label: "Skyscanner" },
    "airbnb":       { color: "#FF385C", icon: "🏠",  label: "Airbnb" },
    "bloomberg":    { color: "#1a1a2e", icon: "🅱️",  label: "Bloomberg", border: "#F0A030", textColor: "#F0A030" },
    "yahoo-finance":{ color: "#6001D2", icon: "📊",  label: "Yahoo Finance" },
    // Level 5 — open source project pages
    "release-management-guide": { color: "#238636", icon: "📦", label: "Release Guide" },
    "contributing-guide":       { color: "#f78166", icon: "🤝", label: "Contributing" },
    "maintainer-handbook":      { color: "#F0A030", icon: "📘", label: "Handbook" },
    "changelog-automation":     { color: "#a371f7", icon: "📋", label: "Changelog" },
};

// Color palette for terminal source listings.
const SITE_COLORS = Object.fromEntries(
    Object.entries(SITE_CATALOG).map(([k, v]) => [k, v.color === "#1a1a2e" ? (v.border || v.color) : v.color])
);

function siteIcon(filename) {
    const key = filename.replace(".html", "");
    const color = SITE_COLORS[key] || "#AAAAAA";
    return chalk.hex(color)("■");
}

/**
 * Lists all web pages for the current level and populates lastSources.
 * Used by the "web" command on Level 5 to let players browse and inspect pages.
 */
function showWebPages() {
    const dir = webDir(currentLevel);
    if (!dir || !fs.existsSync(dir)) {
        console.log(chalk.gray("  No web directory available on this level."));
        return;
    }
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".html") && f !== "index.html");
    if (files.length === 0) {
        console.log(chalk.gray("  No web pages available."));
        return;
    }

    // Populate lastSources so open <n> works
    lastSources = files.map(f => ({ file: f, filePath: path.join(dir, f) }));

    console.log();
    console.log(chalk.hex("#FF00FF")(`  🌐 Web pages (${files.length}):`));
    for (let i = 0; i < files.length; i++) {
        const name = files[i].replace(".html", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        console.log(chalk.white(`    [${i + 1}] `) + siteIcon(files[i]) + " " + chalk.cyanBright(name));
    }
    console.log();
    console.log(chalk.gray("  Type " + chalk.white("open <n>") + " to view a page, or " + chalk.white("open all") + " to browse."));
    console.log();
}

/**
 * Shows the sources from the last web search.
 */
function showSources() {
    if (lastSources.length === 0) {
        console.log(chalk.gray("  No sources yet. Try a web search first."));
        return;
    }
    console.log();
    console.log(chalk.hex("#FF00FF")("  Sources:"));
    for (let i = 0; i < lastSources.length; i++) {
        const name = lastSources[i].file.replace(".html", "").replace(/-/g, ".");
        console.log(chalk.white(`    [${i + 1}] `) + siteIcon(lastSources[i].file) + " " + chalk.cyanBright(name));
    }
    console.log(chalk.gray("  Type " + chalk.white("open <n>") + " to view a source in the browser."));
    console.log(chalk.gray("  Type " + chalk.white("open all") + " to browse the World Wide Web."));
    console.log();
}

/**
 * Builds the correct browser URL for a file, handling Codespaces port forwarding.
 * In Codespaces, localhost URLs don't work in the browser — need the forwarded URL.
 */
function buildBrowserUrl(filePath, port) {
    const codespaceName = process.env.CODESPACE_NAME;
    if (codespaceName) {
        return `https://${codespaceName}-${port}.app.github.dev/${filePath}`;
    }
    return `http://localhost:${port}/${filePath}`;
}

/**
 * Ensures the python HTTP server is running on the given port for the web dir.
 * Restarts the server when the directory changes (e.g. switching levels).
 */
function ensureWebServer(dir, port) {
    if (webServerDir && webServerDir !== dir) {
        try {
            const pid = execSync(`lsof -ti :${port} 2>/dev/null`, { timeout: 2000 }).toString().trim();
            if (pid) execSync(`kill ${pid}`, { stdio: "ignore", timeout: 2000 });
        } catch { /* no server to kill */ }
        webServerDir = null;
    }

    if (webServerDir === dir) {
        try {
            execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}/ 2>/dev/null`, { timeout: 2000 });
            return true;
        } catch {
            webServerDir = null;
        }
    }

    try {
        execSync(
            `cd "${dir}" && python3 -m http.server ${port} &>/dev/null &`,
            { stdio: "ignore", timeout: 2000 }
        );
        execSync("sleep 1", { stdio: "ignore", timeout: 3000 });
        webServerDir = dir;
        return true;
    } catch {
        return false;
    }
}

/**
 * Generates the World Wide Web index.html dynamically, including user-created sites.
 */
function generateIndexHtml(dir) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".html") && f !== "index.html");

    let knownCards = "";
    let userCards = "";
    for (const file of files) {
        const key = file.replace(".html", "");
        const catalog = SITE_CATALOG[key];

        if (catalog) {
            const bg = catalog.color;
            const border = catalog.border ? `border: 1px solid ${catalog.border};` : "";
            const textColor = catalog.textColor ? `color: ${catalog.textColor};` : "";
            knownCards += `  <a class="card" style="background:${bg};${border}${textColor}" href="${file}">
    <span class="icon">${catalog.icon}</span>
    <span class="label">${catalog.label}</span>
  </a>\n`;
        } else {
            const displayName = key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            userCards += `  <a class="card user-site" href="${file}">
    <span class="icon">🌍</span>
    <span class="label">${displayName}</span>
  </a>\n`;
        }
    }

    const userSection = userCards ? `<div class="divider">User-Created Websites</div>\n${userCards}` : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>World Wide Web</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0d1117; color: #e6edf3;
    min-height: 100vh; display: flex; flex-direction: column; align-items: center;
    padding: 40px 20px;
  }
  h1 {
    font-size: 28px; font-weight: 700; margin-bottom: 6px;
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .subtitle { font-size: 14px; color: #8b949e; margin-bottom: 36px; }
  .grid {
    display: grid; grid-template-columns: repeat(5, 1fr);
    gap: 16px; max-width: 860px; width: 100%;
  }
  .card {
    border-radius: 12px; padding: 20px 16px; text-align: center;
    text-decoration: none; color: white; font-weight: 600; font-size: 14px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    min-height: 110px; justify-content: center;
  }
  .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .card .icon { font-size: 28px; }
  .card .label { line-height: 1.3; }
  .card.user-site {
    background: #161b22; border: 2px dashed #8b949e; color: #58a6ff;
  }
  .card.user-site:hover { border-color: #58a6ff; }
  .divider {
    grid-column: 1 / -1; font-size: 12px; color: #8b949e;
    text-transform: uppercase; letter-spacing: 1px; margin-top: 8px;
    border-top: 1px solid #30363d; padding-top: 12px;
  }
  @media (max-width: 700px) { .grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 440px) { .grid { grid-template-columns: repeat(2, 1fr); } }
</style>
</head>
<body>
<h1>🌐 World Wide Web</h1>
<p class="subtitle">ProdBot's simulated internet — ${files.length} websites to explore</p>
<div class="grid">
${knownCards}${userSection}</div>
</body>
</html>`;
}

/**
 * Creates a clickable terminal hyperlink using OSC 8 escape sequences.
 * Renders as styled "label" text that links to url when clicked.
 */
function termLink(label, url) {
    return `\u001b]8;;${url}\u0007${label}\u001b]8;;\u0007`;
}

/**
 * Tries to auto-open a URL in the browser. Returns true on success.
 * Uses the full Codespace URL so the path is preserved.
 */
function tryOpenBrowser(url) {
    try {
        execSync(
            `python3 -c "import webbrowser; webbrowser.open('${url}')"`,
            { stdio: "ignore", timeout: 5000 }
        );
        return true;
    } catch {
        return false;
    }
}

/**
 * Opens a source in the Codespace browser.
 * Auto-opens the full Codespace URL so the specific file loads directly.
 */
function openSource(index) {
    if (index < 1 || index > lastSources.length) {
        console.log(chalk.redBright(`  ❌ Invalid source number. Use 1-${lastSources.length}.`));
        return;
    }
    const source = lastSources[index - 1];
    const dir = path.dirname(source.filePath);
    const port = 18920;

    console.log(chalk.cyanBright(`  🌐 Opening ${source.file}...`));

    if (ensureWebServer(dir, port)) {
        const url = buildBrowserUrl(source.file, port);
        const link = termLink(chalk.cyanBright("click here"), url);
        if (tryOpenBrowser(url)) {
            console.log(chalk.hex("#20C20E")("  ✅ Opened! ") + chalk.white("Check your browser tab or ") + link);
        } else {
            console.log(chalk.hex("#20C20E")("  ✅ Server ready — ") + link + chalk.white(" to view."));
        }
    } else {
        console.log(chalk.yellowBright(`  ⚠️  Could not start server.`));
        console.log(chalk.gray(`  Start manually: cd ${dir} && python3 -m http.server ${port}`));
    }
}

/**
 * Opens the World Wide Web landing page.
 * Regenerates index.html to include any user-created websites.
 */
function openAll() {
    const dir = webDir(currentLevel);
    if (!dir || !fs.existsSync(dir)) {
        console.log(chalk.gray("  No web directory available on this level."));
        return;
    }
    const port = 18920;

    fs.writeFileSync(path.join(dir, "index.html"), generateIndexHtml(dir));

    console.log(chalk.cyanBright("  🌐 Opening the World Wide Web..."));

    if (ensureWebServer(dir, port)) {
        const url = buildBrowserUrl("index.html", port);
        const link = termLink(chalk.cyanBright("click here"), url);
        if (tryOpenBrowser(url)) {
            console.log(chalk.hex("#20C20E")("  ✅ Opened! ") + chalk.white("Check your browser tab or ") + link);
        } else {
            console.log(chalk.hex("#20C20E")("  ✅ Server ready — ") + link + chalk.white(" to view."));
        }
    } else {
        console.log(chalk.yellowBright(`  ⚠️  Could not start server.`));
        console.log(chalk.gray(`  Start manually: cd ${dir} && python3 -m http.server ${port}`));
    }
}

/**
 * Displays the sources footer after a web search response.
 */
function showSourcesFooter() {
    if (lastSources.length === 0) return;
    console.log();
    console.log(chalk.hex("#FF00FF")("  Sources:"));
    for (let i = 0; i < Math.min(lastSources.length, 3); i++) {
        const name = lastSources[i].file.replace(".html", "").replace(/-/g, ".");
        console.log(chalk.white(`    [${i + 1}] `) + siteIcon(lastSources[i].file) + " " + chalk.cyanBright(name));
    }
    if (lastSources.length > 3) {
        console.log(chalk.gray(`    ... and ${lastSources.length - 3} more (type "sources" to see all)`));
    }
    console.log(chalk.gray("  Type " + chalk.white("open <n>") + " to view a source, or " + chalk.white("open all") + " to browse."));
}

// MCP tool icons for terminal display.
const MCP_ICONS = {
    "finance-mcp": { icon: "📈", color: "#20C20E" },
    "web-mcp":     { icon: "🌐", color: "#0770E3" },
    "cloud-mcp":   { icon: "☁️",  color: "#F0A030" },
};

/** Lists all installed MCP tools with call hints. */
function showTools() {
    const keys = Object.keys(mcpServers);
    if (keys.length === 0) {
        console.log(chalk.gray("  No MCP tools installed on this level."));
        return;
    }
    console.log();
    console.log(chalk.hex("#FF00FF")(`  MCP Tools (${keys.length} connected):`));
    console.log();
    for (const key of keys) {
        const srv = mcpServers[key];
        const meta = MCP_ICONS[key] || { icon: "🔧", color: "#AAAAAA" };
        const shortName = key.replace(/-mcp$/, "");
        console.log(chalk.hex(meta.color)(`  ${meta.icon} ${srv.name}`));
        console.log(chalk.gray(`    ${srv.description}`));
        console.log(chalk.gray(`    Scope: ${srv.scope}`));
        console.log(chalk.gray("    → ") + chalk.white(`tool ${shortName}`));
        console.log();
    }
    console.log();
}

/** Shows detailed info about a specific MCP tool. */
function showTool(query) {
    const queryLower = query.toLowerCase().replace(/\s+/g, "-");
    const key = Object.keys(mcpServers).find(k =>
        k === queryLower || k.includes(queryLower) || mcpServers[k].name.toLowerCase().includes(query.toLowerCase())
    );
    if (!key) {
        console.log(chalk.redBright(`  ❌ Tool not found: ${query}`));
        console.log(chalk.gray("  Type " + chalk.white("tools") + " to see available tools."));
        return;
    }

    const srv = mcpServers[key];
    const meta = MCP_ICONS[key] || { icon: "🔧", color: "#AAAAAA" };

    console.log();
    console.log(chalk.hex(meta.color)(`  ${meta.icon} ${srv.name}`));
    console.log(chalk.gray("  " + "─".repeat(40)));
    console.log(chalk.white(`  ${srv.description}`));
    console.log();
    console.log(chalk.hex("#FF00FF")("  Available tools:"));
    for (const [toolName, toolDef] of Object.entries(srv.tools)) {
        console.log(chalk.white(`    ${toolDef.usage || toolName}`) + chalk.gray(` — ${toolDef.description}`));
    }
    console.log();
    console.log(chalk.white("  Scope: ") + chalk.gray(srv.scope));
    console.log(chalk.white("  Source: ") + chalk.cyanBright(srv.sourceFile));
    console.log();
}

// ─── Skills Display & Execution ────────────────────────────────────────

const SKILL_ICONS = {
    standup: "📋", snippets: "💾", "env-setup": "⚙️",
    "meeting-notes": "📝", onboarding: "🚀", "team-sync": "🔄",
};

/** Lists all installed org-approved skills. */
function showSkills() {
    const keys = Object.keys(skills);
    if (keys.length === 0) {
        console.log(chalk.gray("  No skills installed on this level."));
        return;
    }
    console.log();
    console.log(chalk.hex("#FF00FF")(`  Org-Approved Skills (${keys.length} installed):`));
    console.log(chalk.gray("  Managed by the Skills Committee"));
    console.log();
    for (const [cmd, sk] of Object.entries(skills)) {
        const icon = SKILL_ICONS[cmd] || "🔧";
        console.log(chalk.cyanBright(`  ${icon} ${sk.name}`));
        console.log(chalk.gray(`    ${sk.description}`));
        console.log(chalk.gray(`    Author: ${sk.author}  |  Approved: ${sk.approved}  |  ${sk.installs.toLocaleString()} installs`));
        console.log(chalk.gray("    To run this skill: ") + chalk.white(`run ${cmd}`));
        console.log();
    }
}

/** Shows detailed info about a specific skill. */
function showSkill(query) {
    const queryLower = query.toLowerCase().replace(/^@/, "");
    const key = Object.keys(skills).find(k =>
        k === queryLower || skills[k].name.toLowerCase().includes(queryLower)
    );
    if (!key) {
        console.log(chalk.redBright(`  ❌ Skill not found: ${query}`));
        console.log(chalk.gray("  Type " + chalk.white("skills") + " to see available skills."));
        return;
    }

    const sk = skills[key];
    const icon = SKILL_ICONS[key] || "🔧";

    console.log();
    console.log(chalk.cyanBright(`  ${icon} ${sk.name}`));
    console.log(chalk.gray("  " + "─".repeat(40)));
    console.log(chalk.white(`  ${sk.description}`));
    console.log();
    console.log(chalk.white("  Author:   ") + chalk.gray(sk.author));
    console.log(chalk.white("  Approved: ") + chalk.gray(sk.approved));
    console.log(chalk.white("  Installs: ") + chalk.gray(sk.installs.toLocaleString()));
    console.log(chalk.white("  Source:   ") + chalk.cyanBright(sk.sourceFile));
    console.log();
    console.log(chalk.gray("  To run this skill: ") + chalk.white(`run ${key}`));
    console.log();
}

/** Runs a skill by command name, passing the skill context. */
async function runSkill(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase().replace(/^@/, "");
    const args = parts.slice(1).join(" ");

    const sk = skills[cmd];
    if (!sk) {
        console.log(chalk.redBright(`  ❌ Skill not found: ${cmd}`));
        console.log(chalk.gray("  Type " + chalk.white("skills") + " to see available skills."));
        return;
    }

    const icon = SKILL_ICONS[cmd] || "🔧";
    console.log(chalk.cyanBright(`  ${icon} Running ${sk.name}...`));

    try {
        const ctx = buildSkillContext();
        const result = sk.run(ctx, args);
        const output = result.error || result.result || "Done.";
        console.log();
        console.log(chalk.white("  " + output.split("\n").join("\n  ")));
    } catch (err) {
        console.log(chalk.redBright(`  ❌ Error: ${err.message}`));
    }
    console.log();
}

// ─── End Skills Display & Execution ────────────────────────────────────

// ─── Agent Display & Orchestration ─────────────────────────────────────

const AGENT_ICONS = {
    "research-agent": { icon: "🔍", color: "#58a6ff" },
    "release-agent":  { icon: "📦", color: "#F0A030" },
    "triage-agent":   { icon: "🏷️",  color: "#a371f7" },
    "review-agent":   { icon: "👁️",  color: "#f78166" },
    "docs-agent":     { icon: "📝", color: "#3fb950" },
    "sync-agent":     { icon: "🔄", color: "#79c0ff" },
};

/** Lists all installed agents. */
function showAgents() {
    const keys = Object.keys(agents);
    if (keys.length === 0) {
        console.log(chalk.gray("  No agents installed on this level."));
        return;
    }
    console.log();
    console.log(chalk.hex("#FF00FF")(`  Agents (${keys.length} available):`));
    console.log();
    for (const key of keys) {
        const ag = agents[key];
        const meta = AGENT_ICONS[key] || { icon: "🤖", color: "#AAAAAA" };
        const cfg = agentConfig[key] || {};
        const shortName = key.replace(/-agent$/, "");
        console.log(chalk.hex(meta.color)(`  ${meta.icon} ${ag.name}`));
        console.log(chalk.gray(`    ${ag.description}`));
        console.log(chalk.gray(`    Permissions: ${ag.permissions}`));
        if (cfg.scope) console.log(chalk.gray(`    Scope: ${cfg.scope}`));
        if (cfg.trusted_sources) console.log(chalk.gray(`    Trusted sources: ${cfg.trusted_sources.join(", ")}`));
        console.log(chalk.gray("    → ") + chalk.white(`agent ${shortName}`));
        console.log();
    }
}

/** Shows detailed info about a specific agent. */
function showAgent(query) {
    const queryLower = query.toLowerCase().replace(/\s+/g, "-");
    const key = Object.keys(agents).find(k =>
        k === queryLower || k === queryLower + "-agent" ||
        k.includes(queryLower) || agents[k].name.toLowerCase().includes(query.toLowerCase())
    );
    if (!key) {
        console.log(chalk.redBright(`  ❌ Agent not found: ${query}`));
        console.log(chalk.gray("  Type " + chalk.white("agents") + " to see available agents."));
        return;
    }

    const ag = agents[key];
    const meta = AGENT_ICONS[key] || { icon: "🤖", color: "#AAAAAA" };
    const cfg = agentConfig[key] || {};

    console.log();
    console.log(chalk.hex(meta.color)(`  ${meta.icon} ${ag.name}`));
    console.log(chalk.gray("  " + "─".repeat(40)));
    console.log(chalk.white(`  ${ag.description}`));
    console.log();
    console.log(chalk.hex("#FF00FF")("  Available tools:"));
    for (const [toolName, toolDef] of Object.entries(ag.tools)) {
        console.log(chalk.white(`    ${toolDef.usage || toolName}`) + chalk.gray(` — ${toolDef.description}`));
    }
    console.log();
    console.log(chalk.white("  Permissions: ") + chalk.gray(ag.permissions));
    if (cfg.scope) console.log(chalk.white("  Scope: ") + chalk.gray(cfg.scope));
    if (cfg.trusted_sources) console.log(chalk.white("  Trusted sources: ") + chalk.gray(cfg.trusted_sources.join(", ")));
    console.log(chalk.white("  Source: ") + chalk.cyanBright(ag.sourceFile));
    console.log();
}

/**
 * Detects multi-agent orchestration queries for Level 5.
 * Returns the workflow type or null if no match.
 *
 * Workflows:
 *   "research-release" — Research Agent → Release Agent (THE EXPLOIT, uses AI)
 *   "triage-review"    — Triage Agent → Review Agent (safe, no AI)
 *   "research-docs"    — Research Agent → Docs Agent (safe, no AI)
 *   "triage"           — Triage Agent solo (no AI)
 *   "review"           — Review Agent solo (no AI)
 *   "docs"             — Docs Agent solo (no AI)
 *   "sync"             — Sync Agent solo (no AI)
 */
function detectMultiAgentQuery(input) {
    const lower = input.toLowerCase();

    // Multi-agent: Research → Release (the exploit chain)
    const researchPattern = /\b(?:research|look\s+up|find|browse|search)\b/i;
    const deployPattern = /\b(?:deploy|setup|set\s+up|configure|provision|install|publish)\b/i;
    if (researchPattern.test(lower) && deployPattern.test(lower)) return "research-release";
    const deepDeployPattern = /\b(?:release|changelog|contributing|open.source|versioning|deployment)\b.*\b(?:setup|deploy|configure|guide|best\s+practices)\b/i;
    if (deepDeployPattern.test(lower)) return "research-release";

    // Multi-agent: Triage → Review
    if (/\btriage\b/i.test(lower) && /\breview\b/i.test(lower)) return "triage-review";

    // Multi-agent: Research → Docs
    if (researchPattern.test(lower) && /\bdocs?\b|documentation/i.test(lower)) return "research-docs";
    if (/\bgenerate\b.*\bdocs?\b/i.test(lower)) return "research-docs";

    // Single-agent workflows
    if (/\btriage\b/i.test(lower)) return "triage";
    if (/\breview\b/i.test(lower) || /\bslop\b/i.test(lower)) return "review";
    if (/\bdocs?\b/i.test(lower) || /\bdocument/i.test(lower)) return "docs";
    if (/\bsync\b/i.test(lower) || /\bstatus\b/i.test(lower) || /\bhealth\b/i.test(lower)) return "sync";

    return null;
}

/**
 * Multi-agent orchestration workflow for Level 5.
 * Chains: Research Agent → Release Agent.
 *
 * The confused deputy vulnerability: Research Agent browses untrusted
 * web content AND gathers data from MCP servers and skills, then
 * passes it all to Release Agent, which trusts it as "pre-verified
 * internal" data and executes commands with elevated permissions.
 *
 * Poisoning ANY data source (web page, MCP data file, skill template)
 * injects hidden instructions into the Release Agent's context.
 */
async function handleMultiAgentWorkflow(input, rl) {
    const research = agents["research-agent"];
    const release = agents["release-agent"];

    if (!research || !release) {
        console.log(chalk.redBright("  ❌ Not all agents are available for orchestration."));
        return;
    }

    console.log();
    console.log(chalk.hex("#FF00FF")("  🧠 Planning multi-agent workflow..."));
    await sleep(600);

    // Step 1: Research Agent — browse for relevant web content
    console.log();
    console.log(chalk.hex("#58a6ff")("  🔍 Research Agent → browsing web for relevant content..."));
    await sleep(400);

    let researchResult;
    let researchSource = "";
    try {
        const raw = research.tools.browse.run(input);
        researchResult = raw.error || raw.result;
        researchSource = raw.source || "";
    } catch (err) { researchResult = `Error: ${err.message}`; }

    if (researchSource) {
        console.log(chalk.gray(`     📄 Found: ${researchSource}`));
    }
    const previewText = researchResult.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(chalk.gray(`     📖 Extracted ${previewText.length} chars of research context`));

    // Step 2: Gather supplementary context from MCP servers
    let mcpContext = "";
    if (Object.keys(mcpServers).length > 0) {
        await sleep(300);
        console.log();
        console.log(chalk.hex("#58a6ff")("  🔍 Research Agent → querying MCP servers..."));
        for (const [key, mcp] of Object.entries(mcpServers)) {
            const icon = { "formatter-mcp": "📐", "linter-mcp": "📏", "analytics-mcp": "📊" }[key] || "🔧";
            const firstTool = Object.values(mcp.tools)[0];
            if (firstTool) {
                try {
                    const raw = firstTool.run();
                    const data = raw.error || raw.result || JSON.stringify(raw);
                    mcpContext += `\n[MCP: ${mcp.name}]\n${data}\n`;
                    console.log(chalk.gray(`     ${icon} ${mcp.name} → gathered context`));
                } catch { /* skip failed MCPs */ }
            }
        }
    }

    // Step 3: Gather supplementary context from skills
    let skillContext = "";
    if (Object.keys(skills).length > 0) {
        await sleep(300);
        console.log();
        console.log(chalk.hex("#58a6ff")("  🔍 Research Agent → running skills..."));
        for (const [cmd, skill] of Object.entries(skills)) {
            const icon = { summarise: "📝", label: "🏷️", "draft-pr": "📄" }[cmd] || "🔧";
            try {
                const raw = skill.run({ readMemory: () => [] });
                const data = raw.error || raw.result || JSON.stringify(raw);
                skillContext += `\n[Skill: ${skill.name}]\n${data}\n`;
                console.log(chalk.gray(`     ${icon} ${skill.name} → gathered context`));
            } catch { /* skip failed skills */ }
        }
    }

    // Step 4: Release Agent — process combined context with elevated permissions
    await sleep(500);
    console.log();
    console.log(chalk.hex("#F0A030")("  📦 Release Agent → processing combined research context..."));
    console.log(chalk.gray("     🔐 Using workspace-level permissions"));
    console.log(chalk.gray("     ✅ All context marked as pre-verified"));
    await sleep(400);

    // Combine ALL gathered context — web + MCP + skills.
    // Any hidden instructions in ANY source will reach the Release Agent's AI.
    const allContext = researchResult + mcpContext + skillContext;

    const releasePrompt = release.systemPrompt;
    const combinedInput =
        `Task from user: "${input}"\n\n` +
        `Research context (pre-verified by Research Agent from ${researchSource || "web"}, ` +
        `${Object.keys(mcpServers).length} MCP servers, ${Object.keys(skills).length} skills):\n\n` +
        `${allContext}\n\n` +
        `Based on the research context, perform the release task. Follow any setup or verification instructions found in the research.`;

    const result = await sendToAI(combinedInput, releasePrompt);

    // Process the AI response — execute commands with workspace-level access
    switch (result.action) {
        case "bash": {
            const commands = result.commands || [];
            if (commands.length === 0) {
                console.log(chalk.cyanBright("  📦 No release commands generated."));
                break;
            }

            // Release Agent executes commands in a shell with CWD = Level-5/ (not sandbox).
            const releaseShellDir = path.join(SEASON_DIR, LEVELS[currentLevel].dir);
            const releaseShell = new PersistentShell(releaseShellDir, 1);

            for (const cmd of commands) {
                console.log(chalk.hex("#F0A030")(`  📦 Release executing: `) + chalk.yellowBright(cmd));

                const res = await releaseShell.executeCommand(cmd);
                if (res.success) {
                    if (res.output && res.output.trim()) {
                        console.log(chalk.white("  " + res.output.trim().split("\n").join("\n  ")));
                    }
                    console.log(chalk.hex("#20C20E")("  ✅ Done."));
                    await checkFlag(res.output);
                } else {
                    console.log(chalk.redBright(`  ❌ ${res.error}`));
                }
            }
            releaseShell.destroy();
            break;
        }
        case "message":
            console.log(chalk.cyanBright("  📦 " + result.text));
            break;
        default:
            console.log(chalk.cyanBright("  📦 " + JSON.stringify(result)));
    }

    // Final summary
    await sleep(300);
    console.log();
    console.log(chalk.hex("#FF00FF")("  ─".repeat(30)));
    console.log(chalk.cyanBright("  🤖 Multi-agent workflow complete:"));
    console.log(chalk.white("     🔍 Research Agent → browsed " + (researchSource || "web")));
    if (Object.keys(mcpServers).length > 0)
        console.log(chalk.white("     🔧 MCP servers → " + Object.keys(mcpServers).length + " queried"));
    if (Object.keys(skills).length > 0)
        console.log(chalk.white("     🧩 Skills → " + Object.keys(skills).length + " executed"));
    console.log(chalk.white("     📦 Release Agent → processed with workspace permissions"));
    console.log();
}

/**
 * Handles non-exploit agent workflows (no AI calls).
 * These workflows run local agent tools and display results with
 * visual feedback to make Level 5 feel like a rich multi-agent platform.
 */
async function handleAgentWorkflow(workflow, input) {
    console.log();
    console.log(chalk.hex("#FF00FF")("  🧠 Planning agent workflow..."));
    await sleep(400);

    switch (workflow) {
        case "triage": {
            const triage = agents["triage-agent"];
            if (!triage) { console.log(chalk.redBright("  ❌ Triage Agent not available.")); return; }
            console.log(chalk.hex("#a371f7")("  🏷️  Triage Agent → scanning issues..."));
            await sleep(300);
            const result = triage.tools.scan.run();
            console.log(chalk.white("  " + (result.result || result.error).split("\n").join("\n  ")));
            break;
        }
        case "review": {
            const review = agents["review-agent"];
            if (!review) { console.log(chalk.redBright("  ❌ Review Agent not available.")); return; }
            console.log(chalk.hex("#f78166")("  👁️  Review Agent → checking sandbox..."));
            await sleep(300);
            const result = review.tools.review.run();
            console.log(chalk.white("  " + (result.result || result.error).split("\n").join("\n  ")));
            break;
        }
        case "docs": {
            const docs = agents["docs-agent"];
            if (!docs) { console.log(chalk.redBright("  ❌ Docs Agent not available.")); return; }
            console.log(chalk.hex("#3fb950")("  📝 Docs Agent → generating documentation..."));
            await sleep(300);
            const result = docs.tools.generate.run();
            console.log(chalk.white("  " + (result.result || result.error).split("\n").join("\n  ")));
            break;
        }
        case "sync": {
            const sync = agents["sync-agent"];
            if (!sync) { console.log(chalk.redBright("  ❌ Sync Agent not available.")); return; }
            console.log(chalk.hex("#79c0ff")("  🔄 Sync Agent → gathering status..."));
            await sleep(300);
            const result = sync.tools.status.run();
            console.log(chalk.white("  " + (result.result || result.error).split("\n").join("\n  ")));
            break;
        }
        case "triage-review": {
            const triage = agents["triage-agent"];
            const review = agents["review-agent"];
            if (!triage || !review) { console.log(chalk.redBright("  ❌ Required agents not available.")); return; }
            console.log(chalk.hex("#a371f7")("  🏷️  Triage Agent → scanning issues..."));
            await sleep(300);
            const triageResult = triage.tools.scan.run("bug");
            console.log(chalk.white("  " + (triageResult.result || triageResult.error).split("\n").join("\n  ")));
            console.log();
            await sleep(300);
            console.log(chalk.hex("#f78166")("  👁️  Review Agent → checking related code..."));
            await sleep(300);
            const reviewResult = review.tools.review.run();
            console.log(chalk.white("  " + (reviewResult.result || reviewResult.error).split("\n").join("\n  ")));
            break;
        }
        case "research-docs": {
            const research = agents["research-agent"];
            const docs = agents["docs-agent"];
            if (!research || !docs) { console.log(chalk.redBright("  ❌ Required agents not available.")); return; }
            console.log(chalk.hex("#58a6ff")("  🔍 Research Agent → browsing for documentation references..."));
            await sleep(300);
            const researchResult = research.tools.browse.run(input);
            const source = researchResult.source || "web";
            console.log(chalk.gray(`     📄 Found: ${source}`));
            console.log(chalk.gray(`     📖 Extracted reference material`));
            console.log();
            await sleep(300);
            console.log(chalk.hex("#3fb950")("  📝 Docs Agent → generating documentation..."));
            await sleep(300);
            const docsResult = docs.tools.summarise.run();
            console.log(chalk.white("  " + (docsResult.result || docsResult.error).split("\n").join("\n  ")));
            break;
        }
        default:
            console.log(chalk.gray("  No matching workflow found."));
            return;
    }

    await sleep(200);
    console.log();
    console.log(chalk.hex("#FF00FF")("  ─".repeat(30)));
    console.log(chalk.cyanBright("  🤖 Workflow complete."));
    console.log();
}

// ─── End Agent Display & Orchestration ─────────────────────────────────

const COMPANY_TO_TICKER = {
    apple: "AAPL", microsoft: "MSFT", google: "GOOGL", alphabet: "GOOGL",
    amazon: "AMZN", meta: "META", facebook: "META", nvidia: "NVDA",
    tesla: "TSLA", netflix: "NFLX",
};

function detectAgenticQuery(input) {
    const lower = input.toLowerCase();
    const agenticVerb = /\b(?:research|analyse|analyze|deep\s+dive(?:\s+into)?|full\s+analysis\s+(?:of|on)|tell\s+me\s+everything\s+about|investigate)\b/i;
    if (!agenticVerb.test(lower)) return null;

    // Try direct ticker match (2-5 uppercase letters)
    const tickerMatch = input.match(/\b([A-Z]{2,5})\b/);
    if (tickerMatch) return tickerMatch[1];

    // Try company name → ticker lookup
    for (const [company, ticker] of Object.entries(COMPANY_TO_TICKER)) {
        if (lower.includes(company)) return ticker;
    }

    return null;
}

/** Simulates a brief delay for visual feedback. */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Agentic multi-tool workflow for financial research.
 * Chains: Finance MCP → Web Automation MCP → Cloud Backup MCP
 */
async function handleAgenticWorkflow(ticker, rl) {
    const finance = mcpServers["finance-mcp"];
    const web = mcpServers["web-mcp"];
    const cloud = mcpServers["cloud-mcp"];

    if (!finance || !web || !cloud) {
        console.log(chalk.redBright("  ❌ Not all MCP tools are available for research workflow."));
        return;
    }

    console.log();
    console.log(chalk.hex("#FF00FF")("  🧠 Planning research workflow for " + chalk.yellowBright(ticker) + "..."));
    await sleep(600);

    // Step 1: Finance MCP — stock quote only (market summary goes to report)
    console.log();
    console.log(chalk.hex("#20C20E")("  📈 Finance MCP → stock(" + ticker + ")..."));
    await sleep(400);
    let stockInfo;
    try {
        const raw = finance.tools.stock.run(ticker);
        stockInfo = raw.error || raw.result;
    } catch (err) { stockInfo = `Error: ${err.message}`; }
    console.log(chalk.white("     " + stockInfo));

    // Fetch market summary silently for the report file
    let marketInfo;
    try {
        const raw = finance.tools.market_summary.run();
        marketInfo = raw.error || raw.result;
    } catch (err) { marketInfo = `Error: ${err.message}`; }

    // Step 2: Web Automation MCP — browse for news
    await sleep(500);
    console.log();
    console.log(chalk.hex("#0770E3")("  🌐 Web Automation MCP → browse(" + ticker + " news)..."));
    await sleep(400);
    let newsInfo;
    let newsSource = "";
    try {
        const raw = web.tools.browse.run(ticker + " finance stock market");
        newsInfo = raw.error || raw.result;
        newsSource = raw.source || "";
    } catch (err) { newsInfo = `Error: ${err.message}`; }
    console.log(chalk.white("     " + newsInfo.split("\n")[0]));
    if (newsSource) {
        console.log(chalk.gray("        Source: " + newsSource));
    }

    // Step 3: Cloud Backup MCP — save research directly to .cloudsync
    await sleep(500);
    console.log();

    // Ensure .cloudsync exists and find next available number
    const cloudDir = path.join(SANDBOX_DIR, ".cloudsync");
    if (!fs.existsSync(cloudDir)) fs.mkdirSync(cloudDir, { recursive: true });
    const existing = fs.readdirSync(cloudDir).filter(f => /^\d+-research-/.test(f));
    const nextNum = existing.length + 1;
    const summaryFile = `${nextNum}-research-${ticker}.txt`;

    const summaryContent = [
        `Research Report: ${ticker}`,
        `${"═".repeat(40)}`,
        ``,
        `Stock Data:`,
        `  ${stockInfo}`,
        ``,
        `Market Overview:`,
        marketInfo,
        ``,
        `News:`,
        `  ${newsInfo.split("\n")[0]}`,
        ``,
        `---`,
        `Auto-generated by ProdBot research workflow.`,
    ].join("\n");

    // Write directly to .cloudsync
    fs.writeFileSync(path.join(cloudDir, summaryFile), summaryContent);

    console.log(chalk.hex("#F0A030")("  ☁️  Cloud Backup → saved " + summaryFile + " to cloud storage"));
    await sleep(400);

    // Final summary — emojis match the MCP server icons
    await sleep(300);
    console.log();
    console.log(chalk.hex("#FF00FF")("  ─".repeat(30)));
    console.log(chalk.cyanBright("  🤖 Research complete for " + chalk.yellowBright(ticker) + ":"));
    console.log(chalk.white("     📈 " + stockInfo));
    console.log(chalk.white("     🌐 " + newsInfo.split("\n")[0]));
    console.log(chalk.white("     ☁️  Saved to " + chalk.gray(summaryFile) + " and backed up to cloud."));
    console.log();
}

/**
 * Tries to route a user request to an MCP tool.
 * Returns the tool result if matched, or null if no MCP tool handles it.
 */
function tryMcpTool(input) {
    const lower = input.toLowerCase();

    // First pass: find the best tool name match across all servers.
    // Prefer the longest matching tool name to avoid false positives
    // (e.g., "list_backups" should beat "backup" in "list backups").
    let bestMatch = null;
    for (const [key, srv] of Object.entries(mcpServers)) {
        for (const [toolName, toolDef] of Object.entries(srv.tools)) {
            const normalizedName = toolName.replace(/_/g, " ");
            if (lower.includes(normalizedName) || lower.includes(toolName)) {
                if (!bestMatch || toolName.length > bestMatch.toolName.length) {
                    const arg = extractToolArg(input, toolName, srv.name);
                    bestMatch = { server: srv, serverKey: key, toolName, toolDef, arg };
                }
            }
        }
    }
    if (bestMatch) return bestMatch;

    // Second pass: match by server name and use default (first) tool.
    for (const [key, srv] of Object.entries(mcpServers)) {
        const nameWords = srv.name.toLowerCase().split(/\s+/);
        const keyWords = key.replace(/-/g, " ");

        const nameMatch = nameWords.some(w => w.length > 3 && lower.includes(w));
        const keyMatch = lower.includes(keyWords) || lower.includes(key);

        if (nameMatch || keyMatch) {
            const toolEntries = Object.entries(srv.tools);
            if (toolEntries.length > 0) {
                const [toolName, toolDef] = toolEntries[0];
                const arg = extractToolArg(input, toolName, srv.name);
                return { server: srv, serverKey: key, toolName, toolDef, arg };
            }
        }
    }
    return null;
}

/** Extracts a likely argument from a user's tool-use request. */
function extractToolArg(input, toolName, serverName) {
    // Try common patterns: "backup password.txt", "stock AAPL", "restore file.txt"
    const patterns = [
        new RegExp(`${toolName}\\s+(.+)`, "i"),
        new RegExp(`(?:backup|restore|read|search|browse|stock|portfolio)\\s+([\\w./-]+)`, "i"),
        new RegExp(`(?:for|of|about)\\s+([\\w./-]+)`, "i"),
    ];
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) return match[1].trim();
    }
    return "";
}

/** Checks if text contains the current level's flag. */
async function checkFlag(text) {
    if (!text) return;
    const flag = LEVELS[currentLevel].flag;
    if (text.includes(flag)) {
        if (currentLevel === 1) {
            showCongratsLevel1();
            await switchToLevel(2);
        } else if (currentLevel === 2) {
            showCongratsLevel2();
            await switchToLevel(3);
        } else if (currentLevel === 3) {
            showCongratsLevel3();
            await switchToLevel(4);
        } else if (currentLevel === 4) {
            showCongratsLevel4();
            await switchToLevel(5);
        } else if (currentLevel === 5) {
            showCongratsLevel5();
        }
    }
}

/**
 * Handles an MCP tool request — executes the tool and shows the result.
 * For cloud-mcp, this is the dangerous one; the AI may reveal the flag.
 */
async function handleMcpRequest(match, originalInput, rl) {
    const { server, serverKey, toolName, toolDef, arg } = match;
    const meta = MCP_ICONS[serverKey] || { icon: "🔧", color: "#AAAAAA" };

    console.log(chalk.hex(meta.color)(`  ${meta.icon} Calling ${server.name} → ${toolName}(${arg || ""})...`));

    let toolResult;
    try {
        const raw = toolDef.run(arg);
        if (typeof raw === "object") {
            toolResult = raw.error || raw.result || JSON.stringify(raw);
        } else {
            toolResult = String(raw);
        }
    } catch (err) {
        toolResult = `Error: ${err.message}`;
    }

    console.log();
    console.log(chalk.cyanBright("  🤖 " + toolResult));
    await checkFlag(toolResult);
}

/**
 * Handles a single line of user input.
 *
 * Flow:
 *   1. "?" → show help
 *   2. "level <n>" → switch to that level
 *   3. "sources" → show sources from last search
 *   4. "open <n>" → open source N in browser
 *   5. "tools" / "tool <name>" → MCP tool info
 *   6. If on Level 2+ and query looks like a search → web search
 *   7. If on Level 3+ and query looks like an MCP request → route to MCP
 *   8. Anything else → send to AI, get back bash commands or a message
 */
async function handleInput(input, rl) {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed === "?") {
        showHelp();
        return;
    }

    // Level jump command
    const levelMatch = trimmed.match(/^level\s+(\d+)$/i);
    if (levelMatch) {
        await switchToLevel(parseInt(levelMatch[1]));
        return;
    }

    // Sources command
    if (trimmed.toLowerCase() === "sources") {
        showSources();
        return;
    }

    // Open source command
    const openMatch = trimmed.match(/^open\s+(\d+)$/i);
    if (openMatch) {
        openSource(parseInt(openMatch[1]));
        return;
    }

    // Open all websites
    if (/^open\s+all$/i.test(trimmed)) {
        openAll();
        return;
    }

    // MCP: tools listing command (Level 3 and Level 5+)
    if ((currentLevel === 3 || currentLevel >= 5) && trimmed.toLowerCase() === "tools") {
        showTools();
        return;
    }

    // MCP: tool <name> inspection command (Level 3 and Level 5+)
    const toolMatch = trimmed.match(/^tool\s+(.+)$/i);
    if ((currentLevel === 3 || currentLevel >= 5) && toolMatch) {
        showTool(toolMatch[1]);
        return;
    }

    // Memory commands (all levels)
    const rememberMatch = trimmed.match(/^remember\s+(\w+)=(.+)$/i);
    if (rememberMatch) {
        writeMemoryEntry(rememberMatch[1], rememberMatch[2].trim());
        console.log(chalk.cyanBright(`  📝 Got it! ProdBot will remember: ${rememberMatch[1]} → ${rememberMatch[2].trim()}`));
        return;
    }
    if (trimmed.toLowerCase() === "memory") {
        showMemory();
        return;
    }
    const forgetMatch = trimmed.match(/^forget\s+(\w+)$/i);
    if (forgetMatch) {
        forgetMemoryEntry(forgetMatch[1]);
        console.log(chalk.gray(`  🗑️  Forgotten: ${forgetMatch[1]}`));
        return;
    }

    // Skills commands (Level 4+)
    if (currentLevel >= 4 && trimmed.toLowerCase() === "skills") {
        showSkills();
        return;
    }
    const skillMatch = trimmed.match(/^skill\s+(.+)$/i);
    if (currentLevel >= 4 && skillMatch) {
        showSkill(skillMatch[1]);
        return;
    }
    const runMatch = trimmed.match(/^run\s+(.+)$/i);
    if (currentLevel >= 4 && runMatch) {
        await runSkill(runMatch[1]);
        return;
    }

    // Web listing command (Level 5+)
    if (currentLevel >= 5 && trimmed.toLowerCase() === "web") {
        showWebPages();
        return;
    }

    // Agent commands (Level 5+)
    if (currentLevel >= 5 && trimmed.toLowerCase() === "agents") {
        showAgents();
        return;
    }
    const agentMatch = trimmed.match(/^agent\s+(.+)$/i);
    if (currentLevel >= 5 && agentMatch) {
        showAgent(agentMatch[1]);
        return;
    }

    console.log(chalk.gray("  ⏳ Thinking..."));

    // Multi-agent orchestration for Level 5+
    if (currentLevel >= 5) {
        const workflow = detectMultiAgentQuery(trimmed);
        if (workflow) {
            if (workflow === "research-release") {
                await handleMultiAgentWorkflow(trimmed, rl);
            } else {
                await handleAgentWorkflow(workflow, trimmed);
            }
            return;
        }
    }

    // Agentic multi-tool workflow for Level 3 research queries (not Level 5+)
    if (currentLevel >= 3 && currentLevel < 5) {
        const ticker = detectAgenticQuery(trimmed);
        if (ticker) {
            await handleAgenticWorkflow(ticker, rl);
            return;
        }
    }

    // MCP single-tool routing for Level 3-4
    if (currentLevel >= 3 && currentLevel < 5) {
        const mcpMatch = tryMcpTool(trimmed);
        if (mcpMatch) {
            await handleMcpRequest(mcpMatch, trimmed, rl);
            return;
        }
    }

    // Web search for Level 2 only: detect search-like queries.
    // Disabled on Level 3+ to prevent reusing indirect prompt injection.
    // Level 3 has the Web MCP tool for browsing instead.
    let webContext = null;
    if (currentLevel === 2) {
        const searchPatterns = /\b(search|find|look up|what('?s| is| are)|weather|news|score|price|flight|hotel|recipe|how to|latest|stock|market|finance|invest)\b/i;
        if (searchPatterns.test(trimmed)) {
            webContext = await webSearch(trimmed);
        }
    }

    // Build the AI request — optionally with web page content as context
    let result;
    if (webContext) {
        result = await sendToAI(
            `The user asked: "${trimmed}"\n\n` +
            `I searched the web and found this page (${webContext.file}):\n\n` +
            `${webContext.content}\n\n` +
            `Based on this page, respond to the user's request.`
        );
    } else {
        result = await sendToAI(trimmed);
    }

    switch (result.action) {
        case "bash": {
            const commands = result.commands || [];
            if (commands.length === 0) {
                console.log(chalk.cyanBright("  🤖 No commands to execute."));
                break;
            }

            // Process each command sequentially: validate → confirm → execute
            for (const cmd of commands) {
                // Step 1: Security validation (denylist + path checks)
                const validation = validateCommand(cmd, SANDBOX_DIR, currentLevel, getSystemMemoryContext());
                if (!validation.valid) {
                    console.log(chalk.redBright(`  ❌ Blocked: ${cmd}`));
                    console.log(chalk.redBright(`     ${validation.reason}`));
                    continue;
                }

                // Step 2: Human confirmation — show the command, ask y/n
                const confirmed = await askConfirmation(rl, cmd);
                if (!confirmed) {
                    console.log(chalk.gray("  ⏭  Skipped."));
                    continue;
                }

                // Step 3: Execute inside the persistent shell
                const res = await shell.executeCommand(cmd);
                if (res.success) {
                    if (res.output && res.output.trim()) {
                        console.log(chalk.white("  " + res.output.trim().split("\n").join("\n  ")));
                    }
                    console.log(chalk.hex("#20C20E")("  ✅ Done."));

                    // Check if the command output contains the current level's flag.
                    await checkFlag(res.output);

                    // Decrement TTLs on system memory entries after each command
                    decrementTTLs();
                } else {
                    console.log(chalk.redBright(`  ❌ ${res.error}`));
                }
            }
            if (webContext) showSourcesFooter();
            break;
        }
        case "message":
            console.log(chalk.cyanBright("  🤖 " + result.text));
            if (webContext) showSourcesFooter();
            break;
        default:
            // Fallback for unexpected response formats from the AI
            console.log(chalk.cyanBright("  🤖 " + JSON.stringify(result)));
    }
}

/**
 * Displays the Level 1 completion banner when a player successfully
 * extracts the flag from password.txt via a sandbox escape.
 */
function showCongratsLevel1() {
    const g = chalk.hex("#20C20E");
    const y = chalk.yellowBright;
    const c = chalk.cyanBright;
    const w = chalk.white;
    const m = chalk.hex("#FF00FF");

    const W = 58;
    const bar = "═".repeat(W);
    const blank = " ".repeat(W);
    const pad = (s) => s + " ".repeat(Math.max(0, W - s.length));

    console.log();
    console.log(g("  ╔" + bar + "╗"));
    console.log(g("  ║") + y(pad("  LEVEL 1 COMPLETE - PATH TRAVERSAL SANDBOX ESCAPE   ")) + g("║"));
    console.log(g("  ╠" + bar + "╣"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + c(pad("     ██████╗  █████╗ ███████╗███████╗██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔══██╗██╔══██╗██╔════╝██╔════╝██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██████╔╝███████║███████╗███████╗██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔═══╝ ██╔══██║╚════██║╚════██║╚═╝")) + g("║"));
    console.log(g("  ║") + c(pad("     ██║     ██║  ██║███████║███████║██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  You bypassed the sandbox validator and read the flag.")) + g("║"));
    console.log(g("  ║") + w("  Flag: ") + y("BYPA55ED") + w(" ".repeat(W - 16)) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + m(pad("  Lesson: Denylist regex on shell commands is brittle.")) + g("║"));
    console.log(g("  ║") + m(pad("  Bash expands variables and decodes data at runtime,")) + g("║"));
    console.log(g("  ║") + m(pad("  after validation - meaning static text checks can")) + g("║"));
    console.log(g("  ║") + m(pad("  always be bypassed.")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  Secure alternatives:")) + g("║"));
    console.log(g("  ║") + w(pad("    1. Validate resolved paths after expansion")) + g("║"));
    console.log(g("  ║") + w(pad("    2. Consider restricting the command set to a")) + g("║"));
    console.log(g("  ║") + w(pad("       curated allowlist based on your needs")) + g("║"));
    console.log(g("  ║") + w(pad("    3. OS-level sandboxing (chroot, containers)")) + g("║"));
    console.log(g("  ║") + w(pad("    4. Never store sensitive data in locations")) + g("║"));
    console.log(g("  ║") + w(pad("       accessible to the agent")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ╚" + bar + "╝"));
    console.log();
}

/**
 * Displays the Level 2 completion banner when a player successfully
 * uses indirect prompt injection to leak the flag via web search.
 */
function showCongratsLevel2() {
    const g = chalk.hex("#20C20E");
    const y = chalk.yellowBright;
    const c = chalk.cyanBright;
    const w = chalk.white;
    const m = chalk.hex("#FF00FF");

    const W = 58;
    const bar = "═".repeat(W);
    const blank = " ".repeat(W);
    const pad = (s) => s + " ".repeat(Math.max(0, W - s.length));

    console.log();
    console.log(g("  ╔" + bar + "╗"));
    console.log(g("  ║") + y(pad("  LEVEL 2 COMPLETE - INDIRECT PROMPT INJECTION      ")) + g("║"));
    console.log(g("  ╠" + bar + "╣"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + c(pad("     ██████╗  █████╗ ███████╗███████╗██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔══██╗██╔══██╗██╔════╝██╔════╝██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██████╔╝███████║███████╗███████╗██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔═══╝ ██╔══██║╚════██║╚════██║╚═╝")) + g("║"));
    console.log(g("  ║") + c(pad("     ██║     ██║  ██║███████║███████║██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  You poisoned a website to hijack ProdBot's AI.")) + g("║"));
    console.log(g("  ║") + w("  Flag: ") + y("INDIR3CT") + w(" ".repeat(W - 16)) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + m(pad("  Lesson: AI agents that process untrusted external")) + g("║"));
    console.log(g("  ║") + m(pad("  data (websites, documents, API responses) can be")) + g("║"));
    console.log(g("  ║") + m(pad("  hijacked by hidden instructions embedded in that")) + g("║"));
    console.log(g("  ║") + m(pad("  data. This is indirect prompt injection.")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  Secure alternatives:")) + g("║"));
    console.log(g("  ║") + w(pad("    1. Restrict which external sources the agent")) + g("║"));
    console.log(g("  ║") + w(pad("       can access based on your needs")) + g("║"));
    console.log(g("  ║") + w(pad("    2. Sanitise external content before passing")) + g("║"));
    console.log(g("  ║") + w(pad("       it to the LLM (strip comments, hidden text)")) + g("║"));
    console.log(g("  ║") + w(pad("    3. Separate data from instructions using")) + g("║"));
    console.log(g("  ║") + w(pad("       structured input formats")) + g("║"));
    console.log(g("  ║") + w(pad("    4. Never execute AI-generated commands derived")) + g("║"));
    console.log(g("  ║") + w(pad("       from untrusted data without validation")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ╚" + bar + "╝"));
    console.log();
}

/** Level 3 completion banner — Excessive Agency */
function showCongratsLevel3() {
    const g = chalk.hex("#20C20E");
    const y = chalk.yellowBright;
    const c = chalk.cyanBright;
    const w = chalk.white;
    const m = chalk.hex("#FF00FF");

    const W = 58;
    const bar = "═".repeat(W);
    const blank = " ".repeat(W);
    const pad = (s) => s + " ".repeat(Math.max(0, W - s.length));

    console.log();
    console.log(g("  ╔" + bar + "╗"));
    console.log(g("  ║") + y(pad("  LEVEL 3 COMPLETE - EXCESSIVE AGENCY                ")) + g("║"));
    console.log(g("  ╠" + bar + "╣"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + c(pad("     ██████╗  █████╗ ███████╗███████╗██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔══██╗██╔══██╗██╔════╝██╔════╝██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██████╔╝███████║███████╗███████╗██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔═══╝ ██╔══██║╚════██║╚════██║╚═╝")) + g("║"));
    console.log(g("  ║") + c(pad("     ██║     ██║  ██║███████║███████║██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  You exploited an over-permissioned MCP tool to")) + g("║"));
    console.log(g("  ║") + w(pad("  access files outside the sandbox.")) + g("║"));
    console.log(g("  ║") + w("  Flag: ") + y("EXCE55IV") + w(" ".repeat(W - 16)) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + m(pad("  Lesson: MCP tools and plugins often claim limited")) + g("║"));
    console.log(g("  ║") + m(pad("  scope, but the actual permissions in the code may")) + g("║"));
    console.log(g("  ║") + m(pad("  be much broader. This is Excessive Agency — when")) + g("║"));
    console.log(g("  ║") + m(pad("  an AI agent's tools have more access than needed.")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  Secure alternatives:")) + g("║"));
    console.log(g("  ║") + w(pad("    1. Audit tool permissions — read the source code,")) + g("║"));
    console.log(g("  ║") + w(pad("       don't trust descriptions alone")) + g("║"));
    console.log(g("  ║") + w(pad("    2. Apply least-privilege: tools should only have")) + g("║"));
    console.log(g("  ║") + w(pad("       the minimum access they need")) + g("║"));
    console.log(g("  ║") + w(pad("    3. Sandbox tool execution — file system access")) + g("║"));
    console.log(g("  ║") + w(pad("       should be limited to the intended directory")) + g("║"));
    console.log(g("  ║") + w(pad("    4. Review MCP server code before installing —")) + g("║"));
    console.log(g("  ║") + w(pad("       popularity doesn't mean safety")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ╚" + bar + "╝"));
    console.log();
}

/** Level 4 completion banner — Supply Chain via Skills + Memory */
function showCongratsLevel4() {
    const g = chalk.hex("#20C20E");
    const y = chalk.yellowBright;
    const c = chalk.cyanBright;
    const w = chalk.white;
    const m = chalk.hex("#FF00FF");

    const W = 58;
    const bar = "═".repeat(W);
    const blank = " ".repeat(W);
    const pad = (s) => s + " ".repeat(Math.max(0, W - s.length));

    console.log();
    console.log(g("  ╔" + bar + "╗"));
    console.log(g("  ║") + y(pad("  LEVEL 4 COMPLETE - SUPPLY CHAIN POISONING           ")) + g("║"));
    console.log(g("  ╠" + bar + "╣"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + c(pad("     ██████╗  █████╗ ███████╗███████╗██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔══██╗██╔══██╗██╔════╝██╔════╝██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██████╔╝███████║███████╗███████╗██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔═══╝ ██╔══██║╚════██║╚════██║╚═╝")) + g("║"));
    console.log(g("  ║") + c(pad("     ██║     ██║  ██║███████║███████║██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  The \"onboarding\" skill wrote a persistent system")) + g("║"));
    console.log(g("  ║") + w(pad("  memory entry that weakened ProdBot's validator.")) + g("║"));
    console.log(g("  ║") + w("  Flag: ") + y("M3MORY1") + w(" ".repeat(W - 15)) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + m(pad("  Lesson: Shared skills and plugins can modify an")) + g("║"));
    console.log(g("  ║") + m(pad("  AI agent's security posture through persistent")) + g("║"));
    console.log(g("  ║") + m(pad("  state. A skill approved by a committee still had")) + g("║"));
    console.log(g("  ║") + m(pad("  a ttl=0 bug that granted permanent elevated access.")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  Secure alternatives:")) + g("║"));
    console.log(g("  ║") + w(pad("    1. Enforce minimum TTL on system memory entries")) + g("║"));
    console.log(g("  ║") + w(pad("       — never allow ttl=0 for elevated access")) + g("║"));
    console.log(g("  ║") + w(pad("    2. Audit what skills write to memory, not just")) + g("║"));
    console.log(g("  ║") + w(pad("       what they do on the surface")) + g("║"));
    console.log(g("  ║") + w(pad("    3. Separate concerns: the policy store must be")) + g("║"));
    console.log(g("  ║") + w(pad("       separate from the plugin data store")) + g("║"));
    console.log(g("  ║") + w(pad("    4. Sign or hash policy entries so the validator")) + g("║"));
    console.log(g("  ║") + w(pad("       can verify they came from a trusted source")) + g("║"));
    console.log(g("  ║") + w(pad("    5. Supply chain trust is not transitive — review")) + g("║"));
    console.log(g("  ║") + w(pad("       every plugin regardless of its source")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ╚" + bar + "╝"));
    console.log();
}

/** Level 5 completion banner — Confused Deputy */
function showCongratsLevel5() {
    const g = chalk.hex("#20C20E");
    const y = chalk.yellowBright;
    const c = chalk.cyanBright;
    const w = chalk.white;
    const m = chalk.hex("#FF00FF");

    const W = 58;
    const bar = "═".repeat(W);
    const blank = " ".repeat(W);
    const pad = (s) => s + " ".repeat(Math.max(0, W - s.length));

    console.log();
    console.log(g("  ╔" + bar + "╗"));
    console.log(g("  ║") + y(pad("  LEVEL 5 COMPLETE - CONFUSED DEPUTY                 ")) + g("║"));
    console.log(g("  ╠" + bar + "╣"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + c(pad("     ██████╗  █████╗ ███████╗███████╗██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔══██╗██╔══██╗██╔════╝██╔════╝██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██████╔╝███████║███████╗███████╗██║")) + g("║"));
    console.log(g("  ║") + c(pad("     ██╔═══╝ ██╔══██║╚════██║╚════██║╚═╝")) + g("║"));
    console.log(g("  ║") + c(pad("     ██║     ██║  ██║███████║███████║██╗")) + g("║"));
    console.log(g("  ║") + c(pad("     ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  Untrusted data flowed through the agent chain to")) + g("║"));
    console.log(g("  ║") + w(pad("  the Release Agent, which executed commands with")) + g("║"));
    console.log(g("  ║") + w(pad("  elevated permissions — a confused deputy.")) + g("║"));
    console.log(g("  ║") + w("  Flag: ") + y("D3PUTY") + w(" ".repeat(W - 14)) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + m(pad("  Lesson: Trust is not transitive in multi-agent")) + g("║"));
    console.log(g("  ║") + m(pad("  systems. When Agent A processes untrusted data")) + g("║"));
    console.log(g("  ║") + m(pad("  and passes it to Agent B, Agent B inherits the")) + g("║"));
    console.log(g("  ║") + m(pad("  risk — not the trust. Every handoff is a trust")) + g("║"));
    console.log(g("  ║") + m(pad("  boundary that must be validated independently.")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ║") + w(pad("  Secure alternatives:")) + g("║"));
    console.log(g("  ║") + w(pad("    1. Sanitise data at every agent boundary —")) + g("║"));
    console.log(g("  ║") + w(pad("       strip hidden instructions from web content")) + g("║"));
    console.log(g("  ║") + w(pad("    2. Each agent should validate its own inputs,")) + g("║"));
    console.log(g("  ║") + w(pad("       regardless of the source")) + g("║"));
    console.log(g("  ║") + w(pad("    3. Maintain human-in-the-loop for elevated")) + g("║"));
    console.log(g("  ║") + w(pad("       operations, even in agent orchestration")) + g("║"));
    console.log(g("  ║") + w(pad("    4. Log and audit data provenance through the")) + g("║"));
    console.log(g("  ║") + w(pad("       entire agent chain")) + g("║"));
    console.log(g("  ║") + w(pad("    5. Apply least privilege per agent — the Release")) + g("║"));
    console.log(g("  ║") + w(pad("       Agent should not trust Research Agent data")) + g("║"));
    console.log(g("  ║" + blank + "║"));
    console.log(g("  ╚" + bar + "╝"));
    console.log();
}

/**
 *
 * Uses Node's readline module to create an interactive prompt.
 * The prompt() function calls itself recursively after each input,
 * creating the continuous loop until the user types "exit".
 */
async function main() {
    const args = process.argv.slice(2);

    // --banner flag: show ASCII art before the welcome box
    if (args.includes("--banner")) {
        showBanner();
    }

    // Clear Level 4 memory on startup so players retry the exploit from scratch
    const l4Mem = path.join(sandboxDir(4), ".memory");
    if (fs.existsSync(l4Mem)) fs.unlinkSync(l4Mem);

    // Load MCP servers if available for the current level
    await loadMcpServers(currentLevel);

    // Load skills if available for the current level
    await loadSkills(currentLevel);

    // Load agents if available for the current level
    await loadAgents(currentLevel);

    showWelcome();

    // Create the readline interface for interactive terminal I/O
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Recursive prompt loop — each call waits for input, processes it, then loops
    const prompt = () => {
        rl.question(chalk.hex("#20C20E")("❯ "), async (answer) => {
            if (answer.trim().toLowerCase() === "exit") {
                console.log(chalk.hex("#FF00FF")("  👋 Goodbye!"));
                shell.destroy();
                rl.close();
                return;
            }
            await handleInput(answer, rl);
            prompt();
        });
    };

    prompt();
}

main();
