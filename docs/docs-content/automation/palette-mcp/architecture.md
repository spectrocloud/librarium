---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture of the Palette MCP."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

:::preview

:::

The [Palette MCP server](https://github.com/spectrocloud/palette-mcp-server) is local-first Model Context Protocol (MCP)
server hosted in a container that is deployed on your machine or environment. The container communicates with the
configured Palette instance and performs the required API operations.

The following list provides an overview of how to configure and use the Palette MCP server:

1. Install an MCP client on your local machine or environment. Popular clients are
   [Cursor](https://cursor.com/get-started), [Claude Code](https://code.claude.com/docs/en/overview), and
   [Gemini CLI](https://geminicli.com/).

2. The Palette MCP server expects a handful parameters in order to connect to Palette. Refer to
   [Server Configuration](#server-configuration) for more information.

3. Configure the Palette MCP server as a custom MCP server in your MCP client to use the tools it provides. The Palette
   MCP server starts up a local container from an image hosted in
   [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/).

4. The MCP server is now ready to use. Your queries are sent to the Palette API to perform the requested operations.

![Palette MCP server architecture](/palette-mcp_architecture_overview.webp)

## Server Configuration

The Palette MCP server provides the following configuration parameters.

| **Parameter**                     | **Description**                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `SPECTROCLOUD_DEFAULT_PROJECT_ID` | [Project ID](../../tenant-settings/projects/projects.md#project-id) for all server operations.                                                 |
| `SPECTROCLOUD_APIKEY`             | [Palette API key](../../user-management/authentication/api-key/api-key.md) used for authentication.                                            |
| `SPECTROCLOUD_HOST`               | API endpoint for your Palette installation. For example: `api.spectrocloud.com`.                                                               |
| `ALLOW_DANGEROUS_ACTIONS`         | Controls whether the MCP server is allowed to perform dangerous actions, such as resource deletion. Disabled by default. Set to `1` to enable. |

## Security

The Palette MCP server is deployed as a container image that is hosted in your compute environment. Any credentials or
secrets you provide to the Palette MCP server are stored in the container at runtime and in the configuration file that
initializes the container.

The Palette MCP server uses a Palette API key to authenticate with the Palette API. This means that the MCP server has
the same permissions as the API key used to authenticate with the Palette API. Actions performed by the MCP server can
be audited through the [Palette audit logs](../../audit-logs/audit-logs.md). When reviewing the audit logs, search for
the user that is associated with the API key used by the Palette MCP server.

An important note to keep in mind about accessing kubeconfig files. If the user's API key has permissions to retrieve
the [admin kubeconfig file](../../clusters/cluster-management/kubeconfig.md#admin-kubeconfig) for a cluster, then the
MCP server will be able to retrieve the admin kubeconfig file for the cluster.

:::tip

You can control whether a user can access the Kubeconfig files for a cluster by assigning the appropriate
[Palette role](../../user-management/palette-rbac/project-scope-roles-permissions.md) to the user. For example, avoid
assigning the cluster admin role to the user. Refer to the
[Kubeconfig Access Permissions](../../clusters/cluster-management/kubeconfig.md#kubeconfig-access-permissions) section
to learn more about how to control access to the kubeconfig files for a cluster.

:::

The Palette MCP server uses the transport protocol `stdio` to communicate with the configured MCP client. This means
that the MCP server is not communicating over the network but, rather sending direct JSON-RPC messages to the MCP client
in the local compute environment. Communication between the Palette MCP server and the Palette API is encrypted using
TLS. We recommend reviewing the MCP protocol's documentation on
[transport mechanisms](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) to learn more about
the security of the transport protocol.

### Prompt Injection

The Palette MCP server is controlled by the prompts provided to the Large Language Model (LLM) that is used by the
configured MCP client. We recommend you use an LLM model that your organization has approved for use in your
environment. Dangerous actions, such as deletion, are controlled by the `ALLOW_DANGEROUS_ACTIONS` parameter. However, if
you have configured the MCP server to allow dangerous actions, you should be aware of the risks associated with prompt
injection. Take the proper precautions to prevent prompt injection by limiting access to the MCP client and providing
prompts to the LLM.

Prompt injection is a lower-risk attack when your MCP client is a local workstation. Prompt injections are a more
serious concern when an LLM service is exposed on behalf of other users who provide prompts to the LLM.

### Best Practices

When using the Palette MCP server, we recommend the following security best practices:

- Use a dedicated API key for the Palette MCP server.
- In a production environment, we recommend using a dedicated user where you manage the role permissions for the Palette
  MCP server.
- Review the `ALLOW_DANGEROUS_ACTIONS` parameter and set it to `1` if you need to perform dangerous actions, such as
  delete. By default, dangerous actions are disabled.
- When configuring the mount path for the kubeconfig files, we recommend using a dedicated folder on your machine for
  this configuration. Avoid using an existing folder that is used for other purposes, including maintaining other
  kubeconfig files.
- Use a `.env` file when configuring the Palette MCP server. You can set the environment variables through the
  `--environment` flag or the `-e` flag but that exposes the secrets to the command line and potentially in logs.
- Rotate the Palette API key for the Palette MCP server regularly. To rotate the API key, you can create a new API key
  and update the `.env-mcp` file with the new API key. If you used inline `-e`, or `--environment` flags, you will need
  to update the API key provided to the flags.
- Use a model you trust or that has enterprise controls related to data protection and privacy.

## Next Steps

Refer to the applicable setup guide for [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
the [Gemini CLI](./setup/mcp-setup-gemini.md).
