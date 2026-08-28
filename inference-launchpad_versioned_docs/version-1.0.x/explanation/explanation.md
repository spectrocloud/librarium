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

| **Topic**                                                   | **What you understand**                                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [Architecture Overview](./architecture.md)                  | The component stack, request routing, model provisioning lifecycle, and data residency model.                     |
| [Model Placement](./model-placement.md)                     | How a model is placed on cluster nodes, when to pin it to a subset, and how the Cluster view reports placement.   |
| [Vision Preprocessing](./vision-preprocessing.md)           | How a text-only model answers questions about images by converting them to text first.                            |
| [Clients and Quotas](./clients-and-quotas.md)               | What a client is, how quotas meter usage, and how utilization, consumption, and historical windows are reported.  |
| [Model Certification](./model-certification.md)             | What certified means, how models are certified, and how to choose models for your use case.                       |
| [Inference Engines](./inference-engines.md)                 | What an inference engine is, automatic engine selection, the supported kinds, and when to override it.            |
| [Installation Architecture](./installation-architecture.md) | How the appliance installs across two stages, including the roles of the jumpbox and why the network uses a bond. |
