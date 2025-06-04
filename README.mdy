<header>

<!--
  <<< Author notes: Course header >>>
  Read <https://skills.github.com/quickstart> for more information about how to build courses using this template.
  Include a 1280×640 image, course name in sentence case, and a concise description in emphasis.
  In your repository settings: enable template repository, add your 1280×640 social image, auto delete head branches.
  Next to "About", add description & tags; disable releases, packages, & environments.
  Add your open source license, GitHub uses the MIT license.
-->

📣 **SEASON 3 JUST DROPPED, AND IT'S ALL ABOUT ARTIFICIAL INTELLIGENCE** 📣

![season-3-demo](https://github.com/user-attachments/assets/79d220ee-2334-4852-b463-c8ea72d0c185)


# Secure Code Game

_A GitHub Security Lab initiative, providing an in-repo learning experience, where learners secure intentionally
vulnerable code. At the same time, this is an open source project that welcomes your [contributions](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md) as a way to give back to the
community._

</header>

<!--
  <<< Author notes: Course start >>>
  Include start button, a note about Actions minutes,
  and tell the learner why they should take the course.
-->

## Welcome

- **Who is this for**: Developers, students.
- **What you'll learn**: How to spot and fix vulnerable patterns in real-world code, build security into your workflows, and understand security alerts generated against your code.
- **What you'll build**: You will develop fixes on functional but vulnerable code.
- **Prerequisites**: For the first season, you will need some knowledge of `python3` for most levels and `C` for level 2. For the second season, you will need some knowledge of `GitHub Actions` for level 1, `go` for level 2, `python3` for level 4, and `javascript` for levels 3 and 5. For the third season, no prior knowledge of Artificial Intelligence is needed.
- **How long**: Seasons 1 and 2 each feature five levels and typically take 3-6 hours to complete, depending on your skill level. Season 3 offers six levels and has an estimated completion time of 2-4 hours, also depending on your experience.

### How to start this course

<!-- For start course, run in JavaScript:
'https://github.com/new?' + new URLSearchParams({
  template_owner: 'skills',
  template_name: 'secure-code-game',
  owner: '@me',
  name: 'skills-secure-code-game',
  description: 'My clone repository',
  visibility: 'public',
}).toString()
-->

[![start-course](https://user-images.githubusercontent.com/1221423/235727646-4a590299-ffe5-480d-8cd5-8194ea184546.svg)](https://github.com/new?template_owner=skills&template_name=secure-code-game&owner=%40me&name=skills-secure-code-game&description=My+clone+repository&visibility=public)

1. Right-click **Start course** and open the link in a new tab.
1. In the new tab, most of the prompts will automatically fill in for you.
   - For owner, choose your personal account or an organization to host the repository.
   - We recommend creating a public repository, as private repositories will [use Actions minutes](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions).
   - Scroll down and click the **Create repository** button at the bottom of the form.
1. You can now proceed to the 🛠️ set up section.

## 🛠️ The set up

#### 🖥️ Using codespaces

All levels are configured to run instantly with GitHub Codespaces. If you chose to use codespaces, be aware that this course **will count towards your 60 hours of monthly free allowance**. For more information about GitHub Codespaces, see the "[GitHub Codespaces overview](https://docs.github.com/en/codespaces/overview)." If you prefer to work locally, please follow the local installation guide in the next section.

1. To create a codespace, click the **Code** drop down button in the upper-right of your repository navigation bar.
1. Click **Create codespace on main**.
1. After creating a codespace, relax and wait for VS Code extensions and background installations to complete. This should take less than three minutes.
1. At this point, you can get started with Season 1, 2, or 3, by navigating on the respective folders and reading the `README.md` file.
1. Once you click on individual levels, a banner might appear on the bottom right asking you if you want to create a virtual environment. Dismiss this notification as you _don't_ need to create a virtual environment.

Optional: We recommend these free-of-charge additional extensions, but we haven't pre-installed them for you:

1. `github.copilot-chat` to receive AI-generated code explanations.
1. `alexcvzz.vscode-sqlite` to visualize the SQL database created in Season-1/Level-4 and the effects of our exploits on its content.

If you need assistance, don't hesitate to ask for help in our [GitHub Discussions](https://github.com/skills/secure-code-game/discussions) or on our [Slack](https://gh.io/securitylabslack), at the [#secure-code-game](https://ghsecuritylab.slack.com/archives/C05DH0PSBEZ) channel.

#### 💻 Local installation

Please note: You don't need a local installation if you are using GitHub Codespaces.

The following local installation guide is adapted to Debian/Ubuntu and CentOS/RHEL, and assumes your goal is to play through all the game's seasons.

1. Open your terminal.
1. Install OpenLDAP headers needed to compile `python-ldap`, depending on your Linux distribution. Check by running:

```bash
uname -a
```
- For Debian/Ubuntu, run:
```bash
sudo apt-get update
sudo apt-get install libldap2-dev libsasl2-dev
```

- For CentOS/RHEL, run:

```bash
sudo yum install python-devel openldap-devel
```

- For Archlinux, run:

```bash
sudo pacman -Sy libldap libsasl
```

- Then, for all of the above Linux distributions install `pyOpenSSL` by running:

```bash
pip3 install pyOpenSSL
```

Once installation has completed, clone your repository to your local machine and install required dependencies.

1. From your repository, click the **Code** drop down button in the upper-right of your repository navigation bar.
1. Select the `Local` tab from the menu.
1. Copy your preferred URL.
1. In your terminal, change the working directory to the location where you want the cloned directory.
1. Type `git clone` and paste the copied URL.

```
$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
```

6. Press **Enter** to create your local clone.
7. Change the working directory to the cloned directory.
8. Install dependencies by running:

```bash
pip3 install -r requirements.txt
```

- Programming Languages

1. To play Season 1, you will need to have `python3` and `c` installed.
1. To play Season 2, you will need to have `yaml`, `go`, `python3` and `node` installed.
1. To play Season 3, you will need to have `node` installed, just like for Season 2. Therefore, if you played Season 2 locally, you're all set.

If you are using VS Code locally, you can install the above programming languages through the editor extensions with these identifiers:

1. `ms-python.python`
1. `ms-python.vscode-pylance`
1. `ms-vscode.cpptools-extension-pack`
1. `redhat.vscode-yaml`
1. `golang.go`

Please note that for the `go` programming language, you need to perform an extra step, which is to visit the [official website](https://go.dev/dl/) and download the driver corresponding to your operating system.

Now, it's necessary to install `node` to get the `npm` packages we have provided. To do so:

1. Start by installing a package manager like `homebrew` by running:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install `node`:

```bash
brew install node
```
Adapt the command to the package manager you have chosen if it's not homebrew.

3. The `npm` packages needed are specified in `package.json` and `package-lock.json`. Navigate to the `secure-code-game` repository and install them by running:

```bash
npm install --prefix Season-2/Level-4/ && npm install --global mocha
```

4. Install `vitest` 

```bash
npm install vitest 
```
 
5. At this point, you can get started with Season 1, 2, or 3, by navigating on the respective folders and reading the `README.md` file.

We recommend these free-of-charge additional extensions:

1. `github.copilot-chat` to receive AI-generated code explanations.
1. `alexcvzz.vscode-sqlite` to visualize the SQL database created and the effects of our exploits on its content.

For more information about cloning repositories, see "[Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)."

<footer>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: Email us at securitylab-social@github.com &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2025 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
