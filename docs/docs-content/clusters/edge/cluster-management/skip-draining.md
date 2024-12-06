---
sidebar_label: "Skip Node Draining During Upgrades"
title: "Skip Node Draining During Upgrades"
description: "Learn how to skip node draining during cluster upgrades."
icon: ""
sidebar_position: 40
hide_table_of_contents: false
tags: ["edge"]
---

When you apply a new cluster profile to your cluster with changes that require node reboot or repave, the cluster may
drain each node as it updates the pods on that node. This is helpful in multi-node clusters as it allows you to avoid or
minimize application downtime. For more information what changes will cause reboot or repave, refer to
[Edge Cluster Upgrade Behavior](../cluster-management/upgrade-behavior.md).

However, the benefits of draining a node in a single-node cluster are minimal because there are no other nodes to
schedule the workloads onto. In addition, if system-critical workloads are drained, the cluster may get stuck in an
unmanageable state. From Palette 4.5.12 onwards, Palette will only drain multi-node edge clusters by default. You can
configure draining behavior via the BYOS Edge OS layer of the cluster profile. These configurations will apply to both
appliance mode and [agent mode](../../../deployment-modes/agent-mode/agent-mode.md) deployments.

## Prerequisites

- A Palette account. If you do not have one, you can register an account on [Palette](https://console.spectrocloud.com).

- An Edge-type cluster profile.

- An host registered with your Palette account or an existing Edge-type cluster. For more information, refer to
  [Edge Host Registration](../site-deployment/site-installation/edge-host-registration.md) and
  [Deployment](../site-deployment/site-deployment.md).

- Palette 4.5.12 or higher, with Stylus agent 4.5.11 or higher

## Skip Node Draining During Upgrades or Repaves

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Profiles**.

3. Select the cluster profile you use to provision the clusters for which you want to skip node draining during upgrades
   or repaves.

4. Select the BYOS Edge OS layer of your profile, and configure the `pack.drain` section.

   ```yaml {2,3}
   pack:
     drain:
       drainPods: false
   ```

   The following table provides a brief description of the parameters.

   | Parameter     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Default |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
   | `drainPods`   | Controls the node drain behavior during a cluster upgrade. `true` means nodes will always be drained. `false` means nodes will never be drained. `auto` means nodes will only be drained for multi-node clusters, while single-node clusters will not drain nodes during an upgrade.                                                                                                                                                                                                                                                                                                                   | `auto`  |
   | `podSelector` | This optional parameter provides control over which pods get drained during the drain process. Both positive and negative matches can be used. Typically, only negative matches are configured to drain all pods on the node except for specific ones. Any value configured here will be added to the system podSelector that protects critical system pods. <br /> <br /> The system podSelector protects pods with any of the following labels against draining: `upgrade.cattle.io/plan=control-plan`,`upgrade.cattle.io/plan=worker-plan`,`app=spectro`,`app=spectro-proxy` ,`app=palette-webhook` | None    |

   :::warning

   In single-node clusters, disabling node draining means normal workloads and the upgrade process happen in parallel.
   This will increase memory usage, and may cause your node to become unresponsive if your host is memory-constrained.

   In such cases, you may set the `pack.drain.drainPods` parameter to `true`, and set `pack.drain.disableEviction` to
   `true`. This will prevent the drain process from hanging indefinitely due to `PodDisruptionBudget` constraints, while
   the default `podSelector` will protect most critical system pods.

   :::

5. Create a new cluster with the updated cluster profile, or update an existing cluster to use the new cluster profile.
   For more information, refer to [Create a Cluster](../site-deployment/cluster-deployment.md) or
   [Update a Cluster](../../cluster-management/cluster-updates.md).

   For existing clusters, when you update the profile without changing the `system.uri` parameter, these changes alone
   will take effect and will not trigger any reboot or repave. The next time you make a change to the cluster profile
   that will trigger a repave or reboot, the new draining settings will apply. For more information about cluster
   behavior during upgrades, refer to [Edge Cluster Upgrade Behavior](../cluster-management/upgrade-behavior.md).

## Validate

1. Update the cluster to use a new version of a cluster profile. Ensure that your change will trigger a reboot or
   repave. For more information, refer to [Update a Cluster](../../cluster-management/cluster-updates.md) and
   [Edge Cluster Upgrade Behavior](../cluster-management/upgrade-behavior.md).

2. After the upgrade is completed, use `kubectl logs` to check on a node for which you skipped pod draining. Confirm
   that no messages that look like `Evicting pod <pod-name> as part of upgrade plan` are displayed. The absence of such
   messages means that the pods were not drained during the upgrade.
