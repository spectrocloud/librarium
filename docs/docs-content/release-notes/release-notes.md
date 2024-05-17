---
sidebar_label: "Release Notes"
title: "Release Notes"
description: "Spectro Cloud release notes for Palette and its sub-components."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "audits"
tags: ["release-notes"]
---

<ReleaseNotesVersions />

## Jun 1, 2024 - Release 4.4.0 - 4.4.X

Sit et beatae expedita rerum odit ullam quos id non voluptas quae et nisi. Est commodi excepturi accusamus sed incidunt
doloribus. Praesentium qui accusantium amet. Eaque voluptates impedit sint amet omnis delectus velit tempora eos maxime
laudantium corporis iure. Nesciunt nihil et asperiores dolore suscipit dolor architecto. Fugit distinctio iste maxime
saepe ut fugit ea ut architecto quae consequatur.

### Security Notices

- Review the [Security Bulletins](../security-bulletins/security-bulletins.md) page for the latest security advisories.

### Palette

#### Breaking Changes

- Google Cloud Platform (GCP) does not support the ability for users to specify a patch version for the Kubernetes
  version used in GKE clusters. In this release, Palette aligns with GCP's behavior and removes the ability to specify a
  patch version when creating a cluster profile for GKE. Only the major and minor versions are available for selection.

#### Features

#### Improvements

#### Deprecations and Removals

#### Known Issues

- At this time, [MicroK8s](../integrations/microk8s.md) does not support multi-node control plane clusters. Therefore,
  the `InPlaceUpgrade` strategy is the only one available for use.

- In clusters using [MicroK8s](../integrations/microk8s.md) as the Kubernetes distribution, the control plane node fails
  to upgrade when using the `InPlaceUpgrade` strategy for sequential upgrades, such as upgrading from version 1.25.x to
  version 1.26.x and then to version 1.27.x. Refer to the
  [Control Plane Node Fails to Upgrade in Sequential MicroK8s Upgrades](../troubleshooting/pack-issues.md)
  troubleshooting guide for resolution steps.

- In clusters using [MicroK8s](../integrations/microk8s.md) as the Kubernetes distribution, using the `RollingUpgrade`
  strategy for clusters with less than three control plane nodes may cause the API server to be down during the
  upgrade, making the cluster inaccessible. A workaround is to deploy clusters with three or more control plane nodes.

### Edge

#### Breaking Changes

#### Features

#### Improvements

#### Known issues

### Virtual Machine Orchestrator (VMO)

#### Improvements

- Internal VMO components, including KubeVirt, KubeVirt Container Data Importer, and Snapshot Controller, have been
  updated to ensure compatibility with the latest versions of KubeVirt and associated components.

### VerteX

#### Features

#### Improvements

### Terraform

#### Features

- Version 0.19.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

-

### Packs

#### Pack Notes

- Several Kubernetes versions are [deprecated](../integrations/maintenance-policy.md#pack-deprecations) and removed in
  this release. Review the [Deprecation](#deprecations-and-removals) section for a list of deprecated packs.

- OpenStack support is limited to Palette eXtended Kubernetes (PXK) for version 1.24.x.

- Local Path Provisioner CSI for Edge is now a [verified pack](../integrations/verified_packs.md).

#### Kubernetes

| Pack                                       | New Version |
| ------------------------------------------ | ----------- |
| K3s                                        | 1.26.14     |
| K3s                                        | 1.27.11     |
| K3s                                        | 1.28.7      |
| K3s                                        | 1.29.2      |
| Konvoy                                     | 1.27.6      |
| Palette eXtended Kubernetes (PXK)          | 1.29.0      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.0      |
| RKE2                                       | 1.29.0      |
| RKE2 - Edge                                | 1.26.14     |
| RKE2 - Edge                                | 1.27.11     |
| RKE2 - Edge                                | 1.28.7      |
| RKE2 - Edge                                | 1.29.3      |

#### CNI

| Pack        | New Version |
| ----------- | ----------- |
| AWS VPC CNI | 1.15.5      |
| Calico      | 3.27.0      |
| Cilium OSS  | 1.13.12     |
| Cilium OSS  | 1.14.7      |
| Cilium OSS  | 1.15.1      |
| Flannel     | 0.24.0      |

#### CSI

| Pack                                | New Version   |
| ----------------------------------- | ------------- |
| AWS EBS CSI                         | 1.26.1        |
| GCE Persistent Disk Driver          | 1.12.4        |
| Local Path Provisioner CSI for Edge | 0.0.25        |
| Longhorn CSI                        | 1.6.0         |
| Rook Ceph (manifests)               | 1.13.1        |
| vSphere CSI                         | 3.1.0 , 3.1.2 |

#### Add-on Packs

| Pack                          | New Version |
| ----------------------------- | ----------- |
| AWS Application Load Balancer | 2.6.2       |
| Cilium Tetragon               | 0.10.1      |
| Cluster Autoscaler for AWS    | 1.27.5      |
| Cluster Autoscaler for AWS    | 1.28.2      |
| External DNS                  | 0.13.6      |
| External Secrets Operator     | 0.9.11      |
| HashiCorp Vault               | 0.27.0      |
| Istio                         | 1.20.1      |
| MetalLB                       | 0.13.12     |
| Nginx Ingress                 | 1.9.5       |
| Prometheus Grafana            | 55.8.3      |

#### FIPS Packs

| Pack                                       | New Version |
| ------------------------------------------ | ----------- |
| AKS                                        | 1.27        |
| AKS                                        | 1.28        |
| AWS EBS CSI                                | 1.26.1      |
| Calico CNI                                 | 3.26.3      |
| Konvoy                                     | 1.27.6      |
| Palette eXtended Kubernetes (PXK)          | 1.26.12     |
| Palette eXtended Kubernetes (PXK)          | 1.27.11     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.26.12     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.27.11     |
| RKE2 - Edge                                | 1.26.12     |

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
