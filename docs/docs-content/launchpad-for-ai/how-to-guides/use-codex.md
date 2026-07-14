---
sidebar_label: "Use OpenAI Codex"
title: "Use Launchpad for AI with OpenAI Codex"
description:
  "Connect the OpenAI Codex CLI to a Launchpad for AI appliance so that a model on the appliance serves every request."
hide_table_of_contents: false
sidebar_position: 5
tags: ["launchpad-for-ai", "codex", "how-to"]
keywords: ["launchpad", "ai", "openai codex", "codex cli", "responses api", "config.toml", "api token"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This guide explains how to connect the OpenAI Codex CLI to a Launchpad for AI appliance so that a model running on the
appliance serves every request instead of OpenAI's hosted API. You generate an API token, add a custom model provider to
the Codex configuration file, and confirm the connection.

## Prerequisites

- The OpenAI Codex CLI installed and already working. For installation, refer to the
  [OpenAI Codex website](https://github.com/openai/codex).
- A running Launchpad for AI appliance with at least one model deployed and serving. To deploy a model, refer to
  [Deploy a Model](./deploy-a-model.md).
- Admin access to the Launchpad for AI console, or an API token that an administrator generated for you.
- The appliance reachable at a DNS hostname with a valid, publicly trusted TLS certificate. Codex validates TLS strictly
  and cannot skip certificate verification, so a self-signed certificate does not work.

## Generate an API Token

If an administrator already gave you an API token, skip to [Configure Codex](#configure-codex).

1. Open the appliance console in a browser and sign in.

2. From the left main menu, select **Access & Policy** > **Users**.

3. Create a token.

4. Copy the token when the console reveals it. The token begins with `lpai_`.

:::warning

The console shows the token only once. Copy it now, because you cannot view it again. If you lose it, revoke the token
and create a new one.

:::

## Configure Codex

Codex uses the Responses API, so you add a custom model provider that points at the appliance. For a description of each
field, refer to [OpenAI Codex Configuration](../reference/codex-reference.md).

1. Add the following custom provider to the Codex configuration file at `~/.codex/config.toml`. Replace
   `<appliance-host>` with your appliance address.

   ```toml
   model = "glm-5.2"            # a model the appliance serves, not "auto"
   model_provider = "lpai"

   [model_providers.lpai]
   name = "Launchpad"
   base_url = "https://<appliance-host>/v1"
   env_key = "LPAI_KEY"
   wire_api = "responses"       # Codex uses the Responses API
   ```

   Set `model` to a model the appliance serves, such as `glm-5.2`. Do not use `auto`, because the Responses API passes
   the model straight to the engine. Set `base_url` to your appliance address with the `/v1` path appended.

2. Export your API token in the environment variable named by `env_key`. This sets the token for the current shell
   session. To persist it, add the line to your shell profile.

   ```bash
   export LPAI_KEY=<lpai-token>
   ```

## Verify the Connection

Run a single prompt to confirm the appliance answers.

```bash
codex exec --skip-git-repo-check "reply with exactly CODEX_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CODEX_OK
```

A reply confirms that the base URL, token, provider, and model routing all work. The `--skip-git-repo-check` flag lets
you run the test outside a git repository.

:::info

Codex may print a `Model metadata for glm-5.2 not found` warning. This warning is cosmetic and does not affect the
request.

:::

## Request Routing and Quotas

Requests you send through the appliance are subject to the routing rule and quota configured for your API token. If an
operator configured a routing rule for your token, the appliance can redirect a request to a frontier model instead of a
local one. Token quotas apply per API token, and when a token exhausts its quota, the appliance returns an HTTP `429`
response.
{/* TODO: link to the intelligent routing how-to and the token quotas and metering reference once they exist */}

## Next Steps

To look up each configuration value, refer to [OpenAI Codex Configuration](../reference/codex-reference.md). To connect
a different coding tool, refer to [Use Launchpad for AI with Claude Code](./use-claude-code.md) or
[Use Launchpad for AI with Cursor](./use-cursor.md).
