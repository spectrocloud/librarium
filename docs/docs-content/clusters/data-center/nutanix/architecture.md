---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support Nutanix in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["data center", "nutanix", "architecture"]
---


[Nutanix](https://www.nutanix.com) is a private data center-based cloud that can be registered to Palette using Palette's generic framework built upon the open-source Cluster API (CAPI) initiative. Nutanix offers a hyper-converged infrastructure (HCI) that combines storage, compute, and networking into a single integrated system. 

Below are key architectural highlights of Nutanix clusters provisioned through Palette.

- Palette integrates with Nutanix through the Cloud Native Computing Foundation (CNCF) [Nutanix Cluster API Infrastructure Provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix).

- Nutanix Prism is a resource management platform that centralizes the monitoring and management of objects across Nutanix environments, whether hosted in your data center or a public cloud provider environment. Nutanix Prism has two main components: Prism Central (PC) and Prism Element (PE).

  - Prism Central is a workspace in which you can register and manage Nutanix workload clusters. The Cluster API Provider Nutanix Cloud Infrastructure (CAPX) relies on Prism Central APIs to manage the Kubernetes cluster infrastructure resources.

  - Prism Element is a localized cluster manager available for every deployed Nutanix cluster. Within Prism Element, you can configure a cluster, specifying its components such as the number of control plane and worker nodes, networking settings, and more.

- The Kubernetes API Server endpoint is accessible through [kube-vip](https://kube-vip.io/), which is a load balancing solution for the cluster’s control plane. Kube-vip distributes API requests across control plane nodes and also has failover capabilities.

- A Private Cloud Gateway (PCG) is required to enable Palette to securely communicate with the Nutanix cloud. The direct communication channel allows Palette to create and monitor clusters within the Nutanix cloud. A self-hosted cluster is needed for the PCG deployment. The [Deploy a Kubernetes Cluster to Host the PCG](./install-pcg/deploy-kubernetes-cluster-pcg.md) page provides the steps to deploy a self-hosted cluster within the Nutanix infrastructure.

The following diagram illustrates the Nutanix architecture.

  
![Network flow from an architectural perspective of how Nutanix works with Palette.](/clusters_data-center_nutanix_architecture.png)