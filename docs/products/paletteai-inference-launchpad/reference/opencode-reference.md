---
sidebar_label: "OpenCode Configuration"
title: "PaletteAI Inference Launchpad OpenCode Configuration"
description:
  "Reference for the configuration file fields and values used to connect the OpenCode terminal coding agent to a
  PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 8
tags: ["paletteai-inference-launchpad", "opencode", "reference"]
keywords:
  [
    "launchpad",
    "ai",
    "opencode",
    "opencode.json",
    "openai-compatible",
    "custom provider",
    "api token",
    "model",
    "platform ca",
  ]
---

This page lists the configuration values OpenCode uses to connect to a PaletteAI Inference Launchpad appliance. For the
steps to set them, refer to [Use PaletteAI Inference Launchpad with OpenCode](../how-to-guides/use-opencode.md).

## Configuration File

OpenCode reads its configuration from `opencode.json`. Place the file in a project folder to apply it to one project, or
at `~/.config/opencode/opencode.json` to apply it everywhere. Add a custom provider for the appliance.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "launchpad": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "PaletteAI Inference Launchpad",
      "options": {
        "baseURL": "https://amd.spectrocloud.com:8443/v1",
        "apiKey": "{env:LAUNCHPAD_API_KEY}"
      },
      "models": {
        "claude-opus-4-8": {
          "name": "Claude Opus",
          "tool_call": true,
          "reasoning": true,
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "limit": { "context": 200000, "output": 64000 }
        }
      }
    }
  }
}
```

## Fields

| **Field**             | **Description**                                                                                                                    | **Example value**                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `$schema`             | The OpenCode configuration schema. Enables validation and autocompletion in an editor.                                             | `https://opencode.ai/config.json`                    |
| `provider.<key>`      | A custom provider entry. The key, such as `launchpad`, is the provider name you combine with a model name when you select a model. | `launchpad`                                          |
| `npm`                 | The provider plugin OpenCode loads. For an OpenAI-compatible endpoint, use `@ai-sdk/openai-compatible`.                            | `@ai-sdk/openai-compatible`                          |
| `name`                | A display name for the provider.                                                                                                   | `PaletteAI Inference Launchpad`                      |
| `options.baseURL`     | The appliance inference endpoint, with the `/v1` path appended.                                                                    | `https://amd.spectrocloud.com:8443/v1`               |
| `options.apiKey`      | Your API token. Use the `{env:LAUNCHPAD_API_KEY}` reference so the file holds no secret.                                           | `{env:LAUNCHPAD_API_KEY}`                            |
| `models`              | A map of the models you want to use. Each key is a tier-map alias or a served model id.                                            | `claude-opus-4-8`                                    |
| `models.*.modalities` | The input and output types the model accepts. Declare this explicitly, as described in [Model Capabilities](#model-capabilities).  | `{ "input": ["text", "image"], "output": ["text"] }` |
| `models.*.limit`      | The context and output token ceilings OpenCode applies to the model.                                                               | `{ "context": 200000, "output": 64000 }`             |

## Environment Variables

OpenCode reads both of the following from your shell.

| **Variable**          | **Description**                                                                                               | **Example value**                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `LAUNCHPAD_API_KEY`   | The API token generated in the console. It begins with `lpai_`. The `apiKey` field reads it by reference.     | `lpai_YOUR_TOKEN`                                       |
| `NODE_EXTRA_CA_CERTS` | Path to the platform CA certificate. Required only when the appliance presents a platform-issued certificate. | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |

On Windows, the console writes the certificate path as
`$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Endpoint URL

Set `baseURL` to your appliance's address, the same host you use to reach the console, with `/v1` appended. The gateway
serves the OpenAI-compatible API under `/v1`, and the `@ai-sdk/openai-compatible` provider appends the remaining path,
such as `/chat/completions`, itself, so `baseURL` ends at `/v1`. If you do not know the address, ask the administrator
who set up the appliance.

## Certificate Trust

OpenCode runs on Node.js, which does not trust the platform certificate authority (CA) by default. When the appliance
serves HTTPS with a platform-issued certificate, download the CA from the **Connect a coding agent** panel and point
`NODE_EXTRA_CA_CERTS` at the saved file. This lets OpenCode trust the appliance without turning off certificate
verification.

## Model Name

OpenCode selects a model by a `provider/model` value, such as `launchpad/claude-opus-4-8`, and splits the value on the
first slash. The part before the slash is the provider key, and the part after it is a key you listed under `models`.
That key can be a tier-map alias, such as `claude-opus-4-8`, or the id of a model the appliance serves, such as
`glm-5.2`. Both appear in the console model list and in the appliance's `/v1/models` API response.

An alias resolves only if the client's Tier map routes it. A client with no Tier map of its own inherits the appliance's
table, where an alias family with no model set falls through to the appliance default model. A client that has its own
Tier map does not inherit that table, so an alias family its own map leaves unset returns an HTTP `404` response. To map
an alias, refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md#route-a-client-to-specific-models).

## Model Capabilities

OpenCode resolves a model's capabilities against a public model catalog, which holds no entry for a custom provider.
Every input type you do not declare therefore defaults to unsupported.

Declare `modalities` explicitly on each model. Without `image` in the input list, OpenCode replaces a pasted image with
an unsupported note on the client side, and the appliance never receives the image. To let the appliance answer
questions about images, refer to [Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).

## Requirements

- Your machine must be able to reach the appliance address. OpenCode sends every request from your own machine, so an
  appliance on a private network works as long as your machine is on that network or connected to it.
- The appliance must present a TLS certificate that OpenCode trusts, either one your organization supplied or the
  platform-issued certificate paired with `NODE_EXTRA_CA_CERTS`.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and OpenCode surfaces the error.
{/* TODO: link to the token quotas and metering reference once it exists */}

## Resources

- [Use PaletteAI Inference Launchpad with OpenCode](../how-to-guides/use-opencode.md)
- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md)
- [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md)
- [Use PaletteAI Inference Launchpad with OpenAI Codex](../how-to-guides/use-codex.md)
- [Routing Behavior](../explanation/routing-behavior.md)
- Token quotas and metering {/* TODO: link once page exists */}
