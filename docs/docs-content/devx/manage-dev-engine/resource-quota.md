---
sidebar_label: "Resource Quotas"
title: "Resource Quotas"
description: "Learn about Palette Dev Engine resource quotas."
hide_table_of_contents: false
sidebar_position: 0
tags: ["devx", "app mode", "pde"]
---

This section covers the available deployment environments for Palette Virtual Clusters and the resource quotas that
apply to users and virtual clusters.

## Available Environments

Palette Dev Engine users have access to a Palette-managed cluster group named _beehive_. The beehive cluster group is
also a _system-level cluster group_, meaning that Spectro Cloud manages it. The beehive cluster group falls under the
free tier of Palette and comes with its own set of resource limits. All users are subject to the following resource
quotas when using the beehive cluster group.

| Type            | Max Limit | Description                                                                                           |
| --------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| Virtual Cluster | 2         | Each user is allowed to deploy a total of two virtual clusters.                                       |
| CPU             | 12        | Each user is allowed to consume a total of 12 CPU. This limit spans both virtual clusters.            |
| Memory          | 12 Gib    | Each user is allowed to consume a total of 12 GiB of Memory. This limit spans both virtual clusters.  |
| Storage         | 20 GiB    | Each user is allowed to consume a total of 20 GiB of storage. This limit spans both virtual clusters. |

Palette administrators can remove the beehive cluster, and other system-level cluster groups for all downstream users by
setting the tenant developer setting **Hide system-level cluster groups from tenant users** to **true**. When this
setting value is **true**, the beehive cluster is not displayed in the cluster group drop-down menu when deploying
Palette virtual clusters.

![The deployment path for a user](/045-devx_resource-quota_is-beehive-enabled.png)

You can change tenant developer settings by switching to the tenant scope and navigating from the left **Main Menu** to
**Tenant Settings > Developers Settings**. Toggle the **Hide system-level cluster groups from tenant users** button.

## Virtual Cluster Resource Quota

Virtual clusters inherit resource quotas from the parent cluster group. The cluster group's virtual cluster settings
determine the maximum resources per virtual cluster, and can be used to limit the number of resources a virtual cluster
can claim from the group. By default, each virtual cluster requires at least 4 CPU, 4 GiB of memory, and 2 GiB of
storage. Keep the required minimum values in mind when deploying virtual clusters or when defining the cluster group's
virtual cluster settings.

| **Virtual Cluster**   | **Minimum Limit** |
| --------------------- | ----------------- |
| CPU (per request)     | 4                 |
| Memory (per request)  | 4 GiB             |
| Storage (per request) | 2 GiB             |

:::warning

A virtual cluster requires a minimum of 4 CPU, 4 GiB of memory, and 2 Gib of storage to launch successfully. The default
settings in the cluster group virtual cluster configuration YAML file has the following values:

```yaml
vcluster
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
      ephemeral-storage: 1Gi
    requests:
      cpu: 200m
      memory: 256Mi
      ephemeral-storage: 128Mi
```

Increasing the limit and request values could result in a virtual cluster requiring more resources than the default
values of CPU, 4 GiB Memory, and 2 Gib of storage.

:::

If a user attempts to create a virtual cluster that needs more resources than the cluster group allows, the request will
be denied because it exceeds the cluster group's defined limits.

Refer to the [Create and Manage Cluster Groups](../../clusters/cluster-groups/create-cluster-group.md) to learn more
about adjusting cluster group's virtual cluster settings.

## User Resource Quotas

All Palette users are subject to resource quotas. The two entities that impact a user's resource quotas when interacting
with virtual clusters are the tenant developer user quotas and the cluster group virtual cluster settings.

## Tenant Developer User Quotas

The global user quotas that a Palette administrator has defined in the tenant developer settings are always evaluated
first. The tenant user quotas define the maximum set of resources a user can claim.

- Virtual clusters

- CPU

- Memory

- Storage

For example, assume the following tenant developer user quotas for four virtual clusters are defined as 20 CPU, 32 GiB
of memory, and 60 GiB of storage. With these settings, all users could deploy four virtual clusters, each virtual
cluster with a maximum size allowed by the cluster group limits.

Users can also deploy a single virtual cluster that consumes 20 CPU, 32 GiB of memory, and 60 GiB of storage. In the
latter example, the user cannot deploy additional clusters because CPU, memory, and storage resources are exhausted.

<br />

:::info

To change tenant user quotas, switch the scope to **Tenant Admin** and navigate from the left **Main Menu** to **Tenant
Settings** > **Developer Settings**. In the **User Quota** section, you can adjust the maximum number of resources for
users.

:::

## Quota Evaluation

Palette evaluates each virtual cluster creation request to verify the requesting user has enough resource quotas
remaining based on the defined tenant user quota and if the virtual cluster request falls within the allowed limits of
the parent cluster group.

The following diagram displays the evaluation process Palette uses to determine the status of a virtual cluster creation
request.

![Order of flow when it comes to evaluating cluster requests](/045-devx_resource-quota_evaluation-process.png)

To better understand this concept, use the following examples.

- Tenant Developer User Quotas:
  - Number of virtual clusters: 4
  - CPU: 20
  - Memory: 32 GiB
  - Storage: 60 GiB
- Hide system-level cluster groups from tenant users: false

- Cluster Group _dev-special_ Virtual Cluster Settings

  - CPU (per requests): 8
  - Memory (per requests): 12 GiB
  - Storage (per requests): 12 GiB

- User A's Current Resource Utilization

  - 1 virtual Cluster in dev-special
  - 8 CPU
  - 12 GiB Memory
  - 20 GiB of Storage

- User B's Current Resource Utilization
  - 4 Virtual Cluster in dev-special
  - 16 CPU
  - 32 GiB Memory
  - 60 GiB of Storage

### Scenario 1

User A is creating a request to deploy a virtual cluster to the dev-special cluster group. The virtual cluster is
requesting the following resources:

- 8 CPU
- 12 GiB Memory
- 20 GiB Memory

**Request**: ✅

**Explanation**: Based on tenant user quota, user A has these remaining resources for two virtual clusters: 12 CPU, 20
GiB Memory, and 40 GiB of storage. Based on cluster group quota, user A is within the resource limits of the dev-special
cluster group.

<br />

### Scenario 2

User B is creating a request to deploy a virtual cluster to the dev-special cluster group. The virtual cluster is
requesting the following resources:

- 4 CPU
- 8 GiB Memory
- 4 GiB Storage

**Request**: ❌

**Explanation**: User B has exceeded the tenant user quota for four clusters. Based on cluster group quota, the virtual
cluster request falls within the approved limits.

<br />

### Scenario 3

User B is creating a request to deploy a virtual cluster to the beehive cluster group. The virtual cluster is requesting
the following resources:

- 4 CPU
- 8 GiB Memory
- 4 GiB Storage

**Request**: ✅

**Explanation**: The request is accepted because it targets a system-level cluster group, the beehive cluster group and
not a cluster group managed by the tenant. Based on the cluster group quota, the number of requested resources falls
within the within the approved limits of the system-level quota.
