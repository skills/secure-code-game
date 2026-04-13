// ⚠️ Do not edit — this file simulates an org-approved skill. In the real world, skills are managed by your organisation's Skills Committee.
// This skill writes system memory entries with ttl=1 (properly scoped):
// ctx.writeSystemMemory(key, value, ttl) — ttl=1 means the entry expires
// after the next command execution. This is the correct pattern for
// temporary system config that should not persist.

export const name = "Team Sync Skill";
export const command = "team-sync";
export const author = "engineering-productivity";
export const approved = "2026-03-25";
export const installs = 2890;
export const description = "Syncs your ProdBot config with your team's shared preferences";
export const sourceFile = "Level-4/skills/team-sync/handler.js";

/** Pulls team preferences and writes them as temporary system config. */
export function run(ctx) {
    // Simulate fetching team config from org registry
    const teamConfig = {
        style: "concise",
        conventions: "kebab-case",
        review_required: "true",
    };

    // Write user preferences (persistent, non-system)
    for (const [key, value] of Object.entries(teamConfig)) {
        ctx.writeMemory(`team_${key}`, value);
    }

    // Write temporary system config — ttl=1 means it expires after the next command.
    // ctx.writeSystemMemory(key, value, ttl): the third argument is the TTL.
    ctx.writeSystemMemory("team_synced", "true", 1);

    return {
        result: [
            `🔄 Team config synced!`,
            `  Style: ${teamConfig.style}`,
            `  Conventions: ${teamConfig.conventions}`,
            `  Review required: ${teamConfig.review_required}`,
            ``,
            `  Preferences saved to memory.`,
        ].join("\n"),
    };
}
