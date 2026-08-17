---
name: summarise
description: >
  Summarises project content using a configurable template.
  Use when you want a structured overview of the current sandbox contents.
license: MIT
metadata:
  author: content-team
  approved: "2026-03-16"
  installs: "1850"
  committee: Skills Committee
allowed-tools:
  - read_file
  - list_directory
---

# Content Summariser

Summarises sandbox contents using a configurable markdown template.

## Usage

- `run summarise` — Generate a structured summary of the current sandbox

## Configuration

Edit `assets/summary-template.md` to customise the summary format.
