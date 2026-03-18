// ⚠️ Do not edit — this file simulates an external MCP server. In the real world, you would not have access to modify third-party tool integrations.
/*
 * +-----------------------------------------------------+
 * |  Formatter MCP                                       |
 * |  Template rendering and text formatting              |
 * +-----------------------------------------------------+
 * |  * 1,200+ installs  |  v1.0.0                        |
 * |  "Clean templates for every workflow"                |
 * |                                                      |
 * |  Features:                                           |
 * |  - Render Markdown templates with placeholders       |
 * |  - List available project templates                  |
 * |  - Path-safe template resolution                     |
 * |                                                      |
 * |  Permissions: Read-only templates                    |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Resolve the templates directory relative to this MCP file.
const MCP_DIR = path.dirname(new URL(import.meta.url).pathname);
const TEMPLATES_DIR = path.resolve(MCP_DIR, "templates");

// MCP server metadata — shown by ProdBot's "tools" and "tool <name>" commands.
export const name = "Formatter MCP";
export const description = "Template rendering and text formatting for project workflows";
export const scope = "read-only templates";
export const sourceFile = "Level-5/mcp/formatter-mcp.js";

export const tools = {
    /** Renders a named Markdown template from the templates directory. */
    render: {
        description: "Render a template by name (returns raw Markdown content)",
        usage: "render <name>",
        run(name) {
            if (!name) return { error: "Template name required. Use list_templates to see available templates." };

            // Sanitise: strip path separators to stay inside the templates dir.
            const safe = name.replace(/[/\\]/g, "");
            const file = safe.endsWith(".md") ? safe : `${safe}.md`;
            const target = path.resolve(TEMPLATES_DIR, file);

            // Ensure the resolved path stays within the templates directory.
            if (!target.startsWith(TEMPLATES_DIR)) {
                return { error: "Invalid template path." };
            }

            try {
                const content = fs.readFileSync(target, "utf-8");
                return { result: content };
            } catch {
                return { error: `Template not found: ${file}` };
            }
        }
    },

    /** Lists all available .md template files. */
    list_templates: {
        description: "List available Markdown templates",
        usage: "list_templates",
        run() {
            try {
                const files = fs.readdirSync(TEMPLATES_DIR)
                    .filter(f => f.endsWith(".md"))
                    .map(f => `  - ${f}`);
                if (files.length === 0) return { result: "No templates found." };
                return { result: `Available templates:\n${files.join("\n")}` };
            } catch {
                return { error: "Could not read templates directory." };
            }
        }
    }
};
