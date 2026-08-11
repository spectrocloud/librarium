---
sidebar_label: "Set Up MCP Server with Claude Code"
title: "Set Up MCP Server with Claude Code"
description: "Learn how to setup the Palette MCP server with Claude Code."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

This guide covers how to set up the [Palette MCP server](https://github.com/spectrocloud/palette-agent-toolkit) with
[Claude Code](https://code.claude.com/docs/en/overview). You can install the server through the Palette Agent Toolkit
plugin, which bundles the MCP server configuration and four diagnostic skills in a single install, or configure the
server manually as a container. We recommend the plugin install for most Claude Code users.

## Prerequisites

- Claude Code installed on your workstation. Refer to the
  [Claude Quickstart](https://code.claude.com/docs/en/quickstart) page for more information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

- If you plan to configure the MCP server manually, a container engine, such as
  [Docker](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/docs/installation).

## Set Up with the Palette Agent Toolkit Plugin

The Palette Agent Toolkit plugin bundles the MCP server configuration and four diagnostic skills (`diagnose-cluster`,
`diagnose-edge`, `health-overview`, and `access-review`) in a single install. This is the recommended setup path for
Claude Code and Claude Desktop.

1. Start Claude Code in a terminal. Ensure that you authenticate with Claude by following the prompts.

   ```shell
   claude
   ```

2. Add the Palette Agent Toolkit marketplace.

   ```shell
   /plugin marketplace add spectrocloud/palette-agent-toolkit
   ```

3. Install the Palette plugin from the marketplace.

   ```shell
   /plugin install palette@palette-agent-toolkit
   ```

   The plugin installs the MCP server configuration and the four diagnostic skills.

4. Configure your Palette connection. Open the plugin menu, select the **palette** plugin, and choose **Configure
   options**.

   ```shell
   /plugin
   ```

   Set the following options.

   | Option                  | Notes                                                                                    |
   | ----------------------- | ---------------------------------------------------------------------------------------- |
   | **Palette host**        | Required. Your tenant URL, for example `example.spectrocloud.com`.                       |
   | **Palette API key**     | Required unless you use an auth token. Create one under **User Menu** > **My API Keys**. |
   | **Palette auth token**  | JWT alternative to an API key. Provide an API key **or** an auth token, not both.        |
   | **Default project UID** | Optional. Scopes all calls to one project; omit for tenant-wide access.                  |
   | **Custom CA file path** | Optional. Path to a CA bundle for a self-hosted Palette behind a private CA.             |

   You must set the **Palette host** and either the **Palette API key** or the **Palette auth token**. Claude Code
   stores the API key and auth token in your operating system credential store, such as the macOS Keychain, Windows
   Credential Manager, or Linux Secret Service. Where no credential store is available, Claude Code falls back to
   `~/.claude/.credentials.json` with `0600` permissions. You don't need to export shell variables or create a `.env`
   file.

   To provision the plugin without prompts, such as in a CI pipeline, pass the options as repeatable `--config` flags at
   install time instead. Replace the placeholders with your own values.

   ```shell
   claude plugin install palette@palette-agent-toolkit \
     --config host=<palette-api-endpoint> --config api_key=<palette-api-key>
   ```

5. Verify the plugin is active and the MCP server is connected.

   ```shell
   claude mcp list
   ```

You can now use the Palette MCP server with Claude Code.

## Set Up Manually

Use this path if you prefer to configure the container image directly instead of installing the plugin.

<PartialsComponent category="palette-mcp" name="folder-setup" />

4. Execute the following command to add the Palette MCP server to Claude Code, replacing the placeholders with your
   values. Ensure that you provide full filepaths for the `kubeconfig` folder and `.env.mcp` file, if you have
   configured one.

   If you want to use Podman, replace the command `docker` with `podman`.

   <Tabs groupId="mcp-setup">

   <TabItem label=".env.mcp File" value="env_file">

   ```shell {2}
   claude mcp add --transport stdio palette -- \
    docker run --rm -i --pull always \
    --mount type=bind,source=/<local-path>/kubeconfig,target=/tmp/kubeconfig \
    --env-file /<local-path>/.palette/.env-mcp \
    public.ecr.aws/palette-ai/palette-mcp-server:latest
   ```

   </TabItem>

   <TabItem label="Environment Variables" value="env_vars">

   Replace the environment variable values in the snippet below with your own values.

   ```shell {2,4,5,6}
   claude mcp add --transport stdio palette -- \
       docker run --rm -i --pull always \
       --mount type=bind,source=/<local-path>/kubeconfig,target=/tmp/kubeconfig \
       -e PALETTE_HOST=<palette-api-endpoint> \
       -e PALETTE_API_KEY=<palette-api-key> \
       -e PALETTE_PROJECT_UID=<palette-project-id> \
       public.ecr.aws/palette-ai/palette-mcp-server:latest
   ```

   </TabItem>

   </Tabs>

   :::info

   To enable write tools, such as create, update, and delete, append `--allow-write` after the image name. By default,
   the server starts in read-only mode.

   :::

   :::warning

   The `kubeconfig` folder you mount to the container is wiped whenever the container restarts. The Palette MCP server
   automatically removes the kubeconfig files from the `/tmp/kubeconfig` folder when the container stops.

   :::

   ```shell hideClipboard title="Example Output"
   Added stdio MCP server palette with command: docker run --rm -i --pull always --mount type=bind,source=/Users/test-user/.palette/kubeconfig,target=/tmp/kubeconfig --env-file /Users/test-user/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest to local config
   ```

5. Issue the following command to ensure that the MCP server was set up successfully.

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
   enable Claude to use kubeconfig files retrieved with `read_cluster_kubeconfig` to access clusters.

   Issue the following command to create the `CLAUDE.md` file on your machine if it does not exist.

   ```shell
   touch ~/.claude/CLAUDE.md
   ```

   Open the file in your preferred editor and paste the following snippet into it. Replace the `<local-path>`
   placeholder with a directory where you want to store kubeconfig files.

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
   ⏺ palette - read_clusters (MCP)(filters: { states: ["Running"] })

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
