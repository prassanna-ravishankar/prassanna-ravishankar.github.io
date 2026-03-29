---
title: "Repowire: A Mesh Network for AI Coding Agents"
published: false
description: "Your AI coding agents are isolated. Repowire lets them talk to each other across repos, runtimes, and machines."
tags: ai, agents, claude, developer-tools
cover_image:
---

AI coding agents are good at understanding one repository. Give Claude Code, Codex, or Gemini CLI a codebase and a task, and they produce useful work. The problem starts when your work spans more than one repo.

A typical task might touch a frontend, a backend, shared types, and infrastructure config. Each repo gets its own agent session. Those sessions cannot talk to each other. When the frontend agent needs to know what API shape the backend exposes, or when the infrastructure agent needs to know whether the app uses SSE or WebSockets, the question routes through you. You become the message bus: copying context from one terminal, pasting it into another, hoping you did not lose a flag or version number in transit.

[Repowire](https://github.com/prassanna-ravishankar/repowire) fixes this. It creates a mesh network where AI coding agents communicate directly, in real-time, about the code they are actually looking at.

## What it looks like

You are working in your frontend repo. You need to know what endpoints the backend exposes. Instead of switching terminals:

```
"Ask backend what API endpoints they expose"
```

The agent calls `ask_peer`, the query routes to the agent session in the backend repo, that agent reads the actual code and responds, and the answer comes back to your session. No copy-paste. No stale documentation. The context is live because it comes from an agent currently looking at the source of truth.

<!-- IMAGE: mesh.webp (1200x630)
PROMPT: Clean technical diagram in the style of Anthropic's engineering blog illustrations. Cream background. Three rounded rectangle containers arranged horizontally with generous spacing, labeled "frontend", "backend", "infra". Each container has a small colored block inside (warm orange, sage green, slate blue respectively) representing an agent session. Thin warm gray arrows connect all three containers to each other bidirectionally, forming a mesh. Above the mesh, a larger rounded rectangle labeled "orchestrator" with thin arrows pointing down to all three containers. Below the mesh, a rounded rectangle with a messaging icon labeled "telegram" with a thin arrow connecting to the mesh. The composition shows agents connected as peers, with an orchestrator above and messaging access below.

Typography: all-caps letter-spaced labels, lowercase for container names. Clean sans-serif. No gradients, no shadows, no icons beyond the messaging symbol. Muted earth tones.
-->

This works across Claude Code, OpenAI Codex, Google Gemini CLI, and OpenCode in any combination. The agents do not need to be the same runtime.

## Setup

Installation is one command:

```bash
uv tool install "repowire[all]"
# or pick your runtime
uv tool install "repowire[claudemux]"
uv tool install "repowire[codex]"
```

Then run setup:

```bash
repowire setup
repowire status
```

This installs hooks for your agent CLI, registers the MCP server, and starts the daemon. Open agent sessions in different repos (each in its own tmux window), and they auto-discover each other through the daemon.

```bash
# Terminal 1
tmux new-session -s dev -n frontend
cd ~/projects/frontend && claude

# Terminal 2
tmux new-window -t dev -n backend
cd ~/projects/backend && claude
```

The sessions are now peers in a mesh. Each one loads its own `CLAUDE.md`, understands its own codebase, and can reach out to others when it needs context from elsewhere.

## The tools

Repowire exposes MCP tools that agents use to communicate:

**`ask_peer`** sends a question to another agent and waits for the response. This is the core interaction: synchronous, pull-based, live context from the source of truth.

```
"Ask the infra peer whether the proxy is configured for WebSocket passthrough"
```

**`notify_peer`** sends a fire-and-forget message. Useful for status updates, alerts, or triggering work without waiting for a response.

```
"Notify the frontend peer that the API schema changed"
```

**`broadcast`** sends a message to all online peers. The orchestrator pattern (below) uses this to redirect work across the entire mesh simultaneously.

```
"Broadcast to all peers: stop optimizing test coverage, focus on shipping features"
```

**`list_peers`** shows all registered peers with their status, project path, and current task description.

**`spawn_peer`** launches a new agent session in a tmux window, registers it with the daemon, and makes it immediately addressable by other peers.

**`set_description`** updates the calling peer's task description, visible to all other peers via `list_peers`. This is how an orchestrator tracks what each peer is working on.

## The orchestrator pattern

An orchestrator is just a peer with a broader view. There is no special orchestrator mode. It is a regular agent session that happens to manage others rather than write code.

Start an orchestrator by opening a Claude Code session and giving it a brief:

```
"You are the orchestrator. Your peers are working on fastharness,
modalkit, phlow, clusterkit, a2a-registry, repowire, and the website.
Explore each project, find bugs, improve test coverage, fix what you
find. Use list_peers to see who is available. Use ask_peer to check
progress. Use broadcast to redirect work."
```

The orchestrator can `list_peers` to see all active sessions, `ask_peer` to check on progress or request information, `notify_peer` to assign tasks, and `broadcast` to redirect all peers at once. It maintains context across the entire mesh, catches quality issues that individual peers would miss (like mocked tests pretending to be real validation), and translates high-level directives ("focus on features, not coverage") into repo-specific instructions.

In a recent session, an orchestrator managed seven repositories simultaneously, producing 130+ commits across all of them while catching a SQL injection, a 9x logging cost bug, and silent worker failures that had survived human code review. The orchestrator's value was not in writing code but in coordination: cross-repo awareness, quality judgment, and the ability to redirect seven independent workstreams with one sentence.

## Manage from your phone

Repowire peers are not limited to terminal sessions. A Telegram bot registers as a peer in the mesh, which means you can monitor and direct your agents from your phone:

```bash
repowire telegram start
```

Notifications from agents appear in your Telegram chat. Messages you send route to peers. Sticky routing lets you select a specific peer and have subsequent messages go directly to it. A Slack bot works the same way:

```bash
repowire slack start
```

This is how the overnight orchestration session described above actually worked: the orchestrator ran on a home machine in London while being guided from a phone on a flight from London to San Francisco.

## Cross-machine communication

By default, repowire's daemon runs on localhost. The remote relay extends the mesh across machines:

```bash
repowire setup --relay
```

This connects the local daemon to a relay at `repowire.io` via an outbound WebSocket. Daemons on different machines (or behind NATs) can then communicate through the relay. The relay also provides a remote dashboard for monitoring peer status and communication.

<!-- IMAGE: relay.webp (1200x630)
PROMPT: Clean technical diagram in the style of Anthropic's engineering blog illustrations. Cream background. Two groups of rounded rectangles on the left and right sides of the image, labeled "Machine A" and "Machine B". Machine A has three small colored blocks inside (agent sessions). Machine B has two. In the center, a single rounded rectangle labeled "relay" with thin dashed warm gray arrows connecting both machines to it. The relay sits between the two machines, bridging them. Below, a rounded rectangle labeled "dashboard" connects to the relay with a thin arrow.

Typography: all-caps letter-spaced group labels, lowercase for component names. Clean sans-serif. Muted earth tones. No gradients, no shadows.
-->

## Channel transport (experimental)

For Claude Code v2.1.80+, repowire supports a channel transport that uses native MCP messaging instead of tmux injection:

```bash
repowire setup --experimental-channels
```

Messages arrive as `<channel>` tags and Claude responds using a `reply` tool, eliminating the transcript scraping that the tmux-based transport relies on. This is cleaner and more reliable, but requires a `claude.ai` login and the `bun` runtime.

## Runtime support

| Runtime | Transport | Notes |
|---------|-----------|-------|
| **Claude Code** | Hooks + MCP | Default, production-ready |
| **OpenAI Codex** | Hooks + MCP | Same hook pattern (auto-enabled) |
| **Google Gemini CLI** | Hooks + MCP | Uses `BeforeAgent`/`AfterAgent` events |
| **OpenCode** | Plugin + WebSocket | TypeScript plugin with persistent connection |

All four runtimes are first-class. You can mix them in the same mesh: a Claude Code session in one repo can `ask_peer` a Codex session in another. The daemon routes messages regardless of which runtime the peer uses.

## How it works

Three components:

**Daemon** runs as a system service on localhost, maintaining a registry of active sessions and routing messages between them. It knows which repos agents are in, what tmux panes they are running in, and whether they are busy or available.

**Hooks** integrate with each agent CLI's extension points. When a session starts, a hook registers it with the daemon. When the agent finishes responding, another hook captures the response and sends it back to whoever asked.

**MCP server** gives agents the tools to communicate: `ask_peer`, `notify_peer`, `broadcast`, `list_peers`, `spawn_peer`, `kill_peer`, `set_description`, `whoami`.

The result is that agent sessions become peers in a mesh. Each one remains specialized in its own repo while being able to reach out to others when it needs context that lives elsewhere.

## When to use it

Repowire is useful when:

- Work spans multiple repositories and agents need to share context
- You want an orchestrator that coordinates multiple agents without manual copy-paste
- You need to manage agents remotely (Telegram, Slack, or across machines)
- You are mixing agent runtimes (Claude + Codex + Gemini) and need them to communicate

It complements rather than replaces other approaches. Memory banks are still useful for persistent project knowledge. Documentation still matters for onboarding. Repowire adds a live, pull-based layer: when you need the current state of another repo's code, you ask an agent that is looking at it right now.

## Links

- **GitHub**: [github.com/prassanna-ravishankar/repowire](https://github.com/prassanna-ravishankar/repowire)
- **PyPI**: [pypi.org/project/repowire](https://pypi.org/project/repowire/) (3,634 monthly downloads)
- **Dashboard**: [repowire.io](https://repowire.io)
- **Deep dive**: [The Vibe Bottleneck](https://prassanna.io/blog/vibe-bottleneck/) (the problem) and [Repowire](https://prassanna.io/blog/repowire/) (the solution)
- **Case study**: [Overnight Agents](https://prassanna.io/blog/overnight-agents/) (130+ commits across 7 repos while sleeping)

```bash
uv tool install "repowire[all]"
repowire setup
repowire status
```

Open two agent sessions in different repos. Ask one about the other. That is the whole idea.
