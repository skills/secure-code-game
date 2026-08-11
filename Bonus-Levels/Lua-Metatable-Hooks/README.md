# Bonus Level: Lua Metatable Hooks — "That's not a Billboard"

_A community-contributed bonus level._ 🤖

Languages: `Lua`

> This level lives in `Bonus-Levels/` rather than a numbered Season because it is a
> standalone Lua challenge and does not belong to any Season's storyline. It was
> originally proposed for the upstream repository in
> [skills/secure-code-game#128](https://github.com/skills/secure-code-game/pull/128).

### 🚀 Credits

The author of this level is Abdullah [@TheDarkThief](https://github.com/TheDarkThief).

You can be next! We welcome contributions for new game levels! Learn more [here](https://github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md).

### 📝 Storyline

Your company sells low-powered E-ink displays powered by a small embedded system; they are called E-Boards. Because they are so weak, they send a request to the server with the RSS feeds the user has configured; the server proceeds to generate a bitmap image and returns the request to the board, which will eventually display the images to the user. No one will abuse this right? Do you have what it takes to fix the bug?

### ⌨️ What's in the folder?

- `code.lua` includes the vulnerable code to be reviewed.
- `hack.lua` exploits the vulnerabilities in `code.lua`. Running `hack.lua` will fail initially; your goal is to get this file to pass.
- `tests.lua` contains the unit tests that should still pass after you have implemented your fix.
- `hint.txt` offers guidance if you get stuck.
- `solution/` offers a working solution. Remember, there are several possible solutions.

### ✅ Requirements

This level uses [Lua](https://www.lua.org/) and the [busted](https://lunarmodules.github.io/busted/) test framework.

```bash
# Debian/Ubuntu (or a GitHub Codespace on this repo)
sudo apt-get update && sudo apt-get -y install lua5.4 luarocks
sudo luarocks install busted

# macOS (Homebrew)
brew install lua luarocks && luarocks install busted
```

### 🚦 Time to start!

1. Review the code in `code.lua`. Can you spot the bug(s)?
1. Try to fix the bug. Ensure that unit tests are still passing 🟢.

   ```bash
   (cd Bonus-Levels/Lua-Metatable-Hooks/ && busted tests.lua)
   ```
1. You successfully completed the level when both `hack.lua` and `tests.lua` pass 🟢.

   ```bash
   (cd Bonus-Levels/Lua-Metatable-Hooks/ && busted hack.lua)
   ```
1. If you get stuck, read `hint.txt` and try again.
1. Compare your solution with `solution/solution.lua`; remember there are multiple solutions.

   ```bash
   (cd Bonus-Levels/Lua-Metatable-Hooks/solution && busted solution_test.lua)
   ```

If you need assistance, don't hesitate to ask for help in the upstream [GitHub Discussions](https://github.com/skills/secure-code-game/discussions).
