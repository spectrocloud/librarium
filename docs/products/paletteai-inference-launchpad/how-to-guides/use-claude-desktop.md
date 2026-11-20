---
sidebar_label: "Use Claude Desktop"
title: "Use PaletteAI Inference Launchpad with Claude Desktop"
description:
  "Connect the Claude Desktop app to a PaletteAI Inference Launchpad appliance through Developer Mode so that a model on
  the appliance answers your conversations."
hide_table_of_contents: false
sidebar_position: 9.2
tags: ["paletteai-inference-launchpad", "claude-desktop", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "claude desktop",
    "developer mode",
    "third-party inference",
    "gateway",
    "keychain",
    "mdm",
    "mobileconfig",
  ]
---

This guide explains how to connect the Claude Desktop app to a PaletteAI Inference Launchpad appliance so that a model
running on the appliance answers your conversations in the **Chat**, **Cowork**, and **Code** tabs. You trust the
appliance certificate in the macOS Keychain, enable Developer Mode, and fill in the **Configure Third-Party Inference**
form. For how this setup differs from Claude Code, refer to
[Claude Code and Claude Desktop](../explanation/claude-apps.md).

:::warning

After you connect Claude Desktop to the appliance, you lose access to the chats, artifacts, and projects in your
Anthropic account. For what else a session on the appliance does not include, refer to
[Claude Code and Claude Desktop](../explanation/claude-apps.md#what-a-session-on-the-appliance-does-not-include).

:::

## Prerequisites

- Claude Desktop installed on macOS. For installation, refer to the
  [Claude Desktop download page](https://claude.ai/download).

- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).

- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.

- The name of a model the appliance serves, such as `glm-5.2`. To find it, refer to
  [Model Aliases](../reference/claude-code-reference.md#model-aliases).

## Trust the Platform CA Certificate

_(Platform-issued certificate only)_ Add the appliance's platform CA certificate to your login keychain.

1. In the console, on the **Overview** page, select **Connect Coding Agent**. The **Connect a coding agent** dialog
   opens.

2. Select the **Claude Code CLI** tab. If the tab shows no **CA certificate** step, the appliance does not need one, so
   skip to [Enable Developer Mode](#enable-developer-mode). Otherwise, select **CA certificate**. The browser saves
   `palette-ai-inference-launchpad-ca.crt` to your `Downloads` folder.

3. In a terminal, add the certificate to your login keychain. If macOS asks you to authenticate, approve the prompt.

   {/* Vale is off for this block because the security command has no long-form flags. */}

   <!-- vale off -->

   ```bash
   security add-trusted-cert -r trustRoot -k ~/Library/Keychains/login.keychain-db $HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   ```

   <!-- vale on -->

   The command prints nothing when it succeeds.

4. Confirm that macOS trusts the appliance.

   ```bash
   curl --output /dev/null --silent --write-out '%{http_code}\n' https://<appliance-host>/v1/models
   ```

   Replace `<appliance-host>` with your appliance address.

   ```bash hideClipboard title="Expected output"
   401
   ```

   If the command reports a certificate error, repeat step 3.

## Enable Developer Mode

1. Open Claude Desktop. If you are signed in, sign out, and stay on the sign-in screen.

2. From the menu bar, select **Help** > **Troubleshooting** > **Enable Developer Mode**.

3. Confirm the prompt. Claude Desktop restarts, and **Enable Developer Mode** no longer appears in the menu.

## Connect Claude Desktop to the Appliance

1. From the menu bar, select **Developer** > **Configure Third-Party Inference**. If the **Developer** menu does not
   list it, select **Help** > **Troubleshooting** > **Configure Third-Party Inference**.

2. Fill in the form with the following values. Leave **Artifact preview iframe origin** and **Custom inference headers**
   blank.

   | **Field**               | **Value**                  |
   | ----------------------- | -------------------------- |
   | **Inference provider**  | **Gateway**                |
   | **Credential kind**     | **Static API key**         |
   | **Gateway base URL**    | `https://<appliance-host>` |
   | **Gateway API key**     | Your `lpai_` token         |
   | **Gateway auth scheme** | **Bearer**                 |
   | **Model discovery**     | Enabled                    |

   Replace `<appliance-host>` with your appliance address.

3. Under **Models** > **Model list**, enter the name of a model the appliance serves, such as `glm-5.2`. To make a model
   the default, list it first.

4. Select **Save**. Claude Desktop runs a connection test that checks model discovery and sends a sample request.

5. Quit Claude Desktop with **CMD + Q**, and then open it again.

## Verify the Connection

1. In Claude Desktop, start a new conversation and send a test prompt.

   ```text
   reply with exactly DESKTOP_OK and nothing else
   ```

2. Confirm that Claude Desktop displays the reply `DESKTOP_OK`.

## Roll Out the Configuration to a Team

1. In the **Configure Third-Party Inference** window, select **Export**. Claude Desktop creates a `.mobileconfig` file
   on macOS or a `.reg` file on Windows that holds these settings.

2. Distribute the file through your Mobile Device Management (MDM) tool. Each person needs their own API token. To
   create one, refer to [Generate an API Token](./generate-an-api-token.md).

## Next Steps

To connect Claude Code instead, refer to [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md). To
understand how the appliance picks a model for each request, refer to
[Routing Behavior](../explanation/routing-behavior.md).
