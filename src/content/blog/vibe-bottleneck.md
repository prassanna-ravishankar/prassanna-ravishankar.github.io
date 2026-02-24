---
title: "The Vibe Bottleneck: AI Coding Workflow Across Multi-Repo"
description: "Multi-repo coding agent workflows turn you into the message bus. When work spans repositories, you become the slowdown and the source of errors."
pubDate: 2026-01-23
heroImage: "/images/blog/vibe-bottleneck/hero.webp"
series: ["AI Agents"]
topics: ["Claude Code", "Workflow", "Developer Experience"]
draft: false
---

*Part 1 of a 2-part series on multi-repo coordination with coding agents.*

## The New Human-in-the-Loop

The phrase "human in the loop" used to describe a quality gate (the agent writes code, you review it, approve or reject, maybe tweak a few lines before merging) but that meaning has quietly shifted into something less flattering. If you've spent time with coding agents like Claude Code, Cursor, or Copilot Workspace, you know the promise they deliver for single-repo work: describe what you want and the agent builds it, reading your codebase, internalizing your patterns, producing code that fits. Vibe coding, as some have taken to calling it, and for contained projects it genuinely works.

The trouble emerges when you remember that most real work doesn't live in one repository. A typical task might touch a frontend, a backend, shared types, infrastructure config, and a deployment pipeline maintained in yet another repo, and when work spans these boundaries you stop reviewing code and start relaying messages between agents that have no mechanism to communicate with each other. The human in the loop becomes the human *as* the loop—not a quality gate but a message bus, and not a particularly reliable one.

## Why Specialization Works

This constraint isn't a bug so much as a reasonable design choice with uncomfortable downstream consequences. A coding agent that deeply understands one codebase will consistently outperform one holding shallow knowledge of five, and when Claude Code operates within a single repo it can load your CLAUDE.md, learn your project's conventions and skills, and keep its context window focused enough to actually read the code rather than hallucinating what it assumes might be there. The same logic applies to human engineers: you wouldn't expect a single developer to maintain deep expertise across frontend, backend, infrastructure, and deployment pipelines simultaneously, because specialization enables depth and depth enables quality.

The problem, then, isn't that agents are specialists (specialization works) but that specialists need to coordinate, and right now that coordination layer is you, sitting between Claude sessions and copying context from one terminal to another.

## The Coordination Tax

Here's a useful way to think about this: any mechanism that moves context across repository boundaries is a *context breakout*. Several exist, and people reach for them constantly.

Claude Code can spawn subagents to parallelize work within a single repo, improving a search UX while reworking the underlying data model in parallel, but those subagents inherit the parent's context, which remains scoped to the repository. The moment you need information from another codebase, you need a context breakout, and the options aren't great.

The superfolder hack involves cloning all your repos into one parent directory and pointing your agent there, which technically grants visibility across everything but causes your repo-specific CLAUDE.md files to conflict, confuses your rules, and fills the context window with code the agent doesn't need. You've traded specialization for visibility and gotten neither reliably. The copy-paste dance means opening Claude in one repo, asking it to summarize something, then pasting that summary into another session, which works until someone pushes a commit and your context goes stale. The ticket relay approach distills what one agent discovered into a Jira or Linear issue, then points the other agent at that artifact, more structured perhaps but now you're writing documentation for machines to consume. Memory banks persist structured context across sessions, useful for project knowledge that doesn't change often but still dependent on someone keeping it current.

The pattern across all of these is that they're push-based: you publish context ahead of time, hoping it will be useful when needed later. And when push-based context breakouts fail (docs stale, ticket incomplete, summary lossy) you inherit roles you didn't ask for: message transmitter, copying what Agent A discovered and pasting it into Agent B's session like a human API; slowdown, introducing async latency into what could be sync operations while agents wait for you to context-switch, read, comprehend, and relay; and worst of all, source of errors, the role that actually causes damage.

![The human becomes the bottleneck between repo-scoped agents](/images/blog/vibe-bottleneck/chart.svg)

That last role deserves attention because it's insidious. When you relay information between agents, details get lost in transit. You summarize instead of quoting verbatim, paraphrase and accidentally drop a flag, a config key, a version number. The receiving agent works with incomplete information and produces subtly wrong output. The worst part is that you're the one who introduced the gap, which means you don't even know to look for it when debugging later.

## Two Hours of Downtime

I ran into this recently while deploying a staging service for [torale](https://github.com/prassanna-ravishankar/torale), which required a certificate. Claude in the torale repo kept surfacing SSL errors, accurate but not actionable, so I relayed "SSL error" to Claude in my infrastructure repo, [clusterkit](https://github.com/prassanna-ravishankar/clusterkit), and we spent time chasing certificate configurations that turned out to be fine.

The root cause was Cloudflare: ExternalDNS was auto-activating the Cloudflare proxy regardless of how many times I manually disabled it, and that proxy was interfering with certificate validation. The SSL error was real but it was a symptom rather than the cause, and had the agents been able to communicate directly, clusterkit-Claude might have asked about the proxy state, or torale-Claude might have shared logs pointing somewhere other than certificates. Instead I was the relay, transmitting "SSL error" because that's what I understood from the surface, and two hours of downtime followed because the human in the loop was a lossy channel.

## The Pull-Based Gap

Coding agents have become remarkably good at understanding individual repositories. Give an agent a codebase, some rules, and sufficient context, and it will produce useful work. The specialization problem, for practical purposes, is solved.

The coordination problem is not. Every context breakout that exists today is push-based: you write it down, publish it, hope it's still accurate when someone needs it. What's missing is a pull-based context breakout, where an agent can ask a question when it needs an answer and get a response from the actual source of truth—not from documentation you wrote last week, but from another agent that's currently looking at the code.

In [Part 2](/blog/repowire), I'll introduce something I've been building to address exactly that.
