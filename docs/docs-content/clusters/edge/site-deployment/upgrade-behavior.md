---
sidebar_label: "Upgrade Behavior"
title: "Upgrade Behavior"
description: "Learn about how Palette Edge responds to upgrades of the cluster profile."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge", "architecture"]
---

When you update an active Edge cluster's profile, Palette will upgrade the active cluster to the latest version of the
profile. Depending on the nature of the change, implementing an upgrade might involve repaving a cluster, rebooting a
cluster, restarting services, or doing nothing.

## Upgrade Behaviors

There are five ways in which a cluster could respond to an upgrade.

| Upgrade Behavior     | Description                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repave               | Repaves all nodes in the cluster, starting with the control plane.                                                                                      |
| Reboot               | Physically reboots the cluster and all cluster services.                                                                                                |
| Service restart      | Restarts specific Kubernetes services without affecting the whole cluster.                                                                              |
| Configuration reload | Updates the configurations without needing to restart services or the node. This is only triggered when you update `stage.reconcile.*` in the OS layer. |
| No-op                | Acknowledges the update request but does nothing.                                                                                                       |

## Upgrade Behavior By Change Location

Updates in the OS layer or the Kubernetes lay can trigger different upgrade behavior depending on the exact values
changed.

### OS Layer

| Repave                          | Reboot                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Service Restart | No-op                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <li> `options.system.uri` </li> | <li>`stages.rootfs.*`</li> <li>`stages.initramfs.*`</li> <li>`stages.boot.*`</li> <li>`stages.fs.*`</li> <li>`stages.network.*`</li> <li>`stages.after-install.*`</li> <li>`stages.after-install-chroot.*`</li> <li>`stages.after-upgrade.*`</li> <li>`stages.after-upgrade-chroot.*`</li> <li>`stages.after-reset.*`</li> <li>`stages.after-reset-chroot.*`</li> <li>`stages.before-install.*`</li> <li>`stages.before-upgrade.*`</li> <li>`stages.before-reset.*`</li> | None.           | <li>`pack.*`</li> <li>`providerCredentials.*`</li> <li>`options.system.registry`</li> <li>`options.system.repo`</li> <li>`options.system.k8sDistribution`</li> <li>`options.system.osName`</li> <li>`options.system.peVersion`</li> <li>`options.system.customTag`</li> <li>`options.system.osVersion`</li> |

### Kubernetes Layer

<Tabs>
<TabItem label="PXK-E" value="pxk-e">
| Repave | Reboot | Service Restart | No-op |
|--------|--------|-----------------|-------|
| None. | <ul> <li>`stages.rootfs.*`</li> <li>`stages.initramfs.*`</li> <li>`stages.boot.*`</li> <li>`stages.fs.*`</li> <li>`stages.network.*`</li> <li>`stages.after-install.*`</li> <li>`stages.after-install-chroot.*`</li> <li>`stages.after-upgrade.*`</li> <li>`stages.after-upgrade-chroot.*`</li> <li>`stages.after-reset.*`</li> <li>`stages.after-reset-chroot.*`</li> <li>`stages.before-install.*`</li> <li>`stages.before-upgrade.*`</li> <li>`stages.before-reset.*`</li> </ul> | <li> `cluster.*` </li> | <li> `clientConfig.*` </li> <li>`pack.*` </li><li> Any future new keys</li> |

</TabItem>

<TabItem label="K3s" value="k3s">
| Repave | Reboot | Service Restart | No-op |
|--------|--------|-----------------|-------|
| None. | <ul> <li>`stages.rootfs.*`</li> <li>`stages.initramfs.*`</li> <li>`stages.boot.*`</li> <li>`stages.fs.*`</li> <li>`stages.network.*`</li> <li>`stages.after-install.*`</li> <li>`stages.after-install-chroot.*`</li> <li>`stages.after-upgrade.*`</li> <li>`stages.after-upgrade-chroot.*`</li> <li>`stages.after-reset.*`</li> <li>`stages.after-reset-chroot.*`</li> <li>`stages.before-install.*`</li> <li>`stages.before-upgrade.*`</li> <li>`stages.before-reset.*`</li> </ul> | <li> `cluster.*` </li> | <li> `clientConfig.*` </li> <li>`pack.*` </li><li> Any future new keys</li> |

</TabItem>

<TabItem label="RKE2" value="rke2">
| Repave | Reboot | Service Restart | No-op |
|--------|--------|-----------------|-------|
| None. | <ul> <li>`stages.rootfs.*`</li> <li>`stages.initramfs.*`</li> <li>`stages.boot.*`</li> <li>`stages.fs.*`</li> <li>`stages.network.*`</li> <li>`stages.after-install.*`</li> <li>`stages.after-install-chroot.*`</li> <li>`stages.after-upgrade.*`</li> <li>`stages.after-upgrade-chroot.*`</li> <li>`stages.after-reset.*`</li> <li>`stages.after-reset-chroot.*`</li> <li>`stages.before-install.*`</li> <li>`stages.before-upgrade.*`</li> <li>`stages.before-reset.*`</li> </ul> | <li> `cluster.*` </li> | <li> `clientConfig.*` </li> <li>`pack.*` </li><li> Any future new keys</li> |

</TabItem>

</Tabs>
