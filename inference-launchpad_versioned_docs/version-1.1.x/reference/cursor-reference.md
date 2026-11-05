---
sidebar_label: "Cursor Configuration"
title: "PaletteAI Inference Launchpad Cursor Configuration"
description:
  "Reference for the settings and values used to connect the Cursor code editor to a PaletteAI Inference Launchpad
  appliance."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "cursor", "reference"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "base url", "ask mode", "api token"]
---

This page lists the configuration values Cursor uses to connect to a PaletteAI Inference Launchpad appliance. The
**Cursor** tab of the console's **Connect a coding agent** panel lists these values. For the steps to set them, refer to
[Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md).

## Settings

Set the following in Cursor under **Settings** > **Models**.

| **Setting**                  | **Description**                                                                                                                                    | **Example value**                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **OpenAI API Key**           | The API token generated in the console. It begins with `lpai_`.                                                                                    | `lpai_YOUR_TOKEN`                      |
| **Override OpenAI Base URL** | The PaletteAI Inference Launchpad inference endpoint. Use the appliance address with the `/v1` path appended.                                      | `https://amd.spectrocloud.com:8443/v1` |
| Model list                   | The model Cursor requests. Enable a GPT model, and then select it in chat.                                                                         | `gpt-5.6`                              |
| **Add model**                | The control that adds a model name Cursor does not already list, such as a uniquely named alias an operator created on a client's **Routing** tab. | `launchpad-glm52`                      |

## Endpoint URL

Cursor uses the OpenAI-compatible API, which the gateway serves at `/v1`. Set **Override OpenAI Base URL** to your
appliance's address, the same host you use to reach the console, with `/v1` appended. This differs from Claude Code,
which uses the Anthropic Messages API and adds the path itself.

<!-- vale off -->

## Network Reachability

<!-- vale on -->

Cursor sends every model request from its own cloud servers rather than from your machine. Two consequences follow, and
both are limits of Cursor's bring-your-own-key support rather than of the appliance.

- An appliance that only resolves inside a private network never receives the request. No client-side setting changes
  this. For the connectivity options Cursor offers, refer to Cursor's
  [Private Connectivity](https://cursor.com/docs/enterprise/private-connectivity) documentation.
- An appliance that presents only a platform-issued certificate is not trusted by Cursor's cloud. Importing the platform
  CA into your operating system trust store lets Cursor on your machine trust the appliance, but it does not change what
  Cursor's cloud trusts.

## Platform CA Certificate

When the appliance serves HTTPS with a certificate issued by its own platform Certificate Authority (CA), the connect
panel adds a **CA certificate** step and an instruction to import that certificate into your operating system trust
store. Cursor is a graphical application, so it reads the operating system trust store rather than a shell variable, and
it picks up the certificate only after a restart. The browser saves the file as `palette-ai-inference-launchpad-ca.crt`
in your `Downloads` folder.

The import enables Cursor on your machine to trust the appliance, so Cursor's own client-side validation of the base URL
and the API key succeeds. It does not enable the model request itself. Cursor's cloud servers send that request, and
they never consult your machine's trust store.

## Model Name

The appliance seeds a `gpt-` alias prefix in every tier map, so the GPT model the panel names reaches the appliance. The
seeded prefix resolves for a client that inherits the appliance-wide table, and a client with its own Tier map can leave
it unmapped. For the rule, refer to [Routing Behavior](../explanation/routing-behavior.md#the-tier-map).

Cursor decides where to route a request by the model name, so a name that also exists in Cursor's own catalog can route
to Cursor's backend instead. In that case, an operator can add a uniquely named alias on the client's **Routing** tab,
as described in
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md#route-a-client-to-specific-models). Both
the aliases and the ids of the models the appliance serves appear in the console model list and in the appliance's
`/v1/models` API response.

## Supported Modes

| **Cursor mode** | **Supported** | **Notes**                                                    |
| --------------- | ------------- | ------------------------------------------------------------ |
| Ask             | Yes           | Routes to the appliance through the model you enable.        |
| Agent           | No            | Locked to Cursor's own models for bring-your-own-key setups. |
| Edit            | No            | Locked to Cursor's own models for bring-your-own-key setups. |
| Tab             | No            | Locked to Cursor's own models for bring-your-own-key setups. |

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Cursor surfaces the error. For how
quotas apply, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Resources

- [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md)
- [Generate an API Token](../how-to-guides/generate-an-api-token.md)
- [Clients and Quotas](../explanation/clients-and-quotas.md)
- [Routing Behavior](../explanation/routing-behavior.md)
