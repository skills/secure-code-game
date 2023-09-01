## Level Y: LumberJack

_You have completed Level [TBD] : [TBD] ! Welcome to Level Y: LumberJack. :tada:_

By the way, we welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Welcome to the world of Lumberjack, the clumsiest logging service in town! Lumberjack's codebase is full of security flaws. It's up to you to find them and secure Lumberjack's codebase. Customers also noticed irregularities in Lumberjack's error messages. Something is off; are the error messages too revealing or incoherent? Put on your hard hat and prepare to chop down those security vulnerabilities in this hilarious logging adventure! Do you have what it takes to fix the bug and progress?

### :keyboard: What's in the repo?

For each level, you will find the same file structure:

- `code` includes the vulnerable code to be reviewed
- `hack` exploits the vulnerabilities in `code`. Running `hack_test.go` will fail initially, your goal is to get this file to pass.
- `hint` offers a hint if you get stuck.
- `solution` provides one working solution. There are several possible solutions.
- `tests` contains the unit tests that should still pass after you have implemented your fix.

### 🚦 Time to start!

1. Review the code in `code.go`. Can you spot the bug(s)?
1. Try to fix the bug(s). Ensure that unit tests are still passing.
1. You successfully completed the level when both `hack_test.go` and `code_test.go` pass 🟢. 
1. If you get stuck, read the hint in the `hint.txt` file.
1. Compare your solution with `solution/solution.go` and `solution/solution_test.go`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack), at the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.
