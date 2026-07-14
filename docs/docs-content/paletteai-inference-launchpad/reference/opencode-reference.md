---
sidebar_label: "OpenCode Configuration"
title: "PaletteAI Inference Launchpad OpenCode Configuration"
description:
  "Reference for the configuration file fields and values used to connect the OpenCode terminal coding agent to a
  PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 8
tags: ["paletteai-inference-launchpad", "opencode", "reference"]
keywords: ["launchpad", "ai", "opencode", "opencode.json", "openai-compatible", "custom provider", "api token", "model"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This page lists the configuration values OpenCode uses to connect to a PaletteAI Inference Launchpad appliance. For the
steps to set them, refer to [Use PaletteAI Inference Launchpad with OpenCode](../how-to-guides/use-opencode.md).

## Configuration File

OpenCode reads its configuration from `~/.config/opencode/opencode.json`. Add a custom provider for the appliance.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "launchpad": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Launchpad",
      "options": {
        "baseURL": "https://amd.spectrocloud.com:8443/v1",
        "apiKey": "<lpai-token>"
      },
      "models": {
        "glm-5.2": { "name": "GLM-5.2 (Launchpad)" }
      }
    }
  }
}
```

## Fields

| **Field**         | **Description**                                                                                                                  | **Example value**                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `$schema`         | The OpenCode configuration schema. Enables validation and autocompletion in an editor.                                           | `https://opencode.ai/config.json`      |
| `provider.<key>`  | A custom provider entry. The key, such as `launchpad`, is the provider name you combine with a model id when you select a model. | `launchpad`                            |
| `npm`             | The provider plugin OpenCode loads. For an OpenAI-compatible endpoint, use `@ai-sdk/openai-compatible`.                          | `@ai-sdk/openai-compatible`            |
| `name`            | A display name for the provider.                                                                                                 | `Launchpad`                            |
| `options.baseURL` | The appliance inference endpoint, with the `/v1` path appended.                                                                  | `https://amd.spectrocloud.com:8443/v1` |
| `options.apiKey`  | Your API token. The console generates it, and it begins with `lpai_`.                                                            | `<lpai-token>`                         |
| `models`          | A map of the model ids the appliance serves that you want to use. Each key is a served model id, and its `name` is a label.      | `glm-5.2`                              |

## Endpoint URL

Set `baseURL` to your appliance's address, the same host you use to reach the console, with `/v1` appended. The gateway
serves the OpenAI-compatible API under `/v1`, and the `@ai-sdk/openai-compatible` provider appends the remaining path,
such as `/chat/completions`, itself, so `baseURL` ends at `/v1`. If you do not know the address, ask the administrator
who set up the appliance.

## API Token

OpenCode reads the token from the `apiKey` field in the provider's `options`. The token is generated in the console and
begins with `lpai_`.

## Model Name

OpenCode selects a model by a `provider/model` value, such as `launchpad/glm-5.2`, and splits the value on the first
slash. The part before the slash is the provider key, and the part after it is a model id you listed under `models`. Use
a model the appliance serves, such as `glm-5.2`. The served model ids appear in the console model list and in the
appliance's `/v1/models` API response.

## Requirements

- The connection uses HTTPS. We strongly recommend a DNS hostname with a valid, publicly trusted TLS certificate so that
  the certificate protects your token in transit.
- OpenCode runs on Node.js. If the appliance uses a self-signed certificate, OpenCode rejects the connection by default.
  As a temporary measure for testing, set `NODE_TLS_REJECT_UNAUTHORIZED=0` before you start OpenCode. This disables
  certificate verification, so do not use it outside short-lived testing.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and OpenCode surfaces the error.
{/* TODO: link to the token quotas and metering reference once it exists */}

## Resources

- [Use PaletteAI Inference Launchpad with OpenCode](../how-to-guides/use-opencode.md)
- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md)
- [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md)
- [Use PaletteAI Inference Launchpad with OpenAI Codex](../how-to-guides/use-codex.md)
- Intelligent routing and tier maps {/* TODO: link once page exists */}
- Token quotas and metering {/* TODO: link once page exists */}
