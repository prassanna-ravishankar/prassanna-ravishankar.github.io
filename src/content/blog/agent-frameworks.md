---
title: "Agents Assemble: The New Fragmentation in AI Agent Frameworks"
description: "Dive into the AI agent framework wars! Compare OpenAI, Google ADK, AWS Bedrock, Smol Agents. Explore multi-agent systems & future trends. Expert analysis."
pubDate: 2025-04-10
heroImage: "/images/blog/agent-frameworks/hero.webp"
tags: ["AI Agents", "Agent Frameworks", "LLMs", "OpenAI", "Google ADK", "AWS Bedrock", "Smol Agents", "Multi-Agent Systems"]
author: "Prassanna Ravishankar"
draft: false
---

## The Rising Babel of AI Agents (A Ranty Introduction)

![AI agent frameworks proliferating like JavaScript frameworks, showing the fragmented landscape of agent development tooling](/images/blog/agent-frameworks/intro.webp)

If you thought the LLM tooling boom was wild, welcome to the **agent framework free-for-all**. In 2023 it was "which model or prompt library to use?" – now in 2025 it's "which *agent* framework will orchestrate those models?" We're seeing a proliferation of agent SDKs and toolkits that feels eerily like the Javascript framework wars of the 2010s. Each promises to turn raw LLMs into autonomous task-solvers, and each has its own philosophy on how to do it. The result? A fragmented landscape of Agent Development Kits, orchestrators, and DIY hacks – all trying to define how AI agents should think, act, and even talk to each other. 

In this post, I'll **compare the leading frameworks for building AI agents** – from heavyweight enterprise platforms to minimalist open-source hacks – and explore the emerging trends (Agent-to-Agent protocols, multi-agent communication standards, "economy of agents", etc.). Buckle up for a sharp, opinionated tour. 

*(Spoiler: This agent ecosystem might just end up even more disruptive than the large language models underneath – and a lot messier, at least for now.)*

---

## The Agent Arsenal

![Comparison of leading AI agent frameworks including PydanticAI, OpenAI, Google ADK, and AWS Bedrock](/images/blog/agent-frameworks/agent-arsenal.webp)

### Pydantic for AI Agents – Type-Safety in a Chaotic World  

