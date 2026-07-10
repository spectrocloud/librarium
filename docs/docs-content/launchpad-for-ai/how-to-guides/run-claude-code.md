---
sidebar_label: "Connect Claude Code"
title: "Connect Claude Code to a Launchpad for AI Appliance"
description:
  "Step-by-step guidance for connecting Anthropic's Claude Code coding agent to a Launchpad for AI appliance so that
  every prompt is served by local models."
hide_table_of_contents: false
sidebar_position: 3
tags: ["launchpad-for-ai", "claude-code", "integration", "how-to"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "api token", "tier map"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

{/*
DRAFT — targets the redesigned "Client / API token" flow that ships at GA, NOT the current stable build (which still
shows "Users / access token").

PENDING SME CONFIRMATION (Andreea / Alex) — resolve before publishing: [T1] Entity label: draft uses "Client" (replacing
"User"). Confirm exact string. [T2] Credential label: draft uses "API token". Shipping UI today uses "access token"
(preferred) vs "API key" (legacy) — confirm which string ships. [T3] Flow: draft assumes ONE step ("Create an API
token"). If it is two steps (create Client, then mint token), split the section back out. [T4] Exact UI location of the
tier map in the shipping build (current demo nav exposes no "Routing" page). [S] All screenshots are placeholders — no
screenshot-able build exists yet.
*/}

This guide explains how to connect Claude Code, Anthropic's terminal coding agent, to a Launchpad for AI appliance so
that the appliance's models serve every request instead of Anthropic's cloud.

## Prerequisites

- A running Launchpad for AI appliance with at least one model in the serving state. You can check model state on the
  **Cluster** page.
- The console URL and an admin (operator) login for the appliance.
- Claude Code installed on the developer's machine: `npm install --global @anthropic-ai/claude-code` (or
  `brew install --cask claude-code`).

## Sign In to the Console

Open the appliance's console in a browser and sign in with your admin username and password. Everything in this guide
happens on the **Access & Policy** page, which requires an operator login.

{/* [S] SCREENSHOT NEEDED: console login screen (redesigned build) */}

## Create an API Token

{/* [T1][T2][T3] This section merges the old "Create a User" + "Create the User's Access Token" steps into a single
credential-creation flow, per the redesign. If the shipping flow keeps two distinct steps, split this back out. */}

Each developer connects with their own API token. From the left main menu, select **Access & Policy**.

{/* [S] SCREENSHOT NEEDED: Access & Policy page showing the Clients table and the create control */}

Create the token for a client (for example, `jane-dev`), give it a label that indicates where it lives (for example,
`jane-laptop`), and confirm. When you make a change, the console first shows a preview card of exactly what changes, and
nothing happens until you select **Confirm & apply**.

{/* [S] SCREENSHOT NEEDED: Create API token form and the guarded Confirm & apply card */}

The new token is shown exactly once, together with a ready-to-run Claude Code snippet that already has the appliance
address and the token filled in.

{/* [S] SCREENSHOT NEEDED: one-time token reveal with the copy-ready Claude Code environment block */}

:::warning

Copy the token now. The appliance stores only a hash, and the plain text is never shown again. If you lose it, you must
revoke the token and create a new one.

:::

The snippet's last line shows which local model the `claude-opus-4-8` alias resolves to on this appliance.

## About the Tier Map

Each Claude alias in the snippet (Opus, Sonnet, Haiku) resolves to one of the appliance's served models through the
appliance's **tier map**. The tier map is a single, appliance-wide setting that an operator configures once. It is not
per-client: every token's aliases resolve through the same map. Typically Opus and Sonnet point at the flagship model
and Haiku at a faster model.

You do not configure the tier map while creating a token; it is managed separately at the appliance level.
{/* [T4] Confirm and name the exact UI location for editing the tier map in the shipping build. */} For how the tier map
translates Claude model names into local models, refer to [Tier Maps](../explanation/architecture.md#tier-maps).

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

{/* [S] SCREENSHOT NEEDED: Claude Code connected, with the reply coming from the local model */}

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

### An Alias Does Not Resolve

The alias points at a model the appliance does not serve. Ask an operator to confirm the appliance's tier map maps the
alias to a model in the serving state. {/* [T4] Reword once the tier-map UI location is confirmed. */}

### Requests Return 429

The client exceeded a quota window, or an operator suspended them. In **Access & Policy**, raise the limit under **Quota
windows** or resume the client. Otherwise, wait for the interval in the `Retry-After` header.

### Connector Warning at Startup

Claude Code prints a notice that it turned off claude.ai connectors because another auth source is set. You can ignore
it, because the environment token takes precedence when connecting to an appliance.

### TLS Certificate Errors

For TLS errors on an HTTPS appliance with the self-signed CA, keep the `NODE_TLS_REJECT_UNAUTHORIZED=0` line from the
snippet, or install a publicly trusted certificate on the appliance and drop it.

## Next Steps

To add more models that you can map to Claude tiers, refer to [Deploy a Model](./deploy-a-model.md). For background on
how the appliance routes requests to models, refer to [Architecture](../explanation/architecture.md).
