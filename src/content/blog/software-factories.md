---
title: "The Age of Software Factories"
subtitle: "Give agents a problem. Let them build their way to production."
description: "Agents can investigate, build, verify, and deploy complex systems. What happens when we organise that capability into a software factory?"
pubDate: 2026-10-04
heroImage: "/images/blog/software-factories/hero.webp"
series: ["AI Agents", "Futures"]
topics: ["software factories", "autonomous agents", "agent infrastructure", "multi-agent coding", "Repowire"]
author: "Prassanna Ravishankar"
draft: false
---

On a flight from London to San Francisco, I pointed an orchestrator at seven of my repositories and gave it a broad brief: explore, find problems, improve things, and ship. Each repository had its own coding agent. They could ask one another questions, share context, and keep working while I intervened occasionally from the plane and, later, the hotel.

By the next morning, they had produced more than 130 commits. I wrote about that session in [Overnight Agents](/blog/overnight-agents/), but the part I keep returning to is a smaller moment inside it. One peer said it had validated three agent runtime backends. The orchestrator asked how. The answer was mocked API responses. It sent the peer back to test against real APIs, where it found four bugs.

That exchange captures something I find more interesting than the volume of code. There was a piece of engineering judgment inside the system: a claim was challenged, the evidence was found wanting, and the work changed course. Other peers discovered problems I had never put in a ticket, including a logging configuration that was costing nine times what it should.

The session still needed my direction. It was one experiment across projects I understood, and I would not extrapolate it into a claim that arbitrary engineering can run unattended. But it changed the scale of the question for me. How much of the journey from a problem to a working system can we now entrust to agents?

We can already connect agents that investigate, design, implement, test, and deploy. In bounded settings, they can carry substantial work across that entire path. They can also discover missing requirements, identify an unexpected cause, or build a tool they need along the way. The ambition is to make that capability repeatable enough that we can point it at complex problems and expect sustained progress toward production.

I think of that capability as a **software factory**: a system of agents and supporting infrastructure that turns intent into working software, with enough evidence and control to put the result to use.

Its products might be applications, integrations, data pipelines, infrastructure changes, or more agents. The choice emerges from the work.

![The factory carries intent through investigation, construction, verification, and production. Evidence can send the work back to an earlier decision.](/images/blog/software-factories/factory-loop.svg)

## We have pieces of the factory already

