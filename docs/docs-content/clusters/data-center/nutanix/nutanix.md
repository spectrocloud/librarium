---
sidebar_label: "Nutanix"
title: "Nutanix"
description: "Learn how to configure Nutanix and create Nutanix clusters in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "nutanix"]
---

[Nutanix](https://www.nutanix.com/what-we-do) is a hyper-converged infrastructure platform that combines storage,
compute, and networking into a single integrated system. Palette provides a generic framework built upon the open-source
[Cluster API (CAPI)](https://cluster-api.sigs.k8s.io) initiative to support adding cloud providers. As a Tech Preview of
implementing this framework, you can deploy Kubernetes clusters on Nutanix using Palette. Integration with Nutanix is
achieved through a Self-hosted Private Cloud Gateway (PCG), which establishes a secure connection with Nutanix Prism
Central and allows Palette to monitor Nutanix clusters.

:::preview

:::

## Get Started

Learn how to deploy a cluster to Nutanix by using Palette. Check out the
[Deploy a Cluster with Palette](../../public-cloud/deploy-k8s-cluster.md) tutorial to get started.

The section below describes the workflow to register Nutanix with Palette and deploy a cluster.

## Workflow

The following summary steps outline the Nutanix cloud workflow illustrated in the diagram. Since only self-hosted
instances of Palette and Palette VerteX have access to the system console by a
[system administrator](../../../glossary-all.md#system-administrator), the registration step is performed at the system
level, making the Nutanix cloud available to all the tenants. Regular Palette or VerteX users perform the remaining
steps in Palette and their local environment.

![Diagram showing the overall Nutanix workflow for users to construct self-hosted cloud solutions tailored to their environment.](/clusters_data-center_nutanix_workflow.png)

1. A [system administrator](../../../glossary-all.md#system-administrator) registers Nutanix with Palette by preparing
   YAML templates to configure the cluster and node pools and invokes APIs to define the logo, required cloud account
   information and key-value pairs to create the Nutanix cloud account. Palette renders a default logo if no logo is
   specified.

2. Create a Nutanix self-hosted PCG by installing Palette agents in your existing Kubernetes cluster using kubectl
   commands provided in the Palette UI. For guidance, review
   [Install Private Cloud Gateway](./install-pcg/install-pcg.md).

When the PCG status displays the state **Running**, the PCG cluster is integrated with Palette.

:::info

Nutanix cloud requires the deployment of a PCG, which enables Palette to monitor clusters in the infrastructure provider
environment. The PCG instance is installed on an existing Kubernetes cluster that must remain operational.

:::

3. Next, add the Nutanix cloud account to Palette. Use the **drop-down Menu** to select the PCG name you provided when
   you configured it in the previous step. You must fill out the account name and account details.

4. Create a cluster profile by selecting Nutanix as the cloud type.

When creating a Nutanix profile, you do not have to specify anything for the OS or Kubernetes layers. Palette provides
out-of-the-box packs for the network and storage profile layers, including the
[**Nutanix CSI**](../../../integrations/nutanix-csi.md) storage pack. The **Nutanix CSI** pack is available when the
cloud is registered using the name `nutanix`. If you have custom packs, you can add them to Palette by adding your
registry. To learn how to add a pack registry, review
[Add a Custom Registry](/docs/docs-content/registries-and-packs/adding-a-custom-registry.md).

5. Deploy a cluster by specifying Nutanix, listed under **Tech Preview**, as the cluster type. Select the cloud account
   you added and make any needed changes to the profile layers by using the YAML editor. At the **Cluster Config** step,
   customize the Cluster configuration and Node configuration YAML files by replacing any undefined variables in curly
   braces, such as `${CLUSTER_NAME}`, with values for your environment. Make any other adjustments in the files to
   customize the cluster for your environment. Provide an OS image created by a Nutanix user with the _Prism Admin_
   role. For guidance on creating the image, refer to
   [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).

## Resources

- [Nutanix Architecture](architecture.md)

- [Register Nutanix Cloud](register-nutanix-cloud.md)

- [Install Private Cloud Gateway](./install-pcg/install-pcg.md)

- [Add Nutanix Cloud Account](add-nutanix-cloud-account.md)

- [Create and Manage Nutanix Cluster](create-manage-nutanix-cluster.md)
