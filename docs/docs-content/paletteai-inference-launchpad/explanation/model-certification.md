---
id: model-certification
title: Model Certification
description: >
  What it means for a model to be certified on PaletteAI Inference Launchpad, the parameters and vLLM recipes each
  certification pins, and how to choose the right models for your use case.
sidebar_label: Model Certification
sidebar_position: 3
tags:
  - paletteai-inference-launchpad
  - explanation
  - models
keywords:
  ["launchpad", "ai", "certified models", "certification", "coding assistant", "vllm", "quantization", "kv cache"]
---

This page explains what model certification means, the parameters and vLLM recipe each certification pins, and how a
model becomes certified. For the models certified on specific hardware, refer to
[Certified Models by Hardware](../reference/certified-models-by-hardware.md).

## Certification Overview

A certified model is a large language model (LLM) that Spectro Cloud has validated to run correctly on the listed GPU
configuration for PaletteAI Inference Launchpad. This validation is based on Spectro Cloud's own testing rather than
public benchmarks, and it can extend across equivalent GPU configurations. When you deploy a certified model on a
configuration where it is certified, you can be confident it loads and serves requests without hardware surprises.

Certification is not a single yes-or-no flag. Each certification pins a concrete serving recipe: the inference engine
and version, how the model shards across GPUs, the numeric formats used for the weights and the key-value cache, and the
context length the configuration serves. The sections below list those parameters and the recipe behind them.

## What Certification Pins

For each certified model and GPU configuration, Spectro Cloud fixes the following parameters. Together they make up the
serving recipe that the appliance runs.

| **Parameter**                        | **What it fixes**                                                                              | **Why it matters**                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Inference engine and minimum version | The runtime that serves the model, such as vLLM, and the lowest version that runs it correctly | Model parsers, GPU kernels, and quantization support land in specific versions |
| Tensor parallelism                   | The number of GPUs the model shards across                                                     | Sets the minimum GPU count for the configuration                               |
| Weight quantization                  | The numeric format of the model weights, such as `fp8`                                         | Determines the VRAM footprint and which GPUs can host the model                |
| KV-cache quantization                | The numeric format of the key-value cache, such as `fp8`                                       | Controls how much context fits in GPU memory                                   |
| Maximum context length               | The largest context window the configuration serves                                            | Bounds the combined prompt and output length                                   |
| GPU memory utilization               | The fraction of VRAM the engine reserves                                                       | Balances key-value cache capacity against activation headroom                  |

For the inference engine kinds the appliance supports and how it selects one, refer to
[Inference Engines](./inference-engines.md).

## Certified Model Parameters

The following table lists the certified parameters for each model. The values are the validated maxima across the
certified GPU configurations; the exact figures vary by GPU. For the full model-to-GPU mapping, refer to
[Certified Models by Hardware](../reference/certified-models-by-hardware.md).

{/* NEEDS REVIEW: the source of truth for the certified DeepSeek model is DeepSeek-V4-Flash; the Certified Models by Hardware reference page currently lists it as DeepSeek v4 Pro, which the engineering source describes as a checkpoint that does not fit the appliance hardware. Reconcile the two names with a subject matter expert, then align both pages. */}

| **Model**         | **Weight quantization**              | **KV-cache quantization** | **Inference engine (minimum version)** | **Tensor parallelism** | **Maximum context length** |
| ----------------- | ------------------------------------ | ------------------------- | -------------------------------------- | ---------------------- | -------------------------- |
| GLM 5.2           | `fp8`                                | `fp8`                     | vLLM `0.23.0`                          | 8                      | up to 1,048,576 tokens     |
| DeepSeek V4-Flash | `fp4-moe+fp8`                        | `fp8`                     | vLLM `0.20.0`                          | 1 to 4                 | up to 524,288 tokens       |
| Kimi 2.7          | `fp8`                                | Not yet tuned             | vLLM                                   | 8                      | 131,072 tokens             |
| Gemma 4           | `bf16`, or `fp8` on constrained VRAM | `fp8`                     | vLLM `0.23.0`                          | 1                      | up to 131,072 tokens       |

