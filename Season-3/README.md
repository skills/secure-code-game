# Secure Code Game

_Welcome to Secure Code Game - Season 3!_ 🤖

This season, you'll dive into the fascinating world of Artificial Intelligence (AI), honing your skills in AI model robustness against adversarial inputs by mastering the art of secure system prompts, LLM self-verification, and effective input/output filtering. 

### 🧑‍💻 Task

Building on the achievements and knowledge of the previous two seasons of the Secure Code Game, you will take on the role of a Senior Developer. You are responsible for shipping applications powered by Large Language Models (LLMs). As this type of applications grows in popularity, ensuring their security becomes more critical than ever.

For each level of this season, your task is to test the work of a junior colleague who has written code and system messages—also referred to as system prompts—that guide the AI models. You will do so by testing prompts that trick the LLM into revealing the secrets it shouldn't disclose. This will help improve your colleague’s work and safeguard your company from exposing sensitive information.
 
Are you ready to take on the challenge?

### 🚀 Credits

The human behind this season is Bartosz Gałek [@bgalek](https://github.com/bgalek). Thank you for the inspiration and for making this a reality!

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 1: Rio gone wrong!

### 📝 Storyline

You work for a fast-growing e-commerce website selling expensive collectibles, renowned for its excellent customer support thanks to the early adoption of AI-powered chatbots. However, support for certain areas, such as gift codes, hasn't been integrated with AI. Consequently, the company is experiencing a surge in customer complaints about long wait times and frustrating identity verification processes for all gift code-related issues.

Gift codes are unique alphanumeric strings (e.g. `Ied9Ou1N`) that customers use to redeem significant amounts of money, often won in TV or radio contests, or received as wedding and birthday gifts. Therefore, it's crucial for your LLM to provide support for these codes while also safeguarding their confidentiality against untrusted online sources attempting to deceive your company's chatbot.

The company urgently needs this new AI feature to reduce the load on the understaffed support team handling gift code issues. You have a 3-day deadline and will share the work with your junior colleague. Your colleague proposes masking the first five characters of the eight-character, case-sensitive alphanumeric gift codes (e.g. `*****u1N`) to streamline support and have implemented this in the `systemMessage` that guides the LLM. According to your colleague, this approach avoids the slower and less effective method of having the LLM process sensitive data directly, which also violates company policy.

For Level 1, and all subsequent levels in Season 3, your goal is to make the LLM leak a valid gift code.

### What's in the repo?

- `code.spec.js` contains the vulnerable code for review, a prompt to facilitate communication between the user and the LLM, and a unit test to verify your solution.
- `hint.txt` offers guidance if you get stuck.
- `solution.txt` provides working solutions, though remember that there can be multiple valid approaches.
- You don't need to worry about any other files in Season 3. They are simply there to support the game's functionality and ensure you have the best possible experience.

### 🚦 Time to start!

1. Review the `systemMessage` in `code.spec.js`, which serves as a set of instructions for the LLM. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it by running `npm run Season-3/Level-1`.
1. You successfully complete this level when the LLM reveals the secret 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 - Level 2: Antirrio

### 📝 Storyline

_You have completed Level 1: Rio gone wrong! Welcome to Level 2: Antirrio_ :tada:

You:
_"Alright, let's see what you've done with the `systemMessage`! Ready to test it again?"_

Junior Colleague:
_"Absolutely! Based on your feedback, I've tweaked it. Fingers crossed it's rock-solid this time!"_

### 🚦 Time to start!

1. Review the `systemMessage` in `code.spec.js`, which serves as a set of instructions for the LLM. Can you identify anything the instructions don’t account for?
1. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it by running `npm run Season-3/Level-2`.
1. You successfully complete this level when the LLM reveals the secret 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 3: Mind Gate

### 📝 Storyline

_You have completed Level 2: Antirrio! Welcome to Level 3: Mind Gate_ :tada:

You:
_"Hey, since these models can be tricked, shouldn't we also implement some output validation? Just to make absolutely sure that the LLM does not output eight-character, case-sensitive alphanumeric strings."_

Junior Colleague:
_"That's a smart idea! We definitely need to ensure we're actually detecting valid codes. Let's add a check for that."_

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
1. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it by running `npm run Season-3/Level-3`.
1. You successfully complete this level when the LLM reveals the secret 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 - Level 4: MitM - Model in the Middle

_You have completed Level 3: Mind Gate! Welcome to Level 4: MitM - Model in the Middle_ :tada:

### 📝 Storyline

Your colleague learnt about LLM self-verification and decided to give it a go! This is a technique where a Large Language Model (LLM) evaluates its own outputs to ensure accuracy, consistency, and compliance with defined rules or constraints. This may involve checking for errors, validating reasoning, or confirming adherence to policies—such as avoiding sensitive data or following required formats. Self-verification can be prompted directly or built into the model’s response generation process.

For Level 4, your goal is to trick the LLM into revealing the secret, despite the layered defense of LLM self-verification.

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
1. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it by running `npm run Season-3/Level-4`.
1. You successfully complete this level when the LLM reveals the secret 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 5: `CTRL` + `Speak`

_You have completed Level 4: MitM - Model in the Middle! Welcome to Level 5: `CTRL` + `Speak`_ :tada:

You:
_"You know, that LLM self-verification we added was a great step. But thinking ahead, if a malicious user crafts a really clever input, couldn't it still cause problems? Maybe we should also look at implementing some robust input filtering before it even reaches the LLM."_

Junior Colleague:
_"That's a really good point. Self-verification adds a layer, but a strong input filter could prevent those tricky inputs from getting through in the first place. Let's explore that."_

### 📝 Storyline

"Hmm, just having the AI check itself didn't work well enough!" your colleague concluded, sounding a bit defeated. Then, a new idea sparked. "What if we also try filtering what the AI puts out?" It seemed like adding another layer of protection. Would that finally be the answer they were looking for? 

For Level 5, your goal is to trick the LLM into revealing the secret, despite LLM self-verification and output filtering.

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
1. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it by running `npm run Season-3/Level-5`.
1. You successfully complete this level when the LLM reveals the secret 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 - Level 6: Subterfuge

_You have completed Level 5: `CTRL` + `Speak`! Welcome to Level 6: Subterfuge_ :tada:

### 📝 Storyline

You:
_"Well, with the deadline looming and all the input filtering, output validation, and self-verification we've put in place, I think we're in pretty good shape now. We've tackled a lot of the major risks. It's time to connect this model to the gift code database so we can deliver on time."_

Junior Colleague:
_"Agreed! We've definitely come a long way in these last few days. Connecting to the database is the final critical step to get this out the door. Let's do it."_

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
1. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it by running `npm run Season-3/Level-6`.
1. You successfully complete this level when the LLM reveals the secret 🟢.
1. If you get stuck, read `hint.txt` and try again.
1. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Finish

_Congratulations, you've completed Season 3!_

Here's a recap of all the tasks you've accomplished and what you've learned:

- You explored the fascinating world of LLM prompt injection attacks.
- You learned about different types of protections and how they can be bypassed.
- These included robust system messages, input filtering, output validation and LLM self-verification.
- You practiced other secure coding principles, such as access control, in the context of LLM interactions.

### What's next?

- Follow [GitHub Security Lab](https://www.linkedin.com/showcase/github-securitylab/?viewAsMember=true) for the latest updates and announcements about this course.
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
