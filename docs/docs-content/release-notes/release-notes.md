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

- The upgrade experience for MicroK8s has been improved by the introduction of new upgrade strategies. Users can now
  choose between a RollingUpgrade, InPlaceUpgrade, or SmartUpgrade. To learn more about the new upgrade strategies,
  refer to the [MicroK8s pack documentation](../integrations/microk8s.md).

#### Improvements

- You can now upload a custom pack to a self-hosted OCI registry multiple times by using different namespaces in the OCI
  repository.

- This release removes terminology that may be culturally insensitive or create a barrier to inclusion. We removed the
  term "master" from our product and replaced it with "control-plane". This work aligns with the Linux Foundation
  initiative for [Diversity & Inclusivity](https://www.linuxfoundation.org/about/diversity-inclusivity).

#### Bug Fixes

- The issue where Google GKE cluster deployments failed is now resolved. You can now deploy GKE clusters using the
  latest available GKE versions.

#### Deprecations and Removals

- The term _master_ is removed from Palette and replaced with the term, _control plane_. This change is reflected in the
  UI, API and documentation. The following API endpoints are affected as a the payload object `includeMasterMachines` is
  deprecated and replaced with the new object, `includeControlPlaneMachines`:

  - POST `/v1/dashboard/spectroclusters/resources/usage`
  - POST `/v1/dashboard/spectroclusters/resources/cost`
  - POST `/v1/dashboard/spectroclusters/{uid}/resources/consumption`
  - POST `/v1/dashboard/spectroclusters/resources/consumption`
  - GET `/v1/metrics/{resourceKind}/{resourceUid}/values`
  - GET `/v1/metrics/{resourceKind}/values`

  After six months, the `includeMasterMachines` object will be removed from the API. Use the
  `includeControlPlaneMachines` object moving forward.

#### Known Issues

- [MicroK8s](../integrations/microk8s.md) does not support a multi-node cluster deployment and is limited to a
  single-node cluster. As a result, the only supported upgrade strategy is InPlaceUpgrade.

- Clusters using [MicroK8s](../integrations/microk8s.md) as the Kubernetes distribution, the control plane node fails to
  upgrade when using the `InPlaceUpgrade` strategy for sequential upgrades, such as upgrading from version 1.25.x to
  version 1.26.x and then to version 1.27.x. Refer to the
  [Control Plane Node Fails to Upgrade in Sequential MicroK8s Upgrades](../troubleshooting/pack-issues.md)
  troubleshooting guide for resolution steps.

- In clusters using [MicroK8s](../integrations/microk8s.md) as the Kubernetes distribution, using the `RollingUpgrade`
  strategy for clusters with less than three control plane nodes may cause the API server to be down during the
  upgrade, making the cluster inaccessible. A workaround is to deploy clusters with three or more control plane nodes.

### Edge

<!-- prettier-ignore -->
- <TpBadge /> Trusted Boot is an exciting new Edge capability part of the [SENA
  framework](https://www.spectrocloud.com/product/sena). Trusted Boot is a hardware-based security feature that ensures that the system boots securely and that the boot process has
  not been tampered with. Trusted Boot does several significant things, all working in concert, to enhance security: 
  - Ensures that only trusted software can boot on the system. Any modification to any part of the hard disk will be detected. 
  - Encrypts all sensitive data using hardware security Trusted Platform Module (TPM). 
  - Ensures that the TPM will only decrypt sensitive data if the boot process is clean and untampered..

  Unlike similar solutions, Trusted Boot utilizes a secure boot, measured boot, and encryption to protect 
  the booting system far more than other solutions. To learn more about Edge Trusted Boot, check out the
  [Edge Trusted Boot documentation](../clusters/edge/edge.md).

#### Features

#### Improvements

#### Known Issues

### Virtual Machine Orchestrator (VMO)

#### Improvements

- The KubeVirt version in use is now v1.2.0. Other minor maintenance updates in support of Kubevirt 1.2.0 are also
  included.

### VerteX

#### Features

- You can now deploy Palette VerteX using Red Hat Linux Enterprise (RHEL) as the Operating System (OS) for the VerteX
  instance nodes. Using RHEL as the base OS is available for VerteX when deployed to a VMware vSphere environment using
  the Palette CLI. A prompt will ask you to select the OS during the VerteX deployment process. Refer to the Palette
  VerteX installation [guide](../vertex/install-palette-vertex/install-on-vmware/install.md) for more details.

### Terraform

#### Features

- Version 0.19.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- [Palette's Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/latest)
  now has a dedicated documentation section. The new section also includes a few guides on how to deploy a Kubernetes
  clusters using Crossplane. Check out the [Crossplane Provider](../automation/crossplane/crossplane.md) documentation
  for more details.

### Packs

#### Pack Notes

- The BYOOS pack is now available for Palette VerteX deployments. This allows users to bring their own operating system
  (OS) image to deploy VerteX instances. RHEL is the only custom OS supported for VerteX deployments at this time.

- MicroK8s now support of BootCommands, PreRunCommands and PostRunCommands. Our MicroK8s implementation now supports
  boot, preRun and postRun commands on cloud-init. This allows users to execute custom commands before and after their
  MicroK8s deployment processes, providing enhanced flexibility and control over deployment environments.

#### Kubernetes

| Pack | New Version |
| ---- | ----------- |

#### CNI

| Pack | New Version |
| ---- | ----------- |

#### CSI

| Pack | New Version |
| ---- | ----------- |

#### Add-on Packs

| Pack | New Version |
| ---- | ----------- |

#### FIPS Packs

| Pack | New Version |
| ---- | ----------- |

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
