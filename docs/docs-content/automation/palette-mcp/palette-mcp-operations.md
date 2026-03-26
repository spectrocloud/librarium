---
sidebar_label: "Palette MCP Server Operations"
title: "Palette MCP Server Operations"
description: "Learn how to use the operations of the Palette MCP server."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai", "mcp", "automation"]
---

The Palette MCP server contains the following tools that you can leverage for your Palette operations:

- `gather_or_delete_clusterprofiles` - Fetches information about or deletes
  [cluster profiles](../../profiles/profiles.md).
- `gather_or_delete_clusters` - Fetches information about or deletes [clusters](../../clusters/clusters.md).
- `getKubeconfig` - Downloads cluster [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) files.
- `search_and_manage_resource_tags` - Manages resource tags for cluster profiles, clusters,
  [Edge hosts](../../clusters/edge/edge.md), [cluster templates](../../cluster-templates/cluster-templates.md), and
  [cluster templates policies](../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md).

This guide provides examples of how to use the Palette MCP server.

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - The Palette MCP server configured and set up. Refer to the applicable setup guide for
    [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
    [Gemini](./setup/mcp-setup-gemini.md).

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## List Clusters and Cluster Profiles

The `gather_or_delete_clusterprofiles` tool lists cluster profiles. The `gather_or_delete_clusters` tool lists clusters.

1. Open your MCP client.

2. Send a query asking for information about Palette cluster profiles. For example, you can ask "Which Palette cluster
   profiles have the `env:prod` tag?" to learn which cluster profiles have been created with a particular
   [cluster profile tag](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md).

   ```shell hideClipboard title="Example Output"
   ⏺ palette - gather_or_delete_clusterprofiles (MCP)(action: "list", limit: 25, continue_token: "xxx")

   ⏺ Profiles explicitly tagged with env:aws:

   ┌─────────────────────┬─────────┬────────────────────────────────────────────────────────────────────┐
   │        Name         │ Version │                             Other Tags                             │
   ├─────────────────────┼─────────┼────────────────────────────────────────────────────────────────────┤
   │ aws-profile-test    │ 1.3.0   │ —                                                                  │
   ├─────────────────────┼─────────┼────────────────────────────────────────────────────────────────────┤
   │ aws-profile-test    │ 1.2.0   │ —                                                                  │
   ├─────────────────────┼─────────┼────────────────────────────────────────────────────────────────────┤
   │ aws-profile-test    │ 1.1.0   │ —                                                                  │
   └─────────────────────┴─────────┴────────────────────────────────────────────────────────────────────┘
   ```

3. Send a query asking for information about Palette clusters. For example, you can ask "Which Palette clusters are
   deployed to AWS?" to list your [AWS clusters](../../clusters/public-cloud/aws/aws.md).

   ```shell hideClipboard title="Example Output"
   ⏺ palette - gather_or_delete_clusters (MCP)(action: "list", compact: false)

   ⏺ You have 3 clusters deployed to AWS (cloud_type: aws):
   ┌──────────────────┬─────────┐
   │       Name       │  State  │
   ├──────────────────┼─────────┤
   │ prod-cluster-aws │ Running │
   ├──────────────────┼─────────┤
   │ dev-cluster-aws  │ Running │
   ├──────────────────┼─────────┤
   │ aws-cluster-test │ Running │
   └──────────────────┴─────────┘

   The remaining clusters run on vSphere and MAAS.
   ```

## Download Kubeconfig Files

The `getKubeconfig` tool downloads kubeconfig files.

1. Open your MCP client.

2. Send a query asking to download the [kubeconfig](../../clusters/cluster-management/kubeconfig.md) file for one of
   your running clusters. For example, you can ask "Please download the kubeconfig file for the `<cluster-name>` Palette
   cluster."

   Replace the placeholders with your cluster name and path to the kubeconfig folder you configured in the MCP server
   setup.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - getKubeconfig (MCP)(cluster_uid: "69c401bf35d56c1812c5a00f")
   The kubeconfig for aws-cluster-test has been downloaded. As noted in the project instructions, the file is written inside the MCP container at /tmp/kubeconfig/69c401bf35d56c1812c5a00f.kubeconfig, which is synced to your machine at:

   /Users/test-user/.palette/kubeconfig

   You can use it with:
   kubectl --kubeconfig="$HOME/.palette/kubeconfig" get nodes
   ```

3. Instruct the MCP tool to connect to the cluster and list the nodes. For example, you can say "Run kubectl and list
   the nodes of the `<cluster-name>` Palette cluster."

   Replace the placeholder with your cluster name.

   :::info

   Kubectl will only function correctly if you have added an Agent skill to your MCP tool that instructs it to use the
   local kubeconfig file to connect to the cluster. Refer to the applicable setup guide for
   [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
   [Gemini](./setup/mcp-setup-gemini.md) to learn how to configure an agent skill for your MCP tool.

   :::

   ```shell hideClipboard title="Example Output"
   ⏺ Bash(kubectl --kubeconfig="/Users/test-user/.palette/kubeconfig/69c401bf35d56c1812c5a00f.kubeconfig" get nodes)

   ⏺ The aws-cluster-test cluster has 2 nodes:
   ┌───────────────────────────┬───────────────────────────┬───────────────┬─────┬──────────┐
   │           Name            │          Status           │     Role      │ Age │ Version  │
   ├───────────────────────────┼───────────────────────────┼───────────────┼─────┼──────────┤
   │ ip-10-0-1-11.ec2.internal │ Ready, SchedulingDisabled │ —             │ 22h │ v1.32.13 │
   ├───────────────────────────┼───────────────────────────┼───────────────┼─────┼──────────┤
   │ ip-10-0-1-31.ec2.internal │ Ready                     │ control-plane │ 22h │ v1.32.13 │
   └───────────────────────────┴───────────────────────────┴───────────────┴─────┴──────────┘
   The worker node has SchedulingDisabled (cordoned), meaning no new pods will be scheduled on it.
   ```

## Manage Resource Tags

The `search_and_manage_resource_tags` tool manages resource tags for cluster profiles, clusters,
[Edge hosts](../../clusters/edge/edge.md), [cluster templates](../../cluster-templates/cluster-templates.md), and
[cluster templates policies](../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md).

1. Open your MCP tool.

2. Send a query related to resource tags. For example, you can say "Apply the `cloud:aws` tag to the `<cluster-name>`
   Palette cluster" to add a custom tag to an [AWS cluster](../../clusters/public-cloud/aws/aws.md).

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - search_and_manage_resource_tags (MCP)(action: "create", resource_type: "spectroclusters", uid: "69c401bf35d56c1812c5a00f", tags: ["cloud:aws"])

   ⏺ Done. The cloud:aws tag has been applied to aws-cluster-test. The cluster's tags are now:
    - cloud:aws (new)
    - owner:test-user
   ```

## Delete Clusters and Cluster Profiles

The `gather_or_delete_clusterprofiles` tool deletes cluster profiles. The `gather_or_delete_clusters` tool deletes
clusters.

1. Open the `.env-mcp` file you configured during MCP server setup in your preferred text editor. Refer to the
   applicable setup guide for [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
   [Gemini](./setup/mcp-setup-gemini.md) for more information.

   Enable dangerous actions to allow the MCP server to delete resources. Save and close the file.

   ```shell
   ALLOW_DANGEROUS_ACTIONS=1
   ```

2. Open your MCP tool.

3. Send a query to delete a Palette cluster profile. For example, you can say "Delete the `<cluster-profile-name>`
   Palette cluster profile."

   Replace the placeholder with your cluster profile name.

   ```shell hideClipboard title="Example Output"
   ⏺ The aws-cluster-profile-test profile has uid 698bc897c7fdfaca31d7122f. This is a destructive action — confirming before proceeding: delete cluster profile aws-cluster-profile-test?

   ❯ Yes

   ⏺ palette - gather_or_delete_clusterprofiles (MCP)(action: "delete", uid: "698bc897c7fdfaca31d7122f")

   ⏺ Done. The aws-cluster-profile-test cluster profile has been deleted.
   ```

4. Send a query to delete a Palette cluster. For example, you can say "Delete the `<cluster-name>` Palette cluster."

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ This will delete the running aws-cluster-test cluster (uid: 69c401bf35d56c1812c5a00f). This is irreversible — are you sure?

   ❯ Yes

   ⏺ palette - gather_or_delete_clusters (MCP)(action: "delete", uid: "69c401bf35d56c1812c5a00f")

   ⏺ Done. The aws-cluster-test cluster has been deleted.
   ```
