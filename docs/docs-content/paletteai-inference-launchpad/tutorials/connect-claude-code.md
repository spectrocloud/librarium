---
sidebar_label: "Connect Claude Code to Your Appliance"
title: "Connect Claude Code to Your Appliance"
description:
  "Hands-on tutorial that takes you from an installed PaletteAI Inference Launchpad appliance to a working Claude Code
  session answered entirely by a model on your own hardware."
sidebar_position: 0
toc_max_heading_level: 2
tags: ["paletteai-inference-launchpad", "claude-code", "tutorial"]
category: ["tutorial"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "tutorial", "getting started"]
---

PaletteAI Inference Launchpad is an appliance that serves large language models from your own hardware. Once a model is
serving, you point a coding assistant at the appliance and every request is answered locally instead of by a hosted API.

In this tutorial, you connect [Claude Code](https://docs.claude.com/en/docs/claude-code) to an installed appliance and
send a prompt that your own hardware answers. You start from an appliance that already serves a model, and you finish
with a reply your appliance produced, visible in the console's usage view.

In this tutorial, you will:

- Confirm that a model is serving on your appliance.
- Create a client and mint an API token.
- Point Claude Code at the appliance and send your first prompt.
- Confirm in the console that your appliance served the request.

The tasks build on each other, so complete them in order. You do the operator tasks in the appliance console and the
Claude Code tasks on your own workstation. Plan for about 15 minutes.

## Prerequisites {#prerequisites}

To complete this tutorial, ensure you have the following in place:

- A running PaletteAI Inference Launchpad appliance, installed with the console reachable and operator access. To
  install the appliance, refer to [Install the Appliance](../how-to-guides/install-the-appliance.md).
- At least one model deployed and serving on the appliance. A standard installation deploys your first model as part of
  setup. If you need to deploy one, refer to [Deploy a Model](../how-to-guides/deploy-a-model.md).
- [Claude Code](https://docs.claude.com/en/docs/claude-code) installed on your workstation and already working against
  Anthropic's hosted API.
- Network access from your workstation to the appliance address.

## Confirm a Model Is Serving

Before you connect Claude Code, confirm the appliance has a model ready to answer requests.

1. Open the appliance console in a browser and sign in.

2. From the left main menu, select **Cluster**.

3. Locate a model in the _Model_ table and confirm that its health reads `N/N healthy` and its state is `ready` or
   `serving`.

If no model is serving, deploy one by following [Deploy a Model](../how-to-guides/deploy-a-model.md), and then return
here.

:::info

Claude Code asks for a model by a Claude alias, such as `claude-opus-4-8`, and the appliance maps that alias to a model
it serves. You do not pick the backend model yourself. A standard installation brings up your model when the appliance
starts, so the alias resolves to it. For how the appliance routes requests, refer to
[Architecture](../explanation/architecture.md#request-routing).

:::

## Create a Client and API Token

A client is a named team or workload, and its API token is the credential Claude Code uses to authenticate. Create one
and mint its first token.

1. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

2. Select **Add client**. The **Add client** wizard opens on the **Overview** step.

3. Enter a **Client name**, such as `tutorial`, and then select **Next step**.

4. Step past the optional **Quotas**, **Egress**, and **Routing** steps by selecting **Next step** on each. You do not
   need them for this tutorial.

5. On the **API tokens** step, select **Mint an API token**. Leave **Expires** blank so the token does not expire during
   the tutorial.

6. Select **Create client**.

7. When the console reveals the token, select **Copy**. The token begins with `lpai_`.

:::warning

The console shows the token only once and stores only a hash of it. Copy it now and keep it somewhere safe. If you lose
it, revoke the token and mint a new one.

:::

For everything a client and its tokens can do, refer to [Create a Client](../how-to-guides/create-a-client.md).

## Connect Claude Code

Now move to your workstation and point Claude Code at the appliance. You need the appliance address and the token you
just copied.

Set the following environment variables, replacing `<appliance-host>` with your appliance address and `<lpai-token>`
with your token.

```bash
export ANTHROPIC_BASE_URL=https://<appliance-host>
export ANTHROPIC_AUTH_TOKEN=<lpai-token>
```

Set `ANTHROPIC_BASE_URL` to the appliance address with no path. Do not append `/v1`, because Claude Code adds the API
path itself. `ANTHROPIC_AUTH_TOKEN` carries your `lpai_` token.

:::warning

If your appliance uses a self-signed certificate, Claude Code rejects the connection by default. As a temporary measure
for this tutorial only, set `NODE_TLS_REJECT_UNAUTHORIZED=0` before you start Claude Code. This disables certificate
verification, so do not use it outside short-lived testing. For production, give the appliance a DNS name and a valid,
publicly trusted TLS certificate.

:::

## Send Your First Prompt

Send a single prompt so the appliance answers it.

```bash
claude --print "reply with exactly CC_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CC_OK
```

A reply confirms that the base URL, the token, and model routing all work together. Your appliance, not Anthropic's
hosted API, produced that reply.

## Validate

Confirm two things: that Claude Code is pointed at your appliance, and that the request registered on the appliance.

First, in Claude Code, run the `/status` command and review the **Anthropic base URL** and **Auth token** lines. The
base URL is your appliance address, and the auth token is the `lpai_` token you set.

Next, confirm the appliance counted the request.

1. In the console, select **Usage** from the left main menu.

2. Select the **By client** tab, and then select the `tutorial` client.

3. Confirm the token you minted shows a request count of at least one, along with input and output tokens.

The conversation-routing breakdown shows which model handled the request. It names the model your appliance serves,
which confirms your hardware answered the prompt end to end.

:::info

Usage counts reflect activity since the appliance gateway last restarted, so a freshly started appliance shows only your
tutorial traffic.

:::

## Cleanup

The client and token cost nothing to keep, but if you created them only to follow this tutorial, remove them.

1. From the left main menu, select **Access & Policy**.

2. Select the `tutorial` client, open its **API tokens** section, and revoke the token.

3. Delete the `tutorial` client.

For the exact controls, refer to [Revoke or Delete a Client](../how-to-guides/revoke-or-delete-a-client.md).

## Next Steps

You connected Claude Code to your appliance and served a prompt from your own hardware. From here:

- Configure how much a client can consume with [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md).
- Look up every Claude Code configuration value in [Claude Code Configuration](../reference/claude-code-reference.md).
- Connect another coding assistant, such as [Cursor](../how-to-guides/use-cursor.md),
  [OpenAI Codex](../how-to-guides/use-codex.md), or [OpenCode](../how-to-guides/use-opencode.md).
