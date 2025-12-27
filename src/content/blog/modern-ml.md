---
title: "Modern ML Cookiecutter Template"
description: "From dependency hell to device confusion - I built a modality-aware cookiecutter template that gets you from idea to training in minutes, not hours. Here's why modern ML projects need modern tooling."
pubDate: 2025-07-28
heroImage: "/images/blog/modern-ml/hero.webp"
series: ["Machine Learning", "Python"]
topics: ["uv", "Polars", "LitServe", "Cookiecutter"]
author: "Prassanna Ravishankar"
draft: false
---

I've started enough ML projects to know the drill. Hour one: excited about the idea. Hour two: fighting with dependency management. Hour three: wondering if I should use `requirements.txt` or `pyproject.toml`. Hour four: still configuring the training loop. By hour five, the original spark is gone.

This is the setup tax every ML engineer pays. And frankly, I got tired of paying it.

So I built [cookiecutter-modern-ml](https://github.com/prassanna-ravishankar/cookiecutter-modern-ml) - a template that gets you from idea to training in minutes, not hours.

## The Problem with ML Project Templates

Most ML templates fall into two camps: toy examples that work on MNIST but break in production, or enterprise monsters with 47 configuration files and a PhD requirement for setup.

I needed something different. Something that could handle real ML workloads but still let me go from idea to training in minutes, not hours.

The specific pain points that pushed me over the edge:

- **Dependency hell**: Every project reinventing the wheel with different package managers
- **Device confusion**: Writing separate code paths for Mac MPS, CUDA, and CPU
- **Configuration chaos**: YAML files that require a manual to understand
- **Single-modality bias**: NLP templates that can't handle vision, vision templates that break on speech

## Enter: Modality-Aware Cookiecutter

The solution crystallized around a simple insight: modern ML isn't just about text anymore. We need templates that understand that speech, vision, and NLP are first-class citizens with their own quirks and optimizations.

### The Stack Decisions

I made some opinionated choices:

**uv over pip/poetry**: Package management should be fast. Really fast. uv installs dependencies while poetry is still parsing the lock file.

**Polars over pandas**: If you're still using pandas for data processing in 2024, you're leaving performance on the table. Polars is faster and has a saner API.

**LitServe over FastAPI**: Model serving shouldn't require writing boilerplate. LitServe gives you production-ready APIs with minimal code.

**Pydantic everywhere**: Type safety isn't optional anymore. Configuration, data validation, API contracts - all Pydantic, all the time.

### The Modality Split

The breakthrough was realizing that NLP, speech, and vision aren't just different datasets - they're different paradigms:

- **NLP**: Sequence modeling, attention mechanisms, tokenization
- **Speech ASR**: Audio preprocessing, temporal modeling, WER metrics  
- **Speech TTS**: Voice synthesis, naturalness evaluation, conversational AI
- **Vision**: Spatial reasoning, patch-based transformers, image augmentation

Each needs its own model defaults, preprocessing pipelines, and evaluation metrics. A good template should encode these differences, not force you to figure them out.

## ML's Tooling Time Lag

Here's something that bugs me: ML projects are always 2-3 years behind modern Python tooling. While the rest of the Python ecosystem moved to `pyproject.toml`, we were still writing `requirements.txt`. While everyone adopted type hints, we pretended dynamic typing was a feature.

The conda lock-in made this worse. Remember when you couldn't get CUDA wheels on PyPI? You were stuck with conda environments and their glacial dependency resolution. Then PyPI got CUDA wheels and suddenly the entire ecosystem unlocked. But ML templates? Still recommending conda.

Python environments used to be genuinely painful - virtualenv, venv, pipenv, poetry all with different trade-offs. With uv, it's just... simple. Fast installs, clean dependency resolution, no mental overhead.

But look at most ML templates today and you'll still find requirements.txt and manual environment setup instructions.

## The Configuration Philosophy

Most ML configuration is programmer-centric. You get `per_device_train_batch_size` instead of `batch_size`. You get `num_train_epochs` instead of `epochs`.

This is backwards. ML researchers think in terms of epochs, learning rates, and batch sizes. The configuration should speak their language.

Hydra is great for complex experiments, but it brings in 20+ dependencies and its own mental model. For most projects, you just want type-safe config that doesn't require a PhD to understand.

So instead of:
```yaml
training:
  num_train_epochs: 3
  per_device_train_batch_size: 16
  evaluation_strategy: "epoch"
```

You get:
```yaml
training:
  epochs: 3
  batch_size: 16
  eval_strategy: "epoch"
```

Small change, huge impact on cognitive load.

## The Speech Revolution

The most interesting part was splitting speech into ASR and TTS. Most templates treat speech as "just use Whisper" but that's only half the story.

For ASR, Whisper remains king - mature, multilingual, production-ready.

For TTS, I went with Sesame's CSM model. It's newer, but it's specifically designed for conversational AI with "voice presence" - emotional intelligence, timing, natural flow. If you're building voice assistants in 2024, CSM is where the frontier is.

Different sample rates (16kHz vs 24kHz), different preprocessing, different evaluation metrics. The template handles all of it.

## Research to Production: Why Start with a Great Scaffold

The path from research prototype to production system usually takes months. You start with a Jupyter notebook, maybe graduate to a Python script, then spend weeks refactoring for deployment, adding proper logging, containerization, CI/CD...

Why not start with production-ready patterns from day one?

This cookiecutter gives you LitServe for model serving, proper configuration management, device detection, CI workflows - all the scaffolding you'll need eventually. The research code looks the same, but when it's time to deploy, you're already 80% there.

Building this template taught me that good abstractions aren't about hiding complexity - they're about organizing it sensibly. The best ML engineers aren't the ones who can configure anything from scratch. They're the ones who recognize patterns and encode them into reusable systems.

## Try It

```bash
uvx cruft create https://github.com/prassanna-ravishankar/cookiecutter-modern-ml
```

Choose your modality. Pick your task. Start training.

The setup tax is now optional.