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
| [Clients and Quotas](./clients-and-quotas.md)               | What a client is, why the appliance serves many clients, and how API tokens and quotas govern usage.              |
| [Model Certification](./model-certification.md)             | What certified means, how models are certified, and how to choose models for your use case.                       |
| [Inference Engines](./inference-engines.md)                 | What an inference engine is, automatic engine selection, the supported kinds, and when to override it.            |
| [Installation Architecture](./installation-architecture.md) | How the appliance installs, why the network uses a bond, and how day-two upgrades stay in Local UI.               |
