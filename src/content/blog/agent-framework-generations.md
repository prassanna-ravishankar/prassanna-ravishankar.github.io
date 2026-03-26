---
title: "The Agent Framework Arc"
description: "Agent frameworks evolved from raw API loops to autonomous coding agents in four generations, each bringing concepts like tools, memory, and sessions into sharper definition. Now multi-agent systems are starting the cycle again."
pubDate: 2026-03-26
heroImage: "/images/blog/agent-framework-generations/hero.webp"
series: ["AI Agents"]
topics: ["LangChain", "OpenAI Agents SDK", "Pydantic AI", "Claude Agent SDK", "ai agent frameworks", "autonomous AI agents", "how to build ai agents"]
author: "Prassanna Ravishankar"
draft: true
---

<!-- IMAGE: hero.webp (1200x630, 16:9 aspect ratio)
PROMPT: Abstract editorial illustration showing an evolutionary progression from left to right across the full width. Four vertical zones, each sharper and more defined than the last. The leftmost zone is a blurry, pixelated cluster of rough geometric shapes in slate (#475569) at low opacity, barely distinguishable from each other. The second zone is denser, tangled interconnected shapes in burnt orange (#D98034), more visible but knotted. The third zone has clean, organized teal (#2FA898) crystalline structures with clear edges. The fourth zone is high-definition: luminous distinct forms in neon cyan (#00FFFF) and white, each crisp and separated, connected by thin precise lines. At the far right edge, a fifth zone is just beginning to form: the same blurry, low-resolution shapes from the leftmost zone, but now arranged in clusters of 3-4 rather than alone, suggesting the cycle restarting at a higher level. Two parallel streams (teal for frameworks, gold #D98034 for concepts) run through all zones, tangled on the left, becoming distinct intertwined helices by the fourth zone. Background: void black (#0f0f12). Digital stipple grain at 14% density. No text, no human figures. Vector art.
-->

I have been building agents for most of the past year. Not chatbots, not RAG pipelines, but agents that run for hours, call tools, recover from errors, and ship actual work. Over that time I have used raw API calls, LangChain, Pydantic AI, the Claude Agent SDK, and my own [FastHarness](https://github.com/prassanna-ravishankar/fastharness) framework. Each one taught me something about what matters and what doesn't.

What I have come to believe is that agent frameworks have evolved through four distinct generations, and the core change across all of them is an inversion. In Gen 1, you contain the agent: your code wraps a model call, manages the loop, dispatches tools, persists state. By Gen 4, the agent contains you: it runs autonomously, and your contribution is a system prompt and a behavior spec tucked inside its runtime. The developer went from being the outer shell to being the inner kernel.

With each generation, an ecosystem of concepts (tools, memory, sessions, contracts, observability, safety) came into sharper definition alongside that inversion. They started as indistinguishable hacks inside the developer's while loop and gradually resolved into distinct, protocol-level primitives that the agent consumes. The frameworks and the concepts co-evolved, and together they define what we mean by "agent ecosystem."

The best way to see this is through code.

## Generation 1: The raw loop (Nov 2022 - May 2023)

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

This worked. Millions of agents shipped this way. But look at who contains whom: your code is the outer shell, and the model is a function call buried inside your while loop. You own everything. The model is a dependency you invoke, not an entity that acts. The concepts (tools, memory, sessions) are there, but they are just implementation details of your loop, tangled and indistinguishable.

## Generation 2: Abstractions on abstractions (May 2023 - Dec 2024)

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

Gen 2 was the first attempt to give the ecosystem's concepts distinct identities. Tools became `@tool` decorators. Memory became `ConversationBufferMemory` and `ConversationSummaryMemory`. Observability became LangSmith. Safety got its first formal treatment when NVIDIA released [NeMo Guardrails](https://developer.nvidia.com/nemo-guardrails) in April 2023, introducing Colang, a custom DSL for controlling LLM outputs.

The problem was that frameworks gave each concept a name but wrapped it in so many layers that the name was all you could see. Max Woolf wrote in July 2023 that LangChain was ["one of the few pieces of software that increases overhead in most of its popular use cases."](https://minimaxir.com/2023/07/langchain-problem/) Octomind used LangChain in production for over twelve months before [ripping it out entirely](https://octoclaw.ai/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents), describing it as "abstractions on top of other abstractions." LCEL (LangChain Expression Language) added yet another DSL on top of Python, which meant you were no longer debugging Python but debugging a framework-specific pipe syntax.

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent("assistant", llm_config={"model": "gpt-4"})
user_proxy = UserProxyAgent(
    "user_proxy", code_execution_config={"work_dir": "coding"}
)
user_proxy.initiate_chat(assistant, message="Plot NVDA stock price YTD")
```

AutoGen's insight (agents as conversation partners, not chain links) was genuine. But [the project fractured](https://microsoft.github.io/autogen/0.2/blog/2024/11/14/confusion-created-by-forks/) in November 2024 when the original creators left Microsoft and forked it as AG2, leaving four competing versions and no clear path forward. CrewAI tried to simplify multi-agent coordination with role-based metaphors, but added its own layer of YAML configuration and anthropomorphic ceremony.

<!-- IMAGE: inversion.webp (1200x630)
PROMPT: Clean technical diagram in the style of Anthropic's engineering blog illustrations. Cream background. Crisp flat vector shapes with consistent rounded corners. Four panels arranged left to right with generous spacing, connected by thin gray arrows.

Panel 1 titled "GEN 1": A large warm orange rounded rectangle (representing developer code) containing a small sage green rounded rectangle inside it (representing the model). The orange is the outer shell. The green is a small dependency inside. The developer contains the model.

Panel 2 titled "GEN 2": A large slate blue rounded rectangle (representing the framework) containing both a medium warm orange rectangle and a medium sage green rectangle side by side inside it. The framework contains both the developer and the model. Neither is the outer shell.

Panel 3 titled "GEN 3": A medium warm orange rounded rectangle with a medium sage green rectangle beside it, connected by thin lines. No outer container. They are peers. The developer still writes the loop but the framework wrapper is gone.

Panel 4 titled "GEN 4": A large sage green rounded rectangle (representing the agent runtime) containing a small warm orange rounded rectangle inside it (representing the developer's behavior spec). The green is now the outer shell. The orange is a small configuration inside. The agent contains the developer.

The visual progression shows the orange shrinking from outer shell to inner kernel while the green grows from inner dependency to outer shell. Below all four panels, a thin dashed line with the label "the inversion" in lowercase italic.

Typography: all-caps letter-spaced headings for generation labels, lowercase italic for annotation. Clean sans-serif throughout. Style: Anthropic technical blog. Precise vector shapes. Muted earth tones only. No gradients, no shadows, no icons, no textures.
-->

![The ownership inversion: the developer went from outer shell to inner kernel](/images/blog/agent-framework-generations/inversion.webp)

The session concept evolved from a raw messages list to Memory objects: `ConversationBufferMemory`, `ConversationSummaryMemory`, vector-store-backed retrieval memory. The intention was good. The execution was leaky. Memory was bolted on rather than built in, and the abstractions often hid critical details about what was actually being stored and retrieved. You traded a list you understood for a Memory class you had to read the source code to debug.

The containment shifted, but not toward the agent. The framework became the new outer shell: it wrapped both you and the model in its abstractions. You were no longer containing the model directly; the framework was containing both of you. LangChain's `Tool` was not Python's function. LangChain's `Memory` was not a database. Each concept was visible (you could point to "that's the memory, that's the tool") but not portable. If you left the framework, you left its concepts too.

## Generation 3: Back to Python (Dec 2024 - mid 2025)

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

The OpenAI Agents SDK has four concepts: Agent, Runner, Handoff, Guardrails. That is the entire framework. Tools are plain Python functions whose schemas are auto-generated from type hints. Multi-agent coordination uses Handoffs, which are just agents referencing other agents. Guardrails formalize safety as a three-layer architecture (input, tool, output) rather than a system prompt and a prayer.

```python
triage = Agent(
    name="Triage",
    instructions="Route to the right specialist.",
    handoffs=[billing_agent, technical_agent]
)
billing_agent = Agent(name="Billing", instructions="Handle billing questions.")
technical_agent = Agent(name="Technical", instructions="Handle technical issues.")
```

Pydantic AI took a complementary approach, focusing on type safety. Tools are decorated functions whose type hints automatically become validated schemas. Outputs are Pydantic models validated at runtime, even during streaming.

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

This was the generation where concepts gained real definition without framework lock-in. Context stopped being a growing list or a framework Memory class and became typed, validated, first-class. Pydantic AI introduced dependency injection: structured context passed into agent runs through the type system, not through global state or framework wrappers.

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

Observability matured in parallel. Pydantic Logfire launched as [OpenTelemetry-native](https://logfire.pydantic.dev/docs/ai-observability/), meaning agent traces were standard OTel spans rather than framework-specific artifacts. The [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/blog/2025/ai-agent-observability/) (v1.37) defined standard attributes for tasks, actions, agents, and memory. Evaluation found its footing through SWE-bench and the distinction between outcome evaluation (did the agent get the right answer?) and trajectory evaluation (did the agent take reasonable steps to get there?).

Gen 3 dissolved the framework's outer shell and gave the developer back control. You could see every layer, debug every step, and swap components without rewriting your agent. But the containment had not yet inverted. You still wrote the agent loop. You still dispatched tool calls. The model was still a call inside your code, not an entity running your code.

## Generation 4: The agent gets a computer (mid 2025 - late 2025)

Gen 4 is where the inversion happens. In every previous generation, your code is the outer shell and the model is a call inside it. In Gen 4, the agent is the outer shell and your contribution (a system prompt, a behavior spec, a set of allowed tools) is a small configuration inside the agent's runtime. The model runs the loop. You describe what it should do.

[OpenHands](https://github.com/All-Hands-AI/OpenHands) (formerly OpenDevin, 68K GitHub stars, [$18.8M Series A](https://openhands.dev/blog/weve-just-raised-18-8m-to-build-the-open-standard-for-autonomous-software-development)) made this concrete first: model-agnostic coding agents composed from Python primitives, with Docker-sandboxed execution by default and routing via LiteLLM across 100+ providers. The [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk) crystallized the pattern further, exposing the same runtime that powers Claude Code. You do not write the loop. You do not dispatch tool calls. You describe the task and the model executes it.

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

Compare this to the Gen 1 while loop. The messages array is gone. The tool dispatch is gone. Your code is a consumer of the agent's work, not the orchestrator of it. The model decides when to read a file, when to run a test, when to edit code, and when to stop.

This is the generation where concepts graduated from framework features to standalone protocols and infrastructure. **Tools became [MCP](https://www.anthropic.com/news/model-context-protocol)**, reaching [97 million monthly SDK downloads](https://mcpmanager.ai/blog/mcp-adoption-statistics/) and [donation to the Linux Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) in December 2025. **Contracts became [A2A](https://a2a-protocol.org)**, [donated to the Linux Foundation](https://developers.googleblog.com/en/google-cloud-donates-a2a-to-linux-foundation/) in June 2025 with 150+ supporting organizations. **Memory became infrastructure**: [Mem0](https://github.com/mem0ai/mem0) raised [$24M](https://techcrunch.com/2025/10/28/mem0-raises-24m-from-yc-peak-xv-and-basis-set-to-build-the-memory-layer-for-ai-apps/) treating memory as a dedicated service with knowledge graphs, not a framework class. **State became durable**: [Temporal](https://temporal.io) raised [$300M at a $5B valuation](https://temporal.io/blog/temporal-raises-usd300m-series-d-at-a-usd5b-valuation) in February 2026, with 380% revenue growth driven by agent workloads. **Sessions became alive**: protocol-level entities with identity, state, and discoverability via A2A task lifecycle and agent cards.

I wrote about this progression in [building agents inside out](/blog/building-agents-inside-out/). The plumbing I kept rewriting (message iteration, cost deduplication, step logging, HTTP wiring) was identical across every agent, so I extracted it into [FastHarness](https://github.com/prassanna-ravishankar/fastharness). The runtime is pluggable: the same agent definition works across Claude Agent SDK, OpenHands, and Pydantic DeepAgents backends.

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

```python
# One line changes the runtime. Everything else stays the same.
from fastharness.runtime.openhands import OpenHandsRuntimeFactory
harness = FastHarness(
    name="dev-agent",
    runtime_factory=OpenHandsRuntimeFactory(workspace="/path/to/project"),
)
```

<!-- IMAGE: cycle-restart.webp (1200x630)
PROMPT: Clean technical diagram in the style of Anthropic's engineering blog illustrations. Cream background. Crisp flat vector shapes with consistent rounded corners. Two panels side by side with a thin dashed curved arrow connecting the right panel back toward the left.

Left panel titled "GEN 4" in all-caps letter-spaced text: Six sage green rounded rectangles arranged in a clean two-column grid with thin connecting lines between them. Each block is labeled with a protocol name: "MCP", "A2A", "Mem0", "Temporal", "OTel", "Sessions". The blocks are precise, organized, resolved. Below, a label "single-agent: solved" in lowercase italic.

Right panel titled "GEN 5" in all-caps letter-spaced text: Six warm orange rounded rectangles of different sizes, not in a grid, arranged loosely with no connections between them. Each is labeled with a multi-agent concern: "coordination", "discovery", "state sync", "merge", "cost", "identity". They are not contained by anything and have no visual relationship to each other. Below, a label "multi-agent: unsolved" in lowercase italic.

A thin dashed curved arrow arcs from the bottom of the right panel back toward the left panel, suggesting the cycle is repeating. The visual story: the left side is resolved and organized, the right side is back to the unstructured state of Gen 1, but at a higher level.

Typography: all-caps letter-spaced headings, lowercase labels on blocks, lowercase italic for annotations. Clean sans-serif throughout. Style: Anthropic technical blog. Precise vector shapes. Muted earth tones only. No gradients, no shadows, no icons, no textures.
-->

![The cycle restarts: single-agent ecosystem resolved, multi-agent ecosystem back to Gen 1](/images/blog/agent-framework-generations/cycle-restart.webp)

The honest picture of Gen 4 is that it is simultaneously real and uneven. MCP adoption is genuine, but [30 CVEs were filed against MCP infrastructure in 60 days](https://www.heyuan110.com/posts/ai/2026-03-10-mcp-security-2026/) (January-February 2026), and OWASP created a dedicated [MCP Top 10](https://dev.to/mistaike_ai/owasp-just-published-an-mcp-top-10-heres-what-it-means-5ebi). The protocol shipped before anyone secured it. A2A has 150+ partner companies but production deployments [you can count on one hand](https://stackoverflow.blog/2026/03/20/was-2025-really-the-year-of-ai-agents/). Memory is fragmenting, not converging: Mem0, Zep, and Letta are building in fundamentally different directions, and data gravity (the increasing switching cost as agents accumulate personalization) is becoming the new vendor lock-in. Only [52% of teams have actual agent evals](https://www.langchain.com/state-of-agent-engineering) despite 89% having observability. And [42% of AI projects show zero ROI](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), with Gartner predicting over 40% of agentic AI projects will be canceled by end of 2027.

The single-agent ecosystem has come into focus. The concepts are distinct, protocol-level, and (mostly) vendor-neutral. But the picture is about to get blurry again.

## Generation 5: The cycle restarts (Nov 2025 - now)

If you have been paying attention to the pattern, what comes next should feel familiar. Look at the dates: Gen 1 to Gen 2 took eighteen months. Gen 3 to Gen 4 took six months. Gen 5 started overlapping Gen 4 before it was even finished. The compression is the story.

[OpenClaw](https://github.com/openclaw/openclaw) launched in November 2025 and hit [250K GitHub stars](https://en.wikipedia.org/wiki/OpenClaw) faster than any project in GitHub history. Its Pi coding agent core is Gen 4 technology (shell exec, file I/O, browser automation, MCP integration), but what makes OpenClaw a Gen 5 project is what it builds on top: multi-agent routing with isolated workspaces per agent, [ACP (Agent Control Protocol)](https://docs.openclaw.ai/) for sub-agent coordination, a skills system where capabilities are defined as `SKILL.md` files with three-tier precedence loading, persistent JSONL session transcripts with context compaction, cron automation, and webhooks. It connects all of this to WhatsApp, Telegram, Slack, Discord, iMessage, and 15+ other channels. OpenClaw went viral because it meets people where they already are while offering genuine multi-agent coordination underneath. [FastHarness](https://github.com/prassanna-ravishankar/fastharness) bridges OpenClaw agents into the A2A protocol:

```python
from fastharness.bridges.openclaw import OpenClawBridge

bridge = OpenClawBridge("ws://localhost:18789")
app = bridge.expose("research-bot", description="Research assistant")
# One line: full A2A endpoint, streaming, multi-turn, health checks
```

[Gastown](https://github.com/steveyegge/gastown) (Steve Yegge, December 2025) orchestrates 20-30 Claude Code instances working in parallel on the same codebase. A "Mayor" distributes work to "Polecats" (ephemeral workers with their own git worktrees), a "Witness" detects stuck agents, a "Deacon" runs health checks, and a "Refinery" manages merges. It supports multiple runtimes (Claude, Gemini, Codex, Cursor, Augment, Amp) and burns roughly $100/hour. Yegge describes it as ["Kubernetes for AI coding agents."](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04) Three months later, in March 2026, Yegge announced [the Wasteland](https://steve-yegge.medium.com/welcome-to-the-wasteland-a-thousand-gas-towns-a5eb9bc8dc1f): a federation layer that connects thousands of Gas Towns into a distributed work network. A shared "Wanted Board" backed by [Dolt](https://www.dolthub.com/) (a SQL database with Git semantics) lets anyone running a Gas Town post work, claim tasks, submit completed work with evidence, and earn reputation stamps. The [gasclaw](https://github.com/gastown-publish/gasclaw) project bundles Gastown with OpenClaw in a single container.

[Repowire](https://github.com/prassanna-ravishankar/repowire) (mine, January 2026) takes a third approach: a peer-to-peer mesh where Claude Code sessions discover and query each other in real-time via MCP tools. No central coordinator, no Mayor, no Wanted Board. Each agent remains specialized in its own repository but can reach out to others when it needs context that lives elsewhere. I wrote about [how it works](/blog/repowire/) and [why it exists](/blog/vibe-bottleneck/).

Three topologies for the same problem: top-down orchestration (Gastown), federated work network (Wasteland), peer-to-peer mesh (Repowire), messaging-native sub-agents (OpenClaw's ACP). Everyone is writing their own coordination loop. There are no shared standards for how agents discover each other's state, delegate work, or merge results. Gastown manages state through git worktrees and a bespoke "Beads" system backed by Dolt. Repowire uses a daemon registry. OpenClaw uses JSONL transcripts. None of them are portable.

This is Gen 1 energy, one layer up. The concepts that just reached protocol-level definition for single agents need to be re-solved for multi-agent systems. MCP solved tool discovery for a single agent. What solves agent discovery for a fleet? A2A tries, but it is where MCP was in early 2024: the spec exists, the adoption barely does.

The single-agent arc took roughly three and a half years to go from raw loops to protocol-level infrastructure (November 2022 to mid 2026). The multi-agent arc is starting that same journey now, but on top of the foundation that Gen 4 built. MCP, A2A, OTel, and durable execution already exist. The building blocks do not need to be reinvented, they need to be composed at a higher level. Gastown going from single-node orchestrator to federated work network in three months suggests how fast this cycle will compress.

History does not repeat, but it rhymes. The agent ecosystem just resolved into HD. Now it is about to go blurry again, one layer up, and resolve again faster.
