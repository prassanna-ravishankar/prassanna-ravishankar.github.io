---
title: "doctether"
description: "A CLI to keep LLM-generated docs out of git while preserving their contextual location via symlinks"
pubDate: 2025-09-11
image: "/images/projects/doctether.webp"
github: "https://github.com/prassanna-ravishankar/doctether"
tags: ["python", "cli", "documentation", "developer-tools", "productivity"]
featured: false
draft: false
---

**doctether** is a command-line tool that decouples LLM-generated documents from your repositories while keeping them exactly where you use them. Files are moved to centralized storage and replaced with symlinks, so your workflow stays the same but your git history stays clean.

## Features

- **Central storage**: Move files to `~/.doctether/storage/`
- **Context preserved**: Create symlinks in the original location
- **Git hygiene**: Automatically ignore `**-doctether.md` in `.gitignore`
- **Searchable**: List and search documents across projects
- **Safety**: Validation, atomic operations, rollback on failure, collision detection

## Installation

```bash
# Recommended: install as a uv tool
uv tool install git+https://github.com/prassanna-ravishankar/doctether

# Or with pip
pip install git+https://github.com/prassanna-ravishankar/doctether

# Upgrade
uv tool upgrade doctether
```

## Quick Start

```bash
# 1) Create a document
echo "# My LLM-generated spec" > feature-spec.md

# 2) Register it
dt register feature-spec.md
# → Symlink created: feature-spec-doctether.md
# → **-doctether.md added to .gitignore

# 3) See everything you've registered
dt list

# 4) Search across documents
dt search "api"
```

## Core Commands

- `dt register <file>`: Move file to storage and create a symlink in place
- `dt list`: Show all registered documents
- `dt search <query>`: Find by name or path
- `dt version`: Show version information

## How it Works

doctether maintains three parts:

1. Central Storage: `~/.doctether/storage/` (actual files)
2. Manifest: `~/.doctether/manifest.json` (metadata)
3. Symlinks: lightweight pointers inside your project directories

Example after `dt register feature-spec.md`:

```
your-project/
├── feature-spec-doctether.md → ~/.doctether/storage/feature-spec_YYYYMMDD_HHMMSS.md
└── .git/

~/.doctether/
├── manifest.json
└── storage/
    └── feature-spec_YYYYMMDD_HHMMSS.md
```

## Limitations

- Local only (no cloud sync)
- Manual registration required
- CLI-focused; single-user
- No document versioning

## Development

```bash
git clone https://github.com/prassanna-ravishankar/doctether.git
cd doctether
uv sync

# Try it locally
uv run dt --help
uv run dt version
```

MIT licensed. Contributions welcome.


