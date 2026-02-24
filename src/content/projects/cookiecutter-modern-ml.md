---
title: "Modern ML Cookiecutter"
description: "A modality-aware, end-to-end template for modern machine learning projects covering NLP, Speech, and Vision with best-in-class models and researcher-friendly configuration"
pubDate: 2025-07-29
image: "/images/projects/cookiecutter-modern-ml.webp"
github: "https://github.com/prassanna-ravishankar/cookiecutter-modern-ml"
link: "https://github.com/prassanna-ravishankar/cookiecutter-modern-ml"
tags: ["python", "machine-learning", "cookiecutter", "template", "nlp", "speech", "vision", "pytorch", "transformers"]
topics: ["mlops best practices"]
featured: true
draft: false
---

🚀 A modality-aware, end-to-end template for modern machine learning projects covering **NLP**, **Speech**, and **Vision** with best-in-class models and researcher-friendly configuration.

## ✨ Features

* **🎯 Multi-Modal Support**: Choose from NLP (DistilBERT), Speech (Whisper), or Vision (ViT) with optimized configurations
* **⚡ Fast Dependency Management**: Uses uv for lightning-fast package management
* **🧠 ML-Centric Configuration**: Researcher-friendly parameter names (`epochs` not `num_train_epochs`)
* **🖥️ Mac MPS Support**: Optimized for Apple Silicon with Metal Performance Shaders
* **☁️ Local & Cloud Training**: Seamless training with Hugging Face Accelerate locally or SkyPilot in the cloud
* **🚀 Production-Ready Serving**: High-performance model serving with LitServe
* **📊 Experiment Tracking**: Optional integration with tracelet
* **🔧 Type-Safe Configuration**: Pydantic-based settings with modality-aware validation

## 🎯 Supported Modalities

| Modality   | Task                 | Model              | Dataset        | Key Libraries                     |
| ---------- | -------------------- | ------------------ | -------------- | --------------------------------- |
| **NLP**    | Text Classification  | DistilBERT         | IMDB           | transformers, datasets            |
| **Speech** | ASR (Speech-to-Text) | Whisper            | Common Voice   | transformers, librosa, torchaudio |
| **Speech** | TTS (Text-to-Speech) | CSM (Sesame)       | Conversational | transformers, CSM                 |
| **Vision** | Image Classification | Vision Transformer | CIFAR-10       | torchvision, PIL, opencv          |

## 🚀 Quick Start

Generate a new project with a single command:

```bash
# Using cruft (recommended for template updates)
uvx cruft create https://github.com/prassanna-ravishankar/cookiecutter-modern-ml

# Using cookiecutter directly
cookiecutter https://github.com/prassanna-ravishankar/cookiecutter-modern-ml
```

Choose your modality (NLP, Speech, Vision) and start training with `uv run task train`.

## 🔧 What's Included

### Pre-configured Tools

* **uv**: Ultra-fast Python package management
* **Transformers**: State-of-the-art models for all modalities
* **Accelerate**: Multi-device training (CUDA/MPS/CPU)
* **LitServe**: High-performance model serving
* **Polars**: Fast data processing (not pandas)
* **Pydantic**: Type-safe configuration management
* **Ruff**: Fast Python linter and formatter
* **Pytest**: Testing framework

### Design Philosophy

* **Simplicity over Features**: Avoid over-engineering, focus on researcher needs
* **ML-Centric**: Parameter names and structure match ML research conventions
* **Modality-Aware**: Each domain (NLP/Speech/Vision) has optimized defaults
* **Modern Tooling**: Latest best practices (uv, Polars, LitServe, Pydantic)
* **Mac-First**: Optimized for Apple Silicon development

The template automatically optimizes for your hardware (Mac MPS, CUDA, or CPU) and includes cloud training support with SkyPilot for easy scaling to production workloads. 