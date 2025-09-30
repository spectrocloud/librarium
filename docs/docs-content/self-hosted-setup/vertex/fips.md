---
sidebar_label: "FIPS Compliance"
title: "FIPS Compliance"
description: "Learn about FIPS compliance in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["vertex", "fips"]
keywords: ["self-hosted", "vertex"]
---

Federal Information Processing Standards (FIPS) is a series of standards developed by the National Institute of
Standards and Technology (NIST) in the United States for computer security and encryption algorithms.

FIPS 140-3 is a specific standard for security requirements for cryptographic modules. It outlines the criteria these
modules must meet to ensure their security and integrity.

Palette VerteX is FIPS 140-3 compliant, which means it uses FIPS 140-3 compliant algorithms and encryption methods. With
its additional security scanning capabilities, Palette VerteX is designed to meet the stringent requirements of
regulated industries. Palette VerteX operates on FIPS-compliant Ubuntu Pro versions.

## FIPS-Compliant Clusters

Palette VerteX provides FIPS-compliant infrastructure components in Kubernetes clusters it deploys. These components
are:

- Operating System (OS)

  :::info

  Ubuntu Pro subscription keys must be obtained independently or purchased through Spectro Cloud. Contact your support
  representative to learn more.

  :::

  - Ubuntu Pro

- Kubernetes

  - Palette eXtended Kubernetes (PXK)
  - Palette eXtended Kubernetes - Edge (PXK-E)

- Container Network Interface (CNI)

  - Calico

- Container Storage Interface (CSI)
  - vSphere CSI

### Management Plane

