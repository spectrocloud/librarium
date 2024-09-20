---
sidebar_label: "Platform Settings"
title: "Platform Settings"
description: "Platform Settings on Palette"
hide_table_of_contents: false
sidebar_position: 170
tags: ["clusters", "cluster management"]
---

Palette provides the following platform settings:

- [Pause Platform Updates](#pause-platform-updates)
- [Auto Remediation](#auto-remediation)

## Pause Platform Updates

Palette supports the **Pause Platform Updates** feature to exclude a cluster or a group of clusters from having their
Palette agent upgraded when Palette is upgraded.

:::info

This feature only pauses upgrades for Palette agents, not updates to the clusters themselves.

:::

### Pause Agent Upgrade Scopes

Agent upgrades can be paused and resumed in the following scopes:

- Pause agent upgrades for a single cluster
- Pause agent upgrades for all clusters within a project
- Pause agent upgrades for all clusters within a tenant

When determining if the agent upgrades for one cluster is paused or not, you only need to look at the setting for the
cluster itself. Agent upgrade settings are always applied based on individual cluster settings. Project and tenant agent
upgrade settings are not inherited - instead cluster level settings are set to match _each time_ project and tenant
level settings are changed.

Pausing or resuming agent upgrades at a higher-level scope will automatically pause or resume agent upgrades in the
lower-level scopes. For example, if you pause agent upgrades at the tenant level, then agent upgrades will be paused for
all projects within that tenant, and all clusters within those projects. Similarly, if you resume upgrades at the
project level, then all clusters within that project will have their agent upgrades resumed.

This is a one-time change that happens at the moment when you pause or resume upgrades in the project or tenant scope,
and it does not mandate that the same setting be kept at the lower scopes. If you pause or resume agent upgrades in a
lower-level scope, it will override the setting from the higher-level scope. For example, even if all agent upgrades are
paused at the tenant level, you can override the tenant-level pause by resuming upgrades in a specific project or a
specific cluster.

:::warning

Overrides of agent upgrade settings are not permanent. When the pause agent settings at the project or tenant scope
change, the agent upgrade setting in the cluster or project scopes will always be set to match the higher-level scope
setting regardless. If you want to override the project or tenant level agent upgrade setting, you must change the agent
upgrade setting in the lower scope _after_ the change in the higher scope.

:::

The following table lists some example upgrade configurations and whether the Palette agent will be upgrades in those
settings. Note that only the settings at the cluster level determines whether the Palette agent will be upgraded.

| Tenant           | Project          | Cluster          | Outcome                                   |
| ---------------- | ---------------- | ---------------- | ----------------------------------------- |
| Upgrades paused  | Upgrades paused  | Upgrades enabled | Palette agent will upgrade automatically. |
| Upgrades enabled | Upgrades enabled | Upgrade paused   | Palette agent upgrades are paused.        |

### Agent Upgrades for PCG and Edge Hosts

Aside from clusters, you can also pause the agent upgrades on Private Cloud Gateways (PCG) and Edge hosts that are
registered with Palette but are not part of a cluster.

Since PCGs are scoped to tenants, you can pause the agent upgrades on a PCG by pausing agent upgrades on the tenant to
which the PCG is associated. You can also pause or resume upgrades for a PCG in the PCG details page through **Cluster
Settings**. Similar to clusters, pausing and resuming upgrades at the tenant level will pause or resume agent upgrades
for all PCGs in the tenant. Pausing and resuming upgrades for a PCG individually will override the tenant-level setting.

Edge hosts that are part of a cluster have their agent upgrades managed by the settings of their cluster. Edge hosts
that are not part of a cluster have their agent upgrades managed at the project and tenant level. Similar to clusters,
pausing or resuming agent upgrades at the tenant level will automatically pause or resume agent upgrades for all
projects within that tenant. However, you can override the tenant level setting by manually changing the upgrade setting
at the project level.

The following is a table showing the scopes at which you can pause agent upgrades for different objects. The same
relationship between the scopes applies: Changing the setting in a higher scope will trigger a one-time change to the
lower scopes, and changing the setting at the lower scope will override the setting in the higher scope.

|                 | Individual Cluster/PCG | Project | Tenant |
| --------------- | ---------------------- | ------- | ------ |
| Cluster         | ✅                     | ✅      | ✅     |
| PCG             | ✅                     | ❌      | ✅     |
| Idle Edge hosts | ❌                     | ✅      | ✅     |

### Pause Updates for Single Cluster

Individual cluster under Project scope and Tenant scope can be locked to restrict them from the Palette upgrades. To
lock a cluster follow the below steps:

1. Log in to Palette console as Tenant or Project administrator.

2. Go to the `Clusters` page from the left ribbon menu and select the cluster to be paused with updates.

3. From the cluster details page, click `Settings -> Cluster Settings`

4. Toggle the `Pause Platform Updates` button to pause updates of the cluster so that the cluster management services
   are not upgraded on the upgrade of the Palette.

5. To unpause the cluster updates, toggle the `Pause Platform Updates` back and deselect.

<br />

### Pause Updates for all the Clusters within the Project Scope

All the clusters under a Project can be paused for updates to restrict them from the Palette upgrades. To pause updates
for all clusters under Project scope:

1. Log in to Palette console as Project administrator.

2. Select `Project Settings` from the left ribbon menu.

3. From `Project Settings` page, select `Platform Updates` and toggle the `Pause Platform Updates` button. This
   restricts all the clusters under that project scope from being upgraded from cluster management services upgrade on
   the upgrade of the Palette.

4. To unpause the clusters updates, toggle the `Pause Platform Updates` back and deselect.

<br />

### Pause Updates for all Clusters within the Tenant Scope

All the clusters under a Tenant can be update paused to restrict them from the Palette upgrades. To lock all clusters
under a Tenant scope:

<br />

1. Log in to the Palette console as a `Tenant administrator`.

2. Select `Tenant Settings` from the left ribbon menu.

3. From `Tenant Settings,` select `Platform Updates` and toggle the `Pause Platform Updates` button.This restricts all
   the clusters under that tenant scope from being upgraded from cluster management services upgrade on the upgrade of
   the Palette.

4. To unlock the clusters, toggle the `Pause Platform Updates` back and deselect.

<br />

## Auto Remediation

Palette provides Cluster Auto Remediation as a node reconciliation operation. When Cluster Auto Remediation is on,
unhealthy nodes in all the Palette-provisioned clusters will automatically be replaced with new nodes. Turning off this
feature will disable auto remediation. This feature can work under the scope of:

- Tenant

- Project

To enable auto remediation:

- Login to Palette console as Tenant/Project admin.

- Go to `Tenant Settings`/`Project Settings` as per the user scope.

- Select `Platform Settings` from the left menu and toggle `Cluster Auto Remediation` toggle button.

:::info

This does not apply to EKS, AKS or TKE clusters.

:::
