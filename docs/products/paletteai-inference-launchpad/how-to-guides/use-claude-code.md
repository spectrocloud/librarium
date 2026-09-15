---
sidebar_label: "Use Claude Code"
title: "Use PaletteAI Inference Launchpad with Claude Code"
description:
  "Connect Anthropic's Claude Code coding agent to a PaletteAI Inference Launchpad appliance so that a model on the
  appliance serves every request."
hide_table_of_contents: false
sidebar_position: 9
tags: ["paletteai-inference-launchpad", "claude-code", "how-to"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "api token", "ca certificate"]
---

This guide explains how to connect Claude Code to a PaletteAI Inference Launchpad appliance so that a model running on
the appliance serves every request instead of Anthropic's hosted API. Claude Code reaches the appliance over the
Anthropic API, so you trust the appliance certificate, set a group of environment variables, and confirm the connection.

The console assembles these values for you. In the **Connect a coding agent** panel, the **Claude Code CLI** tab lists
the steps and generates an environment block for `bash`, `zsh`, or PowerShell. For what each value does, refer to
[Claude Code Configuration](../reference/claude-code-reference.md).

## Prerequisites

- Claude Code installed and already working against Anthropic's hosted API. For installation, refer to the
  [Claude Code documentation](https://docs.claude.com/en/docs/claude-code).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-the-platform-ca" />

## Configure Claude Code

1. On the machine where you run Claude Code, set the following environment variables. Replace `<appliance-host>` with
   your appliance address.

   ```bash
   export NODE_EXTRA_CA_CERTS=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export ANTHROPIC_BASE_URL=https://<appliance-host>
   export ANTHROPIC_MODEL=claude-opus-4-8
   export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-8
   export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-5
   export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
   export ANTHROPIC_DEFAULT_FABLE_MODEL=claude-fable-5
   export CLAUDE_CODE_EFFORT_LEVEL=auto
   export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
   ```

   Include the `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. Claude Code runs on
   Node.js, and this variable adds the platform CA to the certificates Node.js trusts, so certificate verification stays
   on. Set it in the shell before you start Claude Code. On PowerShell, the panel writes the same path as
   `$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

2. Export your API token. The panel keeps the token out of the copied block, so you do not paste it alongside the shared
   values. Replace `<lpai-token>` with your token.

   ```bash
   export ANTHROPIC_AUTH_TOKEN=<lpai-token>
   ```

3. _(Optional)_ To keep the endpoint and token across sessions, add them to the `~/.claude/settings.json` file instead
   of exporting them each time. Persisting the token there writes the secret to disk.

   ```json
   {
     "env": {
       "ANTHROPIC_BASE_URL": "https://<appliance-host>",
       "ANTHROPIC_AUTH_TOKEN": "<lpai-token>"
     }
   }
   ```

## Verify the Connection

1. Run a single prompt to confirm the appliance answers.

   ```bash
   claude --print "reply with exactly CC_OK and nothing else"
   ```

   ```bash hideClipboard title="Expected output"
   CC_OK
   ```

   A reply confirms that the certificate, base URL, token, and model routing all work.

2. Start an interactive session.

   ```bash
   claude
   ```

3. To confirm which endpoint and credential the session uses, run the `/status` command in Claude Code and review the
   **Anthropic base URL** and **Auth token** lines.

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up any configuration value, refer to [Claude Code Configuration](../reference/claude-code-reference.md). To
deploy another model to the appliance, refer to [Deploy a Model](./deploy-a-model.md). To let the appliance answer
questions about pasted screenshots, refer to [Enable Vision Preprocessing](./enable-vision-preprocessing.md). To
understand how the Tier map and the semantic router pick a model for each request, refer to
[Routing Behavior](../explanation/routing-behavior.md).
