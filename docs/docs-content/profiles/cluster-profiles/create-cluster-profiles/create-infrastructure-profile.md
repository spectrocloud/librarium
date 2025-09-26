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

:::info

You cannot add add-on layers to an infrastructure cluster profile. To include both infrastructure and add-on layers in
one profile, create a [full cluster profile](./create-full-profile.md) instead.

:::

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Cluster Profile permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  reference for more information about roles and permissions.

## Create Infrastructure Profile

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Infrastructure" />

5. Choose the **Infrastructure provider** or **Managed Kubernetes** environment to deploy your cluster on, and select
   **Next**.

   <!-- >:::info

   Cluster profiles created from a Tech Preview cloud type are intended for clusters that a cloud provider deploys using
   Palette's generic framework built upon the open source Cluster API (CAPI) initiative.

   When creating a profile using a Tech Preview cloud type, you do not have to specify anything for the OS or Kubernetes
   layers. Out-of-the-box packs are provided for the network and storage profile layers.

   ::: -->

<!-- prettier-ignore-start -->

6. Configure the infrastructure layers by selecting the **Registry**, **Pack Name**, and **Pack Version** for each layer. Choose from among **Presets**, update pack **Values**, and create [cluster profile variables](../create-cluster-profiles/define-profile-variables/define-profile-variables.md) as needed. When finished, select **Next Layer** to proceed to the next infrastructure layer.

      | **Layer**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                |
      | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
      | **Operating System** | Select an OS to use with your Kubernetes clusters. Use the **Bring Your Own OS (BYOOS)** pack to use a different or custom OS. Refer to the [Bring Your Own OS (BYOOS)](../../../byoos/byoos.md) guide to learn more.                                                                                                                                                                                                                             |
      | **Kubernetes**       | Select the Kubernetes distribution and version to use with the cluster. The **Palette eXtended Kubernetes (PXK)** pack allows you to manage an OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured, as you can use Palette in place of a third-party IDP. Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack for more information. |
      | **Network**          | Select a network pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |
      | **Storage**          | Select a storage pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |

<!-- prettier-ignore-end -->

7. Upon adding your storage layer, select **Confirm**. Palette displays the cluster profile stack with your specified
   pack layers.

8. If you need to make changes, select the applicable layer, and update your pack's configuration; otherwise, select
   **Next** to review your cluster profile.

9. Select **Finish Configuration** to create your cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You can now deploy a cluster using the cluster profile you created. If you need to make changes to your cluster profile,
we recommend [creating a new cluster profile version](../modify-cluster-profiles/version-cluster-profile.md) before
[updating your cluster profile](../modify-cluster-profiles/update-cluster-profile.md). While you cannot add add-on
layers directly to your infrastructure profile, if you want to deploy additional applications to a cluster and still use
your infrastructure profile, consider using [add-on profiles](./create-addon-profile/).

For general cluster deployment information, check out our [Clusters](../../../clusters/clusters.md) guide. For an
end-to-end walkthrough of deploying a cluster on your desired infrastructure, refer to our
[Getting Started](../../../tutorials/getting-started/palette/palette.md) tutorials.

## Resources

- [Create an Add-on Profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [Create a Full Profile](../create-cluster-profiles/create-full-profile.md)

- [Profile Layers](../cluster-profiles.md#profile-layers)

- [Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md)
