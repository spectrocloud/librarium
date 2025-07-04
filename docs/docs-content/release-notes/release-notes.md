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

## June 28, 2025 - Release 4.7.X {#release-notes-4.7.0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.7.0}

#### Breaking Changes {#breaking-changes-4.7.0}

- The [log fetcher API endpoints](/api/v1/v-1-cluster-feature-log-fetcher-create/) now only support creating and
  retrieving logs from the following log paths:

  - `/var/log`
  - `/var/log/syslog`
  - `/var/log/cloud-init`

  All other log paths are now unsupported.

  In addition, log downloads are only permitted from the following namespaces:

  - `kube-system`
  - `cluster-<cluster-uid>`

- The Palette UI now supports the configuration of custom Amazon Linux 2023 and Amazon Linux 2 AMIs for AWS EKS nodes.
  Previously, AL2023 AMIs without any customizations were configured using node labels. Refer to the
  [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md) guide for the updated configuration process.

#### Features

- Palette's Artifacts Studio is a unified platform that helps airgapped and regulatory-focused organizations to populate
  their own internal registries with bundles, packs and installers to be used with Palette or VerteX. It provides a
  single location for packs and images, streamlining access and management.
- [Self-hosted Palette](../enterprise-version/enterprise-version.md) can now be installed using the Appliance Framework.
  The Appliance Framework is downloadable as an ISO file and is a solution for installing self-hosted Palette on your
  infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is
  used to boot the nodes, which are then clustered to form a Palette management cluster. This installation mode supports
  both non-airgapped and airgapped environments.
- [Self-hosted Palette](../enterprise-version/enterprise-version.md) now support the configuration of a classification
  banner. System administrators can set the banner text and color through the
  [system console](../enterprise-version/system-management/system-management.md#system-console). Refer to the
  [Banners](../enterprise-version/system-management/login-banner.md) guide for further guidance.

#### Improvements

- Palette now uses [Microsoft Entra ID](../user-management/saml-sso/palette-sso-with-entra-id.md) authentication for
  accessing Azure blob storage during [Azure IaaS](../clusters/public-cloud/azure/azure.md) and
  [Azure AKS](../clusters/public-cloud/azure/aks.md) cluster provisioning.

### Edge

#### Improvements

<!--prettier-ignore-start-->
- Palette now provides enhanced support for upgrades to
<VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" />. This improvement
ensures successful upgrades between minor and patch versions on connected and airgap Edge clusters.
<!--prettier-ignore-end-->
- [Remote shell](../clusters/edge/cluster-management/remote-shell.md) temporary user credentials and the remote shell
  tunnel are now removed after 24 hours of inactivity.The removal of inactive sessions reduces the risk of unauthorized
  access and helps maintain an efficient system.
- The Palette UI now partially obfuscates
  [Edge host registration tokens](../clusters/edge/site-deployment/site-installation/edge-host-registration.md). Users
  must manually reveal the full token using a toggle.
- [Edge Management API](/api/introduction/#edge-management-api) has now exited Tech Preview and is ready for production
  workloads.
- [Cluster Definition](../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md) has now exited Tech
  Preview and is ready for production workloads.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.7.0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- The `content build` command of the [Palette CLI](../automation/palette-cli/palette-cli.md) now includes the
  `--exclude-profiles` flag. This flag allows you to exclude content such as images, charts, or raw files present in the
  listed profiles from the generated content bundle. Additionally, content bundles are now saved to
  `<current-directory>/output/content-bundle/` directory by default, and you can override this location by using the
  `--output` flag. Refer to the [Content](../automation/palette-cli/commands/content.md) command reference page for
  further information.

#### Improvements

- The Terraform resource `spectrocloud_macros` now supports the `terraform import` command. For more information, refer
  to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- The Terraform resource `spectrocloud_cluster_profile` now resolves the `pack_uid` based on the `registry_uid`, `tag`,
  and `name` fields. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Virtual Machine Orchestrator (VMO)

#### Improvements

- Configuration adjustments have been made to improve the compatibility of the
  [Virtual Machine Orchestrator](../vm-management/vm-management.md) with
  [self-hosted Palette](../enterprise-version/enterprise-version.md) installations.

- The KubeVirt version in use is now v1.5.0. Other components of the VMO pack have have also been upgraded, enhancing
  system reliability and security.

### Packs

#### Pack Notes

<!--prettier-ignore-start-->
- Palette VerteX now supports Zot OCI-native container image registries through the
<VersionedLink text="Zot Registry" url="/integrations/packs/?pack=zot-registry" /> pack.
<!--prettier-ignore-end-->

#### Kubernetes

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Palette Optimized Canonical              | 1.32.5      |
| Palette Optimized K3s                    | 1.33.1      |
| Palette Optimized K3s                    | 1.32.4      |
| Palette Optimized K3s                    | 1.31.8      |
| Palette Optimized K3s                    | 1.30.12     |
| Palette eXtended Kubernetes              | 1.32.4      |
| Palette eXtended Kubernetes              | 1.31.8      |
| Palette eXtended Kubernetes              | 1.30.12     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.33.1      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.32.4      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.31.8      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.30.12     |
| Palette Optimized RKE2                   | 1.33.1      |
| Palette Optimized RKE2                   | 1.32.4      |
| Palette Optimized RKE2                   | 1.31.8      |
| Palette Optimized RKE2                   | 1.30.12     |
| RKE2                                     | 1.32.7      |
| RKE2                                     | 1.31.8      |
| RKE2                                     | 1.30.12     |

#### CNI

| Pack Name      | New Version |
| -------------- | ----------- |
| Calico         | 3.30.1      |
| Calico (Azure) | 3.30.1      |
| Calico (FIPS)  | 3.30.1      |

#### CSI

| Pack Name      | New Version |
| -------------- | ----------- |
| Amazon EBS CSI | 1.43.0      |
| Amazon EFS     | 2.1.7       |
| Amazon EFS     | 2.1.8       |

#### Add-on Packs

| Pack Name                    | New Version |
| ---------------------------- | ----------- |
| AWS Application Loadbalancer | 2.13.2      |
| Amazon EFS                   | 2.1.7       |
| Amazon EFS                   | 2.1.8       |
| External Secrets Operator    | 0.17.0      |
| Reloader                     | 1.4.2       |
| Vault                        | 0.30.0      |

#### FIPS Packs

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Calico                                   | 3.30.1      |
| Calico (FIPS)                            | 3.30.1      |
| Palette eXtended Kubernetes              | 1.32.4      |
| Palette eXtended Kubernetes              | 1.31.8      |
| Palette eXtended Kubernetes              | 1.30.12     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.33.1      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.32.4      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.31.8      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.30.12     |
| Palette Optimized RKE2                   | 1.33.1      |
| Palette Optimized RKE2                   | 1.32.4      |
| Palette Optimized RKE2                   | 1.31.8      |
| Palette Optimized RKE2                   | 1.30.12     |
| RKE2                                     | 1.32.7      |
| RKE2                                     | 1.31.8      |
| RKE2                                     | 1.30.12     |
