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

## September 20, 2025 - Release 4.7.20 {#release-notes-4.7.b}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.7.b}

#### Breaking Changes {#breaking-changes-4.7.b}

- The `spec.jsonCredentialsFileUid` field in API requests is no longer available. Users who create GCP cloud accounts
  using the API should use the `spec.jsonCredentials` field to supply their credentials in JSON format. Refer to the
  [API documentation](/api/introduction) for further details.
- The previous encryption library used in the [Palette CLI](../automation/palette-cli/palette-cli.md) has been
  deprecated. As a result, users cannot use their existing credentials, such as Palette API keys, passwords, and Ubuntu
  Pro tokens, to perform operations after upgrading to Palette CLI version 4.7.2 or later. Users must update their
  credentials by either running the applicable commands and following the subsequent prompts or deleting the respective
  configuration files. Refer to our
  [Troubleshooting](../troubleshooting/automation.md#scenario---update-cli-configuration-files-credentials) guide for
  more information.

#### Features

- <TpBadge /> Palette and VerteX Management Appliance now support Secure Boot. Refer to the [Palette Management
  Appliance](../enterprise-version/install-palette/palette-management-appliance.md) guide for further configuration
  information.
- <TpBadge /> Palette and VerteX Management Appliance now support single node installation. We do not recommend this
  setup for production environments.

#### Improvements

<!-- prettier-ignore-start -->
- Palette now supports [automatic certificate renewal](../clusters/edge/cluster-management/certificate-renewal.md#automatic-renewal) for [MAAS](../clusters/data-center/maas/maas.md) and [Edge](../clusters/edge/edge.md) clusters using <VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" />.
<!-- prettier-ignore-end -->

#### Bug Fixes

- Fixed an issue that caused the [VM Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) to leave open connections after VM migrations.
- Fixed an issue that incorrectly allowed the creation of [EKS Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html) in [AWS GovCloud](../clusters/public-cloud/aws/add-aws-accounts.md#aws-govcloud-account-us).
- Fixed an issue that prevented worker node pools from attaching newly created nodes on Azure IaaS clusters created using a Palette version prior to 4.6.32 to an outbound load balancer after upgrading Palette.
- Fixed an issue that caused manifest layers creating using [Crossplane](../automation/crossplane/crossplane.md) to display incorrectly in the Palette UI.
- Fixed an issue that caused [EKS nodes](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings) customized with the `AL2_x86_64` AMI label to be incorrectly configured with Amazon Linux 2023 (AL2023).
- Fixed an issue that caused the [Virtual Machine Orchestrator](../vm-management/vm-management.md) to incorrectly require admin permissions for managing persistent volume claims.
- Fixed an issue that caused Palette to fail to delete nodes.
- Fixed an issue that caused new DNS configurations to fail to apply without manual DNS pod restarts.
- Fixed an issue that caused CNI labels and annotations to be incorrectly applied to cluster namespaces.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.7.b Palette release is 4.7.13.

:::

#### Breaking Changes

- Palette CLI versions prior to 4.7.b do not support building content for local Edge cluster deployment on Palette 4.7.b
  or later because content created with older CLI versions lacks the required images. We recommend
  [downloading](downloads/cli-tools.md#palette-cli) and using Palette CLI version 4.7.b or later to build content for
  Palette 4.7.b or later.

<!-- prettier-ignore-start -->
- Edge clusters with the Palette agent versions prior to 4.7.b do not support upgrading to the following Kubernetes pack
  versions released in 4.7.b:
  - <VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" /> 1.32.8 and 1.33.4;
  - <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> 1.31.12, 1.32.8, and 1.33.4;
  - <VersionedLink text="Palette Optimized K3S" url="/integrations/packs/?pack=edge-k3s" />  1.33.2;
  - <VersionedLink text="Palette Optimized RKE2" url="/integrations/packs/?pack=edge-rke2" /> 1.33.2.
  
  This breaking change affects agent mode clusters only and does not impact appliance mode clusters.
  For locally managed clusters, refer to [Configure Palette Agent
  Version](clusters/edge/cluster-management/agent-upgrade-airgap.md) to upgrade the agent to the latest version before
  upgrading Kubernetes packs. For centrally managed clusters, do not [pause
  upgrades](clusters/cluster-management/platform-settings/pause-platform-upgrades.md) so the agent can upgrade
  automatically.
<!-- prettier-ignore-end -->

- Palette Edge CLI does not support building content for local Edge cluster deployment in agent mode on Palette 4.7.b
  (Palette agent version 4.7.12) or later. We recommend [downloading](downloads/cli-tools.md#palette-cli) and using
  Palette CLI version 4.7.b or later instead. This breaking change affects agent mode clusters only and does not impact
  appliance mode clusters.

#### Improvements

- [Edge host grid view](../clusters/edge/site-deployment/edge-host-view.md) now supports the Graphics Processing Unit (GPU) attribute. It contains information about the GPU of the Edge host, including the GPU model, vendor, memory, count, and Multi-Instance GPU (MIG) capability and strategy. MIG fields are applicable for Nvidia devices only.
- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports displaying all date and time values in Coordinated Universal Time (UTC), the browser’s local time zone, or both simultaneously.

#### Bug Fixes

- Fixed an issue that caused incorrect [Kube-vip](../clusters/edge/networking/kubevip.md) validation errors to appear when worker nodes were removed and re-added to clusters.
- Fixed an issue that caused [Local UI](../clusters/edge/local-ui/local-ui.md) incorrect ports when using VIP IP addresses.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.7.b) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Breaking Changes

- The `spectrocloud_macro` Terraform resource is no longer available. We recommend using the `spectrocloud_macros`
  resource to create and manage service output variables and macros. For more information, refer to the Spectro Cloud
  Terraform provider [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

#### Features

- Terraform version 0.24.4 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.24.4 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette)
  is now available. This version supports [Crossplane v2](https://docs.crossplane.io/latest/whats-new/).

#### Bug Fixes

- Fixed an issue that caused [EKS clusters](../clusters/public-cloud/aws/eks.md) to be recreated when private and public access CIDRs are changed through Terraform.

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->

- The <VersionedLink text="Piraeus Operator" url="/integrations/packs/?pack=piraeus-csi" /> pack is now compatible with Ubuntu 22.04 FIPS.
- The [OpenTelemetry Monitoring Stack](../clusters/cluster-management/monitoring/open-telemetry.md) now includes tracing and logging capabilities. The stack now supports integration with both <VersionedLink text="Open Observe" url="/integrations/packs/?pack=openobserve" /> and external SaaS tools for observability.
- The <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> and <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant" /> packs are now verified.
- <VersionedLink text="Calico CNI pack version 3.30.2-rev2" url="/integrations/packs/?pack=cni-calico&version=3.30.2-rev2" /> has been added. This pack version resolves an issue that causes Edge clusters using Calico version 3.30.2 to fail. Refer to the <VersionedLink text="Calico Additional Details" url="/integrations/packs/?pack=cni-calico&version=3.30.2-rev2&tab=custom" /> page for more information.
- Instructions for configuring Cilium for agent mode Edge clusters have been added to the
  <VersionedLink text="Cilium Additional Details" url="/integrations/packs/?pack=cni-cilium-oss&tab=custom" /> page.
  These instructions apply to Palette versions 4.2 and later.
- The <VersionedLink text="Piraeus Operator" url="/integrations/packs/?pack=piraeus-csi" /> airgap pack binary is not available for download.

<!-- prettier-ignore-end -->

#### Kubernetes

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| GKE                                      | 1.33        |
| Kubernetes (AKS)                         | 1.33        |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.33.4      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.32.8      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.31.12     |
| Palette eXtended Kubernetes              | 1.33.4      |
| Palette eXtended Kubernetes              | 1.32.8      |
| Palette eXtended Kubernetes              | 1.31.12     |

#### CNI

| Pack Name          | New Version         |
| ------------------ | ------------------- |
| AWS VPC CNI (Helm) | 1.20.1              |
| Calico             | 3.30.2 - Revision 2 |
| Cilium             | 1.17.6              |
| Flannel            | 0.27.2              |

#### CSI

| Pack Name                  | New Version         |
| -------------------------- | ------------------- |
| Azure Disk                 | 1.31.2 - Revision 2 |
| AWS EFS                    | 3.2.2               |
| AWS EFS                    | 2.1.10              |
| Amazon EFS                 | 2.1.11              |
| Amazon EFS                 | 2.1.10              |
| Dell CSM Operator          | 1.9.1               |
| Longhorn                   | 1.8.1               |
| Rook-Ceph                  | 1.18.0              |
| Rook-Ceph                  | 1.17.7              |
| Piraeus Operator           | 2.9.0               |
| Volume Snapshot Controller | 8.3.0               |

#### Add-on Packs

| Pack Name                    | New Version |
| ---------------------------- | ----------- |
| Argo CD                      | 8.3.0       |
| Argo CD                      | 8.1.4       |
| AWS Application Loadbalancer | 2.13.4      |
| Amazon EFS                   | 2.1.11      |
| Amazon EFS                   | 2.1.10      |
| Calico Network Policy        | 3.30.2      |
| Crossplane                   | 2.0.2       |
| Dell CSM Operator            | 1.9.1       |
| Dex                          | 2.42.0      |
| External Secrets Operator    | 0.19.2      |
| External Secrets Operator    | 0.18.2      |
| Flux2                        | 2.16.4      |
| Istio                        | 1.27.0      |
| Kong                         | 2.51.0      |
| Loki                         | 2.10.2      |
| Nginx                        | 1.31.1      |
| Rook-Ceph                    | 1.17.7      |
| Prometheus Agent             | 27.23.0     |
| Prometheus - Grafana         | 75.9.0      |
| Upbound Crossplane           | 2.0.1       |
| Vault                        | 0.30.1      |
| VMO Namespace Management     | 1.0.4       |
| Volume Snapshot Controller   | 8.3.0       |

#### FIPS Packs

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Longhorn                                 | 1.8.1       |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.33.4      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.32.8      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.31.12     |
| Palette eXtended Kubernetes              | 1.33.4      |
| Palette eXtended Kubernetes              | 1.32.8      |
| Palette eXtended Kubernetes              | 1.31.12     |
| Piraeus Operator                         | 2.9.0       |

## September 1, 2025 - Release 4.7.16

### Bug Fixes

- Fixed an issue where [Azure IaaS clusters](../clusters/public-cloud/azure/create-azure-cluster.md) configured with
  `fullyPrivateAddressing` failed to deploy.

## August 21, 2025 - Release 4.7.15

### Bug Fixes

<!-- prettier-ignore-start -->

- Fixed an issue that prevented [HTTP-Proxies](../clusters/edge/local-ui/host-management/configure-proxy.md) from being
  correctly applied when configured in Local UI prior to cluster creation.
- Fixed an issue that prevented certain `hubble-system` pods from being scheduled when upgrading self-hosted Palette and
  VerteX VMware vSphere installations from 4.6.x to 4.7.x.
- Fixed an issue that caused the Palette
  [Terminal User Interface (TUI)](../clusters/edge/site-deployment/site-installation/initial-setup.md) on Edge hosts to
  restart after entering **DNS Configuration** details.
- Fixed a UI issue where the [Virtual Machine Dashboard](../vm-management/configure-console-base-address.md)
  **Connect** button disappeared for [Virtual Machine Orchestrator (VMO)](../vm-management/vm-management.md) clusters
  after switching between **Proxied** and **Direct** access in the applied
  <VersionedLink url="/integrations/packs/?pack=virtual-machine-orchestrator" text="Virtual Machine Orchestrator" /> pack.
- Fixed a UI issue where Edge host tags were not displayed in the **Tags** drop-down menu on the **Clusters > Edge Hosts** tab of
  Palette. 

<!-- prettier-ignore-end -->

### Automation

#### Features

- Terraform version 0.24.2 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

#### Bug Fixes

- Fixed a `spectrocloud_sso` Terraform resource issue where `preferred_email` was not an accepted value for
  `oidc.email`.

## August 17, 2025 - Release 4.7.13 {#release-notes-4.7.a}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.7.a}

#### Breaking Changes {#breaking-changes-4.7.a}

- Availability zones are now required when creating MAAS [node pools](../clusters/cluster-management/node-pool.md).
  - For [MAAS clusters](../clusters/data-center/maas/create-manage-maas-clusters.md) deployed prior to Palette version
    4.7.13, selecting an availability zone is required when creating a new node pool; however, selecting an availability
    zone is _not_ required when modifying an existing node pool, as modifying availability zones post-cluster deployment
    will trigger a [node pool repave](../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration).
  - For MAAS clusters deployed prior to 4.7.13, we recommend creating a new node pool with an availability zone selected
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
  version 1.32. Refer to the MAAS [Architecture](../clusters/data-center/maas/architecture.md#palette-maas-distribution)
  page for further details.
- [Workspace resource quotas](../workspace/workspace-mgmt/resource-mgmt.md#implement-resource-quotas) and
  [namespace resource quotas](../clusters/cluster-management/namespace-management.md#assign-resource-quotas) now support
  GPU limits. This feature currently supports Nvidia GPUs only.
- Palette now supports the AI pack type. This category streamlines the grouping and finding of AI-related packs. Refer
  to the [Packs List](../integrations/integrations.mdx) to search and filter packs.

#### Improvements

- Nodes provisioned through [Karpenter](https://karpenter.sh/docs/) are now visible in Palette and supported for
  read-only operations, such as billing and monitoring. However,
  [Day-2 operations](../clusters/cluster-management/cluster-management.md) are not supported. Refer to
  [Karpenter Support](../clusters/public-cloud/aws/architecture.md#karpenter-support) for more details.
- <TpBadge /> A technical preview banner is now displayed on all [Artifact Studio](../downloads/artifact-studio.md)
  pages.

#### Bug Fixes

- Fixed an issue that caused errors on message broker pods after upgrading
  [self-hosted Palette](../enterprise-version/enterprise-version.md) installations to version 4.7.4 or later.
- Fixed an issue that caused validation errors to appear when
  [adding an Amazon ECR](../registries-and-packs/registries/oci-registry/add-oci-packs.md) hosted in
  [AWS GovCloud](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-ecr.html) to Palette.
- Fixed an issue that caused [self-hosted Palette](../enterprise-version/enterprise-version.md) installations to allow
passing open redirects in URLs using the `returnTo` parameter.
<!-- prettier-ignore-start -->
- Fixed an issue that caused multiple repeated creations and reconciliations of
<VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack resources.
<!-- prettier-ignore-end -->
- Fixed an issue that caused
  [sprig template functions](../registries-and-packs/pack-constraints.md#sprig-template-functions) to fail when being
  used together with system and tenant scope [macros](../clusters/cluster-management/macros.md#scope-of-palette-macros).
- Fixed an issue that caused the worker nodes of [MAAS](../clusters/data-center/maas/maas.md) clusters to be repaved in
  parallel.
- Fixed an issue that caused certificates to be incorrectly updated in cluster
  [Kubeconfig](../clusters/cluster-management/kubeconfig.md) files after certificate updates.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.7.13 Palette release is 4.7.9.

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
- The [Kubeconfig](../clusters/cluster-management/kubeconfig.md) file names of Edge clusters deployed with
  [agent mode](../deployment-modes/agent-mode/agent-mode.md) or
  [appliance mode](../deployment-modes/appliance-mode/appliance-mode.md) now contain the cluster name.

#### Bug Fixes

- Fixed an issue that caused the creation of locally deployed clusters to fail when adding a custom `stylus.path` to the
  `user-data` file.
- Fixed an issue that prevented Kubernetes upgrades from being applied to the control plane nodes of
  [agent mode](../deployment-modes/agent-mode/agent-mode.md) clusters.
- Fixed an issue that caused single-node [Local UI](../clusters/edge/local-ui/local-ui.md) clusters configured with
  add-on packs to be stuck in the Provisioning state.
- Fixed an issue that caused Palette to report single-node Edge clusters with invalid
  [kube-vip configurations](../clusters/edge/networking/kubevip.md) as Healthy, even though they were unreachable.

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
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs). The Terraform resource
  `spectrocloud_workspace` now also supports these configurations.
- Terraform version 0.24.1 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.24.1 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/v0.24.1)
  is now available.

#### Bug Fixes

- Fixed an issue that prevented the taints configuration from being correctly applied to the
  `spectrocloud_cluster_custom_cloud` Terraform resource.
- Fixed an issue that caused the `spectrocloud_cluster_profile` Terraform resource to create invalid objects when
  cluster profile variables are not correctly initialized before creation.

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

#### FIPS Packs

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Azure Disk CSI Driver                    | 1.33.2      |
| Calico                                   | 3.30.2      |
| Calico (Azure)                           | 3.30.2      |
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
