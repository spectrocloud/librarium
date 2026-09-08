---
sidebar_label: "Update Local Cluster"
title: "Update Local Cluster"
description: "Instructions for updating a locally managed cluster in Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

You can update existing local clusters in a locally managed Edge host from Local UI by uploading a new cluster profile
version. This guide explains how to update an existing cluster in Local UI.

:::info

The **Upload Configuration** flow described on this page is available in agent mode and in appliance mode on Edge hosts
with an [`applianceType`](../../edge-configuration/installer-reference.md) of `palette` or `vertex`. On appliance hosts
with an `applianceType` of `paletteai`, `vertexai`, `vm-launchpad`, `vm-launchpad-vertex`, `ai-launchpad`, or
`ai-launchpad-vertex`, Local UI hides the cluster configuration upload option. To update these appliances, upload a new
content bundle from the [Content](./upload-content-bundle.md) page and redeploy the cluster.

:::

## Prerequisites

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- Credentials to log into Local UI. Any OS user can be used to log in to Local UI.

- A local cluster created in Local UI. For more information, refer to [Create Local Cluster](create-cluster.md).

## Update Local Cluster

1. Log into Local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more information,
   refer to [Access Local UI](../host-management/access-console.md).

2. From the left **Main Menu**, select **Cluster**, and then select the **Configuration** tab.

3. In the upper-right corner, select **Upload Configuration**.

4. In the **Upload Configuration** wizard, browse or drag and drop the new cluster profile version **.tgz** file. Once
   the upload finishes, select **Review Changes**.

   To learn more about how to export a cluster profile and import it during this step, refer to
   [Export Cluster Definition](./export-cluster-definition.md).

5. Local UI displays the **Review Changes** modal, where you can review the update summary and verify all incoming
   changes to the
   [Cluster Profile Variables](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md).
   Your current configuration is displayed on the left, and the incoming changes are displayed on the right.

6. Click each profile variable and review the changes. You can specify values for new profile variables, override the
   incoming default values, or leave the incoming changes as is, depending on your local cluster configuration.

   :::info

   If your current cluster configuration overrides the default profile variable values, Local UI will preserve your
   configuration in case the update introduces new defaults. To use the new default values, click **Use default** in the
   respective profile variable field.

   :::

7. Once all incoming changes have the **Reviewed** status, click **Confirm Changes**.

8. Review all profile variables on the **Configuration** tab to make sure that the cluster configuration matches your
   expectations.

9. In the bottom-left corner, click **Update**.

   :::info

   If you update a cluster with a modified cluster definition and content bundle built on a Palette instance, your
   Palette agent will be updated to match the version of that Palette instance. This may result in an upgrade if the
   instance is newer than your Palette agent, or a downgrade if it is older.

   :::

## Deferred Worker Node Upgrades

On a locally managed cluster that uses Palette eXtended Kubernetes Edge (PXK-E) or Canonical Kubernetes, you can defer
the Kubernetes upgrade of individual worker pools while the control plane advances. Enable the **Skip worker node update
(Optional)** toggle on a worker pool, and an update that raises the Kubernetes version upgrades the control plane and
any pool without the toggle, while pools with the toggle stay at their current version. K3s and RKE2 clusters are not
supported.

This is useful when crossing several Kubernetes minor versions, because it reduces how many times worker nodes repave.

Two constraints apply while the toggle is enabled.

- A pool cannot fall more than three minor Kubernetes versions behind the control plane. An update that would exceed the
  skew is rejected and is not applied to the cluster. Disable the toggle on the affected pools first.

- Scale-up on that pool is rejected, because a new node cannot honor the pool's pinned Kubernetes version. To add
  capacity, create a new worker pool and add Edge hosts to it.

Disabling the toggle repaves the pool to the control plane's Kubernetes version, so make sure you are ready to repave
before you disable it.

For the full behavior, refer to
[Decoupled Control Plane and Worker Node Upgrades](../../cluster-management/upgrade-behavior.md#decoupled-control-plane-and-worker-node-upgrades).

## Validate

1. Log in to Local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Verify that your cluster is in the **Running** status.
