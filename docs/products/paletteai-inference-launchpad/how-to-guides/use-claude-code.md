---
sidebar_label: "Use Claude Code"
title: "Use PaletteAI Inference Launchpad with Claude Code"
description:
  "Connect Anthropic's Claude Code coding agent to a PaletteAI Inference Launchpad appliance so that a model on the
  appliance serves every request."
hide_table_of_contents: false
sidebar_position: 9
tags: ["paletteai-inference-launchpad", "claude-code", "how-to"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "api token", "platform ca"]
---

This guide explains how to connect Claude Code to a PaletteAI Inference Launchpad appliance so that a model running on
the appliance serves every request instead of Anthropic's hosted API. You trust the platform certificate authority if
the appliance uses one, point Claude Code at the appliance with environment variables, and confirm the connection.

## Prerequisites

- Claude Code installed and already working against Anthropic's hosted API. For installation, refer to the
  [Claude Code documentation](https://docs.claude.com/en/docs/claude-code).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- Your machine able to reach the appliance address. Claude Code sends every request from your own machine.

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-platform-ca" />

Claude Code runs on Node.js, which does not trust the platform CA by default. Keep the saved file in place. The
`NODE_EXTRA_CA_CERTS` variable in the next section points at it, which lets Claude Code trust the appliance without
turning off certificate verification.

## Configure Claude Code

In the console, select the **Connect Coding Agent** button to open the **Connect a coding agent** panel, then open the
**Claude Code CLI** tab. The panel generates the environment block below, already filled in with your appliance address
and model aliases, and offers a shell picker for `bash`, `zsh`, and `PowerShell`. For a description of each value, refer
to [Claude Code Configuration](../reference/claude-code-reference.md).

1. Copy the environment block and paste it in your terminal. Replace `<appliance-host>` with your appliance address.

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

   Set `ANTHROPIC_BASE_URL` to your appliance address with no path. Do not append `/v1`. Claude Code adds the API path
   itself. The examples show `https://`; when the appliance serves plain HTTP, use `http://` instead.

   Omit the `NODE_EXTRA_CA_CERTS` line if the panel showed no CA certificate step. In PowerShell, set each value with
   `$env:<name> = "<value>"` in place of `export`, and use the path the panel writes for Windows,
   `$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

2. Set your API token. The token is not part of the block in step 1, so that a copied configuration never carries a
   secret. Replace `<lpai-token>` with the token you copied.

   ```bash
   export ANTHROPIC_AUTH_TOKEN=<lpai-token>
   ```

   `ANTHROPIC_API_KEY` also works, but do not set it globally if you also sign in to Claude Code with an Anthropic
   account.

3. Start Claude Code.

   ```bash
   claude
   ```

To persist the settings instead of exporting them each session, add the values from step 1, except
`NODE_EXTRA_CA_CERTS`, to the `~/.claude/settings.json` file.

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://<appliance-host>",
    "ANTHROPIC_MODEL": "claude-opus-4-8",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-8",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5",
    "ANTHROPIC_DEFAULT_FABLE_MODEL": "claude-fable-5",
    "CLAUDE_CODE_EFFORT_LEVEL": "auto",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "64000"
  }
}
```

Keep `NODE_EXTRA_CA_CERTS` out of this file and set it as a real shell environment variable before Claude Code starts,
as shown in step 1. Node.js reads the variable from the process environment while it starts, so a `settings.json` entry
arrives after the root certificate store is built and has no effect.

Leave the token out of this file as well. Claude Code stores each value literally, so an `ANTHROPIC_AUTH_TOKEN` entry
would hold your token in plain text on disk. Set it in your shell as shown in step 2 instead.

## Verify the Connection

Run a single prompt to confirm the appliance answers.

```bash
claude --print "reply with exactly CC_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CC_OK
```

A reply confirms that the base URL, token, certificate trust, and model routing all work. To confirm which endpoint and
credential the session uses, run the `/status` command in Claude Code and review the **Anthropic base URL** and **Auth
token** lines.

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up any configuration value, refer to [Claude Code Configuration](../reference/claude-code-reference.md). To
deploy another model to the appliance, refer to [Deploy a Model](./deploy-a-model.md). To let the appliance answer
questions about pasted screenshots, refer to [Enable Vision Preprocessing](./enable-vision-preprocessing.md). To
understand how the Tier map and the semantic router pick a model for each request, refer to
[Routing Behavior](../explanation/routing-behavior.md).
{/* TODO: add direction to the client and API token management, and token quotas and metering pages once they exist */}
