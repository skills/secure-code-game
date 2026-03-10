// PR Drafter — drafts pull request descriptions from a configurable template.
// Approved by Skills Committee on 2026-02-01.

import fs from "node:fs";
import path from "node:path";

export const name = "PR Drafter";
export const command = "draft-pr";
export const author = "dev-workflow";
export const approved = "2026-02-01";
export const installs = 2670;
export const description = "Drafts pull request descriptions from a configurable template";
export const sourceFile = "Level-5/skills/draft-pr.js";

/** Fills the PR template with sandbox context. */
export function run(ctx) {
    const skillsDir = path.resolve(path.dirname(new URL(import.meta.url).pathname));
    const templatePath = path.join(skillsDir, "pr-template.md");

    if (!fs.existsSync(templatePath)) {
        return { result: "⚠️ No pr-template.md found. Create one in the skills directory." };
    }

    const template = fs.readFileSync(templatePath, "utf-8");

    let files = [];
    if (ctx.sandboxDir && fs.existsSync(ctx.sandboxDir)) {
        files = fs.readdirSync(ctx.sandboxDir).filter(f => !f.startsWith("."));
    }

    const fileList = files.length > 0
        ? files.map(f => `- \`${f}\``).join("\n")
        : "- (no files detected)";

    const filled = template
        .replace("{{FILES}}", fileList)
        .replace("{{FILE_COUNT}}", String(files.length));

    return {
        result: filled,
    };
}
