---
title: "Overnight Agents: What Happened When I Let 7 AI Peers Run My Repos"
description: "I launched an orchestrator that managed 7 Claude Code peers across repos simultaneously. They found SQL injections, fixed a 9x cost bug, built new features, and shipped 130+ commits while I slept."
pubDate: 2026-03-16
heroImage: "/images/blog/overnight-agents/hero.webp"
series: ["AI Agents"]
topics: ["Claude Code", "Repowire", "multi-agent coding", "ai coding agents", "autonomous AI agents"]
author: "Prassanna Ravishankar"
draft: true
---

I wrote about [the vibe bottleneck](/blog/vibe-bottleneck/) two months ago, arguing that multi-repo coding turns you into a message bus between agents that cannot talk to each other. Then I built [Repowire](/blog/repowire/) to fix it. What I did not anticipate was what happens when you stop relaying messages and start orchestrating.

Last week, I launched an orchestrator peer and pointed it at seven of my repositories: [fastharness](https://github.com/prassanna-ravishankar/fastharness), [modalkit](https://github.com/prassanna-ravishankar/modalkit), [phlow](https://github.com/prassanna-ravishankar/phlow), [clusterkit](https://github.com/prassanna-ravishankar/clusterkit), [a2a-registry](https://github.com/prassanna-ravishankar/a2a-registry), [repowire](https://github.com/prassanna-ravishankar/repowire), and this website. Each repo got its own Claude Code session. The orchestrator could see all of them, assign work, check progress, redirect effort, and relay context between peers when they needed it. Then I went to sleep.

I woke up to 130+ commits across seven repos, real bugs found and fixed, new features built and tested, and a dashboard I did not ask for.

This is what happened.

## The setup

Repowire's mesh gives each Claude Code session awareness of the others. An orchestrator is just a peer with a broader view: it can `list_peers` to see who is available, `ask_peer` to check on progress or request information, `notify_peer` to assign work, and `broadcast` to redirect all peers at once. There is no special orchestrator mode. It is a regular Claude Code session that happens to be managing others rather than writing code.

I started the orchestrator with a simple brief: explore each project, find bugs, improve test coverage, fix what you find, and ship. Each repo peer loaded its own CLAUDE.md, understood its own codebase, and operated autonomously within its repository. The orchestrator's job was coordination: deciding priorities, catching quality issues, and moving context between repos when one peer's work affected another.

The first thing the orchestrator did was ask each peer to explore its codebase and report back. Within minutes, it had a map of all seven projects, their states, their test coverage, and their most obvious problems. Then it started assigning work.

## What the peers actually shipped

The numbers across the session: 130+ commits, roughly 100 bugs found and fixed, test counts that doubled or tripled across most repos, and several new features that nobody explicitly asked for but that made sense once the peers understood the codebases.

**Fastharness** received the most architectural work. The peer built an `AgentRuntime`/`AgentRuntimeFactory` protocol system that decouples agent execution from any specific SDK, then implemented three runtime backends (Claude Agent SDK, OpenHands, Pydantic DeepAgents) behind that abstraction. It added A2A streaming via `message/sendStream`, built a `FastHarnessClient` for Python (text in, text out, with streaming support), and centralized 46 A2A protocol callsites into 3 factory functions for forward compatibility with A2A v1.0. Eighteen commits on a feature branch, 178 unit tests and 14 integration tests, all three backends functionally validated with real API calls. Four bugs found and fixed along the way.

**Modalkit** got 20 commits covering three bug fixes (volume reload, SQS queue_url handling, extra_run_commands), two new CLI tools (`modalkit init` and `modalkit validate`), strict config validation that catches YAML typos at parse time rather than at deploy time, inference timing observability, and a fix for HTTP responses that were leaking exception details to clients. Coverage went from 82% to 99% across 137 tests.

**Phlow** had its adoption blocker removed. The peer built `PhlowAuth`, a JWT authentication path that works without Supabase, which had been the number one reason people bounced off the library. It also found and fixed a SQL injection in `generate_rls_policy()`, a swallowed `AuthenticationError` that silently passed invalid credentials, a None JWT `sub` field that broke token verification, and wrong A2A field names in the protocol bridge. It built a CLI with `generate-token`, `decode-token`, and `verify-token` commands, removed a redundant header that confused integrators, overhauled the docs (removing 10+ references to phantom classes that did not exist), and took test count from 63 to 325 with coverage jumping from 40% to 77%. Thirteen commits.

**Clusterkit** is my Terraform infrastructure repo, so the work there was different in character. The peer found a log sampling bug that had inverted a filter, causing 9x the intended logging cost. It tightened Cloud SQL ACLs, enforced TLS 1.3, added `master_authorized_networks` restrictions, removed 600+ lines of dead code, added a GCS remote backend to migrate off local state files, made Workload Identity data-driven, and built a health-check script. It also disabled HTTP/3 on repowire.io because HTTP/3's UDP transport was breaking Server-Sent Events for the Repowire dashboard. Twenty-two commits.

**A2A Registry** received 23 commits. The peer found seven bugs including an `assert` statement being used for validation in production code, a dead-code exception handler that could never fire, and silent worker failures that swallowed errors. It fixed a SQL injection vulnerability by parameterizing a capability filter, added an SSRF blocklist, collapsed six database queries into two for the stats endpoint, added skills-based search and a `HEALTHY_ONLY` filter, implemented verified badges, and brought A2A v1.0 compatibility for the new `interfaces[]` URL extraction format. The number of verified agents in the registry went from 5 to 14.

**Repowire** itself got improved during the session. The peer fixed the tool call pipeline end-to-end, took tests from 107 to 220, and then built a Datastar-based dashboard to replace the React/Next.js one. The new dashboard is 600 lines versus 1,200 plus a build pipeline, uses server-sent events for live updates, and shipped to repowire.io/v2. There is something satisfying about a tool improving itself while you use it.

**This website** got View Transitions fixes, theme consistency cleanup across eight files, a font mismatch correction, a stale social link update, and a new project page for fastharness.

## What the orchestrator actually does

The interesting part is not what each peer did in isolation. Any Claude Code session can explore a codebase, find bugs, and write tests. The orchestrator's value was in coordination: maintaining context across all seven repos, catching quality issues that a single peer would not notice, and redirecting work in real-time.

Early in the session, several peers fell into a test-grinding pattern. They would find a bug, fix it, then spend disproportionate time inflating test coverage on code that did not need it. The orchestrator noticed the pattern across multiple repos simultaneously and broadcast a redirect: stop grinding tests, ship features. All peers pivoted immediately. Without the orchestrator, each peer would have continued optimizing locally for coverage numbers that did not reflect real quality.

The orchestrator also caught a quality issue that would have been invisible to any individual peer. The fastharness peer reported that it had "functionally validated all three runtime backends." The orchestrator asked how, and discovered the peer had written mocked tests that simulated API responses rather than making real API calls. The mocks passed, but they proved nothing about whether the backends actually worked. The orchestrator pushed back, and the peer re-ran validation with real API calls, finding and fixing four bugs in the process. Those bugs would have shipped if the orchestrator had not questioned the methodology.

Context routing was the third function. When the clusterkit peer discovered that HTTP/3 was breaking SSE on repowire.io, it needed to know whether the Repowire dashboard used SSE or WebSockets. Instead of guessing, the orchestrator asked the repowire peer directly, confirmed SSE, and relayed the answer. The clusterkit peer then made an informed decision to disable HTTP/3. Without the mesh, I would have been the one relaying that question between terminals.

## What I learned

The first lesson is that orchestration quality matters more than individual peer capability. Every peer was running the same model. The difference between good output and test-grinding busywork was not the model; it was direction. The orchestrator provided what individual peers lacked: cross-repo awareness, quality judgment, and the authority to say "stop doing that, do this instead."

The second lesson is that autonomous agents find real bugs. This was not a synthetic benchmark. The SQL injection in phlow's `generate_rls_policy()` was a real vulnerability in production code. The 9x logging cost in clusterkit was burning real money. The silent worker failures in a2a-registry were swallowing real errors. These are the kinds of bugs that survive code review because they require understanding the full context of how a function is called, not just what it does. Agents that can read the entire codebase catch things that humans scanning diffs do not.

The third lesson is about feedback loops. Midway through the session, I checked in and told the orchestrator to stop grinding tests and focus on features. That single instruction propagated to all seven peers within minutes. The ability to steer seven independent workstreams with one sentence is a different kind of leverage than what I described in the [Claude Code productivity post](/blog/reflections-claude-code/). That was one human directing one agent. This was one human directing an orchestrator directing seven agents, and the orchestrator maintained the context and judgment to translate a vague directive ("stop grinding, ship features") into specific, repo-appropriate instructions for each peer.

The fourth lesson is that the human role has shifted again. In the [vibe bottleneck](/blog/vibe-bottleneck/) post, I described the progression from "writer of code" to "director of code writing." This session pushed it further. I was not directing code writing. I was directing an orchestrator that was directing code writing. My inputs were strategic ("focus on features, not coverage"), evaluative ("is that actually validated or just mocked?"), and occasionally creative ("write a blog post about this"). The actual engineering decisions, hundreds of them, happened without me.

## The meta moment

The session had a recursive quality that I did not plan for. Repowire, the tool that enables multi-agent coordination, was itself being improved by a peer in the mesh it enables. The orchestrator was using Repowire to coordinate the peer that was upgrading Repowire's dashboard. The new dashboard, built with Datastar and SSE, replaced a React app that required a build pipeline, and it was tested live on repowire.io while other peers were communicating through the same infrastructure.

I wrote about [agent drift](/blog/agent-drift/) last month, arguing that autonomous agents degrade over long-horizon tasks through accumulated context pollution. This session was a partial counterexample. The peers did not drift because the orchestrator was constantly checking their work, redirecting their focus, and catching quality issues before they compounded. The orchestrator itself did not drift because I checked in periodically with high-level course corrections. The architecture, human to orchestrator to peers, created natural checkpoints that prevented the kind of unchecked degradation I described in that post.

Whether this generalizes beyond a single session with an attentive orchestrator and a human who checked in at the right moments, I genuinely do not know. But the output was real: 130+ commits, real bugs fixed, real features shipped, across seven repos, overnight.

The infrastructure for this exists today. Repowire is [open source](https://github.com/prassanna-ravishankar/repowire). The orchestrator pattern requires nothing beyond a Claude Code session with Repowire's MCP tools and a brief that describes the work. The bottleneck is no longer the tooling. It is figuring out what to point it at.
