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
This guide documents the verified live build (tested end-to-end against a running Launchpad for AI deployment):
Access & Policy → Users, a one-time "lpai_" token, two environment variables, and automatic gateway alias mapping
(no user-facing tier-map UI).

REDESIGN WATCH — revisit if these land:
- The "user → capability" console redesign (per PM) may rename the Users area; update entity wording if it ships.
- Confirm whether an operator-facing tier-map / routing editor ships; if so, add a configuration section.
- [S] Screenshots are placeholders — capture against the shipping console when a build is available.
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

Each developer connects with their own API token. In the console, open the **Access & Policy** page and select
**Users**, then create a token.

{/* [S] SCREENSHOT NEEDED: Access & Policy → Users, showing the create-token control */}

Give the token a label that indicates where it lives (for example, `jane-laptop`) so you can revoke it later without
guessing which machine it belongs to. When you make a change, the console first shows a preview card of exactly what
changes, and nothing happens until you select **Confirm & apply**.

{/* [S] SCREENSHOT NEEDED: create-token form and the guarded Confirm & apply card */}

The new token is shown exactly once and begins with `lpai_`.

{/* [S] SCREENSHOT NEEDED: one-time token reveal */}

:::warning

Copy the token now. The appliance stores only a hash, and the plain text is never shown again. If you lose it, you must
revoke the token and create a new one.

:::

## Run Claude Code

On the developer's machine, set two environment variables — your appliance's address and the token you just created —
then start Claude Code.

```bash
export ANTHROPIC_BASE_URL=https://<your-appliance-address>
export ANTHROPIC_AUTH_TOKEN=<lpai-token>
```

Use `ANTHROPIC_AUTH_TOKEN`, not `ANTHROPIC_API_KEY`. (`ANTHROPIC_API_KEY` also works, but avoid setting it globally if
you also sign in to Claude Code with a claude.ai account.)

To persist the settings instead of exporting them each session, add them to `~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://<your-appliance-address>",
    "ANTHROPIC_AUTH_TOKEN": "<lpai-token>"
  }
}
```

We strongly recommend giving the appliance a DNS name and a valid, publicly trusted TLS certificate. The connection
uses HTTPS, so a valid certificate is what keeps your token and traffic secure in transit. An appliance configured this
way needs no TLS workaround.

If the appliance still presents a self-signed certificate, Node (which Claude Code runs on) rejects it by default. As a
temporary measure, add `export NODE_TLS_REJECT_UNAUTHORIZED=0` before starting Claude Code.

:::warning

`NODE_TLS_REJECT_UNAUTHORIZED=0` turns off certificate verification, which is insecure and should be limited to
short-lived testing. Install a publicly trusted certificate before any real use. Some tools do not allow this workaround
at all — for example, OpenAI Codex requires a valid certificate on a real DNS name and cannot skip verification.

:::

Then start Claude Code in any project folder.

```bash
cd ~/my-project
claude
```

Claude Code starts and connects to the appliance. The banner shows the Opus model tier. You do not pick the backend
model: the appliance maps each Claude alias (Opus, Sonnet, Haiku) to one of its served models. For how that mapping
works, refer to [Tier Maps](../explanation/architecture.md#tier-maps).

{/* [S] SCREENSHOT NEEDED: Claude Code connected, with the reply coming from the local model */}
{/* REDESIGN WATCH: the live build exposes no operator-facing tier-map editor; the gateway maps aliases automatically.
If a routing/tier-map UI ships, add a configuration section (or a separate how-to) for it. */}

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

The alias maps to a model the appliance does not currently serve. Ask an operator to confirm a model is in the serving
state so the gateway can map the alias to it. You can check model state on the **Cluster** page.

### Requests Return 429

The user exceeded a quota window, or an operator suspended them. In **Access & Policy**, raise the limit under **Quota
windows** or resume the user. Otherwise, wait for the interval in the `Retry-After` header.

### Connector Warning at Startup

Claude Code prints a notice that it turned off claude.ai connectors because another auth source is set. You can ignore
it, because the environment token takes precedence when connecting to an appliance.

### TLS Certificate Errors

The lasting fix is to give the appliance a DNS name and a valid, publicly trusted TLS certificate, which also lets other
coding tools connect. If the appliance uses a self-signed certificate, `NODE_TLS_REJECT_UNAUTHORIZED=0` bypasses the
error for short-lived testing, but it disables verification and should not be left in place.

## Next Steps

To add more models that you can map to Claude tiers, refer to [Deploy a Model](./deploy-a-model.md). For background on
how the appliance routes requests to models, refer to [Architecture](../explanation/architecture.md).
