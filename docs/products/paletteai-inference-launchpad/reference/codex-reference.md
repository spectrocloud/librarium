---
sidebar_label: "OpenAI Codex Configuration"
title: "PaletteAI Inference Launchpad OpenAI Codex Configuration"
description:
  "Reference for the configuration file fields and values used to connect the OpenAI Codex CLI to a PaletteAI Inference
  Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 7
tags: ["paletteai-inference-launchpad", "codex", "reference"]
keywords:
  ["launchpad", "ai", "openai codex", "codex cli", "config.toml", "responses api", "api token", "model", "platform ca"]
---

This page lists the configuration values the OpenAI Codex CLI uses to connect to a PaletteAI Inference Launchpad
appliance. For the steps to set them, refer to
[Use PaletteAI Inference Launchpad with OpenAI Codex](../how-to-guides/use-codex.md).

## Configuration File

Codex reads its configuration from `~/.codex/config.toml`, in your home folder rather than a project folder. Add a
custom model provider for the appliance.

```toml
model = "gpt-5.6"
model_provider = "launchpad"

[model_providers.launchpad]
name = "PaletteAI Inference Launchpad"
base_url = "https://amd.spectrocloud.com:8443/v1"
wire_api = "responses"
env_key = "LAUNCHPAD_API_KEY"
```

## Fields

| **Field**        | **Description**                                                                                                                                                                                                        | **Example value**                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `model`          | The model the appliance answers with. Accepts a tier-map alias, such as `gpt-5.6`, or a served model id. Do not use `auto`, which is neither a tier-map alias nor a served model id, so the gateway cannot resolve it. | `gpt-5.6`                              |
| `model_provider` | The provider Codex uses. Must match the name of the `[model_providers.<name>]` table.                                                                                                                                  | `launchpad`                            |
| `name`           | A display name for the provider.                                                                                                                                                                                       | `PaletteAI Inference Launchpad`        |
| `base_url`       | The appliance inference endpoint, with the `/v1` path appended.                                                                                                                                                        | `https://amd.spectrocloud.com:8443/v1` |
| `wire_api`       | The API Codex uses. Codex uses the Responses API, so set this to `responses`.                                                                                                                                          | `responses`                            |
| `env_key`        | The name of the environment variable that holds your API token.                                                                                                                                                        | `LAUNCHPAD_API_KEY`                    |

## Environment Variables

Codex reads both of the following from your shell. Neither belongs in `config.toml`, because an `export` line inside the
file fails the Codex configuration parse.

| **Variable**           | **Description**                                                                                               | **Example value**                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `LAUNCHPAD_API_KEY`    | The API token generated in the console. It begins with `lpai_`. The variable name must match `env_key`.       | `lpai_YOUR_TOKEN`                                       |
| `CODEX_CA_CERTIFICATE` | Path to the platform CA certificate. Required only when the appliance presents a platform-issued certificate. | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |

On Windows, the console writes the certificate path as
`$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Endpoint URL

Set `base_url` to your appliance's address, the same host you use to reach the console, with `/v1` appended. The gateway
serves the Responses API at `/v1/responses`, and Codex appends the `/responses` path itself, so `base_url` ends at
`/v1`. If you do not know the address, ask the administrator who set up the appliance.

## Certificate Trust

Codex validates TLS strictly and cannot skip certificate verification. When the appliance serves HTTPS with a
certificate issued by the platform's own certificate authority (CA), download the CA from the **Connect a coding agent**
panel and point `CODEX_CA_CERTIFICATE` at the saved file.

Codex is written in Rust, so it does not read `NODE_EXTRA_CA_CERTS`. It layers `CODEX_CA_CERTIFICATE` on top of your
system roots rather than replacing them, so Codex's other connections keep working with only the platform CA in the
file. This also means you do not have to add the CA to your machine's system trust store.

## Model Name

Codex sends the value of `model` to the appliance over the Responses API. The gateway resolves tier-map aliases on that
path, so `model` accepts either an alias such as `gpt-5.6` or the id of a model the appliance serves. Both the aliases
and the served model ids appear in the console model list and in the appliance's `/v1/models` API response.

An alias resolves only if the client's Tier map routes it. A client with no Tier map of its own inherits the appliance's
table, where an alias family with no model set falls through to the appliance default model. A client that has its own
Tier map does not inherit that table, so an alias family its own map leaves unset returns an HTTP `404` response. To map
an alias, refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md#route-a-client-to-specific-models).

## Requirements

- Your machine must be able to reach the appliance address. Codex sends every request from your own machine, so an
  appliance on a private network works as long as your machine is on that network or connected to it.
- The appliance must present a TLS certificate that Codex trusts, either one your organization supplied or the
  platform-issued certificate paired with `CODEX_CA_CERTIFICATE`.
- The gateway must accept the `developer` message role, which the PaletteAI Inference Launchpad gateway does.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Codex surfaces the error.
{/* TODO: link to the token quotas and metering reference once it exists */}

## Resources

- [Use PaletteAI Inference Launchpad with OpenAI Codex](../how-to-guides/use-codex.md)
- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md)
- [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md)
- [Routing Behavior](../explanation/routing-behavior.md)
- Token quotas and metering {/* TODO: link once page exists */}
