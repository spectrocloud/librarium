---
sidebar_label: "Create an Infrastructure Profile"
title: "Create an Infrastructure Profile"
description: "Learn how to create an infrastructure cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles"]
---

Create an infrastructure profile by adding layers composed of an Operating System (OS), Kubernetes, Network, and Storage
packs.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Cluster Profile permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  reference for more information about roles and permissions.

## Create Infrastructure Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the following input values and ensure you select **Infrastructure** for the type. Click on **Next** to
   continue.

   | **Field**       | **Description**                                                                                                                                                                                                   |
   | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**        | A custom name for the profile.                                                                                                                                                                                    |
   | **Version**     | You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`.                                                                                    |
   | **Description** | Use the description to provide context about the profile.                                                                                                                                                         |
   | **Type**        | **Infrastructure**                                                                                                                                                                                                |
   | **Tags**        | Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`. |

   To learn more about creating multiple profile versions, check out
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

   For more information about layer types, applying pack versions, configuration parameters, and presets, review
   [Profile Layers](../cluster-profiles.md#profile-layers).

<!-- prettier-ignore-start -->

   | **Layer**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                           |
   | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Operating System** | Select an OS to use with your Kubernetes clusters. Use **Bring Your Own OS (BYOOS)** if you want to upload your own OS images.                                                                                                                                                                                                                                                                                                                            |
   | **Kubernetes**       | The Kubernetes pack to use with the cluster. Palette eXtended Kubernetes (PXK) allows you to manage OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured - you can use Palette as an IDP without having to configure a third-party IDP. Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional guidance for more information. |
   | **Network**          | Select a network pack to use with your clusters.                                                                                                                                                                                                                                                                                                                                                                                                          |
   | **Storage**          | Select a storage pack to use with your clusters.                                                                                                                                                                                                                                                                                                                                                                                                          |

   As you add each layer, Palette displays the YAML file in the editor at right. You can edit the YAML as needed.

<!-- prettier-ignore-end -->

7. When all the infrastructure layers are added, click on **Confirm**. Palette displays the profile stack with your
   specified pack layers.

8. Click on **Next** to review the profile.

9. Click on **Finish Configuration** to create the cluster profile.

You now have an infrastructure cluster profile. You can reuse the profile and apply it to several clusters. Refer to the
[Update a Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md) guide for more information about update
operations.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

Now you are ready to deploy a cluster using the infrastructure cluster profile you created. If desired, you can add
layers to your infrastructure profile using add-on profiles. For more information, check out the
[Create an Add-on Profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md) guide.

## Resources

- [Create an Add-on Profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [Create a Full Profile](../create-cluster-profiles/create-full-profile.md)

- [Profile Layers](../cluster-profiles.md#profile-layers)

- [Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md)
