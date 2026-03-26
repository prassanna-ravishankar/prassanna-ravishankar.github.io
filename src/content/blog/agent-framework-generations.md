---
title: "Four Generations of Agent Frameworks"
description: "Agent frameworks evolved from raw API loops to autonomous coding agents in four generations. Each generation changed what you write, what the framework handles, and what a 'session' even means."
pubDate: 2026-03-26
heroImage: "/images/blog/agent-framework-generations/hero.webp"
series: ["AI Agents"]
topics: ["LangChain", "OpenAI Agents SDK", "Pydantic AI", "Claude Agent SDK", "ai agent frameworks", "autonomous AI agents", "how to build ai agents"]
author: "Prassanna Ravishankar"
draft: true
---

<!-- IMAGE: hero.webp (1200x630, 16:9 aspect ratio)
PROMPT: Abstract editorial illustration showing an evolutionary progression from left to right. Four vertical zones, each sharper and more defined than the last. The leftmost zone is a blurry, pixelated cluster of rough geometric shapes in slate (#475569) at low opacity, barely distinguishable from each other (low resolution, concepts not yet formed). The second zone is denser, tangled interconnected shapes in burnt orange (#D98034), more visible but over-complicated and knotted. The third zone has clean, organized teal (#2FA898) crystalline structures with clear edges, transparent and orderly. The rightmost zone is high-definition: luminous distinct forms in neon cyan (#00FFFF) and white, each shape crisp and separated, connected by thin precise lines forming a clear network. Two parallel streams run through all four zones: one stream (teal, representing frameworks) and one stream (gold #D98034, representing concepts), starting tangled together on the left and becoming distinct but intertwined helices on the right. Background: void black (#0f0f12). Digital stipple grain at 14% density. No text, no human figures. Vector art.
-->

I have been building agents for most of the past year. Not chatbots, not RAG pipelines, but agents that run for hours, call tools, recover from errors, and ship actual work. Over that time I have used raw API calls, LangChain, Pydantic AI, the Claude Agent SDK, and my own [FastHarness](https://github.com/prassanna-ravishankar/fastharness) framework. Each one taught me something about what matters and what doesn't.

What I have come to believe is that agent frameworks have evolved through four distinct generations, and with each generation, an entire ecosystem of concepts came into sharper definition. Tools, memory, sessions, contracts, observability, safety. These concepts existed in some form from the beginning, but they started as indistinguishable hacks and gradually resolved into distinct, protocol-level primitives. The frameworks and the concepts co-evolved, each driving the other, and together they define what we mean by "agent ecosystem."

The best way to see this is through code.

## Generation 1: The raw loop

Before frameworks existed, building an agent meant writing a while loop. You maintained a messages array, called the API, checked if the response contained tool calls, executed them yourself, appended the results, and looped until the model stopped asking for tools.

```python
import openai
import json

messages = [{"role": "system", "content": "You are a helpful assistant."}]
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"]
        }
    }
}]

messages.append({"role": "user", "content": "What's the weather in London?"})

while True:
    response = openai.chat.completions.create(
        model="gpt-4", messages=messages, tools=tools
    )
    msg = response.choices[0].message
    messages.append(msg)

    if msg.tool_calls:
        for call in msg.tool_calls:
            result = execute_tool(call.function.name, json.loads(call.function.arguments))
            messages.append({
                "role": "tool",
                "content": json.dumps(result),
                "tool_call_id": call.id
            })
    else:
        print(msg.content)
        break
```

Every concept that would later become a distinct primitive existed here, but none of them had definition. Tools were JSON schemas you hand-wrote and dispatched with if/elif chains. A "session" was a Python list called `messages` that you appended to, truncated when it got too long, and lost when the process died. Memory was whatever you serialized to disk yourself. Observability was `print()`. Safety was a system prompt saying "don't do bad things." Cost tracking was checking your OpenAI dashboard the next morning.

This worked. Millions of agents shipped this way. But every team was solving the same problems: the tool dispatch, the retry logic, the context window overflow, the conversation persistence. The concepts were there, they were just blurry. You could not point to where "tool use" ended and "session management" began because they were all tangled in the same while loop.

## Generation 2: Abstractions on abstractions

LangChain launched in October 2022, written by Harrison Chase [in nine days](https://blog.langchain.com/three-years-langchain/). It introduced the abstractions that would define a generation: Chains, Agents, Tools, and Memory. Within months it had raised $20M from Sequoia and had 99,000 GitHub stars. Microsoft's AutoGen (October 2023) brought multi-agent conversation. CrewAI (January 2024) added role-based coordination with agents that had "backstories."

```python
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langchain.memory import ConversationBufferMemory

@tool
def search(query: str) -> str:
    """Search the web for information."""
    return web_search(query)

llm = ChatOpenAI(model="gpt-4")
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
agent = create_openai_tools_agent(llm, [search], prompt)
executor = AgentExecutor(agent=agent, tools=[search], memory=memory)

result = executor.invoke({"input": "What's the weather in London?"})
```

Gen 2 was the first attempt to give these concepts distinct identities. Tools became `@tool` decorators. Memory became `ConversationBufferMemory` and `ConversationSummaryMemory`. Observability became LangSmith. Safety got its first formal treatment when NVIDIA released [NeMo Guardrails](https://developer.nvidia.com/nemo-guardrails) in April 2023, introducing a custom DSL (Colang) for controlling LLM outputs.

The problem was that frameworks gave each concept a name but wrapped it in so many layers that the name was all you could see. Max Woolf wrote in July 2023 that LangChain was ["one of the few pieces of software that increases overhead in most of its popular use cases."](https://minimaxir.com/2023/07/langchain-problem/) Octomind used LangChain in production for over twelve months before [ripping it out entirely](https://octoclaw.ai/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents), describing it as "abstractions on top of other abstractions." LCEL (LangChain Expression Language) added yet another DSL on top of Python, which meant you were no longer debugging Python but debugging a framework-specific pipe syntax.

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent("assistant", llm_config={"model": "gpt-4"})
user_proxy = UserProxyAgent(
    "user_proxy", code_execution_config={"work_dir": "coding"}
)
user_proxy.initiate_chat(assistant, message="Plot NVDA stock price YTD")
```

AutoGen's insight (agents as conversation partners, not chain links) was genuine. But [the project fractured](https://microsoft.github.io/autogen/0.2/blog/2024/11/14/confusion-created-by-forks/) in November 2024 when the original creators left Microsoft and forked it as AG2, leaving four competing forks and no clear path forward.

<!-- IMAGE: gen2-tangle.webp (1200x630, 16:9 aspect ratio)
PROMPT: Abstract editorial illustration of concepts becoming visible but tangled. Six small geometric shapes (cube, sphere, tetrahedron, octahedron, cylinder, torus) representing different concepts (tools, memory, sessions, observability, safety, contracts), each a different color (teal #2FA898, cyan #00FFFF, gold #D98034, brick red #B54725, slate #475569, electric blue #0066FF). All six shapes are wrapped together in overlapping translucent burnt orange (#D98034 at 40% opacity) layers, partially visible but impossible to extract individually. Thin lines from outside attempt to reach specific shapes but get tangled in the wrapping. To the left, the same six shapes in their Gen 1 form: barely visible, almost the same color as the background, undifferentiated. The composition shows: concepts are now named and colored, but trapped in framework layers. Background: void black (#0f0f12). Digital stipple grain at 16% density. No text, no human figures. Vector art, isometric perspective.
-->

![Concepts becoming visible but tangled in framework layers](/images/blog/agent-framework-generations/gen2-tangle.webp)

The fundamental tension was that Gen 2 frameworks tried to own every concept. LangChain's `Tool` was not Python's function. LangChain's `Memory` was not a database. LangChain's `AgentExecutor` was not your code. Each concept was visible (you could point to "that's the memory, that's the tool") but not portable. If you left the framework, you left its concepts too. The ecosystem was forming, but it was captive to individual frameworks.

## Generation 3: Back to Python

The backlash produced frameworks that stripped back to language-native patterns. Two projects defined this shift: OpenAI's Agents SDK (March 2025, evolved from their experimental Swarm) and Pydantic AI (December 2024, from Samuel Colvin, creator of Pydantic).

```python
from agents import Agent, Runner

agent = Agent(
    name="Assistant",
    instructions="You are a helpful assistant.",
    tools=[get_weather]
)

result = Runner.run_sync(agent, "What's the weather in London?")
print(result.final_output)
```

The OpenAI Agents SDK has four concepts: Agent, Runner, Handoff, Guardrails. That is the entire framework. Tools are plain Python functions whose schemas are auto-generated from type hints. Multi-agent coordination uses Handoffs, which are just agents referencing other agents. Guardrails are input and output validators, giving safety a formal three-layer architecture (input, tool, output) rather than a system prompt and a prayer.

```python
triage = Agent(
    name="Triage",
    instructions="Route to the right specialist.",
    handoffs=[billing_agent, technical_agent]
)
billing_agent = Agent(name="Billing", instructions="Handle billing questions.")
technical_agent = Agent(name="Technical", instructions="Handle technical issues.")
```

Pydantic AI took a complementary approach, focusing on type safety. Tools are decorated functions with type hints that automatically become validated schemas. Outputs are Pydantic models validated at runtime, even during streaming.

```python
from pydantic_ai import Agent
from pydantic import BaseModel

class WeatherReport(BaseModel):
    city: str
    temperature: float
    condition: str

agent = Agent("openai:gpt-4o", output_type=WeatherReport)

@agent.tool_plain
def get_weather(city: str) -> dict:
    """Get current weather for a city."""
    return fetch_weather_api(city)

result = agent.run_sync("What's the weather in London?")
print(result.data)  # WeatherReport(city='London', temperature=15.0, condition='Cloudy')
```

Gen 3 was where concepts gained real definition. Context stopped being a growing list or a framework Memory class and became a typed, validated, first-class citizen. Pydantic AI introduced dependency injection: structured context (database connections, user state, configuration) passed into agent runs through the type system, not through global state or framework wrappers.

```python
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class UserContext:
    user_id: str
    preferences: dict

agent = Agent("openai:gpt-4o", deps_type=UserContext)

@agent.tool
def get_history(ctx: RunContext[UserContext]) -> str:
    """Get user's conversation history."""
    return db.get_history(ctx.deps.user_id)
```

Observability matured in parallel. LangSmith existed but was proprietary and framework-tied. Pydantic Logfire launched as [OpenTelemetry-native](https://logfire.pydantic.dev/docs/ai-observability/), meaning agent traces were standard OTel spans, not framework-specific artifacts. By early 2026, the [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/blog/2025/ai-agent-observability/) (v1.37) defined standard attributes for tasks, actions, agents, and memory. Observability was becoming a protocol, not a product.

Evaluation also found its footing. SWE-bench became the standard for coding agents, and the community began distinguishing between outcome evaluation (did the agent get the right answer?) and trajectory evaluation (did the agent take reasonable steps?). That distinction matters because an agent that gets the right answer by making 47 unnecessary API calls is broken, even if the final output is correct.

Gen 3 restored developer control. You could read the framework's source in an afternoon. Debugging meant debugging Python, not framework internals. But you still wrote the agent loop. You still dispatched tool calls. The framework handled the edges; the core loop was still yours.

## Generation 4: The agent gets a computer

The shift from Gen 3 to Gen 4 is not incremental. It is a category change. In every previous generation, your code orchestrates the agent. In Gen 4, the agent orchestrates itself.

[OpenHands](https://github.com/All-Hands-AI/OpenHands) (formerly OpenDevin) was one of the first to make this concrete. It gives agents a sandboxed computer: terminal, file system, browser. The [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk) crystallized the pattern, exposing the same runtime that powers Claude Code. You do not write the loop. You do not dispatch tool calls. You describe the task and the model executes it.

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Find and fix the bug causing test_utils.py to fail.",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Bash", "Glob", "Grep"],
        permission_mode="acceptEdits",
    ),
):
    if hasattr(message, "content"):
        for block in message.content:
            if hasattr(block, "text"):
                print(block.text)
```

Compare this to the Gen 1 while loop. The messages array is gone. The tool dispatch is gone. The "check if the model wants to call a tool" conditional is gone. Your code is a consumer of the agent's work, not the orchestrator of it.

This is the generation where concepts graduated from framework features to standalone protocols and infrastructure.

**Tools became MCP.** Anthropic announced the [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) in November 2024, and by early 2026 it had reached [97 million monthly SDK downloads](https://mcpmanager.ai/blog/mcp-adoption-statistics/) with over 10,000 servers. MCP solved the M*N problem: connecting M models to N tools previously required M*N custom integrations. MCP reduced it to M+N. Tools are no longer a framework concept. They are a protocol that any agent, built with any framework, can consume. In December 2025, Anthropic [donated MCP to the Linux Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), co-founding the Agentic AI Foundation with OpenAI and Block.

**Contracts became A2A.** Google's [Agent-to-Agent protocol](https://a2a-protocol.org) (April 2025, [donated to the Linux Foundation](https://developers.googleblog.com/en/google-cloud-donates-a2a-to-linux-foundation/) in June 2025) formalized how agents discover and communicate with each other. Agent cards at `/.well-known/agent-card.json` describe identity, capabilities, and auth requirements. Tasks have lifecycles (submitted, working, completed, failed). MCP handles agent-to-tool contracts; A2A handles agent-to-agent contracts.

**Memory became infrastructure.** [Mem0](https://github.com/mem0ai/mem0) (launched January 2024, [$24M raised](https://techcrunch.com/2025/10/28/mem0-raises-24m-from-yc-peak-xv-and-basis-set-to-build-the-memory-layer-for-ai-apps/)) treats memory as a dedicated service, not a framework class. It combines vector search with knowledge graphs, achieving [26% improvement over OpenAI's memory](https://arxiv.org/abs/2504.19413) in benchmarks. Zep uses temporally-aware knowledge graphs that track how facts change over time. The concept that was once `ConversationBufferMemory` now has its own companies, funding rounds, and research papers.

**State became durable.** [Temporal](https://temporal.io) raised [$300M at a $5B valuation](https://temporal.io/blog/temporal-raises-usd300m-series-d-at-a-usd5b-valuation) in February 2026, with 380% revenue growth driven primarily by agent workloads. OpenAI's Codex and Replit's Agent 3 are built on Temporal. The insight I wrote about in [agents are databases](/blog/agents-are-databases/) turned out to be literally true: agent state needs the same persistence, retries, and checkpointing that backend systems solved years ago. Durable execution is not a nice-to-have for agents that run for hours. It is a requirement.

**Sessions became alive.** I wrote about this progression in [building agents inside out](/blog/building-agents-inside-out/). When I wrapped the Claude Agent SDK in a FastAPI endpoint, the code that defined the agent's actual behavior was a small fraction of what I wrote. The rest was message iteration, cost deduplication, step logging, and HTTP wiring. Identical plumbing, every time. So I extracted it into [FastHarness](https://github.com/prassanna-ravishankar/fastharness).

```python
from fastharness import FastHarness, Skill

harness = FastHarness(name="my-agent")

harness.agent(
    name="assistant",
    description="A helpful coding assistant",
    skills=[Skill(id="code", name="Code", description="Write and fix code")],
    system_prompt="You are a senior engineer. Fix bugs, write tests, ship clean code.",
    tools=["Read", "Edit", "Bash", "Grep"],
)

app = harness.app  # Full A2A service: agent card, streaming, health checks
```

That `app` is a production-ready [A2A](https://a2a-protocol.org) service. The runtime is pluggable: the same agent definition works across Claude Agent SDK, OpenHands, and Pydantic DeepAgents backends, with a single line change.

```python
from fastharness import FastHarness

# Claude Agent SDK (default)
harness = FastHarness(name="my-agent")

# OpenHands - agent gets a full workspace
from fastharness.runtime.openhands import OpenHandsRuntimeFactory
harness = FastHarness(
    name="dev-agent",
    runtime_factory=OpenHandsRuntimeFactory(workspace="/path/to/project"),
)

# Pydantic DeepAgents
from fastharness.runtime.deepagents import DeepAgentsRuntimeFactory
harness = FastHarness(
    name="research-agent",
    runtime_factory=DeepAgentsRuntimeFactory(),
)
```

Sessions in Gen 4 are no longer Python variables. They are protocol-level entities. FastHarness maintains multi-turn conversations with a `context_id` that preserves history across A2A requests:

```python
from fastharness import FastHarnessClient

async with FastHarnessClient("http://localhost:8000") as client:
    await client.send("My name is Alice.", context_id="session-1")
    reply = await client.send("What's my name?", context_id="session-1")
    print(reply)  # "Alice"

    async for chunk in client.stream("Write a haiku about recursion"):
        print(chunk, end="", flush=True)
```

Other agents can discover this agent via its agent card, send it work over A2A, and receive streamed results. The session has identity, state, and discoverability. It is not a list you manage. It is a service that persists.

<!-- IMAGE: gen4-ecosystem.webp (1200x630, 16:9 aspect ratio)
PROMPT: Abstract editorial illustration showing an ecosystem in high definition. Six distinct geometric forms arranged in a hexagonal pattern, each sharp, crisp, and clearly separated: a teal (#2FA898) dodecahedron (tools/MCP), a cyan (#00FFFF) icosahedron (contracts/A2A), a gold (#D98034) cube (memory/Mem0), an electric blue (#0066FF) octahedron (state/Temporal), a white-cyan (#E0FFFF) sphere (sessions), and a slate (#334155) tetrahedron (observability/OTel). Each form is self-illuminated with sharp edges and visible internal structure. Between them, thin precise lines (2px, white at 40% opacity) form a network, with bright particles traveling along three of the lines. The forms cast no shadows on each other, they are independent but connected. Around the outer edge, a faint ring of smaller, blurrier versions of the same shapes at 15% opacity suggests the earlier generations when these concepts were indistinguishable. Background: void black (#0f0f12). Digital stipple grain at 10% density. No text, no human figures. Vector art with luminous glow effects. Composition: centered hexagonal arrangement, high contrast, the "HD resolution" feeling of each form being perfectly defined.
-->

![The agent ecosystem in full definition: tools, contracts, memory, state, sessions, observability as distinct protocol-level primitives](/images/blog/agent-framework-generations/gen4-ecosystem.webp)

## What's actually working (and what's not)

The ecosystem is in sharper definition than it has ever been. It is also more honestly assessed than the hype cycle would suggest.

**What's working:** Narrow, well-scoped agents on defined tasks. Customer service deflection, document processing, code review on bounded codebases. MCP as a tool protocol has real adoption (97M downloads is not a vanity metric). Durable execution via Temporal is seeing [380% revenue growth](https://temporal.io/blog/temporal-raises-usd300m-series-d-at-a-usd5b-valuation) because the alternative (ad-hoc retry logic) produces unreliable agents. Observability is converging on OpenTelemetry, which means agent traces will eventually be as standard as HTTP request traces.

**What's not working:** Security shipped after the protocol. Between January and February 2026, researchers filed [30 CVEs against MCP infrastructure in 60 days](https://www.heyuan110.com/posts/ai/2026-03-10-mcp-security-2026/), including in Anthropic's own reference implementations. 43% were shell injection. OWASP created a dedicated [MCP Top 10](https://dev.to/mistaike_ai/owasp-just-published-an-mcp-top-10-heres-what-it-means-5ebi). Agent security is where web application security was in 2005: the attacks are known, the defenses are immature, and deployment is outpacing security tooling by years.

A2A is [still largely theoretical](https://stackoverflow.blog/2026/03/20/was-2025-really-the-year-of-ai-agents/). 150+ partner companies, but production deployments you can name on one hand. The problem it solves (agent interoperability at scale) barely exists yet because most organizations do not have enough production agents to need inter-agent communication. The infrastructure is ahead of the demand.

Memory is fragmenting, not converging. Mem0, Zep, and Letta are building in different directions (extracted facts, temporal knowledge graphs, self-editing memory). There is no "MCP for memory" emerging. The real risk is data gravity: as agents accumulate memory and personalization, switching costs increase exponentially. Memory is where competitive moats are being built, which means standardization is against every vendor's interest.

Evaluation remains [fundamentally unsolved](https://www.langchain.com/state-of-agent-engineering). According to LangChain's 2026 survey, 89% of teams have observability (they can see what the agent did) but only 52% have actual evals (they can verify the agent did the right thing). LLM-as-Judge (using a second model to evaluate the first) is the standard pattern, but it introduces its own error rate. Nobody has agent evals in CI that they truly trust.

And cost is the quiet problem. [42% of AI projects show zero ROI](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) according to Gartner, who predict over 40% of agentic AI projects will be canceled by end of 2027. Costs have dropped 95% from 2023 levels, but for complex, open-ended tasks, they remain unpredictable and sometimes exceed human labor costs once you account for error correction. No major agent benchmark even reports cost metrics, despite [50x cost variations](https://www.ai21.com/blog/scaling-agentic-evaluation-swe-bench/) between agents achieving similar accuracy.

The honest picture is that roughly [20% of what we call "agent infrastructure" is genuinely novel](https://stackoverflow.blog/2026/03/20/was-2025-really-the-year-of-ai-agents/) (non-deterministic orchestration, tool-use protocols, self-modifying memory) and 80% is existing backend infrastructure (workflow engines, message queues, service meshes, API gateways) with AI labels. That 20% is real and creates genuine architectural challenges. But the next time someone pitches you an "agentic platform," ask which part is new and which part is Temporal with a chatbot on top.

## Where the definition is still blurry

Some concepts have not yet crystallized, and it is worth being honest about which ones.

**Planning** is still a prompt engineering problem, not an infrastructure problem. Chain-of-Thought, ReAct, Tree-of-Thoughts, Reflexion: these are reasoning strategies encoded in prompts and system instructions, not formal primitives with protocols or services. The model plans, and you hope it plans well. There is no "MCP for planning."

**Human-in-the-loop** is getting formal primitives (LangGraph's `interrupt()`/`Command(resume=...)`) but the patterns are still framework-specific. There is no protocol for "pause this agent, get human approval, resume." Every framework implements it differently.

**Cost management** has no standard. Prompt caching (Anthropic gives 90% discount on cached tokens) and model routing (use a cheaper model for simple subtasks) are real optimizations, but they are implemented ad-hoc. There is no cost-aware agent protocol. You can trace what an agent did with OpenTelemetry, but you cannot set a budget that the agent respects as a first-class constraint.

These are the concepts that Gen 5 will bring into definition. Or they will remain blurry because the ecosystem decides they do not need formalization. Not every concept needs a protocol. Sometimes a well-placed `if` statement is enough.

## The ecosystem in four sentences

Every concept in the agent ecosystem followed the same arc: ad-hoc hack, then framework feature, then protocol or infrastructure. The frameworks and the concepts co-evolved, each generation bringing both into sharper definition. We are in the middle of that process, with some concepts (tools, contracts, durability) in sharp focus and others (planning, cost, human-in-the-loop) still blurry. The trajectory is toward an ecosystem where agents are services with typed contracts, persistent sessions, and protocol-level interoperability, but the honest assessment is that we are closer to the beginning of that trajectory than the end.
