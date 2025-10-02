---
sidebar_label: "Create a Full Profile"
title: "Create a Full Profile"
description: "Learn how to create a full cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["profiles", "cluster profiles"]
---

Create a full profile by first adding infrastructure layers composed of an Operating System (OS), Kubernetes, Network,
and Storage. Next, add layers using add-on profiles to expand the functionality of your clusters.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
  [Roles and Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  documentation for more information.

## Create Full Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. If you have an existing infrastructure profile, you can select it from
   the profiles list and add layers to it from the profiles details page to create a full profile.

4. Fill out the following input values and ensure you select **Full** for the type. Click on **Next** to continue.

   | **Field**       | **Description**                                                                                                                                                                                                   |
   | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**        | The name of the profile.                                                                                                                                                                                          |
   | **Version**     | Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`.                                                   |
   | **Description** | Use the description to provide context about the profile.                                                                                                                                                         |
   | **Type**        | **Full**                                                                                                                                                                                                          |
   | **Tags**        | Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`. |

   To learn how to create multiple profile versions that use the same name, check out
   [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md).

5. Select the Infrastructure Provider, Managed Kubernetes, or Tech Preview cloud type for your environment and click
   **Next**.

   :::info

   Cluster profiles created from a Tech Preview cloud type are intended for clusters that a cloud provider deploys using
   Palette's generic framework built upon the open source Cluster API (CAPI) initiative.

   When creating a profile using a Tech Preview cloud type, you do not have to specify anything for the OS or Kubernetes
   layers. Out-of-the-box packs are provided for the network and storage profile layers.

   :::

6. Configure the infrastructure layers by selecting the registry, pack name, and pack version for each layer. Click
   **Next Layer** to configure each infrastructure layer.

<!-- prettier-ignore-start -->

   | **Layer**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Operating System** | Select an OS to use with your Kubernetes clusters. Use the **Bring Your Own OS (BYOOS)** to use a different or custom OS. Refer to the [Bring Your Own OS (BYOOS)](../../../byoos/byoos.md) section to learn more.                                                                                                                                                                                                                             |
   | **Kubernetes**       | The Kubernetes pack to use with the cluster. Palette eXtended Kubernetes (PXK) allows you to manage OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured - you can use Palette as an IDP without having to configure a third-party IDP. Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional guidance for more information. |
   | **Network**          | Select a network pack to use with your clusters.                                                                                                                                                                                                                                                                                                                                                                                               |
   | **Storage**          | Select a storage pack to use with your clusters.                                                                                                                                                                                                                                                                                                                                                                                               |

<!-- prettier-ignore-end -->

7. Select the type of layer to add to the cluster profile: pack, manifest, or Helm chart. For guidance, refer to
   [Add a Pack](../create-cluster-profiles/create-addon-profile/create-pack-addon.md),
   [Add a Manifest](../create-cluster-profiles/create-addon-profile/create-manifest-addon.md), or
   [Add a Helm Chart](../create-cluster-profiles/create-addon-profile/create-helm-addon.md).

   For more information about the layers, applying pack versions, configuration parameters, and presets, review
   [Profile Layers](../cluster-profiles.md#profile-layers).

8. Fill out the required input fields for each layer and click on **Confirm & Create**.

<!-- ![A view of the manfiest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.webp) -->

9. If you want to add additional layers, repeat steps 7 and 8. Otherwise, click on **Next** to review the profile.

10. Click on **Finish Configuration** to create the cluster profile.

You now have a full cluster profile. You can reuse the profile and apply it to several clusters. Refer to the
[Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md) guide for more information about update
operations.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

Now you are ready to deploy a cluster using the full cluster profile you created.

## Resources

- [Profile Layers](../cluster-profiles.md#profile-layers)

- [Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md)

- [Duplicate a Pack in a Profile](duplicate-pack-in-profile.md)
