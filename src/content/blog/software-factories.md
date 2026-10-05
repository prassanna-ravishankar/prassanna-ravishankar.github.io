---
title: "The Age of Software Factories"
subtitle: "Agents that discover the work, organise themselves, and build their way to production."
description: "Software factories can form teams, discover workflows, build missing capabilities, and adapt their approach as they turn complex problems into production systems."
pubDate: 2026-10-04
updatedDate: 2026-10-05
heroImage: "/images/blog/software-factories/hero.webp"
series: ["AI Agents", "Futures"]
topics: ["software factories", "autonomous agents", "agent infrastructure", "multi-agent systems", "adaptive workflows"]
author: "Prassanna Ravishankar"
draft: false
---

Give agents a complex problem, access to the relevant systems, and an outcome to pursue. They investigate, develop a solution, build it, verify it, and carry it into production. Sometimes they discover a requirement, a cause, or an opportunity that was missing from the brief.

That is the promise of a **software factory**: a system that turns broad intent into working software, with enough evidence to put the result to use. Its output might be an application, an integration, a data pipeline, a workflow, or another agent system.

The mechanism is just as interesting as the output. The factory can choose how to tackle the problem: form a team, discover a workflow, create a missing tool, and revise its organisation when the evidence changes. A general system develops a shape suited to the work in front of it.

Parts of this capability exist today in bounded settings. The larger ambition is to connect them into a reliable journey from a complex problem to a useful production system.

![A general system takes the shape of the problem.](/images/blog/software-factories/adaptive-structure.webp)

## The factory designs its way of working

A fixed pipeline encodes an approach in advance. An adaptive factory makes parts of that approach a design decision. How many workers are useful? What expertise is missing? Which tasks can proceed independently? Where should one result be challenged before another worker relies on it?

Answering those questions requires an evolving model of the problem: relevant systems, observed behaviour, constraints, dependencies, and unresolved assumptions. The factory uses that understanding to construct an initial organisation, then updates both the understanding and the organisation through execution.

![The factory forms an approach from the brief and evidence, executes it, and revises it using evaluation. Reusable capabilities inform future work.](/images/blog/software-factories/adaptive-loop.svg)

The factory needs an explicit way to revise its approach. Roles, tool access, communication paths, and workflow definitions become artefacts it can inspect and change. A revision should have a reason, a bounded scope, and a check that establishes whether it helped. Otherwise, adaptation becomes another source of uncertainty.

## Swarms, teams, and workflows

A factory needs several ways to organise work. A swarm can explore competing explanations in parallel. A team can divide responsibilities while coordinating around shared artefacts. A workflow can encode dependencies, conditions, retries, and checkpoints once the process is understood. These arrangements overlap: a workflow can invoke a team, and a team can launch parallel investigations.

![The same primitives support different arrangements: parallel exploration, coordinated specialists, and a workflow with an explicit check.](/images/blog/software-factories/work-patterns.svg)

For an unfamiliar incident, parallel investigators might examine deployment history, database behaviour, and upstream failures. Once the cause is established, a smaller team can implement and challenge the repair. Release then follows a structured workflow with acceptance checks and a limited rollout.

The structure should change for a reason. Repeated disagreement may call for better evidence rather than another agent. A blocked worker may need a connector. Excessive coordination may justify collapsing several roles into one. The factory needs to assess whether each change improves the result enough to justify its cost.

Shared state matters as much as communication. Workers need a place to record findings, provenance, decisions, dependencies, and completed actions. Messages move information; a maintained work record makes it possible to establish what the system currently believes and why.

## Discovery has three meanings

First, the factory can **discover the process that already exists**. An instruction such as “reduce supplier onboarding delays” leaves substantial uncertainty. Logs, code, records, policies, and conversations reveal how the work actually happens, including informal handoffs and exceptions. IBM's [work on process discovery](https://community.ibm.com/community/user/blogs/maja-vukovic/2026/09/10/process-discovery-for-agent-augmented-business-pro) describes building an evolving representation of that operational reality.

In a hypothetical onboarding process, investigation might find missing document links, legitimate approval waits, and inconsistent evidence. Each calls for a different response: an integration, a durable workflow, or an agent that interprets documents and routes exceptions. The factory may also conclude that an existing product or a configuration change is sufficient.

Second, it can **discover a better way to solve the task**. Workflow synthesis proposes and evaluates arrangements of operations. A candidate might retrieve records, reconcile identifiers, extract evidence, and route unresolved cases to a person. Testing should expose where the sequence fails, including partial writes, duplicate callbacks, and unavailable dependencies. A plausible plan becomes an executable design that can be challenged.

Third, it can **discover reusable routines from experience**. A sequence that successfully reconciles records or investigates a failure can become a candidate procedure for later work. The factory can retain the executable steps, the evidence that justified them, and the conditions under which they worked. Reuse still needs validation: a successful routine is a useful starting point, not a universal instruction.

These functions operate at different timescales. Discovery informs the initial approach, execution reveals gaps, and accumulated experience improves the next project. The useful learning can live in code, structured memory, and workflow definitions without requiring a change to model weights.

## Two architectures take shape

The organisation doing the engineering and the system being engineered are separate design problems. A temporary swarm may build a conventional service and finish. A factory may instead produce a persistent multi-agent system, or a workflow that combines ordinary code with model-based interpretation. The arrangement that helped discover the answer does not have to become the deployed product.

An **agent factory** names the mechanism that creates and coordinates agents. **Software factory** describes the wider capability, including outputs that contain no agents at all.

