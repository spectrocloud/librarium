---
sidebar_label: "Create a Full Profile"
title: "Create a Full Profile"
description: "Learn how to create a full profile in Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["profiles", "cluster profiles"]
---


Create a full profile by adding infrastructure layers (OS, Kubernetes, Network, and Storage) and any add-on layers to add functionality to your clusters.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the [Cluster Profile](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin) permissions documentation for more information about roles and permissions.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. 

4. Fill out the following input values and ensure you select **Full** for the type. Click on **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  |**Name**| The name of the profile. |
  |**Version**| Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
  |**Description**| Use the description to provide context about the profile. |
  |**Type**| **Full** |
  |**Tags**| Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`.  |

  To learn more about creating multiple profile versions, check out [Version a Cluster Profile](../cluster-profiles/version-cluster-profile.md).

5. Select the infrastructure provider or managed Kubernetes for your environment and click **Next**.

6. Configure the infrastructure layers by selecting the registry, pack name, and pack version for each layer. Click **Next** to continue. 

  | **Layer** | **Description** |
  |-----------|-----------------|
  | **Operating System**| Select an OS to use with your Kubernetes clusters. Use the **Bring Your Own OS (BYO-OS)** if you want to upload your own OS images.|  
  |**Kubernetes**| The Kubernetes pack to use with the cluster. Palette eXtended Kubernetes (PXK) allows you to manage OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured - you can use Palette as an IDP without having to configure a third-party IDP. Refer to [Configure OIDC Identity Provider](../../integrations/kubernetes.md#configure-oidc-identity-provider) for more information. |
  | **Network**| Select a network pack to use with your clusters. |
  | **Storage**| Select a storage pack to use with your clusters. |

7. Select the type of layer to add to the cluster profile. For a description of the layers, review [Profile Layers](../cluster-profiles/cluster-profiles.md#profile-layers)

8. Depending on the add-on type you selected, fill out the required input fields and click on **Confirm & Create**.

<!-- ![A view of the manfiest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.png) -->

9. If you want to add additional layers, repeat steps seven and eight. Otherwise, click on **Next** to review the profile.

10. Click on **Finish Configuration** to create the cluster profile.

You now have a full cluster profile. You can reuse the profile and apply it to several clusters. Refer to the [Update Cluster Profile](update-cluster-profile.md) guide for more information about update operations.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.


## Next Steps

Now you are ready to deploy a cluster using the full cluster profile you created.

## Resources 

[Profile Layers](../cluster-profiles/cluster-profiles.md#profile-layers)