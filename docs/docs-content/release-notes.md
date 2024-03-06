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

## March 16, 2024 - Release 4.3.0

### Palette

#### Features

- <TpBadge /> Cluster Profile variables, a new feature that allows you to define variables in a cluster profile. This
  feature is in Tech Preview and is available only for Edge clusters. Profile variables allow you to define variable
  types, apply validation, and more. Refer to the Cluster Profile Variables documentation to learn more about profile
  variables.

- MAAS clusters using Palette eXtended Kubernetes (PXK) now support the ability to specify a custom MAAS API endpoint
  URL and port during cluster creation. This feature allows you to use a custom DNS server or Virtual IP (VIP) that is
  not resolvable outside of the MAAS network. Refer to the [PXK](./integrations/kubernetes.md) documentation for more
  details.

- Support for [Konvoy](./integrations/konvoy.md) is now available in Palette. You can create a custom image using the
  Konvoy image builder project and use it to deploy a Konvoy cluster. Check out the
  [Red Hat Linux Enterprise and Konvoy](./byoos/usecases/vmware/konvoy.md) guide to learn how to create a custom image
  and deploy a Konvoy cluster.

- Multiple system administrators can now be added to the self-hosted Palette system console to help manage and maintain
  the Palette instance. The feature helps organizations embrace the separation of duties by delegating different
  responsibilities to system administrators. Refer to the
  [System Administrators](./enterprise-version/system-management/account-management/account-management.md#system-administrators)
  page to learn more about system administrators.

#### Improvements

- <TpBadge /> Nutanix cluster deployments now display YAML variables and exposes them as input fields on the User
  Interface (UI) during the cluster deployment process. Previously, the UI did not display the YAML variables for
  Nutanix clusters and users had to manually update the machine template YAML. You can learn more about Nutanix in the
  [Create and Manage Nutanix Cluster](./clusters/data-center/nutanix/create-manage-nutanix-cluster.md) guide.

- The cluster deployment user flow experience has been improved to streamline the cluster creation process. From the
  initial platform selection screen, you can now select between IaaS and managed Kubernetes clusters. The update
  combines the selection of platform and type of Kubernetes cluster while also detecting and notifying if a prerequisite
  is not met.

- When installing a Private Cloud Gateway (PCG) or a self-hosted Palette instance through the Palette CLI, you can now
  benefit from additional checks and user feedback that ensure the installation process is successful. This new feedback
  experience gives you a better understanding of the components being installed and the progress of the installation. In
  case of a failure, the failed component is highlighted, and an error message is displayed.

- Imported clusters now have support for updating network proxy configurations as a day-2 operation.

- The [Validator AWS](https://github.com/spectrocloud-labs/validator-plugin-aws) plugin now reports IAM permissions
  issues that are caused by
  [Service control policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html).
  Refer to the Palette CLI [Validator](./palette-cli/commands/validator.md) page to learn how to use Validator with the
  Palette CLI.

- Packs that are marked as _Disabled_ are no longer displayed in the cluster profile creation wizard. Existing cluster
  profiles containing disabled packs are not affected and continue to work as expected. Refer to the
  [maintenance policy](./integrations/maintenance-policy.md#pack-deprecations) page to learn more.

- Several enhancements have been added to the Palette CLI [Validator](./palette-cli/commands/validator.md) command that
  improves the user experience. The enhancements include a Validator upgrade feature, a describe subcommand that
  displays results more clearly, an interactive re-configure option, the ability to restart the wizard, and more.

- Cox Edge has been removed as a supported platform for Edge clusters. Cox stopped supporting the platform and the
  platform is longer available for new deployments. All Cox Edge related resources and API endpoints have been removed.

#### Known Issues

- Conducting cluster node scaling operations on a cluster undergoing a backup can lead to issues and potential
  unresponsiveness. To avoid this, ensure that no backup operations are in progress before scaling nodes or performing
  other cluster operations that change the cluster state.

### Edge

#### Breaking Changes

- Edge hosts now require a minimum storage capacity of 100 GB. The previous minimum storage capacity was 60 GB. Refer to
  the [Minimum Device Requirements](./clusters/edge/architecture.md#minimum-device-requirements.md) page to learn more
  about the minimum requirements for Edge hosts.

#### Features

- The Edge Management Console (EMC) is a new feature that provides a local management interface for Edge clusters in an
  airgap environment. The EMC is a web-based interface that allows you to manage Edge hosts in your network locally,
  upload content bundles containing images, Helm charts, and packs, and create Edge clusters locally in disconnected
  environments without connections to a Palette instance. To get started with the EMC, refer to the
  [Edge Management Console](./clusters/edge/edge.md) documentation.

- <TpBadge /> Edge hosts using a local [image registry through Harbor](./integrations/harbor-edge.md) now have the
  ability also use an external image registry alongside the local registry. The feature allows you to use an external
  image registry to pull image that may not be available in the local registry.

#### Improvements

- Improved Edge host upgrade experience. In the past, most upgrades would trigger a repave when not always necessary.
  The enhancement applies more intelligence to the upgrade process and determines if a reboot, service reload, or repave
  is required. Refer to the [Edge Cluster Upgrade Behavior](./clusters/edge/upgrade-behavior.md) page to learn more
  about the upgrade behavior.

- Edge hosts using RKE2 as the Kubernetes distribution can now use the
  [network overlay](./clusters/edge/networking/vxlan-overlay.md) feature.

- Edge hosts using a local image registry through Harbor can now disable image pulls from the local registry through
  namespace annotations. Refer to the
  [Harbor Edge](./integrations/harbor-edge.md#enable-image-download-from-outside-of-harbor) reference page to learn more
  about the feature.

#### Known Issues

### Virtual Machine Orchestrator (VMO)

#### Improvements

- Internal VMO components, including KubeVirt, KubeVirt Container Data Importer, and Snapshot Controller, have been
  updated to ensure compatibility with the latest versions of KubeVirt and its associated components.

### VerteX

#### Features

- VerteX now supports deploying clusters on Azure Kubernetes Service (AKS). Refer to the
  [Create and Manage Azure AKS Cluster](./clusters/public-cloud/azure/aks.md) guide to learn how to deploy an AKS
  cluster.

- Support for [Konvoy](./integrations/konvoy.md) is now available in VerteX. You can create a custom image using the
  Konvoy image builder project and use it to deploy a Konvoy cluster. Check out the
  [Red Hat Linux Enterprise and Konvoy](./byoos/usecases/vmware/konvoy.md) guide to learn how to create a custom image
  and deploy a Konvoy cluster.

- Support for TLS 1.3 is now available in VerteX. Clusters deployed through VerteX and the VerteX instance cluster
  itself now supports TLS 1.3.

- Multiple system administrators can now be added to the VerteX system console to help manage and maintain the VerteX
  instance. The feature helps organizations embrace the separation of duties by delegating different responsibilities to
  system administrators. Refer to the
  [System Administrators](./vertex/system-management/account-management/account-management.md#system-administrators)
  page to learn more about system administrators.

- The Palette CLI now supports the ability to scan deployed clusters and check for FIPS compliance using the
  `fips-validate` command. The command scans the cluster and reports the FIPS compliance status of images. The command
  also supports checking exposed service endpoints for approved ciphers and TLS versions. Images and service endpoints
  that are not compliant are reported with a failed status.

#### Improvements

- Password enforcement for VerteX system administrators has been improved to ensure to comply with NIST password
  specifications, NIST 800-53 and NIST 800-63B. Refer to
  [Password Requirements and Security](./vertex/system-management/account-management/credentials.md#password-requirements-and-security)
  page for more details.

### Terraform

#### Features

- Version 0.18.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- A new tutorial [Deploy Cluster Profile Updates](./clusters/cluster-management/update-k8s-cluster.md) is now available
  that guides you through the process of updating a cluster profile.

- A new pack, [Hello Universe](https://github.com/spectrocloud/pack-central/tree/main/packs/hello-universe-1.1.1) is now
  available in the Pack community repository.

- A new documentation section for PCG has been added to the Palette documentation. The new section consolidates
  information about the PCG and how to install and configure it. Refer to the
  [Private Cloud Gateway](./clusters/pcg/pcg.md) page to learn more about PCG.

### Packs

#### Breaking Changes

- K3s version 1.27.7 is removed from Palette. The reason for the urgent removal is due to an upstream issue that causes
  deployed clusters to error out and become unresponsive. You can learn more about the issue in the
  [K3s GitHub issue](https://github.com/k3s-io/k3s/issues/9047)

#### Kubernetes

| Pack                                       | New Version |
| ------------------------------------------ | ----------- |
| K3s                                        | 1.25.15     |
| K3s                                        | 1.26.10     |
| K3s                                        | 1.27.7      |
| K3s                                        | 1.28.2      |
| Kubernetes AKS                             | 1.28.0      |
| Kubernetes EKS                             | 1.28.0      |
| Kubernetes GKE                             | 1.25.14     |
| Kubernetes GKE                             | 1.25.14     |
| Kubernetes GKE                             | 1.27.6      |
| Palette eXtended Kubernetes (PXK)          | 1.25.15     |
| Palette eXtended Kubernetes (PXK)          | 1.26.10     |
| Palette eXtended Kubernetes (PXK)          | 1.27.7      |
| Palette eXtended Kubernetes (PXK)          | 1.28.3      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.25.15     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.26.10     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.27.7      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.28.2      |
| RKE2                                       | 1.26.11     |
| RKE2                                       | 1.27.8      |
| RKE2                                       | 1.28.2      |

#### CNI

| Pack           | New Version |
| -------------- | ----------- |
| Azure Disk CSI | 1.29.1      |
| AWS EBS CSI    | 1.24.0      |
| Longhorn CSI   | 1.5.3       |
| Nutanix CSI    | 2.6.6       |
| Rook Ceph CSI  | 1.12.7      |
| Portworx CSI   | 3.0.4       |

#### CSI

| Pack        | New Version |
| ----------- | ----------- |
| AWS VPC CNI | 1.15.1      |
| Calico      | 3.26.3      |
| Cilium CNI  | 1.14.3      |
| Flannel     | 0.23.0      |

#### Add-on Packs

| Pack                      | New Version |
| ------------------------- | ----------- |
| ArgoCD                    | 5.46.8      |
| External Secrets Operator | 0.9.7       |
| Flux2 CD                  | 2.10.2      |
| Imageswap                 | 1.5.3       |
| Istio                     | 1.18.2      |
| Kong Ingress              | 2.32.0      |
| MetalLB                   | 0.13.11     |
| Nginx Ingress             | 1.9.4       |
| Nvidia GPU Operator       | 23.9.1      |
| Open Policy Agent         | 3.13.2      |
| Prometheus Grafana        | 51.0.3      |
| Reloader                  | 1.0.43      |
| Spot.io                   | 1.0.117     |

#### FIPS Packs

| Pack                                       | New Version |
| ------------------------------------------ | ----------- |
| Azure CSI Driver                           | 1.28.3      |
| Palette eXtended Kubernetes (PXK)          | 1.25.15     |
| Palette eXtended Kubernetes (PXK)          | 1.26.10     |
| Palette eXtended Kubernetes (PXK)          | 1.27.7      |
| Palette eXtended Kubernetes (PXK)          | 1.28.3      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.25.9      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.26.4      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.27.2      |
| RKE2                                       | 1.26.11     |
| RKE2                                       | 1.27.8      |
| RKE2                                       | 1.28.6      |
| RKE2 - Edge                                | 1.25.2      |
| RKE2 - Edge                                | 1.26.4      |
| RKE2 - Edge                                | 1.27.2      |

#### Pack Notes

- The following two packs are now classified as [Verified packs](./integrations/verified_packs.md) - ArgoCD, and
  Spot.io.

#### Deprecations and Removals

- All Kubernetes 1.25 packs are deprecated.
- All Kubernetes 1.24 packs and prior are disabled.
- Kubernetes packs prior to version 1.25 for Azure AKS and Google GKE are deleted and removed.
- Kubernetes AKS version 1.26 is deprecated.

- Check out the [Deprecated Packs](integrations/deprecated-packs.md) page for a list of deprecated packs.
