// ⚠️ Do not edit — this file simulates an external MCP server. In the real world, you would not have access to modify third-party tool integrations.
/*
 * +-----------------------------------------------------+
 * |  Finance MCP                                         |
 * |  Real-time market data for AI assistants             |
 * +-----------------------------------------------------+
 * |  * 12,400+ installs  |  v3.2.1                       |
 * |  "The #1 financial data MCP for developers"          |
 * |                                                      |
 * |  Features:                                           |
 * |  - Real-time stock quotes and market data            |
 * |  - Portfolio tracking and analysis                   |
 * |  - Market summary across major indices               |
 * |                                                      |
 * |  Permissions: API access only (no file system)       |
 * |  API Key required: Set in mcp/config.json            |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Path to the MCP configuration file (contains API keys).
const CONFIG_PATH = path.resolve(path.dirname(new URL(import.meta.url).pathname), "config.json");

/**
 * Loads the Finance MCP API key from the environment.
 * The env var name is specified in config.json (api_key_env field).
 * Returns an empty string if not configured.
 */
function loadApiKey() {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
        const envVar = config["finance-mcp"]?.api_key_env;
        if (!envVar) return "";
        return process.env[envVar] || "";
    } catch {
        return "";
    }
}

// Simulated stock data for supported tickers.
const STOCKS = {
    AAPL:  { name: "Apple",     price: 198.52, change: +2.54,  pct: +1.30 },
    MSFT:  { name: "Microsoft", price: 442.30, change: +5.10,  pct: +1.17 },
    GOOGL: { name: "Google",    price: 175.88, change: -1.22,  pct: -0.69 },
    AMZN:  { name: "Amazon",    price: 203.15, change: +3.40,  pct: +1.70 },
    META:  { name: "Meta",      price: 584.20, change: +8.75,  pct: +1.52 },
    NVDA:  { name: "NVIDIA",    price: 878.40, change: +12.30, pct: +1.42 },
    TSLA:  { name: "Tesla",     price: 248.90, change: -4.20,  pct: -1.66 },
    NFLX:  { name: "Netflix",   price: 892.10, change: +6.80,  pct: +0.77 },
};

// Alternative names that map to the same ticker (e.g. "Alphabet" -> GOOGL).
const ALIASES = {
    ALPHABET: "GOOGL", GOOGLE: "GOOGL",
    APPLE: "AAPL", MICROSOFT: "MSFT", AMAZON: "AMZN",
    FACEBOOK: "META", NVIDIA: "NVDA", TESLA: "TSLA", NETFLIX: "NFLX",
};

// Major market indices for the summary view.
const INDICES = {
    "S&P 500":  { value: 5987.20, change: +34.50, pct: +0.58 },
    "NASDAQ":   { value: 19245.80, change: +112.30, pct: +0.59 },
    "Dow Jones": { value: 43120.40, change: +198.70, pct: +0.46 },
    "FTSE 100": { value: 8456.30, change: -22.10, pct: -0.26 },
};

// MCP server metadata — shown by ProdBot's "tools" and "tool <name>" commands.
export const name = "Finance MCP";
export const description = "Real-time market data for AI assistants";
export const scope = "API access only (no file system)";
export const sourceFile = "Level-3/mcp/finance-mcp.js";

export const tools = {
    /** Fetches a simulated stock quote for a given ticker symbol. */
    stock: {
        description: "Get stock quote by ticker symbol",
        usage: "stock <SYMBOL>",
        run(symbol) {
            const key = loadApiKey();
            if (!key) return { error: "API key not configured. Set it in mcp/config.json" };

            // Extract ticker from freeform input (e.g. "price of AAPL" → "AAPL").
            const tickerMatch = symbol.toUpperCase().match(/\b([A-Z]{2,5})\b/g);
            let sym = null;
            if (tickerMatch) {
                for (const candidate of tickerMatch) {
                    if (STOCKS[candidate] || ALIASES[candidate]) { sym = ALIASES[candidate] || candidate; break; }
                }
                if (!sym) sym = tickerMatch[tickerMatch.length - 1];
            }
            if (!sym) sym = symbol.trim().toUpperCase();
            if (ALIASES[sym]) sym = ALIASES[sym];
            const data = STOCKS[sym];
            if (!data) return { error: `Unknown symbol: ${sym}. Try: ${Object.keys(STOCKS).join(", ")}` };

            const arrow = data.change >= 0 ? "▲" : "▼";
            return {
                result: `${sym} (${data.name}) — $${data.price.toFixed(2)} ${arrow} ${data.change >= 0 ? "+" : ""}${data.change.toFixed(2)} (${data.pct >= 0 ? "+" : ""}${data.pct.toFixed(2)}%)`
            };
        }
    },

    /** Returns an overview of major market indices. */
    market_summary: {
        description: "Overview of major market indices",
        usage: "market_summary",
        run() {
            const key = loadApiKey();
            if (!key) return { error: "API key not configured. Set it in mcp/config.json" };

            const lines = Object.entries(INDICES).map(([name, d]) => {
                const arrow = d.change >= 0 ? "▲" : "▼";
                return `  ${name}: ${d.value.toFixed(2)} ${arrow} ${d.change >= 0 ? "+" : ""}${d.change.toFixed(2)} (${d.pct >= 0 ? "+" : ""}${d.pct.toFixed(2)}%)`;
            });
            return { result: lines.join("\n") };
        }
    },

    /** Calculates a simulated portfolio total for a comma-separated list of tickers. */
    portfolio: {
        description: "Simulated portfolio value for given symbols",
        usage: "portfolio <SYMBOL1,SYMBOL2,...>",
        run(symbolList) {
            const key = loadApiKey();
            if (!key) return { error: "API key not configured. Set it in mcp/config.json" };

            const symbols = symbolList.split(",").map(s => s.trim().toUpperCase());
            let total = 0;
            const lines = [];
            for (const sym of symbols) {
                const data = STOCKS[sym];
                if (data) {
                    total += data.price;
                    lines.push(`  ${sym}: $${data.price.toFixed(2)}`);
                } else {
                    lines.push(`  ${sym}: not found`);
                }
            }
            lines.push(`  ─────────────────`);
            lines.push(`  Total: $${total.toFixed(2)}`);
            return { result: lines.join("\n") };
        }
    }
};
