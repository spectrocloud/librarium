---
id: model-certification
title: Model Certification
description: >
  What it means for a model to be certified on PaletteAI Inference Launchpad, how models are certified, and how to
  choose the right models for your use case.
sidebar_label: Model Certification
sidebar_position: 3
tags:
  - paletteai-inference-launchpad
  - explanation
  - models
keywords: ["launchpad", "ai", "certified models", "certification", "coding assistant"]
---

This page explains what model certification means and how a model becomes certified. For the models certified on
specific hardware, refer to [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

## Certification Overview

A certified model is a large language model (LLM) that Spectro Cloud has validated to run correctly on the listed GPU
configuration for PaletteAI Inference Launchpad. This validation is based on Spectro Cloud's own testing rather than
public benchmarks, and it can extend across equivalent GPU configurations. When you deploy a certified model on a
configuration where it is certified, you can be confident it loads and serves requests without hardware surprises.

## Model Use Cases

Spectro Cloud chooses the certified models with coding assistants as the primary use case. If your primary need is a
coding assistant, start with the certified models.

Other models may serve other use cases better, so if your primary need is not a coding assistant,
[contact Spectro Cloud](https://www.spectrocloud.com/contact) to discuss the right models for your use case.

:::info

The certified list is not exclusive. You can bring your own model as long as it fits within the GPU resources available
on your appliance. Refer to [Bring Your Own Model](../how-to-guides/bring-your-own-model.md). If you want Spectro Cloud
to certify a model for your hardware, [contact Spectro Cloud](https://www.spectrocloud.com/contact).

:::

For how to add a certified model to a running appliance, refer to [Upload a Model](../how-to-guides/upload-a-model.md)
and [Deploy a Model](../how-to-guides/deploy-a-model.md). To bring a model that is not certified, refer to
[Bring Your Own Model](../how-to-guides/bring-your-own-model.md). To let a certified text-only model answer questions
about images, refer to [Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).

## How Certification Differs from Model as a Service

PaletteAI Inference Launchpad is not a Model as a Service. Rather than offering the widest possible catalog of models on
demand, Spectro Cloud certifies a focused set of models for on-premises inference on your own hardware. For multi-tenant
AI factory use cases, [PaletteAI](https://docs.palette-ai.com) is the better fit. For a full comparison of the two
products, refer to [What is PaletteAI Inference Launchpad?](../paletteai-inference-launchpad.md).
