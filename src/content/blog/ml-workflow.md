---
title: "A Better ML Training Workflow: Stop Training and Praying"
description: "Fix your ML training workflow with the Pre-Flight, In-Flight, Post-Flight framework—catch bugs early, monitor runs, and evaluate beyond vanity metrics."
pubDate: 2025-07-23
heroImage: "/images/blog/ml-workflow/hero.webp"
series: ["Machine Learning", "MLOps"]
topics: ["GPU Training", "Model Evaluation", "Data Quality"]
author: "Prassanna Ravishankar"
draft: false
---

We need to talk about the elephant in the room: **most ML development is embarrassingly wasteful**.

I've watched teams burn through [millions of dollars training frontier models](https://mindcraft.ai/news/llm-training-costs-plummet/) only to discover fundamental bugs *after* the run completes. I've seen engineers religiously check their loss curves like stock tickers, praying their 3-week training job doesn't crash overnight. And I've personally experienced the gut-punch of realizing that a "successful" model with 95% accuracy completely fails on the data slices that actually matter for the business.

This isn't just about wasted money—though [poor data quality alone costs firms an average of $12.9 million annually](https://howtolearnmachinelearning.com/articles/the-hidden-cost-of-poor-training-data-in-machine-learning/). It's about a fundamentally broken development paradigm that's holding back innovation.

## The "Train and Pray" Problem

Here's how most ML development actually works:

1. Spend weeks preparing your dataset
2. Write your model code
3. Launch a massive training job
4. Cross your fingers and wait
5. Discover your bug/data issue/fundamental flaw *after* burning through your compute budget

Sound familiar? This "train and pray" approach treats ML training like a black box gamble instead of engineering. And the costs are staggering.

### The Hardware Reality Check

Let's start with the inconvenient truth about hardware failures. When Meta trained their [OPT-175B model on 992 A100 GPUs, they had 35 manual restarts over two months](https://aws.amazon.com/blogs/machine-learning/reduce-ml-training-costs-with-amazon-sagemaker-hyperpod/). The Llama 3.1 405B training? [417 hardware failures in 54 days](https://aws.amazon.com/blogs/machine-learning/reduce-ml-training-costs-with-amazon-sagemaker-hyperpod/).

Here's the math that'll keep you up at night: a 512-instance cluster has an expected hardware failure **every 5 hours**. And because most teams checkpoint every 3+ hours to avoid the 30-40 minute save overhead, each failure can waste hours of the most expensive computation on earth.

### The Data Pipeline Disaster

But hardware is just the beginning. Google's analysis of millions of training jobs revealed that [jobs spend 30% of their time just waiting for data](https://www.sigarch.org/the-new-bottlenecks-of-ml-training-a-storage-perspective/). Some models spend [up to 70% of their time on I/O](https://www.sigarch.org/the-new-bottlenecks-of-ml-training-a-storage-perspective/), with your expensive GPUs sitting idle while CPUs struggle to decode and preprocess the next batch.

This creates a vicious cycle: when your data pipeline is slow, debugging becomes prohibitively expensive. Teams ship with "good enough" data because the cost of another iteration to fix subtle quality issues feels too high. Then they burn weeks of compute training on fundamentally flawed datasets.

### The Silent Killers: Logic Errors

The most insidious problems don't crash your training—they silently corrupt it. Data leakage. Incorrect preprocessing. [Subtle bugs like forgetting to apply the same augmentation to both images and segmentation masks](https://www.reddit.com/r/MachineLearning/comments/r8ce7f/discussion_the_most_painful_thing_about_machine/), forcing your model to learn an impossible task.

