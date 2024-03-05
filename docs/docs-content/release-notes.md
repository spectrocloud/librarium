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
  the VerteX instance. The feature helps organizations embrace the separation of duties by delegating different
  responsibilities to system administrators. Refer to the
  [System Administrators](./vertex/system-management/account-management/account-management.md#system-administrators)
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

- Imported clusters now have support for updating network proxy configurations as a day-2 operation.

#### Known Issues

- Conducting cluster node scaling operations on a cluster undergoing a backup can lead to issues and potential
  unresponsiveness. To avoid this, ensure that no backup operations are in progress before scaling nodes or performing
  other cluster operations that change the cluster state.

### Edge

#### Breaking Changes

#### Features

#### Improvements

#### Known Issues

### Palette Dev Engine (PDE)

#### Improvements

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

-

### Packs

#### Kubernetes

#### CNI

#### CSI

#### Add-on Packs

#### FIPS Packs

#### Pack Notes

#### Deprecations and Removals

- Check out the [Deprecated Packs](integrations/deprecated-packs.md) page for a list of deprecated packs.
