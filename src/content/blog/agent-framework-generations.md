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
PROMPT: Abstract editorial illustration showing four vertical geological strata layers, viewed in cross-section from left to right. The bottom layer (Gen 1) is rough, jagged obsidian rock (#1a1a2e) with faint orange (#D98034) veins representing manual wiring. The second layer (Gen 2) is a dense, tangled mesh of interconnected geometric shapes in burnt orange and brick red (#B54725), over-complicated and heavy. The third layer (Gen 3) is cleaner, with organized teal (#2FA898) crystalline structures forming orderly patterns, lighter and more transparent. The top layer (Gen 4) is almost pure light, luminous cyan (#00FFFF) ribbons flowing freely upward, barely constrained by structure, representing agents with direct computer access. A single bright white particle travels upward through all four layers, leaving a trail. Background: void black (#0f0f12). Digital stipple grain at 14% density. No text, no human figures, no screens. Vector art style with depth from layered glow effects.
-->

I have been building agents for most of the past year. Not chatbots, not RAG pipelines, but agents that run for hours, call tools, recover from errors, and ship actual work. Over that time I have used raw API calls, LangChain, Pydantic AI, the Claude Agent SDK, and my own [FastHarness](https://github.com/prassanna-ravishankar/fastharness) framework. Each one taught me something about what matters and what doesn't.

What I have come to believe is that agent frameworks have evolved through four distinct generations, and the differences between them are not cosmetic. Each generation changes what you write, what the framework handles, and (this is the part nobody talks about) what a "session" even means. The concept of an agent's relationship with state has quietly transformed from a messages array you manually truncate into a persistent, multi-turn existence with its own lifecycle.

The best way to see this is through code.

## Generation 1: The raw loop

Before frameworks existed, building an agent meant writing a while loop. You maintained a messages array, called the API, checked if the response contained tool calls, executed them yourself, appended the results, and looped until the model stopped asking for tools. Every team wrote this. Every team wrote it slightly differently. Every team debugged the same edge cases.

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

Look at what you own in this code. The messages array. The while loop. The tool dispatch. The JSON parsing. The conversation history. The decision about when to stop. If you want memory across conversations, you build it. If you want retry logic, you build it. If you want token counting so you do not overflow the context window, you build it.

The concept of a "session" in Gen 1 is just a Python list called `messages`. You append to it. You truncate it when it gets too long. When the process dies, the session dies. There is no persistence, no lifecycle, no identity. The agent is a stateless function that happens to carry a growing list of dictionaries.

This worked. Millions of agents shipped this way. But every team was solving the same infrastructure problems instead of working on agent behavior. The boilerplate was identical across projects; only the tool definitions and system prompts varied.

## Generation 2: Abstractions on abstractions

LangChain launched in October 2022, written by Harrison Chase in nine days. It introduced the abstractions that would define a generation: Chains (composable sequences of LLM calls), Agents (LLM decides which tool to call), Tools (wrappers around functions), and Memory (conversation persistence). Within months it had raised $20M from Sequoia and had 99,000 GitHub stars.

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

The promise was compelling: stop writing boilerplate, start composing agents from reusable parts. The reality was different. Max Woolf wrote in July 2023 that LangChain was ["one of the few pieces of software that increases overhead in most of its popular use cases."](https://minimaxir.com/2023/07/langchain-problem/) Octomind used LangChain in production for over twelve months before [ripping it out entirely](https://octoclaw.ai/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents), describing it as "abstractions on top of other abstractions." Debugging was, as one developer put it, "an archaeological dig."

The problem was not that LangChain was bad. It was that it optimized for the wrong thing. It made simple demos easy and complex production agents painful. The abstraction layers that simplified a three-tool demo became opaque walls when you needed to understand why your agent was making unexpected tool calls in production. LCEL (LangChain Expression Language) added yet another DSL on top of Python, which meant you were no longer debugging Python but debugging a framework-specific pipe syntax.

Microsoft's AutoGen arrived in October 2023 with a different abstraction: multi-agent conversation. Instead of chains, agents talked to each other in group chats.

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(
    "assistant",
    llm_config={"model": "gpt-4"}
)
user_proxy = UserProxyAgent(
    "user_proxy",
    code_execution_config={"work_dir": "coding"}
)

user_proxy.initiate_chat(assistant, message="Plot NVDA stock price YTD")
```

AutoGen's insight was that coordination between agents should look like conversation, not graph traversal. But it came with its own problems. In November 2024, the original creators left Microsoft and forked the project as AG2, leaving the community with [four competing forks](https://microsoft.github.io/autogen/0.2/blog/2024/11/14/confusion-created-by-forks/) and no clear path forward. CrewAI (January 2024) tried to simplify multi-agent coordination with role-based metaphors, assigning each agent a "role," "goal," and "backstory," but that added its own layer of YAML configuration and anthropomorphic ceremony.

The session concept evolved in Gen 2. Instead of a raw messages list, frameworks introduced Memory objects: `ConversationBufferMemory`, `ConversationSummaryMemory`, vector-store-backed retrieval memory. The intention was good. The execution was leaky. Memory was bolted on rather than built in, and the abstractions often hid critical details about what was actually being stored and retrieved. You traded a list you understood for a Memory class you had to read the source code to debug.

<!-- IMAGE: gen2-tangle.webp (1200x630, 16:9 aspect ratio)
PROMPT: Abstract editorial illustration of a tangled system becoming unmaintainable. A central geometric cube (representing an agent) is wrapped in dozens of overlapping translucent layers in burnt orange (#D98034) and brick red (#B54725), each layer adding thickness and opacity. Thin teal lines (#2FA898) attempt to pass through the layers from outside (representing tool calls) but bend, refract, and scatter as they penetrate each layer, arriving at the core distorted. Three small white particles are trapped between layers, unable to reach the core (representing lost context). The outermost layers have visible labels/tags that are illegible, just shapes suggesting framework abstractions. Below the cube, a simple clean teal line runs straight and unobstructed for comparison. Background: void black (#0f0f12). Digital stipple grain at 16% density. No text, no human figures. Vector art, isometric perspective.
-->

![Over-abstracted frameworks wrapping agents in opaque layers](/images/blog/agent-framework-generations/gen2-tangle.webp)

The fundamental tension of Gen 2 was that frameworks tried to be smarter than the developer. They wrapped every interaction in their own types, managed control flow through their own abstractions, and left you unable to see what was happening underneath. When your agent misbehaved, you were not debugging your code. You were debugging the framework's interpretation of your code.

## Generation 3: Back to Python

The backlash produced a generation that stripped frameworks back to language-native patterns. Two projects defined this shift: OpenAI's Agents SDK and Pydantic AI.

OpenAI released the Agents SDK in March 2025, evolved from their experimental Swarm project. Its philosophy was explicit: enough features to be worth using, few enough primitives to learn quickly. The entire framework is four concepts: Agent, Runner, Handoff, and Guardrails.

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

No chains. No expression language. No YAML. Tools are plain Python functions whose schemas are auto-generated from type hints. Multi-agent coordination uses Handoffs, which are just agents referencing other agents.

```python
triage = Agent(
    name="Triage",
    instructions="Route to the right specialist.",
    handoffs=[billing_agent, technical_agent]
)
billing_agent = Agent(name="Billing", instructions="Handle billing questions.")
technical_agent = Agent(name="Technical", instructions="Handle technical issues.")
```

Pydantic AI, released in December 2024 by Samuel Colvin (creator of Pydantic), took a complementary approach. Where OpenAI focused on minimalism, Pydantic AI focused on type safety. Tools are decorated functions with type hints that automatically become validated schemas. Outputs are Pydantic models that the framework validates at runtime, even during streaming.

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

The session concept matured in Gen 3. OpenAI's SDK introduced context variables, typed state that persists across an agent's execution and handoffs. Pydantic AI introduced dependency injection, letting you pass structured context (database connections, user state, configuration) into agent runs without global state. These are not bolted-on memory objects. They are first-class citizens of the framework's type system, validated and traceable.

```python
# Pydantic AI: structured context via dependency injection
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

Gen 3 restored developer control. You could read the framework's source in an afternoon. Debugging meant debugging Python, not framework internals. But you still wrote the agent loop. You still dispatched tool calls. You still managed the cycle of "model thinks, you execute, model thinks again." The framework handled the edges; the core loop was still yours.

## Generation 4: The agent gets a computer

The shift from Gen 3 to Gen 4 is not incremental. It is a category change. In every previous generation, your code orchestrates the agent. In Gen 4, the agent orchestrates itself.

[OpenHands](https://github.com/All-Hands-AI/OpenHands) (formerly OpenDevin) was one of the first to make this concrete. It gives agents a sandboxed computer: terminal, file system, browser. The agent does not call tools through a framework abstraction. It runs shell commands, edits files, and browses the web, the same way a human developer would.

The [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk) crystallized the pattern. It exposes the same runtime that powers Claude Code: the agent reads files, runs commands, edits code, recovers from errors, and decides what to do next. You do not write the loop. You do not dispatch tool calls. You describe the task and the model executes it.

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

Compare this to the Gen 1 while loop. The messages array is gone. The tool dispatch is gone. The "check if the model wants to call a tool" conditional is gone. You are not managing the agent's reasoning cycle. You are receiving its output. The agent decides when to read a file, when to run a test, when to edit code, and when to stop. Your code is a consumer of the agent's work, not the orchestrator of it.

I wrote about this progression in [building agents inside out](/blog/building-agents-inside-out/). When I first wrapped the Claude Agent SDK in a FastAPI endpoint, the useful code (system prompt, output schema, model choice) was about 20 lines. The remaining 120 lines were message iteration, cost deduplication, step logging, and HTTP wiring. Every agent I built had the same 120 lines. So I extracted them into [FastHarness](https://github.com/prassanna-ravishankar/fastharness).

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

That `app` is a production-ready [A2A](https://a2a-protocol.org) service. It auto-generates an agent card at `/.well-known/agent-card.json`, handles `message/send` and `message/sendStream` via JSON-RPC, manages task lifecycle, and exposes health and readiness probes. The agent's behavior comes from the system prompt and tools. Everything else is handled.

The runtime is pluggable. The same agent definition works across different backends:

```python
from fastharness import FastHarness

# Claude Agent SDK (default)
harness = FastHarness(name="my-agent")

# OpenHands — agent gets a full workspace
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

One line changes the runtime. The agent definition, the A2A protocol wiring, the streaming, the health checks, all stay the same. The `AgentRuntime` protocol (with `run()`, `stream()`, `aclose()`) and `AgentRuntimeFactory` protocol (with `get_or_create()`, `remove()`, `shutdown()`) decouple agent logic from execution engine entirely.

<!-- IMAGE: gen4-session.webp (1200x630, 16:9 aspect ratio)
PROMPT: Abstract editorial illustration showing the evolution of "session" across four stages, arranged left to right. Far left: a simple vertical stack of thin horizontal lines in slate (#475569), representing a messages array, raw and mechanical. Second: the stack is enclosed in an opaque burnt orange (#D98034) box with a label, representing a framework Memory object, the internals no longer visible. Third: the lines transform into organized teal (#2FA898) crystals with typed connectors between them, representing structured typed context, transparent and orderly. Far right: a luminous white-cyan (#E0FFFF) sphere with an internal glow, self-contained and alive, with thin teal threads extending outward to other smaller spheres, representing a persistent multi-turn session with its own identity communicating with other sessions. Each stage is slightly higher than the last, ascending left to right. A thin dashed line (#475569 at 30% opacity) connects all four stages showing progression. Background: void black (#0f0f12). Digital stipple grain at 12% density. No text, no human figures. Vector art, flat perspective with glow effects on the rightmost sphere.
-->

![The evolution of session: from messages array to persistent multi-turn existence](/images/blog/agent-framework-generations/gen4-session.webp)

The session concept in Gen 4 is the most profound shift. In previous generations, a session was something your code managed: a list, a memory object, a context variable. In Gen 4, the session belongs to the agent. FastHarness maintains multi-turn conversations with a `context_id` that preserves conversation history across A2A requests:

```python
from fastharness import FastHarnessClient

async with FastHarnessClient("http://localhost:8000") as client:
    # First turn
    await client.send("My name is Alice.", context_id="session-1")

    # Second turn — the agent remembers
    reply = await client.send("What's my name?", context_id="session-1")
    print(reply)  # "Alice"

    # Stream tokens as they arrive
    async for chunk in client.stream("Write a haiku about recursion"):
        print(chunk, end="", flush=True)
```

The A2A protocol formalizes this further. Each interaction creates a Task with a lifecycle (submitted, working, completed, failed). The task carries context. The agent card advertises capabilities. Other agents can discover this agent, send it work, and receive streamed results. The session is no longer a Python variable. It is a protocol-level entity with identity, state, and discoverability.

## The thread nobody talks about

If you squint at the four generations, the most interesting evolution is not in what code you write. It is in how the agent relates to its own state.

Gen 1 gave you a `messages` list. You appended to it, truncated it, and serialized it if you wanted persistence. The agent had no memory. It had your memory, implemented as a data structure you managed.

Gen 2 introduced Memory objects that wrapped the list in framework abstractions. `ConversationBufferMemory` stored everything. `ConversationSummaryMemory` compressed old messages into summaries. Vector store memory retrieved relevant past interactions. But these were bolt-ons. The agent did not know it had memory. Your code decided when to read and write.

Gen 3 made context a first-class type. Pydantic AI's dependency injection passes typed context into every tool call. OpenAI's context variables flow across agent handoffs. The agent's environment is now structured, validated, and traceable. But the lifecycle is still yours to manage.

Gen 4 gives the agent a session. The Claude Agent SDK maintains state across tool calls within a run. FastHarness maintains state across HTTP requests via context IDs. The A2A protocol gives sessions an identity that other agents can address. The agent does not just use state. It inhabits it.

This progression (list to memory object to typed context to session) mirrors what happened in web development. HTTP started stateless. Cookies added persistence. Session stores added structure. JWTs added identity. Each step made the connection between client and server more alive. Agent frameworks are following the same arc, twenty years compressed into four.

## Where this leaves us

The trajectory is clear. Each generation reduces the ratio of infrastructure code to behavior code. Gen 1 was almost entirely infrastructure. Gen 2 replaced your infrastructure with framework infrastructure (arguable improvement). Gen 3 minimized infrastructure while keeping you in control of the loop. Gen 4 eliminates the loop and leaves you with behavior, which is what matters.

I have a bias here. I built [FastHarness](https://github.com/prassanna-ravishankar/fastharness) because I got tired of writing the same 120 lines of A2A protocol wiring for every agent. The runtime factory pattern exists because I needed the same agent to run on Claude's subprocess model for some use cases and on OpenHands for others. These are not theoretical preferences. They are extracted from production agents that I run in [Torale](https://torale.ai) and across my [project portfolio](https://github.com/prassanna-ravishankar).

But the larger point stands regardless of which specific framework you use. The question is no longer "which framework should I pick?" It is "how much of the agent loop do I want to own?" If the answer is all of it, Gen 1 is still there and still works. If the answer is none of it, Gen 4 hands the loop to the model and lets you focus on what your agent should do rather than how it should run.

The frameworks will keep evolving. The session concept will keep maturing. But the direction is set: less plumbing, more behavior, and agents that increasingly manage their own existence.
