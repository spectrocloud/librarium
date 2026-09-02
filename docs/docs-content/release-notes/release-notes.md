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

## September 6, 2026 - Release 4.10.0 {#release-notes-4.10.0}

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

<!-- https://spectrocloud.atlassian.net/browse/PCP-7083 -->

- Canonical Kubernetes (CK8s) clusters on MAAS now support Network Time Protocol (NTP) server configuration. You can
  configure **NTP Servers** on the cluster's cloud configuration during cluster creation and on Day-2 through the
  Palette UI, API, Terraform provider, and Crossplane provider, on both Palette and Palette VerteX. The servers you
  specify replace the NTP configuration that MAAS provides to each control plane and worker node. Refer to
  [NTP Servers on MAAS Cluster Nodes](../clusters/data-center/maas/architecture.md#ntp-servers-on-maas-cluster-nodes)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7118 -->

- Palette now supports the option to skip worker node upgrades on
  [Azure IaaS](../clusters/public-cloud/azure/create-azure-cluster.md),
  [GCP IaaS](../clusters/public-cloud/gcp/create-gcp-iaas-cluster.md), and
  [Apache CloudStack](../clusters/data-center/cloudstack/create-manage-cloudstack-clusters.md) clusters. For example, if
  you have worker pools running critical databases or real-time processing services, you can enable this option to
  maintain service continuity during control plane upgrades, then schedule
  [worker node updates](../clusters/cluster-management/cluster-updates.md#trigger-worker-node-upgrade) during planned
  maintenance windows.

  The version difference between the control plane and worker nodes must not exceed the
  [N-3 minor version skew supported by Kubernetes](https://kubernetes.io/releases/version-skew-policy/). Palette
  enforces this during cluster profile updates and blocks you from updating if you attempt to exceed the N-3 threshold.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10822 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-11336 -->

- You can now view whether the image pull secret that is specified during install has propagated properly to all
  clusters. Clusters cannot pull security-hardened images from Spectro Cloud's OCI registries until they have the pull
  secret. Refer to
  [Monitor Propagation of the Image Pull Secret](../enterprise-version/system-management/configure-image-pull-secret.md#monitor-propagation)
  for more information.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11712 -->

- The **Host LXD-based control planes** and **Use LXD VMs** toggles in cluster and node configuration now display a
  tooltip clarifying that LXD-based VMs on MAAS are supported only with Palette eXtended Kubernetes clusters. Enabling
  LXD with other Kubernetes distributions results in deployment failures.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11711 -->

- Headlamp, the modern replacement for the deprecated Kubernetes Dashboard, is now available on imported clusters as
  well as Palette-managed clusters.

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

<!-- https://spectrocloud.atlassian.net/browse/PE-9264 -->

- Locally managed Edge clusters in an airgapped environment that use Palette eXtended Kubernetes Edge (PXK-E) or
  Canonical Kubernetes now support decoupled control plane and worker node upgrades. Enable the **Skip worker node
  update (Optional)** toggle on a worker pool in Local UI to hold that pool at its current Kubernetes version while the
  control plane advances, up to the Kubernetes N-3 minor version skew. This reduces how many times worker nodes repave
  when crossing several Kubernetes minor versions. Scale-up on a pool with the toggle enabled is rejected, and disabling
  the toggle repaves the pool to the control plane version. Refer to
  [Decoupled Control Plane and Worker Node Upgrades](../clusters/edge/cluster-management/upgrade-behavior.md#decoupled-control-plane-and-worker-node-upgrades)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-9267 -->

- Airgap content bundle uploads to Edge hosts are now chunked, resumable, and parallel by default. The Palette CLI
  splits the bundle into chunks and transfers them over multiple connections, which shortens upload times for large
  bundles on links with a high bandwidth-delay product, and verifies each chunk with SHA-256. An interrupted upload
  resumes from the chunks the Edge host already holds instead of restarting. You can also stream a bundle straight from
  a signed object store URL with the new `--src-url` flag rather than staging a local copy. The earlier single-stream
  upload remains available with `--legacy`, and the CLI falls back to it automatically against Edge hosts that predate
  chunked upload support. Refer to
  [Upload Content Bundle](../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-8648 -->

- Connected Edge clusters can now use systemd extensions to deliver Kubernetes and Palette Agent binaries at runtime,
  instead of embedding those binaries in the provider image. On operating systems running systemd version 255 or later,
  provider images built with CanvOS 4.10.x exclude the binaries by default, and Stylus 4.10.x delivers them through
  systemd extensions. Set `system.uri: NA` in the BYOOS pack for standard upgrades. The new
  `BUNDLE_K8S_AND_AGENT_PROVIDER` flag in the CanvOS `.arg` file overrides the default when a specific flow requires the
  binaries embedded. Refer to
  [Deliver Kubernetes and Agent Binaries via systemd Extensions](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images/build-provider-images.md#bundle-k8s-and-agent-provider-flag)
  for build and upgrade guidance.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-9268 -->

- The Custom UI appliance install wizard now renders a specific inline error at any field whose value is invalid.
  Sections that contain an invalid field display an "invalid" badge on the section title, and the step counter reads as
  "X of Y complete."

<!-- https://spectrocloud.atlassian.net/browse/PE-9265 -->

- Edge workflows have been updated to Kairos v4.1.2 with `kairos-init` v0.16.x. Day-1 and Day-2 upgrades from earlier
  Kairos builds are supported.

<!-- https://spectrocloud.atlassian.net/browse/PE-8675 -->

- The Palette TUI landing page now signposts initial user setup. When no login user exists on the Edge host, the landing
  page displays the yellow warning **Setup required: press F2 to create login user for ssh and LocalUI**, and the footer
  reads **`<F2> Create login`** instead of **`<F2> Customize`**. Both revert automatically once a login user is created.
  Previously, the landing page did not indicate that a user account was missing, so the F2 shortcut for creating the
  initial login was not discoverable. Refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md)
  for more information.

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

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.10.0 Palette release is
4.10.0. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

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

<!-- https://spectrocloud.atlassian.net/browse/DOC-3117 -->

- Palette CLI is now available for ARM Linux (arm64) and macOS Apple Silicon (arm64).

<!-- https://spectrocloud.atlassian.net/browse/PE-9266 -->

- The Palette CLI now confirms content bundle uploads immediately. Previously, after the upload progress bar reached
  100%, the CLI could stay silent for several minutes while the Edge host unpacked the bundle. The CLI now reports
  upload completion as soon as the transfer finishes.

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
