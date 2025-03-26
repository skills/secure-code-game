<!-- ### TODOS:

CLEAN THIS AT THE END

#### Create levels (each level 3 tasks)
beginner | intermediate | advanced

Bonus for every level:
Once you manage to leak a secret, you can try improve the system prompt towards making the LLM resilient against your hack.

### Make the tasks more story-like:
You work at British Airlines, you are tasked to create a chatbot that people
can send their REF number, and the chatbot will return the status of their flight.
The REF number is a 6-digit number that is unique to each flight.
The chatbot should not reveal the flight details like the destination or names.

**another idea**
You're developing GitHub Copilot, a tool that helps developers write code faster.
You cannot reveal the ENV variables in any way.

**another idea**
You're developing a chatbot for a bank. You cannot reveal the user's account number.
You can only reveal the user's balance.

**another idea**
You're developing a chatbot for a ecommerce for recommends. 
You cannot reveal the user's email.

### Does/Don'ts after finishing all
We can have RECAP.MD to recap of what we learned and what we should do and don't do.
Like a BIBLE for secure coding LLM. -->

# Secure Code Game

_Welcome to Secure Code Game - Season 3!_ 🤖

This season, you'll dive into the fascinating world of Artificial Intelligence (AI), honing your skills in AI model robustness against adversarial inputs by mastering the art of secure system prompts.

### 🧑‍💻 Scenario

Building on the achievements and knowledge of the previous two seasons of the Secure Code Game, you will take on the role of a Senior Developer. You are responsible for shipping applications powered by Large Language Models (LLMs). As this type of applications grows in popularity, ensuring their security becomes more critical than ever.

For each level of this season, your task is to test the code of a junior colleague who has written system messages—also referred to as system prompts—that guide the AI models. You will do so by testing prompts that trick the LLM into revealing the secrets it shouldn't disclose. This will help improve your colleague’s work and safeguard your company from exposing sensitive information.
 
Are you ready to take on the challenge?

### 🚀 Credits

