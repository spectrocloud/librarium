---
sidebar_label: "Set Up MCP Server with Antigravity"
title: "Set Up MCP Server with Antigravity"
description: "Learn how to setup the Palette MCP server with Antigravity."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai", "mcp", "automation"]
---

This guide covers how to setup the [Palette MCP server](https://github.com/spectrocloud/palette-agent-toolkit) with
[Antigravity](https://antigravity.google/).

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - The Antigravity CLI installed and authenticated. Refer to
    [Install the Antigravity CLI](https://antigravity.google/docs/cli/install) for more information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Start the Antigravity CLI in a terminal. Ensure that you trust the folder that the `.env-mcp` file is located in and
   authenticate with the Antigravity CLI by following the prompts.

   ```shell
   agy
   ```

   ```shell hideClipboard title="Example Output"
   Antigravity CLI

   Type your prompt or press Ctrl+C to exit.
   >
   ```

6. Open the `~/.antigravity/settings.json` file in your preferred text editor. If the file does not exist, create it.

7. <PartialsComponent category="palette-mcp" name="server-snippet" />

8. Save the `settings.json` file and close it.

9. Return to the Antigravity CLI and type the `/mcp` slash command to open the MCP Manager overlay and confirm that the
   `palette` MCP server is listed and connected.

   ```shell
   /mcp
   ```

   ```shell hideClipboard title="Example Output"
   Configured MCP servers:

   ✓ palette: docker run --rm -i --pull always --mount type=bind,source=/Users/test-user/.palette/kubeconfig,target=/tmp/kubeconfig --env-file /Users/test-user/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest (stdio) - Connected
   ```

10. Install the four Palette diagnostic skills (`diagnose-cluster`, `diagnose-edge`, `health-overview`, and
    `access-review`) from the Palette Agent Toolkit repository.

    ```shell
    npx skills add github.com/spectrocloud/palette-agent-toolkit/skills
    ```

11. (Optional) We recommend adding an Agent Skill to enable Antigravity to use kubeconfig files retrieved with
    `read_cluster_kubeconfig` to access clusters, if you plan to use the files in ad-hoc `kubectl` workflows.

    Issue the following command to create the `ANTIGRAVITY.md` file on your machine if it does not exist.

    ```shell
    touch ~/.antigravity/ANTIGRAVITY.md
    ```

    Open the file in your preferred text editor and paste the following snippet into the file. Replace the
    `<local-path>` placeholder with a directory where you want to store kubeconfig files.

    <PartialsComponent category="palette-mcp" name="example-skill" />

You can now use the Palette MCP server with Antigravity.

## Validation

1. Start the Antigravity CLI in a terminal. Ensure that you trust the folder that the `.env-mcp` file is located in and
   authenticate with the Antigravity CLI by following the prompts.

   ```shell
   agy
   ```

   ```shell hideClipboard title="Example Output"
   Antigravity CLI

   Type your prompt or press Ctrl+C to exit.
   >
   ```

2. Send a query about your Palette environment to check if your MCP server is connected to Palette.

   For example, you can ask "How many clusters do I have in Palette?" to learn more about your Palette clusters.

   ```shell hideClipboard title="Example Output"
   ✦ I will list the active clusters in Palette to determine how many you have.
   read_clusters (palette MCP Server) {"filters":{"states":["Running"]}}

   ✦ You have 1 active cluster in Palette: aws-cluster-test.
   ```

:::info

To enable write tools, such as create, update, and delete, append `"--allow-write"` to the `args` array in
`settings.json` after the image name. By default, the server starts in read-only mode.

:::

## Next Steps

Refer to the [Palette MCP Server Operations](../palette-mcp-operations.md) page for further examples on how to leverage
the functionality of the MCP server.
