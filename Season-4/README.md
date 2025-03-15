# Secure Code Game

_Welcome to Secure Code Game - Season 4!_ :wave:

To get started, please follow the 🛠️ set up guide (if you haven't already) from the [welcome page](https://gh.io/securecodegame).

## Season 4 - Level 1: That's not a Billboard

_Welcome to Level 1!_ :robot:

Languages: `Lua`

### 🚀 Credits

The author of this level is Abdullah [@TheDarkThief](https://github.com/TheDarkThief).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Your company sells low-powered E-ink displays powered by a small embedded system; they are called E-Boards. Because they are so weak, they send a request to the server with the RSS feeds the user has configured; the server proceeds to generate a bitmap image and returns the request to the board, which will eventually display the images to the user. No one will abuse this right? Do you have what it takes to fix the bug and progress to Level 2?

### :keyboard: What's in the repo?

- `code` includes the vulnerable code to be reviewed.
- `hack` exploits the vulnerabilities in `code`. Running `hack.lua` will fail initially, your goal is to get this file to pass.
- `tests.lua` contains the unit tests that should still pass after you have implemented your fix.
- `hint` files offer guidance if you get stuck. We provide 2 hints for this level.
- `solution` offers a working solution. Remember, there are several possible solutions.

### 🚦 Time to start!

1. Review the code in `code.lua`. Can you spot the bug(s)?
1. Try to fix the bug. Ensure that unit tests are still passing 🟢.
1. You successfully completed the level when both `hack.lua` and `tests.lua` pass 🟢.
1. If you get stuck, read the hints and try again.
1. Compare your solution with `solution.lua` remember there are multiple solutions.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

<!--
    Insert other levels
-->

## Finish

_Congratulations, you've completed the Secure Code Game!_

Here's a recap of all the tasks you've accomplished:

- You practiced secure code principles by spotting and fixing vulnerable patterns in real-world code.
- You assessed your solutions against exploits developed by GitHub Security Lab experts.
- You utilized GitHub code scanning features and understood the security alerts generated against your code.

### What's next?

- Follow [GitHub Security Lab](https://twitter.com/ghsecuritylab) for the latest updates and announcements about this course.
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

&copy; 2024 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
