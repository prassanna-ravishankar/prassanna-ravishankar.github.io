---
title: "Agent Status Codes"
subtitle: "Agents need a protocol, not more exceptions"
description: "HTTP tells you whether the carrier worked. Agent Status Codes describes whether the work did: progress, human approval, partial success, uncertainty, and whether retrying is safe."
pubDate: 2026-08-31
heroImage: "/images/blog/agent-status-codes/hero.webp"
series: ["AI Agents"]
topics: ["AI agents", "agent observability", "agent protocols", "distributed systems", "reliability engineering", "A2A", "MCP"]
author: "Prassanna Ravishankar"
draft: true
---

As agents become more capable, a surprisingly basic question keeps getting harder to answer: **what exactly happened?**

Not “did the API call return 200?” Not “did the workflow throw an exception?” But: did the agent finish the task? Is it waiting for me? Did it make partial progress? Did a guardrail stop it? Is it safe to try again?

Today, the answers are usually scattered across framework-specific state machines, tool errors, callback payloads, tracing spans, UI labels, and a growing collection of custom exceptions. Every agent runtime has its own vocabulary, and every application that integrates with one has to translate it before it can decide what to show a person or do next.

That feels like an interoperability problem hiding in plain sight.

HTTP status codes work because a client can understand the important outcome of a request without knowing how the server was implemented. A `301` tells it to redirect. A `401` tells it authentication is needed. A `429` tells it to back off. The shared vocabulary gives software a basis for action.

