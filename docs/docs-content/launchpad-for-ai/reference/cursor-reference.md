---
sidebar_label: "Cursor Configuration"
title: "Launchpad for AI Cursor Configuration"
description:
  "Reference for the settings and values used to connect the Cursor code editor to a Launchpad for AI appliance."
hide_table_of_contents: false
sidebar_position: 6
tags: ["launchpad-for-ai", "cursor", "reference"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "base url", "model alias", "api token"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This page lists the configuration values Cursor uses to connect to a Launchpad for AI appliance. For the steps to set
them, refer to [Use Launchpad for AI with Cursor](../how-to-guides/use-cursor.md).

## Settings

Set the following in Cursor under **Settings** > **Models**.

| Setting                     | Description                                                                                                        | Example value                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| **Override OpenAI Base URL** | The Launchpad for AI inference endpoint. Use the appliance address with the `/v1` path appended.                   | `https://amd.spectrocloud.com:8443/v1` |
| **OpenAI API Key**          | The API token generated in the console. It begins with `lpai_`.                                                    | `lpai_YOUR_TOKEN`                      |
| **Add model**               | The unique alias name the appliance serves. Enter the alias, not the backend model id.                             | `launchpad-glm52`                      |

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
reach the appliance, an operator must serve the model under a unique alias name that does not appear in Cursor's catalog.

An operator creates the alias on the appliance, which maps it to a model the appliance already serves, such as
`zai-org/GLM-5.2`. Both the alias and the ids of the models the appliance serves appear in the console model list and in
the appliance's `/v1/models` API response.

## Supported Modes

| Cursor mode      | Supported | Notes                                                                                     |
| ---------------- | --------- | ----------------------------------------------------------------------------------------- |
| Ask (chat)       | Yes       | Routes to the appliance through the model alias.                                          |
| Agent            | No        | Locked to Cursor's own models for bring-your-own-key setups.                              |
| Edit             | No        | Locked to Cursor's own models for bring-your-own-key setups.                              |
| Tab              | No        | Locked to Cursor's own models for bring-your-own-key setups.                              |

The unsupported modes are a limitation of Cursor's bring-your-own-key support, not of the appliance.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Cursor surfaces the error.
{/* TODO: link to the token quotas and metering reference once it exists */}

## Resources

- [Use Launchpad for AI with Cursor](../how-to-guides/use-cursor.md)
- [Use Launchpad for AI with Claude Code](../how-to-guides/use-claude-code.md)
- Intelligent routing and tier maps {/* TODO: link once page exists */}
- Token quotas and metering {/* TODO: link once page exists */}
