---
sidebar_label: "Create an Add-on Profile"
title: "Create an Add-on Profile"
description: "Learn how to create an add-on profile in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["profiles", "cluster profiles"]
---


Create an add-on profile with special-purpose functionality that you can reuse among multiple clusters. Add-on profiles do not contain infrastructure packs. 

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a full cluster profile. Refer to the [Cluster Profile](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin) permissions documentation for more information about roles and permissions.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. 

4. Fill out the following input values and ensure you select **Add-on** for the type. Click on **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  |**Name**| The name of the profile. |
  |**Version**| Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
  |**Description**| Use the description to provide context about the profile. |
  |**Type**| **Add-on** |
  |**Tags**| Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`.  |

  To learn more about creating multiple profile versions, check out [Version a Cluster Profile](../cluster-profiles/version-cluster-profile.md).

5. Select the type of layer to add to the cluster profile. 

  | **Type** | **Description** |
  |----------|-----------------|
  | **Pack** | A pack is a collection of files and configurations that can be deployed to a cluster to add functionality or customize the cluster's behavior.|
  | **Helm Chart**| You can specify a Helm Chart as a layer in an add-on profile.|
  | **Manifest**| A manifest is a Kubernetes configuration file that describes the desired state of a Kubernetes resource, such as deployment, service, or pod and is used to create or modify that resource in a cluster.|

6. Depending on the add-on type you selected, fill out the required input fields and click on **Confirm & Create**.

  ![A view of the manfiest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.png)

7. If you want to add additional layers, repeat steps five and six. Otherwise, click on **Next** to review the profile.

8. Click on **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile. You can reuse the profile and apply it to several clusters. Refer to the [Update Cluster Profile](update-cluster-profile.md) guide for more information about update operations.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.
