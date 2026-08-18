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

<!-- https://spectrocloud.atlassian.net/browse/PEM-11143 -->

- Palette now validates user-supplied cluster profile and app profile versions against the
  [Semantic Versioning](https://semver.org) specification when a profile is created or updated through the Palette UI,
  API, Terraform provider, or Crossplane provider. Values such as `1.2.3` and `1.2.3-rc.1` are accepted; values such as
  `2.2.2.develop` or `V0.0.1` that earlier releases accepted are now rejected whenever a version is set --- on create,
  on clone, when creating a new profile version, or when changing the version of an existing profile. Existing profiles
  carrying a malformed version continue to function, and no pre-upgrade or post-upgrade action is required. If you
  update a profile's version to a valid value, later attempts to set a malformed value on that profile fail, including
  reverting to the original value. These new requirements do not apply to external registry and chart tags, including
  Zarf UDS tags. For the accepted format, refer to
  [Version a Cluster Profile](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) and
  [Version an App Profile](../profiles/app-profiles/modify-app-profiles/version-app-profile.md).

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-7210 -->

- Apache CloudStack support is now generally available. Palette removes the **ApacheCloudStack** feature flag and
  enables Apache CloudStack for all tenants. You can deploy and manage Kubernetes clusters in your Apache CloudStack
  environment through a Private Cloud Gateway (PCG). Refer to
  [Apache CloudStack](../clusters/data-center/cloudstack/cloudstack.md) for more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6899 -->

- Canonical Kubernetes (CK8s) clusters on MAAS now support SSH key management. You can configure **SSH Keys** on the
  cluster's cloud configuration during cluster creation and on Day-2 through the Palette UI, API, Terraform provider,
  and Crossplane provider, on both Palette and Palette VerteX. Palette injects the keys into the `spectro` user's
  `~/.ssh/authorized_keys` on every control plane and worker node, and preserves any users that MAAS or the machine
  image already configured. Refer to
  [SSH Keys on MAAS Cluster Nodes](../clusters/data-center/maas/architecture.md#ssh-keys-on-maas-cluster-nodes) for more
  information.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11712 -->

- The **Host LXD-based control planes** and **Use LXD VMs** toggles in cluster and node configuration now display a
  tooltip clarifying that LXD-based VMs on MAAS are supported only with Palette eXtended Kubernetes clusters. Enabling
  LXD with other Kubernetes distributions results in deployment failures.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-11657 -->

- Fixed an issue where using the Palette UI to open and save a
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) created with the API or Terraform could reorder
  its packs, surfacing as unexpected `terraform plan` drift for profiles managed as code.

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

<!-- https://spectrocloud.atlassian.net/browse/PPD-1615 -->

- FIPS-compiled vCluster is now available, letting strict-FIPS tenants provision virtual clusters using FIPS 140-3
  approved cryptography. The FIPS-compiled pack is automatically selected when deploying virtual clusters on VerteX.
- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.10.0) for more details.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11714 -->

- Palette VerteX now invalidates all active JWTs for a session when a user logs out or changes their password.
  Previously, tokens remained valid after logout and could be reused.

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
