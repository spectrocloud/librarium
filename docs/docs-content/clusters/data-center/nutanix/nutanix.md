---
sidebar_label: "Nutanix"
title: "Nutanix"
description: "Learn how to configure Nutanix and create Nutanix clusters in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "nutanix"]
---


[Nutanix](https://www.nutanix.com/what-we-do) is a hyper-converged infrastructure platform that combines storage, compute, and networking into a single integrated system. Palette provides a generic framework built upon the open-source [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io) initiative to support adding cloud providers. As a technical preview implementing this framework, you can deploy Kubernetes clusters on Nutanix using Palette. Integration with Nutanix is achieved through a Private Cloud Gateway (PCG), which establishes a secure connection with Nutanix.

The section below describes the overall workflow to register Nutanix with Palette and deploy a cluster using Palette. 

## Workflow

The following summary steps outline the CAPI cloud workflow illustrated in the diagram below. A system administrator performs the first step at the system level to make the cloud provider available to all the tenants. CAPI users perform the remaining steps in Palette and their local environment.

![Diagram showing the overall CAPI workflow for users to construct self-hosted cloud solutions tailored to their environment.](/clusters_data-center_nutanix_workflow.png)

1. A system administrator registers Nutanix with Palette by invoking system-level APIs. This includes defining the logo, required cloud account information and key-value pairs to create the Nutanix cloud account. If you do not have a cloud logo, Palette provides a default logo. Palette displays the cloud when registration is complete. 

2. Create a self-hosted PCG by installing Palette agents for the PCG in your Kubernetes cluster, issuing the kubectl commands provided in Palette.

  When the PCG status displays Running state, the Kubernetes cluster is integrated with Palette.

  :::caution

  All clouds require the deployment of a PCG, which enables Palette to securely monitor clusters in the cloud. The PCG relies on the self-hosted Kubernetes cluster to remain operational.

  :::

3. Next, add the cloud account to Palette. The required fields to add the cloud are pre-defined by the system administrator during cloud registration in step 1. The PCG name provided at the time of PCG creation is auto-filled, and you provide the account name and account details.

4. Create a cluster profile by selecting Nutanix as the cloud type. 

  Palette displays out-of-the-box packs for the network and storage profile layers. Additionally, Palette provides a Nutanix-specific storage pack. If you have custom packs, you can add them to Palette by adding your registry. To learn how to add a pack registry, review [Add a Custom Registry](https://docs.spectrocloud.com/registries-and-packs/adding-a-custom-registry/#configure-a-custom-pack-registry-in-palette).

5. Deploy a cluster by specifying Nutanix, listed under **Tech Preview**, as the cluster type. Select the cloud account you added and make any needed changes to the profile layers by using the YAML editor. At the **Cluster Config** step, adjust YAML configuration files to customize the cluster for your environment. You provide your own Operating System (OS) image.



## Resources

- [Nutanix Architecture](architecture.md)

- [Register Nutanix Cloud](register-nutanix-cloud.md)

- [Install Private Cloud Gateway](install-pcg.md)

- [Add Nutanix Cloud Account](add-nutanix-cloud-account.md)

- [Create and Manage Nutanix Cluster](create-manage-nutanix-cluster.md)
