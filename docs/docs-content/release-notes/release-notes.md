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

## May 3, 2026 - Release 4.9.0 {#release-notes-4-9-0}

The following component updates are applicable to this release:

- TBA <!-- omit in toc -->

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-0}

#### Breaking Changes {#breaking-changes-4-9-0}

#### Features

#### Improvements

#### Deprecations and Removals

- Amazon Linux 2 (AL2) AMIs have been disabled in Palette. You will not be able to create new EKS clusters with AL2
  worker nodes. For existing EKS clusters, you must create new worker nodes using AL2023 AMIs. Existing AL2 AMI worker
  nodes will no longer receive bug fixes or security patches. Refer to our
  [Scenario - Unable to Upgrade EKS Worker Nodes from AL2 to AL2023](../troubleshooting/cluster-deployment.md#scenario---unable-to-upgrade-eks-worker-nodes-from-al2-to-al2023)
  guide for help with migrating workloads.

  - In addition, Kubernetes upgrades to v1.33 and later are not supported on EKS clusters with AL2 worker nodes. If you
    want to upgrade your cluster to v1.33 or later, you must first migrate your workloads to AL2023 worker nodes.

- Support for Red Hat Enterprise Linux (RHEL) 8.x in Edge workflows has been deprecated, including FIPS-enabled
  configurations. Use RHEL 9.x or RHEL 10.x instead.

- Support for Ubuntu 20.04 in Edge workflows has been deprecated, including FIPS-enabled configurations. Use Ubuntu
  24.04, as it is FIPS 140-3 compliant.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.0 Palette release is 4.9.0.

:::

#### Features

#### Improvements

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports multiline and dropdown
  [cluster profile variable](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  types.

#### Bug Fixes

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 4.9.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 4.9.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

### Docs and Education

### Packs

#### Pack Notes

#### OS

| Pack Name | New Version |
| --------- | ----------- |

#### Kubernetes

| Pack Name | New Version |
| --------- | ----------- |

#### CNI

| Pack Name | New Version |
| --------- | ----------- |

#### CSI

| Pack Name | New Version |
| --------- | ----------- |

#### Add-on Packs

| Pack Name | New Version |
| --------- | ----------- |

#### FIPS Packs

| Pack Name | New Version |
| --------- | ----------- |

#### Deprecations and Removals
