---
sidebar_label: "Cursor Configuration"
title: "PaletteAI Inference Launchpad Cursor Configuration"
description:
  "Reference for the settings and values used to connect the Cursor code editor to a PaletteAI Inference Launchpad
  appliance."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "cursor", "reference"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "base url", "model alias", "api token"]
---

This page lists the configuration values Cursor uses to connect to a PaletteAI Inference Launchpad appliance. For the
steps to set them, refer to [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md).

## Settings

Set the following in Cursor under **Settings** > **Models**.

| **Setting**                  | **Description**                                                                                               | **Example value**                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Override OpenAI Base URL** | The PaletteAI Inference Launchpad inference endpoint. Use the appliance address with the `/v1` path appended. | `https://amd.spectrocloud.com:8443/v1` |
| **OpenAI API Key**           | The API token generated in the console. It begins with `lpai_`.                                               | `lpai_YOUR_TOKEN`                      |
| **Add model**                | The unique alias name the appliance serves. Enter the alias, not the backend model id.                        | `launchpad-glm52`                      |

## Endpoint URL

Cursor uses the OpenAI-compatible API, which the gateway serves at `/v1`. Set **Override OpenAI Base URL** to your
appliance's address, the same host you use to reach the console, with `/v1` appended. This differs from Claude Code,
which uses the Anthropic Messages API and adds the path itself.

The appliance must have a valid, publicly trusted TLS certificate on a DNS name. Cursor sends the request from its own
cloud servers rather than from your machine, so it does not accept a self-signed certificate and offers no way to skip
certificate verification.

## Model Name and Aliases

Cursor decides where to route a request by the model name. If the name matches a model in Cursor's built-in catalog,
such as `glm-5.2` or `gpt-4o`, Cursor routes the request to its own backend, and the appliance receives nothing. To
reach the appliance, an operator must serve the model under a unique alias name that does not appear in Cursor's
catalog.

An operator creates the alias on the appliance, which maps it to a model the appliance already serves, such as
`zai-org/GLM-5.2`. Both the alias and the ids of the models the appliance serves appear in the console model list and in
the appliance's `/v1/models` API response.

{/* NEEDS REVIEW: the console's "Connect coding agent" > Cursor tab suggests the model `claude-opus-4-8`, which likely matches Cursor's built-in catalog and would route to Cursor's own backend. Confirm with an SME; the unique-alias approach is what reliably reaches the appliance. */}

## Supported Modes

| **Cursor mode** | **Supported** | **Notes**                                                    |
| --------------- | ------------- | ------------------------------------------------------------ |
| Ask (chat)      | Yes           | Routes to the appliance through the model alias.             |
| Agent           | No            | Locked to Cursor's own models for bring-your-own-key setups. |
| Edit            | No            | Locked to Cursor's own models for bring-your-own-key setups. |
| Tab             | No            | Locked to Cursor's own models for bring-your-own-key setups. |

The unsupported modes are a limitation of Cursor's bring-your-own-key support, not of the appliance.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Cursor surfaces the error.
{/* TODO: link to the token quotas and metering reference once it exists */}

## Resources

- [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md)
- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md)
- [Routing Behavior](../explanation/routing-behavior.md)
- Token quotas and metering {/* TODO: link once page exists */}
