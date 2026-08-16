---
id: certified-models-by-hardware
title: Certified Models by Hardware
description: >
  Reference table that maps each supported NVIDIA and AMD GPU configuration to the LLM models certified for PaletteAI
  Inference Launchpad.
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

## Vision Models

The table above lists certified text models. A text-only model cannot read screenshots or other images on its own. To
answer questions about images, deploy a small vision model next to the text model and turn on vision preprocessing.

The certified pairing is **GLM 5.2** as the text model and **Qwen 3.5 9B multimodal** as the vision model. Spectro Cloud
has validated this pairing on the following configurations:

| **GPU configuration** | **Text model** | **Vision model**         | **Validated** |
| --------------------- | -------------- | ------------------------ | :-----------: |
| 8 x H200              | GLM 5.2        | Qwen 3.5 9B multimodal   |      ✅       |
| 8 x B200              | GLM 5.2        | Qwen 3.5 9B multimodal   |      ✅       |
| 8 x MI325X            | GLM 5.2        | Qwen 3.5 9B multimodal   |      ✅       |

On each configuration, the text model runs at tensor-parallel width 8 across all GPUs, and the vision model runs at
tensor-parallel width 4 across the first 4 GPUs. Both models share the same physical devices; the appliance isolates
their memory budgets so they do not compete for the same VRAM allocation. For how that isolation works and what to
expect from memory usage, refer to
[Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md). For how the request path works, refer to
[Vision Preprocessing](../explanation/vision-preprocessing.md).
