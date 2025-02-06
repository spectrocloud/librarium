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

## February 15, 2025 - Release 4.6.0

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-6-0}

#### Features

- Palette now supports edit and delete operations on
  [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) in
  non-Edge and connected Edge clusters. Additionally, users can now review and edit the values of Cluster Profile
  Variables when they are applied to existing clusters. Check out the
  [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) guide to
  learn more about this feature.

- [Self-hosted Palette](../enterprise-version/enterprise-version.md) and Dedicated Palette SaaS installations now offer
  complete brand customization. System operators can apply custom logos and color schemes to the instances they manage
  by using the **Customize interface** tab in the **Administration** panel in the system control. Refer to the Customize
  Palette Installation guide to learn more.

- The [Virtual Machine Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) now
  allows TLS configuration for ingress resources, enhancing security through HTTPS access. This capability provides a
  unified and secure setup experience for users managing virtual machine migrations. Refer to the
  [Create Migration Plans](../vm-management/vm-migration-assistant/create-migration-plans.md) guide to learn more.

#### Improvements

- The [rate limit](https://docs.spectrocloud.com/api/introduction/#rate-limits) for Palette API endpoints with a prefix
  of `/v1/cloudconfigs` has been increased to 50 requests per second per IP address, and the maximum burst has been
  increased to 250 requests per second per IP address.

- The propagation of [Azure cloud credentials](../clusters/public-cloud/azure/azure-cloud.md) has been improved to
  ensure that Palette automatically updates cluster secrets. This improvement ensures that clusters with expired
  credentials are updated immediately to prevent disruptions.

#### Deprecations and Removals

### Edge

#### Features

- <TpBadge /> Palette now supports a two node architecture which provides High Availability (HA) mode. Users can access
  this feature by enabling a toggle which enables the high availability mode during cluster configuration. High
  availability mode replaces etcd with Postgres and [Kine](https://github.com/k3s-io/kine). Refer to the Two Node
  Architecture page for further details.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-6-0) for more details.

### Automation

- All Terraform cluster resources now support operations on
  [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) in
  non-Edge and connected Edge clusters. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- Palette will now automatically use the most recent Pack version when no version is specified in Terraform resources.
  This improvement streamlines the user process of identifying and pulling the latest pack versions directly. Versions
  can still be defined explicitly. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- The `--validate` flag of the Palette [EC](../automation/palette-cli/commands/ec.md) command now supports validation of
  airgapped environments. Previously, only environments that have internet access were supported. Refer to the
  [Validate Environment](../automation/palette-cli/commands/ec.md#validate-environment) section for further information.

- The Terraform OCI registry resource, `spectrocloud_registry_oci`, now supports Zarf and Pack
  [OCI Registry](../registries-and-packs/registries/oci-registry/oci-registry.md) types. Previously, only Helm
  registries were supported. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- A new Terraform resource, `spectrocloud_resource_limit`, is now available for managing Palette
  [resource limits](../tenant-settings/palette-resource-limits.md). By default, a resource limit is configured in
  Palette with default values. Users can now update the limits with Terraform. For more information, refer to the
  Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Virtual Machine Orchestrator (VMO)

#### Improvements

The KubeVirt version in use is now v1.4.0. Other minor maintenance updates in support of Kubevirt 1.4.0 are also
included.

### Packs

### Pack Notes

<!-- prettier-ignore-start -->

- Palette support for <VersionedLink text="MicroK8s" url="/integrations/packs/?pack=kubernetes-microk8s" /> 1.29 and 1.30 has been enhanced to provide airgap support, as well as deployment on [MAAS](../clusters/data-center/maas/maas.md) and [AWS](../clusters/public-cloud/aws/aws.md). Additionally, this update validates multi-node control planes.

<!-- prettier-ignore-end -->

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we have added a new image registry that Palette agents will use to pull images as part of . The
  new registry is `us-docker.pkg.dev`. This was [announced](./annoucements.md#implemented-changes) as part of the
  Palette 4.5.3 release. If you have network restrictions in place, ensure that the new registry is allowed. The
  migration of images to this new registry is now complete. Redirects from the old registry to the new registry are in
  place, so no user actions are required at this time. Refer to the
  [Proxy Requirements](../enterprise-version/install-palette/#proxy-requirements) for a complete list of domains that
  must be allowed.

#### Kubernetes

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| K3s                                        | 1.29.13     |
| K3s                                        | 1.30.9      |
| K3s                                        | 1.31.5      |
| K3s                                        | 1.32.1      |
| Kubernetes EKS                             | 1.32        |
| Palette eXtended Kubernetes (PXK)          | 1.29.13     |
| Palette eXtended Kubernetes (PXK)          | 1.30.9      |
| Palette eXtended Kubernetes (PXK)          | 1.31.5      |
| Palette eXtended Kubernetes (PXK)          | 1.32.1      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.13     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.30.9      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.5      |
| RKE2                                       | 1.29.13     |
| RKE2                                       | 1.30.9      |
| RKE2                                       | 1.31.5      |
| RKE2                                       | 1.32.1      |
| RKE2 - Edge                                | 1.29.13     |
| RKE2 - Edge                                | 1.30.9      |
| RKE2 - Edge                                | 1.31.5      |
| RKE2 - Edge                                | 1.32.1      |

#### Add-on Packs

| Pack Name                  | New Version |
| -------------------------- | ----------- |
| AWS Cluster Autoscaler     | 1.31.0      |
| Cilium Tetragon            | 1.3.0       |
| Piraeus Operator           | 2.7.1       |
| Istio                      | 1.24.0      |
| Open Policy Agent          | 3.18.1      |
| Volume Snapshot Controller | 8.2.0       |

#### FIPS Packs

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| Palette eXtended Kubernetes (PXK)          | 1.29.13     |
| Palette eXtended Kubernetes (PXK)          | 1.30.9      |
| Palette eXtended Kubernetes (PXK)          | 1.31.5      |
| Palette eXtended Kubernetes (PXK)          | 1.32.1      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.13     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.30.9      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.5      |
| RKE2                                       | 1.29.13     |
| RKE2                                       | 1.30.9      |
| RKE2                                       | 1.31.5      |
| RKE2                                       | 1.32.1      |
| RKE2 - Edge                                | 1.29.13     |
| RKE2 - Edge                                | 1.30.9      |
| RKE2 - Edge                                | 1.31.5      |
| RKE2 - Edge                                | 1.32.1      |
