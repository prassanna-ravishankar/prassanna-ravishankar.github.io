---
title: "AI-Assisted Development: Building Toward Something"
description: "After six months of AI-assisted development, the real surprise wasn't productivity gains—it was finally uncovering what I actually wanted to build all along."
pubDate: 2026-01-25
heroImage: "/images/blog/building-toward-something/hero.webp"
series: ["AI Agents", "Productivity"]
topics: ["Claude Code", "Gemini", "Tool Escape Velocity", "Torale", "Repowire"]
author: "Prassanna Ravishankar"
draft: true
---

Six months ago I wrote about my first thirty days with Claude Code. The thesis was uncomfortable but honest: I had become more productive and worse at programming. I shipped more projects than I had in years while simultaneously losing the ability to write code from scratch. The calculator-in-math-class analogy felt apt. I was trading one competence for another, and I wasn't sure the exchange rate was favorable.

That post captured something real about those first weeks. What it couldn't capture was what happened next.

## The Numbers

Before Claude Code, my GitHub contributions told a familiar story of good intentions and limited follow-through. In the twelve months prior to June 2025, I made 24 commits across 4 repositories. Side projects existed as ideas in notes apps, occasionally surfacing as abandoned branches before sinking back into the backlog.

In the eight months since, I've made 864 commits across 22 repositories.

These numbers deserve skepticism. Commits are a vanity metric. You can inflate them by committing frequently or by building things nobody needs. Thirty-six times more commits doesn't mean thirty-six times more value. But the shape of the activity tells a story the raw numbers can't: something changed in how I work, and it changed permanently.

July was intense, 279 contributions in a single month, the period that produced the original reflection. September collapsed to 16 contributions across 7 days, the "self-intervention" I mentioned for sleep. November hit 298 contributions, actually exceeding the famous first month, though I was too busy building to write about it. By December and January, the contribution count dropped but the nature of the work shifted. I was building fewer things, but building them deeper.

## Rising With the Models

The timing wasn't coincidental. My journey tracked almost perfectly with the model releases that made this kind of building possible.

I started in June 2025 with Claude 3.5 Sonnet, capable but limited in agentic tasks. August brought Claude Opus 4.1, explicitly focused on agentic capabilities. September saw Claude Sonnet 4.5. By November, when I hit my peak of 298 contributions, both Claude Opus 4.5 and Gemini 3 Pro dropped within days of each other. Gemini 3 arrived on November 18th billing itself as Google's "most powerful agentic and vibe coding model yet." December brought Gemini 3 Flash.

Each model generation made more ambitious projects feasible. The MCP servers I built in July required constant hand-holding. By November, I could describe coordination problems in natural language and get working implementations. The ceiling kept rising, and my projects rose with it.

This isn't a story about my productivity in isolation. It's about what becomes possible when the tools improve faster than you can adapt to them. Every time I internalized one model's limitations, the next generation removed them. The constraint I was designing around would evaporate, and I'd realize I could aim higher.

## The Actual Goal

The scattered projects of those six months had a center of gravity I didn't always acknowledge: [torale](https://github.com/prassanna-ravishankar/torale).

Torale started in February 2025, before the AI tooling really clicked for me. The idea was ambient information—a system that monitors the web and tells you when something you care about happens, without the noise of traditional alerts. Google Alerts spam you with false positives. RSS readers pile up unread items. I wanted intelligence that understood context and only surfaced what actually mattered.

V1 failed. I overengineered it with custom scrapers, vector databases, and RAG pipelines. By May it was abandoned, too complex and too fragile. The architecture was clever but the maintenance burden was unsustainable.

In November, riding the wave of Opus 4.5 and Gemini 3, I revived it. The new version was radically simpler: grounded search APIs instead of scrapers, LLM evaluation instead of embedding similarity. What took months of brittle infrastructure in V1 took days in V2. The models had gotten good enough that I could delete most of my code and let them handle what I'd been engineering around.

Torale remains my main focus—the product I'm actually trying to build, the problem I actually care about solving. But being a hobby project changes how I build it.

## The Permission to Wander

At work, when you hit a problem, you solve it and move on. The goal is shipping. If you encounter an interesting tangent—a coordination problem, a tooling gap, a design question—you note it and stay focused. The product matters more than the detour.

Hobby projects grant a different permission. When torale surfaced an interesting problem, I could follow it. The goal wasn't shipping torale as fast as possible. The goal was building things I found interesting, and torale was the context that kept surfacing interesting things.

