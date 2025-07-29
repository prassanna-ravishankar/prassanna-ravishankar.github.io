---
title: "Slither"
description: "A Random Forest library for semantic segmentation with local experts"
pubDate: 2017-02-01
tags: ["C++", "Python", "Machine Learning", "Computer Vision", "Random Forest"]
github: "https://github.com/prassanna-ravishankar/slither"
featured: false
image: "/images/projects/slither.webp"
---

## Overview

Slither is a specialized Random Forest library designed to "slither" through image data for semantic segmentation tasks. It was developed during my PhD at the Computer Vision Center in Barcelona and was the official implementation for my research paper on "Unstructured Road Segmentation using Hypercolumn based Random Forests of Local experts."

## Key Features

- Implements a Random Forest architecture with Local Experts (SVMs) at the nodes
- Uses information gain for node splitting rather than traditional Gini criteria
- Designed to work with superpixel hypercolumn features
- Provides both C++ and Python interfaces for flexibility
- Optimized for OpenCV data structures and workflows
- Includes serialization capabilities to save trained models

## Technical Details

The library was built with performance in mind, using C++17 with Python bindings. It was inspired by Microsoft Cambridge Research's Sherwood library but modified to handle data in a more OpenCV-friendly way. The implementation includes:

- Boost::serialization for model persistence
- CMake-based build system for cross-platform compatibility
- Python wrappers using pybind11
- Support for hypercolumn features from CNN backbones

This project represents a novel approach to semantic segmentation that combines traditional machine learning techniques with deep learning feature extraction, offering an efficient alternative to fully end-to-end deep learning approaches for certain computer vision tasks. 