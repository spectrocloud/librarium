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
supports. A _certified_ model is one that Spectro Cloud has tested on the listed GPU configuration. For what
certification covers, refer to [Model Certification](../explanation/model-certification.md).

:::info

This is not an exclusive list. You can load other models on the appliance as long as they fit within the available GPU
resources. If the model you want does not appear here, [contact Spectro Cloud](https://www.spectrocloud.com/contact) to
discuss your use case.

:::

<Tabs queryString="vendor">

<TabItem label="NVIDIA" value="nvidia">

| **GPU configuration**   | **GLM 5.2** | **DeepSeek v4 Pro** | **Kimi 2.7** | **Gemma 4** |
| ----------------------- | :---------: | :-----------------: | :----------: | :---------: |
| 4 x H100                |     ❌      |         ❌          |      ❌      |     ✅      |
| 8 x H100                |     ❌      |         ❌          |      ❌      |     ✅      |
| 4 x H200                |     ❌      |         ❌          |      ❌      |     ✅      |
| 8 x H200                |     ✅      |         ✅          |      ✅      |     ✅      |
| 4 x H300 <sup>\*</sup>  |     ❌      |         ❌          |      ❌      |     ❌      |
| 8 x H300                |     ✅      |         ✅          |      ✅      |     ❌      |
| 4 x GB100 <sup>\*</sup> |     ❌      |         ❌          |      ❌      |     ❌      |
| 8 x GB100               |     ✅      |         ✅          |      ✅      |     ❌      |
| 4 x GB200 <sup>\*</sup> |     ❌      |         ❌          |      ❌      |     ❌      |
| 8 x GB200               |     ✅      |         ✅          |      ✅      |     ❌      |

<sup>*</sup> No certified model for this configuration. [Contact Spectro Cloud](https://www.spectrocloud.com/contact) to
discuss your use case.

</TabItem>

<TabItem label="AMD" value="amd">

| **GPU configuration** | **GLM 5.2** | **DeepSeek v4 Pro** | **Kimi 2.7** | **Gemma 4** |
| --------------------- | :---------: | :-----------------: | :----------: | :---------: |
| 4 x MI300X            |     ❌      |         ❌          |      ✅      |     ❌      |
| 8 x MI300X            |     ✅      |         ❌          |      ❌      |     ❌      |
| 4 x MI325X            |     ✅      |         ❌          |      ✅      |     ⏳      |
| 8 x MI325X            |     ✅      |         ❌          |      ❌      |     ⏳      |
| 4 x MI350X            |     ✅      |         ✅          |      ❌      |     ⏳      |
| 8 x MI350X            |     ✅      |         ✅          |      ❌      |     ⏳      |
| 4 x MI355X            |     ✅      |         ✅          |      ❌      |     ❌      |
| 8 x MI355X            |     ✅      |         ✅          |      ❌      |     ❌      |

⏳ Certification in progress.

</TabItem>

</Tabs>
