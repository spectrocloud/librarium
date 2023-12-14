---
sidebar_label: "Nutanix"
title: "Nutanix"
description: "Learn how to configure Nutanix and create Nutanix clusters in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "nutanix"]
---

[Nutanix](https://www.nutanix.com/what-we-do) is a hyper-converged infrastructure platform that combines storage, compute, and networking into a single integrated system. Palette provides a generic framework built upon the open-source [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io) initiative to support adding cloud providers. Using this framework, Palette supports integration with Nutanix as a *Tech Preview* for enabling cluster deployment within the Nutanix environment. This integration is achieved through a Private Cloud Gateway (PCG), which establishes a secure connection with Nutanix.

The section below describes the overall workflow. 

## Workflow

The following summary steps outline the CAPI cloud workflow illustrated in the diagram below. A System Administrator performs the first step, and CAPI users perform the remaining steps in Palette.

![Diagram showing the overall CAPI workflow for users to construct self-hosted cloud solutions tailored to their environment.](/clusters_data-center_nutanix_workflow.png)

1. A System Administrator registers a cloud with Palette by invoking system-level APIs. This includes defining the cloud logo, required cloud account information and key-value pairs to create the cloud account for your particular cloud. If you do not have a cloud logo, Palette provides a default cloud logo. Palette displays the cloud when registration is complete. 

<<< Does SA configure PCG in the local cluster at this step??>>>

2. Create a self-hosted PCG for your cloud type, and install Palette agents for the PCG in your Kubernetes cluster by issuing the kubectl commands provided in Palette.

  When the PCG status displays Running state, the Kubernetes cluster is now integrated with Palette.

  :::caution

  All custom clouds require the deployment of a PCG, which enables Palette to securely monitor clusters in the cloud. The PCG relies on the self-hosted Kubernetes cluster to remain operational.

  :::

3. Next, add the cloud account to Palette. The required fields to add the cloud are pre-defined by your System Administrator during cloud registration in step 1. These cloud-specific fields vary based on the cloud type. The PCG name provided at the time of PCG creation is auto-filled, and you provide the account name and account details.

4. Create a cluster profile by selecting the registered cloud as the cloud type. 

  Palette displays out-of-the-box packs for the network and storage profile layers. If you have custom packs, you can add them to Palette by adding a custom registry. To learn how to add a custom pack registry, review [Add a Custom Registry](https://docs.spectrocloud.com/registries-and-packs/adding-a-custom-registry/#configure-a-custom-pack-registry-in-palette).

<!-- OR

Create a cluster profile by selecting your cloud as the cloud type. 


<<< Alternatively, you can provide your OS image by copying it to the provided YAML file.>>> <<<Is this correct? Will the YAML editor be blank for user to copy/paste their own image??>>> -->

5. Deploy a cluster by specifying the cluster type. Locate Nutanix, which is listed under **Tech Preview**. Select the cloud account you added and make any needed changes to the profile layers by using the YAML editor. At the **Cluster Config** step, use YAML templates to customize the cluster for your cloud environment. You can provide your own Operating System (OS) image and configure a custom Kubernetes pack layer by specifying the OS image and other settings in YAML template files during cluster creation.

<!-- Configure the control plane node and worker nodes in the provided YAML files, specifying the node pool name and the number of nodes in the pool. -->



## Resources

- [Nutanix Architecture](architecture.md)

- [Register Nutanix Cloud](register-nutanix-cloud.md)

- [Install Private Cloud Gateway](install-pcg.md)

- [Add Nutanix Cloud Account](add-nutanix-cloud-account.md)

- [Create and Manage Nutanix Cluster](create-manage-nutanix-cluster.md)
