---
sidebar_label: "Use OpenAI Codex"
title: "Use PaletteAI Inference Launchpad with OpenAI Codex"
description:
  "Connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model on the appliance serves
  every request."
hide_table_of_contents: false
sidebar_position: 11
tags: ["paletteai-inference-launchpad", "codex", "how-to"]
keywords:
  ["launchpad", "ai", "openai codex", "codex cli", "responses api", "config.toml", "api token", "ca certificate"]
---

This guide explains how to connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model
running on the appliance serves every request instead of OpenAI's hosted API. Codex connects to the appliance the same
way it connects to an OpenAI endpoint, so you trust the appliance certificate, add a custom model provider to the Codex
configuration file, and confirm the connection.

The console assembles these values for you. In the **Connect a coding agent** panel, the **Codex CLI** tab lists the
steps and generates the configuration for `bash`, `zsh`, or PowerShell. For what each field does, refer to
[OpenAI Codex Configuration](../reference/codex-reference.md).

## Prerequisites

- The OpenAI Codex CLI installed and already working. For installation, refer to the
  [OpenAI Codex repository](https://github.com/openai/codex).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- Network access from your machine to the appliance. Codex sends each request from the machine it runs on, so an
  appliance on a private network works.

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-the-platform-ca" />

## Configure Codex

1. Add the following custom provider to the Codex configuration file at `~/.codex/config.toml`. Use the home folder, not
   a project folder. Replace `<appliance-host>` with your appliance address.

   ```toml
   model = "gpt-5.6"
   model_provider = "launchpad"

   [model_providers.launchpad]
   name = "PaletteAI Inference Launchpad"
   base_url = "https://<appliance-host>/v1"
   wire_api = "responses"
   env_key = "LAUNCHPAD_API_KEY"
   ```

2. Run the following commands in your shell. Codex fails to parse an `export` line inside `config.toml`, so both values
   stay in the shell. Replace `<lpai-token>` with your token.

   ```bash
   export CODEX_CA_CERTIFICATE=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export LAUNCHPAD_API_KEY=<lpai-token>
   ```

   Include the `CODEX_CA_CERTIFICATE` line only when the panel shows the **CA certificate** step. Codex layers that
   certificate on top of the system trust store, so certificate verification stays on. On PowerShell, the panel writes
   the same path as `$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Verify the Connection

1. Run a single prompt to confirm the appliance answers. The `--skip-git-repo-check` flag lets you run the test outside
   a git repository.

   ```bash
   codex exec --skip-git-repo-check "reply with exactly CODEX_OK and nothing else"
   ```

   ```bash hideClipboard title="Expected output"
   CODEX_OK
   ```

   A reply confirms that the certificate, base URL, token, provider, and model routing all work.

2. Start an interactive session.

   ```bash
   codex
   ```

:::info

Codex may print a `Model metadata for <model> not found` warning. This warning is cosmetic and does not affect the
request.

:::

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up each configuration value, refer to [OpenAI Codex Configuration](../reference/codex-reference.md). To connect
a different coding tool, refer to [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md) or
[Use PaletteAI Inference Launchpad with Cursor](./use-cursor.md).
