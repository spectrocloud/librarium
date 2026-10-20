---
sidebar_label: "Explanation"
title: "PaletteAI Inference Launchpad Explanation"
description: "Background, context, and design rationale for understanding how PaletteAI Inference Launchpad works."
hide_table_of_contents: false
sidebar_position: 0
tags: ["paletteai-inference-launchpad", "explanation"]
---

Explanatory and conceptual guides help you understand how and why PaletteAI Inference Launchpad works the way it does.
They cover design decisions, component relationships, and trade-offs rather than walking you through tasks.

## Contents

| **Topic**                                                   | **What you understand**                                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Architecture Overview](./architecture.md)                  | The component stack, request routing, model provisioning lifecycle, network topology, and data residency model.    |
| [Model Placement](./model-placement.md)                     | How a model is placed on cluster nodes, when to pin it to a subset, and how the Cluster view reports placement.    |
| [GPU Sharing](./gpu-sharing.md)                             | How models share a GPU, how GPU memory shares are judged, and why one appliance runs one sharing group.            |
| [Vision Preprocessing](./vision-preprocessing.md)           | How a text-only model answers questions about images by converting them to text first.                             |
| [Clients and Quotas](./clients-and-quotas.md)               | What a client is, how quotas meter usage, and how utilization, consumption, and historical windows are reported.   |
| [Usage Pricing](./usage-pricing.md)                         | How estimated cost, per-model rates, and cache reads are calculated.                                               |
| [Estimated Savings](./estimated-savings.md)                 | How much you save by serving on the appliance instead of a frontier model, and how the estimate is calculated.     |
| [Routing Behavior](./routing-behavior.md)                   | How the Tier map and the semantic router pick the model for each request, and why each appliance runs one mode.    |
| [Semantic Router Guard](./semantic-router-guard.md)         | The two checks the semantic router makes on each request it reads, and when it refuses a request with HTTP `403`.  |
| [Frontier Providers](./frontier-providers.md)               | Where provider keys live, the credential patterns, the levers that keep frontier traffic occasional, and bursting. |
| [Model Certification](./model-certification.md)             | What certified means, how models are certified, and how to choose models for your use case.                        |
| [Model Recipes](./model-recipes.md)                         | What a model recipe contains, why recipes exist, and why the model is not in the catalog between the two uploads.  |
| [Inference Engines](./inference-engines.md)                 | What an inference engine is, automatic engine selection, the supported kinds, and engine arguments.                |
| [Installation Architecture](./installation-architecture.md) | How the appliance installs, why the network uses a bond, and how day-two upgrades stay in Local UI.                |
| [The Thinking Directive](./thinking-directive.md)           | How the Thinking directive on the Tier map controls reasoning depth by effort level and how each engine reacts.    |
