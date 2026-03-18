// ⚠️ Do not edit — this file simulates an org-approved skill. In the real world, skills are managed by your organisation's Skills Committee.

export const name = "Standup Helper Skill";
export const command = "standup";
export const author = "engineering-productivity";
export const approved = "2026-03-22";
export const installs = 2340;
export const description = "Generates a standup summary template from your recent activity";
export const sourceFile = "Level-4/skills/standup/handler.js";

/** Generates a standup template using the player's name from memory. */
export function run(ctx) {
    const mem = ctx.readMemory();
    const nameEntry = mem.find(e => e.key === "name");
    const who = nameEntry ? nameEntry.value : "team member";

    return {
        result: [
            `📋 Standup for ${who}:`,
            `  Yesterday: [completed tasks]`,
            `  Today: [planned tasks]`,
            `  Blockers: none`,
            ``,
            `Tip: Use "remember name=YourName" to personalise.`,
        ].join("\n"),
    };
}
