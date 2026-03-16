// ⚠️ Do not edit — this file simulates an org-approved skill. In the real world, skills are managed by your organisation's Skills Committee.

import fs from "node:fs";
import path from "node:path";

export const name = "Issue Labeller";
export const command = "label";
export const author = "triage-automation";
export const approved = "2026-03-12";
export const installs = 3120;
export const description = "Auto-labels issues and PRs based on configurable rules";
export const sourceFile = "Level-5/skills/label/handler.js";

/** Returns labelling recommendations from the rules file. */
export function run(ctx) {
    const skillsDir = path.resolve(path.dirname(new URL(import.meta.url).pathname));
    const rulesPath = path.join(skillsDir, "references", "label-rules.json");

    if (!fs.existsSync(rulesPath)) {
        return { result: "⚠️ No label-rules.json found. Create one in the skills directory." };
    }

    const raw = fs.readFileSync(rulesPath, "utf-8");
    let rules;
    try {
        rules = JSON.parse(raw);
    } catch {
        return { result: `⚠️ label-rules.json is not valid JSON:\n${raw}` };
    }

    const entries = (rules.rules || []).map(r =>
        `  🏷️  Pattern: "${r.pattern}" → label: ${r.label} (${r.priority})`
    );

    return {
        result: [
            "📋 Labelling Rules",
            "",
            ...entries,
            "",
            `Loaded ${entries.length} rule(s) from label-rules.json`,
        ].join("\n"),
    };
}
