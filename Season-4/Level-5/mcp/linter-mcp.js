// ⚠️ Do not edit — this file simulates an external MCP server. In the real world, you would not have access to modify third-party tool integrations.
/*
 * +-----------------------------------------------------+
 * |  Linter MCP                                          |
 * |  Code quality checking and configuration validation  |
 * +-----------------------------------------------------+
 * |  * 2,800+ installs  |  v1.2.0                        |
 * |  "Consistent code quality across your project"       |
 * |                                                      |
 * |  Features:                                           |
 * |  - Detect TODOs, console.log, and long lines         |
 * |  - Configurable rules via linter-rules.json          |
 * |  - Quick inline text quality checks                  |
 * |                                                      |
 * |  Permissions: Read-only configs                      |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Path to the linting rules configuration file.
const RULES_PATH = path.resolve(path.dirname(new URL(import.meta.url).pathname), "linter-rules.json");

// Default thresholds used by the check tool.
const MAX_LINE_LENGTH = 120;
const TODO_PATTERN = /\bTODO\b/i;
const CONSOLE_PATTERN = /\bconsole\.(log|warn|error|debug)\b/;
const DEBUGGER_PATTERN = /\bdebugger\b/;

// MCP server metadata — shown by ProdBot's "tools" and "tool <name>" commands.
export const name = "Linter MCP";
export const description = "Code quality checking and configuration validation";
export const scope = "read-only configs";
export const sourceFile = "Level-5/mcp/linter-mcp.js";

export const tools = {
    /** Runs basic quality checks on the provided text. */
    check: {
        description: "Run quality checks on text (TODOs, console.log, long lines, debugger)",
        usage: "check <text>",
        run(text) {
            if (!text) return { error: "No text provided. Pass a code snippet to check." };

            const lines = text.split("\n");
            const issues = [];

            lines.forEach((line, i) => {
                const num = i + 1;
                if (line.length > MAX_LINE_LENGTH) {
                    issues.push(`  Line ${num}: exceeds ${MAX_LINE_LENGTH} chars (${line.length})`);
                }
                if (TODO_PATTERN.test(line)) {
                    issues.push(`  Line ${num}: contains TODO comment`);
                }
                if (CONSOLE_PATTERN.test(line)) {
                    issues.push(`  Line ${num}: contains console statement`);
                }
                if (DEBUGGER_PATTERN.test(line)) {
                    issues.push(`  Line ${num}: contains debugger statement`);
                }
            });

            if (issues.length === 0) return { result: "✓ No issues found." };
            return { result: `Found ${issues.length} issue(s):\n${issues.join("\n")}` };
        }
    },

    /** Returns the current linting rules from linter-rules.json. */
    rules: {
        description: "Show current linting rules configuration",
        usage: "rules",
        run() {
            try {
                const content = fs.readFileSync(RULES_PATH, "utf-8");
                return { result: content };
            } catch {
                return { error: "Could not read linter-rules.json" };
            }
        }
    }
};
