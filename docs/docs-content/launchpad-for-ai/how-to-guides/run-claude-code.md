---
sidebar_label: "Connect Claude Code"
title: "Connect Claude Code to a Launchpad for AI Appliance"
description:
  "Step-by-step guidance for connecting Anthropic's Claude Code coding agent to a Launchpad for AI appliance so that
  every prompt is served by local models."
hide_table_of_contents: false
sidebar_position: 3
tags: ["launchpad-for-ai", "claude-code", "integration", "how-to"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "access token", "tier map"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This guide explains how to connect Claude Code, Anthropic's terminal coding agent, to a Launchpad for AI appliance so
that the appliance's models serve every request instead of Anthropic's cloud.

## Prerequisites

- A running Launchpad for AI appliance with at least one model in the `SERVING` state. You can check model state on the
  **Cluster** page.
- The console URL and an admin (operator) login for the appliance.
- Claude Code installed on the developer's machine: `npm install --global @anthropic-ai/claude-code` (or
  `brew install --cask claude-code`).

## Sign In to the Console

Open the appliance's console in a browser and sign in with your admin username and password. Everything in this guide
happens on the **Access & Policy** page, which requires an operator login.

![The Launchpad for AI console login screen, where user management requires an operator sign-in.](/launchpad-for-ai_run-claude-code_login.webp)

## Create a User

Each developer gets their own user, and the access token you create next belongs to that user.

From the left main menu, select **Access & Policy**.

![The Access & Policy page showing appliance-wide controls, the Claude Code reference block, and the Users table below.](/launchpad-for-ai_run-claude-code_access-policy.webp)

Scroll to the **Create user** card at the bottom of the Users section, type a display name (for example, `jane-dev`),
and select **Create user**.

![The Create user card, where only a display name is required; the appliance assigns the ID.](/launchpad-for-ai_run-claude-code_create-user.webp)

When you make a change, the console first shows a small preview card of exactly what changes, and nothing happens until
you select **Confirm & apply**.

![The guarded confirmation card that previews the change before you select Confirm & apply.](/launchpad-for-ai_run-claude-code_confirm-apply.webp)

## Create the User's Access Token

Open the new user's detail page by selecting the ID in their row (for example, `usr_0a2684b33d4c`).

![The user detail page showing identity, usage, and per-user settings.](/launchpad-for-ai_run-claude-code_user-detail.webp)

Scroll to the token section, give the token a label that indicates where it lives (for example, `jane-laptop`), and
select **Create token**, then **Confirm & apply**.

![The token creation form, where a label names the token after where you use it to make revocation easier later.](/launchpad-for-ai_run-claude-code_create-token.webp)

The new token is shown exactly once, together with a ready-to-run Claude Code snippet that already has the appliance
address and the token filled in.

![The one-time token reveal, showing the token plus a copy-ready Claude Code environment block.](/launchpad-for-ai_run-claude-code_token-reveal.webp)

:::warning

Copy the token now. The appliance stores only a hash, and the plain text is never shown again. If you lose it, you must
revoke the token and create a new one.

:::

The snippet's last line shows which local model the `claude-opus-4-8` alias currently resolves to for this user. Set the
tier map next.

## Set the Tier Map

The tier map points each Claude alias at one of your served models. Point Opus and Sonnet at your flagship model and
Haiku at a faster model. For how the tier map translates Claude model names into local models, refer to
[Tier Maps](../explanation/architecture.md#tier-maps).

On the user's detail page, find the **Tier map** card, select **Add alias rule** for each alias, choose the alias prefix
and the model from the drop-down menus, then select **Apply tier map** and confirm.

![Three alias rules mapping Opus and Sonnet to the flagship model and Haiku to the fast coder model.](/launchpad-for-ai_run-claude-code_tier-map-rules.webp)

## Run Claude Code

On the developer's machine, paste the environment block from the token reveal into the shell. It is also reproduced
below. The base URL is your appliance's address, and the token is the one you just created.

```bash
# The appliance serves HTTPS with a self-signed CA certificate, which Node (Claude Code)
# rejects by default. This disables Node's TLS verification for the session; drop
# it if your appliance presents a publicly trusted certificate (for example, a cert-manager leaf).
export NODE_TLS_REJECT_UNAUTHORIZED=0
export ANTHROPIC_BASE_URL=https://<your-appliance-address>
export ANTHROPIC_AUTH_TOKEN=<lpai-token>
export ANTHROPIC_MODEL=claude-opus-4-8
export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-8
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-5
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5

# Run Claude Code at maximum reasoning effort (low | medium | high | max).
export CLAUDE_CODE_EFFORT_LEVEL=max
```

Then start Claude Code in any project folder.

```bash
cd ~/my-project
claude
```

Claude Code starts and connects to the appliance. The banner shows the Opus model tier.

![Claude Code connected to the appliance, with the reply coming from the local model set in the tier map.](/launchpad-for-ai_run-claude-code_claude-code-connected.webp)

To confirm Claude Code points at the appliance rather than the Anthropic cloud, run the `/status` command in the session
and check the **Anthropic base URL** and **Auth token** lines on the **Status** tab.

```text hideClipboard title="Status tab"
Anthropic base URL:  https://<your-appliance-address>
Auth token:          ANTHROPIC_AUTH_TOKEN
```

The **Anthropic base URL** line shows your appliance address, and the **Auth token** line names `ANTHROPIC_AUTH_TOKEN`,
which confirms the session authenticates to the appliance instead of using a saved claude.ai login.

For a non-interactive round-trip check, run the following command. Any response confirms that the base URL, credential,
and model routing all work.

```bash
claude --print "reply with OK"
```

```bash hideClipboard title="Expected output"
OK
```

## Troubleshooting

### 401 Authentication Error

Re-check `ANTHROPIC_AUTH_TOKEN`. Copy the token exactly from the one-time reveal. If you lost it, revoke it and create a
new one, because the appliance cannot recover the plain text.

### Tier Map Apply Is Held

The alias points at a model the appliance does not serve, or the rule did not pass the coding-agent evaluation. The
console shows the reason when you apply the change. Choose a model from the drop-down menu.

### Requests Return 429

The user exceeded a quota window, or an operator suspended them. In **Access & Policy**, raise the limit under **Quota
windows** or resume the user. Otherwise, wait for the interval in the `Retry-After` header.

### Connector Warning at Startup

Claude Code prints a notice that it turned off claude.ai connectors because another auth source is set. You can ignore
it, because the environment token takes precedence when connecting to an appliance.

### TLS Certificate Errors

For TLS errors on an HTTPS appliance with the self-signed CA, keep the `NODE_TLS_REJECT_UNAUTHORIZED=0` line from the
snippet, or install a publicly trusted certificate on the appliance and drop it.

## Next Steps

To add more models that you can map to Claude tiers, refer to [Deploy a Model](./deploy-a-model.md). For background on how the
appliance routes requests to models, refer to [Architecture](../explanation/architecture.md).