These issues often only surface when you discover your "successful" model [performs terribly on critical subgroups](https://medium.com/@techwithpraisejames/when-ai-gets-it-wrong-real-stories-of-ai-fails-and-what-we-can-learn-26972dff8b86)—like Amazon's hiring algorithm that discriminated against women because it was trained on historical male-dominated data.

## Why Traditional Evaluation Is Broken

Even when training completes successfully, our evaluation methods give us false confidence. The standard practice—[evaluating on a random test set with a single aggregate metric](https://stats.stackexchange.com/questions/94268/can-a-machine-learning-algorithm-be-evaluated-based-on-a-random-sample)—is like judging a car's safety by its average crash test score across all scenarios.

[Random sampling fails to capture critical edge cases](https://fastercapital.com/topics/understanding-random-sampling-and-its-limitations.html/1). Your model might achieve 99% accuracy overall while completely failing on vulnerable populations or rare but critical scenarios. You declare victory, invest more compute in hyperparameter tuning, maybe even deploy to production—all while sitting on a ticking time bomb.

## A Better Way: Pre-Flight, In-Flight, Post-Flight

The solution isn't better hardware or faster GPUs. It's treating ML development like the engineering discipline it should be. I propose a three-phase approach that shifts validation left and makes every compute cycle count:

![ML development workflow showing Pre-Flight validation with data checks, In-Flight monitoring with real-time debugging, and Post-Flight analysis with model evaluation](/images/blog/ml-workflow/ml-development-phases.webp)

### Phase 1: Pre-Flight Protocol (Before You Waste Money)

**Stop launching training jobs blindly.** Before you spin up that expensive cluster, run these fast, cheap checks:

- **Data validation pipeline**: [Automated schema checks, integrity validation, and distributional analysis](https://www.amazon.science/publications/automated-data-validation-in-machine-learning-systems) to catch data drift and quality issues upfront
- **Memory estimation**: [Use the 40GB per billion parameters rule for transformers](https://www.osc.edu/resources/getting_started/howto/howto_estimating_and_profiling_gpu_memory_usage_for_generative_ai) to avoid OOM crashes
- **Single-batch end-to-end test**: [Run your entire pipeline on one batch](https://lightning.ai/docs/pytorch/stable/debug/debugging_basic.html)—this catches 80% of bugs in minutes, not days
- **Intentional overfitting test**: Can your model overfit on 10 batches? If not, you have a fundamental problem

### Phase 2: In-Flight Monitoring (Turn Training Into Debugging)

**Make your training process transparent.** Instead of staring at loss curves and hoping:

- **Staged scaling**: Start with 1% of your data, then 10%, scaling up only when each stage shows promise
- **Progressive validation**: [Evaluate on the next unseen batch after each training step](https://hunch.net/~jl/projects/prediction_bounds/thesis/mathml/thesisse44.xml), creating a real-time generalization curve
- **Real-time anomaly detection**: [Hook into your training loop](https://github.com/annalena-k/tutorial-pytorch-hooks) to catch NaN values and gradient explosions the moment they happen
- **Smart checkpointing**: Save frequently to local storage, not remote—[reduce recovery time from hours to minutes](https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training)

### Phase 3: Post-Flight Analysis (Beyond Vanity Metrics)

**Interrogate your model like your business depends on it.** Because it does:

- **Curated test slices**: Build [targeted test sets for critical subpopulations](https://www.reddit.com/r/MachineLearning/comments/r8ce7f/discussion_the_most_painful_thing_about_machine/), not just random samples
- **Edge case discovery**: [Systematically find your model's blind spots](https://keylabs.ai/blog/identifying-and-annotating-rare-edge-cases-to-improve-model-robustness/) before your users do
- **Model debugging**: [Run sensitivity analysis and residual analysis](https://jphall663.github.io/GWU_rml/tex/lecture_5.pdf) to understand when and why your model fails

## Time to Stop the Madness

The current state of ML development is like building rockets by lighting the fuse and hoping for the best. We've gotten comfortable with waste because compute felt infinite and model performance kept improving despite our inefficiencies.

But as models get larger and more expensive, we can't afford this anymore. Every failed training run is a lost opportunity to test a new idea. Every hour debugging preventable errors is an hour not spent on innovation.

The three-phase framework isn't just about saving money—it's about **accelerating the pace of ML innovation** by making our development process more scientific, predictable, and efficient.

**The question isn't whether you can afford to adopt these practices. It's whether you can afford not to.**
