---
sidebar_label: "Edge Cluster Upgrade Behavior"
title: "Edge Cluster Upgrade Behavior"
description: "Learn about how Palette Edge responds to upgrades of the cluster profile."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge", "architecture"]
---

When you update an active Edge cluster's profile, Palette will upgrade the active cluster to the latest version of the
profile. Depending on the nature of the change, implementing an upgrade might involve repaving a cluster, rebooting a
cluster, restarting services, or doing nothing. For more information about cluster repaves, refer to
[Repave Behavior and Configurations](../../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration).
For more information about how to update a cluster profile, refer to
[Update a Cluster](../../../clusters/cluster-management/cluster-updates.md).

:::warning

- If a cluster's Kubernetes service is down, updates to the cluster's profile will not get applied to the cluster. You
  must fix the issue impacting the Kubernetes service first. Once the Kubernetes service is back to being operational,
  the Palette agent will apply the updates from the cluster profile to the cluster.

:::

## Known Issues

- For RKE2 clusters, updates to the `stages.*` section in the Operating System (OS) and the Kubernetes pack of the
  cluster profile will trigger a repave instead of a reboot. The only exception is changes to the `stages.reconcile.*`
  section, which will behave as expected and trigger a configuration reload.

## A/B Partitioning in Upgrades

Edge clusters created with Kairos-based provider images use A/B system partitions to handle upgrades. In an A/B
partitions system, the Edge host retains two bootable partitions: an active partition and a passive partition. In a
normal startup sequence, the bootloader will load the active image. In the event that the active image is not bootable,
the bootloader will load the passive image.

During upgrades, the image that the cluster is upgrading to becomes a transitional image. When the upgrade is
successful, the transitional image becomes the new active image, while the old active image becomes the new passive
image. The old passive image is then discarded.

![Diagram of the A/B Partition upgrade process](/clusters_edge_cluster-management_upgrade-diagram.webp)

## Upgrade Behaviors

A cluster could respond to an upgrade in several ways. The table below lists the potential upgrade behaviors you could
encounter.

| Upgrade Behavior      | Description                                                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repave                | Repaves all nodes in the cluster, starting with the control plane.                                                                                                         |
| Reboot                | Reboots all nodes in the cluster, starting with the control plane.                                                                                                         |
| Service restart       | Restarts specific services in all nodes in the cluster, starting with the control plane.                                                                                   |
| Configuration reload  | Updates the configurations without needing to restart services or the node. This is only triggered when you update `stage.reconcile.*` in the Operating System (OS) layer. |
| No operations (No-op) | Acknowledges the update request but does nothing.                                                                                                                          |

## Upgrade Behavior by Change Location

Updates in the OS or Kubernetes layers can trigger different upgrade behaviors depending on the exact values changed.

### OS Layer

| Repave                 | Reboot                                                                                                                                                                                                                                                                                                                                                                                                                                         | Service Restart | No-op                                                                                                                                                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| - `options.system.uri` | - `stages.rootfs.*` <br/> - `stages.initramfs.*`<br/> - `stages.boot.*`<br/> - `stages.fs.*`<br/> - `stages.network.*`<br/> - `stages.after-install.*`<br/> - `stages.after-install-chroot.*`<br/> - `stages.after-upgrade.*`<br/> - `stages.after-upgrade-chroot.*`<br/> - `stages.after-reset.*`<br/> - `stages.after-reset-chroot.*`<br/> - `stages.before-install.*`<br/> - `stages.before-upgrade.*`<br/> - `stages.before-reset.*` <br/> | None.           | - `pack.*`<br/> - `providerCredentials.*`<br/> - `options.system.registry`<br/> - `options.system.repo`<br/> - `options.system.k8sDistribution`<br/> - `options.system.osName`<br/> - `options.system.peVersion`<br/> - `options.system.customTag`<br/> - `options.system.osVersion` <br/> |

:::warning

Changes to any other parameters that are used by the `options.system.uri` parameter will also trigger a cluster repave.
For example, if your `options.system.uri` parameter is
`{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}`,
changes to `.spectro.pack.edge-native-byoi.options.system.registry` will trigger a cluster repave because it changes the
`options.system.uri` parameter.

:::

### Kubernetes Layer

