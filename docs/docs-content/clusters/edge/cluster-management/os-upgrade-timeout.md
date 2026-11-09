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

<!-- TODO(DOC-3429): Sources: DOC-3429 ticket description, Kiran Kilingar Nadumane (Slack DM, 2026-11-09), and QA verification on PE 10061 (65-minute limit on a throttled day-2 OS upgrade). -->

When you upgrade the OS of an existing Edge cluster, each upgrade attempt on an Edge host has a time limit. The default
limit is 45 minutes. An attempt includes the download of the new provider image, so Edge hosts with slow network
connections might need more time. If an attempt does not finish in time, the upgrade is retried on that Edge host later.

To change the limit, set the `system.upgradeTimeoutMinutes` option in the OS layer of the cluster profile. The option
applies to both appliance mode and [agent mode](../../../deployment-modes/agent-mode/agent-mode.md) deployments.

## How the Upgrade Timeout Works

- The limit applies to each upgrade attempt on an Edge host, not to the upgrade of the whole cluster.

- The limit applies to OS upgrades of control plane and worker nodes in existing clusters. It does not apply when you
  create a cluster.

- When an attempt times out, the upgrade is retried on that Edge host after 1 hour. The wait doubles after each attempt
  that times out, up to 24 hours, and the retries continue until an attempt succeeds.

- While an Edge host waits for its next attempt, Local UI displays an **Upgrade failed** banner. Local UI does not show
  the pending retry. The banner clears when an attempt succeeds.

- The limit is read when an OS upgrade starts. A new value applies to the next OS upgrade, not to an upgrade that is
  already running or waiting for a retry. To recover from an upgrade that keeps timing out, improve the network
  connection of the Edge host, or wait for the next retry.

- Changing only `system.upgradeTimeoutMinutes` does not trigger a repave, reboot, or service restart. Refer to
  [Edge Cluster Upgrade Behavior](./upgrade-behavior.md#os-layer).

<!-- TODO(DOC-3429): Kiran described the Local UI banner. Ask what Palette shows for a centrally managed cluster while an Edge host waits for a retry, and confirm the exact banner text in Local UI. -->

## Prerequisites

- A Palette account with permission to update cluster profiles and clusters.

- An Edge cluster profile, or an existing Edge cluster and the cluster profile that it uses.

- Every Edge host of the cluster must run the Palette agent version that ships with Palette 4.10.b or later.

<!-- TODO(DOC-3429): Ask Kiran: does an older Palette agent ignore system.upgradeTimeoutMinutes, and what limit does it use? For locally managed clusters, is the option set the same way, in the OS layer of the cluster profile that is uploaded to Local UI? -->

## Configure the Upgrade Timeout

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select the cluster profile of the clusters whose upgrade timeout you want to change.

4. Select the OS layer of the cluster profile.

5. In the `options` section, add the `system.upgradeTimeoutMinutes` parameter, and set it to the number of minutes that
   each upgrade attempt can run.

   ```yaml {3}
   options:
     system.uri: "<existing-value>"
     system.upgradeTimeoutMinutes: 90
   ```

   The `<existing-value>` placeholder stands for the current value of `system.uri`. Do not change it.

   | Parameter                      | Description                                                                                                                                                                                                           | Default |
   | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
   | `system.upgradeTimeoutMinutes` | The number of minutes that each OS upgrade attempt can run on an Edge host. Enter a whole number from 1 to 4320 (3 days). If the value is zero, negative, a decimal, text, or greater than 4320, the default applies. | `45`    |

6. Select **Confirm Updates**, and then select **Save Changes**.

7. Create a new cluster with the cluster profile, or update an existing cluster to use the new cluster profile version.
   Refer to [Create a Cluster](../site-deployment/cluster-deployment.md) or
   [Update a Cluster](../../cluster-management/cluster-updates.md). The new limit applies to the next OS upgrade of the
   cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and select your cluster.

3. Select the **Profile** tab, and then select the OS layer.

4. Confirm that the `options` section shows `system.upgradeTimeoutMinutes` with the value that you set.

<!-- TODO(DOC-3429): Ask Kiran whether the Edge host logs the limit in effect when an OS upgrade starts. If it does, add that check here. -->
