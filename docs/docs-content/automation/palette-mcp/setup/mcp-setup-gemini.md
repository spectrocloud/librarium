---
sidebar_label: "Set Up MCP Server with Gemini CLI"
title: "Set Up MCP Server with Gemini CLI"
description: "Learn how to setup the Palette MCP server with Gemini CLI."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai", "mcp", "automation"]
---

This guide covers how to setup the [Palette MCP server](https://github.com/spectrocloud/palette-mcp-server) with the
[Gemini CLI](https://geminicli.com/).

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - The Gemini CLI. Refer to [Get started with Gemini CLI](https://geminicli.com/docs/get-started/) for more information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Start the Gemini CLI in a terminal. Ensure that you trust the folder that the `.env-mcp` file is located in and
   authenticate with the Gemini CLI by following the prompts.

   ```shell
   gemini
   ```

   ```shell hideClipboard title="Example Output"
   Gemini CLI

   Type your prompt or press Ctrl+C to exit.
   >
   ```

6. Open the `~/.gemini/settings.json` file in your preferred text editor.

7. <PartialsComponent category="palette-mcp" name="server-snippet" />

8. Save the `settings.json` file and close it.

9. Return to the terminal and execute the following command to ensure the MCP server is properly set up.

   ```shell
   gemini mcp list
   ```

   ```shell hideClipboard title="Example Output"
   Configured MCP servers:

   ✓ palette: docker run --rm -i --pull always --mount type=bind,source=/Users/test-user/.palette/kubeconfig,target=/tmp/kubeconfig --env-file /Users/test-user/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest (stdio) - Connected
   ```

10. We recommend adding an [Agent Skill](https://geminicli.com/docs/cli/skills/) to enable Gemini to use the downloaded
    kubeconfig files to access clusters.

Execute the following command to create the `GEMINI.md` file on your machine if it does not exist.

    ```shell
    touch ~/.gemini/GEMINI.md
    ```

    Open the file in your preferred text editor and paste the following snippet into the file. Replace the
    `<local-path>` placeholder with the kubeconfig local path you configured in **Step 4**.

    <PartialsComponent category="palette-mcp" name="example-skill" />

You can now use the Palette MCP server with the Gemini CLI.

## Validation

1. Start the Gemini CLI in a terminal. Ensure that you trust the folder that the `.env-mcp` file is located in and
   authenticate with the Gemini CLI by following the prompts.

   ```shell
   gemini
   ```

   ```shell hideClipboard title="Example Output"
   Gemini CLI

   Type your prompt or press Ctrl+C to exit.
   >
   ```

2. Send a query about your Palette environment to check if your MCP server is connected to Palette.

   For example, you can ask "How many clusters do I have in Palette?" to learn more about your Palette clusters.

   ```shell hideClipboard title="Example Output"
   ✦ I will list the active clusters in Palette to determine how many you have.
   gather_or_delete_clusters (palette MCP Server) {"active_only":true,"action":"list"}

   ✦ You have 1 active cluster in Palette: aws-cluster-test.
   ```

## Next Steps

Refer to the [Palette MCP Server Operations](../palette-mcp-operations.md) page for further examples on how to leverage
the functionality of the MCP server.
