---
sidebar_label: "Enable Vision Preprocessing"
title: "Enable Vision Preprocessing"
description:
  "Step-by-step guidance for platform operators on how to deploy a vision model alongside a text-only model and enable
  multimodal preprocessing so image requests are answered on the appliance."
hide_table_of_contents: false
sidebar_position: 2.3
tags: ["paletteai-inference-launchpad", "models", "vision", "how-to"]
keywords: ["launchpad", "ai", "vision", "multimodal", "preprocessing", "images", "screenshots", "Qwen", "GLM"]
---

This guide explains how to enable vision preprocessing on a running PaletteAI Inference Launchpad appliance. After you
finish, a text-only model such as GLM 5.2 can answer questions about screenshots and other images. Coding assistants
keep calling the text model they already use. For what the feature does and what clients see, refer to
[Vision Preprocessing](../explanation/vision-preprocessing.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- A text-only model in the appliance catalog, ready to deploy or already serving. GLM 5.2 is the validated text model
  for this path. To place a model in the catalog, refer to [Upload a Model](./upload-a-model.md). To deploy it, refer to
  [Deploy a Model](./deploy-a-model.md).
- A vision model in the appliance catalog. Qwen 3.5 9B multimodal is the validated vision model for this path.
- Hardware that can run both models on the same node. Spectro Cloud has validated GLM 5.2 with Qwen 3.5 9B multimodal on
  **8 x MI325X, 8 x B200, and 8 x H200**. Both models run on the same physical GPUs; no manual GPU reservation is
  needed. For certified text models by GPU, refer to
  [Certified Models by Hardware](../reference/certified-models-by-hardware.md).
- The two catalog entries the appliance uses for this pairing are `glm-5.2-shared` (text half) and `qwen-3.5-9B-shared`
  (vision half). Each carries per-GPU-family variants (MI325X, B200, H200) that hold the memory-budget, tensor-parallel,
  and engine-argument settings validated on the corresponding hardware. Deploying these two entries is what you do
  below; you do not edit the variant settings by hand.

## Deploy Both Models

Vision preprocessing needs two models serving at the same time: the text model that answers users, and the vision model
that converts images to text. Deploy the text model first, then the vision model. On the validated pairing, choose
`glm-5.2-shared` as the text half and `qwen-3.5-9B-shared` as the vision half — those are the catalog entries whose
per-hardware variants carry the tuned deploy configuration.

1. From the left main menu, select **Cluster**.

2. If the text model is not already serving, select **Deploy model**, choose the text model, and complete the deploy
   flow. Refer to [Deploy a Model](./deploy-a-model.md).

3. Wait until the text model health reads `N/N healthy` and its state reaches `ready` or `serving`. A large text model
   such as GLM 5.2 can take **5 to 10 minutes on the first-ever cold start** while it loads weights, compiles kernels,
   and captures CUDA graphs. Do not cancel the deploy during this window. Subsequent restarts reuse the compiled kernels
   from the on-appliance cache and start faster.

4. Select **Deploy model** again, choose the vision model, and complete the deploy flow.

5. Wait until the vision model also reaches `ready` or `serving`. The vision model is small and starts in under two
   minutes on validated hardware.

:::info

The **Multimodal preprocessing** card on **Settings** > **Configurations** appears after a second model is available, or
when vision preprocessing is already on. If you do not see the card, confirm both models are serving, then open
**Settings** again.

:::

If the deploy panel reports that no node has enough free GPUs, the vision model cannot be placed next to the text model
on this appliance. Free capacity, choose a smaller vision model, or
[contact Spectro Cloud](https://www.spectrocloud.com/contact) to confirm a supported pairing for your hardware.

## Enable Multimodal Preprocessing

1. From the left main menu, select **Settings**.

2. Select the **Configurations** tab.

3. In the **Multimodal preprocessing** card, select **Enable vision preprocessing**.

4. Open the **Vision engine** drop-down menu and select the engine that serves the vision model. The list is filled from
   the models that are currently serving.

5. Open the **Vision model** drop-down menu and select the vision model. The field is marked optional. Set it anyway so
   the appliance sends extracts to a named model.

6. Leave **Max images per request** at `8`, or enter a different per-turn cap. If a turn includes more images than this
   value, the appliance processes images up to the cap and skips the rest with a notice. It does not drop extra images
   silently.

7. Select **Turn on vision preprocessing**.

The setting applies to new requests. Requests already in progress are not changed. Text-only requests never use the
vision model, whether the setting is on or off.

## Verify Image Requests

Confirm that an image sent to the text model comes back with a correct answer. You can use a coding assistant that is
already pointed at the appliance.

1. Connect Claude Code, or another supported coding assistant, to the appliance. Refer to
   [Use Claude Code](./use-claude-code.md).

2. Start a session that uses the text model, not the vision model.

3. Paste a simple image, such as a solid-color PNG, or attach a screenshot, and ask a direct question about it. For
   example, ask what color the image is, or what a labeled value in the screenshot reads.

4. Confirm the reply matches the image. A solid red image should be answered as red. A screenshot question should quote
   or describe what is visible.

5. Send a follow-up that contains only text and no image. Confirm you still get a normal reply. That turn must not
   depend on the vision model.

:::tip

If a short test question comes back with no visible answer, raise the output token limit and try again. Reasoning models
use some of that budget before they write the visible reply, so a one-word answer can still need more room than it
appears.

:::

## Turn Off Vision Preprocessing

1. From the left main menu, select **Settings**.

2. Select the **Configurations** tab.

3. In the **Multimodal preprocessing** card, clear the **Enable vision preprocessing** checkbox.

4. Select **Turn off vision preprocessing**.

Image requests then fail until you turn the feature on again, or until you send the request without images. Text-only
requests continue to work.

## Operational Caveats

- **Do not use the vision model as a chat model.** It exists to convert images to text. Do not set it as the default
  model, and do not point coding-assistant routing at it. Keep clients on the text model. Refer to
  [Switch the Default Model](./set-the-default-model.md) and
  [Manage a Client's Model Access](./manage-client-model-access.md).
- **Keep both models serving.** If the vision model stops serving, image requests fail instead of continuing without the
  images. Text-only requests are unaffected.
- **Stay within the image cap.** The default cap is 8 images per turn. Extra images in the same turn are skipped with a
  notice. Ask about them in a follow-up message.
- **Expect a small share of GPU memory for the vision model.** On the validated pairings the text model reserves about
  86% of VRAM per GPU and the vision model reserves an additional 4%, leaving roughly 10% headroom on each shared GPU.
  Qwen 3.5 9B is sized to run next to GLM 5.2 rather than instead of it. Do not treat remaining GPU memory as spare
  capacity for another large model.
- **This path covers vision preprocessing only.** It does not configure arbitrary multi-model placement or a separate
  vision API.

## Next Steps

- [Use Claude Code](./use-claude-code.md) to send screenshots from a coding assistant.
- [Use Cursor](./use-cursor.md), [Use OpenAI Codex](./use-codex.md), or [Use OpenCode](./use-opencode.md) for the other
  supported tools.
- [Vision Preprocessing](../explanation/vision-preprocessing.md) explains the request path and the image cap.
