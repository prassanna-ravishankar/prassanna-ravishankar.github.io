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

A difficult question sits at the boundary between an agent and the application around it: **what, precisely, happened?**

That question is easy enough while an agent is a single model call. It becomes less forgiving once the work is long-running, delegated, stateful, or able to affect the outside world. The agent may be working, paused for a person, partly complete, blocked by policy, rate-limited, or uncertain whether a tool call already changed something. The application needs to distinguish these cases because it needs to behave differently in each of them.

Most integrations do not give it a common way to do so. The meaning is distributed across framework states, callback payloads, tool errors, traces, exceptions, and UI labels. Each runtime has a vocabulary of its own, and each consumer reconstructs that vocabulary before it can decide what to render, retry, escalate, or stop.

HTTP solved an analogous problem for networked systems. A client does not need to understand the server behind a response to recognise that a `301` means redirect, a `401` means authenticate, or a `429` means wait. The status code is not the whole response, but it is enough shared meaning for the client to take the next appropriate action.

Agent systems need a layer like that. [Agent Status Codes](https://agentstatuscodes.org) is an experimental proposal for one: a portable, machine-readable vocabulary for reporting the progress, outcome, dependencies, and recovery semantics of autonomous work.

It is deliberately not a replacement for HTTP, gRPC, A2A, MCP, OpenTelemetry, or framework-native state. Those layers have their own jobs. ASC describes the state of the work being carried through them.

## Transport success is not task success

A transport can succeed while the task it carries is unfinished.

An HTTP `200 OK` might mean that an application received an agent update successfully. It does not mean the agent achieved the user’s goal. The task may still be executing, waiting for approval, partly complete, or in a state where the outcome of an external side effect cannot yet be known.

Consider an agent that can search for flights and, after approval, book one. The search succeeds. The user chooses an itinerary. The agent sends a booking request, then hits its deadline before receiving a response.

Calling that `TIMEOUT` is accurate, but insufficient. A timeout tells us that time elapsed. It does not tell us whether the provider received the request, reserved the seat, or charged the card. Retrying automatically may be the right thing to do; it may also create a duplicate booking.

The status that matters is not merely “the request timed out”. It is:

> The system cannot determine whether a potentially side-effecting operation committed. Reconcile before retrying.

ASC calls this `RESULT_STATE_UNKNOWN`. The name is intentionally plain. Its purpose is to preserve uncertainty at exactly the point where systems are otherwise tempted to turn it into permission to replay work.

That distinction is not a matter of richer diagnostics. It changes control flow. A consumer that sees `RATE_LIMITED` with an explicit safe-retry contract can wait and try again. A consumer that sees `RESULT_STATE_UNKNOWN` should reconcile the original operation first. The two may both follow an awkward tool call, but they demand opposite behaviour.

## A task does not have one state

It is tempting to respond by inventing a longer list of outcomes: `SUCCESS`, `FAILURE`, `WAITING_FOR_HUMAN`, `RATE_LIMITED`, and so on. That is useful up to a point, but it collapses several independent facts into a single label.

A useful report needs to say where the work is in its lifecycle, what best summarises the declared scope, which facts continue to hold alongside that summary, which things happened during execution, and whether another attempt is safe. These are related, but they are not interchangeable.

A support agent, for example, may send a confirmation email successfully but lack permission to issue a requested refund. The parent task is `PARTIAL_SUCCESS`. Calling it a generic failure discards completed work; calling it success with a warning makes the missing refund sound cosmetic. Its child tool calls retain their own outcomes, and the parent preserves the fact that the requested result was only partly achieved.

Likewise, a task waiting for an explicit purchase decision is not broken. `HUMAN_APPROVAL_REQUIRED` is expected, resumable control flow. A task that needs the user to sign in is in a different, but equally ordinary, state: `AUTHENTICATION_REQUIRED`.

And an agent can finish successfully while still recording a prompt-cache miss, a fallback route, or several retry attempts. Those are operational events. They matter for cost and reliability work, but they should not replace the final outcome of the task.

ASC separates these ideas into five constructs:

- **Phase** locates the reported scope in its lifecycle.
- **Primary status** gives the consumer one current summary on which it can act.
- **Conditions** retain facts that coexist with that summary.
- **Events** record occurrences without becoming the outcome.
- **Retry contract** states whether, when, and under what side-effect assumptions another attempt is allowed.

The separation keeps the model composable. A terminal tool-call failure need not terminate its parent task. One child outcome should not overwrite its siblings. And an event such as `FALLBACK_USED` does not have to be smuggled into a success or failure code just so that it survives the boundary.

## The number is only the handle

ASC uses four-digit codes because they are compact, familiar, and easy to pass through existing systems. But the number is a handle for shared meaning, not a container for every detail.

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

The code and name travel together. The scope establishes whether the report is about a task, step, tool call, model call, handoff, evaluation, or artefact. Terminality is explicit because it applies to that scope, not necessarily to an entire workflow.

The rest of the envelope can carry the information that should never be guessed: remediation for a person, a retry delay, idempotency context, side-effect certainty, provenance, or verification evidence. This is not an argument for verbose payloads everywhere. It is an argument for preserving the facts that make automation safe when they are needed.

## Similar-looking failures are often different decisions

A status protocol earns its keep at the boundaries people are inclined to blur.

`PERMISSION_DENIED` and `GUARDRAIL_BLOCKED` can both look like a refused action in an interface. They should still remain distinct. The first is an authorisation decision about a principal and resource; the second is a policy decision about proposed content, context, or action. Their remediation paths, owners, and audit implications are different.

The same is true of `SUCCESS_WITH_WARNINGS` and `PARTIAL_SUCCESS`, or of `HALLUCINATION_SUSPECTED` and `HALLUCINATION_DETECTED`. A protocol should not flatten those differences simply because a generic red or amber badge would be easier to render.

It should also be modest about what it standardises. ASC is not trying to turn every provider exception or business-domain result into a global code. The portable core is for semantics that need to survive an implementation boundary. Local detail remains local, carried through structured extensions rather than forced into an artificial universal taxonomy.

That leaves space for an agent using one framework to communicate useful state to a UI, orchestration system, evaluation service, or another agent built with a different one.

## An experimental protocol needs contact with reality

ASC 0.1 is intentionally experimental. It is not a claim that the registry is complete, a governance model is settled, or adoption has already happened. It is a proposal that needs implementation evidence.

The useful questions are practical. Which concepts map cleanly to real runtimes? Which codes prove too broad under production workloads? Where do side-effect-aware retries remain awkward? Can the same envelope travel through A2A, MCP tool results, HTTP Problem Details, gRPC details, and OpenTelemetry attributes without becoming ceremony?

The specification, registry, examples, and RFC process are open at [agentstatuscodes.org](https://agentstatuscodes.org) and in the [GitHub repository](https://github.com/prassanna-ravishankar/agent-status-codes).

The test is straightforward: can a consumer that has never seen the producer’s framework still determine what happened, what remains true, and what it may safely do next? If it can, autonomous systems have a little less translation work and a safer basis for coordination.
