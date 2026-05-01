---
sidebar_label: "Set Up MCP Server with Claude Code"
title: "Set Up MCP Server with Claude Code"
description: "Learn how to setup the Palette MCP server with Claude Code."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

:::preview

:::

This guide covers how to set up the [Palette MCP server](https://github.com/spectrocloud/palette-mcp-server) with
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

4. Execute the following command to add the Palette MCP server to Claude Code, replacing the placeholders with your
   values. Ensure that you provide full filepaths for the `kubeconfig` folder and `.env.mcp` file, if you have
   configured one.

   If you want to use Podman, replace the command `docker` with `podman`.

   <Tabs groupId="mcp-setup">

   <TabItem label=".env.mcp File" value="env_file">

   claude mcp add --transport stdio palette -- \
    docker run --rm -i --pull always \
    --mount type=bind,source=/<local-path>/kubeconfig,target=/tmp/kubeconfig \
    --env-file /<local-path>/.palette/.env-mcp \
    public.ecr.aws/palette-ai/palette-mcp-server:latest

   ````

   </TabItem>

   <TabItem label="Podman with env.mcp file" value="podman_env_file">

   ```shell
   claude mcp add --transport stdio palette -- \

   <TabItem label="Environment Variables" value="env_vars">

   Replace the environment variable values in the snippet below with your own values.

   ```shell {4,5,6}
   claude mcp add --transport stdio palette -- \
       docker run --rm -i --pull always \
       --mount type=bind,source=/<local-path>/kubeconfig,target=/tmp/kubeconfig \
       -e SPECTROCLOUD_HOST=<palette-api-endpoint> \
       -e SPECTROCLOUD_APIKEY=<palette-api-key> \
       -e SPECTROCLOUD_DEFAULT_PROJECT_ID=<palette-project-id> \
       -e ALLOW_DANGEROUS_ACTIONS=0 \
       public.ecr.aws/palette-ai/palette-mcp-server:latest
   ````

   </TabItem>

   </Tabs>

   :::warning

   The `kubeconfig` folder you mount to the container is wiped whenever the container restarts. The Palette MCP server
   automatically removes the kubeconfig files from the `/tmp/kubeconfig` folder when the container stops.

   :::

   ```shell hideClipboard title="Example Output"
   Added stdio MCP server palette with command: docker run --rm -i --pull always --mount type=bind,source=/Users/test-user/.palette/kubeconfig,target=/tmp/kubeconfig --env-file /Users/test-user/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest to local config
   ```

5. Execute the following to command to ensure that the MCP server was set up successfully.

   ```shell
   claude mcp list
   ```

   ```shell hideClipboard title="Example Output"
   palette: docker run --rm -i --pull always --mount type=bind,source=/Users/test-user/kubeconfig,target=/tmp/kubeconfig
   --env-file /Users/test-user/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest - ✓ Connected
   ```

6. Start Claude Code. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

   ```shell hideClipboard title="Example Output"
   Welcome to Claude Code

   ›
   ```

7. We recommend adding an [Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) to
   enable Claude to use the downloaded kubeconfig files to access clusters.

   Execute the following command to create the `CLAUDE.md` file on your machine if it does not exist.

   ```shell
   touch ~/.claude/CLAUDE.md
   ```

   Open the file in your preferred editor and paste the following snippet into it. Replace the `<local-path>`
   placeholder with the kubeconfig local path you configured in **Step 4**.

   <PartialsComponent category="palette-mcp" name="example-skill" />

You can now use the Palette MCP server with Claude Code.

## Validation

1. Start Claude Code in a terminal. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

   ```shell hideClipboard title="Example Output"
   Welcome to Claude Code

   ›
   ```

2. Send a query about your Palette environment to check if your MCP server is connected to Palette.

   For example, you can ask "How many clusters do I have in Palette?" to learn more about your Palette clusters.

   ```shell title="Example Output"
   ⏺ palette - gather_or_delete_clusters (MCP)(action: "list", active_only: true)

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
