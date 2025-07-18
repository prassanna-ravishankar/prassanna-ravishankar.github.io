---
title: "ClearML MCP Server"
description: "A lightweight Model Context Protocol server that enables AI assistants to interact with ClearML experiments, models, and projects"
pubDate: 2025-07-14
image: "/images/projects/clearml-mcp.webp"
github: "https://github.com/prassanna-ravishankar/clearml-mcp"
link: "https://pypi.org/project/clearml-mcp/"
tags: ["python", "clearml", "mlops", "model-context-protocol", "experiment-tracking"]
featured: true
draft: false
---

A lightweight Model Context Protocol (MCP) server that enables AI assistants to interact with ClearML experiments, models, and projects. Get comprehensive ML experiment context and analysis directly in your AI conversations.

## Features

- **Experiment Discovery**: Find and analyze ML experiments across projects
- **Performance Analysis**: Compare model metrics and training progress
- **Real-time Metrics**: Access training scalars, validation curves, and convergence analysis
- **Smart Search**: Filter tasks by name, tags, status, and custom queries
- **Artifact Management**: Retrieve model files, datasets, and experiment outputs
- **Cross-platform**: Works with all major AI assistants and code editors

## Available Tools

The ClearML MCP server provides 14 comprehensive tools organized into task operations, model management, project discovery, and analysis capabilities. These tools enable natural language queries like "Show me the latest experiments" or "Compare accuracy metrics between tasks."

## Platform Support

Compatible with Claude Desktop, Cursor, Continue, Cody, Zed Editor, and other MCP-enabled applications. Simple configuration allows seamless integration with existing ClearML setups.

## Getting Started

Install via PyPI with `pip install clearml-mcp` or run directly using `uvx clearml-mcp`. Requires a configured ClearML environment with valid API credentials.

This integration makes MLOps more accessible by allowing data scientists and ML engineers to interact with their experiments and models through conversational AI, reducing complexity and improving productivity in ML workflows. 