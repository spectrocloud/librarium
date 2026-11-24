---
sidebar_label: "Vision Preprocessing"
title: "Vision Preprocessing"
description:
  "An explanation of vision preprocessing in PaletteAI Inference Launchpad: how a text-only model answers questions
  about images, how a local or external reader reads them, what changes for clients, and the limits that apply."
hide_table_of_contents: false
sidebar_position: 1.5
tags: ["paletteai-inference-launchpad", "explanation", "vision", "models"]
keywords:
  [
    "launchpad",
    "ai",
    "vision",
    "multimodal",
    "preprocessing",
    "images",
    "screenshots",
    "GLM",
    "Qwen",
    "external model",
    "reader",
  ]
---

Many of the models the appliance serves are text-only. They generate and reason over language, but they cannot look at a
screenshot, a diagram, or a design mockup. Coding assistants send those images routinely: a developer pastes a
monitoring panel, a UI mockup, or a stack trace captured as a PNG. Without a vision path, those turns fail.

Vision preprocessing is how PaletteAI Inference Launchpad gives a text-only model a way to answer questions about
images. A model that can read images converts each image to text before the request reaches the text model. This model
is called the reader. The text model then answers as it would for any other prompt. Clients do not call a separate
vision endpoint. Text-only requests never use the reader.

The reader is one of the following:

- A local reader, which is a smaller vision model that runs on the appliance next to the text model. This is the
  default.

- An external reader, which is a model on an external inference endpoint. With an external reader, client images leave
  the appliance.

This page explains the idea. To turn the feature on with a local reader, refer to
[Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md). To use an external reader, refer to
[Read Images with an External Model](../how-to-guides/read-images-with-an-external-model.md).

## Local and External Readers

The choice depends on your hardware and on whether client images may leave the appliance.

| **Consideration**                             | **Local reader**                                                                       | **External reader**                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| GPU memory                                    | Needs a vision model next to the text model. The model pairing must fit your hardware. | Needs no vision model on the appliance.                                   |
| Client images                                 | Stay on the appliance.                                                                 | Leave the appliance for the endpoint that you choose.                     |
| External inferencing blocked on the appliance | Works.                                                                                 | Unavailable.                                                              |
| Cost of each read                             | Uses the appliance's GPUs.                                                             | Counts as external inferencing spend for the client that sent the images. |

