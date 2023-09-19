---
sidebar_label: "Create an Infrastructure Profile"
title: "Create an Infrastructure Profile"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles"]
---


Create an Infrastructure profile by adding infrastructure layers (OS, Kubernetes, Network, and Storage).

## Prerequisites

There are no prerequisites. <<< OR >>> Your Palette account role must have the clusterProfile.create permission to create an Add-on cluster profile. Refer to the Cluster Profile permissions documentation for more information about roles and permissions.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. 

4. Fill out the following input values and ensure you select **Infrastructure** for the type. Click on **Next** to continue.

  | **Field** | **Description** |
  |----|----|
  | **Name**| The name of the profile. |
  |**Description**| Use the description to provide context about the profile. |
  | **Version**| Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
  | **Type**| **Infrastructure** |
  | **Tags**| Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`.  |

To learn more about creating multiple profile versions, check out [Cluster Profile Versioning](/profiles/cluster-profiles/cluster-profile-versioning).

5. Select the infrastructure provider or managed Kubernetes for your environment and click **Next**.
  
6. Configure the core layers by selecting the registry, pack name, and pack version for each layer. Click **Next** to continue. 

| **Layer** | **Description** |
  |----|----|
  | **Operating System**| Select an OS to use with your Kubernetes clusters. Use the **Bring Your Own OS (BYO-OS)** if you want to upload your own OS images.|  
|**Kubernetes**| The Kubernetes pack to use with the cluster. Palette eXtended Kubernetes (PXK) allows you to manage OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured - you cana use Palette as an IDP without having to configure a third-party IDP. [Link] |
  | **Network**| Select a network pack to use with your clusters. |
  | **Storage**| Select a storage pack to use with your clusters. |


  As you add each layer, Palette displays the manifest in the editor at right. You can edit the manifest or add a new one. 

7. Click on **Confirm**. Palette displays the profile stack with your specified pack layers.

8. Click on **Next** to review the profile.

9. Click on **Finish Configuration** to create the cluster profile.

You now have an infrastructure cluster profile. You can reuse the profile and apply it to several clusters. You can also update the profile and decide which clusters to apply the new version to. Refer to the [Update Cluster Profile](/profiles/cluster-profiles/update-cluster-profile) guide for more information about update operations.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.





