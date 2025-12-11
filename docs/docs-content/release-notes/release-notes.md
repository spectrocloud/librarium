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

## December 6, 2025 - Release 4.8.X

#### Features

- <TpBadge /> Palette now supports the cluster provisioning and management of CloudStack clusters. Refer to the
  CloudStack section for further information.

- Terraform version 0.26.1 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- Crossplane version 0.26.1 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

- The [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
  and [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette)
  now support CloudStack.

  - The `spectrocloud_cloudaccount_apache_cloudstack` data source supports the creation of CloudStack cloud accounts.
  - The `spectrocloud_cluster_apache_cloudstack` resource supports configuration and deployment of CloudStack clusters.

### Improvements

- The KubeVirt version used by the Palette [Virtual Machine Orchestrator](../vm-management/vm-management.md) is now
  v1.6.2.

- The `virt-v2v` version used by the Palette
  [Virtual Machine Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) is now
  v2.9.0.

- The default timeout of [Local UI](../clusters/edge/local-ui/local-ui.md) JWT tokens has been reduced to 15 minutes.
  Additionally, tokens are now revoked upon log out.

### Bug Fixes

- Fixed an issue that caused [EKS clusters](../clusters/public-cloud/aws/eks.md) to fail to provision due to missing
  retry logic for trust policy ConfigMaps.

<!-- prettier-ignore-start -->
- Fixed an issue that caused Day-2 operations to fail on Palette [Edge clusters](../clusters/edge/edge.md) configured with
external provider registries in the <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)
" url="/integrations/packs/?pack=edge-k8s"/> pack.
<!-- prettier-ignore-end -->

- Fixed an issue that caused add-on deployments provisioned through the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) to
  remain in an unrecoverable, unhealthy state following a deployment error, even after fixing the root cause.

<!-- prettier-ignore-start -->
- Fixed an issue that prevented the <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi"/> pack from being available to CloudStack clusters.
<!-- prettier-ignore-end -->

### Packs

#### Pack Notes

- The following packs support CloudStack deployment:
  - Ubuntu 24.04
  - Palette eXtended Kubernetes versions 1.31.14, 1.32.10, and 1.33.6
  - Calico 3.30.3-rev1
  - CloudStack CSI 2.5.0

| Pack Name                   | Layer      | Non-FIPS           | FIPS               | New Version |
| --------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Azure Disk                  | Storage    | :white_check_mark: | :x:                | 1.33.7      |
| External Secrets Operator   | Add-on     | :white_check_mark: | :x:                | 1.1.0       |
| GCE Persistent Disk CSI     | Storage    | :white_check_mark: | :x:                | 1.22.4      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.6      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.32.10     |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.31.14     |
| Prometheus Agent            | Add-on     | :white_check_mark: | :x:                | 27.47.0     |
| Prometheus Operator         | Add-on     | :white_check_mark: | :x:                | 79.8.2      |
| Volume Snapshot Controller  | Add-on     | :white_check_mark: | :x:                | 8.4.0       |
| vSphere CSI                 | Storage    | :x:                | :white_check_mark: | 3.6.0       |

## December 5, 2025 - Component Updates {#component-updates-2025-49}

The following components have been updated for Palette version 4.8.6 - 4.8.9.

### Improvements

<!-- prettier-ignore-start -->

- The <VersionedLink text="Piraeus CSI" url="/integrations/?pack=piraeus-csi" /> version used in the [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) has been upgraded to 2.10.1.

<!-- prettier-ignore-end -->

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->

- The <VersionedLink text="Azure CNI" url="/integrations/packs/?pack=cni-azure"/> pack now supports the overlay networking model using the **Overlay** preset.
- The <VersionedLink text="Kubernetes (EKS)" url="/integrations/packs/?pack=kubernetes-eks"/> pack now supports the configuration of custom service CIDRs. Refer to the pack <VersionedLink text="Additional Details" url="/integrations/packs/?pack=kubernetes-eks&tab=custom"/> tab for further information.
- The <VersionedLink text="AWS VPC CNI (Helm)" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm"/> pack now supports the configuration of custom pod CIDRs. Refer to the pack <VersionedLink text="Additional Details" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm&tab=custom"/> tab for further information.

<!-- prettier-ignore-end -->

