---
sidebar_label: "Palette MCP Server Operations"
title: "Palette MCP Server Operations"
description: "Learn how to use the operations of the Palette MCP server."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai", "mcp", "automation"]
---

<PartialsComponent category="palette-mcp" name="mcp-tools" />

This guide provides examples of how to use the Palette MCP server using
[Claude Code](https://code.claude.com/docs/en/overview) and the Claude Sonnet 4.6 model. You can use an MCP client and
model that suits your needs.

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - The Palette MCP server configured and set up. Refer to the applicable setup guide for
    [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or the
    [Gemini CLI](./setup/mcp-setup-gemini.md).

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation), if you use the container image.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## List Clusters and Cluster Profiles

The `read_cluster_profiles` tool lists cluster profiles. The `read_clusters` tool lists clusters.

1. Open your MCP client.

2. Send a query asking for information about your Palette cluster profiles. For example, you can ask "Which Palette
   cluster profiles have the `env:prod` tag?" to learn which cluster profiles have been created with a particular
   [cluster profile tag](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md).

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_cluster_profiles (MCP)(filters: { tags: ["env:prod"] })

   ⏺ Profiles explicitly tagged with env:prod:

   ┌──────────────────────┬─────────┬──────────────────────────────────────────────────────────────────┐
   │        Name          │ Version │                           Other Tags                             │
   ├──────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
   │ cluster-profile-test │ 1.3.0   │ —                                                                │
   ├──────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
   │ cluster-profile-test │ 1.2.0   │ —                                                                │
   ├──────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
   │ cluster-profile-test │ 1.1.0   │ —                                                                │
   └──────────────────────┴─────────┴──────────────────────────────────────────────────────────────────┘
   ```

3. Send a query asking for information about your Palette clusters. For example, you can ask "Which Palette clusters are
   deployed to AWS?" to list your [AWS clusters](../../clusters/public-cloud/aws/aws.md).

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_clusters (MCP)(filters: { cloud_type: "aws" })

   ⏺ You have 3 clusters deployed to AWS (cloud_type: aws):
   ┌───────────────┬─────────┐
   │      Name     │  State  │
   ├───────────────┼─────────┤
   │ prod-cluster  │ Running │
   ├───────────────┼─────────┤
   │ dev-cluster   │ Running │
   ├───────────────┼─────────┤
   │ cluster-test  │ Running │
   └───────────────┴─────────┘

   The remaining clusters run on vSphere and MAAS.
   ```

## Read Cluster Status

The `read_cluster_status` tool returns the state, conditions, and other status details for a single cluster. It is the
recommended polling tool after a `create_cluster` or `delete_cluster` call, because a state-only projection costs a
single API call.

1. Open your MCP client.

2. Send a query asking for the status of a cluster. For example, you can ask "What is the current status of the
   `<cluster-name>` cluster?".

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_cluster_status (MCP)(uid: "650f1a2b3c4d5e6f7a8b9c0d", fields: ["status.state"])

   ⏺ The prod-cluster cluster is currently in the Running state.
   ```

## Read Cluster Observability

The `read_cluster_observability` tool returns compliance-scan, backup, and restore results for a single cluster.

1. Open your MCP client.

2. Send a query asking for observability data for a cluster. For example, you can ask "Show me the latest compliance
   scans and backup status for the `<cluster-name>` cluster."

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_cluster_observability (MCP)(uid: "650f1a2b3c4d5e6f7a8b9c0d", include: ["scans", "backup"])

   ⏺ Compliance scans and backup status for prod-cluster:
   - Latest CIS scan: 2 High, 5 Medium findings
   - Latest backup: succeeded 2 hours ago
   ```

## Retrieve a Cluster kubeconfig

The `read_cluster_kubeconfig` tool retrieves the [kubeconfig](../../clusters/cluster-management/kubeconfig.md) file for
a cluster. The tool supports read-only, admin, and OIDC modes. To learn more about kubeconfig access permissions in
Palette, refer to
[kubeconfig Access Permissions](../../clusters/cluster-management/kubeconfig.md#kubeconfig-access-permissions).

1. Open your MCP client.

2. Send a query asking to retrieve the kubeconfig for a cluster. For example, you can ask "Download the kubeconfig for
   the `<cluster-name>` cluster."

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_cluster_kubeconfig (MCP)(uid: "650f1a2b3c4d5e6f7a8b9c0d")

   ⏺ The kubeconfig for prod-cluster has been retrieved. Save it locally and set the KUBECONFIG environment variable to use it with kubectl.
   ```

## Manage Cluster Tags

The `read_cluster_tags` tool returns the tag set on a cluster. The `update_cluster_tags` tool replaces a cluster's tag
set. Tag management through the MCP server is available for clusters only. Tag management for cluster profiles, cluster
templates, edge hosts, and cluster template policies is not supported.

1. Open your MCP client.

2. Send a query asking to view the tags on a cluster. For example, you can ask "What tags are set on the
   `<cluster-name>` cluster?".

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_cluster_tags (MCP)(uid: "650f1a2b3c4d5e6f7a8b9c0d")

   ⏺ The prod-cluster cluster has the following tags:
   - env:prod
   - owner:platform-team
   ```

3. Send a query asking to update the tags on a cluster. For example, you can ask "Add the `cloud:aws` tag to the
   `<cluster-name>` cluster."

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - update_cluster_tags (MCP)(uid: "650f1a2b3c4d5e6f7a8b9c0d", tags: ["env:prod", "owner:platform-team", "cloud:aws"])

   ⏺ Done. The prod-cluster cluster tags are now:
   - env:prod
   - owner:platform-team
   - cloud:aws (new)
   ```

## Read Component Events

The `read_events` tool returns paginated Kubernetes and controller component events. You can scope the query to one
cluster, one edge host, or a recent tenant-wide feed.

1. Open your MCP client.

2. Send a query asking for events. For example, you can ask "Show me the last 20 error events for the `<cluster-name>`
   cluster."

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_events (MCP)(object_kind: "spectrocluster", object_uid: "650f...", limit: 20, filters: { severity: "Error" })

   ⏺ Latest error events for dev-cluster-1:
   - FailedScheduling — 0/3 nodes available: insufficient memory (2 minutes ago)
   ```

## Manage Projects, Teams, and Users

The `read_projects`, `read_teams`, and `read_users` tools return project, team, and user records. The corresponding
`create_*`, `update_*`, and `delete_*` tools mutate those records when the server runs with `--allow-write`.

1. Open your MCP client.

2. Send a query asking to create a project. For example, you can ask "Create a Palette project named `<project-name>`."

   Replace the placeholder with your cluster name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - create_project (MCP)(name: "dev-project")

   ⏺ Done. The dev-project project has been created with uid 650f1a2b3c4d5e6f7a8b9c0d.
   ```

3. Send a query asking to list team membership. For example, you can ask "List the members of the `<team-name>` team."

   Replace the placeholder with your team name.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_teams (MCP)(uid: "qa-team")

   ⏺ The qa-team team has 2 members: alice@example.com, bob@example.com.
   ```

## Delete Clusters and Cluster Profiles

The `delete_cluster` tool deletes a cluster. The `delete_cluster_profile` tool deletes a cluster profile. Both tools
require a typed-name confirmation before the delete is issued to Palette.

1. Start the Palette MCP server with the `--allow-write` startup flag to enable write tools. Refer to the applicable
   setup guide for [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or the
   [Gemini CLI](./setup/mcp-setup-gemini.md) for more information.

2. Open your MCP client.

3. Send a query to delete a Palette cluster. For example, you can say "Delete the `<cluster-name>` Palette cluster."

   Replace the placeholder with your cluster name.

   The MCP server prompts you to type back the cluster name to confirm the delete.

   ```shell hideClipboard title="Example Output"
   ⏺ This will delete the running dev-cluster cluster (uid: 69c401bf35d56c1812c5a00f). This is irreversible.
     To confirm, please type the cluster name: dev-cluster

   ❯ dev-cluster

   ⏺ palette - delete_cluster (MCP)(uid: "69c401bf35d56c1812c5a00f", confirm: "dev-cluster")

   ⏺ Done. The dev-cluster cluster has been marked for deletion.
   ```

4. Poll the cluster status with `read_cluster_status` until the cluster reaches the `Deleted` state.

   ```shell hideClipboard title="Example Output"
   ⏺ palette - read_cluster_status (MCP)(uid: "69c401bf35d56c1812c5a00f", fields: ["status.state"])

   ⏺ The dev-cluster cluster is currently in the Deleting state.
   ```

5. Send a query to delete a Palette cluster profile. For example, you can say "Delete the `<cluster-profile-name>`
   Palette cluster profile."

   Replace the placeholder with your cluster profile name.

   ```shell hideClipboard title="Example Output"
   ⏺ This will delete the cluster-profile-test cluster profile (uid: 698bc897c7fdfaca31d7122f). This is irreversible.
     To confirm, please type the cluster profile name: cluster-profile-test

   ❯ cluster-profile-test

   ⏺ palette - delete_cluster_profile (MCP)(uid: "698bc897c7fdfaca31d7122f", confirm: "cluster-profile-test")

   ⏺ Done. The cluster-profile-test cluster profile has been deleted.
   ```
