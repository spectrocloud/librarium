---
sidebar_label: "Create a Full Profile"
title: "Create a Full Profile"
description: "Learn how to create a full cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["profiles", "cluster profiles"]
---

Create a full profile by first adding infrastructure layers composed of an OS, Kubernetes distribution, network pack,
and storage pack. Next, add add-on layers to expand the functionality of your clusters.

## Prerequisites

<PartialsComponent category="profiles" name="create-profile-prerequisites" />

## Create a Full Profile

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Full" />

5. Choose the **Infrastructure provider** or **Managed Kubernetes** environment to deploy your cluster on, and select
   **Next**.

   <!-- :::info

   Cluster profiles created from a Tech Preview cloud type are intended for clusters that a cloud provider deploys using
   Palette's generic framework built upon the open source Cluster API (CAPI) initiative.

   When creating a profile using a Tech Preview cloud type, you do not have to specify anything for the OS or Kubernetes
   layers. Out-of-the-box packs are provided for the network and storage profile layers.

   ::: -->

<!-- prettier-ignore-start -->

6. Configure the following infrastructure layers by selecting the **Registry**, **Pack Name**, and **Pack Version** for each layer. Choose from among **Presets** and update pack **Values** as needed. When finished, select **Next Layer** to proceed to the next infrastructure layer.

      | **Layer**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                |
      | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
      | **Operating System** | Select an OS to use with your Kubernetes clusters. Use the <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi" /> pack to use a different or custom OS. Refer to our [Bring Your Own OS (BYOOS)](../../../byoos/byoos.md) guide to learn more.                                                                                                                                                                                                                             |
      | **Kubernetes**       | Select the Kubernetes distribution and version to use with the cluster. The <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack allows you to manage an OpenID Connect (OIDC) Identity Provider (IDP). This is particularly useful if your environment does not have an IDP configured, as you can use Palette in place of a third-party IDP. |
      | **Network**          | Select a network pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |
      | **Storage**          | Select a storage pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |

<!-- prettier-ignore-end -->

7. Once your infrastructure layers are created, select the type of layer to add to the cluster profile. Choose from
   among [add-on packs](../create-cluster-profiles/create-addon-profile/create-pack-addon.md),
   [manifests](../create-cluster-profiles/create-addon-profile/create-manifest-addon.md), and
   [Helm charts](../create-cluster-profiles/create-addon-profile/create-helm-addon.md), and fill out the required input
   fields for each layer. When finished, select **Confirm & Create** to add the layer to the cluster profile.

   For more information about layers, applying pack versions, configuration parameters, and presets, refer to our
   [Profile Layers](../cluster-profiles.md#profile-layers) guide.

8. Repeat step 7 to add additional layers. When finished, select **Next** to review the cluster profile.

9. Select **Finish Configuration** to create your cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You can now deploy a cluster using the full cluster profile you created.

<PartialsComponent category="profiles" name="create-profile-next-steps" />

## Resources

- [Profile Layers](../cluster-profiles.md#profile-layers)

- [Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md)

- [Duplicate a Pack in a Profile](duplicate-pack-in-profile.md)
