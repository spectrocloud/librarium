---
id: certified-models-by-hardware
title: Certified Models by Hardware
description: >
  Reference table that maps each supported NVIDIA and AMD GPU configuration to the LLM models certified for PaletteAI
  Inference Launchpad, along with the quantization parameters for each certified model.
sidebar_label: Certified Models by Hardware
sidebar_position: 4
tags:
  - paletteai-inference-launchpad
  - reference
  - models
  - hardware
---

Spectro Cloud certifies a small set of large language models (LLMs) for the hardware that PaletteAI Inference Launchpad
supports. A _certified_ model is one that Spectro Cloud has validated to run correctly on the listed GPU configuration.
For what certification covers, refer to [Model Certification](../explanation/model-certification.md).

:::info

This is not an exclusive list. You can load other models on the appliance as long as they fit within the available GPU
resources. If the model you want does not appear here, [contact Spectro Cloud](https://www.spectrocloud.com/contact) to
discuss your use case.

:::

The following tables use these markers:

- ✅ — Certified on this configuration.
- ❌ — Not certified on this configuration.
- ❔ — Certification is pending engineering validation.

## Certified Models by GPU Configuration

{/* NEEDS REVIEW (DOC-3040): B200 rows inherit the results from the previously mislabeled GB100 rows; confirm with Doug Underwood that these certification results apply to B200. */}
{/* NEEDS REVIEW (DOC-3040): B300 and GB300 certification is pending; Doug Underwood to provide validated results. */}
{/* NEEDS REVIEW (DOC-3040): H100 serves only Gemma 4, which Pedro Oliveira flagged as overkill; confirm with Doug Underwood whether H100 should remain a listed target. */}

<Tabs queryString="vendor">

<TabItem label="NVIDIA" value="nvidia">

| **GPU configuration** | **GLM 5.2** | **DeepSeek v4 Pro** | **Kimi 2.7** | **Gemma 4** |
| --------------------- | :---------: | :-----------------: | :----------: | :---------: |
| 4 x H100              |     ❌      |         ❌          |      ❌      |     ✅      |
| 8 x H100              |     ❌      |         ❌          |      ❌      |     ✅      |
| 4 x H200              |     ❌      |         ❌          |      ❌      |     ✅      |
| 8 x H200              |     ✅      |         ✅          |      ✅      |     ✅      |
| 4 x B200              |     ❌      |         ❌          |      ❌      |     ✅      |
| 8 x B200              |     ✅      |         ✅          |      ✅      |     ✅      |
| 4 x B300              |     ❔      |         ❔          |      ❔      |     ❔      |
| 8 x B300              |     ❔      |         ❔          |      ❔      |     ❔      |
| 4 x GB200             |     ❌      |         ❌          |      ❌      |     ✅      |
| 8 x GB200             |     ✅      |         ✅          |      ✅      |     ✅      |
| 4 x GB300             |     ❔      |         ❔          |      ❔      |     ❔      |
| 8 x GB300             |     ❔      |         ❔          |      ❔      |     ❔      |

</TabItem>

<TabItem label="AMD" value="amd">

| **GPU configuration** | **GLM 5.2** | **DeepSeek v4 Pro** | **Kimi 2.7** | **Gemma 4** |
| --------------------- | :---------: | :-----------------: | :----------: | :---------: |
| 4 x MI300X            |     ❌      |         ❌          |      ✅      |     ✅      |
| 8 x MI300X            |     ✅      |         ❌          |      ✅      |     ✅      |
| 4 x MI325X            |     ✅      |         ❌          |      ✅      |     ✅      |
| 8 x MI325X            |     ✅      |         ❌          |      ❌      |     ✅      |
| 4 x MI350X            |     ✅      |         ✅          |      ❌      |     ✅      |
| 8 x MI350X            |     ✅      |         ✅          |      ❌      |     ✅      |
| 4 x MI355X            |     ✅      |         ✅          |      ❌      |     ✅      |
| 8 x MI355X            |     ✅      |         ✅          |      ❌      |     ✅      |

</TabItem>

</Tabs>

## Certified Model Parameters

Certification is tied to a specific set of model parameters. Quantization stores the model weights at a lower numeric
precision, and KV-cache quantization does the same for the key-value cache. Both reduce the memory footprint of a model.
For definitions, refer to [Quantization](./glossary.md#quantization) and [KV Cache](./glossary.md#kv-cache) in the
glossary.

{/* NEEDS REVIEW (DOC-3040): Only GLM 5.2 quantization (FP8) is sourced from the hardware requirements. Doug Underwood to provide quantization and KV-cache quantization for all models, ideally with the vLLM recipe used per model. */}

| **Model**       | **Quantization** | **KV-Cache Quantization** |
| --------------- | :--------------: | :-----------------------: |
| GLM 5.2         |       FP8        |            ❔             |
| DeepSeek v4 Pro |        ❔        |            ❔             |
| Kimi 2.7        |        ❔        |            ❔             |
| Gemma 4         |        ❔        |            ❔             |
