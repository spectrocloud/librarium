---
sidebar_label: "Edge Cluster Upgrade Behavior"
title: "Edge Cluster Upgrade Behavior"
description: "Learn about how Palette Edge responds to upgrades of the cluster profile."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge", "architecture"]
---

When you update an active Edge cluster's profile, Palette will upgrade the active cluster to the latest version of the
profile. Depending on the nature of the change, implementing an upgrade might involve repaving a cluster, rebooting a
cluster, restarting services, or doing nothing. For more information about cluster repaves, refer to
[Repave Behavior and Configurations](/clusters/cluster-management/node-pool.md#repave-behavior-and-configuration). For
more information about how to update a cluster profile, refer to
[Update a Cluster](/clusters/cluster-management/cluster-updates.md).

:::warning

- If a cluster's Kubernetes service is down, updates to the cluster's profile will not get applied to the cluster. You
  must fix the issue impacting the Kubernetes service first. Once the Kubernetes service is back to being operational,
  the Palette agent will apply the updates from the cluster profile to the cluster.

:::

## Known Issues

- For RKE2 clusters, updates to the `stages.*` section in the Operating System (OS) and the Kubernetes pack of the
  cluster profile will trigger a repave instead of a reboot. The only exception is changes to the `stages.reconcile.*`
  section, which will behave as expected and trigger a configuration reload.

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

## Network Layer

Changes made to the Container Network Interface (CNI) pack typically do not result in cluster repave or reboot, and can
be applied by restarting the related networking services.

:::warning

Do not change to a different CNI pack after provisioning a cluster. You can make changes to the existing CNI pack, but
if you want to use a different CNI pack altogether, we recommend you create another cluster.

:::

## Storage Layer

Changes made to the storage layer typically do not result in cluster repave or reboot and can be applied by restarting
the related storage services.
