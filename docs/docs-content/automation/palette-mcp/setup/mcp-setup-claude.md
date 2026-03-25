---
sidebar_label: "Set Up MCP Server with Claude Code"
title: "Set Up MCP Server with Claude Code"
description: "Learn how to setup the Palette MCP server with Claude Code."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

This guide covers how to set up the [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) with
[Claude Code](https://code.claude.com/docs/en/overview).

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - Claude Code. Refer to the [Claude Quickstart](https://code.claude.com/docs/en/quickstart) page for more information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Start Claude Code in a terminal. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

   ```shell hideClipboard title="Example Output"
   Welcome to Claude Code

   › What can I help you with?
   ```

6. Save the file paths for the kubeconfig folder and the `.env-mcp` file into two environment variables. Replace the
   `<local-path>` placeholders with full paths.

   ```shell
   export ENV_MCP_PATH=/<local-path>/.palette/.env-mcp
   export KUBECONFIG_PATH=/<local-path>/kubeconfig
   ```

7. Execute the following command to add the Palette MCP server to Claude Code, replacing the placeholders with your
   values. Ensure that you provide full filepaths for the `kubeconfig` folder and `.env.mcp` file.

   If you want to use Podman, replace the command with `"podman"`.

   <Tabs groupId="mcp-setup">

   <TabItem label="Docker" value="docker">

   ```shell
   claude mcp add --transport stdio palette -- \
       docker run --rm -i --pull always \
       --mount type=bind,source=$KUBECONFIG_PATH,target=/tmp/kubeconfig \
       --env-file $ENV_MCP_PATH \
       public.ecr.aws/palette-ai/palette-mcp-server:latest
   ```

   </TabItem>

   <TabItem label="Podman" value="podman">

   ```shell
   claude mcp add --transport stdio palette -- \
       podman run --rm -i --pull always \
       --mount type=bind,source=$KUBECONFIG_PATH,target=/tmp/kubeconfig \
       --env-file $ENV_MCP_PATH \
       public.ecr.aws/palette-ai/palette-mcp-server:latest
   ```

   </TabItem>

   </Tabs>

8. Execute the following to command to ensure that the MCP server was set up successfully.

   ```shell
   claude mcp list
   ```

   ```shell hideClipboard title="Example Output"
   palette: docker run --rm -i --pull always --mount type=bind,source=/Users/test-user/kubeconfig,target=/tmp/kubeconfig
   --env-file /Users/test-user/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest - ✓ Connected
   ```

9. We recommend adding an [Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) to
   enable Claude to use the downloaded kubeconfig files to access clusters.

   Execute the following command to create the `CLAUDE.md` file in your project if it does not exist. Replace the
   `<local-path>` placeholder with your local path.

   ```shell
   touch <local-path>/CLAUDE.md
   ```

   Open the file in your preferred editor and paste the following snippet into it. Replace the `<local-path>`
   placeholder with the kubeconfig local path you configured in **Step 4**.

   <PartialsComponent category="palette-mcp" name="example-skill" />

You can now use the Palette MCP server with Claude Code.

## Validation

1. Start the Claude Code in a terminal. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

   ```shell hideClipboard title="Example Output"
   Welcome to Claude Code

   › What can I help you with?
   ```

2. Send a query about your Palette environment to check if your MCP server is connected to Palette.

   For example, you can ask "How many clusters do I have in Palette?" to learn more about your Palette clusters.

   ```shell title="Example Output"
   ❯ How many clusters do I have in Palette?

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

## Next Steps

Refer to the [Palette MCP Server Operations](../palette-mcp-operations.md) page for further examples on how to leverage
the functionality of the MCP server.
