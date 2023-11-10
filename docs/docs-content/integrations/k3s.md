---
sidebar_label: 'K3s'
title: 'K3s'
description: 'K3s pack in Palette Edge'
hide_table_of_contents: true
type: "integration"
category: ['kubernetes', 'amd64', 'fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: ''
tags: ["packs", "kubernetes", "k3s", "edge"]
---

K3s is a lightweight distribution of Kubernetes, specifically designed for resource-constrained environments and IoT (Internet of Things) applications. Unlike standard Kubernetes with multiple binaries for its various components, K3s is packaged as a single binary with a lightweight storage backend, with minimal external dependencies. For more information about K3s, refer to [K3s documentation](https://docs.k3s.io/). 

K3s is only available for Edge host deployments. Refer to the Edge documentation to learn more about Edge.

## Versions Supported

<Tabs queryString="versions">
<TabItem label="1.27.X" value="k3s_1.27">

### Prerequisites

- An edge device with AMD64(x86_64) processor architecture
- A minimum of 2 CPU cores and 1GB memory. 

### Parameters

|**Parameter**|**Description** |
|-------------|----------------|
| `cluster.config.cluster-cidr`| Specifies the CIDR range that can be used by pods in the cluster. | 
| `cluster.config.service-cidr`| Specifies the CIDR range that can be used by services in the cluster.|
| `kube-apiserver-arg`| This parameter contains extra arguments for the Kubernetes API server, such as enabling audit logging, enabling certain authorization modes, and setting profiling and secure-port.|
|`kube-controller-manager-arg` | This parameter describes extra arguments for the Kubernetes Controller Manager, such as enabling certain feature gates and setting profiling. |
| `kubelet-arg` |  This parameter contains extra arguments for kubelet during node registration, such as setting feature gates, protecting kernel defaults, and disabling the read-only port. |

### Usage

### Terraform

</TabItem>
</Tabs>




