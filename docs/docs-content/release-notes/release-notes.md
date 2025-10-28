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

## November 15, 2025 - Release 4.8.X {#release-notes-4.8.0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.8.0}

#### Breaking Changes {#breaking-changes-4.8.0}

- [System configuration API endpoints](/api/v1/system) can now only be accessed using privileged
  [authorization tokens](../user-management/authentication/authorization-token.md). These API endpoints expose critical
  system details, so access to them is strictly enforced. Users with general access authorization tokens are no longer
  able to access these endpoints.

#### Features

#### Improvements

- Project tags are now displayed in the **Project Overview** page and the **Tenant Admin > Projects** page in Palette.
  This improvement allows users to identify projects based on their tags. Refer to the
  [Project Tags](../tenant-settings/projects/projects.md#project-tags) section for more information.

#### Deprecations and Removals

- When creating EKS clusters, the default **Amazon Machine Image (AMI) Type** is now Amazon Linux 2023 (AL2023) Standard
  AMI. This change aligns with the [upcoming deprecation of Amazon Linux 2 (AL2) AMIs](./announcements.md#deprecations).
  A deprecation warning now appears for AL2 AMIs in the **Amazon Machine Image (AMI) Type** drop-down menu within
  [Cloud Configuration Settings](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings).

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.8.X Palette release is 4.8.X.

:::

#### Features

#### Improvements

#### Bug Fixes

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.8.0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.25.X of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.25.X of the
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
