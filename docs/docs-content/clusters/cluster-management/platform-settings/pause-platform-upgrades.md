---
sidebar_label: "Pause Agent Upgrades"
title: "Pause Agent Upgrades"
description: "Learn about Palette's Pause Agent Upgrades setting."
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster management"]
---

Palette supports the **Pause Agent Upgrades** feature to exclude a cluster or a group of clusters from getting
automatically upgraded when Palette is upgraded.

## Pause Agent Upgrade Scopes

Upgrades can be paused and resumed in the following scopes:

- Pause upgrades for a single cluster
- Pause upgrades for all clusters within a project
- Pause upgrades for all clusters within a tenant

Agent upgrades are only enabled when they are not paused at any level. For an individual cluster, if agent upgrades are
paused at any level - at the tenant level, project level, or cluster level, agent upgrades will not be enabled for that
cluster. In the case of Edge hosts that are registered with Palette but are not part of a cluster, agent upgrades will
be paused if you pause upgrades either at the tenant level or at the project level.

:::info

While pausing upgrades at any scope will stop the agent from upgrading, pausing or resuming agent upgrades in one scope
will not change the upgrade setting in any other scope. For example, if you pause upgrades at the tenant level, and also
pause upgrades at the cluster level for one cluster, the cluster agent will not upgrade. When you resume upgrades at the
tenant level, the agent upgrades still will not resume for that cluster because the upgrade is still paused at the
cluster level.

:::

![A flow chart demonstrating how cluster and Edge host agent upgrades are decided based on pause upgrade settings](/clusters_cluster-management_platform-settings_pause-agent-upgrade-flow.webp)

## Prerequisites

- Cluster admin permissions or Tenant admin permissions when pausing upgrades for all clusters within tenant scope.

- An existing cluster. Follow this [tutorial](../../clusters.md) to get started.

## Enablement

Use the tabs below to view the instructions for enabling the **Pause Agent Upgrades** feature for a single cluster, all
clusters within the project scope, or all within the tenant scope.

<Tabs groupId="pauseUpgrades">

<TabItem value="singleCluster" label="Single Cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select your cluster.

4. Select **Settings** > **Cluster Settings**.

5. Toggle the **Pause Agent Upgrades** button to pause cluster upgrades.

6. A pop-up box will ask you to confirm the action. Click **OK**.

</TabItem>

<TabItem value="projectScope" label="All Clusters - Project Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Project Settings**.

3. Select **Platform Settings**.

4. Toggle the **Pause Agent Upgrades** button to pause upgrades for all clusters within the project scope.

5. A pop-up box will ask you to confirm the action. Click **OK**.

</TabItem>

<TabItem value="tenantScope" label="All Clusters - Tenant Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Platform Settings**.

4. Toggle the **Pause Agent Upgrades** button to pause upgrades for all clusters within tenant scope.

5. A pop-up box will ask you to confirm the action. Click **OK**.

</TabItem>

</Tabs>

## Validate

<Tabs groupId="pauseUpgrades">

<TabItem value="singleCluster" label="Single Cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select your cluster.

4. From the cluster details page, click **Settings** > **Cluster Settings**.

5. The **Pause Agent Upgrades** toggle button is checked.

</TabItem>

<TabItem value="projectScope" label="All Clusters - Project Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Project Settings**.

3. Select **Platform Settings**.

4. The **Pause Agent Upgrades** toggle button is checked.

</TabItem>

<TabItem value="tenantScope" label="All Clusters - Tenant Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Platform Settings**.

4. The **Pause Agent Upgrades** toggle button is checked.

</TabItem>

</Tabs>
