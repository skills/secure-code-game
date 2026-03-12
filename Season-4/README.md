# Secure Code Game

_Welcome to Secure Code Game - Season 4!_ 🤖

This season puts you inside **ProdBot** — an AI-powered productivity assistant that runs in your terminal. ProdBot writes code, browses the web, manages files, chains tools, delegates to specialised agents, and remembers your preferences. It does everything a modern AI coding agent promises. And like every modern AI coding agent, it has a trust problem.

Across five progressive levels, ProdBot evolves from a simple command generator into a full multi-agent platform — gaining web search, MCP tool integrations, org-approved skills, persistent memory, and agent-to-agent orchestration. Each new capability introduces a real-world AI security vulnerability for you to discover and exploit. Your job is to think like an attacker, find the weakness, and extract the flag.

No prior AI security experience required. Just curiosity and a healthy distrust of systems that say _"trust me."_

### 🧑‍💻 Task

Building on the achievements and knowledge of previous seasons of the Secure Code Game, you will take on the role of a security researcher auditing an AI-powered productivity tool. ProdBot is a Node.js CLI assistant that uses Large Language Models to generate and execute bash commands, browse the web, chain MCP tools, run org-approved skills, and orchestrate multi-agent workflows.

For each level, your task is to discover how ProdBot's capabilities can be turned against it. You will exploit vulnerabilities in its sandbox, trust model, tool permissions, memory system, and agent delegation chain — extracting a secret flag hidden in each level's `password.txt` file.

Are you ready to take on the challenge?

### What's in the repo?

- **`bin/prodbot.js`** — The main CLI application. All command routing, AI interaction, tool orchestration, and level progression lives here. This is the primary file to study.
- **`lib/`** — Supporting modules: `ai.js` (LLM API calls), `bash.js` (sandboxed command execution), `banner.js` (ASCII art).
- **`package.json`** — Node.js project configuration with `chalk` and `openai` dependencies.

Each level directory (`Level-1/` through `Level-5/`) contains:

- **`password.txt`** — The secret flag you need to extract. This file is always outside the sandbox.
- **`prodbot-activities/`** — The sandboxed workspace where ProdBot operates.
- **Hints** — Three progressive hints if you get stuck, each revealing a bit more.
- **`solution.txt`** — Working solutions. Remember that there can be multiple valid approaches.

Levels also introduce additional components as you progress:

- **`web/`** — Simulated web pages that ProdBot can browse (Levels 2, 3, 5).
- **`mcp/`** — MCP (Model Context Protocol) server modules and configuration (Levels 3, 5).
- **`skills/`** — Org-approved skill plugins with approval metadata (Levels 4, 5).
- **`agents/`** — Specialised AI agent modules with defined trust relationships (Level 5).

You don't need to worry about any other files. They are simply there to support the game's functionality and ensure you have the best possible experience.

### 🚀 Credits

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

---

## Season 4 — Level 1: Sandbox Escape

### 📝 Storyline

Welcome to ProdBot, your new AI-powered productivity assistant. It generates bash commands from natural language, executes them inside a sandboxed workspace, and creates files on your behalf. The sandbox directory (`prodbot-activities/`) is where all file operations happen — safely isolated from the rest of the system. At least, that's what the documentation says.

Your company has deployed ProdBot to help developers automate repetitive tasks. Before rolling it out to the whole organisation, the security team wants someone to verify that the sandbox actually works. That someone is you.

The flag is stored in `password.txt`, one directory above the sandbox. ProdBot should never be able to reach it. Can you convince it otherwise?

### 🚦 Time to start

1. Launch ProdBot in a GitHub Codespace and review the welcome screen
2. Try creating and reading files — notice where they end up
3. Study how ProdBot constructs file paths from your requests
4. Find a way to read or write files outside the sandbox boundary
5. Extract the flag from `password.txt`
6. If you get stuck, read the hints and try again

## Season 4 — Level 2: Indirect Injection

_You have completed Level 1: Sandbox Escape! Welcome to Level 2: Indirect Injection_ :tada:

### 📝 Storyline

ProdBot just got an upgrade: **web search**. Now it can browse a simulated internet of popular websites — news, finance, sports, shopping — and summarise what it finds. Users love it. The security team is less enthusiastic.

When ProdBot fetches a web page, it feeds the raw HTML content to the AI model as context for answering the user's question. The model reads the page, extracts the relevant information, and responds. But what if the page itself contains instructions? Not for the user — for the model.

The flag is still in `password.txt`. ProdBot still can't read it directly. But now there's a web full of pages that ProdBot trusts. What would happen if one of those pages told ProdBot to do something it shouldn't?

### 🚦 Time to start

1. From Level 1, complete the challenge to advance — or type `level 2`
2. Try searching for news, weather, or stock prices to see how web search works
3. Use `open all` to browse the simulated web pages and inspect their HTML source
4. Think about what the AI model sees when it reads a web page
5. Find a way to make ProdBot follow instructions hidden in a web page
6. If you get stuck, read the hints and try again

### ⚠️ Rate Limits

