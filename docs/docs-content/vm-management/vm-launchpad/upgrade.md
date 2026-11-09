---
sidebar_label: "Upgrade VM Launchpad"
title: "Upgrade VM Launchpad"
description:
  "Learn how to upgrade PaletteAI VM Launchpad by uploading a newer content bundle and applying the update from Local
  UI."
hide_table_of_contents: false
sidebar_position: 3
tags: ["vmo", "vm launchpad", "upgrade"]
---

<!-- TODO(DOC-3002): Draft built from internal upgrade evidence (PVM 797 upgrade automation, PVM 1472, appliance QA tickets). Sumit answered most questions on 2026-11-07 and 2026-11-09 in the #vmo-docs thread; the open items are in the TODOs below. Verify every UI label on an appliance before this page goes Ready. -->

To upgrade PaletteAI VM Launchpad, upload a newer content bundle for the same appliance variant, and then apply the
update from the **Configuration** tab of the cluster in Local UI. You do not reinstall the appliance ISO or create a new
cluster profile.

This page covers VM Launchpad appliances. To upgrade the VMO pack on a Palette cluster, refer to
[Upgrade the VMO Pack](../vmo-pack/upgrade-vmo-pack.md). You cannot upgrade from the VMO pack to VM Launchpad in place.
Refer to [Limitations](../vmo-pack/upgrade-vmo-pack.md#limitations).

:::warning

The upgrade reboots the nodes of the cluster one at a time, and Local UI is unavailable while a node reboots. On a
multi-node cluster, KubeVirt handles the running VMs on each node according to their eviction strategy, which live
migrates them to another node by default. VMs that cannot live migrate, such as VMs with GPUs or host devices, and the
VMs on a single-node cluster restart when their node reboots. Refer to
[Strategies](./kubevirt-configuration.md#strategies). Upgrade during a maintenance window.

:::

<!-- TODO(DOC-3002): Sumit (2026-11-09): "VMs will restart after the Host reflash is my understanding." Hedged; confirm with VMO QA before Ready, or keep as is. -->

## Upgrade Notes

Review the following notes before you upgrade. Each note links to the steps for that change. For all changes in a
release, refer to the VM Launchpad entries in the [Release Notes](../../release-notes/release-notes.md).

<!-- TODO(DOC-3002): add the drop eight notes once #12453 merges into this branch, with the drop eight version number: package files and branding images move to the package store (link ./virtual-machines/packages.md#upgrade-considerations), and FIPS Zot moves onto SeaweedFS. -->

- **(Non-FIPS appliances)** An upgrade can stall when both Keycloak database replicas run on the same node. Refer to
  [Appliance Upgrade Stalls When Keycloak Database Replicas Share a Node](./troubleshooting.md#scenario---appliance-upgrade-stalls-when-keycloak-database-replicas-share-a-node).

  <!-- TODO(DOC-3002): Sumit (2026-11-07): the PVM 1292 FIPS stack refactor (CloudNativePG) ships in drop eight. Asked: do FIPS appliances need extra upgrade steps, and can this Keycloak replica stall now happen on FIPS appliances too? If yes, drop "(Non-FIPS appliances)" here. Sumit (2026-11-09) answered only that PVM 1494 and PVM 1292 both go in the drop eight release notes; the two FIPS questions are still open. -->

- **(From a version earlier than 4.10.25)** Non-FIPS appliances reserve more memory and ephemeral storage on each node
  after the upgrade, and the Kubelet restarts once on each node. Check each node before you upgrade. Refer to
  [Check Node Memory Before You Upgrade](./vmo-overcommit-memory-optimization-appliance.md#check-node-memory-before-you-upgrade).

- **(From a version earlier than 4.10.25)** VM Launchpad 4.10.25 includes KubeVirt 1.9.0, which deprecates the
  `HotplugVolumes` feature gate. Refer to
  [Feature Gate Considerations](./kubevirt-configuration.md#feature-gate-considerations).

- **(From a release with the earlier VLAN filtering settings)** `allowedVlans` replaces the earlier VM VLAN range
  settings, and the upgrade removes VM VLANs outside `allowedVlans` from the bridge uplinks. Refer to
  [Upgrade Considerations](./infrastructure/networking.md#upgrade-considerations).

- **(Any upgrade)** An upgrade can change what a built-in role grants. Refer to
  [Built-in Role Maintenance](./access-management/vmo-roles.md#built-in-role-maintenance).

## Prerequisites

- A healthy VM Launchpad cluster, and network access to Local UI on the leader host. Refer to
  [Access Local UI](../../clusters/edge/local-ui/host-management/access-console.md#log-in-to-local-ui).

- The variant of your appliance (FIPS Piraeus, non-FIPS Piraeus, or non-FIPS Portworx). Download the content bundle for
  the same variant that you installed. For a description of each variant, refer to
  [Install VM Launchpad](./install.md#install).

  Local UI does not display the variant by name. To identify it, review the packs of the cluster in Local UI. The
  storage pack is Piraeus or Portworx, and some packs show whether they are FIPS or non-FIPS. If you upload the content
  bundle for a different variant, upload the content bundle for your variant, and then start the update again.

  <!-- TODO(DOC-3002): Sumit (2026-11-07): no explicit variant indicator; a few packs show FIPS or non-FIPS, and the CSI pack is Piraeus or Portworx. Verify on an appliance where Local UI lists the packs and which packs show FIPS, then name the location here. Wrong-variant recovery (PVM 1472) answered 2026-11-09: "just reupload". -->

- Access to [Artifact Studio](https://artifact-studio.spectrocloud.com/).

- An OS boot disk of at least 750 GB on each node, to hold the new content bundle. Refer to
  [Hardware Requirements](./install.md#hardware-requirements).

- A supported upgrade path. You can upgrade from any 4.10 release directly to a later 4.10 release. To upgrade from a
  4.9 release, upgrade to the latest 4.9 release first.

  <!-- TODO(DOC-3002): Sumit (2026-11-09): any 4.10 to 4.10 upgrade is fine. Still open: for a 4.9.x appliance, after the latest 4.9.x, does the next hop go to the latest 4.10 drop or to a specific 4.10 release? (Sumit 2026-11-07 said "4.10.0"; PVM 1188 says 4.9.x straight to KubeVirt 1.9 can crash VMs.) Shubham Rajvanshi or Abirami Subbiah to confirm. -->

- (Recommended) A snapshot of each VM. Rolling back an upgrade is not supported. Refer to
  [Create a Snapshot](./virtual-machines/snapshots.md#create-a-snapshot).

## Upgrade VM Launchpad

:::warning

Do not delete the cluster to upgrade it. On a VM Launchpad appliance, deleting the cluster also erases the content
bundle from the appliance. Refer to
[Recover a Deleted Cluster](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md#recover-a-deleted-cluster).

:::

1. Navigate to [Artifact Studio](https://artifact-studio.spectrocloud.com/).

2. In the **VM Launchpad** section, use the drop-down menu to select the new version and your appliance variant, and
   select **Show Artifacts**.

3. Download the **Content bundle (including Ubuntu)**. You do not need the **Appliance ISO** to upgrade.

4. Upload the content bundle to the leader host with Local UI or the Palette CLI, the same way that you did during the
   installation. Refer to [Upload the Content Bundle](./install.md#upload-content-bundle).

   For a multi-node cluster, the leader host syncs the bundle to the follower hosts. Wait until the **Content** page
   shows that the sync is complete.

5. Log in to Local UI on the leader host.

6. From the left main menu, select **Cluster**, and then select the **Configuration** tab.

   <!-- TODO(DOC-3002): verify the update controls on an appliance. Internal sources describe a green Update button; PaletteAI Inference Launchpad uses an Update drop-down with Review Changes, and its Overview tab shows Update available. -->

7. Select **Update**, and review the incoming values in each section. Expand every section, and do not change any value.
   The update keeps your existing settings, including passwords. Do not generate or upload new certificates.

   Do not change the **Registry Password** during the upgrade. SeaweedFS keeps the old password until it restarts, and
   image pulls and package uploads fail until then. Refer to
   [Image Pulls and Package Uploads Fail After a Registry Password Change](./troubleshooting.md#scenario---image-pulls-and-package-uploads-fail-after-a-registry-password-change).

   <!-- TODO(DOC-3002): Sumit (2026-11-09): "don't upload the certs". Once the update controls are verified on an appliance, name the platform CA setting and its Generate option here (PVM 1472). -->

8. Select **Confirm Changes**, and then select **Update**.

9. Monitor the progress on the **Overview** tab. Each node reboots in turn, and Local UI is unavailable while a node
   reboots. Log in again after each reboot.

   Rolling back an upgrade to the previous version is not supported. If the upgrade fails, contact Spectro Cloud support
   at [support@spectrocloud.com](mailto:support@spectrocloud.com) for help to complete the upgrade.

## Validate

1. Log in to Local UI on the leader host.

2. On the **Overview** tab, confirm that the cluster shows the **Running** and **Healthy** statuses and that every node
   is ready.

3. Confirm that the **Applications** panel lists the new VM Launchpad version and that `virtual-machine-orchestrator`
   shows the **Running** status.

   <!-- TODO(DOC-3002): verify the Validate labels (Running, Healthy, Applications panel) on an appliance. -->

4. Log in to VM Launchpad, and confirm that your VMs, VM templates, and DataVolumes are present. Refer to
   [Verify](./install.md#verify).

5. If you upgraded from a version earlier than 4.10.25, check each node. Refer to
   [Verify Node Memory After You Upgrade](./vmo-overcommit-memory-optimization-appliance.md#verify-node-memory-after-you-upgrade).

## Next Steps

If the upgrade does not complete, refer to [Troubleshooting](./troubleshooting.md). To review what changed in each
release, refer to the VM Launchpad entries in the [Release Notes](../../release-notes/release-notes.md).
