---
sidebar_label: "Claude Code Configuration"
title: "PaletteAI Inference Launchpad Claude Code Configuration"
description:
  "Reference for the environment variables and values used to connect Claude Code to a PaletteAI Inference Launchpad
  appliance."
hide_table_of_contents: false
sidebar_position: 5
tags: ["paletteai-inference-launchpad", "claude-code", "reference"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "environment variables", "api token", "model"]
---

This page lists the configuration values Claude Code uses to connect to a PaletteAI Inference Launchpad appliance. For
the steps to set them, refer to
[Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md).

## Environment Variables

| **Variable**                     | **Description**                                                                                                                                 | **Example value**                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `ANTHROPIC_BASE_URL`             | The PaletteAI Inference Launchpad inference endpoint. Use the appliance address with no path. Claude Code appends `/v1/messages`.               | `https://amd.spectrocloud.com:8443`                     |
| `ANTHROPIC_AUTH_TOKEN`           | The API token generated in the console. It begins with `lpai_`. `ANTHROPIC_API_KEY` is also accepted.                                           | `lpai_YOUR_TOKEN`                                       |
| `ANTHROPIC_MODEL`                | Optional. The Claude alias Claude Code requests. The appliance maps the alias to the model it serves, so you do not pick the backend model.     | `claude-opus-4-8`                                       |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`   | Optional. The alias Claude Code requests for its Opus-tier work. The appliance maps the alias to the model it serves.                           | `claude-opus-4-8`                                       |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Optional. The alias Claude Code requests for its Sonnet-tier work.                                                                              | `claude-sonnet-4-5`                                     |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`  | Optional. The alias Claude Code requests for its Haiku-tier, background work.                                                                   | `claude-haiku-4-5`                                      |
| `ANTHROPIC_DEFAULT_FABLE_MODEL`  | Optional. The alias Claude Code requests for its Fable-tier work.                                                                               | `claude-fable-5`                                        |
| `CLAUDE_CODE_EFFORT_LEVEL`       | Optional. Sets Claude Code's reasoning effort. One of `low`, `medium`, `high`, `xhigh`, `max`, or `auto`. `auto` uses each model's own default. | `auto`                                                  |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS`  | Optional. The maximum output tokens per response. Lower it to cap reply length and cost.                                                        | `64000`                                                 |
| `NODE_EXTRA_CA_CERTS`            | Path to the platform CA certificate. Required only when the appliance presents a platform-issued certificate.                                   | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |

{/* TODO: confirm the ANTHROPIC_DEFAULT_* and CLAUDE_CODE_EFFORT_LEVEL rows with an SME. The console's "Connect a coding agent" panel emits them, but their appliance behavior is unverified. */}

## Certificate Trust

Claude Code runs on Node.js, which does not trust the platform certificate authority (CA) by default. When the appliance
serves HTTPS with a platform-issued certificate, download the CA from the **Connect a coding agent** panel and point
`NODE_EXTRA_CA_CERTS` at the saved file. This lets Claude Code trust the appliance without turning off certificate
verification.

On Windows, the console writes the certificate path as
`$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Endpoint URL

The endpoint is your appliance's address, the same host you use to reach the console, with no path appended. The gateway
serves the Anthropic Messages API at `/v1/messages`, and Claude Code adds that path itself, so `ANTHROPIC_BASE_URL` must
not include `/v1`. If you do not know the address, ask the administrator who set up the appliance.

## Model Name

Claude Code requests a Claude alias (`claude-opus-4-8`, `claude-sonnet-4-5`, `claude-haiku-4-5`, or `claude-fable-5`),
and the appliance maps that alias to the model it serves. Set `ANTHROPIC_MODEL` to one of these aliases. You do not
select a backend model directly. Both the aliases the appliance accepts and the ids of the models it serves, such as
`glm-5.2`, appear in the console's model list and in the appliance's `/v1/models` API response.

An alias resolves only if the client's Tier map routes it. A client with no Tier map of its own inherits the appliance's
table, where an alias family with no model set falls through to the appliance default model. A client that has its own
Tier map does not inherit that table, so an alias family its own map leaves unset returns an HTTP `404` response. To map
an alias, refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md#route-a-client-to-specific-models).

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Claude Code surfaces the error.
{/* TODO: link once the token quotas and metering reference page exists */}

## Resources

- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md)
- User and API token management {/* TODO: link once page exists */}
- Token quotas and metering {/* TODO: link once page exists */}
- [Routing Behavior](../explanation/routing-behavior.md)
