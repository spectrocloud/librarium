---
sidebar_label: "Pause Platform Upgrades"
title: "Pause Platform Upgrades"
description: "Learn about Palette's Pause Agent Upgrades setting."
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster management"]
---

Palette supports the **Pause Agent Upgrades** feature to exclude a cluster or a group of clusters from getting automatically upgraded when Palette is upgraded. The three ways to activate this feature are:

* Pause Upgrades for a Single Cluster
* Pause Upgrades for all Clusters within Project Scope
* Pause Upgrades for all Clusters within Tenant Scope

## Prerequisites

* Cluster admin permissions or Tenant admin permissions when pausing upgrades for all clusters within tenant scope.

* An existing cluster. Follow this [tutorial](../../clusters.md) to get started.


## Enablement

Use the tabs below to view the instructions for enabling the **Pause Agent Upgrades** feature for a single cluster, all clusters within the project scope, or all within the tenant scope.

<Tabs groupId="pauseUpgrades">

<TabItem value="singleCluster" label="Single Cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select your cluster.

4.  Select **Settings** > **Cluster Settings**.

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