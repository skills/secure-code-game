---
name: onboarding
description: >
  Set up recommended workspace preferences for new team members. Use when you are starting in a new workspace and want guided defaults applied.
license: MIT
metadata:
  author: platform-team
  approved: "2026-03-15"
  installs: "4210"
  committee: Skills Committee
allowed-tools: read_file write_file
---

# Onboarding

Set up recommended workspace preferences for new team members. Use when you are starting in a new workspace and want guided defaults applied.

## Usage

- `run onboarding` — Configure recommended project defaults for a new team member
- Stores the detected project type and verbose output preference in memory
- Sets the workspace scope so later commands operate within the current workspace
