---
sidebar_label: "Setup the Palette MCP Server with Claude Code"
title: "Setup the Palette MCP Server with Claude Code"
description: "Learn how to setup the Palette MCP server with Claude Code."
hide_table_of_contents: false
sidebar_position: 20
tags: ["ai", "mcp", "automation"]
---

This guide covers how to setup the [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) with
[Claude Code](https://code.claude.com/docs/en/overview).

## Prerequisites

- Ensure the following software is installed locally on your workstation.

  - A container runtime, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - Claude Code. Refer to the [Quickstart](https://code.claude.com/docs/en/quickstart) page for further information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide to learn how to create a Palette API key. guide for further instructions.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Start Claude Code in a terminal. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

6. Execute the following command to add the Palette MCP server to Claude Code, replacing the placeholders with your
   values. Ensure that you provide full filepaths for the `kubeconfig` folder and `.env.mcp` file.

   If you want to use Podman, replace the command with `"podman"`.

   ```shell
   claude mcp add --transport stdio palette -- \
       docker run --rm -i --pull always \
       --mount type=bind,source=/<file-path>/kubeconfig,target=/tmp/kubeconfig \
       --env-file /<file-path>/.env-mcp \
       public.ecr.aws/palette-ai/palette-mcp-server:latest
   ```

7. Navigate back to the terminal and execute the following to command to ensure that the MCP server has been set up
   successfully.

   ```shell
   claude mcp list
   ```

   ```shell title="Example Output"
   palette: docker run --rm -i --pull always --mount type=bind,source=/<file-path>kubeconfig,target=/tmp/kubeconfig --env-file /<file-path>/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest - ✓ Connected
   ```

You can now use the Palette MCP server with Claude Code.

## Validation

1. Start the Claude Code in a terminal. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

2. Send any query about your Palette environment to test out that your MCP server is successfully connected to Palette.

   For example, you can ask "Can you help me identify how many active clusters I have in Palette?" to learn more about
   your Palette clusters.

   ```shell title="Example Output"
   ❯ Can you help me identify how many active clusters I have in Palette?

   ⏺ palette - gather_or_delete_clusters (MCP)(action: "list", active_only: true)
   ⎿  {
         "content": [
            {
      … +16 lines (ctrl+o to expand)

   ⏺ You have 1 active cluster in Palette:

   ┌──────────────────┬───────┬─────────┬─────────┬──────────────┐
   │       Name       │ Cloud │  State  │ Health  │   Location   │
   ├──────────────────┼───────┼─────────┼─────────┼──────────────┤
   │ aws-cluster-test │ AWS   │ Running │ Healthy │ Virginia, US │
   └──────────────────┴───────┴─────────┴─────────┴──────────────┘

   It was created on 2026-03-17 and is owned by test-user. It has 2 machine pools (1 control plane node + 1 worker node).
   ```
