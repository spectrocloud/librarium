---
sidebar_label: "Lock Profile Updates"
title: "Lock Profile Updates"
description:
  "Hold cluster profile updates on centrally managed Edge Native clusters until an operator at the device releases them
  from Local UI."
hide_table_of_contents: false
sidebar_position: 45
tags: ["edge"]
---

The update lock holds cluster profile updates on the Edge hosts of a centrally managed Edge Native cluster until an
operator at the device releases them. When you turn on **Lock Profile Updates**, you can still save cluster profile
changes in Palette. However, the Edge hosts do not apply them until an operator reviews and releases the update in Local
UI or through the Edge Management API. Each release lets one update through, and then the lock engages again.

Use the update lock when an operator at the site must approve changes to a cluster, for example, on devices that must
not change while they are in use.

## How the Update Lock Works

The following table lists the changes that the update lock holds.

| **Change**                                                                      | **Held by the Update Lock** |
| ------------------------------------------------------------------------------- | --------------------------- |
| Cluster profile version changes                                                 | :white_check_mark:          |
| Packs added to or removed from the cluster profile                              | :white_check_mark:          |
| Changes to the version, tag, digest, values, parameters, or manifests of a pack | :white_check_mark:          |
| Kubernetes and OS upgrades made through the cluster profile                     | :white_check_mark:          |
| Node pool changes, such as adding, removing, or scaling nodes                   | :x:                         |
| Changes to SSH keys and Network Time Protocol (NTP) servers                     | :x:                         |
| Palette agent upgrades                                                          | :x:                         |
| Cluster deletion                                                                | :x:                         |

Palette accepts every change and does not block **Updates** or **Review & Save** while the lock is engaged. The Edge
hosts hold the update instead. While an update is held, the cluster page in Palette displays the **Update pending,
awaiting local approval** banner. You cannot release the lock from Palette, but turning off the lock releases any held
update immediately. Refer to [Disable the Update Lock](#disable-the-update-lock).

The update lock does not hold the initial deployment of the cluster. Palette applies the cluster profile and any changes
that you make while you create the cluster, even when the lock is enabled. When you turn on the lock for an existing
cluster, the lock adopts the cluster profile that the cluster is running, so it does not hold that profile.

Each release lets one update through: the first update that reaches the cluster after the release, which is the held
update when one is waiting. After the Palette agent applies the released update, the lock engages again within about 1
minute, even while the rollout continues. A later update stays held until an operator releases it, even if it arrives
before the lock engages again.

The update lock does not affect Palette agent upgrades. To also control agent upgrades, use the update lock together
with [Pause Agent Upgrades](../../cluster-management/platform-settings/pause-platform-upgrades.md).

## Limitations

- The update lock is available only for centrally managed Edge Native clusters. Locally managed and airgapped clusters
  do not support it.

- The update lock guards against unplanned updates. It is not an access control. Any OS user who can log in to Local UI
  on a control plane host of the cluster can release or re-engage the lock. Anyone with permission to update the cluster
  in Palette can turn off the lock, which releases any held update.

- The update lock applies to the whole cluster. Releasing it on any control plane host releases it for the cluster.
  Local UI shows the lock only on control plane hosts.

- Palette records turning the lock on or off as a generic cloud configuration update in its audit logs.

## Prerequisites

- A centrally managed Edge Native cluster, or the Edge hosts for a new one. Every Edge host of the cluster must run the
  Palette agent version that ships with Palette 4.10.b or later. An older agent ignores the setting and does not report
  an error.

- The `cluster.update` permission in Palette to turn the update lock on or off.

- An OS user account on a control plane host of the cluster and access to its Local UI, to review and release held
  updates. Refer to [Access Local UI](../local-ui/host-management/access-console.md).

## Enable the Update Lock

You can enable the update lock when you create a cluster or on an existing cluster.

<Tabs groupId="cluster-state">

<TabItem label="New Cluster" value="new">

1. Follow the steps in [Create Cluster Definition](../site-deployment/cluster-deployment.md) until you reach the
   **Cluster Settings** step.

2. Select **Lock Profile Updates**, and turn on the **Lock Profile Updates** toggle.

3. Finish creating the cluster. The lock engages after the Edge hosts first reconcile the cluster.

</TabItem>

<TabItem label="Existing Cluster" value="existing">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select your cluster.

3. Select **Settings** > **Cluster Settings**.

4. Select **Lock Profile Updates**, and turn on the **Lock Profile Updates** toggle.

   Palette saves the change when you turn on the toggle. The lock adopts the cluster profile that the cluster is running
   and holds later updates.

</TabItem>

</Tabs>

## Validate

1. Log in to Local UI on a control plane host of the cluster.

2. From the left main menu, select **Cluster**.

3. On the **Overview** tab, confirm that the **Update lock** card shows the **Engaged** status.

4. In Palette, change the cluster profile of the cluster, for example, by updating a pack value, and save the change.
   Releasing the update in step 6 applies this change to the cluster, so use a change that you intend to apply.

5. Confirm that the cluster page in Palette displays the **Update pending, awaiting local approval** banner, and that
   the **Update lock** card in Local UI shows a **Waiting since** time.

6. Release the test update. Refer to [Review and Release a Held Update](#review-and-release-a-held-update).

## Review and Release a Held Update

When an update is held, release it from Local UI on a control plane host of the cluster. Release the lock only when an
update is waiting. If you release the lock with no update waiting,
[re-engage the lock manually](#re-engage-the-lock-manually). To release or re-engage the lock without Local UI, use the
Edge Management API on a control plane host. Refer to [Edge Management API](/api/introduction/#edge-management-api).

1. Log in to Local UI on a control plane host of the cluster.

2. From the left main menu, select **Cluster**.

3. On the **Overview** tab, locate the **Update lock** card. While an update is held, the card shows the **Engaged**
   status and the **Waiting since** time.

4. Select **Review and release**.

   The **Review and release** dialog lists the pending **Application pack changes**. Each change is labeled **New
   pack**, **Pack removed**, **Version changed**, or **Values changed**. The dialog lists manifest files as
   `<file> (added)`, `<file> (changed)`, or `<file> (removed)`.

5. Review the changes, and then select **Confirm and release**.

   The card shows the **Released** status, and its **Update** field shows **Applying now**. After the Palette agent
   applies the update, the lock engages again.

## Re-Engage the Lock Manually

On the **Update lock** card in Local UI, select **Re-engage lock now**. Local UI engages the lock immediately, without a
confirmation.

## Disable the Update Lock

:::warning

Turning off the update lock releases any held update immediately, without a confirmation and without any action at the
device. The Edge hosts apply the held update.

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select your cluster.

3. Select **Settings** > **Cluster Settings**.

4. Select **Lock Profile Updates**, and turn off the **Lock Profile Updates** toggle.

   Palette saves the change when you turn off the toggle. If you turn the lock on again later, it adopts the cluster
   profile that the cluster is running at that time.
