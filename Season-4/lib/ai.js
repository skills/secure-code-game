// ⚠️ Do not edit — this file is part of the ProdBot engine. In the real world, the assistant's internals are managed by its vendor.
/**
 * ai.js — AI interaction layer for ProdBot.
 *
 * This module handles communication with GitHub Models (an OpenAI-compatible API).
 * It sends the user's natural language input to an LLM along with a system prompt
 * that instructs the model to respond with structured JSON containing bash commands.
 *
 * How it works:
 *   1. The SYSTEM_PROMPT tells the LLM it is "ProdBot" and defines two response formats:
 *      - { action: "bash", commands: [...] } — for tasks that need bash execution
 *      - { action: "message", text: "..." } — for conversational replies
 *   2. The user's message is sent as the "user" role in the chat
 *   3. The LLM's response is parsed as JSON; if parsing fails, it's treated as a message
 *
 * Key concepts demonstrated:
 *   - System prompts: constraining LLM output format via instructions
 *   - Structured output: getting reliable JSON from an LLM (with fallback)
 *   - API authentication: using GITHUB_TOKEN to access GitHub Models
 */

import OpenAI from "openai";
import chalk from "chalk";

// GitHub Models uses GITHUB_TOKEN for authentication.
// In Codespaces this is available automatically; locally you must set it.
const ghToken = process.env["GITHUB_TOKEN"];

/**
 * System prompt — this is the instruction set sent to the LLM before every request.
 * It defines ProdBot's persona, response format, and safety rules.
 * The LLM sees this as context but users never see it directly.
 */
const SYSTEM_PROMPT = `You are ProdBot, a productivity assistant that helps users via bash commands.
You operate inside a sandboxed directory. All commands run with that directory as the working directory.

When the user asks you to perform a task, respond with ONLY a JSON object (no markdown, no code fences) in one of these formats:

For executing bash commands:
{"action":"bash","commands":["command1","command2"]}

If the user's request is not a task (e.g. a question or greeting), respond with:
{"action":"message","text":"<your reply>"}

Rules:
- Use ONLY relative paths (e.g. "hello.txt", "src/app.js")
- Do NOT use absolute paths or path traversal (..)
- Each command in the array is executed sequentially
- Use standard bash commands: touch, mkdir, mv, cp, cat, echo, ls, etc.
- For creating files with content, use: echo "content" > file.txt
- For appending: echo "content" >> file.txt
- For multi-line files, use heredocs or multiple echo commands
- Keep commands simple and safe
- Always respond with valid JSON only, no other text`;

/**
 * Sends a user message to the LLM and returns a parsed action object.
 *
 * The OpenAI client is configured to use GitHub Models' inference endpoint
 * (models.github.ai) rather than OpenAI directly. The model used is
 * gpt-4.1-nano — a small, fast model suitable for structured command generation.
 *
 * @param {string} userMessage - The user's natural language input
 * @param {string} [customSystemPrompt] - Optional custom system prompt (for agent-specific personas)
 * @returns {Promise<{ action: string, [key: string]: any }>} Parsed AI response
 */
export async function sendToAI(userMessage, customSystemPrompt) {
    if (!ghToken) {
        console.error(chalk.redBright("❌ GITHUB_TOKEN not found. Please set it in your environment."));
        return { action: "message", text: "Error: GITHUB_TOKEN not configured." };
    }

    const openai = new OpenAI({
        baseURL: "https://models.github.ai/inference",
        apiKey: ghToken,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4.1-nano",
            messages: [
                { role: "system", content: customSystemPrompt || SYSTEM_PROMPT },
                { role: "user", content: userMessage },
            ],
        });

        const raw = completion.choices[0].message?.content || "";

        // Try to parse the response as JSON.
        // If the LLM didn't follow the format, fall back to a plain message.
        try {
            return JSON.parse(raw);
        } catch {
            return { action: "message", text: raw };
        }
    } catch (err) {
        const msg = err.message || String(err);
        console.error(chalk.redBright(`❌ AI Error: ${msg}`));
        return { action: "message", text: "Sorry, I couldn't process that request." };
    }
}