Agent systems do not yet have an equivalent common language. So I’ve been working on an experimental proposal called [Agent Status Codes](https://agentstatuscodes.org): a small, open protocol for reporting progress, outcomes, human input, failures, verification, and recovery between agents and the systems that use them.

The aim is not to replace HTTP, gRPC, A2A, MCP, OpenTelemetry, or your framework’s internal types. It is to give the work being done by an agent a portable semantic layer that can travel through any of them.

## A successful request is not necessarily a successful task

This distinction is the starting point.

An HTTP `200 OK` can mean an application successfully received an update from an agent. But the work described by that update may still be running, paused for approval, partly complete, or in an uncertain state after a side effect.

Imagine an agent that can search for flights and book one once a person approves the purchase.

The search succeeds. The user chooses an option. The agent creates the booking request. The request then times out.

What should the agent report?

`TIMEOUT` is true, but incomplete. It says a deadline passed. It does not say whether the booking service received the request, whether a seat was reserved, or whether a card was charged. Automatically retrying might create a duplicate booking.

What the application actually needs is something closer to:

> The result of a potentially side-effecting operation is unknown. Reconcile before retrying.

That is a different control-flow decision from a routine timeout. It is also exactly the kind of information that gets lost when an agent’s state is reduced to “success”, “error”, or a generic exception.

ASC represents this as `RESULT_STATE_UNKNOWN`. The name is intentionally unglamorous. Its job is to make uncertainty explicit, rather than quietly turning it into permission to replay work.

## Agent state is not one thing

Early on, it was tempting to imagine a single list of agent outcomes: `SUCCESS`, `FAILURE`, `WAITING_FOR_HUMAN`, `RATE_LIMITED`, and so on.

That was too flat.

A useful agent report needs to preserve several facts that are easy to collapse accidentally:

- **Lifecycle phase**: is the reported work queued, executing, waiting, finished, or unknown?
- **One primary status**: what is the best current summary of this particular scope?
- **Conditions**: what remains true alongside that summary?
- **Events**: what happened along the way, without becoming the final outcome?
- **A retry contract**: whether another attempt is allowed, safe, and useful.

These distinctions are not academic. They stop dangerous inferences.

A task may be `FINISHED` with `PARTIAL_SUCCESS`: a support agent successfully sent a confirmation email but lacked permission to issue a refund. Calling the task a generic failure would throw away the successful work. Calling it a success with a warning would understate the missing requested action.

A task may be `WAITING` with `HUMAN_APPROVAL_REQUIRED`. That is not a crash. It is normal, resumable control flow.

A task may finish successfully while recording `PROMPT_CACHE_MISS`, `FALLBACK_USED`, or `RETRY_ATTEMPTED` as events. Those facts are valuable for cost and reliability analysis, but they should not replace the outcome of the work.

And a parent task should not blindly inherit the status of one child tool call. A coding agent might have one failed repository operation, two successful ones, and a still-active parent task. The hierarchy matters.

## The code is a summary, not the whole payload

Agent Status Codes uses a four-digit code space, partly because it is compact and familiar, but the number is never intended to carry every detail on its own.

A minimal report might look like this:

```json
{
  "spec_version": "0.1.0",
  "status": {
    "code": 3002,
    "name": "HUMAN_APPROVAL_REQUIRED",
    "kind": "status",
    "scope": "task",
    "phase": "WAITING",
    "terminal": false
  },
  "occurred_at": "2026-08-08T12:00:00Z"
}
```

The code and name travel together. The scope tells us whether this is about an overall task, a step, a tool call, a model call, a handoff, an evaluation, or an artefact. Terminality applies to that scope, rather than pretending that a terminal tool-call failure necessarily ends the entire workflow.

The surrounding fields matter just as much as the code. They can include remediation for a human, side-effect certainty, an idempotency key, a suggested retry delay, provenance, or evidence from a verification step.

The point is not to make every agent payload huge. It is to establish which distinctions must survive an integration boundary when they matter.

## Human input should be a first-class outcome

One of the stranger habits in agent systems is treating every interruption as an error.

But agents frequently need people. They need missing information, authentication, confirmation before spending money, or a decision between valid options. These are not necessarily exceptional conditions. They are often the expected shape of a workflow.

That is why ASC distinguishes `HUMAN_INPUT_REQUIRED`, `HUMAN_APPROVAL_REQUIRED`, and `AUTHENTICATION_REQUIRED` from policy and operational failures.

Similarly, `PERMISSION_DENIED` is not the same thing as `GUARDRAIL_BLOCKED`.

The former means an authenticated principal is not authorised to perform an operation. The latter means a policy or safety control prohibited proposed content, context, or action. They may look similar in a UI, but they lead to different remediation paths, different audit trails, and different ownership.

If the protocol erases those differences, every downstream application has to rediscover them from strings and stack traces.

## A standard should be careful about what it does not claim

Agent Status Codes is not an attempt to create an exhaustive taxonomy of every model-provider error or business-domain result. That would be both impossible and unhelpful.

The draft instead tries to define a portable core: lifecycle and progress; successful and partial outcomes; interruptions and human dependencies; request, capability, authorisation, and policy decisions; transient and fatal failures; trust, quality, grounding, and verification; operational events; and a controlled extension space.

The core needs to be small enough to implement, but precise enough that a consumer can safely act on it without knowing the producer’s framework.

Unknown values should degrade safely. Framework-specific detail should remain available through structured extensions. And no one should need to give up their existing transport or observability stack to adopt the model.

## What I want to learn next

ASC 0.1 is explicitly experimental. There are no adoption claims hiding here, and it is much too early to pretend the registry is finished.

The useful next step is implementation evidence.

Where does the model feel natural in an agent runtime? Which codes are too broad? Which distinctions do real applications still need? Can the envelope travel cleanly through A2A, MCP tool results, HTTP Problem Details, gRPC metadata, and OpenTelemetry without becoming ceremony? What does a good SDK binding look like?

Most importantly: where does the retry model break down when a real workflow has stateful tools, long-running work, delegated child tasks, and uncertain external side effects?

The current draft, registry, examples, and RFC process are open at [agentstatuscodes.org](https://agentstatuscodes.org) and in the [GitHub repository](https://github.com/prassanna-ravishankar/agent-status-codes).

If you build agents, runtimes, tools, or the applications around them, I’d love to know which state distinctions you keep having to reconstruct. That is probably where the protocol should earn its place.
