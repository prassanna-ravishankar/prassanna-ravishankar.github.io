---
title: "Tracelet"
description: "Captures PyTorch training metrics and sends them to MLflow, Weights & Biases, ClearML or AIM with little code change"
pubDate: 2024-12-13
tags: ["python", "pytorch", "machine learning", "metrics", "mlops"]
topics: ["mlops best practices", "ml experiment tracking"]
github: "https://github.com/prassanna-ravishankar/tracelet"
link: "https://prassanna.io/tracelet/"
image: "/images/projects/tracelet.webp"
featured: false
---

## Features

* 🔄 Automatic capture of PyTorch metrics and TensorBoard logs
* 🤝 Integration with multiple tracking backends (MLflow, Weights & Biases, AIM)
* 📊 System metrics monitoring (CPU, GPU, Memory)
* 📝 Git repository tracking
* ⚡ Lightning integration support
* 🔧 Environment variable tracking
* 🎨 Matplotlib figure export support

## Overview

Tracelet simplifies the process of tracking and exporting metrics from PyTorch models. It automatically captures metrics from your training loops and integrates with popular experiment tracking platforms, making it easier to monitor and compare model performance.

## Technical Details

Tracelet is designed to be lightweight and non-intrusive. It hooks into PyTorch's event system to capture metrics without requiring significant changes to your existing code. The library supports multiple backends, allowing you to use your preferred experiment tracking tool.

Configuration is flexible through both a programmatic API and environment variables, making it suitable for both local development and production environments.

```python
import tracelet
import torch

# Start experiment tracking
experiment = tracelet.start_logging(
    exp_name="my_experiment",
    project="my_project",
    backend="mlflow"  # or "wandb", "aim"
)

# Your PyTorch training code
# Tracelet will automatically capture metrics from TensorBoard, Lightning, etc.

# Stop tracking when done
tracelet.stop_logging()
``` 