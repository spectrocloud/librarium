---
sidebar_label: "Use Claude Code"
title: "Use PaletteAI Inference Launchpad with Claude Code"
description:
  "Connect Anthropic's Claude Code coding agent to a PaletteAI Inference Launchpad appliance so that a model on the
  appliance serves every request."
hide_table_of_contents: false
sidebar_position: 4
tags: ["paletteai-inference-launchpad", "claude-code", "how-to"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "api token"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This guide explains how to connect Claude Code to a PaletteAI Inference Launchpad appliance so that a model running on
the appliance serves every request instead of Anthropic's hosted API. You point Claude Code at the appliance with two
environment variables and confirm the connection.

## Prerequisites

- Claude Code installed and already working against Anthropic's hosted API. For installation, refer to the
  [Claude Code documentation](https://docs.claude.com/en/docs/claude-code).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.

## Configure Claude Code

On the machine where you run Claude Code, set the following environment variables.

:::tip

You do not have to assemble these variables by hand. In the console, select **Connect coding agent** and open the
**Claude Code** tab to generate a ready-to-paste configuration snippet. The snippet can also set optional per-tier model
aliases and a reasoning-effort level. For the full list of values it can set, refer to
[Claude Code Configuration](../reference/claude-code-reference.md).

:::

```bash
export ANTHROPIC_BASE_URL=https://<appliance-host>
export ANTHROPIC_AUTH_TOKEN=<lpai-token>
```

Set `ANTHROPIC_BASE_URL` to your appliance's address with no path. Do not append `/v1`. Claude Code adds the API path
itself. Use `ANTHROPIC_AUTH_TOKEN` for the token. `ANTHROPIC_API_KEY` also works, but do not set it globally if you also
sign in to Claude Code with an Anthropic account.

To persist the settings instead of exporting them each session, add them to the `~/.claude/settings.json` file.

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://<appliance-host>",
    "ANTHROPIC_AUTH_TOKEN": "<lpai-token>"
  }
}
```

Claude Code requests a Claude alias, such as `claude-opus-4-8`. To pin every request to one alias, set `ANTHROPIC_MODEL`
to it. For the aliases the appliance accepts, refer to
[Claude Code Configuration](../reference/claude-code-reference.md).

```bash
export ANTHROPIC_MODEL=claude-opus-4-8
```

We strongly recommend giving the appliance a DNS name and a valid, publicly trusted TLS certificate. The connection uses
HTTPS, so a valid certificate protects your token in transit.

:::warning

If the appliance uses a self-signed certificate, Claude Code rejects the connection by default. As a temporary measure
for testing, set `NODE_TLS_REJECT_UNAUTHORIZED=0` before you start Claude Code. This disables certificate verification,
so do not use it outside short-lived testing.

:::

## Verify the Connection

Run a single prompt to confirm the appliance answers.

```bash
claude --print "reply with exactly CC_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CC_OK
```

A reply confirms that the base URL, token, and model routing all work. To confirm which endpoint and credential the
session uses, run the `/status` command in Claude Code and review the **Anthropic base URL** and **Auth token** lines.

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up any configuration value, refer to [Claude Code Configuration](../reference/claude-code-reference.md). To
deploy another model to the appliance, refer to [Deploy a Model](./deploy-a-model.md).
{/* TODO: add direction to the client and API token management, token quotas and metering, and intelligent routing pages once they exist */}
