---
sidebar_label: "Imported Clusters"
title: "Imported Clusters"
description: "Learn how to manage imported clusters and what operations are supported with Palette."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "cloud-arrow-down"
tags: ["clusters", "imported clusters"]
---

You can import existing Kubernetes clusters that were not deployed through Palette for visibility, limited Day-2
management, and additional capabilities such as application lifecycle management. Palette supports importing clusters
from various infrastructure providers, including public and private clouds and bare-metal environments.

Palette supports importing _generic_ or _cloud-specific_ clusters. Cloud-specific clusters provide greater visibility
into the underlying infrastructure, such as networking details, availability zones, and instance metadata, because
Palette understands how to interact with the infrastructure provider's API. Refer to [Limitations](#limitations) for
details on what functionality may differ between generic and cloud-specific imported clusters.

The generic type is for clusters deployed in environments where Palette does not have integration with the underlying
infrastructure provider's API. Palette supports basic operations for generic clusters, such as reporting metrics,
conducting scans, scheduling backups, and applying and managing add-on profiles. Day-2 activities are not supported in
generic clusters.

Refer to the [Supported Infrastructure Providers](#supported-infrastructure-providers) section to learn more about
supported infrastructure environments.

To get started, refer to the [Import a Cluster](cluster-import.md) guide.

## Import Modes

When importing a cluster, you choose the management mode that determines the level of control Palette has over the
cluster.

| **Mode**        | **Description**                                                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read-only       | Provides access to cluster information such as event logs, cost, and health checks. This mode does not support Day-2 activities or custom HTTP proxy configurations. |
| Full Permission | Provides full cluster management capabilities based on the cluster type (generic or cloud-specific). This mode also supports deploying add-on cluster profiles.      |

## Supported Infrastructure Providers

The following infrastructure providers are supported for cluster imports. If an environment is not listed below, select
the **Generic** type when importing a cluster.

| **Infrastructure Provider** | **Type**       |
| --------------------------- | -------------- |
| AWS IaaS                    | Cloud Specific |
| Azure IaaS                  | Cloud Specific |
| GCP IaaS                    | Cloud Specific |
| Generic                     | Generic        |

### Self-Hosted Support

Self-hosted Palette also supports importing clusters. Ensure network connectivity is available between the target import
cluster and the Palette instance.

## Limitations

### All Imported Clusters

The following restrictions apply to all imported clusters.

| **Limitation**             | **Description**                                                                                                                                                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full Cluster Profile usage | You cannot use a full cluster profile. Only add-on profiles are supported for imported clusters. This does not include full cluster profiles specifically created for [EKS Hybrid node pools](../public-cloud/aws/eks-hybrid-nodes/create-hybrid-node-pools.md). |
| Kubeconfig file access     | You cannot download the kubeconfig file from Palette. Use the underlying infrastructure provider to access the kubeconfig file.                                                                                                                                  |
| HTTP Proxy Configuration   | You cannot configure HTTP proxy settings for imported clusters in **Read-only** mode. Import the cluster using **Full Permission** mode.                                                                                                                         |

:::warning

Imported generic clusters lack many Day-2 management operations such as scaling nodes, adding worker pools, or any
operations that require Palette to have knowledge of the underlying infrastructure.

:::

### Generic Clusters

- AWS EKS-Anywhere, OpenShift, and VMware vSphere clusters are not supported.

- Palette displays limited metadata for imported generic clusters compared with cloud-specific clusters. At the cluster
  configuration level, only `region` is available. At the machine pool level, only basic compute specifications such as
  CPU, memory, and disk size are available.

### Cloud-Specific Clusters

Imported cloud-specific clusters provide a similar experience to Palette-deployed clusters, with better visibility into
infrastructure details such as VPC IDs, availability zones, subnets, and security groups. However, the following
limitations apply:

- Palette cannot manage [node groups/pools](../cluster-management/node-pool.md) for imported cloud-specific clusters
  because it does not provision the nodes directly.

  - This does not apply to
    [Amazon EKS Hybrid node pools](../public-cloud/aws/eks-hybrid-nodes/create-hybrid-node-pools.md), which consist of
    edge hosts managed by Palette.

- When interacting with imported Infrastructure as a Service (IaaS) clusters through the Palette API, use the IaaS
  endpoint. Refer to the following tabs for examples.

  <Tabs>

  <TabItem value="AWS IaaS Example">

  To update the imported AWS IaaS cluster configuration information, use
  [`/v1/cloudconfigs/aws/<configUid>/clusterConfig`](/api/v1/v-1-cloud-configs-aws-uid-cluster-config/) instead of
  `/v1/cloudconfigs/eks/<configUid>/clusterConfig`.

  </TabItem>

  <TabItem value="Google IaaS Example">

  To update the imported Google IaaS cluster configuration information, use
  [`/v1/cloudconfigs/gcp/<configUid>/clusterConfig`](/api/v1/v-1-cloud-configs-gcp-uid-cluster-config/) instead of
  `/v1/cloudconfigs/gke/<configUid>/clusterConfig`.

  </TabItem>

  <TabItem value="Azure IaaS Example">

  To update the imported Azure IaaS cluster configuration information, use
  [`/v1/cloudconfigs/azure/<configUid>/clusterConfig`](/api/v1/v-1-cloud-configs-azure-uid-cluster-config/) instead of
  `/v1/cloudconfigs/aks/<configUid>/clusterConfig`.

  </TabItem>

  </Tabs>

## Delete Imported Cluster

You can remove a cluster by following the standard cluster removal steps. Refer to
[Delete a Cluster](../cluster-management/remove-clusters.md) for instructions. Palette does not delete the actual
cluster. Instead, Palette removes the link to the imported cluster and instructs the Palette agent to remove itself and
all of its dependencies that were installed during the import process. To delete the cluster, you must manually delete
it through the hosting infrastructure provider.

## Next Steps

- [Import a Cluster](cluster-import.md)

- [Attach an Add-on Profile](attach-add-on-profile.md)

- [Migrate to Full Permissions](migrate-full-permissions.md)
