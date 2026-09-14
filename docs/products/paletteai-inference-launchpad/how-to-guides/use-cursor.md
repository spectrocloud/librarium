---
sidebar_label: "Use Cursor"
title: "Use PaletteAI Inference Launchpad with Cursor"
description:
  "Connect the Cursor code editor to a PaletteAI Inference Launchpad appliance so that a model on the appliance serves
  your requests in Cursor's Ask mode."
hide_table_of_contents: false
sidebar_position: 10
tags: ["paletteai-inference-launchpad", "cursor", "how-to"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "model alias", "ask mode", "api token", "platform ca"]
---

This guide explains how to connect Cursor to a PaletteAI Inference Launchpad appliance so that a model running on the
appliance serves your requests instead of a cloud provider. You trust the platform certificate authority if the
appliance uses one, point Cursor at the appliance, and confirm that requests route through the appliance.

:::warning

Cursor routes only **Ask** mode (chat) requests to a custom endpoint. Agent, Edit, and Tab remain locked to Cursor's own
models. This is a limitation of Cursor's bring-your-own-key support, not of the appliance, so those modes do not use the
appliance even after you complete this guide.

:::

## Cursor Requires a Reachable Endpoint

Cursor sends model requests from Cursor's own cloud servers, not from your machine. Every other coding agent in this
documentation set sends requests from the machine you run it on, and that difference decides whether Cursor can reach
your appliance at all.

Cursor cloud cannot reach the appliance in either of these cases:

- The appliance sits on a private network that is not reachable from the public internet. Cursor cloud never receives
  the request.
- The appliance presents only a certificate issued by the platform's own certificate authority. Cursor cloud does not
  trust that authority, and Cursor offers no way to skip certificate verification.

Importing the platform CA on your own machine does not change either case, because your machine is not what sends the
model request, as described in
[Download and Trust the Platform CA Certificate](#download-and-trust-the-platform-ca-certificate). To use Cursor with an
appliance in either state, expose the appliance inference endpoint at an address Cursor cloud can reach, with a publicly
trusted TLS certificate of its own, and enter that address as the base URL in place of the appliance address. For the
connectivity options Cursor documents, refer to Cursor's
[Private Connectivity](https://cursor.com/docs/enterprise/network-configuration#private-connectivity) documentation.

This is a Cursor product limit, not an appliance defect.

{/* NEEDS REVIEW: Cursor's private connectivity section documents AWS PrivateLink and Cloudflare Tunnel for private source control systems and package registries, not for custom OpenAI-compatible model endpoints. Confirm with an SME which connectivity path Cursor supports for a custom base URL. */}

## Prerequisites

- Cursor installed and already working. For installation, refer to the [Cursor documentation](https://docs.cursor.com).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md).
  Generating the token can require operator access.
- The appliance inference endpoint reachable from Cursor's cloud servers at a DNS name with a valid, publicly trusted
  TLS certificate, as described in [Cursor Requires a Reachable Endpoint](#cursor-requires-a-reachable-endpoint).

## Download and Trust the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-platform-ca" />

The **Connect a coding agent** panel is agent-generic, so it shows the **CA certificate** step on every tab, including
the Cursor tab. Cursor is a desktop application, so an environment variable in your shell does not reach it. To follow
the panel's step, import the platform CA into your operating system trust store, then restart Cursor.

For Cursor, the import alone never completes the connection. Cursor sends the model request from its own cloud servers
rather than from your machine, so the base URL still has to be an address Cursor cloud can reach with a publicly trusted
certificate of its own, as described in [Cursor Requires a Reachable Endpoint](#cursor-requires-a-reachable-endpoint).

On macOS, open **Keychain Access**, select the **System** keychain, and drag `palette-ai-inference-launchpad-ca.crt`
from your Downloads folder into it. Then open the certificate, expand **Trust**, and set **When using this certificate**
to **Always Trust**. On another operating system, add the certificate to the system trust store with that operating
system's own tooling.

:::warning

Trusting this root makes the platform certificate authority trusted for every host the machine connects to, so do this
only on a machine you control for an appliance you administer. Remove the certificate when you no longer need it. On
macOS, select it in the **System** keychain in **Keychain Access** and delete it.

:::

{/* NEEDS REVIEW: confirm with an SME which Cursor traffic, if any, the local platform CA import actually serves, given that the model request originates from Cursor cloud. If it serves none, say so here and tell the reader to skip the CA step on the Cursor tab. Only the macOS trust-store path was confirmed on a real appliance. */}

## Configure Cursor

In the console, select the **Connect Coding Agent** button to open the **Connect a coding agent** panel, then open the
**Cursor** tab. The panel lists these same steps with your appliance address and model alias filled in. For the full
list of settings and their example values, refer to [Cursor Configuration](../reference/cursor-reference.md).

1. In Cursor, open **Settings** > **Models**.

2. Under **OpenAI API Key**, paste your `lpai_` token.

3. Enable **Override OpenAI Base URL**, and enter your appliance address with the `/v1` path appended, such as
   `https://<appliance-host>/v1`.

4. Enable a GPT model such as `gpt-5.6` in the model list, then select it in chat.

## Verify the Connection

Confirm that Cursor routes a request to the appliance instead of to its own backend.

1. In Cursor, open a chat and set the mode to **Ask**.

2. In the model picker, select the model you enabled, such as `gpt-5.6`.

3. Send a test prompt.

   ```text
   reply with exactly CURSOR_OK and nothing else
   ```

4. Confirm that Cursor displays the reply `CURSOR_OK`.

A reply confirms that the base URL, token, certificate trust, model, and routing all work.

:::warning

If Cursor returns `We're having trouble finding the resource you requested`, or the reply arrives but appliance usage
does not increase, Cursor matched the model name against its own catalog and served the request from its own backend.
Ask an operator to map an alias name that does not appear in Cursor's catalog, then enable that name in Cursor instead.
To confirm which requests the appliance served, refer to [View Client Usage](./view-client-usage.md).

:::

{/* NEEDS REVIEW: the console's Cursor tab says to enable a GPT model such as `gpt-5.6`. Confirm with an SME whether that name collides with Cursor's built-in catalog and routes to Cursor's own backend. If it does, the panel copy needs to change and this guide should lead with a unique alias name. */}

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up the base URL, model name, and the Cursor modes the appliance supports, refer to
[Cursor Configuration](../reference/cursor-reference.md).
