---
sidebar_label: "Setup the Palette MCP Server with Cursor"
title: "Setup the Palette MCP Server with Cursor"
description: "Learn how to setup the Palette MCP server with Cursor."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

## Prerequisites

- Ensure the following software is installed locally on your workstation.

  - Kind. Use the [Kind Installation](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) guide to install
    Kind.
  - git. Use the [git Installation](https://git-scm.com/downloads) guide to install git.
  - A container runtime, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - Cursor. Refer to the [Download](https://cursor.com/get-started) page for further information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide to learn how to create a Palette API key. guide for further instructions.

- Internet access to clone the Palette tutorial repository and interact with OpenAI API.

## Setup

1. Open a terminal session on your local machine.

2. Issue the following command to create th `.env-mcp` file in your home directory under the `.palette` folder. This
   file is used to save the secrets you need to configure the Palette MCP server.

   ```shell
   mkdir -p ~/.palette
   touch ~/.palette/.env-mcp
   ```

3. Open the .env-mcp file in your favorite text editor. Fill in the following information in the file, replacing the
   placeholders with your values. Refer to the [Project ID](../../../tenant-settings/projects/projects.md#project-id)
   section for further information on project ID retrieval.

   ```shell
   SPECTROCLOUD_DEFAULT_PROJECT_ID=<palette-project-id>
   SPECTROCLOUD_APIKEY=<palette-api-key>
   SPECTROCLOUD_HOST=<palette-api-endpoint>
   ALLOW_DANGEROUS_ACTIONS=0
   AUTO_GENERATE_MCP_TOOLS=0
   ```

4. Issue the following command to create a folder to store
   [kubeconfig](../../../clusters/cluster-management/kubeconfig.md) files. This is an optional, but recommended step, as
   it improves the user experience when retrieving Kubeconfig files. You can use any folder on your machine for this
   configuration.

   ```shell
   mkdir -p /home/<user-name>/kubeconfig
   ```

5. Open Cursor on your local machine. Navigate to **Settings** > **Cursor Settings** > **Tools & MCP**.

6. Select **Add Custom MCP**. The **mcp.json** file opens.

7. Paste the following snippet in the file, replacing the placeholders with your values. Ensure that you provide full
   filepaths for the kubeconfig and .env.mcp folders.

   If you want to use Podman, replace the command with `"podman"`.

   ```json {3,11,13}
   "mcpServers": {
       "palette": {
       "command": "docker",
       "args": [
           "run",
           "--rm",
           "-i",
           "--pull",
           "always",
           "--mount",
           "type=bind,source=/<file-path>/kubeconfig,target=/tmp/kubeconfig",
           "--env-file",
           "/<file-path>/.env-mcp",
           "public.ecr.aws/palette-ai/palette-mcp-server:latest"
       ]
       }
   }

   ```

8. Save the **mcp.json** file and close it.

9. Navigate to **Settings** > **Cursor Settings** > **Tools & MCP**. Ensure that the **palette** MCP server is set up
   enabled and displays a green icon.

   ![Palette MCP setup success cursor](/mcp-setup-cursor_palette-mcp-success.webp)

You can now use the Palette MCP server with your Cursor installation.

## Validation

1. Open Cursor on your local machine.

2. Start Cursor Chat sidebar using the shortcut `CMD + L` or `CTRL + L`. Send any query about your Palette environment
   to test out that your MCP server is successfully connected to Palette.

   For example, you can ask "Can you help me identify how many active clusters I have in Palette?" to learn more about
   your Palette clusters.

   ![Palette MCP query clusters](/mcp-setup-cursor_mcp_clusters_running.webp)
