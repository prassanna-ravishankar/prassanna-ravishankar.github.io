---
title: "FastHarness"
description: "Turn AI agents into production-ready A2A services with pluggable runtime backends"
pubDate: 2025-09-01
image: "/images/projects/fastharness.webp"
github: "https://github.com/prassanna-ravishankar/fastharness"
link: "https://pypi.org/project/fastharness/"
tags: ["python", "AI agents", "A2A", "Claude", "OpenHands", "Pydantic", "framework"]
topics: ["ai agent communication", "autonomous AI agents", "A2A Protocol"]
featured: true
draft: false
---

FastHarness exposes agents through Google's [A2A (Agent-to-Agent)](https://a2a-protocol.org) protocol. Define agents with decorators, pick a runtime backend, and FastHarness handles protocol compliance, message conversion, task lifecycle, and multi-turn conversations.

## Key Features

- **Pluggable Runtime Backends**: Swap between Claude Agent SDK, OpenHands, and Pydantic DeepAgents without changing agent definitions
- **Executor Protocols**: Decoupled `AgentRuntime` / `AgentRuntimeFactory` system separating agent logic from execution
- **A2A Streaming**: Server-sent events for real-time token streaming via `message/sendStream`
- **Multi-turn Conversations**: Runtime sessions maintain conversation history across A2A requests
- **Python Client**: `FastHarnessClient` with async send, streaming, and context management
- **CLI**: Command-line interface for running and interacting with agents
- **Zero-Config Protocol Bridge**: Decorator API handles all A2A protocol machinery, agent card generation, and JSON-RPC endpoints
- **Cost Tracking & Step Logging**: Built-in telemetry callbacks for monitoring API usage and debugging tool calls

## Quick Start

```python
from fastharness import FastHarness, Skill

harness = FastHarness(name="my-agent")

harness.agent(
    name="assistant",
    description="A helpful assistant",
    skills=[Skill(id="help", name="Help", description="Answer questions")],
    system_prompt="You are helpful.",
    tools=["Read", "Grep"],
)

app = harness.app  # Ready to deploy
```

```bash
# Install with your preferred backend
uv add fastharness                    # Claude (default)
uv add fastharness[openhands]         # OpenHands
uv add fastharness[deepagents]        # Pydantic DeepAgents
```
