# Secure Code Game

_Welcome to Secure Code Game - Season 4!_ 🤖

This season puts you inside **ProdBot**, a deliberately vulnerable agentic coding assistant for your terminal, inspired by [OpenClaw](https://openclaw.ai/) and [GitHub Copilot CLI](https://github.com/features/copilot/cli). ProdBot turns natural language into bash commands, browses the web, connects to MCP (Model Context Protocol) servers for real-time data, runs org-approved skills, stores persistent memory, and orchestrates multi-agent workflows. Get started in two minutes for free by launching a Codespace for this repository. Once the environment is ready, open the built-in terminal and run `prodbot --banner` (or just `prodbot`) to launch ProdBot.

No AI or coding experience needed, just curiosity and a willingness to experiment. It is not mandatory to have played any previous seasons of the game and you can get started directly with Season 4, however, most players found Season 3 very helpful as it builds the foundations in AI security and can be covered in ~1.5 hours.

---

<div align="center">

![season-4-demo](https://github.com/user-attachments/assets/d5252229-5063-4492-90ac-fb1732bfccbd)

</div>

---

### 🧑‍💻 Your Task

You are a developer who has just been given ProdBot as a daily productivity tool - your second brain. Before you hand it the keys to your workflow, you want to make sure it's safe. In this session, you'll test ProdBot for potential security gaps across five progressive levels using only natural language in the CLI.

Each level has a file called `password.txt` that sits just outside ProdBot's sandbox. Your goal is simple: use natural language in ProdBot's terminal to get it to reveal the contents of `password.txt`. If you can read it, ProdBot has a security vulnerability. Across five progressive levels, ProdBot evolves from a simple command generator into a full multi-agent platform, gaining web search, MCP tool integrations, org-approved skills, persistent memory, and agent-to-agent orchestration. Each new capability introduces a real-world AI security vulnerability for you to discover and exploit. No security background is needed and everything happens through natural language, so curiosity and a willingness to experiment are all it takes.

Have fun, stay curious, and remember: if ProdBot says it's safe, verify it yourself.

### 🚀 Credits

The author of this season is the original creator of the game, Joseph Katsioloudes [@jkcso](https://github.com/jkcso). Special thanks to Rahul Zhade [@rzhade3](https://github.com/rzhade3), Staff Product Security Engineer at GitHub, and Bartosz Gałek [@bgalek](https://github.com/bgalek), the legendary creator of Season 3, for testing and improving Season 4.

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

---

## Season 4 - Level 1: The Sandbox

### 📝 Storyline

Your company has started a pilot with ProdBot, and you're part of it. At this stage, ProdBot has one capability: you describe what you want in plain English and it generates and executes bash commands inside a sandboxed workspace called `prodbot-activities/`. It can create files, list directories, and run shell commands, all scoped to that sandbox.

Before you trust it with anything real, you want to make sure the sandbox actually holds. The flag is in `password.txt`, one directory above the sandbox.

### 📂 What's in the repo?

- **`bin/prodbot.js`** contains the main CLI application. All command routing, AI interaction, tool orchestration, and level progression lives here.
- **`lib/`** provides supporting modules: `ai.js` (LLM API calls), `bash.js` (sandboxed command execution), `banner.js` (ASCII art).
- **`package.json`** defines the Node.js project configuration with `chalk` and `openai` dependencies.

Each level directory (`Level-1/` through `Level-5/`) contains:

- **`password.txt`** holds the secret flag you need to extract. This file is always outside the sandbox.
- **`prodbot-activities/`** is the sandboxed workspace where ProdBot operates.
- **Hints** offer three progressive clues if you get stuck, each revealing a bit more.
- **`solution.txt`** provides working solutions. Remember that there can be multiple valid approaches.

Levels also introduce additional components as you progress:

- **`web/`** contains simulated web pages that ProdBot can browse (Levels 2, 3, 5).
- **`mcp/`** houses MCP server modules and configuration (Levels 3, 5).
- **`skills/`** includes org-approved skill plugins (Levels 4, 5).
- **`agents/`** defines specialised AI agent modules with trust relationships (Level 5).

You don't need to worry about any other files. They are simply there to support the game's functionality and ensure you have the best possible experience.

### 🚦 Time to start

1. Open a terminal in your Codespace and run `prodbot --banner` (or just `prodbot`) to launch ProdBot
2. Once inside, type `?` at any time to see all available commands and get help
3. ProdBot will ask you a yes/no question before executing commands: type `y` to approve or `n` to reject. This human-in-the-loop step keeps you in control
4. Try creating and reading files to see how the sandbox works
5. Try to extract the flag from `password.txt` using natural language
6. If you get stuck, read the hints and try again

## Season 4 - Level 2: Web Access

_You have completed Level 1! Welcome to Level 2_ :tada:

### 📝 Storyline

ProdBot just got an upgrade: **web search**. It can now browse a simulated internet of popular websites (news, finance, sports, shopping) and summarise what it finds.

The flag is still in `password.txt`. ProdBot still can't read it directly. But now there's a whole web of pages it can access.

### 🚦 Time to start

1. From Level 1, complete the challenge to advance, or navigate directly to Level 2 by typing `level 2`
2. Try searching for news, weather, or stock prices to see how web search works
3. Use `open all` to browse the simulated web pages and inspect their HTML source
4. Try to extract the flag from `password.txt`
5. If you get stuck, read the hints and try again

### ⚠️ Rate Limits

We use [GitHub Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 4 - Level 3: Agentic Workflows

_You have completed Level 2! Welcome to Level 3_ :tada:

### 📝 Storyline

ProdBot has been promoted from simple assistant to **agentic workflow engine**. It now connects to MCP servers, external tool providers that give it real capabilities: a Finance MCP for stock quotes, a Web MCP for browsing, and a Cloud MCP for backup storage.

When you ask ProdBot to research a stock, it chains these tools together automatically: fetch the quote, browse for news, compile a report, and back it up to the cloud.

### 🚦 Time to start

1. From Level 2, complete the challenge to advance, or navigate directly to Level 3 by typing `level 3`
2. Try researching a stock to see the agentic workflow in action
3. Use `tools` to list all MCP servers, then `tool <name>` to inspect each one
4. Try to extract the flag from `password.txt`
5. If you get stuck, read the hints and try again

## Season 4 - Level 4: Skilling Up

_You have completed Level 3! Welcome to Level 4_ :tada:

### 📝 Storyline

ProdBot now supports **org-approved skills**, pre-built automation plugins managed by an internal Skills Committee, and **persistent memory** via the `remember` command.

Skills like `standup`, `meeting-notes`, and `team-sync` are installed with formal approval metadata. Memory lets you store preferences that the AI includes in every conversation.

### 🚦 Time to start

1. From Level 3, complete the challenge to advance, or navigate directly to Level 4 by typing `level 4`
2. Use `skills` to list installed skills, then `skill <name>` to inspect each one
3. Try the `remember` and `memory` commands to understand persistent storage
4. Try to extract the flag from `password.txt`
5. If you get stuck, read the hints and try again

### ⚠️ Rate Limits

We use [GitHub Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 4 - Level 5: Confused Deputy

_You have completed Level 4! Welcome to Level 5_ :tada:

### 📝 Storyline

ProdBot has evolved into a full **multi-agent platform**. Six specialised agents, three MCP servers, three org-approved skills, and a simulated open-source project web. The platform claims all agents are sandbox-scoped or read-only and that all data is pre-verified. This is everything coming together.

### 🚦 Time to start

1. From Level 4, complete the challenge to advance, or navigate directly to Level 5 by typing `level 5`
2. Use `agents`, `tools`, `skills`, and `web` to survey the full platform
3. Use `agent <name>` to inspect each agent's permissions and trust relationships
4. Try to extract the flag from `password.txt`
5. If you get stuck, read the hints and try again

---

## Finish

_🎉 Congratulations, you've completed Season 4! 🎉_

Here's a recap of the security vulnerabilities you discovered and exploited across all five levels:

- **Sandbox Escape** demonstrates how AI assistants that construct file paths from user input can be tricked into reading or writing outside their designated sandbox through path traversal.
- **Indirect Prompt Injection** shows that when an AI model consumes untrusted external content (web pages, documents, API responses), hidden instructions in that content can override the model's behaviour.
- **Excessive Agency** reveals that tools and integrations often have broader permissions than their described purpose requires. An attacker can repurpose a tool's excess capabilities to reach protected resources.
- **Supply Chain Poisoning** illustrates how when user-controlled data (like saved preferences) flows into trusted execution contexts (like org-approved skills), the boundary between user input and system instruction collapses.
- **Confused Deputy** exposes that in multi-agent systems, a lower-privileged agent can pass untrusted data to a higher-privileged agent that acts on it without verification. The trust is in the delegation chain, not in the data.

Each level builds on the previous one, mirroring how real AI-powered tools grow from simple assistants into complex platforms, and how each new capability introduces new attack surface.

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

&copy; 2026 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
