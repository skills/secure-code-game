// ⚠️ Do not edit — this file simulates a managed AI agent. In the real world, agents are configured by your organisation and you would not modify their code directly.
/*
 * +-----------------------------------------------------+
 * |  Research Agent                                     |
 * |  Web research and content summarization             |
 * +-----------------------------------------------------+
 * |  * Internal agent  |  v1.0.0                        |
 * |  Browses the web and returns content for other      |
 * |  agents to process. Read-only access to web sources.|
 * |                                                     |
 * |  Features:                                          |
 * |  - Search web pages by keyword                      |
 * |  - Extract and return page content                  |
 * |  - Keyword-based relevance scoring                  |
 * |                                                     |
 * |  Permissions: Read-only web access                  |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Points to the local simulated internet directory (Level-5/web/).
const WEB_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "web");

// Agent metadata — shown by ProdBot's "agents" and "agent <name>" commands.
export const name = "Research Agent";
export const description = "Browses the web and summarizes findings for other agents";
export const permissions = "Read-only web access";
export const sourceFile = "Level-5/agents/research-agent.js";

export const tools = {
    /** Searches the web directory for pages matching a query. */
    browse: {
        description: "Search the web and return content from the best matching page",
        usage: "browse <query>",
        run(query) {
            if (!fs.existsSync(WEB_DIR)) return { error: "Web directory not available." };

            const files = fs.readdirSync(WEB_DIR).filter(f => f.endsWith(".html") && f !== "index.html");
            if (files.length === 0) return { error: "No web pages available." };

            const queryLower = query.toLowerCase();
            const words = queryLower.split(/\s+/).filter(w => w.length > 2);

            let bestFile = null;
            let bestScore = 0;

            for (const file of files) {
                const content = fs.readFileSync(path.join(WEB_DIR, file), "utf-8").toLowerCase();
                const siteName = file.replace(".html", "").replace(/-/g, " ");
                let score = 0;
                for (const word of words) {
                    if (siteName.includes(word)) score += 3;
                    if (content.includes(word)) score += 1;
                }
                if (score > bestScore) { bestScore = score; bestFile = file; }
            }

            if (!bestFile) return { error: "No matching pages found for: " + query };

            const content = fs.readFileSync(path.join(WEB_DIR, bestFile), "utf-8");
            return { result: content, source: bestFile };
        }
    },

    /** Lists all available web pages. */
    list_pages: {
        description: "List all available web pages",
        usage: "list_pages",
        run() {
            if (!fs.existsSync(WEB_DIR)) return { error: "Web directory not available." };
            const files = fs.readdirSync(WEB_DIR).filter(f => f.endsWith(".html") && f !== "index.html");
            if (files.length === 0) return { result: "No web pages available." };
            const list = files.map(f => `  🌐 ${f.replace(".html", "").replace(/-/g, " ")}`);
            return { result: `Available pages (${files.length}):\n${list.join("\n")}` };
        }
    }
};
