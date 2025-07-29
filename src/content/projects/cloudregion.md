---
title: "CloudRegion"
description: "A lightweight Python library for canonical cloud region mapping across AWS, Azure, and Google Cloud Platform"
featured: false
image: "/images/projects/cloudregion.png"
github: "https://github.com/prassanna-ravishankar/cloudregion"
link: "https://prassanna.io/cloudregion"
tags: ["python", "cloud", "AWS", "Azure", "GCP", "infrastructure", "devops"]
pubDate: 2025-07-01
draft: false
---

## Features

* 🌍 **Intuitive City Names**: Use `virginia` instead of `us-east-1`/`eastus`/`us-east1`
* ☁️ **Multi-Cloud Support**: Seamless mapping across AWS, Azure, and Google Cloud
* 🔄 **Smart Aliases**: Support for common regional aliases like `us-east`, `eu-west`
* 🛠️ **SDK Integration**: Built-in helpers for boto3 and other cloud SDKs
* 📦 **Zero Dependencies**: Lightweight library with no external dependencies
* 🎯 **Type Safety**: Full TypeScript-style type hints for Python

## Overview

CloudRegion solves the frustrating problem of inconsistent region naming across cloud providers. Instead of remembering that Virginia is called `us-east-1` in AWS, `eastus` in Azure, and `us-east1` in GCP, you can simply use `region('virginia')` and get the correct provider-specific name.

Perfect for multi-cloud deployments, infrastructure automation, and configuration management where you need to work with the same logical regions across different cloud providers.

## Technical Details

The library provides a simple, pythonic interface that abstracts away cloud provider differences:

```python
from cloudregion import region

# Use intuitive city names
r = region('virginia')
print(r.aws)    # us-east-1
print(r.azure)  # eastus
print(r.gcp)    # us-east1

# Works with aliases too
region('us-east').canonical  # virginia
region('eu-west').gcp       # europe-west1

# Multi-cloud infrastructure deployment
target_region = region('virginia')
aws_config = {'region': target_region.aws}
azure_config = {'location': target_region.azure}
gcp_config = {'region': target_region.gcp}
```

CloudRegion includes built-in integrations for popular cloud SDKs and supports environment-specific region mapping for development workflows. The library is designed to be lightweight and fast, with all mappings stored in memory for instant lookups. 