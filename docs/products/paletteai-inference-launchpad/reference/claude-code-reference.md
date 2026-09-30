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

This page lists the configuration values Claude Code uses to connect to a PaletteAI Inference Launchpad appliance. The
**Claude Code CLI** tab of the console's **Connect a coding agent** panel emits these values. For the steps to set them,
refer to [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md).

## Environment Variables

| **Variable**                     | **Description**                                                                                                                                                                                | **Example value**                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `NODE_EXTRA_CA_CERTS`            | The platform CA certificate file. Set it only when the connect panel shows the **CA certificate** step. Refer to [Platform CA Certificate](#platform-ca-certificate).                          | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |
| `ANTHROPIC_BASE_URL`             | The PaletteAI Inference Launchpad inference endpoint. Use the appliance address with no path. Claude Code appends `/v1/messages`.                                                              | `https://amd.spectrocloud.com:8443`                     |
| `ANTHROPIC_AUTH_TOKEN`           | The API token generated in the console. It begins with `lpai_`. `ANTHROPIC_API_KEY` is also accepted, but do not set it globally if you also sign in to Claude Code with an Anthropic account. | `lpai_YOUR_TOKEN`                                       |
| `ANTHROPIC_MODEL`                | The alias Claude Code requests when no tier applies. The appliance maps the alias to the model it serves, so you do not pick the backend model.                                                | `claude-opus-4-8`                                       |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`   | The alias Claude Code requests for its Opus-tier work.                                                                                                                                         | `claude-opus-4-8`                                       |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | The alias Claude Code requests for its Sonnet-tier work.                                                                                                                                       | `claude-sonnet-4-5`                                     |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`  | The alias Claude Code requests for its Haiku-tier, background work.                                                                                                                            | `claude-haiku-4-5`                                      |
| `ANTHROPIC_DEFAULT_FABLE_MODEL`  | The alias Claude Code requests for its Fable-tier work.                                                                                                                                        | `claude-fable-5`                                        |
| `CLAUDE_CODE_EFFORT_LEVEL`       | Claude Code's reasoning effort. One of `low`, `medium`, `high`, `xhigh`, `max`, or `auto`. The value `auto` leaves each model at its own default.                                              | `auto`                                                  |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS`  | The maximum number of tokens in a single response. Lower it to cap response length and cost.                                                                                                   | `64000`                                                 |

## Endpoint URL

The endpoint is your appliance's address, the same host you use to reach the console, with no path appended. The gateway
serves the Anthropic Messages API at `/v1/messages`, and Claude Code adds that path itself, so `ANTHROPIC_BASE_URL` must
not include `/v1`. If you do not know the address, ask the administrator who set up the appliance.

## Platform CA Certificate

When the appliance serves HTTPS with a certificate issued by its own platform Certificate Authority (CA), the connect
panel adds a **CA certificate** step and includes `NODE_EXTRA_CA_CERTS` in the environment block. The browser saves the
file as `palette-ai-inference-launchpad-ca.crt` in your `Downloads` folder.

| **Condition**                                              | **CA step in the panel** | **`NODE_EXTRA_CA_CERTS` in the block** |
| ---------------------------------------------------------- | ------------------------ | -------------------------------------- |
| Appliance serves HTTPS with a platform-issued certificate  | Shown                    | Included                               |
| Appliance serves HTTPS with a publicly trusted certificate | Not shown                | Omitted                                |
| Console served over plain HTTP                             | Not shown                | Omitted                                |
| TLS status unavailable on an HTTPS console                 | Shown, with a note       | Included                               |

Claude Code runs on Node.js, which reads `NODE_EXTRA_CA_CERTS` as the process starts, so set the variable in the shell
before you start Claude Code. Certificate verification stays on. The appliance never requires
`NODE_TLS_REJECT_UNAUTHORIZED=0`.

The panel writes the path in the dialect you select in its shell picker. The `bash` and `zsh` form is
`$HOME/Downloads/palette-ai-inference-launchpad-ca.crt`, and the PowerShell form is
`$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Model Aliases

Claude Code requests a Claude alias, and the appliance maps that alias to the model it serves. You do not select a
backend model directly. Every tier map seeds the following alias prefixes. A seeded prefix resolves for a client that
inherits the appliance-wide table, and a client with its own Tier map can leave it unmapped. For the rule, refer to
[Routing Behavior](../explanation/routing-behavior.md#the-tier-map).

| **Alias prefix** | **Claude Code tier** | **Example alias**   |
| ---------------- | -------------------- | ------------------- |
| `claude-fable-`  | Fable                | `claude-fable-5`    |
| `claude-opus-`   | Opus                 | `claude-opus-4-8`   |
| `claude-sonnet-` | Sonnet               | `claude-sonnet-4-5` |
| `claude-haiku-`  | Haiku                | `claude-haiku-4-5`  |

Both the aliases the appliance accepts and the ids of the models it serves, such as `glm-5.2`, appear in the console's
model list and in the appliance's `/v1/models` API response. For how an alias resolves to a model, refer to
[Routing Behavior](../explanation/routing-behavior.md).

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Claude Code surfaces the error. For
how quotas apply, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Resources

- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md)
- [Generate an API Token](../how-to-guides/generate-an-api-token.md)
- [Clients and Quotas](../explanation/clients-and-quotas.md)
- [Routing Behavior](../explanation/routing-behavior.md)
