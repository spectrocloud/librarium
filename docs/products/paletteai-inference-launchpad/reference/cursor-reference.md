---
sidebar_label: "Cursor Configuration"
title: "PaletteAI Inference Launchpad Cursor Configuration"
description:
  "Reference for the settings and values used to connect the Cursor code editor to a PaletteAI Inference Launchpad
  appliance."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "cursor", "reference"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "base url", "model alias", "api token", "platform ca"]
---

This page lists the configuration values Cursor uses to connect to a PaletteAI Inference Launchpad appliance. For the
steps to set them, refer to [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md).

## Settings

Set the following in Cursor under **Settings** > **Models**.

| **Setting**                  | **Description**                                                                                                                                                                                                          | **Example value**                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| **OpenAI API Key**           | The API token generated in the console. It begins with `lpai_`.                                                                                                                                                          | `lpai_YOUR_TOKEN`                      |
| **Override OpenAI Base URL** | The endpoint Cursor sends model requests to, with the `/v1` path appended. Use the appliance address only when Cursor's cloud can reach it, as described in [Where Cursor Sends Requests](#where-cursor-sends-requests). | `https://amd.spectrocloud.com:8443/v1` |
| Model list                   | A GPT model you enable, then select in chat.                                                                                                                                                                             | `gpt-5.6`                              |

## Endpoint URL

Cursor uses the OpenAI-compatible API, which the gateway serves at `/v1`. Set **Override OpenAI Base URL** to your
appliance's address, the same host you use to reach the console, with `/v1` appended. This differs from Claude Code,
which uses the Anthropic Messages API and adds the path itself.

When Cursor's cloud cannot reach the appliance address, enter the address you exposed the inference endpoint at instead,
with `/v1` appended. For which addresses qualify, refer to [Where Cursor Sends Requests](#where-cursor-sends-requests).

## Where Cursor Sends Requests

Cursor sends model requests from Cursor's own cloud servers, not from your machine. The endpoint you enter as the base
URL must therefore be reachable from the public internet and must present a valid, publicly trusted TLS certificate on a
DNS name.

An appliance on a private network, or one that presents only a platform-issued certificate, does not meet either
condition, and Cursor offers no way to skip certificate verification. Reaching such an appliance requires exposing its
inference endpoint at an address Cursor's cloud can reach, and entering that address as the base URL. This is a Cursor
product limit rather than an appliance defect. For details, refer to
[Cursor Requires a Reachable Endpoint](../how-to-guides/use-cursor.md#cursor-requires-a-reachable-endpoint).

## Certificate Trust

Cursor is a desktop application, so the shell environment variables the other coding agents use do not reach it. The
**Connect a coding agent** panel shows the **CA certificate** step on the Cursor tab because the panel is agent-generic.
To follow it, import the platform CA into your operating system trust store and restart Cursor.

The import alone never completes the connection. It does not cover the model request, and it does not make an appliance
on a private network reachable, because your machine is not what sends the model request.

Trusting this root makes the platform CA trusted for every host the machine connects to, so do this only on a machine
you control for an appliance you administer, and remove the certificate when you no longer need it. For the procedure,
refer to
[Download and Trust the Platform CA Certificate](../how-to-guides/use-cursor.md#download-and-trust-the-platform-ca-certificate).

## Model Name and Aliases

The console's **Cursor** tab says to enable a GPT model such as `gpt-5.6`, which the appliance's Tier map resolves to
the model it serves.

Cursor decides where to route a request by the model name. If the name matches a model in Cursor's built-in catalog,
Cursor routes the request to its own backend and the appliance receives nothing. When that happens, ask an operator to
map an alias name that does not appear in Cursor's catalog, and enable that name in Cursor instead. Both the aliases and
the ids of the models the appliance serves appear in the console model list and in the appliance's `/v1/models` API
response.

{/* NEEDS REVIEW: confirm with an SME whether `gpt-5.6` collides with Cursor's built-in catalog. If it does, the console's Cursor tab copy needs to change and this page should lead with a unique alias name. */}

## Supported Modes

| **Cursor mode** | **Supported** | **Notes**                                                    |
| --------------- | ------------- | ------------------------------------------------------------ |
| Ask (chat)      | Yes           | Routes to the appliance through the model name.              |
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
