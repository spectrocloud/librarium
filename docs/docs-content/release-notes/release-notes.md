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

## August 16, 2025 - Release 4.7.X {#release-notes-4.7.a}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.7.a}

#### Breaking Changes {#breaking-changes-4.7.a}

- Availability zones are now required when creating MAAS [node pools](../clusters/cluster-management/node-pool.md).
  - For [MAAS clusters](../clusters/data-center/maas/create-manage-maas-clusters.md) deployed prior to Palette version
    4.7.a, selecting an availability zone is required when creating a new node pool; however, selecting an availability
    zone is _not_ required when modifying an existing node pool, as modifying availability zones post-cluster deployment
    will trigger a [node pool repave](../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration).
  - For MAAS clusters deployed prior to 4.7.a, we recommend creating a new node pool with an availability zone selected
    and migrating existing workloads to the new node pool when convenient. For guidance on migrating workloads, refer to
    the [Taints and Tolerations](../clusters/cluster-management/taints.md) guide.

#### Features

<!-- prettier-ignore-start -->

- Amazon EKS node customization is now supported for custom AMIs, such as Amazon Linux 2 (AL2) and Amazon Linux 2023 (AL2023).
  This feature allows you to provide pre- and post-[kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/)
  commands for AL2, and provide [user data](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-user-data)
  customization in the form of shell scripts for AL2023. This functionality is provided through the Kubernetes EKS pack.

  Refer to the <VersionedLink text="Node Customization" url="/integrations/packs/?pack=kubernetes-eks&tab=custom#node-customization"/>
  section of the Kubernetes EKS pack for configurable options available for these AMIs. For general guidance on
  deploying EKS clusters, refer to the [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md) guide.

<!-- prettier-ignore-end -->

- Palette now provides a new platform setting for
  [automatic cluster role bindings](../clusters/cluster-management/platform-settings/cluster-auto-rbac.md). This feature
  allows Palette to automatically apply the appropriate Kubernetes cluster role bindings based on user roles, ensuring
  that Role-Based Access Control (RBAC) permissions are consistently applied for all deployed clusters.
