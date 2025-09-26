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

## Create a Full Profile

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Full" />

5. Select the **Infrastructure provider** or **Managed Kubernetes** environment to deploy your cluster on, and select
   **Next**.

   <!-- :::info

   Cluster profiles created from a Tech Preview cloud type are intended for clusters that a cloud provider deploys using
   Palette's generic framework built upon the open source Cluster API (CAPI) initiative.

   When creating a profile using a Tech Preview cloud type, you do not have to specify anything for the OS or Kubernetes
   layers. Out-of-the-box packs are provided for the network and storage profile layers.

   ::: -->

<!-- prettier-ignore-start -->

6. Configure the infrastructure layers by selecting the registry, pack name, and pack version for each layer. When
   finished, select **Next Layer** to proceed to the next infrastructure layer.



      | **Layer**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                |
      | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
      | **Operating System** | Select an OS to use with your Kubernetes clusters. Use the **Bring Your Own OS (BYOOS)** pack to use a different or custom OS. Refer to the [Bring Your Own OS (BYOOS)](../../../byoos/byoos.md) guide to learn more.                                                                                                                                                                                                                             |
      | **Kubernetes**       | Select the Kubernetes distribution and version to use with the cluster. The **Palette eXtended Kubernetes (PXK)** pack allows you to manage OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured, as you can use Palette as an IDP without having to configure a third-party IDP. Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack for more information. |
      | **Network**          | Select a network pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |
      | **Storage**          | Select a storage pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |

<!-- prettier-ignore-end -->

7. Select the type of layer to add to the cluster profile. Choose from amongst additional
   [add-on packs](../create-cluster-profiles/create-addon-profile/create-pack-addon.md),
   [manifests](../create-cluster-profiles/create-addon-profile/create-manifest-addon.md), or
   [Helm charts](../create-cluster-profiles/create-addon-profile/create-helm-addon.md).

   For more information about layers, applying pack versions, configuration parameters, and presets, refer to our
   [Profile Layers](../cluster-profiles.md#profile-layers) guide.

8. Fill out the required input fields for each layer. When finished with each layer, select **Confirm & Create** to add
   it to the cluster profile.

<!-- ![A view of the manfiest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.webp) -->

9. Repeat steps 7 and 8 to add additional layers. When finished, select **Next** to review the cluster profile.

10. Select **Finish Configuration** to create the cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You can now deploy a cluster using the cluster profile you created. If you need to make changes to your cluster profile,
we recommend [creating a new cluster profile version](../modify-cluster-profiles/version-cluster-profile.md) before
[updating your cluster profile](../modify-cluster-profiles/update-cluster-profile.md).

For general cluster deployment information, check out our [Clusters](../../../clusters/clusters.md) guide. For an
end-to-end walkthrough of deploying a cluster on your desired infrastructure, refer to our
[Getting Started](../../../tutorials/getting-started/palette/palette.md) guide.

## Resources

- [Profile Layers](../cluster-profiles.md#profile-layers)

- [Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md)

- [Duplicate a Pack in a Profile](duplicate-pack-in-profile.md)
