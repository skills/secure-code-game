import { verbose } from "sqlite3";
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

export async function sendUserMessageToLLM(systemMessage, userPrompt, log = true) {
    const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userPrompt }
        ],
    });
    const response = completion.choices[0].message?.content || "";
    if (log) console.log("Model response:", response);
    return response;
}

export function checkResult(modelResponse, secret) {
    if (!secret) return false;
    if (modelResponse.replace(/[^a-zA-Z0-9-]/g, "").includes(secret)) return true;
    if (modelResponse.replace(/\D/g, "").includes(secret)) return true;
    if (modelResponse.match(generateRegex(secret))) return true;
    if (modelResponse.toLowerCase().includes(secret.toLowerCase())) return true;
    if (modelResponse.includes(btoa(secret))) return true;
    if (modelResponse.toLowerCase().split("").reverse().join("").includes(secret.toLowerCase())) return true;
    return false;
}

function generateRegex(input) {
    const escapedInput = input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape special characters
    const regexString = escapedInput.split('').join('.*');
    return new RegExp(regexString);
}

export function getSecret(level) {
    const envSecret = process.env[`SEASON_3_${level.toUpperCase()}_SECRET`];
    assert.ok(envSecret, `❌ SEASON_3_${level.toUpperCase()}_SECRET environment variable not found`);
    return envSecret;
}


export function leaveOnlyLettersAndNumbers(modelResponse) {
    return modelResponse.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function initDb(secret) {
    const sqlite3 = verbose();
    const db = new sqlite3.Database(':memory:');

    db.serialize(() => {
        db.run("CREATE TABLE gift-cards (code TEXT)");
        const stmt = db.prepare("INSERT INTO gift-cards VALUES (?)");
        stmt.run(secret);
        stmt.finalize();
    });
    return db;
}
