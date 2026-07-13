---
sidebar_label: "Claude Code Configuration"
title: "Launchpad for AI Claude Code Configuration"
description:
  "Reference for the environment variables and values used to connect Claude Code to a Launchpad for AI appliance."
hide_table_of_contents: false
sidebar_position: 5
tags: ["launchpad-for-ai", "claude-code", "reference"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "environment variables", "api token", "model"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This page lists the configuration values Claude Code uses to connect to a Launchpad for AI appliance. For the steps to
set them, refer to [Use Launchpad for AI with Claude Code](../how-to-guides/use-claude-code.md).

## Environment Variables

| Variable               | Description                                                                                                                                | Example value                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `ANTHROPIC_BASE_URL`   | The Launchpad for AI inference endpoint. Use the appliance address with no path. Claude Code appends `/v1/messages`.                       | `https://amd.spectrocloud.com:8443` |
| `ANTHROPIC_AUTH_TOKEN` | The API token generated in the console. It begins with `lpai_`. `ANTHROPIC_API_KEY` is also accepted.                                      | `lpai_YOUR_TOKEN`                   |
| `ANTHROPIC_MODEL`      | Optional. The Claude alias Claude Code requests. The appliance maps the alias to the model it serves, so you do not pick the backend model. | `claude-sonnet-4-5`                 |

## Endpoint URL

The endpoint is your appliance's address, the same host you use to reach the console, with no path appended. The gateway
serves the Anthropic Messages API at `/v1/messages`, and Claude Code adds that path itself, so `ANTHROPIC_BASE_URL` must
not include `/v1`. If you do not know the address, ask the administrator who set up the appliance.

## Model Name

Claude Code requests a Claude alias (`claude-opus-4-8`, `claude-sonnet-4-5`, or `claude-haiku-4-5`), and the appliance
maps that alias to the model it serves. Set `ANTHROPIC_MODEL` to one of these aliases. You do not select a backend
model directly. Both the aliases the appliance accepts and the ids of the models it serves, such as `glm-5.2`, appear
in the console's model list and in the appliance's `/v1/models` API response.

## Token Quotas

If the token's quota is exhausted, the appliance returns an HTTP `429` response and Claude Code surfaces the error.
{/* TODO: link once the token quotas and metering reference page exists */}

## Resources

- [Use Launchpad for AI with Claude Code](../how-to-guides/use-claude-code.md)
- User and API token management {/* TODO: link once page exists */}
- Token quotas and metering {/* TODO: link once page exists */}
- Intelligent routing and tier maps {/* TODO: link once page exists */}