Some models are certified on more than one GPU configuration, and some configurations are still being validated. GLM 5.2
and DeepSeek V4-Flash are validated live on their listed GPUs, Gemma 4 is validated on a single-GPU configuration with
its other GPU configurations planned, and Kimi 2.7's recipe is provisional.

{/* NEEDS REVIEW: Kimi 2.7 does not yet have a hardware-validated serving recipe in the engineering source; the values in its row are provisional targets. Confirm the validated values with a subject matter expert before publishing. */}

## vLLM Recipes

A recipe is the exact set of engine flags and settings that serves a model on a given GPU configuration. Every certified
combination has a recipe, and the appliance runs that recipe rather than asking you to tune the engine yourself. The
public vLLM recipes are published at [recipes.vllm.ai](https://recipes.vllm.ai/), and Spectro Cloud starts from those
recipes and validates them on the appliance hardware. Where a recipe includes proprietary tuning, some parameters may be
omitted from the public recipe.

For example, the certified recipe for GLM 5.2 on eight AMD `MI325X` GPUs pins the following:

- **Inference engine**: vLLM (`ROCm` build), minimum version `0.23.0`
- **Tensor parallelism**: 8
- **Weight quantization**: `fp8`, block-scaled
- **KV-cache quantization**: `fp8_e4m3`
- **Maximum context length**: 1,048,576 tokens
- **GPU memory utilization**: `0.68`, plus `ROCm`-specific kernel flags

The recipe travels with the model. It is captured in the model's metadata file and shipped to the appliance when you
upload the model, so the appliance serves the exact configuration Spectro Cloud validated. For the metadata format,
refer to [Model Upload Reference](../reference/model-upload-reference.md#model-metadata-file).

## Performance

Certification validates that a model serves acceptably on its target hardware, not only that it loads. When you deploy a
model, the appliance brings it through gate, provision, smoke-test, and ready stages, and the model becomes routable
only after its smoke test passes, so the appliance never presents a model as ready before it can serve requests. For the
full lifecycle, refer to [Architecture Overview](./architecture.md).

Spectro Cloud also tests each certified configuration against a target performance envelope for its GPU configuration,
covering first-token latency, output token throughput, and sustained concurrency.

{/* NEEDS REVIEW: published per-model benchmark numbers (throughput, latency, and sustained concurrency) per hardware configuration are not yet finalized; the capacity study is an open item. Confirm the performance-envelope claim and add the figures with a subject matter expert before publishing this section. */}

## Model Use Cases

Spectro Cloud chooses the certified models with coding assistants as the primary use case. If your primary need is a
coding assistant, start with the certified models.

Other models may serve other use cases better, so if your primary need is not a coding assistant,
[contact Spectro Cloud](https://www.spectrocloud.com/contact) to discuss the right models for your use case.

:::info

The certified list is not exclusive. You can load models beyond it as long as they fit within the GPU resources
available on your appliance. If the model you want is not certified for your hardware,
[contact Spectro Cloud](https://www.spectrocloud.com/contact) to discuss your use case.

:::

For how to add a model to a running appliance, refer to [Deploy a Model](../how-to-guides/deploy-a-model.md).

## How Certification Differs from Model as a Service

PaletteAI Inference Launchpad is not a Model as a Service. Rather than offering the widest possible catalog of models on
demand, Spectro Cloud certifies a focused set of models for on-premises inference on your own hardware. For multi-tenant
AI factory use cases, [PaletteAI](https://docs.palette-ai.com) is the better fit. For a full comparison of the two
products, refer to [What is PaletteAI Inference Launchpad?](../paletteai-inference-launchpad.md).

## Resources

- [Certified Models by Hardware](../reference/certified-models-by-hardware.md) for the model-to-GPU mapping.
- [Inference Engines](./inference-engines.md) for the engine kinds the appliance supports and how it selects one.
- [Model Upload Reference](../reference/model-upload-reference.md) for the model metadata file that carries the recipe.
- [Deploy a Model](../how-to-guides/deploy-a-model.md) to add a certified model to a running appliance.
