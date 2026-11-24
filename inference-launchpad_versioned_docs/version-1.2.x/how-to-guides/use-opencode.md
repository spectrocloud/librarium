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
  [
    "launchpad",
    "ai",
    "opencode",
    "openai-compatible",
    "custom provider",
    "opencode.json",
    "api token",
    "ca certificate",
  ]
---

This guide explains how to connect OpenCode to a PaletteAI Inference Launchpad appliance so that a model running on the
appliance serves every request instead of a cloud provider. OpenCode reaches the appliance through its OpenAI-compatible
`/v1` API, so you trust the appliance certificate, add a custom provider to the OpenCode configuration file, and confirm
the connection.

The console assembles these values for you. In the **Connect a coding agent** panel, the **OpenCode** tab lists the
steps and generates the configuration for `bash`, `zsh`, or PowerShell. For what each field does, refer to
[OpenCode Configuration](../reference/opencode-reference.md).

## Prerequisites

- OpenCode installed and already working. For installation details, refer to the
  [OpenCode website](https://opencode.ai).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- Network access from your machine to the appliance. OpenCode sends each request from the machine it runs on, so an
  appliance on a private network works.

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-the-platform-ca" />

## Configure OpenCode

1. Add the following provider to an `opencode.json` file. Use `~/.config/opencode/opencode.json` to apply the provider
   to every project, or `opencode.json` in a project directory to apply it to that project only. Replace
   `<appliance-host>` with your appliance address.

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

2. Run the following commands in your shell. The configuration file reads the token from the environment, so the token
   never lands in the file. Replace `<lpai-token>` with your token.

   ```bash
   export NODE_EXTRA_CA_CERTS=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export LAUNCHPAD_API_KEY=<lpai-token>
   ```

   Include the `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. OpenCode runs on
   Node.js, and this variable adds the platform CA to the certificates Node.js trusts, so certificate verification stays
   on. Set it in the shell before you start OpenCode. On PowerShell, the panel writes the same path as
   `$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Verify the Connection

1. Run a single prompt to confirm the appliance answers. The `--model` flag takes a `provider/model` value that combines
   the provider key from your configuration file with a model name.

   ```bash
   opencode run --model launchpad/claude-opus-4-8 "reply with exactly OPENCODE_OK"
   ```

   ```bash hideClipboard title="Expected output"
   OPENCODE_OK
   ```

   A reply confirms that the certificate, base URL, token, provider, and model routing all work.

2. Start an interactive session, and then select the `claude-opus-4-8` model.

   ```bash
   opencode
   ```

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
