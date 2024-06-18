---
sidebar_label: "Create a Cluster Profile"
title: "Create a Cluster Profile"
description: "Learn to create a full cluster profile in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["getting-started", "gcp"]
---

Palette offers profile-based management for Kubernetes, enabling consistency, repeatability, and operational efficiency
across multiple clusters. A cluster profile allows you to customize the cluster infrastructure stack, allowing you to
choose the desired Operating System (OS), Kubernetes, Container Network Interfaces (CNI), Container Storage Interfaces
(CSI). You can further customize the stack with add-on application layers. For more information about cluster profile
types, refer to [Cluster Profiles](../cluster-profiles.md).

In this tutorial, you create a full profile directly from the Palette dashboard. Then, you add a layer to your cluster
profile by using a [community pack](../../integrations/community_packs.md) to deploy a web application.

## Prerequisites

- Follow the steps described in the [Set up Palette with GCP](./setup.md) guide to authenticate Palette for use with
  your GCP cloud account.
- Ensure that the [Palette Community Registry](../../registries-and-packs/registries/registries.md#default-registries)
  is available in your Palette environment. Refer to the
  [Add OCI Packs Registry](../../registries-and-packs/registries/oci-registry/add-oci-packs.md) guide for additional
  guidance.

## Create a Full Cluster Profile

Log in to [Palette](https://console.spectrocloud.com) and navigate to the left **Main Menu**. Select **Profiles** to
view the cluster profile page. You can view the list of available cluster profiles. To create a cluster profile, click
on **Add Cluster Profile**.

![View of the cluster Profiles page](/getting-started/getting-started_create-cluster-profile_profile_list_view.webp)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **gcp-profile**, provide a profile description, select the type as
**Full**, and assign the tag **env:gcp**. You can leave the version empty if you want to. Just be aware that the version
defaults to **1.0.0**. Click on **Next**.

Cloud Type allows you to choose the infrastructure provider with which this cluster profile is associated. Select
**Google Cloud** and click on **Next**.

The **Profile Layers** step is where you specify the packs that compose the profile. There are four required
infrastructure packs and several optional add-on packs you can choose from. Every pack requires you to select the **Pack
Type**, **Registry**, and **Pack Name**.

For this tutorial, use the following packs:

| Pack Name      | Version | Layer            |
| -------------- | ------- | ---------------- |
| ubuntu-gcp LTS | 22.4.x  | Operating System |
| Kubernetes     | 1.27.x  | Kubernetes       |
| cni-calico     | 3.26.x  | Network          |
| csi-gcp-driver | 1.8.x   | Storage          |

As you fill out the information for each layer, click on **Next** to proceed to the next layer.

Click on **Confirm** after you have completed filling out all the core layers.

![GCP cluster profile view](/getting-started/gcp/getting-started_create-cluster-profile_cluster_profile_stack.webp)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finish
Configuration** to create the cluster profile.

## Add a Pack

Navigate to the left **Main Menu** and select **Profiles**. Select the cluster profile you created earlier.

Click on **Add New Pack** at the top of the page.

Select the **Palette Community Registry** from the **Registry** dropdown. Then, click on the latest **Hello Universe**
pack with version **v1.1.2**.

![Screenshot of hello universe pack](/getting-started/gcp/getting-started_create-cluster-profile_add-pack.webp)

Once you have selected the pack, Palette will display its README, which provides you with additional guidance for usage
and configuration options. The pack you added will deploy the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application.

![Screenshot of pack readme](/getting-started/gcp/getting-started_create-cluster-profile_pack-readme.webp)

Click on **Confirm & Create** to save the manifest. Click on **Save Changes** to save this new layer to the cluster
profile.

## Wrap-Up

In this tutorial, you created a cluster profile, which is a template that contains the core layers required to deploy a
host cluster using Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) cloud providers. You added
a community pack to your profile to deploy a custom workload.

We recommend that you continue to the [Deploy a Cluster](./deploy-k8s-cluster.md) tutorial to deploy this cluster
profile to a host cluster onto your preferred cloud service provider.
