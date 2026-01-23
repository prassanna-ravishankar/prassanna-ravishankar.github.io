---
title: "The Vibe Bottleneck"
description: "Coding agents are great at understanding repositories. But when work spans multiple repos, you become the message transmitter, the slowdown, and the source of errors."
pubDate: 2026-01-23
heroImage: "/images/blog/vibe-bottleneck/hero.webp"
tags: ["AI", "Coding Agents", "Workflow", "Developer Experience"]
draft: false
---

*Part 1 of a 2-part series on multi-repo coordination with coding agents.*

## The New Human-in-the-Loop

The phrase "human in the loop" used to describe a quality gate: the agent writes code, you review it, approve or reject, maybe tweak a few lines before merging. That meaning has quietly shifted. If you've spent time with coding agents like Claude Code, Cursor, or Copilot Workspace, you know the promise they deliver for single-repo work. Describe what you want, and the agent builds it. It reads your codebase, internalizes your patterns, produces code that fits. Vibe coding, as some have taken to calling it.

The trouble is that most real work doesn't live in one repository. You've got a frontend, a backend, shared types, infrastructure config, a deployment pipeline maintained somewhere else entirely. When a task spans these boundaries, you stop reviewing code and start relaying messages between agents that have no way to talk to each other. The human in the loop becomes the human *as* the loop.

## Why Repo-Scoped Agents Work

This constraint isn't a bug; it's a reasonable design choice. A coding agent that deeply understands one codebase will consistently outperform one holding shallow knowledge of five. When Claude Code operates within a single repo, it loads your CLAUDE.md, learns your project's conventions and skills, and keeps its context window focused enough to actually read the code rather than hallucinating what it assumes might be there.

The same logic applies to human engineers: you wouldn't expect a single developer to maintain deep expertise across frontend, backend, infrastructure, and deployment pipelines simultaneously. Specialization works. The problem isn't that agents are specialists. The problem is that specialists need to coordinate, and right now that coordination layer is you.

## The Coordination Tax

Claude Code can spawn subagents to parallelize work within a single repo—improving a search UX while reworking the underlying data model, for instance. But those subagents inherit the parent's context, which remains scoped to the repository. The moment you need information from another codebase, you're back to being the relay.

Several workarounds have emerged, none of them satisfying. The superfolder hack involves cloning all your repos into one parent directory and pointing your agent there; technically it can see everything, but your repo-specific CLAUDE.md files start conflicting, your rules get confused, and the context window fills with code the agent doesn't need. You've traded specialization for visibility. The copy-paste dance means opening Claude in one repo, asking it to summarize something, then pasting that summary into another session. It works, but the context goes stale the moment someone pushes a commit. The ticket relay approach distills what one agent discovered into a Jira or Linear issue, then points the other agent at that artifact. More structured, perhaps, but now you're writing documentation for machines to consume.

Which raises the supposedly proper solution: just maintain good documentation. Keep architectural decisions recorded, API contracts current, deployment configs well-commented. The problem is that AI-assisted development moves fast enough for documentation to lag behind reality. When code is being generated at pace, docs become a trailing indicator of what the system actually does—often wrong before you've even merged the PR that would have required updating them.

## The Three Roles You Didn't Sign Up For

When you become the coordination layer between repo-scoped agents, you inherit three roles whether you want them or not.

The first is message transmitter. Agent A discovers something, you copy it, paste it into Agent B's session. You're functioning as a human API, shuttling context between processes that can't reach each other directly.

The second is slowdown. Two agents that could theoretically exchange information in milliseconds are instead waiting for you to context-switch, read, comprehend, and relay. You introduce async latency into what could be a sync operation.

The third role is the worst: source of errors. When you relay information between agents, details get lost in transit. You summarize instead of quoting verbatim. You paraphrase and accidentally drop a flag, a config key, a version number. The receiving agent works with incomplete information and produces subtly wrong output. And because you're the one who introduced the gap, you don't even know to look for it.

## When It Actually Breaks

I ran into this recently while deploying a staging service for [torale](https://github.com/prassanna-ravishankar/torale). The service required a certificate. Claude in the torale repo kept surfacing SSL errors, which was accurate. So I relayed "SSL error" to Claude in my infrastructure repo, [clusterkit](https://github.com/prassanna-ravishankar/clusterkit), and we spent time chasing certificate configurations.

The root cause turned out to be Cloudflare. ExternalDNS was auto-activating the Cloudflare proxy regardless of how many times I manually disabled it, and that proxy was interfering with certificate validation. The SSL error was real, but it was a symptom rather than the cause.

Had the agents been able to communicate directly, clusterkit-Claude might have asked about the proxy state, or torale-Claude might have shared logs pointing somewhere other than certificates. Instead I was the relay, and I kept transmitting "SSL error" because that's what I understood from the surface. Two hours of downtime because the human in the loop was a lossy channel.

## The Missing Piece

Coding agents have become remarkably good at understanding individual repositories. Give an agent a codebase, some rules, and sufficient context, and it will produce useful work. The specialization problem, for practical purposes, is solved.

The coordination problem is not. When work spans multiple repos, we fall back to human relay—slow, lossy, and prone to exactly the kind of errors that debugging tools aren't designed to catch.

In [Part 2](/blog/repowire), I'll introduce something I've been building to address this.
