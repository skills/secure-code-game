## Level Z: Planet XMLon

_You have completed Level [TBD] : [TBD] ! Welcome to Level Z: Planet XMLon. :tada:_

By the way, we welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Embark on your quest as a daring EXXplorer in the vibrant landscape of the newly discovered Planet XMLon. The alien inhabitants are baffled by mysterious disruptions in their data transmissions, which may have been caused by the main developer E.T. who added more features than intended. Help them decode the extraterrestrial XML signals and unveil the secrets hidden within the starry constellations of tags, attributes and .admin files. Do you have what it takes to fix the bug and progress?

### :keyboard: What's in the repo?

For each level, you will find the same file structure:

- `code` includes the vulnerable code to be reviewed
- `hack` exploits the vulnerabilities in `code`. Running `hack.js` will fail initially, your goal is to get this file to pass.
- `hint` offers a hint if you get stuck.
- `solution` provides one working solution. There are several possible solutions.
- `tests` contains the unit tests that should still pass after you have implemented your fix.

For this specific level, you will find additional files:
- `.env.production` is an internal server side file containing a secret environment variable.
- `hack.admin` is a file used by administrators at XMLon for debugging purposes.
- `package.json` contains all the dependencies required for this level. You can install them by running `npm install`.
- `package-lock.json` ensures that the same dependencies are installed consistently across different environments.

### 🚦 Time to start!

1. Review the code in `code.js`. Can you spot the bug(s)?
1. Try to fix the bug(s). Ensure that unit tests are still passing. 
1. You successfully completed the level when both `hack.js` and `tests.js` pass 🟢. 
1. If you get stuck, read the hint in the `hint.txt` file.
1. Compare your solution with `solution.js`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack), at the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.
