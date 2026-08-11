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

## August 30, 2026 - Release 4.10.0 {#release-notes-4.10.0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.10.0}

#### Breaking Changes {#breaking-changes-4.10.0}

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-7210 -->

- Apache CloudStack support is now generally available. Palette removes the **ApacheCloudStack** feature flag and
  enables Apache CloudStack for all tenants. You can deploy and manage Kubernetes clusters in your Apache CloudStack
  environment through a Private Cloud Gateway (PCG). Refer to
  [Apache CloudStack](../clusters/data-center/cloudstack/cloudstack.md) for more information.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11712 -->

- The **Host LXD-based control planes** and **Use LXD VMs** toggles in cluster and node configuration now display a
  tooltip clarifying that LXD-based VMs on MAAS are supported only with Palette eXtended Kubernetes clusters. Enabling
  LXD with other Kubernetes distributions results in deployment failures.

#### Deprecations and Removals

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.10.0 Palette release is 4.10.0.

:::

#### Features

#### Improvements

#### Bug Fixes

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.10.0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 4.10.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 4.10.0 of the
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
