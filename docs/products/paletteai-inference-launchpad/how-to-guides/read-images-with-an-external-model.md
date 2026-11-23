---
sidebar_label: "Read Images with an External Model"
title: "Read Images with an External Model"
description:
  "Step-by-step guidance for platform administrators on how to have a model on an external inference endpoint read
  client images, so that a text-only model on a PaletteAI Inference Launchpad appliance can answer questions about them."
hide_table_of_contents: false
sidebar_position: 2.35
tags: ["paletteai-inference-launchpad", "models", "vision", "external-inferencing", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "vision",
    "multimodal",
    "preprocessing",
    "images",
    "external model",
    "external inference endpoint",
    "reader",
  ]
---

This guide explains how to have a model on an external inference endpoint read the images that clients send. A text-only
model on the appliance then answers questions about those images. You do not need a vision model on the appliance. To
learn which clients the external reader serves and what it sends off the appliance, refer to
[An External Reader](../explanation/vision-preprocessing.md#an-external-reader).

:::warning

With an external reader, client images leave the appliance. Each image goes to the endpoint that you choose.

:::

## Prerequisites

<!-- vale Vale.Terms = NO -->

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- A text-only model that is deployed and serving. To deploy a model, refer to [Deploy a Model](./deploy-a-model.md).

- An external inference endpoint that is registered with its key. From the left main menu, select **Settings**. On the
  **Settings** menu, under **External access**, select **Ext. Inference Endpoints**. Confirm that the endpoint's status
  lists a model that can read images. To add an endpoint, refer to
  [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

- External inferencing allowed on the appliance. From the left main menu, select **Settings**. On the **Settings** menu,
  under **External access**, select **External Inferencing**. Confirm that the section reads **External inferencing is
  on**.

- For each client that sends images, a policy that turns on external inferencing and lists the endpoint. A client that
  overrides its policy needs the same settings on the client. To set this up, refer to
  [Authorize a Policy](./register-an-external-inference-endpoint.md#authorize-a-policy) and
  [Allow a Client to Reach External Models](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

- For each client that sends images, the reader model on the client's model allowlist.

- _(Local fallback or local reader only)_ A vision model that is deployed and serving on the appliance. Refer to
  [Deploy Both Models](./enable-vision-preprocessing.md#deploy-both-models).

<!-- vale Vale.Terms = YES -->

## Choose the External Reader

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Model Management**, select **Multimodal Preprocessing**.

3. Turn on **Enable vision preprocessing**.

4. Under **Reader**, select **External model**.

5. From the **Endpoint** drop-down menu, select the endpoint.

6. From the **Model** drop-down menu, select a model that can read images.

7. _(Optional)_ From the **Local fallback model** drop-down menu, select a vision model on the appliance.

8. _(Optional)_ In **Max images per request**, enter a different per-turn image cap. The default is `8`.

9. Select **Apply**.

   A confirmation dialog opens. Its title is **Read images on**, followed by the endpoint name. The dialog names the
   model and the endpoint. It warns that client images leave the appliance and states which key pays for each read. To
   save nothing, select **Cancel**.

10. Select **Use External Model**.

    The appliance saves the external reader.

## Validate

1. Connect a coding assistant to the appliance. Use the API token of a client that can reach the endpoint. Refer to
   [Use Claude Code](./use-claude-code.md).

2. Start a session that uses the text-only model.

3. Paste a simple image, such as a solid-color PNG, and ask what it shows.

4. Confirm that the reply matches the image. For a solid red image, the reply should say red.

5. From the left main menu, select **Diagnose**.

6. On the **Health** tab, in **Activity history**, confirm that the read added one entry. The entry names your model and
   endpoint.

7. From the left main menu, select **Overview**.

8. On the **Vision preprocessing** card, confirm that **images read by an external model** is above zero.

## Remove the External Reader

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Model Management**, select **Multimodal Preprocessing**.

3. Choose one of the following:

   - To read images on the appliance instead, select **Local model** under **Reader**. Then select the **Vision engine**
     and the **Vision model**.

   - To turn off vision preprocessing, turn off **Enable vision preprocessing**.

4. Select **Apply**.

## Next Steps

- [View Token Usage for a Model](./view-token-usage.md#view-token-usage-for-a-model) to find the reads under the
  external model on the **By Model** tab.
