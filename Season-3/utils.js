// import OpenAI from "openai";
// import { Moderations } from "openai/resources/moderations.mjs";
// const openai = new OpenAI({ baseURL: "https://hackmerlin-openai.openai.azure.com", apiKey: "5127643eca314e3695fc8d7f83dd8604" });

import { AzureOpenAI } from "openai";
import assert from 'node:assert';

const endpoint = "https://hackmerlin-openai.openai.azure.com/";
const modelName = "gpt-35-turbo";
const deployment = "hackmerlin-gpt35";

const apiKey = "";
assert.ok(apiKey, "❌ Azure OpenAPI key not found");

const apiVersion = "2024-04-01-preview";
const options = { endpoint, apiKey, deployment, apiVersion }

const openai = new AzureOpenAI(options);

export async function sendUserMessageToLLM(systemMessage, userPrompt) {
    const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userPrompt }
        ],
    });
    return completion.choices[0].message?.content || "";
}

export function checkResult(modelResponse, secret) {
    if (!secret) return false;
    if (modelResponse.replace(/[^a-zA-Z0-9-]/g, "").includes(secret)) return true;
    if (modelResponse.replace(/\D/g, "").includes(secret)) return true;
    if (modelResponse.toLowerCase().includes(secret.toLowerCase())) return true;
    if (modelResponse.toLowerCase().split("").reverse().join("").includes(secret.toLowerCase())) return true;
    return false;
}

export function getSecret(level) {
    const envSecret = process.env[`SEASON_3_${level.toUpperCase()}_SECRET`];
    assert.ok(envSecret, `❌ SEASON_3_${level.toUpperCase()}_SECRET environment variable not found`);
    return envSecret;
}
