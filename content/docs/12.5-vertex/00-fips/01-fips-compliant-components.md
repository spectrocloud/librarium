---
title: "FIPS-Compliant Components"
metaTitle: "FIPS-Compliant Components"
metaDescription: "Learn about FIPS-Component Components supported by Palette VerteX."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Federal Information Processing Standards (FIPS) is a series of standards developed by the National Institute of Standards and Technology (NIST) in the United States for computer security and encryption algorithms. 

FIPS 140-2 is a specific standard for security requirements for cryptographic modules. It outlines the criteria these modules must meet to ensure their security and integrity. 


## FIPS Support in Clusters

Palette VerteX provides FIPS-compliant infrastructure components in Kubernetes clusters it deploys. These components are:
    
<br />

- Operating System (OS) 
  - Ubuntu Pro


- Kubernetes
  - Palette eXtended Kubernetes (PXK) 
  - Palette eXtended Kubernetes - Edge (PXK-E)


- Container Network Interface (CNI) 
  - Calico


- Container Storage Interface (CSI)
  - vSphere CSI


## Management Plane

All services in the management plane are FIPS compiled with Go using [BoringCrypto libraries](https://pkg.go.dev/crypto/internal/boring) and static linking. Refer to the [Spectro Cloud Cryptographic Module](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4349) resource to learn about our NIST certificate.

<br />

## FIPS-Compliant Kubernetes

Our customized version of Kubernetes is FIPS-compliant. Both [Palette eXtended Kubernetes (PXK)](/integrations/kubernetes) and [Palette eXtended Kubernetes-Edge (PXK-E)](/integrations/kubernetes-edge) are compiled with FIPS-compliant compiler and libraries.

<br />


<InfoBox>

Refer to the [Palette eXtended Kubernetes (PXK)](/integrations/kubernetes) and [Palette eXtended Kubernetes-Edge (PXK-E)](/integrations/kubernetes-edge) documentation to learn more about the each Kubernetes distribution.


</InfoBox>

All PXK and PXKE components and supporting open-source components are compiled in their native programming language using language specific FIPS-compliant libraries and static linking. If the component is not available in the form of a FIPS-compliant binary, we compile it with FIPS-compliant compiler and libraries. The following tables list the FIPS-compliant components in PXK and PXK-E:

<br />


### Core Kubernetes Components

| **Component** | **Description** |
| --- | --- |
| API Server | The API server is the central management entity that receives all REST requests for the cluster. |
| Controller Manager | The controller manager is a daemon that embeds the core control loops shipped with Kubernetes. |
| Scheduler | The scheduler is a daemon that finds the best node for a pod, based on the scheduling requirements you specify. |
| Kubelet | The kubelet is the primary *node agent* that is deployed on each node. |
| Kube-proxy | The kube-proxy is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service concept. |
| Kubeadm | Kubeadm is a tool built to provide best-practice “fast paths” for creating Kubernetes clusters. |
| Kubectl | Kubectl is a command line interface for issuing commands against Kubernetes clusters. |


### Auxiliary Kubernetes Components

| **Component** | **Description** |
| --- | --- |
| CoreDNS | CoreDNS is a Domain Name System (DNS) server deployed as a cluster DNS service. |
| Etcd | Etcd is a distributed key-value store used as Kubernetes’ backing store for all cluster data. |
| Metrics Server | Metrics Server is a scalable, efficient source of container resource metrics for Kubernetes built-in autoscaling pipelines. |
| Ingress Controller| Nginx is used as the ingress controller. An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and Transport Layer Security (TLS) termination for Kubernetes services. |
| Nginx Server| The Nginx server is a web server that can also be used as a reverse proxy, load balancer, mail proxy, and HTTP cache. |
| Nginx Ingress Controller| The Nginx ingress controller uses ConfigMap to store the Nginx configuration. |


### Runtime Components

| **Component** | **Description** |
| --- | --- |
| containerd |  Containerd is an industry-standard container runtime with an emphasis on simplicity, robustness, and portability. |
| containerd-shim | Containerd-shim is a shim used by containerd to launch containers. |
| containerd-shim-runc-v1 | Containerd-shim-runc-v1 is a shim used by containerd to launch containers. |
| containerd-shim-runc-v2 | Containerd-shim-runc-v2 is a shim used by containerd to launch containers. |
| ctr| Ctr is a command line interface for containerd. |
| crictl | Crictl is a command line interface for CRI-compatible container runtimes. |
| runc | Runc is a CLI tool for spawning and running containers according to the OCI specification. |


### Container Network Interface Components

| **Component** | **Description** |
| --- | --- |
| Calico | Calico is a Container Network Interface plugin that provides networking and network policy for Kubernetes clusters. |

### Container Storage Interface Components

| **Component** | **Description** | 
| --- | --- |
| AWS EBS CSI | AWS EBS CSI is a CSI plugin that provides storage for Kubernetes clusters. | 
| vSphere CSI | vSphere CSI is a CSI plugin that provides storage for Kubernetes clusters. |
| Longhorn CSI | Longhorn CSI is a CSI plugin that provides storage for Kubernetes clusters. Longhorn is the only supported CSI for PXKE. |

<br />


##### AWS EBS CSI Components

| **Component** | **Description** |
| --- | --- |
| Driver| The driver is a CSI plugin that provides storage for Kubernetes clusters. |
| External Attacher | The external attacher is a CSI plugin that attaches volumes to nodes. |
| External Provisioner | The external provisioner is a CSI plugin that provisions volumes. |
| External Resizer | The external resizer is a CSI plugin that resizes volumes. |
| External Snapshotter | The external snapshotter is a CSI plugin that takes snapshots of volumes. |
| Liveness Probe | The liveness probe is a CSI plugin that checks the health of the driver. |
| Node Driver Registrar | The node driver registrar is a CSI plugin that registers the driver with the kubelet. |

<br />

##### Longhorn CSI Components

| **Component**                 | **Description**  |
|---------------------------|--------------|
| Backing image manager     | Manages backing images for Longhorn volumes. |
| Attacher              | Handles attaching and detaching of volumes to nodes. |
| Provisioner           | Manages provisioning and de-provisioning of storage resources. |
| Resizer               | Enables resizing of storage volumes. |
| Snapshotter           | Manages snapshots of Longhorn volumes. |
| Node driver registrar | Registers the CSI driver with the Kubernetes node. |
| Liveness probe            | Monitors health of CSI components. |
| Longhorn engine           | Core component that handles read and write operations to the storage backend. |
| Longhorn instance manager | Manages Longhorn engine and replica instances. |
| Longhorn share manager    | Manages shared volumes and exposes them via protocols like Network File System (NFS). |
| Longhorn UI               | User interface for managing Longhorn components and resources. |
| Longhorn support bundle kit| Collects logs and system information for debugging. |



<InfoBox>

The Longhorn Manager component is partially FIPS-compliant. This component uses utiltities that are not using a FIPS-compliant version of OpenSSL. The following utilities are not FIPS-compliant:

- openssl
- curl
- nfs-utils
- bind-tools


</InfoBox>


<br />