A local reader fits when client images must stay on the appliance. An external reader fits when the appliance has no
room for a second model and client images may leave the appliance. With an external reader, a
[local fallback model](#the-local-fallback-model) can read images for clients that may not use the external reader.

## Why a Second Model

A text-only model such as GLM 5.2 cannot accept image input. Replacing it with a vision-capable model of similar quality
is not always an option: the models you already certified for coding work remain text-only.

The alternative is a small vision model that runs alongside the text model on the same appliance. Its only job is to
read each image and write a text extract: transcribed text, a description of charts or diagrams, and the visual evidence
needed to answer the user's question. The text model does the comparison, reasoning, and final answer.

Spectro Cloud has validated this pairing with GLM 5.2 as the text model and Qwen 3.5 9B multimodal as the vision model
on **8 x MI325X, 8 x B200, and 8 x H200** hardware. Other pairings can work when both models fit on the node. For the
certified text models, refer to [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

The tuned deploy configurations for both halves, covering memory budgets, tensor-parallel widths, and engine arguments,
ship in the catalog as `glm-5.2-shared-with-vision` and `qwen-3.5-9B-vision`, with per-GPU-family variants for MI325X,
B200, and H200. Operators choose the two catalog entries from the console; the appliance selects the right variant for
the node.

A local reader needs a vision-mode text model. A vision-mode text model has a catalog entry that ends in
`-shared-with-vision`. It shares its GPUs with the vision model of its group. The vision model's catalog entry ends in
`-vision`. The semantic router shares the same GPUs, so an appliance runs either text-mode models or vision-mode models,
not both. For how the mode is decided, refer to [One Mode per Appliance](./routing-behavior.md#one-mode-per-appliance).

Both models run on the same physical GPUs at the same time, not on separate GPUs. The text model uses all eight GPUs for
its tensor-parallel computation. The vision model uses the first four of those same eight GPUs. The appliance sizes each
model's VRAM budget so their memory allocations do not overlap, and each model sees only the GPUs it needs. The text
model sees all eight, the vision model sees four. Operators do not have to reserve GPUs manually.

## An External Reader

A model on an external inference endpoint reads each image, and the text model on the appliance still writes the answer.

The trade-off is data residency. With an external reader, client images leave the appliance. When you choose an external
reader, the console asks you to confirm before it saves. The confirmation names the reader model and the endpoint, and
it states which key pays for each read.

Each external read adds one entry to **Activity history** on the **Diagnose** page. The entry names the reader model,
the endpoint, and the signed-in administrator who chose the external reader.

### What Leaves the Appliance

For each image request that goes to the external reader, the appliance sends the following to the endpoint:

- The images in the current turn, up to the [image cap](#image-limits). Images from earlier turns are never sent.

- Up to 4,096 characters of the client's current question, as context for the reader. The appliance sends the question
  only when it passes the [personal data check](./semantic-router-guard.md#the-two-checks).

When a message gives an image as a web address, the appliance downloads the image and sends the image itself.

### Which Clients Can Use the External Reader

The appliance checks each read as if the client had sent its own request to that endpoint. A client's images go to the
external reader only when all of the following are true:

- External inferencing is allowed on the appliance.

- The client's policy turns on external inferencing and lists the endpoint. A client that overrides its policy needs the
  same settings on the client.

- The reader model is on the client's model allowlist.

- The client has not used up its **Daily limit** for that endpoint.

Each read is paid for with the same key as the client's normal requests to that endpoint.

While external inferencing is blocked on the appliance, no image leaves it. In the console, the **External model**
choice is unavailable, and the **Reader** field shows the reason. A request that is pinned to the appliance also sends
no image out.

### The Local Fallback Model

When a client cannot use the external reader, the local fallback model reads its images on the appliance. For example,
the client might have no access to the endpoint, or it might have used up its **Daily limit** for that endpoint. The
fallback must be a vision model on the appliance.

With no fallback model, the appliance refuses the image request and gives the reason. A text-only request from the same
client is not affected.

### When a Read Fails

When the endpoint cannot complete a read, the request fails with an error. The appliance does not try the read again on
the local fallback model.

### Cost of an External Read

An external read is priced at the rate of the endpoint's model. It counts as the client's external inferencing spend. It
also counts against the client's **Daily limit** for the endpoint. Before the read, the appliance sets aside the highest
possible cost of the read from that limit. After the read, it charges only the actual cost.

A read never counts against the client's local quota, and it never counts as a saving. A read that returns is charged,
even when the request fails later. For how the reads appear on the **Usage** page, refer to
[Images Read by an External Model](./usage-pricing.md#images-read-by-an-external-model).

## How an Image Request Is Handled

A request that includes images follows this path. A request that contains only text skips every step that involves the
reader.

1. The client sends a normal message to the text model. Claude Code, Cursor, and similar tools do this when a user
   pastes or references an image.

2. The appliance authenticates the client and applies quotas, as it does for any other request. Refer to
   [Clients and Quotas](./clients-and-quotas.md).

3. The appliance sends each new image in the current turn to the reader. The reader transcribes and describes the image.
   It does not answer the user's question.

4. Each image in the message is replaced with a numbered text extract, so later phrases such as "the second screenshot"
   still resolve.

5. The text model receives the original question plus those extracts, then streams the response back in the usual shape.

Only images added in the current turn go to the reader. Images from earlier turns are already text in the conversation,
so they are not processed again. Raw images never reach the text model.

An image request that sends `auto` is routed by the semantic router like any other `auto` request. For how the semantic
router picks a model, refer to [Routing Behavior](./routing-behavior.md).

## What Changes on the Client

Nothing changes on the client. The request still goes to the text model, or to a model alias such as `claude-opus-4-8`,
and the response comes back in the normal shape. There is no separate vision URL to configure, and coding assistants do
not need a second provider.

In Claude Code, a file path or a pasted screenshot is enough.

```text
What is the prefix cache hit rate in this screenshot, and is that healthy?
```

## Image Limits

A per-turn cap governs how many images a single request can carry. The default is 8.

When a turn carries more images than the cap allows, the appliance processes images up to the limit and skips the rest
with a notice in the request rather than dropping them silently, so the client can tell that something was left out.
Text-only turns are not affected by the cap.

The cap is configurable. For where the setting lives and how to change it, refer to
[Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).

## The Vision Model Is Not a Chat Model

A local vision model is a preprocessing stage, not a general-purpose assistant. It is sized to convert a small number of
images to text, not to hold ordinary coding-assistant sessions.

That sizing is what makes it unsuited as the target of general chat and tool-using traffic. It shares each GPU with the
text model and receives only a small share of that memory, so it has neither the context window nor the throughput such
sessions expect. Client routing therefore stays pointed at the text model. For how routing works, refer to
[Request Routing](./architecture.md#request-routing).

## What Vision Preprocessing Is Not

- Not a cloud service by default. The default local reader keeps images on the appliance. With an external reader, each
  image goes to the endpoint that you choose.

- Not a separate endpoint. Clients keep calling the text model they already use.

- Not a general multi-model placement feature. This path covers one text model plus one reader for image preprocessing.
  It does not replace deploying models for other purposes.

- Not on by default. You turn it on in the console.

## Next Steps

- [Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md) walks through deploying both models and
  turning the feature on.

- [Read Images with an External Model](../how-to-guides/read-images-with-an-external-model.md) walks through choosing a
  model on an external inference endpoint as the reader.

- [Use Claude Code](../how-to-guides/use-claude-code.md) connects a coding assistant that can paste screenshots.

- [Architecture Overview](./architecture.md) explains how the appliance routes requests.
