---
sidebar_label: "Use OpenAI Codex"
title: "Use PaletteAI Inference Launchpad with OpenAI Codex"
description:
  "Connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model on the appliance serves
  every request."
hide_table_of_contents: false
sidebar_position: 11
tags: ["paletteai-inference-launchpad", "codex", "how-to"]
keywords: ["launchpad", "ai", "openai codex", "codex cli", "responses api", "config.toml", "api token", "platform ca"]
---

This guide explains how to connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model
running on the appliance serves every request instead of OpenAI's hosted API. You trust the platform certificate
authority if the appliance uses one, add a custom model provider to the Codex configuration file, and confirm the
connection.

## Prerequisites

- The OpenAI Codex CLI installed and already working. For installation, refer to the
  [OpenAI Codex website](https://github.com/openai/codex).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- Your machine able to reach the appliance address. Codex sends every request from your own machine, so an appliance on
  a private network works as long as your machine is on that network or connected to it.

## Download the Platform CA Certificate

<PartialsComponent category="paletteai-inference-launchpad" name="download-platform-ca" />

Codex validates TLS strictly and cannot skip certificate verification. Keep the saved file in place. The
`CODEX_CA_CERTIFICATE` variable in the next section points at it, which lets Codex trust the appliance without turning
off certificate verification and without changing your machine's system trust store.

## Configure Codex

In the console, select the **Connect Coding Agent** button to open the **Connect a coding agent** panel, then open the
**Codex CLI** tab. The panel generates the configuration below, already filled in with your appliance address and model
alias, and offers a shell picker for `bash`, `zsh`, and `PowerShell`. For a description of each field, refer to
[OpenAI Codex Configuration](../reference/codex-reference.md).

1. Put the following configuration in `~/.codex/config.toml`. This is the file in your home folder, not a project
   folder. Replace `<appliance-host>` with your appliance address.

   ```toml
   model = "gpt-5.6"
   model_provider = "launchpad"

   [model_providers.launchpad]
   name = "PaletteAI Inference Launchpad"
   base_url = "https://<appliance-host>/v1"
   wire_api = "responses"
   env_key = "LAUNCHPAD_API_KEY"
   ```

   Set `base_url` to your appliance address with the `/v1` path appended. The examples show `https://`; when the
   appliance serves plain HTTP, use `http://` instead. Keep `wire_api` set to `responses`. Current Codex CLI releases
   support no other value.

2. Run both export commands in your shell. These do not belong in `config.toml`, because an `export` line inside the
   file fails the Codex configuration parse. Replace `<lpai-token>` with the token you copied.

   ```bash
   export CODEX_CA_CERTIFICATE=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export LAUNCHPAD_API_KEY=<lpai-token>
   ```

   <PartialsComponent
     category="paletteai-inference-launchpad"
     name="ca-certificate-shell-notes"
     variable="CODEX_CA_CERTIFICATE"
   />

   Codex is written in Rust, so it does not read `NODE_EXTRA_CA_CERTS`. It layers `CODEX_CA_CERTIFICATE` on top of your
   system roots, so its other connections keep working with only the platform CA in the file.

3. Start Codex.

   ```bash
   codex
   ```

## Verify the Connection

Run a single prompt to confirm the appliance answers.

```bash
codex exec --skip-git-repo-check "reply with exactly CODEX_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CODEX_OK
```

A reply confirms that the base URL, token, certificate trust, provider, and model routing all work. The
`--skip-git-repo-check` flag lets you run the test outside a git repository.

:::info

Codex may print a `Model metadata for gpt-5.6 not found` warning. This warning is cosmetic and does not affect the
request.

:::

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up each configuration value, refer to [OpenAI Codex Configuration](../reference/codex-reference.md). To connect
a different coding tool, refer to [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md) or
[Use PaletteAI Inference Launchpad with Cursor](./use-cursor.md).