[PydanticAI](https://ai.pydantic.dev/) is a Python agent framework developed by the creators of Pydantic, aiming to simplify the construction of production-grade applications utilizing Generative AI. It draws inspiration from FastAPI's design philosophy, emphasizing an ergonomic and efficient developer experience.

**Key Features of PydanticAI:**

- **Model-Agnostic Support:** PydanticAI is compatible with various models, including OpenAI, Anthropic, Gemini, Deepseek, Ollama, Groq, Cohere, and Mistral. It also provides a straightforward interface for integrating additional models.

- **Seamless Integration with Pydantic Logfire:** The framework integrates with Pydantic Logfire, facilitating real-time debugging, performance monitoring, and behavior tracking of LLM-powered applications.

- **Type Safety and Structured Responses:** Leveraging Pydantic's capabilities, PydanticAI ensures robust type checking and validation of model outputs, promoting consistency across application runs.

- **Python-Centric Design with Dependency Injection:** The framework utilizes Python's familiar control flow and agent composition, incorporating an optional dependency injection system. This design simplifies the provision of data and services to agents, streamlining development and testing processes.

**Example: Building a Simple Agent with PydanticAI**

Below is a minimal example demonstrating the creation of an agent using PydanticAI:

```python
from pydantic_ai import Agent

agent = Agent(
    'google-gla:gemini-1.5-flash',
    system_prompt='Be concise, reply with one sentence.',
)

result = agent.run_sync('Where does "hello world" come from?')
print(result.data)
# Output: "The first known use of 'hello, world' was in a 1974 textbook about the C programming language."
```


**Opinion:**: PydanticAI might just be the most *Pythonic* take on agent frameworks yet — and that’s a good thing. It feels like FastAPI reincarnated for the agent age: declarative, strongly typed, dev-first. Unlike more monolithic frameworks, it doesn’t try to reinvent the world; it lets you compose agents using familiar patterns while giving you batteries-included support for validation, observability, and model abstraction.

What stands out is how it reframes agents as just another software primitive — something you can unit test, introspect, and build pipelines around — rather than a prompt soup in a Jupyter notebook. The tight coupling with `pydantic` and `logfire` means you can build production-grade agents without sacrificing transparency or traceability. And the fact that it's model-agnostic makes it feel more future-proof than vendor-tied SDKs.

That said, it's still early. You won't find a huge ecosystem of plugins or multi-agent orchestration primitives here (yet). But if you're a Python dev who wants a no-nonsense, clean interface to build well-structured LLM apps — without the ceremony of LangChain or the lock-in of cloud SDKs — this one’s a breath of fresh air.

PydanticAI isn’t trying to be everything. It’s trying to be *correct*. And in a space filled with over-promising agents, that’s a solid starting point.

---

### OpenAI's Agent SDK – Function-Calling and Tool Use Made Easy  

OpenAI basically *ignited* the agent craze when they introduced **function calling** in their API. Suddenly, you could get GPT-4 to output a JSON blob calling a function you defined, rather than a blob of natural language, [as announced in their API updates](https://openai.com/blog/function-calling-and-other-api-updates#:~:text=Developers%20can%20now%20describe%20functions,with%20external%20tools%20and%20APIs). This was more revolutionary than it sounds: it gave developers a reliable way to plug tools into the LLM's reasoning loop. OpenAI doesn't call this an "Agent SDK", but in practice it **is** the core of many agent frameworks: the LLM decides *if and when* to invoke a tool, and returns structured args for that tool, [making integration with external tools and APIs much easier](https://openai.com/blog/function-calling-and-other-api-updates#:~:text=Developers%20can%20now%20describe%20functions,with%20external%20tools%20and%20APIs). The developer just needs to define the tool's interface and provide a function to execute it. 

**Key features:**  
- *Orchestration via LLM:* The model itself does the decision-making to call functions. It's essentially the ReAct pattern built into the model – no complex prompting needed from your side. You describe functions in a schema (JSON Schema for parameters), and the AI will output a `function_call` when appropriate, [based on the function descriptions provided](https://openai.com/blog/function-calling-and-other-api-updates#:~:text=Developers%20can%20now%20describe%20functions,with%20external%20tools%20and%20APIs). 
- *Memory management:* Largely left to the developer. OpenAI's API maintains conversational state (you pass the dialogue history), but long-term memory (like retrieving past knowledge) isn't handled out-of-the-box. You'd integrate something like a vector store yourself if needed. The upside is flexibility; the downside is more plumbing on you. 
- *Tool use:* Extremely straightforward. Want your agent to have a calculator or make an HTTP request? Define a function for it (with a name and param spec), give the model a brief description, and the AI will include `\"function\": \"your_function_name\"` with args in its response when appropriate, [as detailed in their function calling guide](https://openai.com/blog/function-calling-and-other-api-updates#:~:text=Developers%20can%20now%20describe%20functions,with%20external%20tools%20and%20APIs). It *feels* like calling an API, except the AI is writing the API calls for you. 
- *Developer experience:* Arguably the simplest of all frameworks – you work directly with the OpenAI API, no third-party library abstraction required. It's just a couple of API calls. The trade-off is you don't get a pre-built planning loop; if the agent needs to do multiple steps (call tool A, then use result to call tool B, etc.), you have to write that loop (feeding the AI its own outputs in sequence). Higher-level SDKs can automate that loop, but many devs rolled their own thin wrapper.

**Code snippet:** Using OpenAI's function calling feels like giving GPT a toolbox and trusting it to know when to grab a hammer or wrench. Here's a flavor: 

```python
import openai

# Define a tool that the agent can use
weather_tool = {
  "name": "get_current_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {"type": "string", "description": "City name"},
      "unit": {"type": "string", "enum": ["celsius","fahrenheit"]}
    },
    "required": ["location"]
  }
}

# Ask the agent a question that might require the tool
messages = [{"role": "user", "content": "What's the weather in London in Fahrenheit?"}]
response = openai.ChatCompletion.create(
    model="gpt-4-0613",
    messages=messages,
    functions=[weather_tool]
)

assistant_message = response['choices'][0]['message']
if assistant_message.get("function_call"):
    func = assistant_message["function_call"]
    print("Agent decided to call function:", func["name"], "with args:", func["arguments"])
    # -> Agent decided to call function: get_current_weather with args: {"location": "London", "unit": "fahrenheit"}
``` 

In this snippet, GPT-4 sees a question about weather and **decides to call** `get_current_weather` on its own, returning the structured arguments. The developer would then execute the actual `get_current_weather` function (e.g., call a weather API) and feed the result back into GPT-4 to get a final answer. OpenAI's model has effectively become the orchestrator: it parses the user request, picks the right tool, and formats the call. This "model as orchestrator" approach is the essence of OpenAI's agent paradigm, [where the model orchestrates tool use based on developer-defined functions](https://openai.com/blog/function-calling-and-other-api-updates#:~:text=Developers%20can%20now%20describe%20functions,with%20external%20tools%20and%20APIs). 

**Opinion:** OpenAI's function-calling SDK hits a sweet spot – it's low-friction and leverages the intelligence of the model for orchestration. Many early agent experiments (think AutoGPT, etc.) were brittle hacks trying to get models to output actions; OpenAI formalized it and made agents far more reliable [by providing a structured way for models to interact with tools](https://openai.com/blog/function-calling-and-other-api-updates#:~:text=Developers%20can%20now%20describe%20functions,with%20external%20tools%20and%20APIs). On the flip side, because it's so minimal, you'll quickly reinvent wheels if you need advanced features (long-term memory, multi-agent dialogue, etc.). That gap has spawned a cottage industry of frameworks on top of OpenAI – like LangChain's agents (which wrap around function calling with extra bells and whistles) and others we'll discuss. 

Bottom line: **OpenAI's "agent SDK" = function calling + your creativity.** It's the de-facto baseline now. If a new agent framework doesn't significantly improve on it, devs often ask: why not just use OpenAI's API directly?

### Google's ADK – Agent Development, the Google Way  

[Google's Agent Development Kit (ADK)](https://google.github.io/adk-docs/) is an open-source framework designed for building and deploying AI agents. It offers flexibility and modularity, allowing integration with popular large language models (LLMs) and open-source generative AI tools. ADK emphasizes tight integration with the Google ecosystem, particularly Gemini models, facilitating the development of both simple and complex agent architectures.


**Key Features of ADK:**

- **Flexible Orchestration**: Utilize workflow agents like `Sequential`, `Parallel`, and `Loop` for predictable pipelines, or employ LLM-driven dynamic routing with `LlmAgent` for adaptive behaviors.
- **Multi-Agent Architecture**: Compose modular and scalable applications by integrating multiple specialized agents in a hierarchical structure, enabling complex coordination and delegation.
- **Rich Tool Ecosystem**: Equip agents with diverse capabilities using pre-built tools (e.g., Search, Code Execution), custom functions, third-party libraries (such as LangChain, CrewAI), or even other agents as tools.
- **Deployment Ready**: Containerize and deploy agents across various environments, including local setups, Google Cloud's Vertex AI Agent Engine, Cloud Run, or custom infrastructures using Docker.
- **Built-in Evaluation**: Systematically assess agent performance by evaluating both the final response quality and the step-by-step execution trajectory against predefined test cases.


**Example: Weather lookup tool**

Here's a basic example of setting up an ADK agent with a weather lookup tool:

```python
# Define the weather tool
def get_weather(city: str) -> dict:
    """Retrieves the current weather report for a specified city."""
    mock_weather_db = {
        "london": {"status": "success", "report": "Cloudy with a temperature of 15°C."},
        "newyork": {"status": "success", "report": "Sunny with a temperature of 25°C."},
        "tokyo": {"status": "success", "report": "Light rain with a temperature of 18°C."},
    }
    city_normalized = city.lower().replace(" ", "")
    return mock_weather_db.get(city_normalized, {"status": "error", "error_message": f"No data for '{city}'."})

# Define the agent
from google.adk.agents import Agent

weather_agent = Agent(
    name="WeatherAgent",
    tools=[get_weather],
    prompt="You are a helpful assistant that provides weather information."
)

# Run the agent
response = weather_agent.run("What's the weather in London?")
print(response)
```

**Opinion**: ADK stands out as a robust framework for AI agent development, offering a blend of flexibility and integration with Google's ecosystem. With ADK’s modular design and the introduction of the [Agent2Agent (A2A) protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/), we’re stepping into an era where agents can interoperate across systems, enhancing their collective capabilities. Its ADK's modular design caters to both novices and experienced developers, facilitating the creation of agents ranging from simple to complex. The inclusion of built-in evaluation tools and deployment options like Vertex AI Agent Engine and Cloud Run further enhances its appeal. For those invested in the Google Cloud platform and seeking a comprehensive solution for AI agent development, ADK presents a compelling choice.


### SmolAgents – Minimalist DIY Agents that "Just Work"  

SmolAgents are part of a rising movement that’s less “framework” and more “philosophy.” They embrace minimalism, clarity, and the idea that you don't need a complex runtime to build an intelligent, useful agent. The most prominent of these is [smol-developer](https://github.com/smol-ai/developer), a GPT-4-powered "junior developer" that can scaffold entire projects from a prompt, fix bugs, or generate modules on the fly.

Born from community hacking culture, SmolAgents are intentionally small, composable, and hackable. You can usually read the whole codebase in one sitting — and that’s a feature, not a bug.

**Key Features:**

- **Prompt-Oriented Logic Loops:** The control flow is often just a loop with natural language as the core decision-making interface. The LLM gets prompted with a task, responds with an action, and the loop either executes it or asks for a revision. No need for complex graphs or agents managing agents.
- **Code as Memory:** Rather than vector DBs and memory layers, many SmolAgents use the file system directly. Write code, read it back. It’s simple, dumb, and surprisingly powerful — especially with the context window sizes of today’s LLMs.
- **Composable by Fork:** Want a SmolAgent to do something new? Fork the repo, add a tool or prompt tweak, done. This is closer to the “scripts” ethos of early Linux culture than the managed frameworks of today.
- **Zero-Latency Setup:** No API orchestration layer, no infra boilerplate. Just install the deps, run the script, and you have a working agent. Most smol agents are under 500 lines of Python.

**Example: Searching and Answering**

```python3
from smolagents import CodeAgent, DuckDuckGoSearchTool, HfApiModel

model = HfApiModel()
agent = CodeAgent(tools=[DuckDuckGoSearchTool()], model=model)

agent.run("How many seconds would it take for a leopard at full speed to run through Pont des Arts?")
```

**Opinion:** SmolAgents are the punk rock of the agent world. They don’t care about Kubernetes, dependency injection, or cloud orchestration. They boot up with a shebang and a dream. They trade structure for speed, layers for legibility, and abstraction for agency — yours, not the AI’s. Of course, this comes at a cost. These agents don’t scale neatly. They break if you change too much. They don’t care about your observability stack. But they’re honest. You can grep your way through their logic.

For side projects, hacks, or workflows where overengineering would kill momentum — SmolAgents are a breath of fresh air. They're not trying to be everything to everyone. They’re trying to be **yours**. And in a world full of opinionated frameworks and black-box orchestration layers, that’s surprisingly rare. If nothing else, SmolAgents remind us that sometimes, **an agent doesn’t need to be smart — just helpful, cheap, and ready to go**.

In the long term, I suspect some of these minimalist ideas will get absorbed into larger frameworks (for example, offering a "quickstart mode" that just runs a fixed loop for a given task). But if the major frameworks become too complex or restrictive, you can bet the community will respond with another wave of smol, purpose-built agents. It's a cycle of innovation: scrappy simplicity versus structured complexity. 

--- 

### AWS's Multi-Agent Orchestrator – Agents-as-a-Service (Enterprise Edition)  

Leave it to Amazon AWS to take a trend and offer it as a fully-managed service. AWS's entry is **Amazon Bedrock Agents**, essentially a multi-agent orchestrator in the cloud. If Pydantic and SmolAgents are beloved by hackers, and OpenAI/Google SDKs by developers, AWS is aiming squarely at enterprise teams that say "just give me a service that handles this agent stuff." With Bedrock Agents, a lot of the heavy lifting is abstracted away: you configure the agent's capabilities and endpoints, and AWS handles running the show behind a nice API. 

**Key features:**  
- *Fully managed orchestration:* An AWS Bedrock agent is an orchestrator that sits between the user, the foundation model, and your business logic. It will automatically **break down tasks, call APIs, and query knowledge bases** as needed to fulfill a user's request [by automating task execution across systems](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=Amazon%20Bedrock%20Agents%20offers%20you,generative%20AI%29%20applications) and [breaking down complex requests into smaller steps](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=,must%20perform%20into%20smaller%20steps). Basically, it's AWS's predefined "brain" that knows how to use tools you give it. You don't worry about the planning algorithm – AWS has one built-in. 
- *"Bring your own tools" (Action Groups):* You configure something called an **Action Group** – a set of APIs or functions the agent can call. For example, you might register an "OrderPizza" API and a "TrackDelivery" API for an agent that handles food orders. The Bedrock agent is aware of these actions and will invoke them when appropriate during conversation, [as defined in the action group configuration](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=2,one%20of%20the%20following%20components). You define these via configurations, not code, in typical AWS fashion (likely a JSON or YAML spec, or through the AWS Console forms). 
- *Knowledge base integration:* If your agent needs domain knowledge (say a corpus of internal documents or a database), you can attach a **knowledge base**. This could be an index of documents (managed by Amazon Kendra or similar) that the agent will automatically query when needed [to answer user questions or ground its responses](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=,a%20user%20through%20natural%20conversation), based on [the attached knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=2,one%20of%20the%20following%20components). For instance, an agent answering customer support questions can pull answers from a company policy doc if the user asks something detailed. AWS handles the retrieval-augmented generation under the hood. 
- *Managed memory and prompting:* One very interesting promise – "you don't have to … write custom code. Amazon Bedrock manages prompt engineering, memory, monitoring, encryption, ..." [automating many operational aspects of agent deployment](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=With%20agents%2C%20you%20can%20automate,user%20permissions%2C%20and%20API%20invocation). In other words, the agent service takes care of maintaining conversation context (short-term memory) and possibly stores long-term interactions. It likely handles formatting prompts for the underlying model (so you don't manually craft system prompts for every tool invocation). Monitoring and tracing are built in – AWS provides logs/traces of the agent's decisions at each step, [providing visibility into its behavior](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=4,behavior%20%20and%20%208). This is a big deal for enterprises that need observability and auditability. 
- *Multi-agent orchestration:* The name "Agents" (plural) hints that AWS expects you might deploy multiple agents for different tasks and have them interoperate. While their user guide focuses on a single agent handling a task, it's easy to imagine using Bedrock to host a *fleet* of agents (e.g., one per department in a company). There isn't an explicit mention of AWS agents talking to each other, but since they can all be accessed via API, a higher-level orchestrator (maybe another Bedrock agent!) could coordinate them. Very microservice-like. 

**Using Bedrock Agents:** Suppose a company wants a "Travel Agent" AI for employees. In Bedrock, they'd create an agent configuration with actions: `BookFlight`, `BookHotel` (each mapped to internal APIs), and attach a knowledge base of travel policy PDFs. They might tweak the agent's prompt templates (AWS lets you edit the pre-processing and post-processing prompts to tune how it converses [by modifying the underlying prompt templates](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html#:~:text=agent%20with%20knowledge%20base%20)). Then they deploy it. Now an employee can chat with this Travel Agent via an API endpoint or AWS's console: "I need to fly to NYC on Aug 5 and return Aug 10, and book a hotel near the office." The Bedrock agent will: break this into sub-tasks, call `BookFlight` with appropriate parameters, call `BookHotel`, possibly refer to the travel policy KB to warn if any choice is non-compliant, and then respond with the booked itinerary. All of this happens behind the scenes – from the developer perspective, they just see a nice JSON response from the agent with the results. Magic? Kinda. But it's the result of a lot of baked-in orchestration logic courtesy of AWS.

**Opinion:** AWS's pitch is essentially **"Agents-as-a-Service."** For organizations that don't want to maintain custom agent code and deal with LLM quirks, this is very appealing. The service handles scaling (no need to think about which model or how to load balance calls – AWS does it), **observability** (every step can be traced in CloudWatch, presumably), and security (integrating with AWS IAM, encryption, etc., which is non-trivial to DIY). It's a different target user: more DevOps and enterprise architects than tinkerers. 

The trade-off is flexibility. You're operating within AWS's paradigm – maybe your agent can only do what their orchestration allows. If you want a totally new reasoning strategy, you can't easily customize that. Also, you're tied to AWS's choice of foundation models (Bedrock offers AWS's Titan, plus licensed Anthropic/AI21/StableLM models). If the best model for your task isn't on Bedrock, too bad. 

One concern: **fragmentation by cloud**. Just as we have cloud-specific ML platforms, we might get cloud-specific agent frameworks that don't play nice with each other. An AWS agent might have one format for interactions, a Google agent another, etc. If you switch providers, you may have to rebuild your agents. These are early days though – perhaps standards will emerge (or Open Source frameworks will act as a layer above to abstract cloud differences). 

To sum up, AWS's Multi-Agent Orchestrator is **powerful but somewhat closed**. It embodies the classic AWS approach: heavy lifting done for you, with configuration dials to tune it. It will likely spur adoption of agent tech in enterprises (who trust AWS), accelerating the overall ecosystem. And if you're an indie dev? Well, you probably won't be spinning up Bedrock Agents for a side project – you'll stick to the lighter tools. And that's fine; there's a clear segmentation happening: from smol to huge, there's an agent framework for everyone. 

---

## Beyond Frameworks – Emerging Trends and Paradigms  
![Multi-agent systems and future trends in AI agent communication protocols beyond single-framework architectures](/images/blog/agent-frameworks/beyond-frameworks.webp)

Even as these frameworks compete, several cross-cutting **trends** are shaping the future of AI agents:

- **Standardizing Agent Communication:** Just as APIs had to be standardized for microservices to talk, agents will need common languages to interact. Google's aforementioned *Agent2Agent protocol* is one attempt – envision a JSON-based or DSL-based message format that any compliant agent can understand. Similarly, Anthropic has hinted at a *Multi-Agent Communication Protocol (MCP)* – a set of guidelines for how AI agents should exchange information and requests. The goal is interoperability: your scheduling agent could call my shopping agent with a request, even if they were built by different companies, and they'd understand each other. It's like defining the "HTTP for agents." These efforts are in early stages, but if successful, they could **break down walled gardens** and allow an ecosystem where specialized agents form an ad-hoc assembly line to accomplish complex tasks. (It also raises fascinating questions: will there be *agent SEO* to make your agent more likely to be invoked by others? That's one way to drive usage in an economy of agents…)

- **Multi-Agent Collaboration and Social Dynamics:** We're moving beyond single-player agents to scenarios with *multiple agents collaborating or even competing*. Microsoft's **Autogen** framework explicitly focuses on multi-agent conversations – e.g., an Assistant agent and a User agent chatting to solve a problem, observed or guided by a human, [as supported by frameworks like Microsoft's Autogen](https://github.com/microsoft/autogen#:~:text=AutoGen). This harkens back to AI research on self-play and debate, but now applied to general tasks. Early experiments (such as two GPT-4s role-playing developer and debugger, or one agent as a teacher and another as a student) show that agents can feed each other information and verify each other's outputs. Frameworks need to support things like messaging channels, termination conditions, and roles. Expect to see more "agent teams" solving tasks – analogous to how microservices form a distributed system. Multi-agent systems introduce complexity (you might get chatter or infinite loops of agents talking in circles if not managed), but also robustness (two agents can double-check each other). It's a growing area of both research and product.

- **The "Economy of Agents":** Here's a futuristic (but increasingly plausible) idea – what if we treat AI agents as **economic actors** providing services to each other? Each agent could be a microservice that does one thing (image generation, data fetching, specialized expertise) and charges a tiny fee for doing it. When a complex task comes in, an orchestrator agent might compose several services, each "paid" per use. This concept would likely ride on **micropayments** and possibly blockchain for settlement. We're already seeing glimmers: there are startups talking about "marketplaces" where your AI agent can rent an API from another agent on the fly. Blockchain folks have talked about *autonomous economic agents* for years – programs that hold crypto wallets and trade services for tokens. If that merges with LLM agents, we might literally have bots negotiating and contracting work from each other. For example, your personal AI wants a custom jingle for your birthday – it finds a music-composer agent on a marketplace, pays it $0.50, and gets a jingle. All automated. This is speculative, but technically feasible with today's tech (given reliable agent communication and secure payment infrastructure). Projects like Fetch.ai have been exploring this vision of agents + crypto for a while, and we might see mainstream analogues if the "agent economy" takes off.

- **Verifiable and Trustworthy Agents:** As agents start making decisions (some with real-world impact), the need for **verification** and trust grows. If an agent says "I've executed the trade" or "the customer agreed to the terms", how do we *trust* that it actually did so, and that the content wasn't tampered with? This is where ideas like using blockchain or secure enclaves come in – an agent's actions could be logged immutably on a ledger for audit, or signed with cryptographic keys. Decentralized networks might ensure an agent can prove it performed a certain computation or API call without alteration. This area is nascent, but important for applications like legal contracts, finance, or any scenario where an agent's word needs to be as good as a signed document. We might see frameworks incorporate verification layers – e.g., an agent action that executes a contract also produces a cryptographic proof of execution. It sounds heavy, but it might be necessary for high-stakes deployments. 

All these trends point to a future where **agents are first-class actors in software systems**, much like microservices are today. The difference is agents can handle ambiguity and converse in natural language, opening up new interactions. But with great power comes great… need for standards and governance. It's no longer just an API call, it's a semi-autonomous decision-maker – which is both exciting and a bit scary.

---

## A Forward-Looking Conclusion (Opinionated as Charged)  
![Summary of AI agent framework landscape showing the trade-offs between simplicity, power, and vendor lock-in](/images/blog/agent-frameworks/conclusion.webp)

We're in the early days of a potential paradigm shift. Today's AI agents are somewhat gimmicky – fun auto-GPT demos, customer support bots that are a notch above chatbots. But the **trajectory** is clear: we are adding an *agent layer* on top of the AI models. And that layer could be as disruptive as the move from on-prem software to the cloud, or from monolith to microservices. Why? Because it **changes who/what writes and executes code.** Agents blur the line between software and operator – they *are* software that *operates* other software. Once matured, an agent can spin up new services on the fly, negotiate APIs, and potentially improve itself. This is software eating software.

The fragmentation we're seeing now is typical of a nascent field. Each framework – Pydantic, OpenAI's functions, Google's ADK, smol whatever, AWS's managed service, LangChain, AutoGen, etc. – is experimenting with different answers to the core questions: How should agents reason? How should they remember? How do they talk to tools and to each other? It's messy, but out of this mess will emerge common best practices and maybe a couple dominant frameworks or standards (just like TensorFlow vs PyTorch eventually converged some ideas, or Kubernetes emerged for containers). In fact, I'll wager that within 2-3 years, we'll have **agent standard libraries** as ubiquitous as web frameworks. Perhaps one open-source project (maybe [LangChain](https://github.com/hwchase17/langchain#:~:text=LangChain%20is%20a%20framework%20for,party%20integrations%20to%20simplify) or its successor) becomes the go-to for general agent development, while each cloud offers tight integration for enterprise. The others will either specialize or fade. The current fragmentation **will** consolidate – engineers won't tolerate half a dozen incompatible agent systems for long.

**How fast will this happen?** Faster than the original AI platform wave, I suspect. The big players are all-in: OpenAI, Google, Microsoft, AWS – they see agentic AI as the next value layer. The community is vibrant, pumping out new prototypes weekly (if not daily). With so much investment, both intellectual and financial, the capabilities of agents are increasing rapidly. What was a brittle hack in early 2023 is a managed cloud service by late 2024. We might reach a point where for many software tasks, you just specify the goal and let an agent figure out the rest (using whichever framework). This could upend how software is developed and used – imagine users orchestrating agents with natural language, effectively "programming without programming." It's both awesome and a bit terrifying for us developers.

**Why it could be more disruptive than the LLM model race:** The LLMs (GPT-3, 4, Claude, PaLM, etc.) are foundational, but they're also becoming commoditized in a way – many capable models exist and will be integrated. The agent layer is where **integration and automation** happen. It is closer to the end-user and business logic. Whomever controls the agent orchestration layer could become as important as the cloud providers of today. It's a land grab not just for providing AI capabilities but for providing *automation of any task*. Every software application could be disrupted: a user might prefer a generalist agent that can do *all the things* over separate apps – *if* that agent is smart and reliable enough. That's a big if, but one that's shrinking by the month.

In conclusion, expect a continued flurry of frameworks and acronyms in the near term – enjoy the creativity of this phase, but also look for the patterns that last. My bet: **the future of computing looks more like an "economy of agents" and less like static apps.** In that future, today's fragmented frameworks will seem like the diverse dialects that eventually influenced a lingua franca. And as always in tech, the victors will be those who balance visionary leaps with practical developer experience. 

We're watching the sausage get made right now, and it isn't always pretty – but it's certainly fascinating (and occasionally rant-worthy). Stay tuned, keep experimenting, and don't get too attached to any one agent paradigm just yet. The only constant in this space is rapid change. In the meantime, whether you go with a fully managed orchestrator or a "smol" DIY script, may your agents be ever in your favor – and may they actually do what you *intended*, not just what you *said*. 😉

---
