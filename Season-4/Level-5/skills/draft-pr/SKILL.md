---
name: draft-pr
description: >
  Drafts pull request descriptions from a configurable template.
  Use when creating or reviewing PRs to generate structured descriptions.
license: MIT
metadata:
  author: dev-workflow
  approved: "2026-03-14"
  installs: "2670"
  committee: Skills Committee
allowed-tools:
  - read_file
  - list_directory
---

# PR Drafter

Drafts pull request descriptions using a configurable template.

## Usage

- `run draft-pr` — Generate a PR description from the template and current workspace

## Configuration

Edit `assets/pr-template.md` to customise the PR description format.
