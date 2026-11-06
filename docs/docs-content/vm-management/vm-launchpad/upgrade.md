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

<!-- TODO(DOC-3002): Draft built from internal upgrade evidence (PVM 797 upgrade automation, PVM 1472, appliance QA tickets). Confirm with Sumit Tiwari and Rob Eckhardt, and verify every UI label on an appliance, before this page goes Ready. -->

To upgrade PaletteAI VM Launchpad, upload a newer content bundle for the same appliance variant, and then apply the
update from the **Configuration** tab of the cluster in Local UI. You do not reinstall the appliance ISO or create a new
cluster profile.

This page covers VM Launchpad appliances. To upgrade the VMO pack on a Palette cluster, refer to
[Upgrade the VMO Pack](../vmo-pack/upgrade-vmo-pack.md). You cannot upgrade from the VMO pack to VM Launchpad in place.
Refer to [Limitations](../vmo-pack/upgrade-vmo-pack.md#limitations).

:::warning

The upgrade reboots the nodes of the cluster one at a time, and Local UI is unavailable while a node reboots. Upgrade
during a maintenance window.

:::

<!-- TODO(DOC-3002): Q3 for Sumit and Rob: what happens to running VMs while a node reboots (live migration, VMs that cannot migrate such as GPU or host-device VMs, single-node appliances), and whether to stop any VMs first. -->

## Upgrade Notes

Review the following notes before you upgrade. Each note links to the steps for that change. For all changes in a
release, refer to the VM Launchpad entries in the [Release Notes](../../release-notes/release-notes.md).

<!-- TODO(DOC-3002): add the drop eight notes once #12453 merges into this branch, with the drop eight version number: package files and branding images move to the package store (link ./virtual-machines/packages.md#upgrade-considerations), and FIPS Zot moves onto SeaweedFS. -->

- **(Non-FIPS appliances)** An upgrade can stall when both Keycloak database replicas run on the same node. Refer to
  [Appliance Upgrade Stalls When Keycloak Database Replicas Share a Node](./troubleshooting.md#scenario---appliance-upgrade-stalls-when-keycloak-database-replicas-share-a-node).

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

  <!-- TODO(DOC-3002): Q2 for Sumit and Rob: where Local UI shows the installed variant, and the supported recovery after an upload of the wrong variant (PVM 1472). -->

- Access to [Artifact Studio](https://artifact-studio.spectrocloud.com/).

- Enough free disk space on each node to store the new content bundle.

  <!-- TODO(DOC-3002): Q3 for Sumit and Rob: free-space guidance (PVM 1425 saw about three times the bundle size used on the receiving node) and whether old bundles can be removed. -->

- A supported upgrade path from the version that you run.

  <!-- TODO(DOC-3002): Q1 for Sumit and Rob: can customers skip drops, what is the oldest version that can upgrade directly, and do 4.9.x appliances need an intermediate stop (PVM 1188)? -->

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
   The update keeps your existing settings, including passwords.

   Do not change the **Registry Password** during the upgrade. SeaweedFS keeps the old password until it restarts, and
   image pulls and package uploads fail until then. Refer to
   [Image Pulls and Package Uploads Fail After a Registry Password Change](./troubleshooting.md#scenario---image-pulls-and-package-uploads-fail-after-a-registry-password-change).

   <!-- TODO(DOC-3002): Q2 for Sumit and Rob: confirm that customers must not regenerate the platform CA during an upgrade (PVM 1472). -->

8. Select **Confirm Changes**, and then select **Update**.

9. Monitor the progress on the **Overview** tab. Each node reboots in turn, and Local UI is unavailable while a node
   reboots. Log in again after each reboot.

   <!-- TODO(DOC-3002): Q4 for Sumit and Rob: what to do if the update fails or a node rolls back, and what to back up before the upgrade. -->

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

<!-- TODO(DOC-3002): Q5 for Sumit and Rob: PVM 1494 (upgraded clusters keep the KubeVirt and CDI CRD schema from their first install). Add a post-upgrade check here if the fix has not shipped. -->

## Next Steps

If the upgrade does not complete, refer to [Troubleshooting](./troubleshooting.md). To review what changed in each
release, refer to the VM Launchpad entries in the [Release Notes](../../release-notes/release-notes.md).