<Tabs>
<TabItem label="PXK-E" value="pxk-e">
| Repave | Reboot | Service Restart | No-op |
|--------|--------|-----------------|-------|
| None.  | - `stages.rootfs.*`<br/> - `stages.initramfs.*`<br/> - `stages.boot.*`<br/> - `stages.fs.*`<br/> - `stages.network.*`<br/> - `stages.after-install.*`<br/> - `stages.after-install-chroot.*`<br/> - `stages.after-upgrade.*`<br/> - `stages.after-upgrade-chroot.*`<br/> - `stages.after-reset.*`<br/> - `stages.after-reset-chroot.*`<br/> - `stages.before-install.*`<br/> - `stages.before-upgrade.*`<br/> - `stages.before-reset.*` <br/>  | - `cluster.*` <br/> | - `clientConfig.*` <br/> - `pack.*`  |

</TabItem>

<TabItem label="K3s" value="k3s">
| Repave | Reboot | Service Restart | No-op |
|--------|--------|-----------------|-------|
| None.  | - `stages.rootfs.*`<br/> - `stages.initramfs.*`<br/> - `stages.boot.*`<br/> - `stages.fs.*`<br/> - `stages.network.*`<br/> - `stages.after-install.*`<br/> - `stages.after-install-chroot.*`<br/> - `stages.after-upgrade.*`<br/> - `stages.after-upgrade-chroot.*`<br/> - `stages.after-reset.*`<br/> - `stages.after-reset-chroot.*`<br/> - `stages.before-install.*`<br/> - `stages.before-upgrade.*`<br/> - `stages.before-reset.*` <br/>  | - `cluster.*` <br/> | - `clientConfig.*` <br/> - `pack.*`  |

</TabItem>

<TabItem label="RKE2" value="rke2">
| Repave | Reboot | Service Restart | No-op |
|--------|--------|-----------------|-------|
| None.  | - `stages.rootfs.*`<br/> - `stages.initramfs.*`<br/> - `stages.boot.*`<br/> - `stages.fs.*`<br/> - `stages.network.*`<br/> - `stages.after-install.*`<br/> - `stages.after-install-chroot.*`<br/> - `stages.after-upgrade.*`<br/> - `stages.after-upgrade-chroot.*`<br/> - `stages.after-reset.*`<br/> - `stages.after-reset-chroot.*`<br/> - `stages.before-install.*`<br/> - `stages.before-upgrade.*`<br/> - `stages.before-reset.*` <br/>  | - `cluster.*` <br/> | - `clientConfig.*` <br/> - `pack.*`  |

</TabItem>

</Tabs>

### Network Layer

Changes made to the Container Network Interface (CNI) pack typically do not result in cluster repave or reboot, and can
be applied by restarting the related networking services.

:::warning

Do not change to a different CNI pack after provisioning a cluster. You can make changes to the existing CNI pack, but
if you want to use a different CNI pack altogether, we recommend you create another cluster.

:::

### Storage Layer

Changes made to the storage layer typically do not result in cluster repave or reboot and can be applied by restarting
the related storage services.

:::warning

Do not change to a different storage pack after provisioning a cluster. You can make changes to the existing storage
pack, but if you want to use a different storage pack altogether, we recommend you create another cluster.

:::

## Decoupled Control Plane and Worker Node Upgrades

Connected (centrally managed) Edge Native clusters support upgrading the control plane independently from worker pools.
You can enable the **Skip worker node update (Optional)** toggle on individual worker pools to defer their Kubernetes
upgrade while the control plane advances.

:::info

This feature is only available for connected Edge Native clusters. Locally managed Edge clusters are not supported.

:::

When a cluster profile update bumps the Kubernetes version, Palette upgrades the control plane and any worker pools that
do not have **Skip worker node update** enabled. Worker pools with the toggle enabled are skipped and stay at their
current Kubernetes version.

Palette enforces the Kubernetes [N-3 minor version skew](https://kubernetes.io/releases/version-skew-policy/). If
enabling the toggle would cause a worker pool to fall more than three minor versions behind the control plane, Palette
blocks the upgrade.

Scale-up is not permitted while the toggle is enabled. Palette rejects scale-up requests on a pool with the toggle
enabled, whether initiated manually or by the cluster autoscaler. To expand capacity, create a new worker pool and add
Edge hosts to it instead.

### Upgrade a Skipped Worker Pool

To sync the Kubernetes version of a skipped worker pool with the current Kubernetes control plane version, disable the
**Skip worker node update** toggle on that pool.

:::danger

Disabling **Skip worker node update** triggers a repave of the worker pool. Ensure you are ready to repave before
disabling the toggle.

:::

For configuration details, refer to
[Skip Worker Node Update](../../../clusters/cluster-management/node-pool.md#skip-worker-node-update). For step-by-step
instructions to trigger the upgrade, refer to
[Trigger Worker Node Upgrade](../../../clusters/cluster-management/cluster-updates.md#trigger-worker-node-upgrade).
