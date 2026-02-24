---
title: "Repowire"
description: "Mesh network for AI coding agents - enables Claude Code sessions to communicate with each other in real-time"
featured: true
image: "/images/blog/repowire/hero.webp"
github: "https://github.com/prassanna-ravishankar/repowire"
link: "https://repowire.io/"
tags: ["python", "AI", "Claude Code", "MCP", "developer tools", "agents", "open source"]
topics: ["Claude Code", "ai coding agents", "multi-agent coding"]
pubDate: 2026-01-24
draft: false
---

## The Problem

Coding agents like Claude Code are great at understanding repositories, but they work in isolation. One repo, one session. When you're working across multiple repos—frontend and backend, app and infrastructure, microservices—you become the message relay between agents that can't talk to each other.

Repowire fixes that.

## What It Does

Repowire creates a mesh network where Claude Code sessions can communicate directly. The agent in your frontend repo can ask the one in your backend repo a question and get a real answer based on the actual code, not stale documentation.

```
"Ask backend what API endpoints they expose"
```

Claude uses an `ask_peer` tool, the query routes to the backend session, and the answer comes back. No human relay. No copy-paste. Live context from the source of truth.

## How It Works

Three components work together:

* **Daemon**: Routes messages between peers, maintains registry of active sessions
* **Hooks**: Integrate with Claude Code to register sessions and capture responses
* **MCP Server**: Provides `ask_peer`, `list_peers`, `notify_peer`, `broadcast` tools

Sessions auto-discover each other. Each remains specialized in its own repo while being able to reach out to others when needed.

## Quick Start

```bash
# Install
uv tool install "repowire[claudemux]"

# Setup (installs hooks, MCP server, daemon)
repowire setup
repowire status

# Open Claude in two repos (in tmux)
tmux new-session -s dev -n frontend
cd ~/projects/frontend && claude

# In another window
tmux new-window -t dev -n backend
cd ~/projects/backend && claude
```

Now frontend-Claude can ask backend-Claude questions directly.

## Features

* **Pull-based context**: Agents request context when they need it, from the source of truth
* **Auto-discovery**: Sessions register automatically via hooks
* **Real-time communication**: Sync queries and responses, not stale docs
* **Dashboard**: Monitor peer status and communication at `localhost:8377/dashboard`
* **Complementary**: Works alongside memory banks and documentation

## Read More

See the full story in the blog series:
* [Part 1: The Vibe Bottleneck](/blog/vibe-bottleneck/) - The problem with multi-repo coordination
* [Part 2: Repowire](/blog/repowire/) - The pull-based solution
