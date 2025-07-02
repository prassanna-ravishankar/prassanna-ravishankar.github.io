---
title: "Ambi-Alert"
description: "A smart web monitoring tool that tracks websites and alerts you when relevant changes occur"
featured: true
image: "/images/projects/ambi-alert.png"
github: "https://github.com/prassanna-ravishankar/ambi-alert"
link: "/projects/ambi-alert/"
tags: ["python", "web monitoring", "AI", "automation", "notifications"]
pubDate: 2025-01-15
draft: false
---

## Features

* 🔍 **Smart Query Expansion**: Automatically expands search queries to cover different aspects of your topic
* 🌐 **Intelligent Web Monitoring**: Tracks relevant websites and detects meaningful changes
* 🤖 **AI-Powered Relevance Checking**: Uses advanced language models to ensure changes are actually relevant to your interests
* 📧 **Flexible Alerting System**: Supports email notifications with more backends coming soon
* 💾 **Persistent Monitoring**: Uses SQLite to track monitored URLs and their states
* 🔄 **Automatic Retries**: Handles temporary failures gracefully

## Overview

AmbiAlert is a powerful web monitoring tool that helps you stay informed about topics that matter to you. Instead of constantly checking websites for updates, AmbiAlert does the work for you by monitoring relevant web pages and alerting you when meaningful changes occur.

## Technical Details

AmbiAlert uses a combination of web scraping, natural language processing, and AI to monitor websites and detect relevant changes. The system is built on a Python backend that can be run as a service or used programmatically.

The relevance checking is powered by advanced language models that understand the context of your queries and can determine if changes to a webpage are actually related to your interests.

```python
from ambi_alert import AmbiAlert
from ambi_alert.alerting import EmailAlertBackend

# Create an alert backend
alert_backend = EmailAlertBackend(
    smtp_server="smtp.gmail.com",
    smtp_port=587,
    username="your.email@gmail.com",
    password="your-app-password",
    from_email="your.email@gmail.com",
    to_email="target.email@example.com"
)

# Create AmbiAlert instance
async with AmbiAlert(alert_backend=alert_backend) as ambi:
    # Add queries to monitor
    await ambi.add_monitoring_query("next iPhone release")
    await ambi.add_monitoring_query("AI breakthrough")

    # Start monitoring
    await ambi.run_monitor()
```

AmbiAlert can be configured to check websites at different intervals and can be integrated with various notification systems. It's perfect for researchers, journalists, investors, or anyone who needs to stay updated on specific topics without constantly refreshing web pages. 