Two supporting layers make the work possible. The **factory layer** holds discovery, workflow and team design, construction, evaluation, and accumulated experience. The **software and agent platform** supplies execution, durability, access, delivery, and observation.

![The factory layer adapts its approach and constructs solutions. The platform supports both its engineering workers and the systems they produce.](/images/blog/software-factories/architecture.svg)

[View the architecture at full size](/images/blog/software-factories/architecture.svg).

Managed sandboxes let workers inspect repositories, run experiments, and test changes. Production runtimes serve users and preserve application state. Both use platform services, with separate permissions and lifecycles. Durable execution keeps long tasks coherent across failures, session boundaries, and waits for external decisions.

The work record must distinguish an intention from a completed action. If a deployment request times out after the release succeeds, the next worker needs to discover that state before retrying. Identity and authorisation must also survive delegation: creating another worker should not expand the authority granted to the task.

Observability connects the brief, design decisions, changed artefacts, release, and production effect. Model traces and token costs are part of that account. Repositories, data contracts, tests, and operational telemetry supply the rest.

## The platform is already taking shape

Vercel, Cloudflare, and the major clouds are building many of these foundations. Their products increasingly cover both the environment where agents do engineering and the environment where the resulting systems run. Reading this convergence as infrastructure for software factories is an interpretation of that direction, rather than a claim that every provider already offers the complete factory.

Vercel makes the construction loop concrete. Its [durable coding-agent guide](https://vercel.com/kb/guide/how-to-build-a-durable-ai-code-agent-on-vercel) combines Workflow, Sandbox, and AI Gateway: generate code and tests, execute them in an isolated environment, and feed failures into another attempt. Workflow preserves progress and handles retries; Sandbox provides execution; Gateway routes and observes model calls. This is a small example of a worker acting on evidence, though its generated tests still need independent acceptance criteria for a real project.

Cloudflare's [Agents platform](https://developers.cloudflare.com/agents/) draws a useful distinction between the **harness**, which controls the model and tool loop, and the **runtime**, which holds identity, state, scheduling, and recovery. Browser access, sandboxed execution, and MCP tools supply capabilities around that loop. Its Code Mode lets models write code to discover and orchestrate tools. The platform supports both the decisions an agent makes and the durable machinery needed to carry them out.

The major clouds bring this pattern into enterprise environments. [Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) supplies runtime, memory, identity, tool gateways, and evaluation. [Google's ADK](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk) supports structured workflows and dynamic delegation among specialist agents, with deployment options including a managed runtime. On Azure, [Microsoft Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) combines managed execution with shared tools, identity, tracing, evaluation, and publishing.

Some offerings reach into improvement as well. AgentCore describes trace-based configuration recommendations and controlled experiments; Microsoft's agent optimizer, currently in preview, generates changes to instructions, skills, tool descriptions, and model selection. These are narrower forms of adaptation than a factory redesigning its organisation around an unfamiliar problem. They nevertheless make evaluation and revision part of the platform, alongside execution.

The remaining factory work is to connect these capabilities to an outcome: understand the business problem, choose an organisation, build missing capabilities, establish acceptance, and learn from production. A durable runtime can preserve a task for days. The factory still has to decide what those days should accomplish.

## Production is part of the reasoning

A factory's claim of completion needs evidence independent of the workers that built the result. [StrongDM's software factory](https://factory.strongdm.ai/) describes using scenarios outside the codebase and behavioural replicas of external services to exercise interactions and failure cases. The principle matters: acceptance should not become whatever the implementation happens to pass.

For onboarding, deterministic checks can enforce approval boundaries and prevent duplicate transitions. Document interpretation needs evaluation against representative cases. A shadow run can compare decisions with real operations before permitting writes. A limited rollout then produces evidence under production conditions.

![Independent checks, shadow runs, and limited rollouts connect construction to production evidence and recovery.](/images/blog/software-factories/production.svg)

The original outcome remains the measure of success. Did completion times improve? Did errors increase? Was work simply shifted onto people? A shorter queue can mean faster processing or premature rejection. The factory has to interpret the effect and revise the system accordingly.

Recovery must account for history. Reverting a service image cannot undo a migration or repair records already modified. Compatibility checks and compensating actions remain necessary, however cheaply the code was produced.

Adaptation also needs limits. The factory can improve a test harness without gaining permission to weaken acceptance criteria. Budgets, access policy, release rules, and stopping conditions need separately controlled enforcement. Human decisions can remain explicit checkpoints while the surrounding engineering proceeds autonomously.

## What the factory keeps

Each project can leave behind more than its delivered system: a connector, a replay environment, a migration checker, a useful team structure, or a workflow that handles a class of tasks. A missing capability built for one problem becomes a starting point for the next.

![Reusable capabilities become the foundation for different future solutions.](/images/blog/software-factories/capability-foundation.webp)

That accumulation only helps if it remains trustworthy. Reusable procedures need provenance, validation, versioning, and a way to expire. Operational knowledge changes; a workaround that once helped can later encode the wrong assumption. Learning should preserve the conditions under which something worked.

The economics depend on how much of the whole journey becomes repeatable. Investigation, verification, deployment, maintenance, and human attention often cost more than typing the code. A factory that carries those stages can make previously neglected problems worth addressing, while still choosing to buy, simplify, or build less.

Engineering judgment remains central to choosing outcomes, supplying context, and deciding what evidence is sufficient. Every delivered system also needs an owner and a path to retirement. Greater construction capacity should lead to useful capability, not an ever-growing inventory of systems nobody understands.

The defining possibility is a system that can develop its own approach to a complex problem, discover what needs to exist, and carry the solution into production. As it works, it improves both the thing being built and its ability to build the next thing.
