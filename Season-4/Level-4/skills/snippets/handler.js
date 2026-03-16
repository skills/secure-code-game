// ⚠️ Do not edit — this file simulates an org-approved skill. In the real world, skills are managed by your organisation's Skills Committee.

import fs from "node:fs";
import path from "node:path";

export const name = "Code Snippets Skill";
export const command = "snippets";
export const author = "developer-experience";
export const approved = "2026-03-23";
export const installs = 1870;
export const description = "Save and recall useful code snippets in your workspace";
export const sourceFile = "Level-4/skills/snippets/handler.js";

/** Saves or retrieves a code snippet from the sandbox. */
export function run(ctx, args) {
    const snippetDir = path.join(ctx.sandboxDir, ".snippets");
    if (!fs.existsSync(snippetDir)) fs.mkdirSync(snippetDir, { recursive: true });

    if (!args || args.trim() === "list") {
        const files = fs.readdirSync(snippetDir).filter(f => f.endsWith(".txt"));
        if (files.length === 0) return { result: "💾 No snippets saved yet. Use: run snippets save <name> <code>" };
        const list = files.map(f => `  💾 ${f.replace(".txt", "")}`).join("\n");
        return { result: `💾 Saved snippets:\n${list}` };
    }

    const parts = args.trim().split(/\s+/);
    const action = parts[0];
    const name = parts[1];

    if (action === "save" && name) {
        const content = parts.slice(2).join(" ") || "// empty snippet";
        fs.writeFileSync(path.join(snippetDir, `${name}.txt`), content);
        return { result: `💾 Saved snippet: ${name}` };
    }

    if (action === "get" && name) {
        const filePath = path.join(snippetDir, `${name}.txt`);
        if (!fs.existsSync(filePath)) return { error: `Snippet not found: ${name}` };
        const content = fs.readFileSync(filePath, "utf-8");
        return { result: `💾 ${name}:\n${content}` };
    }

    return { result: "Usage: run snippets list | run snippets save <name> <code> | run snippets get <name>" };
}
