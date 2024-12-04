---
sidebar_label: "Skip Node Draining During Upgrades"
title: "Skip Node Draining During Upgrades"
description: "Learn how to skip node draining during cluster upgrades. "
icon: ""
sidebar_position: 40
hide_table_of_contents: false
tags: ["edge"]
---

When you apply a new cluster profile to your cluster, depending on your settings, the cluster may drain each node as it
updates the pods on that node. This is helpful in multi-node clusters as it allow you to avoid or minimize application
downtime.

However, the benefits of draining a node in a single-node cluster are minimal because there are no other nodes to
schedule the workloads onto. In addition, if system-critical workloads are drained, the cluster may get stuck in an
unmanageable state. You can configure your cluster to skip node draining to avoid such outcomes. These configurations
will apply to both appliance mode and [agent mode](../../../deployment-modes/agent-mode/agent-mode.md) deployments.

## Prerequisites

- A Palette account. If you do not have one, you can register an account on [Palette](https://console.spectrocloud.com).

- An Edge-type cluster profile.

- An host registered with your Palette account or an existing Edge-type cluster. For more information, refer to
  [Edge Host Registration](../site-deployment/site-installation/edge-host-registration.md) and
  [Deployment](../site-deployment/site-deployment.md).

## Skip Node Draining During Upgrades

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Profiles**.

3. Select the cluster profile you use to provision the clusters for which you want to skip node draining during
   upgrades.

4. Select the operating system layer of your profile, and add the following lines.

   ```yaml {2,3}
   pack:
     drainPods: false
     podSelector: upgrade.cattle.io/plan!=control-plan,upgrade.cattle.io/plan!=worker-plan,app!=spectro,app!=spectro-proxy,app!=palette-webhook
   ```

   The following table provides a brief description of the parameters.

   | Parameter     | Description                                                                                                                                                                                                                                                                 | Default                                                                                                                         |
   | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
   | `drainPods`   | Controls the node drain behavior during a cluster upgrade. `true` means nodes will be drained. `false` means nodes will not be drained. `auto` means nodes will only be drained for multi-node clusters, while single-node clusters will not drain nodes during an upgrade. | `auto`                                                                                                                          |
   | `podSelector` | If `drainPods` is set to `true` for either single-node or multi-node clusters, or set to `auto` for multi-node clusters, only pods matching the selectors will be drained. The default value avoids draining pods related to planning, or any critical Palette workloads.   | `upgrade.cattle.io/plan!=control-plan,upgrade.cattle.io/plan!=worker-plan,app!=spectro,app!=spectro-proxy,app!=palette-webhook` |

   :::warning

   In single-node clusters, disabling node draining means normal workloads and the upgrade process happen in parallel.
   This will increase memory usage, and may cause problems if your host is memory-constrained.

   In such cases, you may set the `pack.drainPods` parameter to `true`, and set `pack.disableEviction` to `true`. This
   will prevent the drain process from hanging indefinitely due to `PodDisruptionBudget` constraints, while the default
   `podSelector` will protect most critical pods.

   :::

5. Create a new cluster with the updated cluster profile, or update an existing cluster to use the new cluster profile.
   For more information, refer to [Create a Cluster](../site-deployment/cluster-deployment.md) or
   [Update a Cluster](../../cluster-management/cluster-updates.md).

   For existing clusters, when you update the profile without changing the `system.uri` parameter, these changes alone
   will take effect and will not trigger any reboot or repave. The next time you made a change to the cluster profile
   that will trigger a repave or reboot, the new draining settings will apply. For more information about cluster
   behavior during upgrades, refer to [Edge Cluster Upgrade Behavior](../cluster-management/upgrade-behavior.md).

## Validate

1. Update the cluster to use a new version of a cluster profile. Ensure that your change will trigger a reboot or
   repave. For more information, refer to [Update a Cluster](../../cluster-management/cluster-updates.md) and
   [Edge Cluster Upgrade Behavior](../cluster-management/upgrade-behavior.md).

2. After the upgrade is completed, use `kubectl logs` to check on a pod for which you skipped pod draining. Confirm that
   you do not see any messages that look like `Evicting pod <pod-name> as part of upgrade plan`. The absence of such
   messages means that the pods were not drained during the upgrade.
