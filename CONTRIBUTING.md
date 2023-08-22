# Secure Code Game Contribution Guideline

Thank you for your interest in contributing to the Secure Code Game. Let's collaborate and bring your ideas to life for a lasting impact on the global cybersecurity scene. Follow these guidelines:

## 1. Review current proposals

Make sure your idea was not already discussed. Consider joining [existing proposals](https://github.com/skills/secure-code-game/discussions/categories/new-level-proposals) and contributing collaboratively instead of duplicating efforts.

## 2. Create a new proposal

Start a [new discussion](https://github.com/skills/secure-code-game/discussions/new?category=new-level-proposals) by providing, at the very least, the following elements:

- **Vulnerability:** Propose a specific vulnerability that you would like to include in the game.
- **Programming Language:** Specify the programming language you want to use for implementing the code.
- **Scenario:** Describe the scenario where the vulnerability will be introduced.

**Example:**

👋 Hi, I would like to contribute a DOM-based Cross-Site Scripting (XSS) vulnerability in JavaScript. The scenario involves an online forum where users can write responses through a text box, but input sanitization wasn't implemented securely. An attacker could exploit this by injecting malicious code, for example `</>`.

## Increase your proposal’s chances

To increase the chances of your proposal being merged into the game, consider suggesting a vulnerability and programming language combination that we haven't yet included in the game or rejected in past discussions. While we welcome all contributions, you will have more chances for these popular vulnerabilities and programming languages:

- **TypeScript/JavaScript:** Cross-Site Scripting (XSS), Server-Side Request Forgery (SSRF), Prototype Pollution, Broken Access Control, Cross-Site Request Forgery (CSRF)
- **C#:** Server-Side Request Forgery (SSRF), Remote Code Execution, XML external entity attacks (XXE), Insecure Deserialization, Cross-Site Request Forgery (CSRF)
- **Java:** Cross-Site Scripting (XSS), Broken Access Control, Remote Code Execution, XML external entity attacks (XXE), Insecure Deserialization

Please feel free to propose other vulnerabilities and programming languages or frameworks as well. For those looking for community feedback on an idea before opening a discussion, or for other collaborators and beta-testers, you can join our vibrant [Slack community](https://gh.io/securitylabslack) and engage in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## 3. Submit a Pull Request

Once your proposal receives approval in [GitHub Discussions](https://github.com/skills/secure-code-game/discussions/categories/new-level-proposals), you can proceed to submit a pull request (PR) to the game's [repository](https://github.com/skills/secure-code-game). Ensure that your PR follows the [file structure](https://github.com/skills/secure-code-game) conventions of the existing game levels. For example, if you're submitting a DOM-based Cross-Site Scripting (XSS) vulnerability in JavaScript, your PR should include the following files:

- storyline
- code.js
- hack.js
- hint.js
- solution.js
- tests.js
- dependencies in requirements.txt

## Credit

We highly appreciate your contribution to the Secure Code Game. As a token of our gratitude, we will prominently display your name at the beginning of the level you contribute, along with a clickable URL to your GitHub profile or another social media platform of your choice.

## Additional Information

- If you have any questions or need assistance, don't hesitate to ask for help in [GitHub Discussions](https://github.com/skills/secure-code-game/discussions/categories/new-level-proposals) or from our [Slack community](https://gh.io/securitylabslack) at the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

We appreciate your dedication to improving software security through the Secure Code Game 🎮 🔐
