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

## April 13, 2024 - Release 4.3.0

This release contains several new exciting Technical Preview features, including the Edge Local UI and Cluster Profile
variables. Other notable features include enhancements to the Palette CLI, support for deploying Konvoy clusters, Azure
AKS support for VerteX, and adding multiple system administrators to the Palette and VerteX system consoles. Check out
the following sections for a complete list of features, improvements, and known issues.

### Security Notices

- Kubernetes version 1.27.9 is deprecated due to a security vulnerability. We recommend upgrading to a newer version of
  Kubernetes, such as 1.27.11, to avoid issues.

- Review the [Security Bulletins](./security-bulletins/cve-reports.md) page for the latest security advisories.

### Palette

#### Features

<!-- prettier-ignore -->
- <TpBadge /> Cluster Profile variables, a new feature that allows you to define variables in a cluster profile. This
  feature is in Tech Preview and is available only for Edge clusters using Local UI. Profile variables allow you to define variable
  types, apply validation, and narrow the scope of variables to a cluster profile. 
  Check out [Cluster Profile Variables](./profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) to learn more about
  profile variables.

- MAAS clusters using Palette eXtended Kubernetes (PXK) now support the ability to specify a custom MAAS API endpoint
  URL and port during cluster creation. This feature allows you to use a custom DNS server or Virtual IP (VIP) that is
  not resolvable outside of the MAAS network. Refer to the [PXK](./integrations/kubernetes.md#custom-maas-endpoint)
  documentation for more details.

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

- <TpBadge /> Nutanix cluster deployments now display YAML variables and expose them as input fields in the User
  Interface (UI) during the cluster deployment process. Previously, the UI did not display the YAML variables for
  Nutanix clusters and users had to update the machine template YAML manually. You can learn more about Nutanix in the
  [Create and Manage Nutanix Cluster](./clusters/data-center/nutanix/create-manage-nutanix-cluster.md) guide.

- The cluster deployment user flow experience has been improved to streamline the cluster creation process. You can now
  select between IaaS and managed Kubernetes clusters from the initial platform selection screen. The update combines
  the selection of platform and type of Kubernetes cluster while also detecting and notifying if a prerequisite is not
  met.

- When installing a Private Cloud Gateway (PCG) or a self-hosted Palette instance through the Palette CLI, you can now
  benefit from additional checks and user feedback that ensure the installation process is successful. This new feedback
  experience gives you a better understanding of the components being installed and the progress of the installation. In
  case of a failure, the failed component is highlighted, and an error message is displayed.

- Imported clusters now support updating network proxy configurations as a Day-2 operation.

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

- Cox Edge has been removed as a supported platform for Edge clusters. Cox stopped supporting the platform and is no
  longer available for new deployments. All Cox Edge-related resources and API endpoints have been removed.

- PCG deployments using the Palette CLI for MAAS and VMware vSphere now use Kubernetes version 1.27.11. Palette CLI
  installs targeting an OpenStack environment will use Kubernetes version 1.24.10. Existing PCG clusters installed
  through Palette CLI will be eligible for a cluster profile update. We recommend you review the
  [Upgrade a PCG](./clusters/pcg/manage-pcg/pcg-upgrade.md) guide to learn more about updating a PCG.

- Self-hosted Palette instances now use Kubernetes version 1.27.11. This new version of Kubernetes will cause node
  repave events during the upgrade process. If you have multiple self-hosted Palette instances in a VMware environment,
  take a moment and review the [Known Issues](#known-issues) section below for potential issues that may arise during
  the upgrade process.

#### Known Issues

- Conducting cluster node scaling operations on a cluster undergoing a backup can lead to issues and potential
  unresponsiveness. To avoid this, ensure no backup operations are in progress before scaling nodes or performing other
  cluster operations that change the cluster state.

- Palette automatically creates a security group for worker nodes using the format `<cluster-name>-node`. If a security
  group with the same name already exists in the VPC, the cluster creation process fails. To avoid this, ensure that no
  security group with the same name exists in the VPC before creating a cluster.

- K3s version 1.27.7 has been marked as _Deprecated_. This version has a known issue that causes clusters to crash.
  Upgrade to a newer version of K3s to avoid the issue, such as versions 1.26.12, 1.28.5, and 1.27.11. You can learn
  more about the issue in the [K3s GitHub issue](https://github.com/k3s-io/k3s/issues/9047).

- When deploying a multi-node AWS EKS cluster with the Container Network Interface (CNI)
  [Calico](https://docs.spectrocloud.com/integrations/calico), the cluster deployments fail. A workaround is to use the
  AWS VPC CNI in the interim while the issue is resolved.

- If a Kubernetes cluster deployed onto VMware is deleted, and later re-created with the same name, the cluster creation
  process fails. The issue is caused by existing resources remaining inside PCG, or System PCG, that are not cleaned up
  during the cluster deletion process. Refer to the
  [VMware Resources Remain After Cluster Deletion](./troubleshooting/pcg.md#scenario---vmware-resources-remain-after-cluster-deletion)
  troubleshooting guide for resolution steps.

  <!-- prettier-ignore -->

- In a VMware environment, self-hosted Palette instances do not receive a unique cluster ID when deployed, which can
  cause issues during a node repave event, such as a Kubernetes version upgrade. Specifically, Persistent Volumes (PVs)
  and Persistent Volume Claims (PVCs) will experience start problems due to the lack of a unique cluster ID. To resolve
  this issue, refer to the
  [Volume Attachment Errors Volume in VMware Environment](./troubleshooting/palette-upgrade.md#volume-attachment-errors-volume-in-vmware-environment)
  troubleshooting guide.

### Edge

#### Breaking Changes

- Edge hosts now require a minimum storage capacity of 100 GB. The previous minimum storage capacity was 60 GB. Refer to
  the [Minimum Device Requirements](./clusters/edge/architecture.md#minimum-device-requirements) page to learn more
  about the minimum requirements for Edge hosts.

#### Features

- The Edge Local UI is a new feature that provides a local management interface for Edge clusters in an airgap
  environment. The local UI is a web-based interface that allows you to manage Edge hosts in your network locally,
  upload content bundles containing images, Helm charts, and packs, and create Edge clusters locally in disconnected
  environments without connections to a Palette instance. To get started with local UI, refer to the
  [Edge Local UI](./clusters/edge/local-ui/local-ui.md) documentation.

<!-- prettier-ignore -->
- <TpBadge /> Edge hosts using a local [image registry through Harbor](./integrations/harbor-edge.md) can now also use a
  [private external image registry](./clusters/edge/site-deployment/deploy-custom-registries/deploy-external-registry.md) alongside the local
  registry. The feature allows the cluster to pull image from a private external image registry and store them in the
  local registry. Images for the add-on layers of the cluster will be pulled from the local registry, reducing bandwidth
  needs and improving service availability.

#### Improvements

- Improved Edge cluster upgrade experience. In the past, most upgrades would trigger a repave when not always necessary.
  The enhancement applies more intelligence to the upgrade process and determines if a reboot, service reload, or repave
  is required. Refer to the [Edge Cluster Upgrade Behavior](./clusters/edge/upgrade-behavior.md) page to learn more
  about the upgrade behavior.

- New Edge clusters can now retrieve provider images from authenticated registries. Previously, only public registries
  were supported for non-airgapped clusters. Now, you can use authenticated registries to store your provider images and
  retrieve them during cluster deployment. For more information, refer to the
  [Deploy Cluster with a Private Registry](clusters/edge/site-deployment/deploy-custom-registries/deploy-private-registry.md)
  guide.

- Edge hosts using RKE2 as the Kubernetes distribution can now use the
  [network overlay](./clusters/edge/networking/vxlan-overlay.md) feature.

- Edge hosts using a local image registry through Harbor can now turn off image pulls from the local registry through
  namespace annotations. Refer to the
  [Harbor Edge](./integrations/harbor-edge.md#enable-image-download-from-outside-of-harbor) reference page to learn more
  about the feature.

### Virtual Machine Orchestrator (VMO)

#### Improvements

- Internal VMO components, including KubeVirt, KubeVirt Container Data Importer, and Snapshot Controller, have been
  updated to ensure compatibility with the latest versions of KubeVirt and associated components.

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
  itself now support TLS 1.3.

- Multiple system administrators can now be added to the VerteX system console to help manage and maintain the VerteX
  instance. The feature helps organizations embrace the separation of duties by delegating different responsibilities to
  system administrators. Refer to the
  [System Administrators](./vertex/system-management/account-management/account-management.md#system-administrators)
  page to learn more about system administrators.

- The Palette CLI now supports the ability to scan deployed clusters and check for FIPS compliance using the
  `fips-validate` command. The command scans the cluster and reports the FIPS compliance status of images. The command
  also supports checking exposed service endpoints for approved ciphers and TLS versions. Images and service endpoints
  that are not compliant are reported with either a failed or unknown status. Refer to the
  [FIPS Validate](./palette-cli/commands/fips-validate.md) guide to learn more about the command.

- VerteX instances now use Kubernetes version 1.27.11. This new version of Kubernetes will cause node repave events
  during the upgrade process. If you have multiple self-hosted Palette instances in a VMware environment, take a moment
  and review the Palette [Known Issues](#known-issues) section above for potential issues that may arise during the
  upgrade process.

#### Improvements

- Password enforcement for VerteX system administrators has been improved to comply with NIST password specifications,
  NIST 800-53 and NIST 800-63B. Refer to
  [Password Requirements and Security](./vertex/system-management/account-management/credentials.md#password-requirements-and-security)
  page for more details.

### Terraform

#### Features

- Version 0.18.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- A new Getting Started experience is now available for new users. The new experience guides users through the key
  Palette concepts and features to help them get started with Palette. Check out the
  [Getting Started](./getting-started/getting-started.md) page to learn more.

- A new tutorial [Deploy Cluster Profile Updates](./clusters/cluster-management/update-k8s-cluster.md) is now available
  that guides you through the process of updating a cluster profile.

- A new pack, [Hello Universe](https://github.com/spectrocloud/pack-central/tree/main/packs/hello-universe-1.1.1) is now
  available in the Pack community repository.

- A new documentation section for PCG has been added to the Palette documentation. The new section consolidates
  information about the PCG and how to install and configure it. Refer to the
  [Private Cloud Gateway](./clusters/pcg/pcg.md) page to learn more about PCG.

### Packs

#### Pack Notes

- PXK, PXK-E, and RKE2, versions prior to 1.27.x are deprecated. We recommend upgrading to a newer version of Kubernetes
  to support the latest features and security updates.

- K3s versions prior to 1.26.14 are deprecated. We recommend upgrading to a newer version of K3s to support the latest
  features and security updates.

- OpenStack support is limited to Palette eXtended Kubernetes (PXK) for version 1.24.x.

- Local Path Provisioner CSI for Edge is now a [verified pack](./integrations/verified_packs.md).

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
| Palette eXtended Kubernetes (PXK)          | 1.27.9      |
| Palette eXtended Kubernetes (PXK)          | 1.28.5      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.26.12     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.27.9      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.28.5      |
| RKE2 - Edge                                | 1.26.12     |
| RKE2 - Edge                                | 1.27.9      |
| RKE2 - Edge                                | 1.28.5      |

#### Deprecations and Removals

- PXK, PXK-E, and RKE2, versions prior to 1.27.x are deprecated. We recommend upgrading to a newer version of Kubernetes
  to support the latest features and security updates.

- K3s versions prior to 1.26.14 are deprecated. We recommend upgrading to a newer version of K3s to support the latest
  features and security updates.

- Check out the [Deprecated Packs](integrations/deprecated-packs.md) page for a list of deprecated packs.
