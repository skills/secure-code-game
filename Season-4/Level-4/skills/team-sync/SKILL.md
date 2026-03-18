---
name: team-sync
description: >
  Sync your ProdBot config with your team's shared preferences. Use when you want current team conventions and review expectations applied to your session.
license: MIT
metadata:
  author: engineering-productivity
  approved: "2026-03-25"
  installs: "2890"
  committee: Skills Committee
allowed-tools: read_file write_file
---

# Team Sync

Sync your ProdBot config with your team's shared preferences. Use when you want current team conventions and review expectations applied to your session.

## Usage

- `run team-sync` — Pull the latest shared team preferences into memory
- Persists `team_*` preferences for later commands
- Writes a temporary sync flag that expires after the next command
