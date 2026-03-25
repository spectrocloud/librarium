---
sidebar_label: "Palette MCP Server Operations"
title: "Palette MCP Server Operations"
description: "Learn how to use the operations of the Palette MCP server."
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

  - The Palette MCP server configured and set up. Refer to the [Setup the Palette MCP Server](./setup/setup.md) section
    for further guidance.

  - A container runtime, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../user-management/authentication/api-key/create-api-key.md)
  guide to learn how to create a Palette API key. guide for further instructions.

## List Clusters and Cluster Profiles

The `gather_or_delete_clusterprofiles` lists cluster profiles. The `gather_or_delete_clusters` lists clusters.

1. Open your MCP tool.

2. Send a query asking information about Palette cluster profiles. For example, you can ask "Which Palette cluster
   profiles have the `env:prod` tag?" to learn which cluster profiles have been created with a particular
   [cluster profile tag](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md).

   ```shell hideClipboard title="Example Output"
   From the current Palette MCP cluster profile list (41 profiles returned, next_continue_token is null, so this looks like the full set for the project right now), these cluster profiles include the env:prod tag:

   | Name        | Version | UID                      | Other tags      |
   | aws-profile | 1.2.0   | 69a87f1e87b2e7f87c200c48 | owner:test-user |
   | aws-profile | 1.1.0   | 6985df9dc7fdcb36fea974df | owner:test-user |
   | aws-profile | 1.0.0   | 671a4f3b218f768c3afe710  | owner:test-user |

   Total: 3 profile versions (3 UIDs) with env:prod.
   ```

3. Send a query asking information about Palette clusters. For example, you can ask "Which Palette clusters are deployed
   to AWS?" to list your [AWS clusters](../../clusters/public-cloud/aws/aws.md).

   ```shell hideClipboard title="Example Output"
   From the Palette cluster list (non-compact, full spec), cloudType: "aws" is what marks a cluster as deployed on AWS.

   Clusters on AWS

   | Name             | UID                      | Region    | State   | Notes                      |
   | aws-cluster-test | 69b959018db5c767205d0432 | us-east-1 | Running | `cloudConfigRef.kind: aws` |
   | prod-cluster-aws | 69bd46f44e92b3a3b45aa01d | us-east-2 | Running | `cloudConfigRef.kind: aws` |
   | dev-cluster-aws  | 69bd928584cffd9876481048 | us-east-2 | Running | `cloudConfigRef.kind: aws` |

   Not AWS (same project, same list)

   | Name         | cloudType |
   | vsphere-test | vsphere   |
   | maas-test    | maas      |

   So three Palette clusters in this project are deployed to AWS; the rest are vSphere or MAAS.
   ```

## Download Kubeconfig Files

The `getKubeconfig` tool downloads kubeconfig files.

1. Open your MCP tool.

2. Send a query asking to download the [kubeconfig](../../clusters/cluster-management/kubeconfig.md) file for one of
   your running clusters. For example, you can ask "Please download the kubeconfig file for the `<cluster-name>` Palette
   cluster and save it to the `/<local-path>/kubeconfig` folder."

   Replace the placeholders with your cluster name and path to the kubeconfig folder you configured in the
   [Setup the Palette MCP Server](./setup/setup.md) section.

   ```shell hideClipboard title="Example Output"
   Here’s what was done:

   Saved file
   Path: /<local-path>/kubeconfig/<cluster-name>.kubeconfig
   Permissions: 600 (rw-------)
   The directory /<local-path>/kubeconfig was created if it didn’t exist.

   Use it
   export KUBECONFIG=/<local-path>/kubeconfig/<cluster-name>.kubeconfig
   kubectl get nodes
   ```

3. Instruct the MCP tool to connect to the cluster and list the nodes. For example, you can ask "Run kubectl and list
   the nodes of the `<cluster-name>` Palette cluster."

   Replace the placeholder with your cluster name.

   :::info

   Kubectl will only function correctly if you have added an Agent skill to your MCP tool that instructs it to use the
   local kubeconfig file to connect to the cluster. Refer to the guides in the
   [Setup the Palette MCP Server](./setup/setup.md) section to learn how to configure an agent skill for your MCP tool.

   :::

   ```shell hideClipboard title="Example Output"
   Refreshed kubeconfig for aws-cluster-test via Palette MCP and ran:
    kubectl --kubeconfig="/<local-path/69b959018db5c767205d0432.kubeconfig" get nodes
    (with NO_PROXY including *.amazonaws.com so the request didn’t go through the local HTTP proxy).

   Nodes:

   | NAME                       | STATUS | ROLES         | AGE   | VERSION  |
   | ip-10-0-1-158.ec2.internal | Ready  | control-plane | 7d22h | v1.32.13 |
   | ip-10-0-1-248.ec2.internal | Ready  | <none>        | 7d22h | v1.32.13 |
   ```

## Manage Resource Tags

The `manage_resource_tags` tool manages resource tags for cluster profiles, clusters,
[Edge hosts](../../clusters/edge/edge.md), [cluster templates](../../cluster-templates/cluster-templates.md), and
[cluster templates policies](../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md).

1. Open your MCP tool.

2. Send a query related to resource tags. For example, you can ask "Please apply the `cloud:aws` tag to
   `<cluster-name>`." to add a custom tag to your [AWS cluster](../../clusters/public-cloud/aws/aws.md).

   ```shell hideClipboard title="Example Output"
   Here’s what was done:

   Change
   PATCH /v1/spectroclusters/69b959018db5c767205d0432/metadata with merged labels so nothing else was removed.
   cloud:aws is stored as metadata label cloud = aws (normal Palette/Kubernetes style).

   Result
   Response: HTTP 204 (success).

   Verified
   <cluster-name> labels are now:

   {
     "name": "cluster-name",
     "labels": {
       "cloud": "aws",
       "owner": "test-user"
     }
   }
   ```

## Delete Clusters and Cluster Profiles

The `gather_or_delete_clusterprofiles` deletes cluster profiles. The `gather_or_delete_clusters` deletes clusters.

1. Open the `.env-mcp` file you configured during MCP server setup in your favorite text editor. Refer to the
   [Setup the Palette MCP Server](./setup/setup.md) section for further guidance.

   Enable dangerous action to allow the MCP server to delete resources. Save and close the file.

   ```shell
   ALLOW_DANGEROUS_ACTIONS=1
   ```

2. Open your MCP tool.

3. Send a query to delete a Palette cluster profile. For example, you can ask "Delete the `<cluster-profile-name>`
   cluster profile."

   Replace the placeholder with your cluster profile name.

   ```shell hideClipboard title="Example Output"
   Deleted: <cluster-name>
   UID: 666344e38b80e3e7c6159e07 (version 1.0.0 — only that version existed in your default project).
   Request: DELETE /v1/clusterprofiles/666344e38b80e3e7c6159e07
   Response: HTTP 204
   Check: GET the same UID now returns 404 / ResourceNotFound, so the profile is gone from project Default.

   If any cluster or template still referenced this profile, Palette would have blocked delete with a dependency error;204 means the API accepted the removal.
   ```

4. Send a query to delete a Palette cluster. For example, you can ask "Delete the `<cluster-name>` cluster."

   ```shell hideClipboard title="Example Output"
   <cluster-name> was removed with:

   DELETE /v1/spectroclusters/69b959018db5c767205d0432

   HTTP 204 — delete accepted.
   Palette will keep tearing down cloud resources (nodes, load balancers, etc.) in the background. Confirm in the Palette UI that the cluster is gone or in Deleting; if anything sticks, use Palette’s force/cleanup options there.
   ```
