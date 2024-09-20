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
can still be turned on.

Pausing or resuming agent upgrades at a higher-level scope will automatically pause or resume agent upgrades in the
lower-level scopes. For example, if you pause agent upgrades at the tenant level, then agent upgrades will be paused for
all projects within that tenant, and all clusters within those projects. Similarly, if you resume upgrades at the
project level, then all clusters within that project will have their agent upgrades resumed.

This is a one-time change that happens at the moment when you pause or resume upgrades in the higher scope, and it does
not mandate that the same setting be kept at the lower scopes. If you pause or resume agent upgrades in a lower-level
scope, it will override the setting from the higher-level scope. For example, even if all agent upgrades are paused at
the tenant level, you can override the tenant-level pause by resuming upgrades in a specific project or a specific
cluster. However, if you resume upgrades at the tenant level, and then pause again at the tenant level, it will pause
agent upgrades for all clusters within the tenant, including clusters where you manually overrode the tenant-level
settings and resumed agent upgrades.

## Agent Upgrades for PCG and Edge Hosts

Aside from clusters, you can also pause the agent upgrades on Private Cloud Gateways (PCG) and Edge hosts that are
registered with Palette but are not part of a cluster.

Since PCGs are scoped to tenants, you can pause the agent upgrades on a PCG by pausing agent upgrades on the tenant to
which the PCG is associated. You can also pause or resume upgrades for a PCG in the PCG details page through **Cluster
Settings**. Similar to clusters, pausing and resuming upgrades at the tenant level will pause or resume agent upgrades
for all PCGs in the tenant. Pausing and resuming upgrades for a PCG individually will override the tenant-level setting.

Edge hosts that are part of a cluster have their agent upgrades managed by the settings of their cluster. Edge hosts
that are not part of a cluster have their agent upgrades managed at the project and tenant level. Similar to clusters,
pausing or resuming agent upgrades at the tenant level will automatically pause or resume agent upgrades for all
projects with in that tenant. However, you can override the tenant level setting by manually changing the upgrade
setting at the project level.

The following is a table showing the scopes at which you can pause agent upgrades for different objects. The same
relationship between the scopes applies: Changing the setting in a higher scope will trigger a one-time change to the
lower scopes, and changing the setting at the lower scope will override the setting in the higher scope.

|                 | Individual Cluster/PCG | Project | Tenant |
| --------------- | ---------------------- | ------- | ------ |
| Cluster         | ✅                     | ✅      | ✅     |
| PCG             | ✅                     |         | ✅     |
| Idle Edge hosts |                        | ✅      | ✅     |

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

<TabItem value="singlePcg" label="Single PCG" >

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**

4. Click on the PCG you want to pause or resume upgrades for.

5. From the PCG details page, click **Settings** > **Cluster Settings**.

6. Toggle the **Pause Agent Upgrades** button to pause upgrades for the PCG.

7. A pop-up box will ask you to confirm the action. Click **OK**.

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

Pausing upgrades in a project also pauses agent upgrades for all Edge hosts in the project that are not part of a
cluster.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Project Settings**.

3. Select **Platform Settings**.

4. The **Pause Agent Upgrades** toggle button is checked.

</TabItem>

<TabItem value="tenantScope" label="All Clusters - Tenant Scope">

Pausing upgrades in a Tenant also pauses agent upgrades for all Edge hosts in the tenant that are not part of a cluster,
as well as PCGs in the tenant.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Platform Settings**.

4. The **Pause Agent Upgrades** toggle button is checked.

</TabItem>

<TabItem value="singlePcg" label="Single PCG" >

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**

4. Click on the PCG you want to pause or resume upgrades for.

5. From the PCG details page, click **Settings** > **Cluster Settings**.

6. The **Pause Agent Upgrades** toggle button is checked.

</TabItem>

</Tabs>
