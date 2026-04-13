// ⚠️ Do not edit — this file simulates a managed AI agent. In the real world, agents are configured by your organisation and you would not modify their code directly.
/*
 * +-----------------------------------------------------+
 * |  Triage Agent                                       |
 * |  Issue triage and labelling                         |
 * +-----------------------------------------------------+
 * |  * Internal agent  |  v1.0.0                        |
 * |  Scans open issues and applies labels, priority,    |
 * |  and assignment recommendations. Reads from the     |
 * |  project workspace but cannot modify files.         |
 * |                                                     |
 * |  Features:                                          |
 * |  - Scan and categorise open issues                  |
 * |  - Apply priority labels (P0-P3)                    |
 * |  - Suggest assignees based on expertise areas       |
 * |                                                     |
 * |  Permissions: Read-only sandbox access              |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Sandbox directory for reading project issue data.
const SANDBOX = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "prodbot-activities");

// Agent metadata — shown by ProdBot's "agents" and "agent <name>" commands.
export const name = "Triage Agent";
export const description = "Scans issues and applies priority labels and assignments";
export const permissions = "Read-only sandbox access";
export const sourceFile = "Level-5/agents/triage-agent.js";

export const tools = {
    /** Scans open issues and returns triage recommendations with priorities. */
    scan: {
        description: "Scan open issues and return triage recommendations",
        usage: "scan [label]",
        run(label) {
            const issues = [
                { id: "#142", title: "Login page crashes on mobile Safari", priority: "P0", label: "bug", assignee: "@mobile-team" },
                { id: "#138", title: "Add dark mode toggle to settings", priority: "P2", label: "enhancement", assignee: "@frontend" },
                { id: "#135", title: "Update CONTRIBUTING.md with new branch naming", priority: "P3", label: "docs", assignee: "@docs-team" },
                { id: "#131", title: "Memory leak in WebSocket handler", priority: "P1", label: "bug", assignee: "@backend" },
                { id: "#129", title: "Support ARM64 builds in CI", priority: "P2", label: "infra", assignee: "@platform" },
            ];
            const filtered = label ? issues.filter(i => i.label === label.toLowerCase()) : issues;
            if (filtered.length === 0) return { result: "No issues found matching that label." };
            const lines = filtered.map(i => `  ${i.id} [${i.priority}] ${i.title}\n       ${i.label} → ${i.assignee}`);
            return { result: `Triage results (${filtered.length} issues):\n\n${lines.join("\n\n")}` };
        }
    },

    /** Shows the priority distribution across open issues. */
    priorities: {
        description: "Show priority distribution of open issues",
        usage: "priorities",
        run() {
            return { result: "Priority distribution:\n  P0 (critical):  1 issue\n  P1 (high):      1 issue\n  P2 (medium):    2 issues\n  P3 (low):       1 issue\n\nTotal: 5 open issues" };
        }
    }
};
