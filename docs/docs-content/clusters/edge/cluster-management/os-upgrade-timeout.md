---
sidebar_label: "Configure OS Upgrade Timeout"
title: "Configure the OS Upgrade Timeout"
description:
  "Learn how to change how long each operating system upgrade attempt can run on an Edge host before the upgrade is
  retried."
hide_table_of_contents: false
sidebar_position: 42
tags: ["edge"]
---

When you upgrade the OS of an existing Edge cluster, each upgrade attempt on an Edge host has a time limit. The default
limit is 45 minutes. In appliance mode, an attempt includes the download of the new provider image, so Edge hosts with
slow network connections might need more time. If an attempt does not finish in time, the upgrade is retried on that
Edge host later.

To change the limit, set the `system.upgradeTimeoutMinutes` option in the OS layer of the cluster profile. The option
applies to both appliance mode and [agent mode](../../../deployment-modes/agent-mode/agent-mode.md) deployments.

## How the Upgrade Timeout Works

- The limit applies to each upgrade attempt on an Edge host, not to the upgrade of the whole cluster.

- The limit applies to OS upgrades of control plane and worker nodes in existing clusters. It does not apply when you
  create a cluster.

- When an attempt times out, the upgrade is retried on that Edge host after 1 hour. The wait doubles after each attempt
  that times out, up to 24 hours, and the retries continue until an attempt succeeds.

- Palette does not show that an attempt timed out or that a retry is pending. In Local UI, while an Edge host waits for
  its next attempt, an **OS upgrade failed** banner appears on the **Edge Host** page and on the **Overview** tab of the
  **Cluster** page, and the OS of the Edge host is labeled **Upgrade failed**. Local UI does not show when the next
  attempt starts. The banner clears when an attempt succeeds.

- The limit is read when an OS upgrade starts. A new value applies to the next OS upgrade, not to an upgrade that is
  already running or waiting for a retry. To recover from an upgrade that keeps timing out, improve the network
  connection of the Edge host, or wait for the next retry.

- Changing only `system.upgradeTimeoutMinutes` does not trigger a repave, reboot, or service restart. Refer to
  [Edge Cluster Upgrade Behavior](./upgrade-behavior.md#os-layer).

## Prerequisites

- A Palette account with permission to update cluster profiles and clusters.

- An Edge cluster profile, or an existing Edge cluster and the cluster profile that it uses.

- Every Edge host of the cluster must run the Palette agent version that ships with Palette 4.10.b or later. Earlier
  versions of the agent ignore `system.upgradeTimeoutMinutes`.

- _(Optional)_ Access to the cluster with kubectl, to check the limit that an OS upgrade uses. Refer to
  [Access Cluster with CLI](../../cluster-management/palette-webctl.md).

## Configure the Upgrade Timeout

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select the cluster profile of the clusters whose upgrade timeout you want to change, and create a new version of it.
   Refer to
   [Version a Cluster Profile](../../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

4. In the new cluster profile version, select the OS layer.

5. In the `options` section, add the `system.upgradeTimeoutMinutes` option, and set it to the number of minutes that
   each upgrade attempt can run.

   ```yaml {3}
   options:
     system.uri: "<existing-value>"
     system.upgradeTimeoutMinutes: 90
   ```

   The `<existing-value>` placeholder stands for the current value of `system.uri`. Do not change it.

   | Parameter                      | Description                                                                                                                                                                                                                 | Default |
   | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
   | `system.upgradeTimeoutMinutes` | The number of minutes that each OS upgrade attempt can run on an Edge host. Enter a whole number from `1` to `4320` (3 days). If the value is zero, negative, a decimal, text, or greater than `4320`, the default applies. | `45`    |

6. Select **Confirm Updates**, and then select **Save Changes**.

7. Apply the new cluster profile version to your clusters. The new limit applies to the next OS upgrade of each cluster.

   - To deploy a new cluster, refer to [Create Cluster Definition](../site-deployment/cluster-deployment.md).

   - To update a centrally managed cluster, refer to [Update a Cluster](../../cluster-management/cluster-updates.md).

   - To update a locally managed cluster, upload the new cluster profile version in Local UI. Refer to
     [Update Local Cluster](../local-ui/cluster-management/update-cluster.md).

## Validate

Steps 1 through 4 apply to centrally managed clusters. For a locally managed cluster, use steps 5 and 6.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select your cluster.

3. Select the **Profile** tab, and then select the OS layer.

4. Confirm that the `options` section shows `system.upgradeTimeoutMinutes` with the value that you set.

5. _(Optional)_ After the next OS upgrade of the cluster starts, issue the following commands to display the limit that
   the upgrade uses. Replace `<path-to-kubeconfig>` with the path to the kubeconfig file of the cluster.

   ```bash
   export KUBECONFIG=<path-to-kubeconfig>
   kubectl get spectrosystemtasks --all-namespaces \
     --output custom-columns='NAME:.metadata.name,DEADLINE_SECONDS:.metadata.annotations.spectrocloud\.com/job-active-deadline-seconds'
   ```

6. Confirm that the `DEADLINE_SECONDS` column shows the limit in seconds for the `control-plan` task, and for the
   `worker-plan` task if the cluster has worker nodes. For example, a limit of 90 minutes displays as `5400`.
