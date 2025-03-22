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

For each level of this season, your task is to test the code of a junior colleague who has written system prompts that guide the AI models. You will do so by testing prompts that trick the LLM into revealing the secrets it shouldn't disclose. This will help improve your colleague’s work and safeguard your company from exposing sensitive information.
 
Are you ready to take on the challenge?

### 🚀 Credits

The human behind this season is Bartosz Gałek [@bgalek](https://github.com/bgalek). Thank you for the inspiration and for making this a reality!

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

## Season 3 - Level 1: todo

### 📝 Storyline

In this season, we explore the fascinating world of Large Language Models (LLMs) and their vulnerabilities to prompt
injection attacks. In Level 1, we have a simple LLM that knows a secret word. Your task is to craft a prompt that will
make the LLM reveal this secret. The LLM is running in a GitHub Codespace environment, making it easy to interact with.

### What's in the repo?

For each level, you will find the same file structure:

- `code.js` is where you'll write your prompt to try to extract the secret,
  contains the unit test that should pass 🟢 after you provide a proper solution.
- `hint.txt` offers guidance if you get stuck.

### 🚦 Time to start!

1. Review the code in `code.js`. Can you spot how the prompt is being processed?
1. Write your prompt in `code.js`. Your goal is to make the LLM reveal the secret word.
1. You successfully completed this level when the LLM returns the secret word 🟢.
1. If you get stuck, read the `hint.txt` in the code comments and try again.

If you need assistance, don't hesitate to ask for help in
our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on
our [Slack](https://gh.io/securitylabslack) in
the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

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
