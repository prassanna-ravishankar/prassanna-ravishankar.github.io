---
title: "A2A Registry"
description: "A community-driven, open-source directory of AI agents using the A2A Protocol"
pubDate: 2025-08-10
image: "/images/projects/a2a-registry.webp"
github: "https://github.com/prassanna-ravishankar/a2a-registry"
link: "https://a2aregistry.org"
tags: ["ai-agents", "a2a-protocol", "registry", "python", "open-source", "community"]
topics: ["ai agent communication", "autonomous AI agents"]
featured: true
draft: false
---

The A2A Registry solves the critical problem of agent discovery in the AI ecosystem. **Unlike other registries that index code repositories or implementations, we exclusively index live, hosted agents that are actively running and accessible.** Using a "Git as a Database" model, we leverage GitHub for transparent data submission, validation, and hosting.

## Key Features

- **Live Agents Only**: Index operational, hosted agents - not just code or implementations
- **Open Source**: Fully transparent, community-driven development
- **A2A Protocol Compliant**: Uses official A2A Protocol AgentCard specification
- **Simple Submission**: Submit agents via GitHub Pull Requests
- **Automatic Validation**: CI/CD pipeline validates both A2A compliance and registry requirements
- **Multiple Access Methods**: Web UI, JSON API, and Python client
- **No Backend Required**: Static hosting via GitHub Pages

## How It Works

1. **Submission**: Developers submit agent definitions as JSON files via Pull Requests
2. **Validation**: GitHub Actions automatically validate JSON schema compliance and agent ownership
3. **Publishing**: On merge, the system consolidates all agents into `registry.json` and deploys to GitHub Pages

## Access Methods

### Web Browser
Visit [a2aregistry.org](https://a2aregistry.org) to browse and search the registry.

### API Endpoint
```bash
curl https://www.a2aregistry.org/registry.json
```

### Python Client
```bash
pip install a2a-registry-client
```

```python
from a2a_registry import Registry

registry = Registry()
agents = registry.get_all()

# Find agents with specific skills
weather_agents = registry.find_by_skill("weather-forecast")
```

## Validation Requirements

All agent submissions must:
- Conform to the Official A2A Protocol AgentCard specification
- Include all required A2A fields
- Include registry-specific fields: `author` and `wellKnownURI`
- Pass automated validation checks for agent ownership verification

## Vision

The A2A Registry aims to become the go-to directory for AI agents, establishing trust and security in the agent ecosystem while supporting distributed infrastructure for global scalability. We're building towards a future where agent discovery is seamless, secure, and community-driven.

Built with ❤️ by the A2A community, leveraging the [A2A Protocol](https://a2a-protocol.org/) for agent interoperability.