[StrongDM's software factory](https://factory.strongdm.ai/) is a concrete example. The team describes agents building from specifications and scenarios without human code review. Its validation environment includes behavioural replicas of services such as Okta, Jira, and Slack, so it can exercise interactions and failure cases away from live systems. Scenarios held outside the codebase help separate the definition of success from the implementation being assessed.

[Cursor's experiments with long-running coding agents](https://cursor.com/blog/scaling-agents) expose another part of the machinery. Equal-status agents coordinating through shared state ran into contention and work that churned without enough progress. Separating planning, execution, and judging helped sustain larger projects. The researchers also found that additional coordination roles could introduce bottlenecks. There is no universal organisation chart for productive agents.

[Anthropic's application-development harness](https://www.anthropic.com/engineering/harness-design-long-running-apps) goes further into product construction. A planner expands a short brief, a generator builds, and an evaluator interacts with the running application. Later iterations also built agents that could operate the generated applications through tools. Evaluators required tuning and still missed bugs; some scaffolding became unnecessary as the underlying model improved.

A [September 2026 paper from Microsoft researchers](https://arxiv.org/abs/2609.36323) connects targeting, coding, reviewing, and operations into a wider factory. It grounds decisions in system structure, telemetry, business context, and past engineering work. The demonstrated scope is narrower than a general enterprise factory: evolving existing data systems against measurable objectives. The authors explicitly leave general target selection, correctness verification, and parts of review as open problems.

These accounts describe progress under particular conditions. They establish useful mechanisms, rather than a guarantee that every brief can be completed autonomously. My interpretation is that the components for a factory are becoming available, and the engineering challenge is increasingly about connecting them into a process that continues to work as the task grows.

The hardest tasks have uncertainty in several places at once: what the problem is, what solution would help, whether the implementation works, and whether it survives contact with production. A factory has to carry that uncertainty through the process without silently turning guesses into facts.

## A brief that leaves room for discovery

Imagine giving a factory access to the relevant systems and asking it to improve supplier onboarding. This is a hypothetical example, but it is the kind of enterprise problem that makes the idea tangible. New suppliers take too long to become usable. Procurement has forms, finance has records, legal has exceptions, and someone maintains a spreadsheet that everybody privately relies on.

The brief might include a budget, a target reduction in onboarding time, rules about sensitive documents, and an explicit prohibition on changing bank details or approving suppliers. That defines an outcome and authority. It still leaves considerable work to discover.

An investigating agent compares the documented process with actual cases. It reads the existing integration code, samples permitted records, follows timestamps through the approval chain, and asks people about discrepancies. It finds that a status labelled "waiting for legal" sometimes means a document was uploaded but never linked to the supplier record. In other cases, the delay is a legitimate review that software should preserve.

Those findings change the proposed solution. A dashboard alone would have made the queue easier to see while leaving the underlying failure intact. The factory now has reasons to build an integration that reconciles document records, a workflow that advances complete applications, and an interface where a person can resolve exceptions. It may also build a specialist agent to interpret inconsistent documents and surface missing information.

The specialist operates inside a conventional system. Durable workflows manage handoffs and waiting. Typed APIs constrain actions. A database preserves records and provenance. The model handles the parts where interpretation is useful, while ordinary code enforces rules that need predictable behaviour. The factory can produce this mixture because it is free to choose the implementation as its understanding develops.

Discovery also happens during construction. A worker notices that two systems use different supplier identifiers. Another discovers that the API occasionally acknowledges a write before the new record is visible. Those observations need to reach whoever owns the design, where they can change the data model, retry strategy, or acceptance criteria. A worker that merely patches around them can leave the larger system incoherent.

![Investigation changes the design: a missing document link needs an integration, an approval delay needs a durable workflow, and ambiguous evidence may need a specialist agent.](/images/blog/software-factories/discovery.svg)

The factory may conclude that an existing product or a small configuration change is sufficient. It should have an incentive to reach that conclusion. A factory measured by commits, agent count, or generated services will tend to manufacture more of them. The objective should reward a useful capability and the evidence behind it, including a decision to build less.

Supplier onboarding is one example, not the boundary of the idea. A factory could build a new product, migrate a legacy system, optimise an expensive service, or investigate recurring incidents. In each case, part of its work is discovering what deserves to be built. The initial request can be a starting hypothesis.

## The factory needs somewhere to stand

There are two layers underneath this story. The **factory layer** organises engineering work: interpreting briefs, gathering evidence, maintaining plans, assigning tasks, resolving dependencies, and assessing results. The **software and agent platform** supplies the capabilities through which that work becomes executable and observable.

This separation helps explain how a factory could plug into an organisation. Much of the platform already exists in familiar forms: repositories, build systems, deployment pipelines, workload identity, databases, secrets management, and monitoring. Agent execution adds requirements around model access, context, tool permissions, managed sandboxes, and the persistence of work across sessions.

![Two layers support the journey. Factory agents organise the work, while a shared platform supplies execution, access, delivery, and evidence. The resulting systems run on that platform too.](/images/blog/software-factories/architecture.svg)

[View the architecture diagram at full size](/images/blog/software-factories/architecture.svg).

Managed sandboxes give construction workers somewhere to clone code, install dependencies, run tests, and experiment. They need isolation, resource limits, controlled network access, and a way to preserve useful artefacts. The production runtime has a different lifecycle: it serves users, carries service expectations, and must handle persistent state, incidents, and upgrades. The factory's workers and its products can share platform services without sharing credentials or execution environments.

Durable execution keeps a long task coherent when a worker fails, a model session ends, or an approval takes two days. Persisting a chat transcript alone does not establish which external actions completed. A factory needs explicit work state: the task, its dependencies, the artefact produced, the validation performed, and the outcome of any consequential action. If deployment times out after the release succeeds, the next worker must establish that fact before trying again.

Identity and authorisation make delegation concrete. A worker investigating a payment service should receive the access needed for that investigation. Creating a child agent should not multiply its authority. Credentials should be scoped and short-lived, with permission checks enforced by the systems receiving the action. The ability to generate a deployment manifest does not automatically grant the ability to deploy it.

Model gateways, traces, evaluations, and cost tracking are part of this foundation, but I would use a broader label than LLMOps. Much of the factory's work happens outside a model call, and much of its output can run without a model at all. For an incident investigation, we need to connect the brief, the engineering decision, the changed artefact, the release, and the production effect. Token counts are useful; they cannot supply that account by themselves.

The platform serves two populations: the agents building systems and the systems they build. Operational evidence flows back from the second to the first. An error trace can prompt a repair. An unexpected pattern in usage can challenge the original design. A successful intervention can become a reusable technique. This is the connection I explored in [Agentic Cloud](/blog/agentic-cloud/), extended here across the lifecycle of construction.

The two layers are a reference architecture, rather than a requirement for two separate products. An organisation might assemble them from existing infrastructure, buy a managed factory, or combine both. What matters is that the boundaries and interfaces are clear enough for work to cross them safely.

## Production has to mean something

Deployment belongs inside the factory's remit if the factory is meant to deliver working systems. That makes acceptance criteria and operational controls part of the engineering task from the beginning.

For the onboarding example, a test harness could replay representative cases: duplicate submissions, late documents, revoked access, partial writes, and callbacks delivered twice. Some checks are deterministic, such as preserving an approval boundary or preventing duplicate workflow transitions. Others require evaluating interpretation, such as whether the document agent identified the right missing evidence. Both need defined criteria and test cases the builder cannot casually rewrite to suit its implementation.

The deployment pipeline should verify artefacts and enforce release policy independently of the worker's claims. It might begin with a shadow run that observes real cases without changing records, then permit a limited rollout after comparing its decisions with the existing process. Where an action requires human authorisation, the factory can prepare the release and its evidence, wait for that decision, and continue afterwards.

Autonomy can cover substantial engineering work while consequential decisions remain assigned to people. The useful measure is how much of the journey can proceed reliably within an agreed scope, including how well the system handles the moments when it must stop.

![A path to production separates building from acceptance: independent checks, a shadow run, and a limited rollout produce evidence for continuing, revising, or recovering.](/images/blog/software-factories/production.svg)

Once the system is live, the factory has another question to answer: did onboarding improve? It needs to examine completion times, exception rates, workload shifted onto people, and errors introduced by the new process. A faster median might hide a worse experience for suppliers with unusual documents. A lower queue length might simply mean applications are being rejected sooner. Operational metrics require interpretation too.

Recovery also has to follow the shape of the change. Reverting a service image will not undo a migration, erase a message, or repair records already modified. The factory should produce migration plans, compatibility checks, and compensating actions where appropriate. Regeneration can reduce implementation effort; a running system still carries history.

This is why I would qualify one idea from [Architects of Intent](/blog/death-of-code/). Code can become easier to regenerate while the cost of changing a deployed system remains substantial. The durable assets include data, contracts, behavioural expectations, and evidence about what happens under real workloads. A factory has to understand those assets well enough to evolve them.

[METR's time-horizon measurements](https://metr.org/time-horizons/) are a useful caution here. Its tasks are largely in software engineering, machine learning, and cybersecurity, and are cleaner than ordinary work. The researchers explicitly warn against reading those results as equivalent to the work of a professional carrying rich institutional context. A long successful coding run is evidence about that run. Reliability across messy organisations remains a larger claim to establish.

## When the factory builds its own tools

There is a recursive quality to this arrangement that I find compelling. A factory can encounter a missing capability and build it: a connector for an internal service, a replay harness, a migration checker, or a specialist agent for an unfamiliar subsystem. That capability can then participate in later work.

I saw a small version of this when [Repowire](/blog/repowire/) was being improved by a peer communicating through Repowire itself. The same principle could apply to a factory's investigation tools, evaluation environments, or operational interfaces. Building a good simulator once may make an entire class of future changes easier to validate.

The useful accumulation is partly software and partly knowledge: which identifiers correspond, which API behaviours are unreliable, why an approval exists, and which attempted interventions failed. This knowledge needs sources, versioning, and a way to expire. Otherwise yesterday's successful workaround becomes tomorrow's confident mistake.

Self-extension also needs boundaries. A factory improving its test tools is different from a factory weakening the release policy that judges its work. Permission policy, budgets, and independent acceptance criteria should remain under separately controlled authority. [Common Obligations](/blog/common-obligations/) argues for traceable responsibility and bounded autonomy; a system that manufactures other systems makes those requirements particularly concrete. We should be able to identify who authorised a new capability, what it can affect, and how to stop it.

Nor does every problem need a swarm. More workers create more coordination, duplicated investigation, and reconciliation. A capable single agent may handle a focused task with less overhead. The factory's organisation should follow the work, changing as models and tools improve, rather than treating a particular collection of agent roles as permanent architecture.

## What becomes worth building

Most organisations have a long tail of problems that never become engineering projects. They are too small to compete with the roadmap, too specific for a vendor, or too entangled with local practice to fit neatly into a product. People bridge the gaps with spreadsheets, recurring messages, and things they remember to do on Fridays.

A factory could change the threshold at which those problems become worth addressing. Its economics would include investigation, construction, verification, deployment, ongoing operation, and the human attention it consumes. Lowering only the coding cost helps less when the other costs dominate. The opportunity grows as the factory can carry more of that surrounding work itself.

That does not imply every organisation should build everything. A maintained product can still be a better choice, particularly where shared infrastructure, support, and established integrations matter. Factories could make that product easier to adopt, connect it to unusual internal systems, or fill the gaps around it. Buying and building become decisions the factory can help investigate.

I expect the human role to move toward choosing worthwhile problems, supplying context, shaping architecture, and deciding what evidence is sufficient. Those decisions demand technical understanding. Someone still needs to recognise when a proposed fix moves the problem elsewhere, when a metric is misleading, or when a migration cannot be reversed. As the capacity to implement grows, judgment has more work to direct.

There is also a quieter consequence: every new system adds something to operate. A factory needs an inventory of its products, named owners, service expectations, and a process for consolidation and retirement. It should be capable of noticing that three tools now serve one need, and of making the organisation simpler as well as more capable.

The prospect that interests me is an organisation with a continuing capacity to turn broad intent into useful, running systems. Sometimes it knows what it wants. Sometimes it knows only where the friction is. The factory investigates, builds, checks, and carries the work forward, asking for judgment where its authority or evidence runs out.

My overnight session was a glimpse of that possibility. The broader version needs stronger verification, better institutional context, and platforms that support the whole journey. But the invitation is already practical: choose a substantial problem, give the agents the tools and boundaries to work on it, and see how far they can carry it toward production.

We may discover that some of the software we wanted was never worth building. We may also discover that some of the problems we had learned to live with were finally within reach.
