---
sidebar_label: "Imported Clusters"
title: "Imported Clusters"
description: "Learn how to manage imported clusters and what operations are supported with Palette."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "cloud-arrow-down"
tags: ["clusters", "imported clusters"]
---

Existing Kubernetes clusters not deployed through Palette can be imported into Palette for visibility, limited Day -2
management, and additional capabilities such as application lifecycle management. You can import Kubernetes clusters
from various infrastructure providers, such as public and private clouds and bare-metal environments.

Palette supports importing _generic_ or _cloud-specific_ clusters. Cloud-specific clusters enable more functionality
because Palette understands how to interact with the infrastructure provider's API. Refer to [Limitations](#limitations)
for details on what functionality may be missing from generic or cloud-specific clusters when imported.

The generic type is for a cluster that is deployed in an environment where Palette lacks integration with the underlying
infrastructure provider's API. Palette can support basic operations for generic clusters, such as reporting metrics,
conducting scans, scheduling backups, and applying and managing add-on profiles. However, Day-2 activities are not
supported in generic clusters.

Refer to the [Supported Infrastructure Providers](imported-clusters.md#supported-infrastructure-providers) section to
learn more about supported infrastructure environments.

To get started with a cluster import, refer to the [Import a Cluster](cluster-import.md) guide to learn more.

## Import Modes

To determine Palette's control over the imported cluster, you can choose the management mode you prefer. Refer to the
table below for more information on each mode.

| Mode            | Description                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Read-only       | This mode allows you to access information about the cluster, such as event logs, cost, and health checks. The read-only mode does not support Day-2 activities, nor custom HTTP proxy configurations. |
| Full Permission | This mode provides full cluster management, depending on the cluster, generic, or cloud-specific. This mode also supports the ability to deploy add-on cluster profiles.                               |

## Supported Infrastructure Providers

The following infrastructure providers are supported for cluster imports. If an environment is not listed below, select
the **Generic** type when importing a cluster.

| Infrastructure Provider | Type           |
| ----------------------- | -------------- |
| AWS                     | Cloud Specific |
| Azure                   | Cloud Specific |
| Google Cloud Platform   | Cloud Specific |
| VMware                  | Cloud Specific |
| OpenShift               | Cloud Specific |
| AWS EKS-Anywhere        | Cloud Specific |
| Generic                 | Generic        |

<br />

### Self-Hosted Support

Self-hosted Palette also supports importing clusters. You must ensure network connectivity is available between the
target import cluster and the Palette instance.

<br />

## Limitations

### All Imported Clusters

A few restrictions apply to all cluster imports that you need to be aware of before importing a cluster.

| Limitation                 | Description                                                                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full Cluster Profile usage | You cannot use a full cluster profile. You are limited to using add-on profiles when deploying cluster profiles to imported clusters.              |
| Kubeconfig file access     | You cannot download the cluster's kubeconfig file from Palette. You must use the underlying infrastructure provider to access the kubeconfig file. |
| HTTP Proxy Configuration   | You cannot configure HTTP proxy settings for imported clusters in **Read-only** mode. Import the cluster using **Full Permission** mode.           |

<br />

:::warning

Imported generic clusters lack many Day-2 management operations such as scaling nodes, adding worker pools, or any
operations that require Palette to have knowledge of the underlying infrastructure.

:::

<br />

### Generic Clusters

- Palette displays limited metadata for imported generic clusters when compared with cloud-specific clusters. The
  metadata displayed for generic clusters are `region` and `instance type`.

### Cloud-Specific Clusters

Imported Cloud-specific clusters provide a similar experience as Palette deployed clusters but with the following
limitations:

- Palette cannot manage [node groups/pools](../cluster-management/node-pool.md) for imported cloud-specific clusters
  because it does not provision the nodes directly.

- When interacting with imported EKS, GKE, or AKS clusters through the Palette API, use the IaaS endpoint. Refer to the
  following tabs for examples.

  <Tabs>

  <TabItem value="Amazon EKS Example">

  To update the imported Amazon EKS cluster configuration information, use
  [`/v1/cloudconfigs/aws/<configUid>/clusterConfig`](/api/v1/v-1-cloud-configs-aws-uid-cluster-config/) instead of
  `/v1/cloudconfigs/eks/<configUid>/clusterConfig`.

  </TabItem>

  <TabItem value="GKE Example">

  To update the imported GKE cluster configuration information, use
  [`/v1/cloudconfigs/gcp/<configUid>/clusterConfig`](/api/v1/v-1-cloud-configs-gcp-uid-cluster-config/) instead of
  `/v1/cloudconfigs/gke/<configUid>/clusterConfig`.

  </TabItem>

  <TabItem value="AKS Example">

  To update the imported AKS cluster configuration information, use
  [`/v1/cloudconfigs/azure/<configUid>/clusterConfig`](/api/v1/v-1-cloud-configs-azure-uid-cluster-config/) instead of
  `/v1/cloudconfigs/aks/<configUid>/clusterConfig`.

  </TabItem>

  </Tabs>

## Delete Imported Cluster

You can remove a cluster by following the standard cluster removal steps. Refer to the
[Delete a Cluster](../cluster-management/remove-clusters.md) for instructions. Be aware that Palette will not delete the
actual cluster. Palette will remove the link to the imported cluster and instruct the Palette agent to remove itself
from the cluster and all of the agent's dependencies that were installed during the import process. To delete the
cluster, you must manually perform the delete action in the hosting infrastructure provider.

## Resources

- [Import a Cluster](cluster-import.md)

- [Attach an Add-on Profile](attach-add-on-profile.md)

- [Migrate to Full Permissions](migrate-full-permissions.md)
