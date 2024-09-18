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

When determining if the agent upgrades for one cluster is paused or not, you only need to look at the setting for the
cluster itself. Even if agent upgrades are paused on a tenant or project level, agent upgrades for an individual cluster
can still be turned on. If an Edge host is not part of any cluster, then its agent upgrade status is determined by the
project that the Edge host is associated with.

Pausing or resuming agent upgrades at a higher-level scope will automatically pause or resume agent upgrades in the
lower-level scopes, respectively. For example, if you pause agent upgrades at the tenant level, then agent upgrades will
be paused for all projects within that tenant, and all clusters within those projects. Similarly, if you resume upgrades
at the project level, then all clusters within that project will have their agent upgrades resumed.

However, if you pause or resume agent upgrades at a lower-level scope, it will have no impact on the higher-level scope.
For example, if you pause all agent upgrades for a tenant, and then resume agent upgrades for one cluster within that
tenant, agent upgrades for that one cluster will resume, even as agent upgrades are still paused at the tenant level.
However, if you resume upgrades at the tenant level, and then pause again at the tenant level, it will pause agent
upgrades for all clusters within the tenant, including clusters where you manually resumed agent upgrades.

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
