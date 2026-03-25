---
sidebar_label: "Setup the MCP Server with Cursor"
title: "Setup the MCP Server with Cursor"
description: "Learn how to setup the Palette MCP server with Cursor."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

This guide covers how to setup the [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) with
[Cursor](https://cursor.com/get-started).

## Prerequisites

- Ensure the following software is installed locally on your workstation.

  - A container runtime, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - Cursor. Refer to the [Download](https://cursor.com/get-started) page for further information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide to learn how to create a Palette API key. guide for further instructions.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Open Cursor on your local machine. Navigate to **Settings** > **Cursor Settings** > **Tools & MCP**.

6. Select **Add Custom MCP**. The `mcp.json` file opens.

7. <PartialsComponent category="palette-mcp" name="server-snippet" />

8. Save the `mcp.json` file and close it.

9. Navigate to **Settings** > **Cursor Settings** > **Tools & MCP**. Ensure that the **palette** MCP server is set up
   enabled and displays a green icon.

   ![Palette MCP setup success cursor](/mcp-setup-cursor_palette-mcp-success.webp)

10. If you configured the path to your kubeconfig file in **Step 4**, we recommend adding an
    [Agent Skill](https://cursor.com/docs/skills) to enable Cursor to use the downloaded kubeconfig files to access
    clusters.

    Execute the following command to create a new file for your Palette skill.

    ```shell
    touch ~/.cursor/skills/palette-mcp-guidance.md
    ```

    Open the file in your preferred editor and paste the following snippet into it. Replace the `<local-path>`
    placeholder with the kubeconfig local path you configured in **Step 4**.

    <PartialsComponent category="palette-mcp" name="example-skill" />

You can now use the Palette MCP server with your Cursor installation.

## Validation

1. Open Cursor on your local machine.

2. Start Cursor Chat sidebar using the shortcut **Cmd + L** or **Ctrl + L**. Send any query about your Palette
   environment to test out that your MCP server is successfully connected to Palette.

   For example, you can ask "Can you help me identify how many active clusters I have in Palette?" to learn more about
   your Palette clusters.

   ![Palette MCP query clusters](/mcp-setup-cursor_mcp_clusters_running.webp)

## Next Steps

Refer to the [Palette MCP Server Operations](../palette-mcp-operations.md) page for further examples on how to leverage
the functionality of the MCP server.