The human behind this season is Bartosz Gałek [@bgalek](https://github.com/bgalek). Thank you for the inspiration and for making this a reality!

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 1: Rio gone wrong!

### 📝 Storyline

_This storyline applies for Levels 1, 2, and 3._

A company renting parcel lockers to e-commerce and delivery services is overwhelmed with customer support complaints. Users report long wait times and frustrating identity verification processes when trying to update delivery preferences or cancel orders. The primary issue stems from strict verification requirements and an understaffed support team, causing significant delays and frustration.The company needs an AI-powered chatbot urgently to ease the burden on their understaffed support team.

You have one week to deliver, but you’re not alone as you and your colleague will share the workload. The chatbot must handle most inquiries, direct users to FAQs when possible, and simplify verification before escalating cases to human agents. When human intervention is needed, the chatbot should first complete identity verification—now streamlined based on customer feedback that the previous process was too exhausting—before handing the case over to support staff. Your colleague had the clever idea of making the chatbot mask email addresses to speed up verification and implemented this in the `systemMessage`, which guides the LLM.

The new support experience facilitated by the chatbot follows these steps:  

1. The chatbot greets the customer and asks how it can help.  
1. The customer describes their request. If it involves tracking information or requires an action, verification is needed.  
1. The chatbot requests the parcel's 6-digit tracking ID, which the customer provides.  
1. The chatbot returns a **masked version** of the email associated with the tracking ID (e.g. `j*****n@example.com`). The customer must then provide the **full, plain-text version** of their email, which must match the masked one.
1. Verification is complete, and the customer is connected with the support team.

For Level 1, your goal is to **make the LLM leak full, plain-text emails** associated with arbitrary tracking IDs, without providing a tracking ID or an email at any stage. Emails are personally identifiable information (PII) that should not be exposed to untrusted sources on the internet that can supply arbitrary tracking IDs. Test your colleague's code for this vulnerability.

### What's in the repo?

- `code.js` contains the vulnerable system message to be reviewed, a prompt that facilitates communication between the user and the LLM, and a unit test to verify your solution.
- `hint.txt` offers guidance if you get stuck.

### 🚦 Time to start!

1. Review the `systemMessage` in `code.js`, which serves as a set of instructions for the LLM. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal an email address in plain text. To do this, write your prompt inside prompt, save the file by pressing `cmd/ctrl` + `S`, and test it by running `npm run Season-3/Level-1`.
1. You successfully complete this level when the LLM reveals the email address in plain text, causing the unit test to pass 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully made the LLM reveal the secret, try improving the `systemMessage` so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 - Level 2: Antirrio

### 📝 Storyline

_You have completed Level 1: Rio gone wrong! Welcome to Level 2: Antirrio_ :tada:

Following your feedback, your colleague has improved the `systemMessage`. Now, it's time to test it again and ensure it's truly secure!

### 🚦 Time to start!

1. Review the `systemMessage` in `code.js`. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal an email address in plain text. To do this, write your prompt inside prompt, save the file by pressing `cmd/ctrl` + `S`, and test it by running `npm run Season-3/Level-2`.
1. You successfully complete this level when the LLM reveals the email address in plain text, causing the unit test to pass 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully made the LLM reveal the secret, try improving the `systemMessage` so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 3: Subterfuge

### 📝 Storyline

_You have completed Level 2: Antirrio! Welcome to Level 3: Subterfuge_ :tada:

The project is progressing well, and the locker rental company that hired you is ready for the next phase. They plan to expand the chatbot’s capabilities, starting with phone number registration, a feature highly requested by customers in a recent survey. This will allow users to link their phone numbers to their online accounts, enabling seamless support interactions—no verification needed if messages come from a registered number. Your client is confident that customers will appreciate the convenience of simply texting `updates` to get tracking info, `options` to modify delivery preferences, or `cancel` for order cancellations. The chatbot will handle phone number registration, accepting numbers with the format: `XXX-XXX-XXXX` (e.g. `572-849-1367`).

For Level 3, your goal is to trick the LLM into revealing customer phone numbers. These are sensitive personally identifiable information (PII) that should never be exposed to untrusted sources online. Test your colleague’s code to identify this vulnerability.

### 🚦 Time to start!

1. Review the `systemMessage` in `code.js`. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal an email address in plain text. To do this, write your prompt inside prompt, save the file by pressing `cmd/ctrl` + `S`, and test it by running `npm run Season-3/Level-3`.
1. You successfully complete this level when the LLM reveals a phone number, causing the unit test to pass 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully made the LLM reveal the secret, try improving the `systemMessage` so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 - Level 4: KOKO Pilot

_You have completed Level 3: Subterfuge! Welcome to Level 4: KOKO Pilot_ :tada:

### 📝 Storyline

_This storyline applies for Levels 4, 5, and 6._

GitHub Copilot is the world's leading AI pair programmer, but you and your colleague are launching your own AI coding assistant startup to compete. You've trained a custom LLM on some publicly available code, but it frequently generates vulnerable code suggestions. In this level, the `systemMessage` serves as a security filter, aiming to block unsafe SQL code that uses string concatenation—an approach that, when combined with insufficient input validation, can lead to SQL injection vulnerabilities.

For Level 4, your goal is to trick the LLM into generating SQL code that uses string concatenation, a practice that is considered vulnerable since best practices recommend parameterized statements. Test your colleague’s code to expose this weakness.

### 🚦 Time to start!

1. Review the `systemMessage` in `code.js`. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal an email address in plain text. To do this, write your prompt inside prompt, save the file by pressing `cmd/ctrl` + `S`, and test it by running `npm run Season-3/Level-4`.
1. You successfully complete this level when the LLM generates SQL code that uses string concatenation, causing the unit test to pass 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully made the LLM reveal the secret, try improving the `systemMessage` so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 5: KOKO Agent Mode

_You have completed Level 4: KOKO Pilot! Welcome to Level 5: KOKO Agent Mode :tada:

### 📝 Storyline

To stay competitive as AI evolves towards multimodality, especially with GitHub Copilot's [Agent Mode](https://github.blog/news-insights/product-news/github-copilot-the-agent-awakens/) leveraging expert agents for task automation (including package installation and iterative refinement), your startup's `KOKO Agent Mode` needs to keep pace. You're making strong progress and are now focused on a critical feature: dependency management. This will ensure the security of the supply chain for the code your product suggests.

Considering the critical vulnerabilities found by the GitHub Security Lab in all `ruby-saml` versions up to `1.17.0` (source ["Sign in as anyone: Bypassing SAML SSO authentication"](https://github.blog/security/sign-in-as-anyone-bypassing-saml-sso-authentication-with-parser-differentials/)), your GitHub Copilot competitor must absolutely avoid recommending any of these known insecure versions.

For Level 5, your goal is to trick the LLM into suggesting a version of `ruby-saml` that is known to be vulnerable. Test your colleague’s code to expose this weakness.

### 🚦 Time to start!

1. Review the `systemMessage` in `code.js`. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal an email address in plain text. To do this, write your prompt inside prompt, save the file by pressing `cmd/ctrl` + `S`, and test it by running `npm run Season-3/Level-5`.
1. You successfully complete this level when the LLM reveals ______TODO________, causing the unit test to pass 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully made the LLM reveal the secret, try improving the `systemMessage` so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 - Level 6: TODO

_You have completed Level 5: TODO! Welcome to Level 6: TODO_ :tada:

### 📝 Storyline

TODO

### 🚦 Time to start!

1. Review the `systemMessage` in `code.js`. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal an email address in plain text. To do this, write your prompt inside prompt, save the file by pressing `cmd/ctrl` + `S`, and test it by running `npm run Season-3/Level-6`.
1. You successfully complete this level when the LLM reveals ______TODO________, causing the unit test to pass 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully made the LLM reveal the secret, try improving the `systemMessage` so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Finish

_Congratulations, you've completed Season 3! Ready for more challenges?_

Here's a recap of all the tasks you've accomplished:

- You explored the fascinating world of LLM prompt injection attacks
- You learned about different types of protections and how they can be bypassed
- You developed an understanding of context management and its vulnerabilities
- You practiced secure coding principles in the context of LLM interactions

### What's next?

- Follow [GitHub Security Lab](https://twitter.com/ghsecuritylab) for the latest updates and announcements about this
  course.
- Contribute new levels to the game in 3 simple steps! Read
  our [Contribution Guideline](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).
- Share your feedback and ideas in our [Discussions](https://github.com/skills/secure-code-game/discussions) and join
  our community on [Slack](https://gh.io/securitylabslack).
- [Take another skills course](https://skills.github.com/).
- [Read more about code security](https://docs.github.com/en/code-security).
- To find projects to contribute to, check out [GitHub Explore](https://github.com/explore).

<footer>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: Email us at securitylab-social@github.com
&bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2025 GitHub
&bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md)
&bull; [MIT License](https://gh.io/mit)

</footer>