| Pack Name                    | Layer  | Non-FIPS           | FIPS               | New Version |
| ---------------------------- | ------ | ------------------ | ------------------ | ----------- |
| Amazon EFS                   | Add-on | :white_check_mark: | :x:                | 2.1.15      |
| AWS Application Loadbalancer | Add-on | :white_check_mark: | :x:                | 2.16.0      |
| AWS VPC CNI                  | Add-on | :x:                | :white_check_mark: | 1.20.4      |
| Azure Disk                   | CSI    | :white_check_mark: | :x:                | 1.33.6      |
| Calico                       | CNI    | :white_check_mark: | :x:                | 3.31.2      |
| Calico Network Policy        | Add-on | :white_check_mark: | :x:                | 3.31.2      |
| KAI Scheduler                | Add-on | :white_check_mark: | :x:                | 0.10.0      |
| Kuberay Operator             | Add-on | :white_check_mark: | :x:                | 1.5.1       |
| Open Policy Agent            | Add-on | :white_check_mark: | :x:                | 3.21.0      |
| Prometheus Agent             | Add-on | :white_check_mark: | :x:                | 27.45.0     |
| Prometheus Operator          | Add-on | :white_check_mark: | :x:                | 79.5.0      |
| Ubuntu (GCP)                 | OS     | :white_check_mark: | :x:                | 24.04       |
| Zot Registry                 | Add-on | :white_check_mark: | :white_check_mark: | 0.1.89      |

## December 5, 2025 - Release 4.8.9

The following component updates are applicable to this release:

