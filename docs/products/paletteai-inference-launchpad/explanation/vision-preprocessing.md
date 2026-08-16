---
sidebar_label: "Vision Preprocessing"
title: "Vision Preprocessing"
description:
  "An explanation of vision preprocessing in PaletteAI Inference Launchpad: how a text-only model answers questions
  about images, what clients see, and the limits that apply."
hide_table_of_contents: false
sidebar_position: 1.5
tags: ["paletteai-inference-launchpad", "explanation", "vision", "models"]
keywords: ["launchpad", "ai", "vision", "multimodal", "preprocessing", "images", "screenshots", "GLM", "Qwen"]
---

Many of the models the appliance serves are text-only. They generate and reason over language, but they cannot look at a
screenshot, a diagram, or a design mockup. Coding assistants send those images routinely: a developer pastes a
monitoring panel, a UI mockup, or a stack trace captured as a PNG. Without a vision path, those turns fail.

Vision preprocessing is how PaletteAI Inference Launchpad gives a text-only model a way to answer questions about
images. A second, smaller vision model converts each image to text before the request reaches the text model. The text
model then answers as it would for any other prompt. Clients do not call a separate vision endpoint, and text-only
requests never use the vision model.

This page explains the idea. To turn the feature on, refer to
[Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).

## Why a Second Model

A text-only model such as GLM 5.2 cannot accept image input. Replacing it with a vision-capable model of similar quality
is not always an option: the models you already certified for coding work remain text-only.

The alternative is a small vision model that runs alongside the text model on the same appliance. Its only job is to
read each image and write a text extract: transcribed text, a description of charts or diagrams, and the visual evidence
needed to answer the user's question. The text model does the comparison, reasoning, and final answer.

Spectro Cloud has validated this pairing with GLM 5.2 as the text model and Qwen 3.5 9B multimodal as the vision model
on **8 x H200, 8 x B200, and 8 x MI325X** hardware. Other pairings can work when both models fit on the node. For the
certified text models, refer to [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

Both models run on the same physical GPUs at the same time, not on separate GPUs. The text model uses all eight GPUs
for its tensor-parallel computation. The vision model uses the first four of those same eight GPUs. The appliance sizes
each model's VRAM budget so their memory allocations do not overlap, and each model sees only the GPUs it needs — the
text model sees all eight, the vision model sees four. Operators do not have to reserve GPUs manually.

## How an Image Request Is Handled

A request that includes images follows this path. A request that contains only text skips every step that involves the
vision model.

1. The client sends a normal message to the text model. Claude Code, Cursor, and similar tools do this when a user
   pastes or references an image.
2. The appliance authenticates the client and applies quotas, as it does for any other request. Refer to
   [Clients and Quotas](./clients-and-quotas.md).
3. The appliance sends each new image in the current turn to the vision model. The vision model transcribes and
   describes the image. It does not answer the user's question.
4. Each image in the message is replaced with a numbered text extract, so later phrases such as "the second screenshot"
   still resolve.
5. The text model receives the original question plus those extracts, then streams the response back in the usual shape.

Only images added in the current turn go to the vision model. Images from earlier turns are already text in the
conversation, so they are not processed again. Raw images never reach the text model.

## What Clients See

Nothing changes on the client. The request still goes to the text model, or to a model alias such as `claude-opus-4-8`,
and the response comes back in the normal shape. There is no separate vision URL to configure, and coding assistants do
not need a second provider.

In Claude Code, a file path or a pasted screenshot is enough:

```text
What is the prefix cache hit rate in this screenshot, and is that healthy?
```

## Image Limits

The **Max images per request** setting on **Settings** > **Configurations** is a per-turn cap. The default is 8. Keep
each turn at or below this value.

If a turn includes more images than the cap, the appliance processes images up to the cap and skips the rest with a
notice in the request. It does not drop extra images silently. Ask about the remaining images in a follow-up message.

Text-only turns are not affected by this cap.

## The Vision Model Is Not a Chat Model

The vision model is a preprocessing stage, not a general-purpose assistant. It is sized to convert a small number of
images to text. It is not sized for ordinary coding-assistant sessions.

Do not set the vision model as the [default model](./architecture.md#the-default-model), and do not route general chat
or tool-using sessions to it. Keep client routing pointed at the text model. For how routing works, refer to
[Request Routing](./architecture.md#request-routing).

## What Vision Preprocessing Is Not

- Not a cloud vision API. Images stay on the appliance and are processed by the local vision model.
- Not a separate endpoint. Clients keep calling the text model they already use.
- Not a general multi-model placement feature. This path covers one text model plus one vision model for image
  preprocessing. It does not replace deploying models for other purposes.
- Not on by default. You enable it in the console after both models are serving.

## Next Steps

- [Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md) walks through deploying both models and
  turning the feature on.
- [Use Claude Code](../how-to-guides/use-claude-code.md) connects a coding assistant that can paste screenshots.
- [Architecture Overview](./architecture.md) explains how the appliance routes requests.
