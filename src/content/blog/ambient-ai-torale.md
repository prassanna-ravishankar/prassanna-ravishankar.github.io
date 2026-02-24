---
title: "Ambient AI: Building Torale from Complexity to Simplicity"
description: "Torale monitors the web so you don't have to. How ambient AI turns passive monitoring into proactive intelligence — and how Gemini made it possible."
pubDate: 2025-11-17
heroImage: "/images/blog/ambient-ai-torale/hero.webp"
series: ["AI Agents", "Productivity"]
topics: ["Torale", "Gemini", "Claude Code", "Grounded Search", "autonomous AI agents"]
author: "Prassanna Ravishankar"
draft: false
---

## A bit of history: The Information Access Problem

> In the beginning, there were libraries.

The evolution of information access is a story of increasing speed and decreasing friction. Physical card catalogs gave way to digital databases. [Yahoo's human-curated directory](https://en.wikipedia.org/wiki/Yahoo!_Directory) evolved into [Google's algorithmic search](https://en.wikipedia.org/wiki/PageRank). We moved from visiting libraries to querying the web from anywhere.

But search engines solved a different problem than the one we face today. They answered: *"How do I find information when I know I need it?"* The modern problem is: *"How do I know when information I care about exists?"*

This spawned a generation of alert and monitoring tools. [Google Alerts](https://www.google.com/alerts) (launched 2003) promised to email you when new content matched your keywords. [RSS feeds](https://en.wikipedia.org/wiki/RSS) (1999) let you subscribe to content streams. Social media platforms added notification systems. [IFTTT](https://ifttt.com/) (2010) and [Zapier](https://zapier.com/) (2011) enabled automation across services.

Yet none of these solved the core problem: **the cognitive overhead of constant checking**. Google Alerts spam you with false positives—every mention of "GPT" including crypto scams and Reddit speculation. RSS readers pile up hundreds of unread items. Twitter lists require manual checking. You optimize your compulsive behavior, but you don't eliminate it.

The pattern is clear: we're spending mental energy on a fundamentally stupid problem. Not "is there an answer?" but "checking if there's an answer yet." This is the problem of *non-ambient information*—data that exists but doesn't reach you until you actively seek it.

## Phase 1: V1 - When Complexity Kills (February-May 2025)

I started building Torale (originally called "AmbiAlert") in February 2025 to scratch an itch: create a monitoring platform that could watch the web and notify you intelligently. I [livestreamed the concept](https://www.linkedin.com/posts/the-nomadic-coder_live-coding-bringing-an-idea-to-life-lets-activity-7293735353964793856-4G-j)—a system that would understand what you cared about and tell you only when it mattered.

The V1 architecture was classically overengineered:

**The Stack:**
- Custom web scrapers for different content types
- [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) and [Selenium](https://www.selenium.dev/) for parsing
- [ChromaDB](https://www.trychroma.com/) vector database for embeddings
- [Retrieval-Augmented Generation (RAG)](https://arxiv.org/abs/2005.11401) pipeline
- Custom prompt engineering for extraction
- State management for change detection

**The Problems:**

Web scraping is fundamentally brittle. Modern websites deploy anti-bot measures—[Cloudflare](https://www.cloudflare.com/learning/bots/what-is-bot-management/), [reCAPTCHA](https://www.google.com/recaptcha/about/), dynamic JavaScript rendering, rate limiting. When sites update their HTML structure, scrapers break. Maintaining parsers for dozens of different site layouts is a maintenance nightmare that scales poorly.

The RAG pipeline added complexity without solving core issues. Embedding models ([OpenAI's text-embedding-3](https://platform.openai.com/docs/guides/embeddings), [Sentence Transformers](https://www.sbert.net/)) required careful chunking strategies. Vector search ([FAISS](https://github.com/facebookresearch/faiss), [Pinecone](https://www.pinecone.io/)) needed tuning. Context window management for LLMs required orchestration logic.

Most critically: **V1 solved the wrong problem**. I was building infrastructure to make scraping and RAG work, when what I needed was a simpler way to access fresh web data with intelligent evaluation.

By May 2025, V1 was abandoned. Too complex, too fragile, too much maintenance overhead for too little value.

## The Unlock: Google's Grounded Search API

In October 2024, [Google announced grounding with Google Search for the Gemini API](https://techcrunch.com/2024/10/31/googles-gemini-api-and-ai-studio-get-grounding-with-google-search/). This feature allows Gemini models to access real-time search data and cite sources—effectively collapsing the entire "web access + evaluation" problem into a single API call.

**How Grounded Search Works:**

Instead of maintaining scrapers and RAG infrastructure, grounded search provides:

1. **Fresh Data Access**: Direct integration with Google Search index
2. **LLM Evaluation**: The model analyzes results and answers questions
3. **Source Attribution**: Citations to original sources with URLs
4. **Structured Outputs**: The model returns both answers and grounding metadata

From the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/grounding):

```python
import google.generativeai as genai

model = genai.GenerativeModel("gemini-2.0-flash-exp")
response = model.generate_content(
    "When is the next iPhone being released?",
    tools="google_search_retrieval"
)

# Returns structured response with:
# - answer: "September 12, 2024 announcement confirmed"
# - grounding_sources: [{"uri": "...", "title": "..."}]
# - reasoning: Natural language explanation
```

**Technical Comparison:**

| Approach | Components | Failure Modes | Maintenance |
|----------|-----------|---------------|-------------|
| **V1 (Scraper + RAG)** | Web scraper + Parser + Embeddings + Vector DB + LLM | Site changes, anti-bot, parsing errors, embedding drift | High - constant updates needed |
| **V2 (Grounded Search)** | Single API call to Gemini | API rate limits, model hallucination | Low - Google maintains search access |

The complexity collapse was dramatic. What required hundreds of lines of scraping logic, error handling, and retry mechanisms became a single API parameter: `tools="google_search_retrieval"`.

**Gemini 2.5 Context:**

[Gemini 2.5 was released](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/) in March-April 2025 with enhanced reasoning capabilities and a longer context window (up to 1 million tokens). Initially, I thought a monitoring-specific model would be better for this use case, but the general-purpose Gemini 2.5 with grounding proved sufficient.

## Phase 2: V2 - Simplicity Wins (June 2025)

In June 2025, I made the decision to throw away V1 entirely and rebuild with Gemini 2.5's grounded search as the foundation. This wasn't iteration—it was a complete architectural reset.

**The V2 Architecture:**

The core insight was to embrace simplicity. Instead of building infrastructure, leverage APIs that already work.

**Key Technology Decisions:**

**[Temporal](https://temporal.io/) for Orchestration**  
Temporal provides durable execution—workflows that survive process restarts, handle retries automatically, and maintain state reliably. For scheduled monitoring tasks that run indefinitely (potentially for months or years), durable execution is critical. From [Temporal's documentation](https://docs.temporal.io/workflows):

> "A Workflow Execution is a durable, reliable, and scalable function execution. It is the main unit of execution in Temporal."

This meant I could schedule monitoring tasks with cron expressions and trust they'd execute reliably without building my own job queue, retry logic, or failure recovery.

**[PostgreSQL](https://www.postgresql.org/) with [Alembic](https://alembic.sqlalchemy.org/)**  
Self-hosted PostgreSQL gave me full control over data, with Alembic managing database migrations as code. Each schema change is versioned, reversible, and auditable—critical for a rapidly evolving product.

**[Clerk](https://clerk.com/) for Authentication**  
Don't build what you shouldn't build. Clerk handles OAuth (Google, GitHub), email/password auth, session management, and webhooks for user lifecycle events. This is infrastructure that adds zero differentiation but requires significant maintenance if built in-house.

**Python SDK with Fluent API**  
Developer experience matters. The SDK follows a [fluent interface pattern](https://en.wikipedia.org/wiki/Fluent_interface) for readability:

```python
from torale.sdk import ToraleClient

client = ToraleClient(api_key="sk_...")

# Create a monitor with natural language flow
task = client.tasks.create(
    name="GPT-5 Release Monitor",
    schedule="0 9 * * *",  # Cron: daily at 9 AM
    search_query="When is GPT-5 being released?",
    condition_description="A specific release date has been announced",
    notify_behavior="once"  # Alert once, then auto-disable
)
```

**State Management Patterns:**

Torale implements three notification behaviors to handle different monitoring scenarios:

- `once`: Notify when condition first met, then auto-disable. Use for: product launches, one-time events.
- `always`: Notify every time condition is met. Use for: stock availability (might come and go).
- `track_state`: Notify only when the underlying state changes. Use for: price tracking, status monitoring.

This maps to the [Finite State Machine pattern](https://en.wikipedia.org/wiki/Finite-state_machine) where state transitions trigger notifications, not just state values.

**The Flow:**

With V2's simple architecture, I found flow immediately. Building through the summer and fall of 2025, the platform took shape: scheduled task execution via Temporal, LLM-based condition evaluation via Gemini grounded search, state tracking in PostgreSQL, notifications ready to implement.

## Phase 3: Velocity at Scale (November 5-16, 2025)

![Development velocity timeline showing rapid feature shipping from November 5-16, 2025](/images/blog/ambient-ai-torale/velocity.webp)
*20+ features shipped in 10 days—AI-accelerated development in action.*

On November 5, 2025, I shipped Torale V2. What happened next was a case study in AI-accelerated development.

**The Timeline:**
- **November 5**: V2 goes live with core monitoring functionality
- **November 5-16**: Shipped 20+ additional features in 10 days

**Features Shipped:**
- Python SDK with fluent API design
- Email notifications via [Novu](https://novu.co/) cloud service
- Webhook notifications with [HMAC-SHA256](https://en.wikipedia.org/wiki/HMAC) signing
- Mobile-responsive admin console
- Research harness comparing different search approaches
- Task templates for common use cases
- Landing page redesign
- Public changelog with [PR links](https://torale.ai/changelog)

**How This Was Possible:**

In my [previous post on Claude Code](https://prassanna.io/blog/reflections-claude-code/), I documented spending a month building with AI assistance and becoming "more productive but worse at programming." Torale is the primary artifact from that month.

Claude Code enabled rapid feature development, but velocity without quality is just technical debt. The guardrails that made this sustainable:

**CI/CD Pipeline:**
- [GitHub Actions](https://github.com/features/actions) for automated testing on every commit
- [Trivy](https://github.com/aquasecurity/trivy) security scanning for container vulnerabilities
- Automated deployment to [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine)
- [Alembic](https://alembic.sqlalchemy.org/) migrations running in init containers before deployment

**The Pattern:**

Claude Code gives speed. CI/CD gives confidence. Together, you can ship fast without breaking everything. Every feature that shipped went through automated testing and security scanning before reaching production.

**Open Source from Day One:**

The entire Torale codebase is [open source on GitHub](https://github.com/prassanna-ravishankar/torale)—backend, frontend, infrastructure configs, deployment scripts. Building in the open means:

- Public [changelog](https://torale.ai/changelog) with PR links for every feature
- Transparency about what works (and what doesn't)
- Community contributions welcome
- No vendor lock-in for users

**Early User Feedback:**

Friends and family became early users. Their feedback shaped product direction:
- **What resonated**: Concrete use cases ("tell me when iPhone is announced") over vague promises ("monitor anything")
- **What mattered**: Notification reliability, false positive rates, setup friction
- **The meta moment**: I used AI to process feedback from Slack/email and generate prioritized GitHub issues. Building an AI product with AI, debugging with AI, managing the roadmap with AI. It's recursive all the way down.

## Post-Ship: Evaluation and Learning

After V2 shipped and was stable in production, I casually tested alternative search approaches to validate the Gemini choice.

**Evaluation Methodology:**

Built a research harness with 17 test cases spanning different query types:
- Product releases: "When is the next iPhone being released?"
- Availability: "Is PS5 in stock at Best Buy?"
- Events: "When do pool memberships open for summer?"
- Binary facts: "Has Twitter rebranded to X?"
- Prices: "Is Bitcoin above $100k?"

Each test case includes:
- Search query
- Condition description
- Expected outcome (true/false)
- Use case category

**Results:**

| Approach | Accuracy | Avg Tokens | Avg Latency | Notes |
|----------|----------|------------|-------------|-------|
| **Gemini 2.5** | 60% | ~750 | ~3.4s | Fast, cheap, already in production |
| **[Perplexity](https://www.perplexity.ai/)** | 80% | ~800 | ~9s | Best accuracy, reasonable cost |
| **[OpenAI Web Search](https://openai.com/index/introducing-chatgpt-search/)** | 70% | ~14,500 | ~28s | High token cost, slower |

**Why Stay with Gemini?**

Despite Perplexity's superior accuracy, Gemini 2.5 was "good enough" for several pragmatic reasons:

1. **Already in Production**: V2 shipped with Gemini, it worked, users were getting value
2. **Cost**: 750 tokens vs 14,500 tokens is ~19x cheaper per query at scale
3. **Latency**: 3.4s vs 28s matters for user experience
4. **Integration**: Native Google API, no additional vendor relationship

**The Ground Truth Challenge:**

Evaluating search quality is harder than it sounds. Unlike supervised learning with labeled datasets, grounded search has no perfect ground truth. A query like "When is GPT-5 being released?" might be:
- Officially announced (true positive)
- Leaked but unconfirmed (ambiguous)
- Pure speculation (false positive)

The 17 test cases provide a directional signal, not an absolute measure. Real validation comes from production usage and user feedback.

**The Pragmatic Philosophy:**

Ship first with something that works. Optimize later based on actual user problems, not theoretical improvements. If Gemini's 60% accuracy becomes a production issue, the architecture supports swapping models—the abstraction is there.

## The Product: How Torale Works

At its core, Torale is a focused agent that does one thing: autonomously watch the web so you don't have to.

**End-to-End Flow:**

1. **Task Creation**: User defines what to monitor and when
2. **Scheduling**: Temporal creates a durable cron schedule
3. **Execution**: At scheduled time, Temporal triggers workflow
4. **Search**: Gemini performs grounded search with fresh data
5. **Evaluation**: LLM analyzes results against condition
6. **State Tracking**: Compare with `last_known_state` for changes
7. **Notification**: If condition met (and notification rules satisfied), send alert
8. **State Update**: Store new state for next execution

**Example - Monitoring Product Launches:**

```python
from torale.sdk import ToraleClient

client = ToraleClient(api_key="sk_...")

# Monitor for GPT-5 announcement
task = client.tasks.create(
    name="GPT-5 Release Monitor",
    schedule="0 9 * * *",  # Check daily at 9 AM UTC
    search_query="GPT-5 release date announcement OpenAI",
    condition_description="OpenAI has officially announced a release date for GPT-5",
    notify_behavior="once",  # Alert once when announced, then stop
    config={
        "model": "gemini-2.0-flash-exp",
        "grounding": True
    }
)

print(f"Created task: {task.id}")
print(f"Next execution: {task.next_run_time}")
```

**Use Case Taxonomy:**

Torale works well for queries where:
- Information changes infrequently but you need to know immediately
- Manual checking is tedious but critical
- False negatives are worse than false positives
- You can express the condition in natural language

**Examples:**
- **Product Launches**: Tech releases, game announcements, book publications
- **Stock Availability**: Limited items, event tickets, appointment slots
- **API Changes**: Breaking changes in dependencies, deprecation notices
- **Regulatory Updates**: Policy changes, compliance deadlines
- **Research**: Paper publications, dataset releases, conference announcements

**What Doesn't Work:**
- Real-time requirements (< 1 minute updates)
- Highly ambiguous conditions that even humans can't judge consistently
- Content behind paywalls or authentication
- Extremely niche queries with no web presence

**Developer Experience Philosophy:**

The SDK prioritizes clarity over cleverness. The API is self-documenting:

```python
# Clear, explicit parameters
client.tasks.create(
    name="Descriptive task name",  # Shows in UI
    schedule="0 9 * * *",  # Standard cron
    search_query="Natural language search",  # What to search
    condition_description="When to notify",  # Clear condition
    notify_behavior="once|always|track_state"  # Explicit behavior
)
```

Compare this to a hypothetical "clever" API:

```python
# Harder to understand
client.monitor("iphone release").when("announced").once()
```

The explicit version has more characters, but it's immediately clear what each parameter does and what values are valid.

## Future Directions: Private Data Sources

![Conceptual diagram showing public web sources and private data sources (Gmail, Slack, GitHub) feeding into ambient AI monitor](/images/blog/ambient-ai-torale/future-data-sources.webp)
*The vision: ambient AI monitoring both public web and private data sources.*

Right now, Torale watches the **public web**. But the pattern is bigger.

**The Vision:**

Your information is fragmented across dozens of tools—email, Slack, Google Drive, GitHub, Notion, Linear. You're still the integration layer, manually checking each service. AI could make **all your information ambient**.

**Technical Pattern Extension:**

The same pattern that works for public web search can extend to private data:

1. **Search** → Connect to data source (Gmail API, Slack API, Drive API)
2. **Evaluate** → LLM understands context and evaluates conditions
3. **Notify** → Alert only when it matters

**Example Use Cases:**

```python
# Gmail integration (future)
client.tasks.create(
    name="Contract Reply Monitor",
    data_source="gmail",
    search_query="Emails from legal@acme.com with subject containing 'contract'",
    condition_description="They've replied with approval",
    notify_behavior="once"
)

# Slack integration (future)
client.tasks.create(
    name="Pricing Discussion Alert",
    data_source="slack",
    channels=["#sales", "#product"],
    search_query="Messages discussing pricing changes",
    condition_description="New pricing is being proposed",
    notify_behavior="track_state"
)

# GitHub integration (future)
client.tasks.create(
    name="Dependency Breaking Change",
    data_source="github",
    repository="facebook/react",
    search_query="Issues or PRs labeled 'breaking change'",
    condition_description="A breaking change affects my codebase",
    notify_behavior="always"
)
```

**The Technical Challenges:**

**OAuth and Permissions:**  
Each data source requires OAuth flows, permission scopes, and token refresh logic. [Google Workspace APIs](https://developers.google.com/workspace), [Slack API](https://api.slack.com/), and [GitHub REST API](https://docs.github.com/en/rest) each have different authentication patterns.

**RAG for Private Data:**  
Unlike public web search, private data requires building search infrastructure. [Vertex AI Search](https://cloud.google.com/generative-ai-app-builder/docs/enterprise-search-introduction) or [Elasticsearch](https://www.elastic.co/elasticsearch/) for document indexing, embeddings for semantic search, and LLM evaluation for condition checking.

**Privacy and Trust:**  
When AI monitors your email and Slack, trust becomes paramount:
- Data residency: where is data processed and stored?
- Encryption: at rest and in transit
- Access controls: who can see what
- Audit logs: tracking all data access
- Deletion: right to be forgotten

**The Ambient Intelligence vs Surveillance Question:**

There's a fine line between "helpful watcher" and "creepy monitor." When AI has access to all your private data, the questions become:
- Who controls the AI? (You vs the platform)
- Where does data processing happen? (On-device vs cloud)
- Can you audit what the AI knows? (Transparency)
- How long is data retained? (Compliance)

These aren't just technical questions—they're ethical and legal ones that will shape how ambient AI develops.

**Who Gets Access?**

Currently, Torale requires:
- API key management (developer workflow)
- Understanding of cron syntax
- Command-line or SDK comfort

This limits access to engineers. True ambient AI should be accessible to everyone:
- Natural language scheduling: "Check every weekday morning"
- Visual condition builders: drag-and-drop query construction
- No-code integrations: click to connect data sources

The democratization of ambient AI is a product design challenge as much as a technical one.

## The Bigger Picture: Ambient AI as Paradigm Shift

We spend enormous energy building AI agents that can *act*—agents that book flights, write code, send emails, manage calendars. These are valuable, but they're solving one side of the problem.

What if we first built AI that can *observe*?

**The Observation Gap:**

Current agent frameworks focus on execution:
- [LangChain/LangGraph](https://www.langchain.com/): Production agent engineering with tool calling and workflow orchestration
- [PydanticAI](https://ai.pydantic.dev/): Type-safe agent framework for building production LLM applications
- [Google ADK](https://google.github.io/adk-docs/): Multi-agent orchestration with workflow agents and LLM-driven routing
- [CrewAI](https://www.crewai.com/): Multi-agent collaboration frameworks for task delegation
- [AWS Bedrock Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html): Managed agent service with knowledge base integration

These frameworks excel at *doing things*, i.e, executing tasks, calling APIs, orchestrating workflows. But observation—knowing *when* to act—remains largely unaddressed. An agent that can perfectly book a flight but doesn't know when you need to travel is useless. Most frameworks assume a user-initiated request; few support autonomous monitoring and proactive alerting.

**Ambient AI in Context:**

In my [Agent Frameworks post](https://prassanna.io/blog/agent-frameworks/), I explored the fragmentation in agent tooling. Torale represents a different approach: instead of building a general-purpose agent, build a specialized agent that does one thing reliably.

The pattern:
- **Narrow scope**: Web monitoring, not general task execution
- **Autonomous**: Runs indefinitely without human intervention
- **Reliable**: Temporal ensures execution even through failures
- **Transparent**: Open source, inspectable, auditable

This is closer to [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) for AI agents: do one thing well, compose with other tools, emit structured data.

**Related Work:**

Several projects explore adjacent spaces:
- [Huginn](https://github.com/huginn/huginn): Self-hosted agent framework for automation
- [n8n](https://n8n.io/): Workflow automation with AI integrations
- [Pipedream](https://pipedream.com/): Event-driven automation platform
- [Zapier AI Actions](https://zapier.com/ai): Natural language automation

Torale differentiates through LLM-based condition evaluation. Instead of exact string matching or regex patterns, it understands *semantic* conditions: "A release date has been announced" vs "The text contains 'release date'."

**Open Questions:**

- Can ambient AI scale to monitoring millions of diverse queries?
- How do we measure the value of information delivered vs attention demanded?
- What's the right balance between proactive alerts and information overload?
- Can we build ambient AI that respects privacy while accessing private data?
- How do we handle bias in what AI thinks you should know about?

## Summary: What Worked, What's Experimental

After building Torale from overengineered scraper pipeline to production-ready monitoring platform, here are the key lessons:

### The Tech Stack

**What Worked:**
- **[Gemini 2.5 Grounded Search](https://ai.google.dev/gemini-api/docs/grounding)**: Collapsed complexity, eliminated scraping infrastructure
- **[Temporal](https://temporal.io/)**: Durable execution for long-running scheduled tasks
- **[PostgreSQL](https://www.postgresql.org/) + [Alembic](https://alembic.sqlalchemy.org/)**: Simple, reliable, self-hosted data layer
- **[Clerk](https://clerk.com/)**: Authentication solved, not built
- **[FastAPI](https://fastapi.tiangolo.com/)**: Python async API with automatic OpenAPI docs
- **[Docker](https://www.docker.com/) + [GKE](https://cloud.google.com/kubernetes-engine)**: Containerized deployment with Kubernetes orchestration
- **[Novu](https://novu.co/)**: Managed notification infrastructure (email, eventually SMS/push)

**Development Velocity:**
- **[Claude Code](https://prassanna.io/blog/reflections-claude-code/)**: 20+ features in 10 days post-launch
- **[GitHub Actions](https://github.com/features/actions) CI/CD**: Every commit tested, scanned, deployed automatically
- **Open Source**: [GitHub repository](https://github.com/prassanna-ravishankar/torale) with full transparency

### What's Experimental

**Evaluation Methodology:**
The 17 test case harness provides directional accuracy (Gemini 60%, Perplexity 80%, OpenAI 70%), but ground truth for grounded search is fuzzy. Real validation comes from production usage.

**Model Selection:**
Stayed with Gemini despite lower test accuracy due to cost/latency tradeoffs. This is a bet that "good enough + fast + cheap" beats "better + slow + expensive" for MVP validation. May need to revisit at scale.

**Notification Patterns:**
The three behaviors (`once`/`always`/`track_state`) cover most use cases, but edge cases exist. For example: "notify at most once per day" or "notify only during business hours" require additional logic.

### Try It

**For Users:**
- **Live platform**: [torale.ai](https://torale.ai)
- **Free tier**: Available while I validate product-market fit
- **No credit card**: Just sign up and start monitoring

**For Developers:**
```bash
# Install SDK
pip install torale

# Create your first monitor
from torale.sdk import ToraleClient
client = ToraleClient(api_key="sk_...")

task = client.tasks.create(
    name="My First Monitor",
    schedule="0 9 * * *",
    search_query="What you want to track",
    condition_description="When to notify you",
    notify_behavior="once"
)
```

**For Contributors:**
- **GitHub**: [github.com/prassanna-ravishankar/torale](https://github.com/prassanna-ravishankar/torale)
- **Issues**: Bug reports and feature requests welcome
- **PRs**: Contributions accepted (see CONTRIBUTING.md)
- **Changelog**: [torale.ai/changelog](https://torale.ai/changelog) with PR links for every feature

### The Bigger Question

We're building AI that can act—agents that execute tasks, make decisions, automate workflows. But before we build AI that does everything, maybe we should build AI that watches everything.

Not to replace human judgment, but to remove cognitive overhead. Not to make decisions for you, but to surface the right information at the right time. Not ambient surveillance, but **ambient intelligence**.

Torale is my attempt at answering: what if information found you instead of you finding it?

It's early. It's experimental. The product-market fit question is open. But maybe ambient AI isn't a distant future. Maybe it's just a good API, an LLM that knows how to watch, and someone willing to try building it.

---

*Previous posts: [30 Days of Claude Code](https://prassanna.io/blog/reflections-claude-code/), [Agent Frameworks](https://prassanna.io/blog/agent-frameworks/), [Agentic MLOps](https://prassanna.io/blog/agentic-mlops/)*
