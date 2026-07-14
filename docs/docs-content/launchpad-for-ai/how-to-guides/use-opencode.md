---
sidebar_label: "Use OpenCode"
title: "Use Launchpad for AI with OpenCode"
description:
  "Connect the OpenCode terminal coding agent to a Launchpad for AI appliance so that a model on the appliance serves
  every request."
hide_table_of_contents: false
sidebar_position: 6
tags: ["launchpad-for-ai", "opencode", "how-to"]
keywords: ["launchpad", "ai", "opencode", "openai-compatible", "custom provider", "opencode.json", "api token"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This guide explains how to connect OpenCode to a Launchpad for AI appliance so that a model running on the appliance
serves every request instead of a cloud provider. You generate an API token, add a custom provider to the OpenCode
configuration file, and confirm the connection.

## Prerequisites

- OpenCode installed and already working. For installation details, refer to the
  [OpenCode website](https://opencode.ai).
- A running Launchpad for AI appliance with at least one model deployed and serving. To deploy a model, refer to
  [Deploy a Model](./deploy-a-model.md).
- Admin access to the Launchpad for AI console, or an API token that an administrator generated for you.

## Generate an API Token

<PartialsComponent category="launchpad-for-ai" name="generate-api-token" />

## Configure OpenCode

OpenCode connects to any OpenAI-compatible endpoint through a custom provider. Add a provider for the appliance to the
OpenCode configuration file. For a description of each field, refer to
[OpenCode Configuration](../reference/opencode-reference.md).

1. Add the following provider to the OpenCode configuration file at `~/.config/opencode/opencode.json`. Replace
   `<appliance-host>` with your appliance address and `<lpai-token>` with the token you copied.

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "launchpad": {
         "npm": "@ai-sdk/openai-compatible",
         "name": "Launchpad for AI",
         "options": {
           "baseURL": "https://<appliance-host>/v1",
           "apiKey": "<lpai-token>"
         },
         "models": {
           "glm-5.2": { "name": "GLM-5.2 (Launchpad)" }
         }
       }
     }
   }
   ```

2. Set `baseURL` to your appliance address with the `/v1` path appended.

3. Set `apiKey` to your `lpai_` token.

4. Under `models`, list each model id the appliance serves that you want to use, such as `glm-5.2`. The `launchpad` key
   is a name you choose for the provider. OpenCode identifies a model by that provider name and a model id joined with a
   slash, such as `launchpad/glm-5.2`, which you pass to the `--model` flag when you run OpenCode in the next section.

5. We strongly recommend giving the appliance a DNS name and a valid, publicly trusted TLS certificate. The connection
   uses HTTPS, so a valid certificate protects your token in transit.

   :::warning

   If the appliance uses a self-signed certificate, OpenCode rejects the connection by default because it runs on
   Node.js. As a temporary measure for testing, set `NODE_TLS_REJECT_UNAUTHORIZED=0` before you start OpenCode. This
   disables certificate verification, so do not use it outside short-lived testing.

   :::

## Verify the Connection

Run a single prompt to confirm the appliance answers. The `--model` flag takes a `provider/model` value that combines
the provider key from your configuration file with a model id.

```bash
opencode run --model launchpad/glm-5.2 "reply with exactly OPENCODE_OK"
```

```bash hideClipboard title="Expected output"
OPENCODE_OK
```

A reply confirms that the base URL, token, provider, and model routing all work. OpenCode splits the `--model` value on
the first slash, so `launchpad/glm-5.2` selects the `glm-5.2` model from the `launchpad` provider.

:::tip

If you use a reasoning model and the reply comes back empty, raise the output limit. Hidden reasoning tokens can consume
a small output budget entirely, which leaves no room for the visible reply.

:::

## Request Routing and Quotas

<PartialsComponent category="launchpad-for-ai" name="request-routing-and-quotas" />

## Next Steps

To look up each configuration value, refer to [OpenCode Configuration](../reference/opencode-reference.md). To connect a
different coding tool, refer to [Use Launchpad for AI with Claude Code](./use-claude-code.md),
[Use Launchpad for AI with Cursor](./use-cursor.md), or [Use Launchpad for AI with OpenAI Codex](./use-codex.md). To
deploy another model to the appliance, refer to [Deploy a Model](./deploy-a-model.md).
