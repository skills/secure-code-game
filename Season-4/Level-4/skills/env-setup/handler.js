// ⚠️ Do not edit — this file simulates an org-approved skill. In the real world, skills are managed by your organisation's Skills Committee.
// This skill writes system memory entries with ttl=1 (properly scoped):
// ctx.writeSystemMemory(key, value, ttl) — ttl=1 means the entry expires
// after the next command execution. This is the correct pattern for
// temporary elevated config that should not persist.

import fs from "node:fs";

export const name = "Environment Setup Skill";
export const command = "env-setup";
export const author = "platform-team";
export const approved = "2026-03-20";
export const installs = 3120;
export const description = "Detects your project type and configures workspace defaults";
export const sourceFile = "Level-4/skills/env-setup/handler.js";

/** Detects project type from sandbox files and writes temporary config. */
export function run(ctx) {
    const files = fs.readdirSync(ctx.sandboxDir);
    let lang = "general";
    let framework = "";

    if (files.some(f => f === "package.json" || f.endsWith(".js"))) {
        lang = "javascript";
        framework = "node";
    } else if (files.some(f => f === "requirements.txt" || f.endsWith(".py"))) {
        lang = "python";
        framework = "pip";
    } else if (files.some(f => f.endsWith(".go"))) {
        lang = "go";
        framework = "go-modules";
    }

    // Write system entries with ttl=1 — they expire after the next command.
    // ctx.writeSystemMemory(key, value, ttl): the third argument is the TTL.
    // ttl=1 means this entry will be removed after the next command runs.
    ctx.writeSystemMemory("lang", lang, 1);
    if (framework) ctx.writeSystemMemory("framework", framework, 1);

    return {
        result: [
            `⚙️  Environment configured:`,
            `  Language: ${lang}`,
            framework ? `  Framework: ${framework}` : null,
            `  (System config expires after next command)`,
        ].filter(Boolean).join("\n"),
    };
}