All services in the management plane are FIPS compiled with Go using
[BoringCrypto libraries](https://pkg.go.dev/crypto/internal/boring) and static linking. Refer to the
[Spectro Cloud Cryptographic Module](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5061)
resource to learn about our NIST certificate.

### FIPS-Compliant Kubernetes

<!-- prettier-ignore-start -->

Our customized version of Kubernetes is FIPS-compliant. Both <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes"/> and <VersionedLink text="Palette eXtended Kubernetes-Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s"/> are compiled with FIPS-compliant compiler and libraries.

:::info

Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes"/> and
<VersionedLink text="Palette eXtended Kubernetes-Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s"/> documentation to learn more about the
each Kubernetes distribution.

:::

<!-- prettier-ignore-end -->

All PXK and PXKE components and supporting open source components are compiled in their native programming language
using language specific FIPS-compliant libraries and static linking. If the component is not available in the form of a
FIPS-compliant binary, we compile it with FIPS-compliant compiler and libraries. The following tables list the
FIPS-compliant components in PXK and PXK-E.

#### Core Kubernetes Components

| **Component**      | **Description**                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| API Server         | The API server is the central management entity that receives all REST requests for the cluster.                               |
| Controller Manager | The controller manager is a daemon that embeds the core control loops shipped with Kubernetes.                                 |
| Scheduler          | The scheduler is a daemon that finds the best node for a pod, based on the scheduling requirements you specify.                |
| Kubelet            | The kubelet is the primary _node agent_ that is deployed on each node.                                                         |
| Kube-proxy         | The kube-proxy is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service concept. |
| Kubeadm            | Kubeadm is a tool built to provide best-practice “fast paths” for creating Kubernetes clusters.                                |
| Kubectl            | Kubectl is a command line interface for issuing commands against Kubernetes clusters.                                          |

#### Auxiliary Kubernetes Components

| **Component**            | **Description**                                                                                                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CoreDNS                  | CoreDNS is a Domain Name System (DNS) server deployed as a cluster DNS service.                                                                                                                                          |
| Etcd                     | Etcd is a distributed key-value store used as Kubernetes’ backing store for all cluster data.                                                                                                                            |
| Metrics Server           | Metrics Server is a scalable, efficient source of container resource metrics for Kubernetes built-in autoscaling pipelines.                                                                                              |
| Ingress Controller       | Nginx is used as the ingress controller. An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and Transport Layer Security (TLS) termination for Kubernetes services. |
| Nginx Server             | The Nginx server is a web server that can also be used as a reverse proxy, load balancer, mail proxy, and HTTP cache.                                                                                                    |
| Nginx Ingress Controller | The Nginx ingress controller uses ConfigMap to store the Nginx configuration.                                                                                                                                            |

#### Runtime Components

| **Component**             | **Description**                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `containerd`              | containerd is an industry-standard container runtime with an emphasis on simplicity, robustness, and portability. |
| `containerd-shim`         | `containerd-shim` is a shim used by containerd to launch containers.                                              |
| `containerd-shim-runc-v1` | `containerd-shim-runc-v1` is a shim used by containerd to launch containers.                                      |
| `containerd-shim-runc-v2` | `containerd-shim-runc-v2` is a shim used by containerd to launch containers.                                      |
| `ctr`                     | Ctr is a command line interface for containerd.                                                                   |
| `crictl`                  | Crictl is a command line interface for CRI-compatible container runtimes.                                         |
| `runc`                    | Runc is a CLI tool for spawning and running containers according to the OCI specification.                        |

#### Container Network Interface Components

| **Component** | **Description**                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Calico        | Calico is a Container Network Interface plugin that provides networking and network policy for Kubernetes clusters. |

#### Container Storage Interface Components

| **Component** | **Description**                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| AWS EBS CSI   | AWS EBS CSI is a CSI plugin that provides storage for Kubernetes clusters.                                               |
| vSphere CSI   | vSphere CSI is a CSI plugin that provides storage for Kubernetes clusters.                                               |
| Longhorn CSI  | Longhorn CSI is a CSI plugin that provides storage for Kubernetes clusters. Longhorn is the only supported CSI for PXKE. |

##### AWS EBS CSI Components

| **Component**         | **Description**                                                                       |
| --------------------- | ------------------------------------------------------------------------------------- |
| Driver                | The driver is a CSI plugin that provides storage for Kubernetes clusters.             |
| External Attacher     | The external attacher is a CSI plugin that attaches volumes to nodes.                 |
| External Provisioner  | The external provisioner is a CSI plugin that provisions volumes.                     |
| External Resizer      | The external resizer is a CSI plugin that resizes volumes.                            |
| External Snapshotter  | The external snapshotter is a CSI plugin that takes snapshots of volumes.             |
| Liveness Probe        | The liveness probe is a CSI plugin that checks the health of the driver.              |
| Node Driver Registrar | The node driver registrar is a CSI plugin that registers the driver with the kubelet. |

##### Longhorn CSI Components

| **Component**               | **Description**                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Backing image manager       | Manages backing images for Longhorn volumes.                                          |
| Attacher                    | Handles attaching and detaching of volumes to nodes.                                  |
| Provisioner                 | Manages provisioning and de-provisioning of storage resources.                        |
| Resizer                     | Enables resizing of storage volumes.                                                  |
| Snapshotter                 | Manages snapshots of Longhorn volumes.                                                |
| Node driver registrar       | Registers the CSI driver with the Kubernetes node.                                    |
| Liveness probe              | Monitors health of CSI components.                                                    |
| Longhorn engine             | Core component that handles read and write operations to the storage backend.         |
| Longhorn instance manager   | Manages Longhorn engine and replica instances.                                        |
| Longhorn share manager      | Manages shared volumes and exposes them via protocols like Network File System (NFS). |
| Longhorn UI                 | User interface for managing Longhorn components and resources.                        |
| Longhorn support bundle kit | Collects logs and system information for debugging.                                   |

## FIPS Status Icons

While Palette VerteX brings FIPS 140-3 cryptographic modules to the Palette management platform and deployed clusters,
it also provides the capability to consume features that are not FIPS compliant. For example, when the cluster import
option is enabled, it allows users to import any type of Kubernetes cluster, including some that are not fully FIPS
compliant. Similarly, when the option to add non-FIPS add-on packs is enabled, users can add packs in cluster profiles
that are not FIPS compliant. For more information about these tenant-level settings, refer to
[Enable non-FIPS Settings](../system-management/enable-non-fips-settings/enable-non-fips-settings.md).

To avoid confusion and compliance issues, Palette VerteX displays icons to indicate the FIPS compliance status of
clusters, profiles, and packs.

The table lists icons used to indicate FIPS compliance status. The partial FIPS compliance icon applies only to clusters
and profiles because these may contain packs with an _Unknown_ or _Not FIPS-compliant_ status.

| **Icon**                                                            | **Description**                                                                                        | **Applies to Clusters** | **Applies to Profiles** | **Applies to Packs** |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- | ----------------------- | -------------------- |
| ![Full FIPS compliance](/vertex_fips-status-icons_compliant.webp)   | Full FIPS compliance. All packs in the cluster are FIPS-compliant.                                     | ✅                      | ✅                      | ✅                   |
| ![Partial FIPS compliance](/vertex_fips-status-icons_partial.webp)  | Partial FIPS compliance. Some packs are FIPS compliant, but there is at least one that is not.         | ✅                      | ✅                      | ❌                   |
| ![Not FIPS-compliant](/vertex_fips-status-icons_not-compliant.webp) | Not FIPS-compliant. None of the packs in the cluster are FIPS-compliant.                               | ✅                      | ✅                      | ✅                   |
| ![Unknown FIPS state](/vertex_fips-status-icons_unknown.webp)       | Unknown state of FIPS compliance. This applies to imported clusters that were not deployed by Palette. | ✅                      | ✅                      | ✅                   |

<!-- As shown in the screenshots below, FIPS status icons are displayed next to packs throughout Palette VerteX.  -->

The screenshots below show how Palette VerteX applies FIPS status icons.

:::tip

When creating a cluster profile, you can filter packs by checking the **FIPS Compliant** checkbox to display only
FIPS-compliant packs.

:::

When you create a profile, icons display next to packs.

![Diagram showing FIPS status icons on profile page.](/vertex_fips-status-icons_icons-on-profile-page.webp)

Icons appear next to each profile layer to indicate FIPS compliance.

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.webp)

