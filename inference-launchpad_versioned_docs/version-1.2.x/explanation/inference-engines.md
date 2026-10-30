---
sidebar_label: "Inference Engines"
title: "PaletteAI Inference Launchpad Inference Engines"
description:
  "An explanation of inference engines in PaletteAI Inference Launchpad, including automatic engine selection, the
  supported engine kinds, and engine arguments."
hide_table_of_contents: false
sidebar_position: 4
tags: ["paletteai-inference-launchpad", "models", "explanation"]
keywords: ["launchpad", "ai", "inference", "engine", "vLLM"]
---

This page explains what an inference engine is in PaletteAI Inference Launchpad and how the appliance selects one
automatically when you [deploy a model](../how-to-guides/deploy-a-model.md).

## Inference Engine Overview

An inference engine is the runtime that loads a model and serves its requests. The appliance exposes each loaded model
as an OpenAI-compatible endpoint, but the engine behind that endpoint is what actually runs the model on a node's CPU or
GPUs. The engine determines how the model runs, which hardware it can use, and which serving features are available.

Each engine has a kind that identifies the underlying runtime, and each engine is either GPU-capable or CPU-only. A GPU
model can only run on a GPU-capable engine, and a model intended for CPU nodes runs on a CPU-only engine.

## Automatic Engine Selection

When you deploy a model, the appliance selects an engine that fits the model you chose, a GPU-capable engine for a GPU
model and a CPU-only engine for a CPU model. The deploy wizard does not ask you for an engine. The **Model** drop-down
menu shows the engine of each model beside its name, such as `glm-5.3-shared-with-vision · vllm · 106 GB`.

## Supported Engine Kinds

PaletteAI Inference Launchpad supports one engine kind, vLLM, which provides high-throughput GPU serving for large
models. Because it is the only supported kind, the appliance always selects a vLLM engine.

## Engine Arguments

Engine behavior can be adjusted through engine-specific arguments, which the model's recipe carries alongside its launch
configuration. The **Serving** step of the **Deploy a model** wizard shows those arguments under **Extra arguments**, so
you can review or override them for a single deploy without editing the recipe.

Where an argument's value is a JSON document, the step replaces the plain text input with a typed editor that validates
the JSON on every keystroke and offers a form view labeled by field type. The editor is triggered by the shape of the
value, not by a list of known argument names, so any current or future engine argument whose value is a JSON object or
array is edited the same way. The editor validates that the text parses as JSON, not the values the engine will accept.
Where the engine rejects a value at startup, the deploy fails on the model row after you select **Deploy**, rather than
showing an inline error in the wizard.

KV cache offloading is the first engine argument that uses this editor. The offloading strategy travels with the model's
recipe, which the appliance ships alongside a supported model, so the operator does not enable or disable offloading
from a switch on the deploy panel; the editor exists only to let the operator review or adjust the recipe's JSON value
for a single deploy. A common trap the editor catches is a quoted boolean: engines read any non-empty text as `true`, so
a field holding `"false"` as a string is silently read as `true`. The editor detects that and offers a one-select fix to
rewrite the value as an actual boolean.

Refer to
[Review or Change an Engine Argument That Uses JSON](../how-to-guides/deploy-a-model.md#review-or-change-an-engine-argument-that-uses-json).

## Resources

- [Deploy a Model](../how-to-guides/deploy-a-model.md)
- [Architecture](./architecture.md)
- [Certified Models by Hardware](../reference/certified-models-by-hardware.md)
