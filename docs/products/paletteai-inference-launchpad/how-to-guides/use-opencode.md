---
sidebar_label: "Use OpenCode"
title: "Use PaletteAI Inference Launchpad with OpenCode"
description:
  "Connect the OpenCode terminal coding agent to a PaletteAI Inference Launchpad appliance so that a model on the
  appliance serves every request."
hide_table_of_contents: false
sidebar_position: 12
tags: ["paletteai-inference-launchpad", "opencode", "how-to"]
keywords:
  ["launchpad", "ai", "opencode", "openai-compatible", "custom provider", "opencode.json", "api token", "platform ca"]
---

This guide explains how to connect OpenCode to a PaletteAI Inference Launchpad appliance so that a model running on the
appliance serves every request instead of a cloud provider. You trust the platform certificate authority if the
appliance uses one, add a custom provider to the OpenCode configuration file, and confirm the connection.

## Prerequisites

- OpenCode installed and already working. For installation details, refer to the
  [OpenCode website](https://opencode.ai).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- Your machine able to reach the appliance address. OpenCode sends every request from your own machine.

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-platform-ca" />

OpenCode runs on Node.js, which does not trust the platform CA by default. Keep the saved file in place. The
`NODE_EXTRA_CA_CERTS` variable in the next section points at it, which lets OpenCode trust the appliance without turning
off certificate verification.

## Configure OpenCode

In the console, select the **Connect Coding Agent** button to open the **Connect a coding agent** panel, then open the
**OpenCode** tab. The panel generates the configuration below, already filled in with your appliance address and model
alias, and offers a shell picker for `bash`, `zsh`, and `PowerShell`. For a description of each field, refer to
[OpenCode Configuration](../reference/opencode-reference.md).

1. Put the following configuration in `opencode.json`. Place it in your project folder to apply it to one project, or at
   `~/.config/opencode/opencode.json` to apply it everywhere. Replace `<appliance-host>` with your appliance address.

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "launchpad": {
         "npm": "@ai-sdk/openai-compatible",
         "name": "PaletteAI Inference Launchpad",
         "options": {
           "baseURL": "https://<appliance-host>/v1",
           "apiKey": "{env:LAUNCHPAD_API_KEY}"
         },
         "models": {
           "claude-opus-4-8": {
             "name": "Claude Opus",
             "tool_call": true,
             "reasoning": true,
             "modalities": { "input": ["text", "image"], "output": ["text"] },
             "limit": { "context": 200000, "output": 64000 }
           }
         }
       }
     }
   }
   ```

   Set `baseURL` to your appliance address with the `/v1` path appended. The examples show `https://`; when the
   appliance serves plain HTTP, use `http://` instead. The `apiKey` value reads the token from your shell, so the file
   itself holds no secret.

   Declare `modalities` explicitly. OpenCode resolves a model's capabilities against a public catalog that has no entry
   for a custom provider, so an undeclared input type defaults to unsupported. Without the `image` input declared,
   OpenCode replaces a pasted image with an unsupported note and the appliance never receives it.

   Set `limit` to the real context and output ceilings of the model the appliance serves. The panel fills it with the
   ceilings of the model it generated the configuration for, and `claude-opus-4-8` is an alias the Tier map resolves to
   whatever model the appliance runs. A context ceiling above that model's own makes OpenCode pack a request the
   appliance then rejects.

2. Run both export commands in your shell. Replace `<lpai-token>` with the token you copied.

   ```bash
   export NODE_EXTRA_CA_CERTS=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export LAUNCHPAD_API_KEY=<lpai-token>
   ```

   Omit the `NODE_EXTRA_CA_CERTS` line if the panel showed no CA certificate step. In PowerShell, set each value with
   `$env:<name> = "<value>"` in place of `export`, and use the path the panel writes for Windows,
   `$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

3. Start OpenCode, then pick the `claude-opus-4-8` model.

   ```bash
   opencode
   ```

## Verify the Connection

Run a single prompt to confirm the appliance answers. The `--model` flag takes a `provider/model` value that combines
the provider key from your configuration file with a model name.

```bash
opencode run --model launchpad/claude-opus-4-8 "reply with exactly OPENCODE_OK"
```

```bash hideClipboard title="Expected output"
OPENCODE_OK
```

A reply confirms that the base URL, token, certificate trust, provider, and model routing all work. OpenCode splits the
`--model` value on the first slash, so `launchpad/claude-opus-4-8` selects the `claude-opus-4-8` model from the
`launchpad` provider.

:::tip

If you use a reasoning model and the reply comes back empty, raise the output limit. Hidden reasoning tokens can consume
a small output budget entirely, which leaves no room for the visible reply.

:::

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up each configuration value, refer to [OpenCode Configuration](../reference/opencode-reference.md). To connect a
different coding tool, refer to [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md),
[Use PaletteAI Inference Launchpad with Cursor](./use-cursor.md), or
[Use PaletteAI Inference Launchpad with OpenAI Codex](./use-codex.md). To deploy another model to the appliance, refer
to [Deploy a Model](./deploy-a-model.md).
