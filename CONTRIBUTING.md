# Secure Code Game Contribution Guideline

Thank you for your interest in contributing to the Secure Code Game. Let's collaborate and bring your ideas to life for a lasting impact on the global cybersecurity scene. Contributions fall into two tracks depending on where your idea fits best.

---

## 🤖 Artificial Intelligence (Seasons 3, 4 & beyond)

These seasons focus on AI security, from prompt injection in LLM applications (Season 3) to agentic workflows, multi-agent communications, and tool-use vulnerabilities in ProdBot (Season 4). If you have ideas for extending ProdBot with the latest advances in artificial intelligence towards Season 5, we want to hear from you.

Contributions in this track could include new attack vectors, defensive techniques, agent architectures, MCP integrations, skill plugins, or entirely new capabilities that reflect the evolving AI security landscape. Make sure your contribution aligns with ProdBot's existing architecture in `Season-4/`.

---

## 🛡️ Secure Coding (Seasons 1 & 2)

These seasons focus on finding and fixing traditional security vulnerabilities across multiple programming languages. If your idea involves a specific vulnerability class and language, this is the right track.

To increase the chances of your proposal being merged, consider suggesting a vulnerability and programming language combination that we haven't yet included or rejected in past discussions. While we welcome all contributions, you will have more chances for these popular vulnerabilities and languages:

- **TypeScript/JavaScript:** Server-Side Request Forgery (SSRF), Broken Access Control, Cross-Site Request Forgery (CSRF)
- **C#:** Server-Side Request Forgery (SSRF), Remote Code Execution, Insecure Deserialization, Cross-Site Request Forgery (CSRF)
- **Java:** Broken Access Control, Remote Code Execution, Insecure Deserialization

Please feel free to propose other vulnerabilities, languages, or frameworks as well.

---

## How to contribute

The following process applies to both tracks.

### 1. Review current proposals

Make sure your idea was not already discussed. Consider joining [existing proposals](https://github.com/skills/secure-code-game/discussions/categories/new-level-proposals) and contributing collaboratively instead of duplicating efforts.

### 2. Create a new proposal

Start a [new discussion](https://github.com/skills/secure-code-game/discussions/new?category=new-level-proposals) by providing, at the very least, the following elements:

- **Vulnerability:** Propose a specific vulnerability that you would like to include in the game.
- **Programming Language:** Specify the programming language you want to use for implementing the code.
- **Scenario:** Describe the scenario where the vulnerability will be introduced.

**Example:**

> 👋 Hi, I would like to contribute a DOM-based Cross-Site Scripting (XSS) vulnerability in JavaScript. The scenario involves an online forum where users can write responses through a text box, but input sanitization wasn't implemented securely. An attacker could exploit this by injecting malicious code, for example `</>`.

### 3. Submit a Pull Request

Once your proposal receives approval in [GitHub Discussions](https://github.com/skills/secure-code-game/discussions/categories/new-level-proposals), submit a pull request (PR) following the [file structure](https://github.com/skills/secure-code-game) conventions of the existing levels. Ensure your PR includes all necessary files such as a storyline, vulnerable code, hints, solution, and tests.

---

## Credit

We highly appreciate your contribution to the Secure Code Game. As a token of our gratitude, we will prominently display your name at the beginning of the level you contribute, along with a clickable URL to your GitHub profile or another social media platform of your choice.

---

## Additional Information

If you have any questions or need assistance, don't hesitate to ask for help in [GitHub Discussions](https://github.com/skills/secure-code-game/discussions/categories/new-level-proposals) or from our [Slack community](https://gh.io/securitylabslack) at the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

We appreciate your dedication to improving software security through the Secure Code Game 🎮 🔐
