---
sidebar_label: "Set Up MCP Server with Cursor"
title: "Set Up MCP Server with Cursor"
description: "Learn how to setup the Palette MCP server with Cursor."
hide_table_of_contents: false
sidebar_position: 20
tags: ["ai", "mcp", "automation"]
---

:::preview

:::

This guide covers how to setup the [Palette MCP server](https://github.com/spectrocloud/palette-mcp-server) with
[Cursor](https://cursor.com/get-started).

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - Cursor. Refer to the [Cursor Download](https://cursor.com/get-started) page for more information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Open Cursor on your local machine. Navigate to **Settings** > **Cursor Settings** > **Tools & MCP**.

6. Select **Add Custom MCP**. The `mcp.json` file opens.

7. <PartialsComponent category="palette-mcp" name="server-snippet" />

8. Save the `mcp.json` file and close it.

9. Navigate to **Settings** > **Cursor Settings** > **Tools & MCP**. Ensure that the **palette** MCP server is set up
   and enabled.

   ![Palette MCP setup success cursor](/mcp-setup-cursor_palette-mcp-success.webp)

10. We recommend adding an [Agent Skill](https://cursor.com/docs/skills) to enable Cursor to use the downloaded
    kubeconfig files to access clusters.

    Execute the following command to create a new file for your Palette skill.

    ```shell
    touch ~/.cursor/skills/palette-mcp-guidance.md
    ```

    Open the file in your preferred editor and paste the following snippet into it. Replace the `<local-path>`
    placeholder with the kubeconfig local path you configured in **Step 4**.

    <PartialsComponent category="palette-mcp" name="example-skill" />

You can now use the Palette MCP server with Cursor.

## Validation

1. Open Cursor on your local machine.

2. Open the Cursor Chat sidebar using the shortcut **CMD + L** or **CTRL + L**. Send a query about your Palette
   environment to check if your MCP server is connected to Palette.

   For example, you can ask "How many clusters do I have in Palette?" to learn more about your Palette clusters.

   ```shell hideClipboard title="Example Output"
   ❯ How many clusters do I have in Palette?

   From your Palette account (via the Palette MCP gather_or_delete_clusters list call, limit 500, all clusters), you currently have 1 cluster.

   | Name             | State   |
   | aws-cluster-test | Running |

   There was no next_continue_token, so this is the full list for the queried scope (default project/context your MCP uses).
   ```

## Next Steps

Refer to the [Palette MCP Server Operations](../palette-mcp-operations.md) page for further examples on how to leverage
the functionality of the MCP server.
