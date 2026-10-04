---
title: "The Age of Software Factories"
subtitle: "From a complex problem to a working system. Discovery included."
description: "Software factories organise agents to investigate complex problems, build the right systems, and carry them through verification into production."
pubDate: 2026-10-04
updatedDate: 2026-10-04
heroImage: "/images/blog/software-factories/hero.webp"
series: ["AI Agents", "Futures"]
topics: ["software factories", "autonomous agents", "agent infrastructure", "multi-agent coding"]
author: "Prassanna Ravishankar"
draft: false
---

Give agents a complex problem, access to the relevant tools, and room to work. They investigate, propose a solution, build it, test it, and carry it into production. Along the way, they may discover that the original request missed the real problem.

That is the promise of a **software factory**: an organised system of agents and infrastructure that turns intent into working software. Its products can be applications, integrations, workflows, infrastructure changes, or other agents.

The important capability is the continuity of the work. A coding agent can implement a task. A factory takes responsibility for the journey: deciding what needs to exist, constructing it, establishing that it works, and learning from what happens after release.

Parts of this journey are already possible autonomously in bounded settings. Making them reliable across complex environments is the next engineering challenge.

![The factory moves from intent to production, with evidence feeding back into investigation and design.](/images/blog/software-factories/factory-loop.svg)

## The problem is part of the work

Many useful software projects begin with an imprecise request: reduce onboarding delays, investigate recurring incidents, make this service cheaper, build a product for a new market. The implementation cannot be specified fully because the necessary understanding does not exist yet.

A factory needs to develop that understanding. It can inspect code, examine permitted records, analyse telemetry, reproduce failures, and ask for missing context. Its plan should change as evidence arrives.

Consider supplier onboarding. The brief is to shorten the process while preserving approval rules. Investigation reveals three different causes of delay: documents that never reach the right record, approvals that require long waits across systems, and inconsistent documents that need interpretation.

Those findings imply different solutions. The missing links need an integration. The approvals need a durable workflow. Document interpretation may benefit from a specialist agent. A conventional database, typed APIs, and deterministic rules hold the resulting system together.

![Discovery shapes the solution: integrations, durable workflows, and specialist agents address different causes.](/images/blog/software-factories/discovery.svg)

Construction produces more discoveries. Two services may disagree about identifiers. An API may acknowledge a write before the record becomes readable. These findings must reach the design and acceptance criteria, rather than disappear into local patches.

The same process can conclude that a configuration change or an existing product is sufficient. Success means resolving the problem. Commit counts and agent counts are poor substitutes.

## The machinery is emerging

Several recent projects demonstrate pieces of this capability.

