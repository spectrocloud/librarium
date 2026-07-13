---
sidebar_label: "Use Claude Code"
title: "Use Launchpad for AI with Claude Code"
description:
  "Connect Anthropic's Claude Code coding agent to a Launchpad for AI appliance so that a model on the appliance serves
  every request."
hide_table_of_contents: false
sidebar_position: 3
tags: ["launchpad-for-ai", "claude-code", "how-to"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "api token"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This guide explains how to connect Claude Code to a Launchpad for AI appliance so that a model running on the appliance
serves every request instead of Anthropic's hosted API. You generate an API token in the console, point Claude Code at
the appliance with two environment variables, and confirm the connection.

## Prerequisites

- Claude Code installed and already working against Anthropic's hosted API. For installation, refer to the
  [Claude Code documentation](https://docs.claude.com/en/docs/claude-code).
- A running Launchpad for AI appliance with at least one model deployed and serving. To deploy a model, refer to
  [Deploy a Model](./deploy-a-model.md).
- Admin access to the Launchpad for AI console, or an API token that an administrator generated for you.

## Generate an API Token

If an administrator already gave you an API token, skip to [Configure Claude Code](#configure-claude-code).

1. Open the appliance console in a browser and sign in.

2. From the left main menu, select **Access & Policy** > **Users**.

3. Create a token.

4. Copy the token when the console reveals it. The token begins with `lpai_`.

:::warning

The console shows the token only once and stores only a hash of it. Copy it now. If you lose it, revoke the token and
create a new one.

:::

## Configure Claude Code

On the machine where you run Claude Code, set the following environment variables.

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

Claude Code requests a Claude alias, such as `claude-sonnet-4-5`. To pin every request to one alias, set
`ANTHROPIC_MODEL` to it. For the aliases the appliance accepts, refer to
[Claude Code Configuration](../reference/claude-code-reference.md).

```bash
export ANTHROPIC_MODEL=claude-sonnet-4-5
```

:::warning

If your appliance uses a self-signed certificate, Claude Code rejects the connection by default. Set
`NODE_TLS_REJECT_UNAUTHORIZED=0` for short-lived testing, or serve the appliance with a valid, publicly trusted
certificate.

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

## Token Quotas

If requests return an HTTP `429` response, you have exceeded your token quota. Wait for the quota window to reset, or
ask an operator to raise your limit. {/* TODO: link once the token quotas and metering reference page exists */}

## Next Steps

To look up any configuration value, refer to [Claude Code Configuration](../reference/claude-code-reference.md). To
deploy another model to the appliance, refer to [Deploy a Model](./deploy-a-model.md).
{/* TODO: add direction to the client and API token management, token quotas and metering, and intelligent routing pages once they exist */}
