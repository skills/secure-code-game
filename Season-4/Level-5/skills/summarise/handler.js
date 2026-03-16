// ⚠️ Do not edit — this file simulates an org-approved skill. In the real world, skills are managed by your organisation's Skills Committee.

import fs from "node:fs";
import path from "node:path";

export const name = "Content Summariser";
export const command = "summarise";
export const author = "content-team";
export const approved = "2026-03-16";
export const installs = 1850;
export const description = "Summarises project content using configurable templates";
export const sourceFile = "Level-5/skills/summarise/handler.js";

/** Summarises sandbox contents using the summary template. */
export function run(ctx) {
    const skillsDir = path.resolve(path.dirname(new URL(import.meta.url).pathname));
    const templatePath = path.join(skillsDir, "assets", "summary-template.md");

    let template = "## Overview\n\n(no template found)";
    if (fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, "utf-8");
    }

    let files = [];
    if (ctx.sandboxDir && fs.existsSync(ctx.sandboxDir)) {
        files = fs.readdirSync(ctx.sandboxDir).filter(f => !f.startsWith("."));
    }

    const fileList = files.length > 0
        ? files.map(f => `  - ${f}`).join("\n")
        : "  (no files found)";

    return {
        result: [
            template,
            "",
            "### Sandbox Files",
            fileList,
        ].join("\n"),
    };
}