In this screenshot, Palette VerteX shows FIPS status for the cluster is partially compliant because one pack in the
profile is not FIPS-compliant.

![Diagram showing FIPS status icons on Cluster Overview page.](/vertex_fips-status-icons_icons-in-cluster-overview.webp)

## Enable Non-FIPS Components

You can deploy non-FIPS-compliant components in your Palette VerteX environment by enabling non-FIPS settings. Refer to
the [Enable non-FIPS Settings](../system-management/enable-non-fips-settings/enable-non-fips-settings.md) guide for more
information.

Something to note when using RKE2 and K3s:

- When we scan the binaries, which we consume directly from Rancher's RKE2 repository, issues are reported for the
  following components. These components were compiled with a Go compiler that is not FIPS-compliant.

  - `container-suseconnect`
  - `container-suseconnect-zypp`
  - `susecloud`

  Since these components are unrelated to Kubernetes and are instead used to access SUSE’s repositories during the
  Docker build process, RKE2 itself remains fully compliant.

  RKE2 is designated as FIPS-compliant per official Rancher
  [FIPS 140-2 Enablement](https://docs.rke2.io/security/fips_support) security documentation. Therefore, Palette VerteX
  designates RKE2 as FIPS-compliant.

- Although K3s is not available as a FIPS-certified distribution, Palette VerteX supports K3s as a Kubernetes
  distribution for Edge clusters.

Palette VerteX uses icons to show FIPS compliance status. For information about Palette VerteX status icons, review
[FIPS Status Icons](fips-status-icons.md).

## Legal Notice

Spectro Cloud has performed a categorization under FIPS 199 with (client/tenant) for the data types (in accordance with
NIST 800-60 Vol. 2 Revision 1) to be stored, processed, and/or transmitted by the Palette Vertex environment.
(client/tenant) maintains ownership and responsibility for the data and data types to be ingested by the Palette Vertex
SaaS in accordance with the agreed upon Palette Vertex FIPS 199 categorization.
