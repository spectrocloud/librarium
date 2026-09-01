---
sidebar_label: "Inference Engines"
title: "PaletteAI Inference Launchpad Inference Engines"
description:
  "An explanation of inference engines in PaletteAI Inference Launchpad, including automatic engine selection, the
  supported engine kinds, and when to override the automatic choice."
hide_table_of_contents: false
sidebar_position: 4
tags: ["paletteai-inference-launchpad", "models", "explanation"]
keywords: ["launchpad", "ai", "inference", "engine", "vLLM"]
---

This page explains what an inference engine is in PaletteAI Inference Launchpad, how the appliance selects one
automatically, and when you might choose one yourself. It gives you the background to make an informed choice when you
[deploy a model](../how-to-guides/deploy-a-model.md), where the engine is an optional setting.

## Inference Engine Overview

An inference engine is the runtime that loads a model and serves its requests. The appliance exposes each loaded model
as an OpenAI-compatible endpoint, but the engine behind that endpoint is what actually runs the model on a node's CPU or
GPUs. The engine determines how the model runs, which hardware it can use, and which serving features are available.

Each engine has a kind that identifies the underlying runtime, and each engine is either GPU-capable or CPU-only. A GPU
model can only run on a GPU-capable engine, and a model intended for CPU nodes runs on a CPU-only engine.

## Automatic Engine Selection

When you deploy a model, the engine setting defaults to **engine (auto)**. With the automatic option, the appliance
selects an engine that fits the model you chose, a GPU-capable engine for a GPU model and a CPU-only engine for a CPU
model. Leaving the setting on automatic is the recommended choice for most deployments, because the appliance matches
the engine to the model and the target node for you.

The engines you can choose from depend on how your appliance is configured. The deploy panel lists the automatic option
first, followed by any named engines the appliance exposes, each labeled with its kind, such as `default · vllm`.

## Supported Engine Kinds

PaletteAI Inference Launchpad currently supports one engine kind, vLLM. Additional kinds are on the roadmap and will be
listed here once they are supported.

| **Kind**  | **Hardware** | **Status**  | **Summary**                                                              |
| --------- | ------------ | ----------- | ------------------------------------------------------------------------ |
| vLLM      | GPU          | Supported   | High-throughput GPU serving for large models.                            |
| SGLang    | GPU          | Coming soon | High-throughput GPU serving with support for advanced serving features.  |
| Ollama    | CPU          | Coming soon | CPU-based serving for smaller models on nodes without a GPU.             |
| llama.cpp | CPU          | Coming soon | Lightweight CPU-based serving for smaller models on nodes without a GPU. |

Because vLLM is the only supported kind today, the automatic option and any manual selection both resolve to a vLLM
engine. The deploy panel may list other kinds if a future release adds them, but you should not select a kind marked as
coming soon until its release notes announce support.

## Manual Engine Selection

Leave the engine on the automatic option unless you have a specific reason to pin a model to a particular engine, such
as a serving feature that a specific kind provides. When you select an engine yourself, the appliance only offers
engines that fit the model's hardware, so you cannot select a CPU-only engine for a GPU model or the reverse.

## Resources

- [Deploy a Model](../how-to-guides/deploy-a-model.md)
- [Architecture](./architecture.md)
- [Certified Models by Hardware](../reference/certified-models-by-hardware.md)
