---
sidebar_label: "Create an Infrastructure Profile"
title: "Create an Infrastructure Profile"
description: "Learn how to create an infrastructure cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles"]
---

Create an infrastructure profile by adding layers composed of an OS, Kubernetes, Network, and Storage packs.

:::info

You cannot add add-on layers to an infrastructure cluster profile. To include both infrastructure and add-on layers in
the same profile, create a [full cluster profile](./create-full-profile.md) instead.

:::

## Prerequisites

<PartialsComponent category="profiles" name="create-profile-prerequisites" />

## Create Infrastructure Profile

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Infrastructure" />

5. Choose an option under **Infrastructure provider** or **Managed Kubernetes** to deploy your cluster on, then select
   **Next**. The available options are:

   - **Infrastructure provider**: Apache CloudStack, AWS IaaS, Azure IaaS, Edge Native, GCP IaaS, MAAS, VMware vSphere.
   - **Managed Kubernetes**: AWS EKS, Azure AKS, GCP GKE.

   AWS IaaS is pre-selected by default. Change the selection if you are targeting a different provider.

   <!-- >:::info

   Cluster profiles created from a Tech Preview cloud type are intended for clusters that a cloud provider deploys using
   Palette's generic framework built upon the open source Cluster API (CAPI) initiative.

   When creating a profile using a Tech Preview cloud type, you do not have to specify anything for the OS or Kubernetes
   layers. Out-of-the-box packs are provided for the network and storage profile layers.

   ::: -->

<!-- prettier-ignore-start -->

6. Configure the four infrastructure layers in order. Each layer step is labeled with a counter such as **1/4 Select your base OS pack**. For each layer, select the **Registry**, **Pack Name**, and **Pack Version**. When a pack exposes **Presets**, choose one; update pack **Values** and create [cluster profile variables](../create-cluster-profiles/define-profile-variables/define-profile-variables.md) as needed. Select **Next layer** to proceed to the next infrastructure layer. On the final (Storage) layer, the button reads **Confirm** instead.

   The **Registry** filter defaults to **Public Repo**. The set of packs available on each layer depends on the selected registry and on the cloud type chosen in the previous step. Some pack cards display badges: a green checkmark marks a verified pack, **TP** marks a Tech Preview pack, and dimmed cards mark deprecated packs that you cannot select.

      | **Layer**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                |
      | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
      | **Operating System** | Select an OS to use with your Kubernetes clusters. Use the <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi" /> pack to use a different or custom OS. Refer to our [Bring Your Own OS (BYOOS)](../../../byoos/byoos.md) guide to learn more.                                                                                                                                                                                                                             |
      | **Kubernetes**       | Select the Kubernetes distribution and version to use with the cluster. The available distributions depend on the cloud type; for IaaS clouds these are <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" />, MicroK8s, and RKE2. PXK is Palette's recompiled, CNCF-conformant Kubernetes distribution that also lets you manage an OpenID Connect (OIDC) Identity Provider (IDP), which is useful when your environment does not have an IDP configured. |
      | **Network**          | Select a network pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |
      | **Storage**          | Select a storage pack to use with your cluster.                                                                                                                                                                                                                                                                                                                                                                                               |

<!-- prettier-ignore-end -->

7. Upon adding your storage layer, select **Confirm**. Palette displays the cluster profile stack with your specified
   pack layers. Use the **Variables** and **Editor** actions above the stack to review or refine cluster profile
   variables and raw pack values before continuing.

8. If you need to make changes, select the applicable layer, and update your pack's configuration; otherwise, select
   **Next** to review your cluster profile. On the review page, the cloud type you chose in step 5 appears under the
   label **Environment**.

9. Select **Finish Configuration** to create your cluster profile. Palette saves and publishes the profile in a single
   step; the profile is immediately available for use.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You can now deploy a cluster using the infrastructure cluster profile you created. While you cannot add add-on layers
directly to your infrastructure profile, if you want to deploy additional applications to a cluster and still use your
infrastructure profile, consider using [add-on profiles](./create-addon-profile/create-addon-profile.md).

<PartialsComponent category="profiles" name="create-profile-next-steps" />

## Resources

- [Create an Add-on Profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [Create a Full Profile](../create-cluster-profiles/create-full-profile.md)

- [Profile Layers](../cluster-profiles.md#profile-layers)

- [Update Cluster Profile](../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md)
