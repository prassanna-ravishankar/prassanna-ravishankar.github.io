---
title: "Repowire: A Pull-Based Context Breakout"
description: "What if coding agents could ask each other questions directly? Introducing repowire, a mesh network that lets Claude Code sessions communicate in real-time."
pubDate: 2026-01-24
heroImage: "/images/blog/repowire/hero.webp"
series: ["AI Agents"]
topics: ["Claude Code", "Repowire", "Open Source"]
draft: false
---

*Part 2 of a 2-part series on multi-repo coordination with coding agents. Read [Part 1](/blog/vibe-bottleneck/) first.*

## The Gap

In [Part 1](/blog/vibe-bottleneck/), I introduced the idea of a context breakout (any mechanism that moves context across repository boundaries) and argued that every existing approach is push-based. You write documentation, persist memory banks, copy summaries into tickets, hoping the context will be useful when someone needs it later. The problem is that push-based context goes stale the moment someone pushes a commit, and when it fails you become the relay: slow, lossy, error-prone.

What's missing is a pull-based context breakout, where an agent can ask a question when it needs an answer and get a response from the actual source of truth. Not from documentation you wrote last week, but from another agent that's currently looking at the code.

I built [repowire](https://github.com/prassanna-ravishankar/repowire) to fill that gap.

## What Repowire Does

Repowire is a mesh network for AI coding agents. It lets Claude Code sessions talk to each other directly, in real-time, about the code they're actually looking at.

The interaction is simple. You're working in your frontend repo and you need to know what API shape the backend exposes. Instead of switching terminals, copying context, or hoping your docs are current, you just ask:

```
"Ask backend what API endpoints they expose"
```

Claude uses an `ask_peer` tool, the query routes to the Claude session in your backend repo, that agent reads the actual code and responds, and the answer comes back to your frontend session. No human relay. No stale documentation. The context is live because it comes from an agent that's looking at the current state of the code.

![Repowire routes queries between repo-scoped agents](/images/blog/repowire/chart.svg)

This is what pull-based means in practice: the agent requests context when it needs it, from the source of truth, on demand.

## How It Works

Repowire runs as three components that work together to enable cross-repo communication.

A **daemon** runs as a system service on your machine, listening on localhost. It maintains a registry of active Claude sessions (which repos they're in, what tmux panes they're running in, whether they're busy or available) and routes messages between them. When frontend-Claude wants to ask backend-Claude a question, the daemon knows where to send it.

**Hooks** integrate with Claude Code's extension points. When you start a Claude session, a hook registers it with the daemon. When Claude finishes responding, another hook captures that response and sends it back to whoever asked. The hooks are how repowire sees into Claude sessions without needing an API that doesn't exist.

An **MCP server** gives Claude the tools it needs to communicate: `ask_peer` to send a query and wait for a response, `list_peers` to see what other sessions are available, `notify_peer` to send fire-and-forget messages, and `broadcast` to announce something to all peers at once.

The result is that Claude sessions become peers in a mesh. Each one remains specialized in its own repo (loading its own CLAUDE.md, understanding its own codebase) but can reach out to others when it needs context that lives elsewhere.

## Getting Started

Repowire requires macOS or Linux, Python 3.10+, and tmux. Installation is one command:

```bash
uv tool install "repowire[claudemux]"
# or: pip install "repowire[claudemux]"
```

Then run setup to install the hooks, register the MCP server, and start the daemon:

```bash
repowire setup
repowire status  # verify everything is running
```

Now open Claude Code in two different repos, each in its own tmux window:

```bash
# Terminal 1
tmux new-session -s dev -n frontend
cd ~/projects/frontend && claude

# Terminal 2
tmux new-window -t dev -n backend
cd ~/projects/backend && claude
```

The sessions auto-discover each other through the daemon. In your frontend session, you can now ask:

```
"Ask backend what API endpoints they expose"
```

And get a real answer based on the actual code in the backend repo.

## What This Enables

The immediate benefit is obvious: you stop being the message bus. When frontend-Claude needs to know something about backend, it asks directly instead of waiting for you to copy-paste context between terminals.

But the more interesting benefit is what happens to your debugging workflow. Remember the torale incident from Part 1, where I spent two hours chasing SSL errors because I was relaying "SSL error" between agents without understanding the root cause? With repowire, torale-Claude could have asked clusterkit-Claude directly about the proxy configuration, gotten specific information about ExternalDNS behavior, and likely identified the Cloudflare issue much faster. The agents can have a conversation that's higher bandwidth than what I could relay as an intermediary.

There's also a compositional quality that emerges. Once agents can talk to each other, you can orchestrate multi-repo tasks without manually shuttling context. Ask your deployment agent to coordinate with your app agent. Have your frontend agent verify assumptions with your backend agent before making changes. The human role shifts from message relay to task initiator—you describe what you want, and the agents figure out what context they need from each other.

## Complementary, Not Competing

Repowire doesn't replace push-based context breakouts; it complements them. Memory banks are still useful for persistent project knowledge that doesn't change often (architectural decisions, team conventions, historical context). Documentation still matters for onboarding humans and for context that needs to survive beyond any single session.

What repowire provides is a different mode: synchronous, pull-based, live. When you need to know the current state of another repo's code, not what someone wrote down about it last month, you can ask an agent that's actually looking at it. Push-based approaches capture what was true when you wrote it down. Pull-based approaches tell you what's true right now.

The combination is powerful. Use memory banks for the stable context that provides grounding. Use repowire for the live queries that need current answers. The agents get the best of both: persistent knowledge and real-time coordination.

## Try It

Repowire is open source, available at [github.com/prassanna-ravishankar/repowire](https://github.com/prassanna-ravishankar/repowire). It's still early (the claudemux backend is production-ready but the multi-machine relay is experimental) but it's been running reliably in my own workflow for a while now.

If you work across multiple repos and you're tired of being the context relay between your Claude sessions, give it a try. The setup takes a few minutes, and once it's running you might be surprised how natural it feels for agents to just ask each other questions.

The pull-based context breakout was the missing piece. Now it exists.
