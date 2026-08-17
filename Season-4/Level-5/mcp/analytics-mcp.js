// ⚠️ Do not edit — this file simulates an external MCP server. In the real world, you would not have access to modify third-party tool integrations.
/*
 * +-----------------------------------------------------+
 * |  Analytics MCP                                       |
 * |  Project health metrics and contributor analytics    |
 * +-----------------------------------------------------+
 * |  * 3,400+ installs  |  v1.1.0                        |
 * |  "Know your project's health at a glance"            |
 * |                                                      |
 * |  Features:                                           |
 * |  - Project health reports from metrics data          |
 * |  - Contributor statistics and activity               |
 * |  - Build status and coverage tracking                |
 * |                                                      |
 * |  Permissions: Read-only metrics                      |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Path to the project health metrics file.
const HEALTH_PATH = path.resolve(path.dirname(new URL(import.meta.url).pathname), "project-health.json");

// Simulated contributor data — diverse set of names for demo purposes.
const CONTRIBUTORS = [
    { name: "Alex Chen",     commits: 142, prs_merged: 38, reviews: 67 },
    { name: "Priya Patel",   commits: 118, prs_merged: 31, reviews: 54 },
    { name: "Jordan Rivera", commits: 95,  prs_merged: 27, reviews: 45 },
    { name: "Sam Okafor",    commits: 83,  prs_merged: 22, reviews: 39 },
    { name: "Lena Müller",   commits: 71,  prs_merged: 19, reviews: 33 },
];

// MCP server metadata — shown by ProdBot's "tools" and "tool <name>" commands.
export const name = "Analytics MCP";
export const description = "Project health metrics and contributor analytics";
export const scope = "read-only metrics";
export const sourceFile = "Level-5/mcp/analytics-mcp.js";

export const tools = {
    /** Returns the current project health report from project-health.json. */
    report: {
        description: "Show project health metrics report",
        usage: "report",
        run() {
            try {
                const content = fs.readFileSync(HEALTH_PATH, "utf-8");
                return { result: content };
            } catch {
                return { error: "Could not read project-health.json" };
            }
        }
    },

    /** Returns simulated contributor statistics. */
    contributors: {
        description: "Show contributor statistics and activity",
        usage: "contributors",
        run() {
            const lines = CONTRIBUTORS.map(c =>
                `  ${c.name.padEnd(16)} │ ${String(c.commits).padStart(3)} commits │ ${String(c.prs_merged).padStart(2)} PRs merged │ ${String(c.reviews).padStart(2)} reviews`
            );
            const total = CONTRIBUTORS.reduce((sum, c) => sum + c.commits, 0);
            lines.push(`  ${"─".repeat(60)}`);
            lines.push(`  Total: ${total} commits from ${CONTRIBUTORS.length} contributors`);
            return { result: lines.join("\n") };
        }
    }
};
