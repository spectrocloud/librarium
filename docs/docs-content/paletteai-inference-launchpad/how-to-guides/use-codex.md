---
sidebar_label: "Use OpenAI Codex"
title: "Use PaletteAI Inference Launchpad with OpenAI Codex"
description:
  "Connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model on the appliance serves
  every request."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "codex", "how-to"]
keywords: ["launchpad", "ai", "openai codex", "codex cli", "responses api", "config.toml", "api token"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This guide explains how to connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model
running on the appliance serves every request instead of OpenAI's hosted API. You add a custom model provider to the
Codex configuration file and confirm the connection.

## Prerequisites

- The OpenAI Codex CLI installed and already working. For installation, refer to the
  [OpenAI Codex website](https://github.com/openai/codex).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use
  a token an administrator generated for you.
- The appliance reachable at a DNS hostname with a valid, publicly trusted TLS certificate. Codex validates TLS strictly
  and cannot skip certificate verification, so a self-signed certificate does not work.

## Configure Codex

Codex uses the Responses API, so you add a custom model provider that points at the appliance. For a description of each
field, refer to [OpenAI Codex Configuration](../reference/codex-reference.md).

:::tip

The console can generate a starter version of this configuration for you. Select **Connect coding agent** and open the
**Codex** tab to copy a `config.toml` snippet pre-filled with your appliance's endpoint. Review the model and provider
values against the steps below before you save it.

:::

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

2. Set the environment variable named in `env_key` to your API token so that Codex can authenticate. In this example,
   `env_key` is `LPAI_KEY`. Replace `<lpai-token>` with the token you copied.

   ```bash
   export LPAI_KEY=<lpai-token>
   ```

{/* NEEDS REVIEW: this guide says `model` must be a real served id (not an alias) because the Responses API passes the model straight to the engine, but the console's "Connect coding agent" > Codex snippet sets `model = "claude-opus-4-8"`, a tier-map alias. Confirm with an SME whether the tier map resolves aliases over the Responses API. */}

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

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up each configuration value, refer to [OpenAI Codex Configuration](../reference/codex-reference.md). To connect
a different coding tool, refer to [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md) or
[Use PaletteAI Inference Launchpad with Cursor](./use-cursor.md).
