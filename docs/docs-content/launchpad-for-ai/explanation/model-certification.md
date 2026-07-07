---
id: model-certification
title: Model Certification
description: >
  What it means for a model to be certified on Launchpad for AI, how models are certified, and how to choose the right
  models for your use case.
sidebar_label: Model Certification
sidebar_position: 2
tags:
  - launchpad-for-ai
  - explanation
  - models
keywords: ["launchpad", "ai", "certified models", "certification", "coding assistant"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This page explains what model certification means and how a model becomes certified. For the models certified on
specific hardware, refer to [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

## Model Certification

A certified model is a large language model (LLM) that Spectro Cloud has tested on a specific GPU configuration and
confirmed runs correctly on Launchpad for AI. Spectro Cloud runs each certified model on the hardware it is paired with,
rather than assuming the model works from public benchmarks. When you deploy a certified model on a configuration where
it is certified, you can be confident it loads and serves requests without hardware surprises.

## Model Use Cases

Spectro Cloud chooses the certified models with coding assistants as the primary use case. If your primary need is a
coding assistant, start with the certified models.


Other models may serve other use cases better, so if your primary need is not a coding assistant,
[contact Spectro Cloud](https://www.spectrocloud.com/contact) to discuss the right models for your use case.

## Beyond the Certified List

The certified list is not exclusive. You can load models beyond it as long as they fit within the GPU resources
available on your appliance. If the model you want is not certified for your hardware,
[contact Spectro Cloud](https://www.spectrocloud.com/contact) to discuss your use case. For how to add a model to a
running appliance, refer to [Add a Model](../how-to-guides/add-a-model.md).

## How Certification Differs from Model-as-a-Service

Launchpad for AI is not a Model as a Service. Rather than offering the widest possible catalog of models on demand,
Spectro Cloud certifies a focused set of models for on-premises inference, on your own hardware. For multi-tenant AI
factory use cases, [PaletteAI](https://docs.palette-ai.com) is the better fit. For a full comparison of the two
products, refer to [What is Launchpad for AI?](../launchpad-for-ai.md).
