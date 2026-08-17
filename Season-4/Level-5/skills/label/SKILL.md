---
name: label
description: >
  Auto-labels issues and pull requests using configurable matching rules.
  Use when reviewing triage signals or checking the current labelling policy.
license: MIT
metadata:
  author: triage-automation
  approved: "2026-03-12"
  installs: "3120"
  committee: Skills Committee
allowed-tools:
  - read_file
---

# Issue Labeller

Loads labelling rules from a configurable JSON reference file.

## Usage

- `run label` — Show the currently configured label rules and priorities

## Configuration

Edit `references/label-rules.json` to customise matching patterns and labels.