- <TpBadge /> Palette now supports Canonical Kubernetes using the Ubuntu for Canonical Kubernetes OS pack. This feature
  currently supports the creation of [MAAS clusters](../clusters/data-center/maas/maas.md) with Canonical Kubernetes
  version 1.32. Refer to the [Architecture](../clusters/data-center/maas/architecture.md#palette-maas-distribution) for
  further details.
- [Workspace resource quotas](../workspace/workspace-mgmt/resource-mgmt.md#implement-resource-quotas) and
  [namespace resource quotas](../clusters/cluster-management/namespace-management.md#assign-resource-quotas) now support
  GPU limits. This feature currently supports Nvidia GPUs only.
- Palette now supports the AI pack type. This category streamlines the grouping and finding of AI related packs. Refer
  to the [Packs List](../integrations/integrations.mdx) to search and filter packs.

#### Improvements

- Nodes provisioned through [Karpenter](https://karpenter.sh/docs/) are now visible in Palette and supported for
  read-only operations, such as billing and monitoring. However,
  [Day-2 operations](../clusters/cluster-management/cluster-management.md) are not supported.
- <TpBadge /> The [Artifact Studio](../downloads/artifact-studio.md) has been improved to display a technical preview
  banner on all pages.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.7.a Palette release is 4.7.5.

:::

#### Improvements

- [Remote shell](../clusters/edge/cluster-management/remote-shell.md) has now exited Tech Preview and is ready for
production workloads.
<!-- prettier-ignore-start -->
- The <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" />
distribution now supports virtual network overlays for multi-node clusters deployed with
[agent mode](../deployment-modes/agent-mode/agent-mode.md) or
[appliance mode](../deployment-modes/appliance-mode/appliance-mode.md). Refer to the
[Enable Overlay Network](../clusters/edge/networking/vxlan-overlay.md) guide for further details.
<!-- prettier-ignore-end -->
- The [Kubeconfig](../clusters/cluster-management/kubeconfig.md) file names of Edge clusters deployed with with
  [agent mode](../deployment-modes/agent-mode/agent-mode.md) or
  [appliance mode](../deployment-modes/appliance-mode/appliance-mode.md) now contain the cluster name.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.7.a) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- All cluster Terraform resources now support the `gpu_limit` and `gpu_provider` fields to enforce GPU resource limits.
  For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- The Terraform resource `spectrocloud_workspace` now supports the `gpu_limit` and `gpu_provider` fields to enforce GPU
  resource limits. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- Terraform version 0.24.1 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.24.1 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/v0.24.1)
  is available.

### Virtual Machine Orchestrator (VMO)

#### Features

- Palette now supports the configuration of a direct address for the **Virtual Machines** dashboard of clusters
  configured using [Virtual Machine Orchestrator](../vm-management/vm-management.md). Refer to the
  [Configure Direct Access to Virtual Machine Dashboard](../vm-management/configure-console-base-address.md) guide for
  further details.

### Packs

#### Pack Notes

- The Spectro Addon Repo registry has been removed from Palette multi-tenant SaaS. Refer to the
  [Default Registries](../registries-and-packs/registries/registries.md#default-registries) for the list of registries
  available to all SaaS tenants.

#### OS

| Pack Name                       | New Version |
| ------------------------------- | ----------- |
| Ubuntu for Canonical K8s (MAAS) | 22.04       |

#### Kubernetes

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Canonical Kubernetes                     | 1.32        |
| GKE                                      | 1.32        |
| Palette eXtended Kubernetes              | 1.32.6      |
| Palette eXtended Kubernetes              | 1.31.10     |
| Palette eXtended Kubernetes              | 1.30.14     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.33.3      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.32.6      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.31.10     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.30.14     |
| Palette Optimized Canonical              | 1.33.2      |
| Palette Optimized Canonical              | 1.32.6      |
| Palette Optimized K3s                    | 1.33.3      |
| Palette Optimized K3s                    | 1.32.6      |
| Palette Optimized K3s                    | 1.31.10     |
| Palette Optimized K3s                    | 1.30.14     |
| Palette Optimized RKE2                   | 1.33.3      |
| Palette Optimized RKE2                   | 1.32.6      |
| Palette Optimized RKE2                   | 1.31.10     |
| Palette Optimized RKE2                   | 1.30.14     |
| RKE2                                     | 1.32.6      |
| RKE2                                     | 1.31.10     |
| RKE2                                     | 1.30.14     |

#### CNI

| Pack Name                  | New Version |
| -------------------------- | ----------- |
| Calico                     | 3.30.2      |
| Calico (Azure)             | 3.30.2      |
| Cilium CNI (Canonical K8s) | 1.16.3      |
| Flannel                    | 0.27.0      |

#### CSI

| Pack Name             | New Version |
| --------------------- | ----------- |
| Amazon EBS CSI        | 1.46.0      |
| Amazon EFS            | 2.1.9       |
| Azure Disk CSI Driver | 1.33.2      |
| Longhorn              | 1.9.0       |
| vSphere CSI           | 3.5.0       |

#### Add-on Packs

| Pack Name                    | New Version |
| ---------------------------- | ----------- |
| Amazon EFS                   | 2.1.9       |
| AWS Application Loadbalancer | 2.13.3      |
| AWS Cluster Autoscaler Helm  | 1.33.0      |
| Cilium Tetragon              | 1.4.1       |
| ExternalDNS                  | 0.18.0      |
| Flux2                        | 2.16.2      |
| Longhorn                     | 1.9.0       |
| Multus CNI Plugin            | 2.2.18      |
| Nvidia GPU Operator          | 25.3.1      |
| Open Policy Agent            | 3.19.2      |
| VMO Namespace Management     | 1.0.3       |
| Zot Registry                 | 0.1.67      |

#### FIPS Packs

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Azure Disk CSI Driver                    | 1.33.2      |
| Calico                                   | 3.30.2      |
| Calico (Azure)                           | 3.30.2      |
| Flannel                                  | 0.27.0      |
| Palette eXtended Kubernetes              | 1.32.6      |
| Palette eXtended Kubernetes              | 1.31.10     |
| Palette eXtended Kubernetes              | 1.30.14     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.33.3      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.32.6      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.31.10     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.30.14     |
| Palette Optimized RKE2                   | 1.33.3      |
| Palette Optimized RKE2                   | 1.32.6      |
| Palette Optimized RKE2                   | 1.31.10     |
| Palette Optimized RKE2                   | 1.30.14     |
| RKE2                                     | 1.32.6      |
| RKE2                                     | 1.31.10     |
| RKE2                                     | 1.30.14     |
| vSphere CSI                              | 3.5.0       |
| Zot Registry                             | 0.1.67      |

## August 4, 2025 - Release 4.7.8

### Bug Fixes

- Fixed an issue that caused [EKS clusters](../clusters/public-cloud/aws/eks.md) using
  [custom AMI images](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings) to be stuck in the Provisioning
  status.
- Fixed an issue that prevented Palette from honoring the `cluster.kubevipArgs.vip_ddns` value on clusters that use
  `kube-vip` to provide a virtual IP address for [Edge](../clusters/edge/edge.md) clusters. Refer to the
  [Publish Cluster Services with Kube-vip](../clusters/edge/networking/kubevip.md) guide for further information.

## July 31, 2025 - Release 4.7.7

<!-- prettier-ignore-start -->

### Improvements

- Clusters provisioned in [controller mode](../deployment-modes/controller-mode.md) using [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io/) now support the configuration of [node taints](../clusters/cluster-management/taints.md).
- The <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> distribution now supports virtual network overlays for single node clusters. Refer to the [Enable Overlay Network](../clusters/edge/networking/vxlan-overlay.md) guide for further details.
- [Locally managed](../clusters/edge/local-ui/local-ui.md) clusters now support [network overlays](../clusters/edge/networking/vxlan-overlay.md).

### Bug Fixes

- Fixed an issue that caused certificates added through the <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" /> pack to be incorrectly added on Edge clusters.
- Fixed an issue that caused [registry mapping rules](../clusters/edge/edge-configuration/installer-reference.md#registry-mapping-rules) to be incorrectly applied for registries configured using the <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" /> pack.
- Fixed an issue that caused masked cluster profile variable values to be displayed as plain text in [Edge Management API](/api/introduction/#edge-management-api) calls.

<!-- prettier-ignore-end -->

## July 23, 2025 - Release 4.7.4

### Bug Fixes

- Fixed an issue where the Palette agent failed to start when using a [MAAS PCG](../clusters/pcg/deploy-pcg/maas.md)
  with the `maas-preferred-subnet` ConfigMap.

## July 19, 2025 - Release 4.7.0 - 4.7.3 {#release-notes-4.7.0}

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

- The Palette UI now supports the configuration of custom Amazon Linux 2023 (AL2023) and Amazon Linux 2 (AL2) AMIs for
  AWS EKS nodes. Previously, default AMI types were configured using node labels. EKS clusters previously deployed with
  **Enable Nodepool Customization** enabled and AMI node labels will be repaved upon upgrading to version 4.7.3. AWS EKS
  clusters that did not specify an AMI type will now use AL2_X86_64 by default. Refer to the
  [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings) guide for the
  updated configuration process.

#### Features

- <TpBadge /> The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)
  is a new method to install self-hosted Palette in your infrastructure environment. It provides a simple and efficient
  way to deploy Palette using an ISO file. The Palette Management Appliance is available for VMware, Bare Metal, and
  Machine as a Service (MAAS) environments.

- <TpBadge /> The [Artifact Studio](../downloads/artifact-studio.md) is a new platform for obtaining bundles, packs, and
  installers relating to Palette Enterprise and Palette VerteX. It provides a single source for these artifacts, which
  you can download and then upload to your registries.

- [Self-hosted Palette](../enterprise-version/enterprise-version.md) now supports the configuration of a classification
  banner. System administrators can set the banner text and color through the
  [system console](../enterprise-version/system-management/system-management.md#system-console). Refer to the
  [Banners](../enterprise-version/system-management/login-banner.md) guide for further guidance.

- All ZST bundles, ISO files, and images in Spectro Cloud-owned registries are now signed using
  [Cosign](https://docs.sigstore.dev/cosign/system_config/installation/), ensuring artifacts are traceable,
  tamper-evident, and aligned with modern compliance frameworks. Generated keys use the FIPS-compliant ECDSA-P256
  cryptographic algorithm for the signature and SHA256 for hashes; keys are stored in PEM-encoded PKCS8 format. Refer to
  the [Artifact Signatures](../security/artifact-signatures/artifact-signatures.md) guide for further information.

#### Improvements

- Palette now supports
  [Azure Entra ID authentication for Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory)
  for [Azure IaaS](../clusters/public-cloud/azure/azure.md) and [AKS](../clusters/public-cloud/azure/aks.md) cluster
  provisioning. Palette still uses
  [Shared Access Signature (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview) by
  default, but if your Azure environment has restrictions that block SAS, Entra ID is automatically used instead.

  To enable this feature, the following `DataActions` have been added to the dynamic and static Azure IaaS permission
  sets:

  - `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`
  - `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`

  These additional permissions are not required for AKS. Refer to the
  [Required Permissions](../clusters/public-cloud/azure/required-permissions.md) guide for all required permissions.

#### Bug Fixes

- Fixed an issue that caused the certificate renewal job to fail once clusters provisioned with Kubernetes 1.28 or older
  are updated to Kubernetes 1.29.
- Fixed an issue that caused resource reconciliation to fail when deleting a pack whose resources have already been
  removed.
- Fixed an issue that restricted cluster tags from containing numbers, spaces, and the following special characters:
  `_`, `.`, `:`, `/`, `=`, `+`, `-`, and `@`.
- Fixed an issue that caused cluster health events to be incorrectly reported in Palette after partial broker service
  outages.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.7.3 Palette release is 4.7.2.

:::

#### Improvements

<!-- prettier-ignore-start -->

- Palette now provides enhanced support for upgrades to
<VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" />. This improvement
ensures successful upgrades between minor and patch versions on connected and airgapped Edge clusters.
<!-- prettier-ignore-end -->
- [Remote shell](../clusters/edge/cluster-management/remote-shell.md) temporary user credentials and the remote shell
  tunnel are now removed after 24 hours of inactivity. The removal of inactive tunnels and credentials reduces the risk
  of unauthorized access and helps maintain an efficient system.
- The Palette UI now partially obfuscates
  [Edge host registration tokens](../clusters/edge/site-deployment/site-installation/edge-host-registration.md). Users
  must manually reveal the full token using a toggle.
- [Edge Management API](/api/introduction/#edge-management-api) has now exited Tech Preview and is ready for production
  workloads.
- [Cluster Definition](../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md) has now exited Tech
  Preview and is ready for production workloads.

#### Bug Fixes

- Fixed an issue that prevented [Edge clusters](../clusters/edge/edge.md) with multi-hyphen Helm chart names from
  provisioning.
- Fixed an issue that caused the `containerd sync` job to perform unnecessary file copying and I/O operations on
  disconnected [Edge clusters](../clusters/edge/edge.md).
- Fixed an issue that caused API calls to add [Edge cluster](../clusters/edge/edge.md) nodes to fail.
- Fixed an issue that caused proxy certificates to be incorrectly shown in
  [Local UI](../clusters/edge/local-ui/local-ui.md).
- Fixed an issue that caused the connection configuration validation in the Palette UI to fail for certain valid
  endpoints and [registration tokens](../clusters/edge/site-deployment/site-installation/edge-host-registration.md).
- Fixed an issue that caused commands to the API delete endpoint to reset Edge hosts actively being provisioned to an
  [Edge cluster](../clusters/edge/edge.md).
- Fixed an issue that caused the `/usr/local` directory on Edge nodes to be repeatedly resized.
- Fixed an issue that prevented new certificates from being reconciled in clusters provisioned with a certificate that
  has recently expired.
- Fixed an issue that prevented the migration of resources from the `system-upgrade` namespace to the
  `system-upgrade-<cluster-uid>` namespace.
- Fixed an issue that caused Palette to incorrectly report the status of successfully installed packs.
- Fixed an issue that caused pods related to [agent mode](../deployment-modes/agent-mode/agent-mode.md) cluster upgrades
  to get stuck in a `Terminating` state.
- Fixed an issue that caused Palette to incorrectly report certificate errors on
  [Edge clusters](../clusters/edge/edge.md).
- Fixed an issue that caused continuous retries on malformed bundles during the deployment of
  [Edge clusters](../clusters/edge/edge.md) instead of initializing a fresh pack download.
- Fixed an issue that caused [Kube-vip](../clusters/edge/networking/kubevip.md) arguments to be incorrectly reconciled
  after cluster creation.

### VerteX

#### Features

- <TpBadge /> The VerteX Management Appliance is a new method to install Palette VerteX in your infrastructure
  environment. It provides a simple and efficient way to deploy Palette VerteX using an ISO file. The VerteX Management
  Appliance is available for VMware, Bare Metal, and Machine as a Service (MAAS) environments. Refer to the VerteX
  Management Appliance guide for further information.

- The Artifact Studio is a new platform for obtaining bundles, packs, and installers relating to Palette Enterprise and
  Palette VerteX. It provides a single source for these artifacts, which you can download and then upload to your
  registries. Refer to the Artifact Studio guide for further information.

- The <VersionedLink text="Zot" url="/integrations/packs/?pack=zot-registry" /> registry is now supported as a primary
  registry for clusters managed by VerteX. Refer to
  [Deploy Cluster with a Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/deploy-primary-registry.md)
  for more information.

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.7.0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Breaking Changes {#breaking-changes-automation-4.7.0}

- A new field `isTwoNodeCluster` has been introduced to the request body of the
  [Updates the cluster configuration information](/api/v1/v-1-cloud-configs-edge-native-uid-cluster-config) API
  endpoint. This field must now be set to `true` before setting the `twoNodeCandidatePriority` field on Edge hosts using
  the
  [Creates an Hybrid AWS cloud config's Edge-Native machine pool](/api/v1/v-1-aws-cloud-configs-edge-native-uid-machine-pool-create/)
  and
  [Updates the specified Hybrid AWS cluster cloud config's Edge-Native machine pool](/api/v1/v-1-aws-cloud-configs-edge-native-machine-pool-update/)
  API endpoints.

#### Features

- The `content build` command of the [Palette CLI](../automation/palette-cli/palette-cli.md) now includes the
  `--exclude-profiles` flag. This flag allows you to exclude content such as images, charts, or raw files present in the
  listed profiles from the generated content bundle. Additionally, content bundles are now saved to the
  `<current-directory>/output/content-bundle/` directory by default; you can override this location by using the
  `--output` flag. Refer to the [Content](../automation/palette-cli/commands/content.md) command reference page for
  further information.
- Terraform version 0.23.8 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.23.9 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/v0.23.9)
  is available. The provider now includes support for [public cloud](../clusters/public-cloud/public-cloud.md),
  [VMware](../clusters/data-center/vmware/vmware.md), and [Canonical MAAS](../clusters/data-center/maas/maas.md)
  clusters.

#### Improvements

- The Terraform resource `spectrocloud_macros` now supports the `terraform import` command. For more information, refer
  to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- The Terraform resource `spectrocloud_cluster_profile` now resolves the `pack_uid` based on the `registry_uid`, `tag`,
  and `name` fields. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

#### Bug Fixes

- Fixed an issue that caused the [Palette CLI `content` command](../automation/palette-cli/commands/content.md) to fail
  to bundle packs content.

### Virtual Machine Orchestrator (VMO)

#### Improvements

- Configuration adjustments have been made to improve the compatibility of the
  [Virtual Machine Orchestrator](../vm-management/vm-management.md) with
  [self-hosted Palette](../enterprise-version/enterprise-version.md) installations. This includes the ability to
  configure a private CA certificate for secure communication. Refer to the
  [Configure Private CA Certificate](../vm-management/configure-private-ca-certificate.md) guide for more details.

- The KubeVirt version in use is now v1.5.0. Other components of the VMO pack have also been upgraded, enhancing system
  reliability and security.

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->

- Palette VerteX now supports Zot OCI-native container image registries through the
<VersionedLink text="Zot Registry" url="/integrations/packs/?pack=zot-registry" /> pack.
<!-- prettier-ignore-end -->

#### Kubernetes

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Palette Optimized Canonical              | 1.33.0      |
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

| Pack Name          | New Version |
| ------------------ | ----------- |
| AWS VPC CNI (Helm) | 1.19.5      |
| Calico             | 3.30.1      |
| Calico (Azure)     | 3.30.1      |
| Calico (FIPS)      | 3.30.1      |
| Cilium             | 1.17.4      |
| Cilium             | 1.16.10     |
| Flannel            | 0.27.0      |
| Flannel            | 0.26.7      |

#### CSI

| Pack Name        | New Version |
| ---------------- | ----------- |
| Amazon EBS CSI   | 1.43.0      |
| Amazon EFS       | 2.1.7       |
| Amazon EFS       | 2.1.8       |
| Longhorn         | 1.8.1       |
| Piraeus Operator | 2.8.1       |
| Portworx         | 3.3.1       |
| vSphere CSI      | 3.4.0       |

#### Add-on Packs

| Pack Name                    | New Version |
| ---------------------------- | ----------- |
| AWS Application Loadbalancer | 2.13.2      |
| Amazon EFS                   | 2.1.7       |
| Amazon EFS                   | 2.1.8       |
| Argo CD                      | 8.0.1       |
| Argo CD                      | 7.9.0       |
| ExternalDNS                  | 0.16.1      |
| External Secrets Operator    | 0.17.0      |
| Istio                        | 1.26.0      |
| Istio                        | 1.25.1      |
| Kong                         | 2.48.0      |
| MetalLB                      | 0.15.2      |
| Nginx                        | 1.12.2      |
| Open Policy Agent            | 3.18.3      |
| Open Observe                 | 0.14.7      |
| Open Telemetry               | 0.127.0     |
| PostgreSQL                   | 1.22.1      |
| Reloader                     | 1.4.2       |
| Vault                        | 0.30.0      |

#### FIPS Packs

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| AWS VPC CNI (Helm)                       | 1.19.5      |
| Calico                                   | 3.30.1      |
| Calico (FIPS)                            | 3.30.1      |
| Cilium                                   | 1.17.4      |
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
| Piraeus Operator                         | 2.8.1       |
| RKE2                                     | 1.32.7      |
| RKE2                                     | 1.31.8      |
| RKE2                                     | 1.30.12     |
| vSphere CSI                              | 3.4.0       |