I needed AI agents to interact with my experiment tracking while iterating on torale's ML components. At work, I'd have hacked something together and moved on. Instead, I spent time building [clearml-mcp](https://github.com/prassanna-ravishankar/clearml-mcp) properly—an MCP server other people could use. I needed to translate between cloud provider region names. That became [cloudregion](https://github.com/prassanna-ravishankar/cloudregion). I needed a faster way to deploy ML models. That became [modalkit](https://github.com/prassanna-ravishankar/modalkit).

I started thinking about how torale's components would discover each other, which led to [a2a-registry](https://github.com/prassanna-ravishankar/a2a-registry). I needed to search past Claude Code conversations to remember decisions I'd made. That became [cc-search](https://github.com/prassanna-ravishankar/cc-search). I needed better social preview images. That became [bananagraph](https://github.com/prassanna-ravishankar/bananagraph), still in progress.

None of these achieved significant traction. Single-digit stars. Limited adoption. By external measures, modest results. But they weren't distractions from the real work. They were the real work—the interesting problems that surfaced while building something I cared about. Torale ships slower because of these detours, but the detours are why I keep building.

The pattern that emerged: every extracted project was a different facet of the same underlying question. How do agents talk to tools? How do agents find other agents? How does context move between systems that weren't designed to share it?

## The One That Generalized

In late December, after months of circling the coordination problem from different angles, something crystallized. I was working on torale across multiple repositories—the core application, the infrastructure in clusterkit, various integrations—and I kept becoming the bottleneck. I'd ask Claude in one repo about an API shape, then manually copy that context to Claude in another repo. I was the message bus, slow and lossy.

The debugging session that broke me: two hours chasing an SSL error because I was relaying "SSL error" between agents without understanding the root cause. The actual problem was Cloudflare proxy configuration, but I couldn't see it because I was transmitting symptoms instead of letting the agents share context directly.

[Repowire](https://github.com/prassanna-ravishankar/repowire) shipped in January. It's a mesh network that lets Claude Code sessions talk to each other directly. One agent asks another agent a question, gets a response based on the actual code, no human relay required. Pull-based coordination instead of push-based documentation.

Repowire isn't what I set out to build. Torale is what I set out to build. But repowire turned out to be useful infrastructure that other people can actually use. It solved my problem and happened to generalize. That's how most useful tools get created—not by setting out to build infrastructure, but by following an interesting problem far enough that the solution becomes reusable.

## Parallel Tracks

During this period my day job at Scale involved thinking about AI agents from the enterprise perspective. In November, I co-authored a piece on the [foundations of agency](https://scale.com/blog/agency), arguing that agentic systems require two disciplines: agent execution (building persistent, adaptive agents) and agentic operations (security, observability, cost management).

I was living the same problem from both directions. At work, theorizing about how organizations should build agentic systems. At home, hitting the actual limits of those systems while building torale. The frameworks I was writing about professionally—orchestration, dynamic discovery, governance—were exactly what I needed and couldn't find for my side projects.

The side projects weren't separate from work. They were R&D for ideas that couldn't be fully explored in a production context. What I learned building torale informed how I thought about enterprise agent architecture. What I learned thinking about enterprise constraints informed what I built at home. Theory and practice feeding each other, each making the other sharper.

## Tool Escape Velocity

There's a phase transition that happens when you use a tool long enough. Initially you consume it, learning its patterns, adapting your workflow to its capabilities, occasionally fighting its limitations. If you stay in this phase, the tool shapes you. Your projects become sized and scoped to what the tool handles well.

But past a certain threshold, something inverts. You stop adapting to the tool and start extending it. The limitations that once constrained you become specifications for what you need to build. You've reached what I think of as tool escape velocity: the point where you stop orbiting and start contributing to the gravity well yourself.

The thirty-day reflection captured me in the first phase, worried about what I was losing, unsure whether the tradeoff was worth it. The six-month reality is that I crossed into the second phase without noticing. The MCP servers, the agent registries, repowire—they weren't symptoms of dependency on AI tools. They were the early signs of escape velocity.

This isn't unique to AI. Developers who use Vim long enough start writing plugins. Engineers who deploy to Kubernetes eventually build operators. The tool becomes a platform, and the platform becomes something you extend. The difference with AI-assisted development is how quickly it happens and how high up the stack it pushes you.

## The Upstack Migration

In June 2025, I worried about losing the ability to write algorithms from scratch. By January 2026, I was designing inter-agent communication protocols.

The fear was real but misframed. I wasn't losing a skill and failing to notice. I was specializing upward, trading fluency at one level of abstraction for leverage at a higher one. The calculator doesn't make you worse at arithmetic in any way that matters if your actual work is calculus.

What I discovered over six months is that I was never primarily interested in syntax. I'm a systems thinker who was forced to write syntax because that was the only way to make systems exist. The moment I got tools that handled syntax reliably—and they got reliable fast, from Opus 4.1 in August to Gemini 3 in November—I immediately migrated to the problems I actually cared about: how information flows, how systems coordinate, how context moves between boundaries.

This isn't a universal experience. Some developers genuinely love the craft of writing code, the aesthetics of elegant implementation. For them, AI assistance might feel like a loss. But for those whose real interest lies upstream—in architecture, in system design, in the coordination problems between components—these tools are a liberation. You can finally work at the level you were always trying to reach.

## What I Learned

Six months of building taught me things I couldn't have learned by thinking.

**Real projects surface real problems.** Toy projects and tutorials don't generate the interesting tangents. Torale surfaced clearml-mcp, repowire, bananagraph, and a dozen smaller tools because it was real enough to encounter real friction. If you want to find problems worth solving, build something you actually care about and pay attention to what blocks you.

**The useful infrastructure emerges sideways.** I didn't set out to build agent coordination tools. I set out to build torale and kept hitting coordination problems. The reusable pieces extracted themselves. Trying to build infrastructure directly, without a driving use case, produces solutions looking for problems.

**Hobby projects let you follow interesting problems.** At work, you solve blockers and ship. On a hobby project, you can spend a month on a tangent because the tangent is interesting. Torale ships slower because of the detours, but the detours produced the things other people can actually use.

**The models improve faster than you can adapt.** Design for the ceiling rising. What's impossible in August might be trivial by November. The constraint you're engineering around might evaporate with the next release. Stay loose.

**Theory and practice feed each other.** Working on enterprise agent architecture at Scale sharpened how I thought about my side projects. Building torale revealed gaps in the enterprise frameworks. Do both if you can.

**You might not know what you're building toward.** The reconnaissance phase felt scattered because it was scattered. But the accumulation eventually revealed the shape. You can't think your way to clarity on what you care about. You have to build enough things to find out.

## The Uncomfortable Part

Six months of building hasn't resolved the original tension. I am demonstrably worse at writing code from scratch than I was before AI assistance. The skill atrophied exactly as I feared. When I occasionally work without Claude Code, the rust is real and immediate.

But the framing was wrong. "Worse at programming" assumes programming stays constant while you change. The actual situation is that both you and the activity are changing simultaneously. What programming means in January 2026—after Opus 4.5, after Gemini 3, after tool use became reliable—isn't what it meant even six months ago. The leverage points have shifted. The valuable skills have migrated.

I can't hand-write a binary search as fluently as I once could. I can design a multi-agent coordination system in an afternoon and have working infrastructure by evening. These feel like different competencies, and in some sense they are. But they're also points on a continuum, and the direction of travel seems clear.

## Building Toward Something

The title of this piece admits uncertainty. I spent six months building toward something without always knowing what it was. The reconnaissance phase felt scattered because it was scattered—different experiments probing different facets of problems I couldn't fully articulate.

But there was a throughline: torale. The ambient information system I've been trying to build since February. The project that failed in V1 and revived in V2. The context that kept surfacing interesting problems worth following.

Every useful thing I built emerged from torale. Repowire came from needing agents to coordinate across torale's repos. The MCP servers came from needing agents to interact with torale's ML tooling. The a2a experiments came from thinking about how torale's components would discover each other. Even bananagraph came from needing better social images for sharing torale.

864 commits and 22 repositories later, the hit rate isn't high. Most projects went nowhere. But the process of building them—riding the model improvements from Opus 4.1 through Gemini 3, following interesting problems wherever they led, extracting the reusable pieces—that process clarified what I actually cared about in a way that no amount of thinking could have.

If you're using AI tools and feeling the same uncertainty I felt at thirty days—productive but uneasy, shipping but suspicious—the only advice I can offer is to keep building. Not because it resolves the uncertainty, but because it eventually reveals what you were building toward. The reconnaissance phase has a purpose even when you can't see it.

Tool escape velocity is real. You can reach it. But you have to stay in orbit long enough for the acceleration to compound. And it helps to have something you actually care about—something that surfaces interesting problems and gives you permission to follow them.

---

*Torale is at [github.com/prassanna-ravishankar/torale](https://github.com/prassanna-ravishankar/torale). Repowire is at [github.com/prassanna-ravishankar/repowire](https://github.com/prassanna-ravishankar/repowire). The rest of the projects are on [GitHub](https://github.com/prassanna-ravishankar).*
