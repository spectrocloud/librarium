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

| **Field**             | **Description**                                                                                                                        | **Example value**                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `$schema`             | The OpenCode configuration schema. Enables validation and autocompletion in an editor.                                                 | `https://opencode.ai/config.json`                    |
| `provider.<key>`      | A custom provider entry. The key, such as `launchpad`, is the provider name you combine with a model name when you select a model.     | `launchpad`                                          |
| `npm`                 | The provider plugin OpenCode loads. For an OpenAI-compatible endpoint, use `@ai-sdk/openai-compatible`.                                | `@ai-sdk/openai-compatible`                          |
| `name`                | A display name for the provider. The `name` nested under a model key is a separate field, documented in its own row below.             | `PaletteAI Inference Launchpad`                      |
| `options.baseURL`     | The appliance inference endpoint, with the `/v1` path appended.                                                                        | `https://amd.spectrocloud.com:8443/v1`               |
| `options.apiKey`      | Your API token. Use the `{env:LAUNCHPAD_API_KEY}` reference so the file holds no secret.                                               | `{env:LAUNCHPAD_API_KEY}`                            |
| `models`              | A map of the models you want to use. Each key is a tier-map alias or a served model id.                                                | `claude-opus-4-8`                                    |
| `models.*.name`       | A label for the model in OpenCode's model picker. It does not affect routing.                                                          | `Claude Opus`                                        |
| `models.*.tool_call`  | Whether the model accepts tool calls. Declare this explicitly, as described in [Model Capabilities](#model-capabilities).              | `true`                                               |
| `models.*.reasoning`  | Whether the model produces reasoning output. Declare this explicitly, as described in [Model Capabilities](#model-capabilities).       | `true`                                               |
| `models.*.modalities` | The input and output types the model accepts. Declare this explicitly, as described in [Model Capabilities](#model-capabilities).      | `{ "input": ["text", "image"], "output": ["text"] }` |
| `models.*.limit`      | The context and output token ceilings OpenCode applies to the model. Set these to the real ceilings of the model the appliance serves. | `{ "context": 200000, "output": 64000 }`             |

## Environment Variables

OpenCode reads both of the following from your shell.

| **Variable**          | **Description**                                                                                               | **Example value**                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `LAUNCHPAD_API_KEY`   | The API token generated in the console. It begins with `lpai_`. The `apiKey` field reads it by reference.     | `lpai_YOUR_TOKEN`                                       |
| `NODE_EXTRA_CA_CERTS` | Path to the platform CA certificate. Required only when the appliance presents a platform-issued certificate. | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |

<PartialsComponent category="paletteai-inference-launchpad" name="windows-ca-certificate-path" />

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

<PartialsComponent category="paletteai-inference-launchpad" name="tier-map-alias-resolution" />

## Model Capabilities

OpenCode resolves a model's capabilities against a public model catalog, which holds no entry for a custom provider.
Every capability you do not declare therefore defaults to unsupported, including `tool_call`, `reasoning`, and each
input type in `modalities`.

Declare `modalities` explicitly on each model. Without `image` in the input list, OpenCode replaces a pasted image with
an unsupported note on the client side, and the appliance never receives the image. To let the appliance answer
questions about images, refer to [Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).

The panel fills `limit` with the ceilings of the model it generated the configuration for. A `models` key can be a
tier-map alias, which the appliance resolves to whatever model it serves, so confirm the values against that model's
real context and output ceilings. A context ceiling above the served model's own causes OpenCode to pack a request the
appliance then rejects.

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
