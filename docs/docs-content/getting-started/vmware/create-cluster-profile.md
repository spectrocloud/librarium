---
sidebar_label: "Create a Cluster Profile"
title: "Create a Cluster Profile"
description: "Learn to create a full cluster profile in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["getting-started", "vmware"]
---

Palette offers profile-based management for Kubernetes, enabling consistency, repeatability, and operational efficiency
across multiple clusters. A cluster profile allows you to customize the cluster infrastructure stack, allowing you to
choose the desired Operating System (OS), Kubernetes, Container Network Interfaces (CNI), Container Storage Interfaces
(CSI). You can further customize the stack with add-on application layers. For more information about cluster profile
types, refer to [Cluster Profiles](../introduction.md#cluster-profiles).

In this tutorial, you create a full profile directly from the Palette dashboard. Then, you add a layer to your cluster
profile by using a community pack to deploy a web application. The concepts you learn about in the Getting Started
section are centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-create-cluster-profile-intro" />

## Prerequisites

- Follow the steps described in the [Set up Palette with VMware](./setup.md) guide to authenticate Palette for use with
  your VMware user account.
- Refer to the [Deploy a PCG with Palette CLI](./deploy-pcg.md) guide to create the required infrastructure that enables
  communication with your cluster.
- Ensure that the [Palette Community Registry](../../registries-and-packs/registries-and-packs.md#default-registry) is
  available in your Palette environment.

## Create a Full Cluster Profile

Log in to [Palette](https://console.spectrocloud.com) and navigate to the left **Main Menu**. Select **Profiles** to
view the cluster profile page. You can view the list of available cluster profiles. To create a cluster profile, click
on **Add Cluster Profile**.

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **vmware-profile**, provide a profile description, select the type
as **Full**, and assign the tag **env:vmware**. You can leave the version empty if you want to. Just be aware that the
version defaults to **1.0.0**. Click on **Next**.

Cloud Type allows you to choose the infrastructure provider with which this cluster profile is associated. Select
**VMware** and click on **Next**.

The **Profile Layers** step is where you specify the packs that compose the profile. There are four required
infrastructure packs and several optional add-on packs you can choose from. Every pack requires you to select the **Pack
Type**, **Registry**, and **Pack Name**.

For this tutorial, use the following packs:

| Pack Name       | Version | Layer            |
| --------------- | ------- | ---------------- |
| ubuntu-vsphere  | 22.4.x  | Operating System |
| kubernetes      | 1.28.x  | Kubernetes       |
| cni-calico      | 3.27.x  | Network          |
| csi-vsphere-csi | 3.1.x   | Storage          |

As you fill out the information for each layer, click on **Next** to proceed to the next layer.

Click on **Confirm** after you have completed filling out all the core layers.

![VMware core layers](/getting-started/vmware/getting-started_create-cluster-profile_cluster-profile-core-stack.webp)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finish
Configuration** to create the cluster profile.

## Add Packs

Navigate to the left **Main Menu** and select **Profiles**. Select the cluster profile you created earlier.

Click on **Add New Pack** at the top of the page.

<!-- prettier-ignore-start -->

Add the **MetalLB (Helm)** pack to your profile. The <VersionedLink text="MetalLB (Helm)" url="/integrations/packs/?pack=lb-metallb-helm" /> pack provides a
load-balancer implementation for your Kubernetes cluster, as VMware does not offer a load balancer solution natively.
The load balancer is required to help the _LoadBalancer_ service specified in the Hello Universe application manifest
obtain an IP address, so that you can access the application from your browser.

<!-- prettier-ignore-end -->

| Pack Name       | Version | Layer         |
| --------------- | ------- | ------------- |
| lb-metallb-helm | 0.14.x  | Load Balancer |

Now, under **Pack Details**, click on **Values** and replace the predefined `192.168.10.0/24` IP CIDR listed below the
**addresses** line with a valid IP address or IP range from your VMware environment to be assigned to your load
balancer. Next, click **Confirm & Create** to add the MetalLB pack.

![Metallb Helm-based pack.](/getting-started/vmware/getting-started_create-cluster-profile_metallb-pack.webp)

Click on **Confirm & Create** to save the pack.

Click on **Add New Pack** at the top of the page.

Select the **Palette Community Registry** from the **Registry** dropdown. Then, click on the latest **Hello Universe**
pack with version **v1.2.0**.

![Screenshot of hello universe pack](/getting-started/vmware/getting-started_create-cluster-profile_add-pack.webp)

Once you have selected the pack, Palette will display its README, which provides you with additional guidance for usage
and configuration options. The pack you added will deploy the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application.

![Screenshot of pack readme](/getting-started/vmware/getting-started_create-cluster-profile_pack-readme.webp)

Click on **Values** to edit the pack manifest. Click on **Presets** on the right-hand side.

This pack has two configured presets:

1. **Disable Hello Universe API** configures the [_hello-universe_](https://github.com/spectrocloud/hello-universe)
   application as a standalone frontend application. This is the default preset selection.
2. **Enable Hello Universe API** configures the [_hello-universe_](https://github.com/spectrocloud/hello-universe)
   application as a three-tier application with a frontend, API server, and Postgres database.

Select the **Enable Hello Universe API** preset. The pack manifest changes according to this preset.

![Screenshot of pack presets](/getting-started/vmware/getting-started_create-cluster-profile_pack-presets.webp)

The pack requires two values to be replaced for the authorization token and for the database password when using this
preset. Replace these values with your own base64 encoded values. The
[_hello-universe_](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#single-load-balancer) repository
provides a token that you can use.

Click on **Confirm Updates**. The manifest editor closes.

Click on **Confirm & Create** to save the manifest. Then, click on **Save Changes** to save this new layer to the
cluster profile.

## Wrap-Up

In this tutorial, you created a cluster profile, which is a template that contains the core layers required to deploy a
host cluster using VMware vSphere. Then, you added a load balancer and a community pack to your profile to deploy a
custom workload.

We recommend that you continue to the [Deploy a Cluster](./deploy-k8s-cluster.md) tutorial to deploy this cluster
profile to a host cluster onto VMware.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-create-cluster-profile-end" />
