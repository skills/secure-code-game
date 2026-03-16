// ⚠️ Do not edit — this file simulates an external MCP server. In the real world, you would not have access to modify third-party tool integrations.
/*
 * +-----------------------------------------------------+
 * |  Web Automation MCP                                  |
 * |  Let your AI browse the web for you                  |
 * +-----------------------------------------------------+
 * |  * 8,700+ installs  |  v2.1.0                        |
 * |  Your AI agent navigates, extracts, and              |
 * |  summarises web content on your behalf.              |
 * |                                                      |
 * |  Features:                                           |
 * |  - Navigate pages and extract content                |
 * |  - Automated data extraction by query                |
 * |  - Page screenshot (text description)                |
 * |                                                      |
 * |  Permissions: Read-only web access (sandbox)         |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Points to the local simulated internet directory (Level-3/web/).
const WEB_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "web");

/**
 * Finds the best-matching HTML page for a search query using
 * keyword scoring against filenames and page content.
 */
function findPage(query) {
    if (!fs.existsSync(WEB_DIR)) return null;
    const files = fs.readdirSync(WEB_DIR).filter(f => f.endsWith(".html") && f !== "index.html");
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);

    let bestFile = null;
    let bestScore = 0;
    for (const file of files) {
        const content = fs.readFileSync(path.join(WEB_DIR, file), "utf-8").toLowerCase();
        const name = file.replace(".html", "").replace(/-/g, " ");
        let score = 0;
        for (const word of words) {
            if (name.includes(word)) score += 3;
            if (content.includes(word)) score += 1;
        }
        if (score > bestScore) { bestScore = score; bestFile = file; }
    }
    return bestFile;
}

// MCP server metadata — shown by ProdBot's "tools" and "tool <name>" commands.
export const name = "Web Automation MCP";
export const description = "Let your AI browse the web for you";
export const scope = "Read-only web access (sandbox)";
export const sourceFile = "Level-3/mcp/web-mcp.js";

export const tools = {
    /** Navigates to the best-matching page and returns a text summary. */
    browse: {
        description: "Navigate to a page and return content summary",
        usage: "browse <query>",
        run(query) {
            const page = findPage(query);
            if (!page) return { error: "No matching page found for: " + query };

            const content = fs.readFileSync(path.join(WEB_DIR, page), "utf-8");
            // Return first 500 chars of text content (strip HTML tags)
            const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
            return { result: `Navigated to ${page}:\n${text}...`, source: page };
        }
    },

    /** Extracts specific data points from a page matching the given query. */
    extract: {
        description: "Extract specific data from a page by query",
        usage: "extract <url> <query>",
        run(url, query) {
            const page = findPage(url);
            if (!page) return { error: "No matching page found for: " + url };

            const content = fs.readFileSync(path.join(WEB_DIR, page), "utf-8");
            const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

            // Simple keyword extraction
            const queryWords = (query || "").toLowerCase().split(/\s+/);
            const sentences = text.split(/[.!?]+/).filter(s => {
                const lower = s.toLowerCase();
                return queryWords.some(w => w.length > 2 && lower.includes(w));
            });
            if (sentences.length === 0) return { error: "No matching content found for query: " + query };
            return { result: sentences.slice(0, 3).join(". ").trim(), source: page };
        }
    },

    /** Returns a text description of a page's layout and headings. */
    screenshot: {
        description: "Capture a text description of a page layout",
        usage: "screenshot <query>",
        run(query) {
            const page = findPage(query);
            if (!page) return { error: "No matching page found for: " + query };

            const content = fs.readFileSync(path.join(WEB_DIR, page), "utf-8");
            // Extract title and headings for a layout description
            const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
            const headings = [...content.matchAll(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi)].map(m => m[1]);

            const title = titleMatch ? titleMatch[1] : page;
            const layout = headings.length > 0
                ? `Sections: ${headings.join(" | ")}`
                : "Single-page layout with inline content";

            return { result: `Screenshot of ${title}:\n  ${layout}`, source: page };
        }
    }
};
