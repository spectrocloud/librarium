---
sidebar_label: "Delete a Cluster"
title: "Delete a Cluster"
description: "Learn how to delete a cluster with Local UI."
hide_table_of_contents: false
sidebar_position: 90
tags: ["edge"]
---

You can delete an active cluster using Local UI. Deleting a cluster will return all hosts in the cluster to **Ready**
status. Deleting a cluster does not unlink the linked hosts. If you want to use the hosts that were freed from the
cluster, you must unlink them first. For more information about linking or unlinking hosts, refer to
[Link Hosts](./link-hosts.md).

When you delete a cluster, the host where you performed the delete action from will be the new leader host of the group.
For more information about leader hosts, refer to [Link Hosts](link-hosts.md#leader-hosts).

:::warning

On Edge hosts with an
[`applianceType`](../../edge-configuration/installer-reference.md) of `paletteai`, `vertexai`, `vm-launchpad`,
`vm-launchpad-vertex`, `ai-launchpad`, or `ai-launchpad-vertex`, deleting the cluster also erases the on-appliance
content bundle. Redeploying the cluster requires either re-uploading a content bundle or reinstalling the appliance
with an installer ISO that contains embedded content. Before you delete, make sure the content bundle is saved
somewhere off the appliance. Refer to [Recover a Deleted Cluster](#recover-a-deleted-cluster) for the redeploy flow.

:::

## Prerequisites

- Access to [Local UI](../host-management/access-console.md). Any Operating System user can be used to log in to Local
  UI.

- An active cluster deployed and managed by Local UI.

- (Appliance mode with a VMO `applianceType`) A saved copy of the content bundle you uploaded to this appliance, kept
  somewhere other than the appliance itself. Without it, you cannot re-upload after deletion and must reinstall the
  appliance to redeploy.

## Delete a Cluster

1. Log in to [Local UI](../host-management/access-console.md) on a control plane node where your cluster is deployed.

2. From the left **Main Menu**, click **Cluster**.

3. In the upper-right corner of the **Cluster** page, click **Actions**.

4. In the **drop-down Menu** that appears, click **Delete**.

5. In the pop-up window that appears, click **Confirm**. During the deletion of the cluster, Local UI will become
   unavailable as the hosts reboot after cluster deletion.

   :::info

   In appliance mode with one of the VMO `applianceType` variants, Local UI displays a reminder in the confirmation
   dialog that deletion erases the on-appliance content bundle and directs you to save it off the appliance first if
   you have not already done so.

   :::

## Recover a Deleted Cluster

This section applies to Edge hosts running in appliance mode with an `applianceType` of `paletteai`, `vertexai`,
`vm-launchpad`, `vm-launchpad-vertex`, `ai-launchpad`, or `ai-launchpad-vertex`. In this mode, deleting the cluster
removes the content needed to redeploy, so Local UI blocks the redeploy until content is available again. Local UI also
hides the **Import config** option in the **Create cluster** wizard, because uploading a cluster configuration file is
not a valid recovery path for these appliance types.

To redeploy the cluster, use one of the following paths.

- **Re-upload the content bundle.** From the **Content** page in Local UI, upload the content bundle you used earlier
  on this appliance. For more information, refer to
  [Upload Content Bundle](./upload-content-bundle.md#recover-a-deleted-cluster). Then return to the **Cluster** page
  and create the cluster. Refer to [Create Local Cluster](./create-cluster.md).

- **Reinstall the appliance.** Reinstall the appliance using an Edge installer ISO that contains embedded content and
  a cluster definition. For more information about building an installer ISO with embedded content, refer to
  [Build Content Bundles](../../edgeforge-workflow/palette-canvos/build-content-bundle.md) and the
  [EdgeForge workflow](../../edgeforge-workflow/edgeforge-workflow.md). After the appliance boots, create the cluster.

For Edge hosts in agent mode, or for appliance hosts with an `applianceType` of `palette` or `vertex`, the existing
redeploy options in the **Create cluster** wizard, including **Import config**, remain available.

## Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader of the linked hosts.

2. From the left **Main Menu**, click **Cluster**.

3. Confirm that there is no active cluster and that the cluster has been deleted.
