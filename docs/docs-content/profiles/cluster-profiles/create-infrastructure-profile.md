---
sidebar_label: "Create an Infrastructure Profile"
title: "Create an Infrastructure Profile"
description: "Learn how to create an infrastructure profile in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles"]
---


Create an infrastructure profile by adding infrastructure layers (OS, Kubernetes, Network, and Storage).

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create an infrastructure profile. Refer to the [Cluster Profile](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin) permissions documentation for more information about roles and permissions.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. 

4. Fill out the following input values and ensure you select **Infrastructure** for the type. Click on **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Name**| The name of the profile. |
  | **Version**| Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
  |**Description**| Use the description to provide context about the profile.|
  | **Type**| **Infrastructure** |
  | **Tags**| Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`.|

  To learn more about creating multiple profile versions, check out [Version a Cluster Profile](../cluster-profiles/version-cluster-profile.md).

5. Select the infrastructure provider or managed Kubernetes for your environment and click **Next**.
  
6. Configure the infrastructure layers by selecting the registry, pack name, and pack version for each layer. Click **Next** to continue. 

| **Layer** | **Description** |
  |----|----|
  | **Operating System**| Select an OS to use with your Kubernetes clusters. Use the **Bring Your Own OS (BYO-OS)** if you want to upload your own OS images.|  
  |**Kubernetes**| The Kubernetes pack to use with the cluster. Palette eXtended Kubernetes (PXK) allows you to manage OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured - you can use Palette as an IDP without having to configure a third-party IDP. Refer to [Configure OIDC Identity Provider](../../integrations/kubernetes.md#configure-oidc-identity-provider) for more information. |
  | **Network**| Select a network pack to use with your clusters. |
  | **Storage**| Select a storage pack to use with your clusters. |


  As you add each layer, Palette displays the manifest in the editor at right. You can edit the manifest or add a new one. 

7. Click on **Confirm**. Palette displays the profile stack with your specified pack layers.

8. Click on **Next** to review the profile.

9. Click on **Finish Configuration** to create the cluster profile.

You now have an infrastructure cluster profile. You can reuse the profile and apply it to several clusters. Refer to the [Update Cluster Profile](update-cluster-profile.md) guide for more information about update operations.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.





