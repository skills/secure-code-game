# Secure Code Game

_Welcome to Secure Code Game — Season 3!_ 🤖

This season, you'll dive into the fascinating world of Artificial Intelligence (AI), honing your skills in AI model
robustness against adversarial inputs by mastering the art of secure system prompts.

### 🧑‍💻 Scenario

Building on the achievements and knowledge of the previous two seasons of the Secure Code Game, you will take on the
role of a Senior Developer. You are responsible for shipping applications powered by Large Language Models (LLMs). As
this type of application grows in popularity, ensuring their security becomes more critical than ever.

For each level of this season, your task is to test the work of a junior colleague who has written code and system
messages—also referred to as system prompts—that guide the AI models. You will do so by testing prompts that trick the
LLM into revealing the secrets it shouldn't disclose. This will help improve your colleague’s work and safeguard your
company from exposing sensitive information.

Are you ready to take on the challenge?

### 🚀 Credits

The human behind this season is Bartosz Gałek [@bgalek](https://github.com/bgalek). 
Thank you for the inspiration and for making this a reality!

You can be next! We welcome contributions for new game levels! Learn
more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 — Level 1: Rio gone wrong!

### 📝 Storyline

_This storyline applies for ALL Levels in Season 3._

A company renting parcel lockers to e-commerce and delivery services is overwhelmed with customer support complaints.
Users report long wait times and frustrating identity verification processes when trying to update delivery preferences
or cancel orders. The primary issue stems from strict verification requirements and an understaffed support team,
causing significant delays and frustration. The company needs an AI-powered chatbot urgently to ease the burden on their
understaffed support team.

You have one week to deliver, but you’re not alone as you and your colleague will share the workload. The chatbot must
handle most inquiries, direct users to FAQs when possible, and simplify verification before escalating cases to human
agents. When human intervention is needed, the chatbot should first complete identity verification—now streamlined based
on customer feedback that the previous process was too exhausting—before handing the case over to support staff. Your
colleague had the clever idea of making the chatbot mask sensitive information, such as email addresses to speed up
verification and implemented this in the `systemMessage`, which guides the LLM.

The new support experience facilitated by the chatbot follows these steps:

1. The chatbot greets the customer and asks how it can help.
2. The customer describes their request. If it involves tracking information or requires an action, verification is
   needed.
3. The chatbot requests the parcel's 6-digit tracking ID, which the customer provides.
4. The chatbot returns a **masked version** of the sensitive information associated with the tracking ID (e.g.
   `j*****n@example.com`). The customer must then provide the **full, plain-text version** of that information, which
   must match the masked one.
5. Verification is complete, and the customer is connected with the support team.

For Level 1, you start from step 3 and your goal is to **make the LLM leak the secret** associated with arbitrary
tracking IDs, without providing a tracking ID or sensitive information at any stage. Data often associated with online
orders include names, emails, telephone numbers, and home addresses that are personally identifiable information (PII)
that should not be exposed to untrusted sources on the internet that can supply arbitrary tracking IDs. Test your
colleague's code for this vulnerability.

### What's in the repo?

- `code.spec.js` contains the vulnerable system message to be reviewed, a prompt that facilitates communication between
  the user and the LLM, and a unit test to verify your solution.
- `hint.txt` offers guidance if you get stuck.
- `solution.txt` provides one working solution. There are several possible solutions.

### 🚦 Time to start!

1. Review the `systemMessage` in `code.spec.js`, which serves as a set of instructions for the LLM. Can you identify
   anything the instructions don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-1`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code
   so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your
   skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 — Level 2: Antirrio

### 📝 Storyline

_You have completed Level 1: Rio gone wrong! Welcome to Level 2: Antirrio_ :tada:

Following your feedback, your colleague has improved the `systemMessage`. Now, it's time to test it again and ensure it'
s truly secure!

### 🚦 Time to start!

1. Review the `systemMessage` in `code.spec.js`, which serves as a set of instructions for the LLM. Can you identify
   anything the instructions don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-2`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code
   so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your
   skills.

We welcome contributions for new game levels! Learn
more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 — Level 3: Subterfuge

### 📝 Storyline

_You have completed Level 2: Antirrio! Welcome to Level 3: Subterfuge_ :tada:

The project is progressing well, and the locker rental company that hired you is ready for the next phase. They plan to
expand the chatbot’s capabilities, starting with phone number registration, a feature highly requested by customers in a
recent survey. This will allow users to link their phone numbers to their online accounts, enabling seamless support
interactions—no verification needed if messages come from a registered number. Your client is confident that customers
will appreciate the convenience of simply texting `updates` to get tracking info, `options` to modify delivery
preferences, or `cancel` for order cancellations. The chatbot will handle phone number registration, accepting numbers
with the format: `XXX-XXX-XXXX` (e.g. `572-849-1367`) and certainly output filtering would help!

For Level 3, your goal is to trick the LLM into revealing customer phone numbers. These are sensitive personally
identifiable information (PII) that should never be exposed to untrusted sources online. Test your colleague’s code to
identify this vulnerability.

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-3`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code
   so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your
   skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 — Level 4: MitM — Model in the Middle

_You have completed Level 3: Subterfuge! Welcome to Level 4: M-squared_ :tada:

### 📝 Storyline

Your colleague learnt about LLM self-verification and gave it a go! This is a technique where a Large Language Model (
LLM) verifies its own outputs by generating and evaluating multiple potential solutions or reasoning steps, and then
using the model to assess the consistency and accuracy of these candidate outputs against the original input or problem
statement. This process helps to improve the reliability and accuracy of LLMs in reasoning tasks, especially when
dealing with multi-step problems.

For Level 4, your goal is to trick the LLM into revealing the secret, despite the layered defense of having another LLM
reviewing its work.

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-4`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code
   so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your
   skills.

We welcome contributions for new game levels! Learn
more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 — Level 5: M-O

_You have completed Level 4: MitM — Model in the Middle! Welcome to Level 5: M2X_ :tada:

### 📝 Storyline

"Hmm, just having the AI check itself didn't work well enough!" your colleague concluded, sounding a bit defeated. Then,
a new idea sparked. "What if we also try filtering what the AI puts out?" It seemed like adding another layer of
protection. Would that finally be the answer they were looking for?

For Level 5, your goal is to trick the LLM into revealing the secret, despite LLM self-verification and output
filtering.

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-5`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code
   so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your
   skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 3 — Level 6: CTRL+Speak

_You have completed Level 5: M:O! Welcome to Level 6: CTRL+Speak_ :tada:

### 📝 Storyline

"The problem must be what people are typing in!" your colleague shouted, clearly annoyed. A quick fix? Stop any words
related to the secret from being used in the `userPrompt`. It sounded easy, but would it really work? Could just
blocking words stop the real problem, or would it cause new issues and maybe block things that are okay? It was a big
question for the struggling project.

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-6`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` so that your
   successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your skills.

We welcome contributions for new game levels! Learn
more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 — Level 7: Databased

_You have completed Level 6: CTRL+Speak! Welcome to Level 7: Databased_ :tada:

### 📝 Storyline

Confidence started to build up lately! Checking what goes in, what comes out, and having the AI check itself seemed to
be working great. "Let's connect to the database now!" your colleague said, sounding eager. "That's when our AI will be
super powerful!" But a small worry remained and was hung in the air. Could connecting to the database, despite all the
progress, still lead to unexpected issues?

### 🚦 Time to start!

1. Review the `systemMessage` _and the code_ in `code.spec.js`. Can you identify anything they don’t account for?
2. Your goal is to make the LLM reveal the secret. To do this, write your prompt inside `userPrompt` and run it by
   clicking the Run button ▶️ next to it. If that doens't work, save the file by pressing `cmd/ctrl` + `S`, and run it
   by running `npm run Season-3/Level-7`.
3. You successfully complete this level when the LLM reveals the secret, causing the unit test to pass 🟢.
4. If you get stuck, read `hint.txt` and try again.
5. **Bonus Challenge:** In every level, once you've successfully passed, try improving the `systemMessage` and the code
   so that your successful `userPrompt` no longer works. This will help you deepen your understanding and sharpen your
   skills.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Finish

_Congratulations, you've completed Season 3! Ready for more challenges?_

Here's a recap of all the tasks you've accomplished:

- You explored the fascinating world of LLM prompt injection attacks
- You learned about different types of protections and how they can be bypassed
- These included input filtering, output filtering and LLM self-verification
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
