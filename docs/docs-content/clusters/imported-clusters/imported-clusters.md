---
sidebar_label: "Imported Clusters"
title: "Imported Clusters"
description: "Learn how to manage imported clusters and what operations are supported with Palette."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "cloud-arrow-down"
tags: ["clusters", "imported clusters"]
---

You can import Kubernetes clusters created outside of Palette into Palette for visibility, limited Day-2 management, and
additional capabilities such as application lifecycle management. Palette supports importing clusters from various
infrastructure providers, including public and private clouds and bare-metal environments.

## Supported Infrastructure Providers

Palette supports importing clusters deployed using a variety of infrastructure providers. Supported cloud-specific
clusters have increased visibility in the Palette UI compared to generic clusters.

Operations performed on cloud-specific and generic clusters do not vary and are determined by the
[import mode](#import-modes) selected.

| **Cluster Type**   | **Supported Environments**                       | **Description**                                                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Cloud-Specific** | - AWS IaaS <br /> - Azure IaaS <br /> - GCP IaaS | Provides a similar experience to Palette-deployed clusters, with better visibility into infrastructure details such as VPC IDs, availability zones, subnets, security groups, and instance metadata.                                                   |
| **Generic**        | Other                                            | Displays limited metadata compared to cloud-specific imported clusters. At the cluster configuration level, only `region` is available. At the machine pool level, only basic compute specifications such as CPU, memory, and disk size are available. |

Self-hosted Palette also supports importing clusters. Ensure network connectivity is available between the target import
cluster and the Palette instance.

## Import Modes

When importing a cluster, choose between **Read-only mode** and **Full Permission mode** to determine the level of
control Palette has over your imported cluster. Certain Day-2 operations, such as OS patching, the ability to pause and
resume clusters, and node pool management, are not supported for imported clusters because Palette does not provision or
control the underlying infrastructure.

| **Import Mode**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Read-Only**       | The Palette agent observes the cluster with limited RBAC permissions but does not modify workloads or infrastructure. The agent does not install a metrics server. If you want Palette to display resource utilization data, ensure a metrics server is present before importing. Refer to [Import a Cluster](cluster-import.md) for details. You can [migrate to Full Permission mode](migrate-full-permissions.md) at any time. |
| **Full Permission** | The Palette agent has broad RBAC permissions and can deploy add-on profiles, configure RBAC bindings, run compliance scans, and manage workloads. The agent automatically detects whether a metrics server is present and installs one if none is found.                                                                                                                                                                          |

The following table summarizes what actions are supported by Palette depending on your import mode.

| **Operation**                                                                                                                                                                                                                                                                                | **Read-Only Mode** | **Full Permission Mode** |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------: | :----------------------: |
| View event logs, cost, and health checks                                                                                                                                                                                                                                                     | :white_check_mark: |    :white_check_mark:    |
| Deploy and manage [add-on cluster profiles](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)                                                                                                                                            |        :x:         |    :white_check_mark:    |
| Configure Role-Based Access Control (RBAC) bindings and namespaces                                                                                                                                                                                                                           |        :x:         |    :white_check_mark:    |
| Configure HTTP proxy settings                                                                                                                                                                                                                                                                |        :x:         |    :white_check_mark:    |
| Run [compliance scans](../cluster-management/compliance-scan.md) and [schedule backups](../cluster-management/backup-restore/backup-restore.md)                                                                                                                                              |        :x:         |    :white_check_mark:    |
| Designate cluster as a [virtual cluster host](../cluster-groups/create-cluster-group.md)                                                                                                                                                                                                     |        :x:         |    :white_check_mark:    |
| Apply OS patches                                                                                                                                                                                                                                                                             |        :x:         |           :x:            |
| Pause and resume the cluster                                                                                                                                                                                                                                                                 |        :x:         |           :x:            |
| Use [full](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or [infrastructure cluster profiles](../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) (does not include [EKS hybrid node pools](#eks-hybrid-node-pools)) |        :x:         |           :x:            |
| Download [kubeconfig](../cluster-management/kubeconfig.md) from Palette                                                                                                                                                                                                                      |        :x:         |           :x:            |
| Scale, add, or remove node pools (does not include [EKS hybrid node pools](#eks-hybrid-node-pools))                                                                                                                                                                                          |        :x:         |           :x:            |
| Deploy <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack                                                                                                                                                                                             |        :x:         |           :x:            |

### EKS Hybrid Node Pools

When deploying [EKS hybrid node pools](../public-cloud/aws/eks-hybrid-nodes/create-hybrid-node-pools.md) using imported
clusters, Palette supports managing infrastructure and full cluster profiles. Node management is also supported, as the
Edge hosts are managed by Palette.

## Delete Imported Cluster

When you delete an imported cluster from Palette using the standard
[deletion process](../cluster-management/remove-clusters.md), Palette removes the link to the imported cluster and
removes all Palette dependencies that were installed on the cluster during the import process. However, deleting the
cluster from Palette does not delete the cluster itself. To completely delete the cluster, you must manually delete it
through the hosting infrastructure provider.

## Next Steps

To get started, refer to the [Import a Cluster](cluster-import.md) guide for instructions on how to import an external
cluster into Palette. If you import a cluster in **Full Permission** mode, you can expand on the functionality of your
cluster by [attaching add-on profiles](attach-add-on-profile.md). You can migrate clusters originally imported in
**Read-Only** mode to **Full Permission** mode at any time. Refer to our
[Migrate to Full Permissions](migrate-full-permissions.md) guide for more information.
