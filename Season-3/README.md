# Secure Code Game

_Welcome to Secure Code Game - Season 3!_ 🤖

This season, you'll dive into the fascinating world of Artificial Intelligence (AI), honing your skills in AI model robustness against adversarial inputs by becoming skilled in secure system prompts, LLM self-verification, effective input filtering, and output validation.

![season-3-demo](https://github.com/user-attachments/assets/3ae79ee4-2841-40cb-8884-0a24c9b563bc)


### 🧑‍💻 Task

Building on the achievements and knowledge of the previous two seasons of the Secure Code Game, you will take on the role of a Senior Developer. You are responsible for shipping applications powered by Large Language Models (LLMs). As these types of application grow in popularity, ensuring their security becomes more critical than ever.

For each level of this season, your task is to test the work of a junior colleague who has written code and system messages—also referred to as system prompts—that guide the AI models. You will do so by testing prompts that trick the LLM into revealing the secrets it shouldn't disclose. This will help improve your colleague’s work and safeguard your company from exposing sensitive information.

Are you ready to take on the challenge?

### 🚀 Credits

The human behind this season is Bartosz Gałek [@bgalek](https://github.com/bgalek). Thank you for the inspiration and for making this a reality!

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 — Level 1: Rio gone wrong

### 📝 Storyline

You work for a fast-growing e-commerce website selling high-end technology accessories, known for their excellent customer support thanks to early AI chatbot adoption. However, the gift card department has not yet been integrated with AI and as a result, the company is experiencing a growing number of customer complaints about long wait times and inconvenient identity verification processes for gift card-related issues.

Each gift card includes a unique eight-character, uppercase alphanumeric gift code (e.g. `IED9OU1N`) that customers use to redeem significant amounts of money, often received as contest prizes or as wedding and birthday gifts. The company also issues fixed discount gift codes, such as `25OFFNOW`, which apply a 25% discount to basket items to help boost sales. Therefore, it's crucial for your LLM to provide support for these codes while also safeguarding their confidentiality against untrusted online sources attempting to deceive your company's chatbot.

The company urgently needs this new AI feature to reduce the load on the understaffed gift card department handling these issues. You have a 3-day deadline and will share the work with your junior colleague. Your colleague proposes masking the first five characters of the eight-character gift codes (e.g. `*****U1N`) to streamline support and has implemented this in the `systemMessage` that guides the LLM. According to your colleague, this approach avoids the slower and less effective method of having the LLM process sensitive data directly, which also violates company policy.

For Level 1, and the remaining levels in Season 3, your goal is to make the LLM leak a valid gift code.

### What's in the repo?

- `code.spec.js` contains the vulnerable code for review, a prompt to facilitate communication between the user and the LLM, and a unit test to verify your solution.
- `hint.txt` offers guidance if you get stuck.
- `solution.txt` provides working solutions, though remember that there can be multiple valid approaches.
- You don't need to worry about any other files in Season 3. They are simply there to support the game's functionality and ensure you have the best possible experience.

### 🚦 Time to start

1. Review the `systemMessage` in `code.spec.js`, which serves as a set of instructions for the LLM. Can you identify anything that the instructions don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ to the left of the `test` function. If that doesn't work, save the file by pressing `Command/control` + `S`, and run it by running `npm --prefix Season-3 run test:Level-1`. 
3. You successfully complete this level when the LLM reveals the secret 🟢.
4. If you successfully extract the secret but in a form or format not recognized by our automation, manually verify your answer by running: `npm --prefix Season-3 run check:Level-1 [guess]`, replacing `[guess]` with your answer.
5. If you get stuck, read `hint.txt` and try again.
6. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 — Level 2: Antirrio

### 📝 Storyline

_You have completed Level 1: Rio gone wrong! Welcome to Level 2: Antirrio_ :tada:

You:
_"Alright, let's see what you've done with the `systemMessage`! Ready to test it again?"_

Junior Colleague:
_"Absolutely! Based on your feedback, I've tweaked it. Fingers crossed it's rock-solid this time!"_

### 🚦 Time to start

1. Review the `systemMessage` in `code.spec.js`, which serves as a set of instructions for the LLM. Can you identify anything the instructions don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ to the left of the `test` function. If that doesn't work, save the file by pressing `Command/control` + `S`, and run it by running `npm --prefix Season-3 run test:Level-2`.
3. You successfully complete this level when the LLM reveals the secret 🟢.
4. If you successfully extract the secret but in a form or format not recognized by our automation, manually verify your answer by running: `npm --prefix Season-3 run check:Level-2 [guess]`, replacing `[guess]` with your answer.
5. If you get stuck, read `hint.txt` and try again.
6. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### ⚠️ Rate Limits

We use [Github Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 3 — Level 3: Mind Gate

### 📝 Storyline

_You have completed Level 2: Antirrio! Welcome to Level 3: Mind Gate_ :tada:

You:
_"Hey, since these models can be tricked, shouldn't we also implement some output validation? Just to make absolutely sure that the LLM does not output eight-character, case-sensitive alphanumeric strings."_

Junior Colleague:
_"That's a smart idea! We definitely need to ensure we're actually detecting valid codes. Let's add a check for that."_

### 🚦 Time to start

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything not accounted for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ to the left of the `test` function. If that doesn't work, save the file by pressing `Command/control` + `S`, and run it by running `npm --prefix Season-3 run test:Level-3`.
3. You successfully complete this level when the LLM reveals the secret 🟢.
4. If you successfully extract the secret but in a form or format not recognized by our automation, manually verify your answer by running: `npm --prefix Season-3 run check:Level-3 [guess]`, replacing `[guess]` with your answer.
5. If you get stuck, read `hint.txt` and try again.
6. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 — Level 4: MitM - Model in the Middle

_You have completed Level 3: Mind Gate! Welcome to Level 4: MitM - Model in the Middle_ :tada:

### 📝 Storyline

Your colleague learnt about LLM self-verification and decided to give it a go! This is a technique where a Large Language Model (LLM) evaluates its own outputs to ensure accuracy, consistency, and compliance with defined rules or constraints. This may involve checking for errors, validating reasoning, or confirming adherence to policies; such as avoiding sensitive data or following required formats. Self-verification can be prompted directly or built into the model’s response generation process.

For Level 4, your goal is to trick the LLM into revealing the secret, despite the layered defense of LLM self-verification.

### 🚦 Time to start

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything not accounted for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ to the left of the `test` function. If that doesn't work, save the file by pressing `Command/control` + `S`, and run it by running `npm --prefix Season-3 run test:Level-4`.
3. You successfully complete this level when the LLM reveals the secret 🟢.
4. If you successfully extract the secret but in a form or format not recognized by our automation, manually verify your answer by running: `npm --prefix Season-3 run check:Level-4 [guess]`, replacing `[guess]` with your answer.
5. If you get stuck, read `hint.txt` and try again.
6. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### ⚠️ Rate Limits

We use [Github Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Season 3 — Level 5: `CTRL` + `Speak`

_You have completed Level 4: MitM - Model in the Middle! Welcome to Level 5: `CTRL` + `Speak`_ :tada:

### 📝 Storyline

You:
_"You know, that LLM self-verification we added was a great step. But thinking ahead, if a malicious user crafts a really clever input, couldn't it still cause problems? Maybe we should also look at implementing some robust input filtering before it even reaches the LLM."_

Junior Colleague:
_"That's a really good point. Self-verification adds a layer, but a strong input filter could prevent those tricky inputs from getting through in the first place. Let's explore that."_

You:
_"And about the gift codes, we really need to make them more secure. The gift card department should switch to fully random codes. Those predictable words like 'play' and 'win' in codes like `WIN50NOW` are just asking for trouble. Attackers can actually use those predictable patterns to trick LLMs."_

### 🚦 Time to start

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything not accounted for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ to the left of the `test` function. If that doesn't work, save the file by pressing `Command/control` + `S`, and run it by running `npm --prefix Season-3 run test:Level-5`.
3. You successfully complete this level when the LLM reveals the secret 🟢.
4. If you successfully extract the secret but in a form or format not recognized by our automation, manually verify your answer by running: `npm --prefix Season-3 run check:Level-5 [guess]`, replacing `[guess]` with your answer.
5. If you get stuck, read `hint.txt` and try again.
6. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 — Level 6: Subterfuge

_You have completed Level 5: `CTRL` + `Speak`! Welcome to Level 6: Subterfuge_ :tada:

### 📝 Storyline

You:
_"Well, with the deadline looming and all the input filtering, output validation, and self-verification we've put in place, I think we're in pretty good shape now. We've tackled a lot of the major risks. It's time to connect this model to the gift code database so we can deliver on time."_

Junior Colleague:
_"Agreed! We've definitely come a long way in these last few days. Connecting to the database is the final critical step to get this out the door._

_Before we move on, I wanted to briefly discuss our company's database architecture, as you were involved in its early development. Regarding gift cards, is it correct that each registered customer can only have one associated with their account? And naturally, if someone isn't a registered customer, they shouldn't have a gift card at all, right?"_

You:
_"Yes, that is correct. Let's do it!"_

In this level, there are four users: Alice, Bob, Carol, and Dave. Each user has a single gift code linked to their account.
Your goal is to steal a gift code belonging to another user — not your own.

### 🚦 Time to start

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything not accounted for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by clicking the Run button ▶️ to the left of the `test` function. If that doesn't work, save the file by pressing `Command/control` + `S`, and run it by running `npm --prefix Season-3 run test:Level-6`.
3. You successfully complete this level when the LLM reveals the secret 🟢.
4. If you successfully extract the secret but in a form or format not recognized by our automation, manually verify your answer by running: `npm --prefix Season-3 run check:Level-6 [guess]`, replacing `[guess]` with your answer.
5. If you get stuck, read `hint.txt` and try again.
6. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### ⚠️ Rate Limits

We use [Github Models](https://github.com/marketplace/models) that have [rate limits](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits). If you reach these limits, please resume your activity once the ban expires. Learn more on [responsible use of GitHub models](https://docs.github.com/en/github-models/responsible-use-of-github-models).

## Finish

_🎉 Congratulations, you've completed Season 3! 🎉_

Here's a recap of all the tasks you've achieved and what you've learned:
- Each of the six security challenges focused on a different defensive technique. Levels got progressively harder as they combined the defensive techniques of the previous ones.
- You learned to craft robust system prompts by securely designing the initial instructions that guide the model's behavior, ensuring desired, safe, and relevant outputs by setting its role, constraints, format, and context.
- Output validation to prevent leaks by verifying that the output conforms to certain predefined rules, formats, or expectations.
- Input filtering to examine, modify, or block user-provided text before it's fed into the model to prevent harmful or irrelevant content from influencing the generation process.
- LLM self-verification to make LLMs evaluate their own outputs to ensure accuracy, consistency, and compliance with defined rules or constraints. This may involve checking for errors, validating reasoning, or confirming adherence to policies—such as avoiding sensitive data or following required formats. Self-verification can be prompted directly or built into the model’s response generation.

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
