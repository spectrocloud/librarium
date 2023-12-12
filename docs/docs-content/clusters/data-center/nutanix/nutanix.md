---
sidebar_label: "Nutanix"
title: "Nutanix"
description: "Learn how to configure Nutanix and create Nutanix clusters in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "nutanix"]
---

[Nutanix](https://www.nutanix.com/what-we-do) is a hyper-converged infrastructure platform that combines storage, compute, and networking into a single integrated system. Palette provides a generic framework built upon the open-source CAPI initiative to support adding cloud providers. Using this framework, Palette supports integration with Nutanix as a *Tech Preview* for enabling cluster deployment within the Nutanix environment. This integration is achieved through a Private Cloud Gateway (PCG), which establishes a secure connection with Nutanix.

## Workflow

The following summary steps outline the CAPI cloud workflow illustrated in the diagram below.

![alt text]

1. Your System Administrator registers a CAPI cloud with Palette by invoking system-level APIs. This includes defining the cloud logo, required cloud account information and key-value pairs to create the cloud account for your particular cloud. If you do not have a cloud logo, Palette provides a basic cloud logo. Palette displays the cloud when registration is complete.

2. You create a self-hosted PCG for their cloud type, and install Palette agents for the PCG in your Kubernetes cluster by copying the following kubectl commands provided in Palette.

  When the PCG status displays Running state, Palette integrates your Kubernetes cluster using the PCG.

  :::caution

  All custom clouds require the creation of a Private Cloud Gateway (PCG), which enables Palette to securely monitor clusters in the cloud. The PCG relies on the Kubernetes cluster in your local environment to deploy and remain operational.

  :::: 

3. Next, you add the cloud account to Palette. The required fields to add the cloud are pre-defined by your System Administrator during cloud registration in step 1. These cloud-specific fields vary based on the cloud type. The PCG name provided at the time of PCG creation is auto-filled, and you provide the account name.

4. Create a cluster profile. Select your custom cloud as the cloud type. Palette displays out-of-the-box packs. If you have custom packs, you can add them to Palette by adding a custom registry. To learn how to configure a custom pack registry, review [Add a custom registry](https://docs.spectrocloud.com/registries-and-packs/adding-a-custom-registry/#configure-a-custom-pack-registry-in-palette).  

5. Deploy the cluster in your custom cloud. Select the cloud account that was added and make any changes to the profile layers. Use Palette-provided YAML templates to customize the cluster for your cloud environment. Configure the control plane node and worker nodes in the provided YAML files, specifying the node pool name and the number of nodes in the pool.

## Edit Cluster

You also use the YAML files to edit your custom cloud settings and nodes within a cluster.



## Resources

- [Nutanix Architecture](architecture.md)

- [Register Nutanix Cloud](register-nutanix-cloud.md)

- [Install Private Cloud Gateway](install-pcg.md)

- [Add Nutanix Cloud Account](add-nutanix-cloud-account.md)

- [Create and Manage Nutanix Cluster](create-manage-nutanix-cluster.md)
