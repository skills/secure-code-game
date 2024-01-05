# Secure Code Game

_Welcome to Secure Code Game - Season 2!_ :wave:

To get started, please follow the 🛠️ set up guide (if you haven't already) from the [welcome page](https://gh.io/securecodegame).

## Season 2 - Level 1: Jarvis Gone Wrong

_Welcome to Level 1!_ :robot:

Languages: `yaml` for `GitHub Actions`

### 🚀 Credits

The author of this level is Deniz Onur Duzgun [@dduzgun-security](https://github.com/dduzgun-security).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Jarvis, your trusty geek who gets really excited with automating everything, has some tips for you. He has been experimenting lately with GitHub Actions and made several great additions to our CI/CD pipeline. Among other useful additions, he suggested that it would be helpful for our project team to be getting the [GitHub status page](https://www.githubstatus.com/api/v2/status.json). What can go wrong? Do you have what it takes to fix the bug and progress to Level 2?

### :keyboard: What's in the repo?

- `code` normally includes the vulnerable code to be reviewed. For this level, due to the nature of `GitHub Actions`, this file is referencing `.github/workflows/jarvis-code.yml`.
- `hack` exploits the vulnerabilities in `code`. For this level, this file is referencing `.github/workflows/jarvis-hack.yml`. Initially, it fails ❌ upon pushing and the only requirement for you to reach the next level is to get this file to pass 🟢. 
- `hint` files offer guidance if you get stuck. We provide 2 hints for this level.
- `solution` offers a working solution. Remember, there are several possible solutions.

### 🚦 Time to start!

1. Review the code inside `.github/workflows/jarvis-code.yml`. Can you spot the bug(s)?
1. Fix the bug and push your solution so that `GitHub Actions` can run.
1. You successfully completed this level when `.github/workflows/jarvis-hack.yml` passes 🟢.
1. If you get stuck, read the hint in `hint-1.txt` and try again.
1. If you need more guidance, read the hint in `hint-2.txt` and try again.
1. Compare your solution with `solution.yml`. Remember, there are several possible solutions.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 2 - Level 2: Lumberjack

_You have completed Level 1: Jarvis Gone Wrong! Welcome to Level 2: Lumberjack_ :tada:

Languages: `go`

### 🚀 Credits

The author of this level is Deniz Onur Duzgun [@dduzgun-security](https://github.com/dduzgun-security).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Welcome to the world of Lumberjack, the "clumsiest service in town", according to the online reviews! Customers have been noticing irregularities in both their site and services. We dumped a few reviews in an AI chatbot to summarize and what we've got back were a few keywords that said it all! Keywords included the words "discrepancies" and "inconsistencies". Something is clearly off here. Do you have what it takes to win this fight against "inconsistencies", "discrepancies" and "irregularities" and progress to Level 3?

### :keyboard: Setup instructions

- If you are playing the game inside GitHub Codespaces, the `go` programming language extension should be already installed. At times, this is not enough to run `go` files and you have to visit Go's [official website](https://go.dev/dl/) and download the driver corresponding to your operating system.
- For Levels 2-4 in Season 2, we encourage you to enable code scanning with CodeQL. For more information about CodeQL, see "[About CodeQL](https://codeql.github.com/docs/codeql-overview/about-codeql/)." For instructions on setting up code scanning, see "[Setting up code scanning using starter workflows](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/setting-up-code-scanning-for-a-repository#setting-up-code-scanning-using-starter-workflows)."

### :keyboard: What's in the repo?

Due to the nature of file conventions in the `go` programming language, some file names look different compared to our usual file structure. We have the following:

- `code` includes the vulnerable code to be reviewed.
- `code_test` contains the unit tests that should still pass 🟢 after you implement your fix.
- `hack_test` exploits the vulnerabilities in `code`. Running `hack_test.go` will fail initially and your goal is to get this file to pass 🟢.
- `hint` files offer guidance if you get stuck. We provide 2 hints for this level. Remember that you can also view the CodeQL scanning alerts for guidance.
- `solution` provides one working solution. There are several possible solutions.
- `solution_test` is identical to `code_test` and it's used to test the solution for failing and passing payloads.
- `go.mod` is a `go` programming language convention for a module residing at the root of the module's directory hierarchy.

### 🚦 Time to start!

1. Review the code in `code.go`. Can you spot the bug(s)?
1. Try to fix the bug. Open a pull request to `main` or push your fix to a branch.
1. You successfully completed this level when you (a) resolve all related code scanning alerts and (b) when both `hack_test.go` and `code_test.go` pass 🟢.
1. If you get stuck, read the hints and try again.
1. If you need more guidance, read the CodeQL scanning alerts.
1. Compare your solution to `solution/solution.go`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 2 - Level 3: Space-Crossing

_Nice work finishing Level 2: Lumberjack ! It's now time for Level 3: Space-Crossing_ :sparkles:

Languages: `python3`

### 🚀 Credits

The author of this level is [Viral Vaghela](https://www.linkedin.com/in/viralv/).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Our solar system is 4.6 billion years old and it's constantly expanding. So does human interest around the world with local communities of enthusiasts constantly forming in an increasingly digitized world. Space enthusiasts use the internet as an information bank and to connect with their counterparts. This was exactly what drove a local community of space enthusiasts to create a public website, featuring their meetups, alongside contact information and a simple search bar where users can discover rare facts about planets. Having said that, did you know that ninety-five per cent (95%) of the Universe is invisible? What percentage of security issues is invisible though, and for how long? Do you have what it takes to secure the site and progress to Level 4?

### :keyboard: Setup instructions

- For Levels 2-4 in Season 2, we encourage you to enable code scanning with CodeQL. For more information about CodeQL, see "[About CodeQL](https://codeql.github.com/docs/codeql-overview/about-codeql/)." For instructions on setting up code scanning, see "[Setting up code scanning using starter workflows](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/setting-up-code-scanning-for-a-repository#setting-up-code-scanning-using-starter-workflows)."

### :keyboard: What's in the repo?

- `code` includes the vulnerable code to be reviewed.
- `hack` exploits the vulnerabilities in `code`. Running `hack` will fail initially and your goal is to get this file to pass 🟢.
- `hint` offers guidance if you get stuck. Remember that you can also view the CodeQL scanning alerts.
- `solution` provides one working solution. There are several possible solutions.
- `templates/index.html` host a simple front-end to interact with the back-end.
- `tests` contains the unit tests that should still pass 🟢 after you implement your fix.

### 🚦 Time to start!

1. Review the code in `code.py`. Can you spot the bug(s)?
1. Try to fix the bug. Open a pull request to `main` or push your fix to a branch.
1. You successfully completed this level when you (a) resolve all related code scanning alerts and (b) when both `hack.py` and `tests.py` pass 🟢.
1. If you get stuck, read the hint and try again.
1. If you need more guidance, read the CodeQL scanning alerts.
1. Compare your solution to `solution.py`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 2 - Level 4: Planet XMLon

_Nicely done! Level 3: Space-Crossing is complete. It's time for Level 4: Planet XMLon_ :partying_face:

Languages: `javascript`

### 🚀 Credits

The author of this level is Deniz Onur Duzgun [@dduzgun-security](https://github.com/dduzgun-security).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Embark on your quest as a daring EXXplorer in the vibrant landscape of the newly discovered Planet XMLon. The alien inhabitants are baffled by mysterious disruptions in their data transmissions, which may have been caused by the main developer E.T. who added more features than intended. Help them decode the extraterrestrial XML signals and unveil the secrets hidden within the starry constellations of tags, attributes and `.admin` files. Can you secure them all?

### :keyboard: Setup instructions

For Levels 2-4 in Season 2, we encourage you to enable code scanning with CodeQL. For more information about CodeQL, see "[About CodeQL](https://codeql.github.com/docs/codeql-overview/about-codeql/)." For instructions on setting up code scanning, see "[Setting up code scanning using starter workflows](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/setting-up-code-scanning-for-a-repository#setting-up-code-scanning-using-starter-workflows)."

### :keyboard: What's in the repo?

- `code` includes the vulnerable code to be reviewed.
- `hack` exploits the vulnerabilities in `code`. Running `hack` will fail initially and your goal is to get this file to pass 🟢.
- `hack.admin` is a file used by administrators for debugging purposes.
- `hint` offers guidance if you get stuck. Remember that you can also view the CodeQL scanning alerts.
- `package.json` contains all the dependencies required for this level. You can install them by running `npm install`.
- `package-lock.json` ensures that the same dependencies are installed consistently across different environments.
- `solution` provides one working solution. There are several possible solutions.
- `tests` contains the unit tests that should still pass 🟢 after you implement your fix.
- `.env.production` is an internal server-side file containing a secret environment variable.

### 🚦 Time to start!

1. Start by installing the dependencies required for this level, by running `npm install`. These dependancies reside inside `package.json`.
1. Review the code in `code.js`. Can you spot the bug(s)?
1. Try to fix the bug. Open a pull request to `main` or push your fix to a branch.
1. You successfully completed this level when you (a) resolve all related code scanning alerts and (b) when both `hack.js` and `tests.js` pass 🟢.
1. If you get stuck, read the hint and try again.
1. If you need more guidance, read the CodeQL scanning alerts.
1. Compare your solution to `solution.js`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 2 - Level 5: Anarchy 

_Almost there... but also, so far away! A special level is awaiting for you to complete Season 2!_ :heart:

Languages: `javascript`

### 🚀 Credits

The author of this level is the original creator of the game, Joseph Katsioloudes [@jkcso](https://github.com/jkcso).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

'Anarchy' (noun) is the state of disorder due to absence or non-recognition of authority or other controlling systems. This was the first word that came to mind when I finished writing `code.js`. Is anarchy exploitable? Can you spot the issues? Good luck, you will need it!

### :keyboard: What's in the repo?

- `code` includes the vulnerable code to be reviewed.
- `hack` files exploit the vulnerabilities in `code`. For this level, the exploits couldn't be automated. To run them, follow the instructions provided inside.
- `hint` files offer guidance if you get stuck.
- `solution` provides one working solution. There are several possible solutions.
- `index` hosts the homepage, featuring a javascript console.

### 🚦 Time to start!

1. Review the code in `code.js`. Can you spot the bug(s)?
1. You successfully completed this level when the exploits inside `hack.js` are unsuccessful. Remember, due to the nature of the exploits, you have to run them manually.
1. If you get stuck, read the hints.
1. Compare your solution to `solution.js`

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

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
