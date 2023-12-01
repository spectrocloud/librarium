---
sidebar_label: "Update a Cluster"
title: "Update a Cluster"
description: "Guide to updating a cluster in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management"]
---


Palette allows you to update active clusters. You can update any layer of a cluster, including all infrastructure layers and add-on layers. Depending on the nature of the update, a cluster update could trigger different cluster repave operations. For more information, refer to [Repave Behaviors and Configurations](./node-pool.md#repave-behavior-and-configuration).

## Limitations

- You cannot update a cluster while its status is still **Provisioning**. 

## Prerequisites

- An active Kubernetes cluster in Palette. 

## Enablement

### Update a Cluster to Use a Another Cluster Profile Version

This is the recommended best practice for updating a cluster in Palette. 

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Create a new version of the profile you want to update. For more information, refer to [Version a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

4. Navigate to the left **Main Menu** and select **Cluster**. 

5. Select the cluster you want to update, and navigate to the **Profile** tab of the cluster. 

6. Next to the name of the profile, click on the version number and select the new version you just published. 

7. Click **Save**. Depending on the changes you made to the profile, doing so might trigger a cluster repave warning. Click **Continue** to confirm updating the cluster. 


### Update a Cluster Profile without Publishing a New Version

You can make updates to a profile that is in-use by one or more active cluster, and doing so will trigger an update to all clusters that are using the cluster profile. For more information, refer to [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md). 

:::caution
We do not recommend updating a currently deployed cluster profile version to push out changes. Instead, we recommend creating a new profile version, and then upgrade active clusters to the new version. 
:::

### Override Cluster Profile Configurations

You can modify the configuration of a deployed cluster without changing the cluster profile itself to update a cluster. 

:::caution
We do not recommend updating a currently deployed cluster's profile configurations without updating the profile itself. Instead, we recommend creating a new profile version, and then upgrade active clusters to the new version. 
:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**. 

3. Select the cluster you want to update, and navigate to the **Profile** tab of the cluster. 

4. In the profile tab, make changes to the different layers as appropriate. The changes you make here are specific to this cluster only and do not propagate to the cluster profile or other clusters using the same profile. 

5. Click **Save** to confirm your changes. Acknowledge the cluster repave warning if necessary. 

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**. 

3. Select the cluster you updated, and navigate to the **Profile** tab of the cluster. 

4. Confirm that the cluster is now using an updated profile. 