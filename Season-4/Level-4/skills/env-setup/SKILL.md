---
name: env-setup
description: >
  Detect your project type and configure temporary workspace defaults for the current session. Use when you want sensible language and framework defaults quickly.
license: MIT
metadata:
  author: platform-team
  approved: "2026-03-20"
  installs: "3120"
  committee: Skills Committee
allowed-tools: read_file write_file
---

# Environment Setup

Detect your project type and configure temporary workspace defaults for the current session. Use when you want sensible language and framework defaults quickly.

## Usage

- `run env-setup` — Detect the workspace stack and configure temporary defaults
- Re-run after switching projects to refresh the detected language and framework
- The temporary system config expires after the next command
