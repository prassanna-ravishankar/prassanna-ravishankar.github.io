---
title: "Phlow"
description: "JWT-based authentication framework for AI agent networks using Supabase - making agent-to-agent communication secure and effortless"
featured: true
image: "/images/projects/phlow.png"
github: "https://github.com/prassanna-ravishankar/phlow"
link: "https://prassanna.io/phlow/"
tags: ["javascript", "python", "AI agents", "JWT", "authentication", "security", "Supabase", "A2A"]
pubDate: 2025-07-01
draft: false
---

## Features

* 🔐 **Zero-Config Authentication**: Protect your agent endpoints in one line of code
* 🤖 **Agent-to-Agent Security**: JWT + RSA256 signed tokens with automatic key management
* 🌐 **Multi-Language Support**: JavaScript/TypeScript and Python libraries with more coming
* 📡 **Supabase Registry**: Secure agent public key storage and automatic retrieval
* 🛡️ **Permission System**: Fine-grained access control with JWT claims and permissions
* ⚡ **Express & FastAPI Middleware**: Easy integration into existing web frameworks
* 🔧 **CLI Tools**: Command-line tools for project setup, key generation, and testing

## Overview

Phlow makes secure agent-to-agent authentication effortless in the emerging agentic web. As AI agents become more prevalent and need to communicate with each other, Phlow provides the authentication infrastructure to make these interactions secure and trustworthy.

Inspired by the A2A Protocol specification, Phlow aims to provide A2A-compatible authentication as a foundation for agent networks, handling all the complex cryptography and key management automatically.

## Technical Details

Phlow uses industry-standard JWT tokens with RS256 signatures, providing enterprise-grade security for agent communications:

**Protection in One Line:**
```javascript
// Before: Unprotected endpoint
app.post('/analyze', (req, res) => {
  // Anyone can call this!
});

// After: Zero-config agent authentication
app.post('/analyze', phlow.authenticate(), (req, res) => {
  // Now only authenticated agents can access
  console.log(`Request from: ${req.phlow.agent.name}`);
  console.log(`Permissions: ${req.phlow.claims.permissions}`);
});
```

**Automatic Agent Calls:**
```javascript
// Complex manual auth setup
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Agent-ID': agentId
  }
});

// With Phlow: Authentication handled automatically
const response = await phlow.callAgent('https://data-agent.ai/analyze', {
  dataset: 'sales-2024.csv'
});
```

**Authentication Flow:**
1. Agent A creates a JWT token signed with its private key
2. Agent A sends request to Agent B with JWT + Agent ID
3. Agent B looks up Agent A's public key from Supabase registry
4. Agent B verifies JWT signature using Agent A's public key
5. If valid, Agent B processes the request

The framework is designed to be completely transparent - no token generation, no key management, no auth headers to manage. Just secure agent communication that works out of the box. 