---
sidebar_label: "Nutanix"
title: "Nutanix"
description: "Learn how to configure Nutanix and create Nutanix clusters in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "nutanix"]
---


[Nutanix](https://www.nutanix.com/what-we-do) is a hyper-converged infrastructure platform that combines storage, compute, and networking into a single integrated system. Palette provides a generic framework built upon the open-source [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io) initiative to support adding cloud providers. As a Technical Preview of implementing this framework, you can deploy Kubernetes clusters on Nutanix using Palette.  Integration with Nutanix is achieved through a Private Cloud Gateway (PCG), which establishes a secure connection with Nutanix.

## Get Started

Learn how to deploy a cluster to Nutanix by using Palette. Check out the [Deploy a Cluster with Palette](../../public-cloud/deploy-k8s-cluster.md). tutorial to get started.

The section below describes the workflow to register Nutanix with Palette and deploy a cluster. 

## Workflow

The following summary steps outline the CAPI cloud workflow illustrated in the diagram. Since only self-hosted instances of Palette have access to the system console by a system administrator, the registration step is performed at the system level, making the cloud provider available to all the tenants. CAPI users perform the remaining steps in Palette and their local environment.

![Diagram showing the overall CAPI workflow for users to construct self-hosted cloud solutions tailored to their environment.](/clusters_data-center_nutanix_workflow.png)

1. A system administrator registers Nutanix with Palette by preparing YAML templates to configure the cluster and node pools and invokes APIs to define the logo, required cloud account information and key-value pairs to create the Nutanix cloud account. Palette renders a default logo if no logo is specified. 

  :::caution
  To make the Palette-provided **Nutanix CSI** pack available to users, the Nutanix cloud must be registered using the name `nutanix`. For guidance in using registration APIs and providing required variable values, review [Register the Cloud](register-nutanix-cloud.md#register-the-cloud).
  
  <!-- To use the **Nutanix CSI** pack, the Nutanix cloud must be registered using the name `nutanix`. For guidance in using registration APIs and providing required variable values, review [Register the Cloud](register-nutanix-cloud.md#register-the-cloud). -->
  :::


2. Create a self-hosted PCG by preparing YAML configuration templates and installing Palette agents for the PCG in your Kubernetes cluster using kubectl commands provided in the Palette UI. For guidance, review [Install Private Cloud Gateway](install-pcg.md).

  When the PCG status displays the state **Running**, the Kubernetes cluster is integrated with Palette.

  :::info

  All custom providers clouds require the deployment of a PCG, which enables Palette to monitor clusters in the infrastructure provider environment. The PCG instance is installed on an existing Kubernetes cluster that must remain operational.

  :::

3. Next, add the cloud account to Palette. The required fields to add the cloud are pre-defined by the system administrator during cloud registration in step 1. Use the **drop-down Menu** to select the PCG name you provided when you configured it in the previous step. You must fill out the account name and account details.

4. Create a cluster profile by selecting Nutanix as the cloud type. 

  Palette displays out-of-the-box packs for the network and storage profile layers. Additionally, Palette provides an out-of-the-box **Nutanix CSI** pack that is available when the cloud is registered using the name `nutanix`. If you have custom packs, you can add them to Palette by adding your registry. To learn how to add a pack registry, review [Add a Custom Registry](https://docs.spectrocloud.com/registries-and-packs/adding-a-custom-registry/#configure-a-custom-pack-registry-in-palette).

5. Deploy a cluster by specifying Nutanix, listed under **Tech Preview**, as the cluster type. Select the cloud account you added and make any needed changes to the profile layers by using the YAML editor. At the **Cluster Config** step, customize the Cluster configuration and Node configuration YAML files by replacing any undefined variables in curly braces, such as `${CLUSTER_NAME}`, with values for your environment. Make any other adjustments in the files to customize the cluster for your environment. You provide your own Operating System (OS) image.


## Resources

- [Nutanix Architecture](architecture.md)

- [Register Nutanix Cloud](register-nutanix-cloud.md)

- [Install Private Cloud Gateway](install-pcg.md)

- [Add Nutanix Cloud Account](add-nutanix-cloud-account.md)

- [Create and Manage Nutanix Cluster](create-manage-nutanix-cluster.md)
