---
title: "The Problem with Current Dev Workflows and Coding Agents (Part 1)"
description: "Analyzing the limitations and challenges of integrating coding agents into modern development workflows."
pubDate: 2025-12-08
heroImage: "/images/blog/dev-workflows-coding-agents/hero.webp"
tags: ["AI", "DevOps", "Coding Agents", "Workflow", "Software Development"]
draft: true
---

*This is Part 1 of a 3-part series on the future of development workflows with AI agents.*

## Introduction

We are living through a paradigm shift in how software is built. Tools like Claude Code have given us a glimpse of a future where we don't just write code; we collaborate with intelligent agents to build it. But as anyone who has tried to use these agents for non-trivial, multi-repository work knows, the "future" is currently held together by duct tape and manual intervention.

The friction isn't in the *intelligence* of the models—it's in the *workflows* that surround them.

## The Friction Points

### 1. The Git Worktree Management Nightmare

In an ideal agentic workflow, every idea, every experiment, and every bug fix happens in isolation. You don't want an agent messing with your working directory while you're in the middle of a thought.

The theoretical answer to this is **Git Worktrees**. They allow you to check out multiple branches of the same repository into different directories. It sounds perfect: spin up a worktree for the agent, let it hack away, and merge it if it works.

In practice, however, this is an unsolved usability nightmare.
- **Creation is manual**: You have to explicitly create a directory, name it, and associate it with a branch.
- **Cleanup is non-existent**: After the agent is done (or fails), who cleans up the directory? Who prunes the worktree?
- **State drift**: You end up with a file system littered with `temp-agent-fix-1`, `claude-experiment-auth`, and `test-branch-fix` directories. `git worktree list` becomes a graveyard of abandoned contexts.

We are treating worktrees as disposable containers, but our tools still treat them as permanent infrastructure.

### 2. Multirepo Orchestration Chaos

Real-world software engineering rarely happens in a vacuum. A single feature often spans a frontend repo, a backend service, and a shared library.

To let an agent "see" the full picture, you forced into a messy pattern: creating a high-level **"meta-folder"** just to hold worktrees for multiple projects side-by-side.

Imagine you want to add a field to an API.
1. You need a worktree for the `backend` repo.
2. You need a worktree for the `frontend` repo.
3. You need a worktree for the `shared-types` repo.
4. You need to tell the agent where all these are relative to each other.

If you change the branch in one, you break the context in the others. The "workspace" is fragile. We are manually simulating a monorepo structure for tools that don't understand distributed architectures.

### 3. The Human Orchestrator (Human-in-the-Loop)

The term "Human-in-the-Loop" usually implies a review step: the AI generates code, and the human says "yes" or "no."

But the reality is that the human is doing far more than reviewing. We have become **Orchestrators**.
- We are the ones piping stdout from one tool to another.
- We are the ones copying context from the backend repo to the frontend agent session.
- We are the ones guiding the AI: "No, don't look in `src/`, look in `lib/`."

The human is reduced to a traffic controller. Instead of doing the work, we are constantly setting up the *environment* for the work to be done. We are the context window managers, the file system cleaners, and the dependency resolvers.

## A Vision for the Future

This friction exists because we are treating agents as improved text editors, rather than autonomous entities in a system.

**What if coding agents could discover other agents and orchestrate work between them?**

Imagine a world where:
- A **Session** isn't just a temporary chat window; it's a persistent object mapped to a specific task.
- **State** is stored not just in a transient CLI buffer, but in a protocol that tracks what the agent is doing, which worktrees it owns, and what other agents it is talking to.
- An agent working on the backend could say, "I need the frontend updated," and spawn a sub-agent (or discover an existing one) to handle that repo, handling the directory setup automatically.

We need to move from "Human using a Tool" to "Human directing a Swarm." We need parallels between concepts like **Claude Code** and **A2A (Agent-to-Agent)** communication—where the CLI isn't just an interface, but a state manager for distributed intelligence.

In the next post, I'll introduce a tool I built to try and solve this: **cc-a2a**.

<!-- [Continue to Part 2: Introducing cc-a2a](/blog/cc-a2a-tool) -->
