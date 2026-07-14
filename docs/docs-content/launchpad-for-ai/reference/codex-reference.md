---
sidebar_label: "OpenAI Codex Configuration"
title: "Launchpad for AI OpenAI Codex Configuration"
description:
  "Reference for the configuration file fields and values used to connect the OpenAI Codex CLI to a Launchpad for AI
  appliance."
hide_table_of_contents: false
sidebar_position: 7
tags: ["launchpad-for-ai", "codex", "reference"]
keywords: ["launchpad", "ai", "openai codex", "codex cli", "config.toml", "responses api", "api token", "model"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This page lists the configuration values the OpenAI Codex CLI uses to connect to a Launchpad for AI appliance. For the
steps to set them, refer to [Use Launchpad for AI with OpenAI Codex](../how-to-guides/use-codex.md).

## Configuration File

Codex reads its configuration from `~/.codex/config.toml`. Add a custom model provider for the appliance.

```toml
model = "glm-5.2"
model_provider = "lpai"

[model_providers.lpai]
name = "Launchpad"
base_url = "https://amd.spectrocloud.com:8443/v1"
env_key = "LPAI_KEY"
wire_api = "responses"
```

## Fields

| Field            | Description                                                                                                                               | Example value                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `model`          | The id of a model the appliance serves. Use a real served model id, not `auto`, because the Responses API passes the model to the engine. | `glm-5.2`                              |
| `model_provider` | The provider Codex uses. Must match the name of the `[model_providers.<name>]` table.                                                     | `lpai`                                 |
| `name`           | A display name for the provider.                                                                                                          | `Launchpad`                            |
| `base_url`       | The appliance inference endpoint, with the `/v1` path appended.                                                                           | `https://amd.spectrocloud.com:8443/v1` |
| `env_key`        | The name of the environment variable that holds your API token.                                                                           | `LPAI_KEY`                             |
| `wire_api`       | The API Codex uses. Codex uses the Responses API, so set this to `responses`.                                                             | `responses`                            |

## Endpoint URL

Set `base_url` to your appliance's address, the same host you use to reach the console, with `/v1` appended. The gateway
serves the Responses API at `/v1/responses`, and Codex appends the `/responses` path itself, so `base_url` ends at
`/v1`. If you do not know the address, ask the administrator who set up the appliance.

## API Token

Codex reads the token from the environment variable named by `env_key`. Export it before you run Codex.

```bash
export LPAI_KEY=<lpai-token>
```

The token is generated in the console and begins with `lpai_`.

## Model Name

Codex sends the value of `model` straight to the appliance engine over the Responses API, so it must be a model the
appliance serves, such as `glm-5.2`. Do not use `auto`. The served model ids appear in the console model list and in the
appliance's `/v1/models` API response.

## Requirements

- The appliance must present a valid, publicly trusted TLS certificate on a DNS hostname. Codex validates TLS strictly
  and cannot skip certificate verification, so a self-signed certificate does not work.
- The gateway must accept the `developer` message role, which the Launchpad for AI gateway does.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Codex surfaces the error.
{/* TODO: link to the token quotas and metering reference once it exists */}

## Resources

- [Use Launchpad for AI with OpenAI Codex](../how-to-guides/use-codex.md)
- [Use Launchpad for AI with Claude Code](../how-to-guides/use-claude-code.md)
- [Use Launchpad for AI with Cursor](../how-to-guides/use-cursor.md)
- Intelligent routing and tier maps {/* TODO: link once page exists */}
- Token quotas and metering {/* TODO: link once page exists */}
