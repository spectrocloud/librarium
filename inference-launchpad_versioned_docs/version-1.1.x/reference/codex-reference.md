---
sidebar_label: "OpenAI Codex Configuration"
title: "PaletteAI Inference Launchpad OpenAI Codex Configuration"
description:
  "Reference for the configuration file fields and values used to connect the OpenAI Codex CLI to a PaletteAI Inference
  Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 7
tags: ["paletteai-inference-launchpad", "codex", "reference"]
keywords: ["launchpad", "ai", "openai codex", "codex cli", "config.toml", "responses api", "api token", "model"]
---

This page lists the configuration values the OpenAI Codex CLI uses to connect to a PaletteAI Inference Launchpad
appliance. The **Codex CLI** tab of the console's **Connect a coding agent** panel emits these values. For the steps to
set them, refer to [Use PaletteAI Inference Launchpad with OpenAI Codex](../how-to-guides/use-codex.md).

## Configuration File

Codex reads its configuration from `~/.codex/config.toml` in the home folder, not from a project folder.

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

| **Field**        | **Description**                                                                       | **Example value**                      |
| ---------------- | ------------------------------------------------------------------------------------- | -------------------------------------- |
| `model`          | The alias or served model id Codex requests. Refer to [Model Name](#model-name).      | `gpt-5.6`                              |
| `model_provider` | The provider Codex uses. Must match the name of the `[model_providers.<name>]` table. | `launchpad`                            |
| `name`           | A display name for the provider.                                                      | `PaletteAI Inference Launchpad`        |
| `base_url`       | The appliance inference endpoint, with the `/v1` path appended.                       | `https://amd.spectrocloud.com:8443/v1` |
| `wire_api`       | The API Codex uses. Codex uses the Responses API, so set this to `responses`.         | `responses`                            |
| `env_key`        | The name of the environment variable that holds your API token.                       | `LAUNCHPAD_API_KEY`                    |

## Environment Variables

Codex reads both values from the shell. A TOML file cannot hold an `export` line, so neither value belongs in
`config.toml`.

| **Variable**           | **Description**                                                                                                                                                       | **Example value**                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `CODEX_CA_CERTIFICATE` | The platform CA certificate file. Set it only when the connect panel shows the **CA certificate** step. Refer to [Platform CA Certificate](#platform-ca-certificate). | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |
| `LAUNCHPAD_API_KEY`    | The API token generated in the console. It begins with `lpai_`. The `env_key` field names this variable.                                                              | `lpai_YOUR_TOKEN`                                       |

## Endpoint URL

Set `base_url` to your appliance's address, the same host you use to reach the console, with `/v1` appended. The gateway
serves the Responses API at `/v1/responses`, and Codex appends the `/responses` path itself, so `base_url` ends at
`/v1`. If you do not know the address, ask the administrator who set up the appliance.

## Platform CA Certificate

When the appliance serves HTTPS with a certificate issued by its own platform Certificate Authority (CA), the connect
panel adds a **CA certificate** step and a `CODEX_CA_CERTIFICATE` export. The browser saves the file as
`palette-ai-inference-launchpad-ca.crt` in your `Downloads` folder.

| **Condition**                                              | **CA step in the panel** | **`CODEX_CA_CERTIFICATE` export** |
| ---------------------------------------------------------- | ------------------------ | --------------------------------- |
| Appliance serves HTTPS with a platform-issued certificate  | Shown                    | Included                          |
| Appliance serves HTTPS with a publicly trusted certificate | Not shown                | Omitted                           |
| Console served over plain HTTP                             | Not shown                | Omitted                           |
| TLS status unavailable on an HTTPS console                 | Shown, with a note       | Included                          |

Codex layers the platform CA on top of the system trust store, so certificate verification stays on and Codex keeps
reaching its own hosted services. Because Codex sends each request from the machine it runs on, this export is enough to
reach an appliance on a private network.

The panel writes the path in the dialect you select in its shell picker. The `bash` and `zsh` form is
`$HOME/Downloads/palette-ai-inference-launchpad-ca.crt`, and the PowerShell form is
`$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Model Name

The appliance seeds a `gpt-` alias prefix in every tier map, so the alias the panel emits works over the Responses API.
The seeded prefix resolves for a client that inherits the appliance-wide table, and a client with its own Tier map can
leave it unmapped. For the rule, refer to [Routing Behavior](../explanation/routing-behavior.md#the-tier-map).

A served model id, such as `glm-5.2`, also works. Do not use `auto`, because `auto` bypasses the Tier map and reaches
the semantic router, so it names no model the Tier map can rewrite. The served model ids and the aliases both appear in
the console model list and in the appliance's `/v1/models` API response.

## Requirements

- Network access from the machine that runs Codex to the appliance.
- The gateway must accept the `developer` message role, which the PaletteAI Inference Launchpad gateway does.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Codex surfaces the error. For how
quotas apply, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Resources

- [Use PaletteAI Inference Launchpad with OpenAI Codex](../how-to-guides/use-codex.md)
- [Generate an API Token](../how-to-guides/generate-an-api-token.md)
- [Clients and Quotas](../explanation/clients-and-quotas.md)
- [Routing Behavior](../explanation/routing-behavior.md)