[StrongDM's software factory](https://factory.strongdm.ai/) describes agents building from specifications and scenarios without human code review. Behavioural replicas of external services provide a controlled test environment; scenarios held outside the codebase help keep acceptance separate from implementation.

[Cursor's experiments with long-running agents](https://cursor.com/blog/scaling-agents) show why organisation matters. Flat coordination produced contention and stalled progress. Separating planning, execution, and judging helped, although additional coordination roles could also become bottlenecks. More agents do not automatically produce more useful work.

[Anthropic's application-development harness](https://www.anthropic.com/engineering/harness-design-long-running-apps) connects a planner, generator, and evaluator that interacts with the running application. Its experiments also exposed missed bugs and the need to tune evaluation. Some scaffolding became unnecessary as models improved.

A [September 2026 paper from Microsoft researchers](https://arxiv.org/abs/2609.36323) extends the factory model across targeting, coding, review, and operations, grounded in shared system knowledge and telemetry. Its demonstrated scope is the evolution of data systems against measurable objectives; general target selection and correctness remain open problems.

Together, these results suggest that the building blocks are available. They also locate the hard work: maintaining context, coordinating dependencies, and producing trustworthy evidence across a long task. Broad autonomy still has to be demonstrated under the conditions where it will be used.

## Two layers support the factory

The architecture has two useful layers. The **factory layer** organises engineering work. The **software and agent platform** makes that work executable, durable, and observable.

![The factory organises engineering work. A shared platform supports its workers and the systems they produce.](/images/blog/software-factories/architecture.svg)

[View the architecture at full size](/images/blog/software-factories/architecture.svg).

The factory maintains the brief, evidence, plan, dependencies, and acceptance criteria. It assigns work, reconciles conflicting findings, and decides whether results justify continuing. Shared state must distinguish an observation from an assumption and a completed action from an intention.

The platform supplies repositories, managed sandboxes, model access, identity, secrets, data, deployment pipelines, and production runtimes. Traces, evaluations, and cost tracking connect activity to results. Much of this is familiar infrastructure, extended for workers that create tools, delegate tasks, and operate across sessions.

Two distinctions matter. First, a construction sandbox and a production runtime have different lifecycles and permissions. They can use common platform services while remaining separate execution environments. Second, durable work requires more than a saved conversation. If a deployment request times out after the release succeeds, the next worker must discover the actual state before retrying.

Authority also has to survive delegation. A child agent should receive scoped access, with permission checks enforced by the receiving systems. Generating a deployment manifest does not confer permission to deploy it.

“LLMOps” describes only part of this foundation. The platform must connect a brief to an engineering decision, an artefact, a release, and its production effect. Many of the produced systems will barely use a model, or use none at all.

An **agent factory** is a useful name for the mechanism that creates and coordinates agents. **Software factory** captures the wider capability and range of outputs.

## Production closes the loop

A factory's output becomes useful when people and systems can depend on it. Acceptance and operation therefore belong in the work from the beginning.

For supplier onboarding, validation should exercise duplicate submissions, late documents, partial writes, revoked access, and repeated callbacks. Deterministic checks can enforce approval boundaries and prevent duplicate transitions. Document interpretation needs separate evaluation against representative cases. The builder should not be able to quietly weaken either set of criteria.

Release policy should operate independently of the worker's assessment. A shadow run can observe real cases without changing records. A limited rollout can expose failures before wider deployment. Where authorisation is required, the factory prepares the change and its evidence, waits for the decision, and resumes afterwards.

![Independent checks, shadow runs, and limited rollouts provide evidence for release, revision, or recovery.](/images/blog/software-factories/production.svg)

Once live, the system must answer the original question: did onboarding improve? Completion time, exception rates, errors, and human workload matter. A shorter queue could mean faster processing or premature rejection. Metrics need interpretation against the intended outcome.

Recovery must account for state. Reverting an image cannot undo a migration or repair records already modified. Compatibility checks, staged migrations, and compensating actions remain engineering requirements even when code is cheap to regenerate.

This is also where benchmark results need care. [METR's time-horizon measurements](https://metr.org/time-horizons/) largely concern cleaner software engineering, machine learning, and cybersecurity tasks. They do not establish equivalent reliability in organisations with rich institutional context. Production capability needs evidence from production conditions.

## A factory can build its own tools

During a task, the factory may need a connector, replay harness, migration checker, or specialist agent that does not yet exist. It can build that capability and reuse it in later work. A good simulator can make an entire class of future changes easier to verify.

The accumulated asset includes knowledge: how identifiers correspond, which API behaviours are unreliable, why an approval exists, and which interventions failed. That knowledge needs sources, versioning, and expiry. Otherwise a successful workaround becomes a permanent assumption.

Self-extension needs a boundary between improving the machinery and changing the rules that judge it. Release policy, budgets, and acceptance criteria require separately controlled authority. New tools and agents need traceable permissions and a way to stop them.

The organisation can stay small. A focused task may need one capable agent. Larger work may benefit from specialised workers and independent evaluation. The right structure follows the dependencies and should evolve as models improve.

## What becomes worth building

Organisations have a long tail of problems that never become engineering projects. They are too specific for a vendor, too small for the roadmap, or too entangled with local processes. People bridge the gaps with spreadsheets, recurring messages, and memory.

Software factories could change the threshold at which these problems become worth solving. The relevant cost includes investigation, verification, deployment, maintenance, and human attention. Cheaper coding alone has limited effect when the surrounding work dominates. The opportunity grows as the factory can carry more of that work reliably.

Engineering judgment remains essential: choosing worthwhile problems, supplying context, shaping architecture, and deciding what evidence is sufficient. Greater implementation capacity increases the value of those decisions.

It also creates an obligation to manage what gets built. Every new system needs an owner, service expectations, and a path to consolidation or retirement. A useful factory should make an organisation simpler as well as more capable.

The shift is toward a continuing ability to turn broad intent into running systems. Sometimes the goal is clear. Sometimes only the friction is visible. A software factory can investigate both, discover what needs to exist, and carry the work through to production.
