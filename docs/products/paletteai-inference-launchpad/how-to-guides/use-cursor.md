---
sidebar_label: "Use Cursor"
title: "Use PaletteAI Inference Launchpad with Cursor"
description:
  "Connect the Cursor code editor to a PaletteAI Inference Launchpad appliance so that a model on the appliance serves
  your requests in Cursor's Ask mode."
hide_table_of_contents: false
sidebar_position: 10
tags: ["paletteai-inference-launchpad", "cursor", "how-to"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "ask mode", "api token", "ca certificate"]
---

This guide explains how to connect Cursor to a PaletteAI Inference Launchpad appliance so that a model running on the
appliance serves your requests instead of a cloud provider. Cursor has no Anthropic endpoint setting, so you trust the
appliance certificate, point Cursor's OpenAI override at the appliance, and confirm that requests reach it.

The console lists these steps for you. In the **Connect a coding agent** panel, the **Cursor** tab shows the values to
enter. For the full list of settings, refer to [Cursor Configuration](../reference/cursor-reference.md).

:::warning

Cursor routes only **Ask** mode requests to a custom endpoint. **Agent**, **Edit**, and **Tab** remain locked to
Cursor's own models. This is a limit of Cursor's bring-your-own-key support, not of the appliance, so those modes do not
use the appliance even after you complete this guide.

:::

## Prerequisites

- Cursor installed and already working. For installation, refer to the [Cursor documentation](https://docs.cursor.com).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- The appliance address reachable from Cursor's cloud servers, presenting a certificate those servers already trust.
  Cursor sends every model request from its own cloud, not from your machine. An appliance on a private network, or one
  that presents only a platform-issued certificate, never receives those requests, and no client-side setting changes
  that. For the connectivity options Cursor offers, refer to Cursor's
  [Private Connectivity](https://cursor.com/docs/enterprise/private-connectivity) documentation.

{/* NEEDS REVIEW: Cursor's Private Connectivity page documents AWS PrivateLink and Cloudflare Tunnel for source control and package registries, not for a customer-hosted model endpoint. Confirm with an SME whether Spectro Cloud wants to recommend a specific way to expose the appliance to Cursor's cloud. */}

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-the-platform-ca" />

Importing the platform CA lets Cursor on your machine trust the appliance. Ask mode reaches the appliance only when the
endpoint Cursor's cloud connects to presents a certificate that Cursor's cloud already trusts. If the appliance presents
only a platform-issued certificate to Cursor's cloud, Ask mode cannot reach it, and no client-side step changes that.

## Configure Cursor

1. Import the platform CA certificate into your operating system trust store, and then restart Cursor. Cursor is a
   graphical application, so it reads the operating system trust store rather than a shell variable. This step lets
   Cursor on your machine trust the appliance, so Cursor's own client-side validation of the base URL and the API key
   succeeds. It does not enable the model request itself, which Cursor's cloud servers send and which never consults
   your machine's trust store.

2. In Cursor, open **Settings** > **Models**.

3. In the **OpenAI API Key** field, enter your `lpai_` token.

4. Enable **Override OpenAI Base URL**, and enter your appliance address with the `/v1` path appended, such as
   `https://<appliance-host>/v1`.

5. In the model list, enable a GPT model such as `gpt-5.6`. The appliance seeds a `gpt-` alias and routes it to the
   model it serves, so you do not pick a backend model.

## Verify the Connection

1. In Cursor, open a chat and set the mode to **Ask**.

2. In the model picker, select the model you enabled, such as `gpt-5.6`.

3. Send a test prompt.

   ```text
   reply with exactly CURSOR_OK and nothing else
   ```

4. Confirm that Cursor displays the reply `CURSOR_OK`.

A reply confirms that the base URL, the token, and model routing all work, and that Cursor's cloud trusted the appliance
certificate.

:::warning

If Cursor returns `We're having trouble finding the resource you requested`, Cursor's cloud did not reach the appliance.
Confirm that the appliance address resolves and answers from outside your network, and that its certificate is one
Cursor's cloud trusts. If the appliance presents only a platform-issued certificate to Cursor's cloud, Ask mode cannot
reach it, and no client-side step changes that. If Cursor answers from its own backend instead of the appliance, the
model name matches an entry in Cursor's catalog. Ask an operator to add a uniquely named alias on the client's
**Routing** tab, as described in
[Manage a Client's Model Access](./manage-client-model-access.md#route-a-client-to-specific-models). Cursor does not
list that name, so open **Settings** > **Models**, select **Add model**, enter the alias name, and then select it in
chat.

:::

{/* NEEDS REVIEW: the connect panel tells the operator to enable a GPT model such as gpt-5.6, which may match an entry in Cursor's own catalog and route to Cursor's backend instead of the appliance. Confirm with an SME whether gpt-5.6 collides, and whether the uniquely named alias remedy should be the primary instruction. */}

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up the base URL, model name, and the Cursor modes the appliance supports, refer to
[Cursor Configuration](../reference/cursor-reference.md). To connect a different coding tool, refer to
[Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md),
[Use PaletteAI Inference Launchpad with OpenAI Codex](./use-codex.md), or
[Use PaletteAI Inference Launchpad with OpenCode](./use-opencode.md).
