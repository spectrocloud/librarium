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

This page lists the configuration values OpenCode uses to connect to a PaletteAI Inference Launchpad appliance. The
**OpenCode** tab of the console's **Connect a coding agent** panel emits these values. For the steps to set them, refer
to [Use PaletteAI Inference Launchpad with OpenCode](../how-to-guides/use-opencode.md).

## Configuration File

OpenCode reads `~/.config/opencode/opencode.json` for every project, and `opencode.json` in a project directory for that
project only.

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

| **Field**                  | **Description**                                                                                                                                              | **Example value**                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `$schema`                  | The OpenCode configuration schema. Enables validation and autocompletion in an editor.                                                                       | `https://opencode.ai/config.json`                    |
| `provider.<key>`           | A custom provider entry. The key, such as `launchpad`, is the provider name you combine with a model name when you select a model.                           | `launchpad`                                          |
| `npm`                      | The provider plugin OpenCode loads. For an OpenAI-compatible endpoint, use `@ai-sdk/openai-compatible`.                                                      | `@ai-sdk/openai-compatible`                          |
| `name`                     | A display name for the provider.                                                                                                                             | `PaletteAI Inference Launchpad`                      |
| `options.baseURL`          | The appliance inference endpoint, with the `/v1` path appended.                                                                                              | `https://amd.spectrocloud.com:8443/v1`               |
| `options.apiKey`           | The API token. The `{env:LAUNCHPAD_API_KEY}` form reads the token from the environment, so the token stays out of the file.                                  | `{env:LAUNCHPAD_API_KEY}`                            |
| `models.<name>`            | A model the appliance serves, keyed by the alias or served model id you request.                                                                             | `claude-opus-4-8`                                    |
| `models.<name>.name`       | A label for the model in the OpenCode model picker.                                                                                                          | `Claude Opus`                                        |
| `models.<name>.tool_call`  | Whether OpenCode may send tool calls to the model.                                                                                                           | `true`                                               |
| `models.<name>.reasoning`  | Whether OpenCode treats the model as reasoning-capable.                                                                                                      | `true`                                               |
| `models.<name>.modalities` | The input and output types the model accepts. Declare `image` input so OpenCode forwards attached images instead of replacing them with an unsupported note. | `{ "input": ["text", "image"], "output": ["text"] }` |
| `models.<name>.limit`      | The context window and the maximum output tokens OpenCode assumes for the model.                                                                             | `{ "context": 200000, "output": 64000 }`             |

OpenCode resolves a model's capabilities against a public catalog that has no entry for a custom provider, so it treats
any capability you do not declare as unavailable.

## Environment Variables

OpenCode reads both values from the shell.

| **Variable**          | **Description**                                                                                                                                                       | **Example value**                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `NODE_EXTRA_CA_CERTS` | The platform CA certificate file. Set it only when the connect panel shows the **CA certificate** step. Refer to [Platform CA Certificate](#platform-ca-certificate). | `$HOME/Downloads/palette-ai-inference-launchpad-ca.crt` |
| `LAUNCHPAD_API_KEY`   | The API token generated in the console. It begins with `lpai_`. The `options.apiKey` field reads this variable.                                                       | `lpai_YOUR_TOKEN`                                       |

## Endpoint URL

Set `baseURL` to your appliance's address, the same host you use to reach the console, with `/v1` appended. The gateway
serves the OpenAI-compatible API under `/v1`, and the `@ai-sdk/openai-compatible` provider appends the remaining path,
such as `/chat/completions`, itself, so `baseURL` ends at `/v1`. If you do not know the address, ask the administrator
who set up the appliance.

## Platform CA Certificate

When the appliance serves HTTPS with a certificate issued by its own platform Certificate Authority (CA), the connect
panel adds a **CA certificate** step and a `NODE_EXTRA_CA_CERTS` export. The browser saves the file as
`palette-ai-inference-launchpad-ca.crt` in your `Downloads` folder.

| **Condition**                                              | **CA step in the panel** | **`NODE_EXTRA_CA_CERTS` export** |
| ---------------------------------------------------------- | ------------------------ | -------------------------------- |
| Appliance serves HTTPS with a platform-issued certificate  | Shown                    | Included                         |
| Appliance serves HTTPS with a publicly trusted certificate | Not shown                | Omitted                          |
| Console served over plain HTTP                             | Not shown                | Omitted                          |
| TLS status unavailable on an HTTPS console                 | Shown, with a note       | Included                         |

OpenCode runs on Node.js, which reads `NODE_EXTRA_CA_CERTS` as the process starts, so set the variable in the shell
before you start OpenCode. Certificate verification stays on. The appliance never requires
`NODE_TLS_REJECT_UNAUTHORIZED=0`. Because OpenCode sends each request from the machine it runs on, this export is enough
to reach an appliance on a private network.

The panel writes the path in the dialect you select in its shell picker. The `bash` and `zsh` form is
`$HOME/Downloads/palette-ai-inference-launchpad-ca.crt`, and the PowerShell form is
`$env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt`.

## Model Name

OpenCode selects a model by a `provider/model` value, such as `launchpad/claude-opus-4-8`, and splits the value on the
first slash. The part before the slash is the provider key, and the part after it is a key you listed under `models`.
That key can be an alias the appliance seeds, such as `claude-opus-4-8`, or a served model id, such as `glm-5.2`. Both
appear in the console model list and in the appliance's `/v1/models` API response. A seeded prefix resolves for a client
that inherits the appliance-wide table, and a client with its own Tier map can leave it unmapped. For the rule, refer to
[Routing Behavior](../explanation/routing-behavior.md#the-tier-map).

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and OpenCode surfaces the error. For how
quotas apply, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Resources

- [Use PaletteAI Inference Launchpad with OpenCode](../how-to-guides/use-opencode.md)
- [Generate an API Token](../how-to-guides/generate-an-api-token.md)
- [Clients and Quotas](../explanation/clients-and-quotas.md)
- [Routing Behavior](../explanation/routing-behavior.md)
