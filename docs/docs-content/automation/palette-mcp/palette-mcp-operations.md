---
sidebar_label: "Palette MCP Server Operations"
title: "Palette MCP Server Operations"
description: "Learn how to use the operatiosn of Palette MCP server."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai", "mcp", "automation"]
---

The Palette MCP server contains four tools that you can leverage for your Palette operations.

- `gather_or_delete_clusterprofiles` fetches information about or deletes
  [cluster profiles](../../profiles/profiles.md).
- `gather_or_delete_clusters` fetches information about or deletes [clusters](../../clusters/clusters.md).
- `getKubeconfig` downloads cluster [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) files.
- `manage_resource_tags` manages resource tags for cluster profiles, clusters,
  [Edge hosts](../../clusters/edge/edge.md), [cluster templates](../../cluster-templates/cluster-templates.md), and
  [cluster templates policies](../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md).

This guide demonstrates examples of how to use the MCP server capabilities.

## Prerequisites

- Ensure the following software is installed locally on your workstation.

  - The Palette MCP server configured and set up. Refer to the [Setup](./setup/setup.md) section for further guidance.

  - A container runtime, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../user-management/authentication/api-key/create-api-key.md)
  guide to learn how to create a Palette API key. guide for further instructions.

## List Clusters and Cluster Profiles

1. Open your MCP tool.

2. Send a query asking information about Palette cluster profiles. For example, you can ask "Which Palette cluster
   profiles can be used with AWS?" to learn which cluster profiles can be used to deploy
   [AWS clusters](../../clusters/public-cloud/aws/aws.md).

   ```shell title="Example Output"

   ```

## Delete Clusters and Cluster Profiles

## Download Kubeconfig Files

- Kubeconfig mapping

## Manage Resource Tags