- [December 5, 2025 - Component Updates](#component-updates-2025-49) <!-- omit in toc -->

### Bug Fixes

- Fixed an issue that caused Palette's `cluster-management-agent` service to continually restart on
  [data center clusters](../clusters/data-center/data-center.md) due to a duplicate CloudStack cloud type introduced by
  Palette 4.8.6.

## November 28, 2025 - Component Updates {#component-updates-2025-48}

The following components have been updated for Palette version 4.8.6 - 4.8.8.

### Packs

| Pack Name                 | Layer  | Non-FIPS           | FIPS               | New Version |
| ------------------------- | ------ | ------------------ | ------------------ | ----------- |
| Amazon EFS                | CSI    | :white_check_mark: | :x:                | 2.1.14      |
| Argo CD                   | CSI    | :white_check_mark: | :x:                | 9.1.0       |
| External Secrets Operator | Add-on | :white_check_mark: | :x:                | 1.0.0       |
| GCE Persistent Disk CSI   | CSI    | :white_check_mark: | :x:                | 1.21.0      |
| GCE Persistent Disk CSI   | CSI    | :white_check_mark: | :x:                | 1.20.2      |
| Istio                     | Add-on | :white_check_mark: | :x:                | 1.28.0      |
| Karpenter                 | Add-on | :white_check_mark: | :x:                | 1.8.2       |
| Nginx                     | Add-on | :white_check_mark: | :x:                | 1.14.0      |
| Piraeus Operator          | CSI    | :white_check_mark: | :white_check_mark: | 2.10.1      |

## November 26, 2025 - Release 4.8.8

The following component updates are applicable to this release:

- [November 28, 2025 - Component Updates](#component-updates-2025-48) <!-- omit in toc -->
- [December 5, 2025 - Component Updates](#component-updates-2025-49) <!-- omit in toc -->

### Improvements

- The [VerteX](../vertex/vertex.md) UI has been upgraded to use
  [Nginx](https://github.com/nginx/nginx/releases/tag/release-1.29.2) 1.29.2.

### Bug Fixes

- Fixed an issue that caused errors with the internal MongoDB database when upgrading the
  [self-hosted Palette](../enterprise-version/enterprise-version.md) or [VerteX](../vertex/vertex.md) installation from
  4.7.29 to 4.8.6.
- Fixed an issue that prevented [Edge cluster](../clusters/edge/edge.md) events from being displayed in the Palette
  Events tab.
- Fixed an issue that caused [VerteX](../vertex/vertex.md) 4.8.6 to fail to install due to crashing LINSTOR pods.
- Fixed an issue that caused a duplicate CloudStack cloud type to appear in the custom cloud types API endpoint after
  upgrading Palette to 4.8.6, resulting in API and validation conflicts.

## November 22, 2025 - Release 4.8.0 - 4.8.6 {#release-notes-4.8.0}

The following component updates are applicable to this release:

- [November 28, 2025 - Component Updates](#component-updates-2025-48) <!-- omit in toc -->
- [December 5, 2025 - Component Updates](#component-updates-2025-49) <!-- omit in toc -->

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.8.0}

#### Breaking Changes {#breaking-changes-4.8.0}

- When creating EKS clusters, the default **Amazon Machine Image (AMI) Type** is now Amazon Linux 2023 (AL2023) Standard
  AMI. This change aligns with the [upcoming deprecation of Amazon Linux 2 (AL2) AMIs](./announcements.md#deprecations).
  A deprecation warning now appears for AL2 AMIs in the **Amazon Machine Image (AMI) Type** drop-down menu within
  [Cloud Configuration Settings](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings).

- [System configuration API endpoints](/api/v1/system) can now only be accessed using privileged
  [authorization tokens](../user-management/authentication/authorization-token.md). These API endpoints expose critical
  system details, so access to them is strictly enforced. Users with general access authorization tokens are no longer
  able to access these endpoints.

- All Palette and VerteX [Clouds API endpoints](/api/v1/clouds) now require
  [authorization tokens](../user-management/authentication/authorization-token.md) for all requests. Existing
  integrations must be updated to provide valid authorization tokens, as unauthenticated API calls will now fail.

#### Features

- [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) is now a supported
  authentication method for AWS cloud accounts. This secure authentication mechanism allows Kubernetes pods to assume
  IAM roles with temporary, automatically refreshed credentials, eliminating the need for long-lived AWS credentials.

  This method is only available for self-hosted Palette and Palette VerteX instances deployed on Amazon EKS clusters.
  Refer to the [Add AWS Accounts](../clusters/public-cloud/aws/add-aws-accounts.md) guide for more information.

- [Cluster profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/create-cluster-profile-variables.md)
  now support the multiline input type and the Base64 format. This improvement allows users to leverage cluster profile
  variables for use cases such as saving multiline YAML specifications and storing encoded keys for use during cluster
  creation.

#### Improvements

- Project tags are now displayed in the **Project Overview** page and the **Tenant Admin > Projects** page in Palette.
  This improvement allows users to identify projects based on their tags. Refer to the
  [Project Tags](../tenant-settings/projects/projects.md#project-tags) section for more information.

- Palette now provides the ability to upgrade the [vCluster version](https://www.vcluster.com/releases/en/changelog) of
  your virtual clusters, allowing you to leverage newly introduced features without having to create new cluster groups
  or migrate workloads. Refer to the [Upgrade Cluster Groups](../clusters/cluster-groups/vcluster-upgrades.md) guide for
  further information.

- Palette has now implemented a mechanism for evacuating and migrating the control planes for
  [MAAS clusters using LXD VMs](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md), reducing
  high-availability risks during host repaves. This improvement is critical for Day-2 lifecycle operations such as
  upgrades or repaves.

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) now include the latest
  Terminal User Interface (TUI). For more details, refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md).

<!-- prettier-ignore-start -->

- Certificate renewal for clusters provisioned using <VersionedLink text="Palette Optimized K3S" url="/integrations/packs/?pack=edge-k3s"/> and <VersionedLink text="RKE2" url="/integrations/packs/?pack=kubernetes-rke2"/> can now be triggered externally from Kubernetes. This is applicable for both Edge and public cloud clusters.

<!-- prettier-ignore-end -->

#### Bug Fixes

- Fixed an issue that caused
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) to sometimes create an
  inconsistent number of LINSTOR resources.

- Fixed an issue that caused some [self-hosted Palette](../enterprise-version/enterprise-version.md) and
  [VerteX](../vertex/vertex.md) installations to fail to due to a Helm template rendering error.

<!-- prettier-ignore-start -->

 - Fixed an issue that caused Palette UI errors related to YAML marshalling when accepting cluster profile updates for cluster profiles configured using the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack.

<!-- prettier-ignore-end -->

- Fixed an issue that prevented `ipclaim` resources from being deleted when repaving
  [VMware clusters](../clusters/data-center/vmware/vmware.md).

- Fixed an issue that prevented the Palette UI from displaying metrics for
  [EKS clusters](../clusters/public-cloud/aws/eks.md) due to incorrect security group rules.

- Fixed an issue that prevented rotated IAM keys in
  [AWS cloud accounts](../clusters/public-cloud/aws/add-aws-accounts.md) from being updated on deployed
  [AWS clusters](../clusters/public-cloud/aws/aws.md).

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.8.6 Palette release is 4.8.1.

:::

#### Improvements

- The Terminal User Interface (TUI) is now always enabled and features a new landing page that displays system
  information. It also adds support for configuring Virtual Local Area Networks (VLANs). The `stylus.includeTui` flag in
  `user-data` has been deprecated as a result of these changes. For more details, refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md).

- [CanvOS](https://github.com/spectrocloud/CanvOS) now provides support for FIPS-compiled Ubuntu 22.04. This is
  important for users who want to enforce FIPS 140-3 compliance.

#### Bug Fixes

- Fixed an issue that caused pack reconciliation to fail in
  [locally managed Edge clusters](../clusters/edge/local-ui/cluster-management/create-cluster.md#create-local-cluster)
  provisioned with cluster profiles containing duplicate packs.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.8.0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.26.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.26.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

- <TpBadge /> The [Spectro Cloud Terraform
  provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) now supports [cluster
  templates](../cluster-templates/cluster-templates.md).

  - The `spectrocloud_cluster_config_policy` data source implements
    [maintenance policies](../cluster-templates/create-cluster-template-policies/maintenance-policy.md).
  - The `spectrocloud_cluster_config_template` data source implements
    [cluster templates](../cluster-templates/create-cluster-templates.md).
  - Cluster resources now have the `cluster_template` field to support the configuration of cluster templates.

- The
  [`spectrocloud_cloudaccount_aws` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_aws)
  now supports [EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html).

#### Bug Fixes

- Fixed an issue that caused the
  [`spectrocloud_cluster_group` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_group)
  to fail to save cluster state when a Loadbalancer was configured.

### Docs and Education

- The new [Find Breaking Changes for Palette Upgrades](./breaking-changes.md) page contains an interactive component
  that allows users to list breaking changes between two Palette releases. Use it as guidance for upgrading dedicated
  SaaS or self-hosted Palette and Palette VerteX installations.

### Packs

<!-- prettier-ignore-start -->

#### Deprecations and Removals

- The <VersionedLink text="Nginx" url="/integrations/packs/?pack=nginx" /> pack is now deprecated. Use the Kgateway pack as an alternative. Refer to the [Ingress NGINX Retirement: What You Need to Know](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) blog for further information.

<!-- prettier-ignore-end -->

#### Pack Notes

<!-- prettier-ignore-start -->

- The <VersionedLink text="Spectro RBAC" url="/integrations/packs/?pack=spectro-rback" /> pack version 1.0.1 now supports CPU, memory, and storage resource quota specifications.

<!-- prettier-ignore-end -->

| Pack Name                 | Layer  | Non-FIPS           | FIPS               | New Version |
| ------------------------- | ------ | ------------------ | ------------------ | ----------- |
| Amazon EBS CSI            | CSI    | :white_check_mark: | :x:                | 1.51.0      |
| Calico                    | CNI    | :x:                | :white_check_mark: | 3.31.0      |
| Crossplane                | Add-on | :white_check_mark: | :x:                | 2.0.1       |
| External Secrets Operator | Add-on | :white_check_mark: | :x:                | 0.20.4      |
| Flux2                     | Add-on | :white_check_mark: | :x:                | 2.17.1      |
| Kgateway                  | Add-on | :white_check_mark: | :x:                | 2.2.1       |
| Prometheus Agent          | Add-on | :white_check_mark: | :x:                | 27.42.1     |
| Prometheus - Grafana      | Add-on | :white_check_mark: | :x:                | 79.0.1      |
| Reloader                  | Add-on | :white_check_mark: | :x:                | 1.4.10      |
| Spectro RBAC              | Add-on | :white_check_mark: | :x:                | 1.0.1       |
| Ubuntu (Azure)            | OS     | :white_check_mark: | :x:                | 24.04       |
| Ubuntu (vSphere)          | OS     | :white_check_mark: | :x:                | 24.04       |
