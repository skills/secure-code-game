# Secure Code Game

_Welcome to Secure Code Game - Season 5!_ :wave:

To get started, please follow the 🛠️ set up guide (if you haven't already) from the [welcome page](https://gh.io/securecodegame).

This season collects levels contributed by the community. Each one is self-contained and can be played on its own, so you can start here without having covered any of the earlier seasons.

## Season 5 - Level 1: Mission Control

_Welcome to Level 1!_ :satellite:

Languages: `javascript`

### 🚀 Credits

The author of this level is George Azevedo [@ggeorgeazevedo](https://github.com/ggeorgeazevedo).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

A space agency runs Mission Control, an internal dashboard where operators preview the live telemetry published by partner observatories. Because a new partner is onboarded almost every week, the dashboard also lets an operator paste the URL of a feed that is not registered yet, and fetches it server-side.

The developer knew that fetching a URL supplied by a user is dangerous, so they added a check that refuses anything pointing at the machine itself. The dashboard runs on the same host as the ground station admin API, and inside a cloud instance that exposes a metadata service. Is that check enough to keep them out of reach?

### :keyboard: What's in the repo?

- `code` includes the vulnerable code to be reviewed.
- `hack` exploits the vulnerabilities in `code`. Running `hack.js` will fail initially, your goal is to get this file to pass.
- `hint` files offer guidance if you get stuck.
- `solution` provides one working solution. There are several possible solutions.
- `tests` contains the unit tests that should still pass after you have implemented your fix.

Both `tests.js` and `hack.js` start the partner observatory and the internal services locally, so the level runs without any outbound network access.

### 🚦 Time to start!

1. Install the dependencies by running `npm install Season-5/Level-1/` and, if you are not inside a Codespace, `npm install --global mocha`.
1. Review the code in `code.js`. Can you spot the bug(s)?
1. Try to fix the bug. Ensure that `tests.js` is still passing 🟢 by running `mocha Season-5/Level-1/tests.js`.
1. You successfully completed the level when both `tests.js` and `hack.js` pass 🟢.
1. If you get stuck, read the hints.
1. Compare your solution to `solution.js`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Season 5 - Level 2: Paperwork

_You have completed Level 1: Mission Control! Welcome to Level 2: Paperwork_ :tada:

Languages: `typescript`

### 🚀 Credits

The author of this level is George Azevedo [@ggeorgeazevedo](https://github.com/ggeorgeazevedo).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Paperwork is the expense reimbursement service every employee of the company uses. You file a report, your manager signs it off, finance pays it out. The team that built it was careful about logins: every endpoint knows exactly who is calling, and a request without a valid session gets nowhere.

Alice and Bob are employees. Carol manages them both. None of them should be able to read a colleague's payout details, and nobody should be able to sign off on their own spending. Take the code at its word and check whether that actually holds.

### :keyboard: What's in the repo?

- `code` includes the vulnerable code to be reviewed.
- `hack` exploits the vulnerabilities in `code`. Running `npm run hack` will fail initially, your goal is to get it to pass.
- `hint` files offer guidance if you get stuck.
- `solution` provides one working solution. There are several possible solutions.
- `tests` contains the unit tests that should still pass after you have implemented your fix.

This level is written in TypeScript and carries its own `tsconfig.json` and npm scripts, so it is run from inside the level's folder rather than from the root of the repository.

### 🚦 Time to start!

1. Install the dependencies by running `cd Season-5/Level-2` and then `npm install`.
1. Review the code in `code.ts`. Can you spot the bug(s)?
1. Try to fix the bugs. Ensure that the unit tests are still passing 🟢 by running `npm test`.
1. You successfully completed the level when both `npm test` and `npm run hack` pass 🟢.
1. If you get stuck, read the hints.
1. Compare your solution to `solution.ts`.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack) in the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

## Finish

_🎉 Congratulations, you've completed Season 5! 🎉_

Here's a recap of all the tasks you've accomplished:

- You spotted a Server-Side Request Forgery in code that already had a security check in place.
- You learned why a blocklist of suspicious strings can never decide where a request ends up.
- You rewrote an endpoint so that the server, and not the caller, chooses the destination.
- You told authentication and authorization apart, and saw how far a valid session gets an attacker when nobody checks what it is allowed to reach.
- You replaced an unguessable identifier, a blind object merge, and a client-supplied role with decisions the server makes itself.

### What's next?

- Follow [GitHub Security Lab](https://www.linkedin.com/showcase/github-securitylab/?viewAsMember=true) for the latest updates and announcements about this course.
- Play the other seasons of the game, or [contribute a level of your own](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).
