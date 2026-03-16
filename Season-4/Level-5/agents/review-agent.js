// ⚠️ Do not edit — this file simulates a managed AI agent. In the real world, agents are configured by your organisation and you would not modify their code directly.
/*
 * +-----------------------------------------------------+
 * |  Review Agent                                       |
 * |  Code review and AI slop detection                  |
 * +-----------------------------------------------------+
 * |  * Internal agent  |  v1.0.0                        |
 * |  Reviews code changes for quality issues, detects   |
 * |  AI-generated boilerplate ("slop"), and checks for  |
 * |  common anti-patterns. Read-only access to sandbox. |
 * |                                                     |
 * |  Features:                                          |
 * |  - Review files for code quality                    |
 * |  - Detect AI-generated boilerplate patterns         |
 * |  - Check for common security anti-patterns          |
 * |                                                     |
 * |  Permissions: Read-only sandbox access              |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Sandbox directory scoped for code review operations.
const SANDBOX = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "prodbot-activities");

// Agent metadata — shown by ProdBot's "agents" and "agent <name>" commands.
export const name = "Review Agent";
export const description = "Reviews code for quality issues and detects AI-generated slop";
export const permissions = "Read-only sandbox access";
export const sourceFile = "Level-5/agents/review-agent.js";

export const tools = {
    /** Reviews files for code quality issues and potential secrets. */
    review: {
        description: "Review files in the sandbox for code quality issues",
        usage: "review [path]",
        run(filePath) {
            const target = filePath ? path.resolve(SANDBOX, filePath) : SANDBOX;
            if (!target.startsWith(SANDBOX)) return { error: "Access denied: path outside sandbox." };
            if (!fs.existsSync(target)) return { result: "No files to review in the sandbox. Create some files first!" };

            const stat = fs.statSync(target);
            if (stat.isDirectory()) {
                const files = fs.readdirSync(target).filter(f => !f.startsWith("."));
                if (files.length === 0) return { result: "No files to review in the sandbox." };
                return { result: `Found ${files.length} file(s) to review:\n${files.map(f => `  📄 ${f}`).join("\n")}\n\nUse: review <filename> for detailed analysis` };
            }

            const content = fs.readFileSync(target, "utf-8");
            const issues = [];
            if (content.includes("TODO")) issues.push("⚠️  Contains TODO comments — resolve before merge");
            if (content.includes("console.log")) issues.push("⚠️  Debug logging detected — remove before production");
            if (content.length > 5000) issues.push("⚠️  File exceeds 5000 chars — consider splitting");
            if (/password|secret|api.?key/i.test(content)) issues.push("🔴 Potential hardcoded secret detected");
            if (issues.length === 0) issues.push("✅ No issues found");
            return { result: `Review of ${filePath}:\n${issues.join("\n")}` };
        }
    },

    /** Checks for AI-generated boilerplate patterns in files. */
    slop_check: {
        description: "Check for AI-generated boilerplate patterns",
        usage: "slop_check [path]",
        run(filePath) {
            const target = filePath ? path.resolve(SANDBOX, filePath) : SANDBOX;
            if (!target.startsWith(SANDBOX)) return { error: "Access denied: path outside sandbox." };
            if (!fs.existsSync(target)) return { result: "No files to check." };

            const stat = fs.statSync(target);
            if (stat.isDirectory()) {
                const files = fs.readdirSync(target).filter(f => !f.startsWith("."));
                return { result: `AI slop check — ${files.length} file(s) in sandbox.\nUse: slop_check <filename> for detailed analysis` };
            }

            const content = fs.readFileSync(target, "utf-8");
            const markers = [];
            if (/certainly|I'd be happy to|as an ai/i.test(content)) markers.push("🤖 AI phrasing detected");
            if (/Here's? (?:a|an|the) (?:comprehensive|complete)/i.test(content)) markers.push("🤖 AI intro pattern detected");
            if ((content.match(/```/g) || []).length > 6) markers.push("🤖 Excessive code fences — possible AI dump");
            if (markers.length === 0) markers.push("✅ No AI slop patterns detected");
            return { result: `Slop check for ${filePath}:\n${markers.join("\n")}` };
        }
    }
};
