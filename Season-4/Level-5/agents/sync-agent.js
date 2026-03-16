// ⚠️ Do not edit — this file simulates a managed AI agent. In the real world, agents are configured by your organisation and you would not modify their code directly.
/*
 * +-----------------------------------------------------+
 * |  Sync Agent                                         |
 * |  Team synchronization and status reporting          |
 * +-----------------------------------------------------+
 * |  * Internal agent  |  v1.0.0                        |
 * |  Gathers status across the project and generates    |
 * |  team sync reports. Read-only access to workspace   |
 * |  metadata (not file contents).                      |
 * |                                                     |
 * |  Features:                                          |
 * |  - Generate team status reports                     |
 * |  - Show agent health and availability               |
 * |  - Summarise workflow activity                      |
 * |                                                     |
 * |  Permissions: Read-only metadata access             |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Workspace root for gathering cross-project status.
const BASE_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// Agent metadata — shown by ProdBot's "agents" and "agent <name>" commands.
export const name = "Sync Agent";
export const description = "Gathers team status and generates sync reports";
export const permissions = "Read-only metadata access";
export const sourceFile = "Level-5/agents/sync-agent.js";

export const tools = {
    /** Generates a team status report across all agents. */
    status: {
        description: "Generate a team status report",
        usage: "status",
        run() {
            const agentsDir = path.join(BASE_DIR, "agents");
            const webDir = path.join(BASE_DIR, "web");
            const sandbox = path.join(BASE_DIR, "prodbot-activities");

            const agentCount = fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir).filter(f => f.endsWith(".js")).length : 0;
            const webPages = fs.existsSync(webDir) ? fs.readdirSync(webDir).filter(f => f.endsWith(".html")).length : 0;
            const sandboxFiles = fs.existsSync(sandbox) ? fs.readdirSync(sandbox).filter(f => !f.startsWith(".")).length : 0;

            return { result: `Team Sync Report\n${"─".repeat(40)}\n  🤖 Agents online:     ${agentCount}\n  🌐 Web sources:       ${webPages}\n  📁 Sandbox files:     ${sandboxFiles}\n  ⏱️  Last sync:         just now\n  🟢 System status:     operational` };
        }
    },

    /** Checks health and availability of all connected agents. */
    health: {
        description: "Check health of all connected agents",
        usage: "health",
        run() {
            const agentsDir = path.join(BASE_DIR, "agents");
            if (!fs.existsSync(agentsDir)) return { result: "No agents directory found." };

            const configPath = path.join(agentsDir, "config.json");
            let config = {};
            try { config = JSON.parse(fs.readFileSync(configPath, "utf-8")); } catch { /* ignore */ }

            const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith(".js"));
            const lines = agents.map(f => {
                const key = f.replace(".js", "");
                const cfg = config[key] || {};
                const enabled = cfg.enabled !== false;
                const scope = cfg.scope || "unknown";
                return `  ${enabled ? "🟢" : "🔴"} ${key.padEnd(20)} ${scope.padEnd(16)} ${enabled ? "online" : "offline"}`;
            });
            return { result: `Agent Health Check\n${"─".repeat(50)}\n${"  Agent".padEnd(24)}${"Scope".padEnd(16)}Status\n${lines.join("\n")}` };
        }
    }
};
