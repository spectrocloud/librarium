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

## February 16, 2025 - Release 4.6.0 - 4.6.6

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-6-6}

#### Features

- Palette now supports edit and delete operations on
  [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  in non-Edge and connected Edge clusters. Additionally, you can now review and edit the values of Cluster Profile
  Variables when they are applied to existing clusters. This feature has now exited Tech Preview and is ready to use for
  production workloads. Check out the
  [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  guide to learn more about this feature.

- [Self-hosted Palette](../enterprise-version/enterprise-version.md) installations now offer complete brand
  customization. System operators can apply custom logos and color schemes to the instances they manage by using the
  **Customize interface** tab in the **Administration** panel of the system console. Refer to the
  [Customize Interface](../enterprise-version/system-management/customize-interface.md) guide to learn more.

#### Improvements

- The [rate limit](https://docs.spectrocloud.com/api/introduction/#rate-limits) for Palette API endpoints with a prefix
  of `/v1/cloudconfigs` has been increased to 50 requests per second per IP address, and the maximum burst has been
  increased to 250 requests per second per IP address.

- The propagation of [Azure cloud credentials](../clusters/public-cloud/azure/azure-cloud.md) has been improved to
  ensure that Palette automatically updates cluster secrets. This improvement ensures that clusters with expired
  credentials are updated immediately to prevent disruptions.

### Edge

#### Features

- <TpBadge /> Palette now supports a two-node architecture, which provides a High Availability (HA) mode. Users can
  enable this feature by toggling the high availability mode during cluster configuration. In HA mode, etcd is replaced
  with Postgres and [Kine](https://github.com/k3s-io/kine). Refer to the [Two-Node
  Architecture](../clusters/edge/architecture/two-node.md) page for further details.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-6-6) for more details.

- [Palette VerteX](../vertex/vertex.md) now offers complete brand customization. System operators can apply custom logos
  and color schemes to the instances they manage by using the **Customize interface** tab in the **Administration**
  panel in the system control. Refer to the [Customize Interface](../vertex/system-management/customize-interface.md)
  guide to learn more.

### Automation

#### Features

- Terraform version 0.23.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- All Terraform cluster resources now support
  [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  management in non-Edge and connected Edge clusters. For more information, refer to the Spectro Cloud Terraform
  provider [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- A new Terraform resource, `spectrocloud_resource_limit`, is now available for managing Palette
  [resource limits](../tenant-settings/palette-resource-limits.md). By default, a resource limit is configured in
  Palette with default values. Users can now update the limits with Terraform. For more information, refer to the
  Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

#### Improvements

- Palette will now automatically use the most recent Pack version when no version is specified in Terraform resources.
  This improvement streamlines the user process of identifying and pulling the latest pack versions directly. Versions
  can still be defined explicitly. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- The `--validate` flag of the Palette [EC](../automation/palette-cli/commands/ec.md) command now supports validation of
  airgapped environments. Previously, only environments that had internet access were supported. Refer to the
  [Validate Environment](../automation/palette-cli/commands/ec.md#validate-environment) section for further information.

- The Terraform OCI registry resource, `spectrocloud_registry_oci`, now supports Zarf and Pack
  [OCI Registry](../registries-and-packs/registries/oci-registry/oci-registry.md) types. Previously, only Helm
  registries were supported. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Virtual Machine Orchestrator (VMO)

#### Improvements

- The [Virtual Machine Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) now
  allows TLS configuration for ingress resources, enhancing security through HTTPS access. This capability provides a
  unified and secure setup experience for users managing virtual machine migrations. Refer to the
  [Create a VM Migration Assistant Profile](../vm-management/vm-migration-assistant/create-vm-migration-assistant-profile.md)
  guide to learn more.

- The KubeVirt version in use is now v1.4.0. Other minor maintenance updates in support of Kubevirt 1.4.0 are also
  included.

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->

- Palette's support for <VersionedLink text="MicroK8s" url="/integrations/packs/?pack=kubernetes-microk8s" /> 1.29 and 1.30 has been enhanced to provide airgap support, as well as deployments on [MAAS](../clusters/data-center/maas/maas.md) and [AWS](../clusters/public-cloud/aws/aws.md). Additionally, this update validates multi-node control planes.

<!-- prettier-ignore-end -->

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we have added a new image registry that Palette agents will use to pull images. The new registry
  is `us-docker.pkg.dev`. This was [announced](./annoucements.md#implemented-changes) as part of the Palette 4.5.3
  release. If you have network restrictions in place, ensure that the new registry is allowed. The migration of images
  to this new registry is now complete. Redirects from the old registry to the new registry are in place, so no user
  actions are required at this time. Refer to the
  [Proxy Requirements](../enterprise-version/install-palette/#proxy-requirements) for a complete list of domains that
  must be allowed.

- The Palette eXtended Kubernetes (PXK) version 1.32.1 pack does not currently support
  [AWS](../clusters/public-cloud/aws/aws.md) and [GCP](../clusters/public-cloud/gcp/gcp.md) cluster deployments.

#### Kubernetes

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| K3s                                        | 1.32.1      |
| K3s                                        | 1.31.5      |
| K3s                                        | 1.30.9      |
| K3s                                        | 1.29.13     |
| Kubernetes EKS                             | 1.32        |
| Palette eXtended Kubernetes (PXK)          | 1.32.1      |
| Palette eXtended Kubernetes (PXK)          | 1.31.5      |
| Palette eXtended Kubernetes (PXK)          | 1.30.9      |
| Palette eXtended Kubernetes (PXK)          | 1.29.13     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.5      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.4      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.30.9      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.13     |
| RKE2                                       | 1.32.1      |
| RKE2                                       | 1.31.5      |
| RKE2                                       | 1.30.9      |
| RKE2                                       | 1.29.13     |
| RKE2 - Edge                                | 1.32.1      |
| RKE2 - Edge                                | 1.31.5      |
| RKE2 - Edge                                | 1.30.9      |
| RKE2 - Edge                                | 1.29.13     |
| MicroK8s                                   | 1.30        |
| MicroK8s                                   | 1.29        |

#### CNI

| Pack Name          | New Version |
| ------------------ | ----------- |
| AWS VPC CNI (Helm) | 1.19.2      |
| Calico             | 3.29.2      |
| Calico (Azure)     | 3.29.2      |

#### CSI

| Pack Name               | New Version |
| ----------------------- | ----------- |
| Amazon EBS CSI          | 1.39.0      |
| Amazon EFS              | 2.1.4       |
| Azure Disk CSI Driver   | 1.31.2      |
| GCE Persistent Disk CSI | 1.15.3      |
| Rook-Ceph               | 1.16.2      |

#### Add-on

| Pack Name                  | New Version |
| -------------------------- | ----------- |
| AWS Cluster Autoscaler     | 1.31.0      |
| Cilium Tetragon            | 1.3.0       |
| Istio                      | 1.24.0      |
| Open Policy Agent          | 3.18.1      |
| Volume Snapshot Controller | 8.2.0       |
| ExternalDNS                | 0.15.1      |
| External Secrets Operator  | 0.12.1      |
| Kong                       | 2.47.0      |
| Nvidia GPU Operator        | 24.9.2      |

#### Community

| Pack Name        | New Version |
| ---------------- | ----------- |
| Piraeus Operator | 2.7.1       |

#### FIPS Packs

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| Azure Disk CSI Driver                      | 1.31.2      |
| Azure Disk CSI Driver                      | 1.30.5      |
| Cilium                                     | 1.16.0      |
| Cilium                                     | 1.16.3      |
| Flannel                                    | 0.26.1      |
| Longhorn                                   | 1.7.2       |
| Palette eXtended Kubernetes (PXK)          | 1.32.1      |
| Palette eXtended Kubernetes (PXK)          | 1.31.5      |
| Palette eXtended Kubernetes (PXK)          | 1.30.9      |
| Palette eXtended Kubernetes (PXK)          | 1.29.13     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.5      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.4      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.30.9      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.13     |
| RKE2                                       | 1.32.1      |
| RKE2                                       | 1.31.5      |
| RKE2                                       | 1.30.9      |
| RKE2                                       | 1.29.13     |
| RKE2 - Edge                                | 1.32.1      |
| RKE2 - Edge                                | 1.31.5      |
| RKE2 - Edge                                | 1.30.9      |
| RKE2 - Edge                                | 1.29.13     |
