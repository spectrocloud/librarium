---
sidebar_label: "Update a Cluster"
title: "Update a Cluster"
description: "Guide to updating a cluster in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management"]
---

Palette allows you to update active clusters. You can update any layer of a cluster, including all infrastructure layers
and add-on layers. Depending on the nature of the update, a cluster update could trigger different cluster repave
operations. For more information, refer to
[Repave Behaviors and Configurations](./node-pool.md#repave-behavior-and-configuration) for non-Edge clusters and
[Edge Cluster Upgrade Behavior](../edge/cluster-management/upgrade-behavior.md) for Edge clusters.

:::info

Palette requires explicit cluster-level approval to initiate repave operations, offering you more control over the
repave schedule and methodology. Refer to
[Repave Behaviors and Configurations](./node-pool.md#repave-behavior-and-configuration) for more information.

:::

## Limitations

:::warning

Once you upgrade your cluster to a new Kubernetes version, you will not be able to downgrade. We recommend that, before
upgrading, you review the information provided in the
[Kubernetes Upgrades](../../integrations/kubernetes-support.md#kubernetes-upgrades) section.

:::

- You cannot update a cluster while its status is still **Provisioning**.

- You cannot change the Container Network Interface (CNI) of an Edge cluster. You must delete and re-create the cluster
  instead. For more information about creating an Edge cluster, refer to
  [Create Cluster Definition](../edge/site-deployment/cluster-deployment.md).

- Avoid skipping minor versions when upgrading the Kubernetes version of a cluster. Refer to the documentation of your
  Kubernetes distribution for upgrade guidance and follow the recommended upgrade paths.

  - For PXK and PXK-E, refer to
    [Upgrade Kubeadm Clusters](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  - For K3s, refer to [K3s Upgrades](https://docs.k3s.io/upgrades#version-specific-caveats)
  - For RKE2, refer to [RKE2 Manual Upgrades](https://docs.rke2.io/upgrades/manual_upgrade)

## Prerequisites

- An active Kubernetes cluster in Palette.

## Update a Cluster

<Tabs groupId="update-method">
<TabItem value="profile-version" label="Use a new cluster profile version">

This is the recommended best practice for updating a cluster in Palette.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Create a new version of the profile you want to update. For more information, refer to
   [Version a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

4. Navigate to the left **Main Menu** and select **Clusters**.

5. Select the cluster you want to update, and navigate to the **Profile** tab of the cluster.

6. Next to the name of the profile, click on the version number and select the new version you just published.

7. Click **Review & Save**. Palette prompts you to preview the change summary.

8. Click **Review changes in Editor**. Palette displays the changes, with the **Current Configuration** on the left and
   the **Pending Configuration** on the right. Review the changes and click **Apply Changes**.

   :::info

   Make sure to preserve any existing cluster profile overrides by using the editor on the right. Otherwise, the pending
   configuration will be applied as indicated.

   :::

   ![Palette Editor that displays changes coming from the profile version update.](/clusters_cluster-management_cluster-updates_preview-profile-ver-changes.webp)

</TabItem>

<TabItem value="update-cluster-profile" label="Update cluster profile">

You can make updates to a profile that is in use by one or more active clusters. Changing a deployed cluster profile
will trigger an update to all clusters using the cluster profile. For more information, refer to
[Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md).

:::warning

We do not recommend updating a currently deployed cluster profile version to push out changes. Instead, we recommend you
create a new profile version, and then upgrade active clusters to the new version. Check out the
[Version a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) for
guidance on creating a new cluster profile version.

:::

</TabItem>

<TabItem value="override-profile-config" label="Override cluster profile configurations">

You can modify the configuration of a deployed cluster without changing the cluster profile itself to update a cluster.

:::warning

We do not recommend updating a currently deployed cluster's profile configurations without updating the profile itself.
Instead, we recommend creating a new profile version, and then upgrade active clusters to the new version. Check out the
[Version a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) for
guidance on creating a new cluster profile version.

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster you want to update, and navigate to the **Profile** tab of the cluster.

4. In the profile tab, make changes to the different layers as appropriate. The changes you make here are specific to
   this cluster only and do not propagate to the cluster profile or other clusters using the same profile.

5. Click **Save** to confirm your changes. Acknowledge the cluster repave warning if necessary.

</TabItem>
</Tabs>

## Validation

You can follow these steps to validate all cluster update approaches.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster you updated, and navigate to the **Profile** tab of the cluster.

4. Confirm that the cluster is now using an updated profile.