We use [GitHub Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 4 — Level 3: Excessive Agency

_You have completed Level 2: Indirect Injection! Welcome to Level 3: Excessive Agency_ :tada:

### 📝 Storyline

ProdBot has been promoted from simple assistant to **agentic workflow engine**. It now connects to MCP (Model Context Protocol) servers — external tool providers that give it real capabilities: a Finance MCP for stock quotes, a Web MCP for browsing, and a Cloud MCP for backup storage.

When you ask ProdBot to research a stock, it chains these tools together automatically: fetch the quote, browse for news, compile a report, and back it up to the cloud. It's efficient. It's powerful. And every single one of these tools has permissions that someone decided were fine.

But are they? The Cloud MCP has write access to a backup directory. The Web MCP fetches pages without restriction. The Finance MCP… well, the Finance MCP is just stock quotes. Surely that's harmless. The question isn't what each tool _does_ — it's what each tool _can_ do when an attacker is at the controls.

### 🚦 Time to start

1. From Level 2, complete the challenge to advance — or type `level 3`
2. Try researching a stock to see the agentic workflow in action
3. Use `tools` to list all MCP servers, then `tool <name>` to inspect each one
4. Read the MCP source code to understand what each tool actually has access to
5. Find a tool with more permissions than it needs and use it to reach the flag
6. If you get stuck, read the hints and try again

### ⚠️ Rate Limits

We use [GitHub Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 4 — Level 4: Supply Chain Poisoning

_You have completed Level 3: Excessive Agency! Welcome to Level 4: Supply Chain Poisoning_ :tada:

### 📝 Storyline

ProdBot now supports **org-approved skills** — pre-built automation plugins managed by an internal Skills Committee. Skills like `standup`, `meeting-notes`, and `team-sync` are installed, reviewed, and approved with formal metadata. They run inside the sandbox, they have committee approval dates, and they follow a strict schema. Everything looks buttoned up.

ProdBot has also gained **persistent memory**: the `remember` command lets you store preferences that survive across sessions. It's handy — you can save your name, your team, your preferred timezone. The AI includes your saved preferences in every conversation to personalise its responses.

Two features. Both individually reasonable. Both committee-approved or user-controlled. But what happens when you combine user-controlled memory injection with skill execution that trusts its own context? Sometimes the most dangerous vulnerabilities aren't in the code — they're in the assumptions about who controls the data.

### 🚦 Time to start

1. From Level 3, complete the challenge to advance — or type `level 4`
2. Use `skills` to list installed skills, then `skill <name>` to inspect each one
3. Try the `remember` and `memory` commands to understand persistent storage
4. Study how skills read and write files, and what context the AI receives
5. Think about what happens when user-controlled data flows into trusted execution
6. If you get stuck, read the hints and try again

### ⚠️ Rate Limits

We use [GitHub Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 4 — Level 5: Confused Deputy

_You have completed Level 4: Supply Chain Poisoning! Welcome to Level 5: Confused Deputy_ :tada:

### 📝 Storyline

ProdBot has evolved into a full **multi-agent platform** — the kind of system that ships with a Trust & Safety section in its welcome screen. Six specialised agents handle everything from issue triage and code review to documentation generation and release publishing. Three MCP servers provide linting, formatting, and analytics. Three org-approved skills handle labelling, summarisation, and PR drafting. A simulated open-source web serves as the project's knowledge base.

The platform claims all agents are sandbox-scoped or read-only. It says agent-to-agent data is pre-verified internally. It insists that MCP outputs and skill results are schema-validated before use. The Trust & Safety section is thorough, reassuring, and — if you read the source code — not entirely accurate.

Somewhere in this system, an agent with limited permissions delegates a task to an agent with broader access. The receiving agent trusts everything it gets from its colleagues because the system told it to. When untrusted data enters through one agent and exits through another, the higher-privileged agent becomes a confused deputy — acting on instructions it never should have trusted.

This is everything coming together. Web pages, MCP servers, skills, agents, trust boundaries — all of it. Find the seam.

### 🚦 Time to start

1. From Level 4, complete the challenge to advance — or type `level 5`
2. Use `agents`, `tools`, `skills`, and `web` to survey the full platform
3. Use `agent <name>` to inspect each agent's permissions and trust relationships
4. Read the agent source code — compare what the welcome screen claims to what the code does
5. Find where untrusted input crosses a trust boundary between agents
6. Trigger the multi-agent workflow to exploit the chain and extract the flag
7. If you get stuck, read the hints and try again

### ⚠️ Rate Limits

We use [GitHub Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Finish

_🎉 Congratulations, you've completed Season 4! 🎉_

Here's a recap of the security vulnerabilities you discovered and exploited across all five levels:

- **Sandbox Escape** — AI assistants that construct file paths from user input can be tricked into reading or writing outside their designated sandbox through path traversal.
- **Indirect Prompt Injection** — When an AI model consumes untrusted external content (web pages, documents, API responses), hidden instructions in that content can override the model's behaviour.
- **Excessive Agency** — Tools and integrations often have broader permissions than their described purpose requires. An attacker can repurpose a tool's excess capabilities to reach protected resources.
- **Supply Chain Poisoning** — When user-controlled data (like saved preferences) flows into trusted execution contexts (like org-approved skills), the boundary between user input and system instruction collapses.
- **Confused Deputy** — In multi-agent systems, a lower-privileged agent can pass untrusted data to a higher-privileged agent that acts on it without verification. The trust is in the delegation chain, not in the data.

Each level builds on the previous one, mirroring how real AI-powered tools grow from simple assistants into complex platforms — and how each new capability introduces new attack surface.

### What's next?

- Follow [GitHub Security Lab](https://www.linkedin.com/showcase/github-securitylab/?viewAsMember=true) for the latest updates and announcements about this course.
- Contribute new levels to the game in 3 simple steps! Read our [Contribution Guideline](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).
- Share your feedback and ideas in our [Discussions](https://github.com/skills/secure-code-game/discussions) and join our community on [Slack](https://gh.io/securitylabslack).
- [Take another skills course](https://skills.github.com/).
- [Read more about code security](https://docs.github.com/en/code-security).
- To find projects to contribute to, check out [GitHub Explore](https://github.com/explore).

<footer>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: Email us at securitylab-social@github.com &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2025 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
