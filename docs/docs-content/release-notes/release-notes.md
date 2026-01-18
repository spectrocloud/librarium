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

## January 18, 2026 - Release 4.8.21 {#release-notes-4.8.a}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.8.a}

#### Breaking Changes {#breaking-changes-4.8.a}

<!-- https://spectrocloud.atlassian.net/browse/PEM-6547 -->

- Users with the `cluster.delete` permission are no longer allowed to download the cluster
  [admin kubeconfig](../clusters/cluster-management/kubeconfig.md) file. This operation is now controlled using the
  `cluster.adminKubeconfigDownload` permission, giving system administrators fine-grained control over cluster admin
  access.

  The `cluster.adminKubeconfigDownload` permission is part of the following system roles:

  - [Tenant Admin](../user-management/palette-rbac/tenant-scope-roles-permissions.md#admin)
  - [Tenant Project Admin](../user-management/palette-rbac/tenant-scope-roles-permissions.md#project)
  - [Project Admin](../user-management/palette-rbac/project-scope-roles-permissions.md#project)
  - [Cluster Admin](../user-management/palette-rbac/project-scope-roles-permissions.md#cluster)
  - [Resource Cluster Admin](../user-management/palette-rbac/resource-scope-roles-permissions.md#cluster)

  Existing users with system roles that include the `cluster.delete` permission automatically receive the new
  `cluster.adminKubeconfigDownload` permission. System administrators must grant the new permission manually to existing
  users granted access through custom roles.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PEM-8534 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-8796 -->

- [Cluster templates](../cluster-templates/cluster-templates.md) provide a new way to enforce consistent configurations
  and prevent drift across multiple clusters. With cluster templates, you define and enforce the desired state and
  lifecycle of clusters by combining [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) with
  operational [policies](../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md) into
  a single, reusable governance blueprint, allowing you to deploy, manage, and upgrade a synchronized fleet of clusters
  with minimal effort. Refer to our [Cluster Templates](../cluster-templates/cluster-templates.md) guide for more
  information.

<!-- https://spectrocloud.atlassian.net//browse/PCP-5625 -->

- [AWS Dedicated Hosts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html) are now
  supported for AWS IaaS clusters. This feature allows you to launch your cluster nodes on physical servers that are
  dedicated for your use, providing additional isolation and compliance benefits. Refer to the
  [Create and Manage AWS IaaS Cluster](../clusters/public-cloud/aws/create-cluster.md) and
  [AWS Architecture](../clusters/public-cloud/aws/architecture.md#dedicated-hosts) guides for more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5279 -->

- [Worker node pools](../clusters/cluster-management/node-pool.md#worker-node-pool) now support configuring custom
  `maxSurge` and `maxUnavailable` values for rolling updates, offering more flexibility in managing cluster capacity
  during updates.

<!-- https://spectrocloud.atlassian.net//browse/PEM-7283 -->

- [Zarf OCI registries](../registries-and-packs/registries/oci-registry/add-oci-zarf.md) now support synchronization,
  allowing public Zarf packages to be automatically imported into Palette. This setting is only available for new OCI
  registries and is disabled by default on existing registries. This setting is immutable and cannot be changed once the
  OCI registry is added to Palette.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-110 -->
<!-- prettier-ignore-start -->
- [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) version 4.8.18 is now
  available. This version uses the following components internally:
  - <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/?pack=kubernetes" /> 1.33.5
  - <VersionedLink text="Calico" url="/integrations/?pack=cni-calico" />  3.31.2
  - <VersionedLink text="Piraeus CSI" url="/integrations/?pack=piraeus-csi" /> 2.10.1
  - <VersionedLink text="Zot Registry" url="/integrations/?pack=zot-registry" /> 0.1.89

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PCP-4241 -->

- Clusters now support using either the built-in Palette integrated cert-manager feature or the Cert Manager 1.19.1
  add-on pack. This provides a more flexible and modular approach to
  [certificate management](../clusters/cluster-management/cert-manager-addon.md).

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-6649 -->

- You can now add OCI Helm registries that do not require authentication to Palette. This allows you to leverage
  publicly available OCI Helm Charts in your cluster profiles. Refer to the
  [Add OCI Helm Registry](../registries-and-packs/registries/oci-registry/add-oci-helm.md) guide to learn more.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5284 -->

- [CloudStack Clusters](../clusters/data-center/cloudstack/create-manage-cloudstack-clusters.md) now support the
  template names for machine image configuration, allowing users to customize machine images for individual node pools,
  similar to how Amazon EKS clusters handle AMI selections.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5558 -->

- All infrastructure providers now support adding
  [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) to either control plane
  or worker nodes (infrastructure dependent), allowing system administrators to provide node-level customization.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5283 -->

- All infrastructure providers now support [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/)
  overrides for worker node pools, allowing workloads to meet specific operational or environmental requirements.

<!-- https://spectrocloud.atlassian.net//browse/PCP-5415 -->

- Velero has been upgraded to version 1.17, which is used internally by Palette for backing up and restoring clusters.
  Existing clusters with backups configured will be automatically updated to Velero version 1.17, ensuring continuous
  access to backup and restore functionality. Refer to the
  [Backup and Restore](../clusters/cluster-management/backup-restore/backup-restore.md) page to learn more about backup
  and restore tools in Palette.

<!-- https://spectrocloud.atlassian.net//browse/PEM-9468 -->

- Palette's internal database, MongoDB, has been upgraded to version 7.0.28.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9143 -->

- The `nginx.ingress.kubernetes.io/proxy-body-size` field allows you to configure the request body size limit of the
  Nginx ingress controller deployed by Palette.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-5372 -->

- Fixed an issue that caused the Palette API to fail to update the `metadata.machineUid` field after nodes are repaved
  during Kubernetes upgrades.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5440 -->

- Fixed an issue that caused Palette to fail to update the `controlPlaneEndpoint` field when applying updates on
  [MAAS](../clusters/data-center/maas/maas.md) clusters.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5490 -->

- Fixed an issue that prevented Palette from removing `cert-renewal-plan` resources that are no longer required for
  automatic resource upgrades.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5547 -->
<!-- prettier-ignore-start -->

- Fixed an issue that caused deployment failures for EKS clusters with both ImageSwap enabled and the <VersionedLink text="AWS VPC CNI (Helm)" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm"  />.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PEM-9426 -->

- Fixed an issue that prevented Palette from correctly assigning users to teams if the team was not listed on the first
  page in **Users & Teams > Teams**.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5753 -->

- Fixed an issue that prevented Palette from correctly applying configuration updates specified in manifest files for
  `ally` and `palette-controller-manager` resources on newly created clusters.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9484 -->

- Fixed an issue that prevented Palette from masking API responses containing cloud account fields.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9490 -->

- Fixed an issue that prevented AKS clusters with static placement from deploying with custom VNets.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9359  -->

- Fixed an issue where cluster profile changes were intermittently not propagated to workload clusters due to a race
  condition in the image resolution process.

<!-- https://spectrocloud.atlassian.net/browse/OPS-8332 -->

- The image `imageswap-init:v1.5.3-spectro-4.7.a` was recreated due to a missing dependency.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.8.21 Palette release is 4.8.8.

:::

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PE-7656 -->

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports network settings configuration without needing to
  restart the cluster. You can configure network interface controllers (NICs), virtual local area network (VLAN)
  interfaces, bonds, and bridges. Refer to the
  [Configure Network Interfaces in Local UI](../clusters/edge/local-ui/host-management/configure-network-interfaces.md)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-7647 -->

- The EdgeForge workflow now enables the creation of MAAS-compatible images. Refer to
  [Build MAAS Image](../clusters/edge/edgeforge-workflow/palette-canvos/build-maas-image.md) to learn how to create
  custom MAAS images for Palette Edge and
  [Deploy Edge Hosts on MAAS](../clusters/edge/site-deployment/maas-deployment.md) for step-by-step instructions on
  uploading images to MAAS and deploying Edge hosts using the MAAS UI.

#### Improvements

<!-- https://spectrocloud.atlassian.net//browse/PE-7782 -->

- [Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md) has exited Tech Preview and is now ready for production
  workloads.

<!-- https://spectrocloud.atlassian.net//browse/PE-7472 -->

<!-- prettier-ignore-start -->

- The <VersionedLink text="Canonical Kubernetes" url="/integrations/packs/?pack=kubernetes-ck8s" /> versions 1.32.8 and 1.33.3 have been updated to use `etcd` as the datastore, replacing `k8s-dqlite`.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net//browse/PE-7657 -->

- The Edge [Terminal User Interface (TUI)](../clusters/edge/site-deployment/site-installation/initial-setup.md) has been
  upgraded to Kairos version 3.5.9. The TUI now allows you to customize the color scheme and disable advanced settings,
  such as user accounts and SSH keys.

<!-- https://spectrocloud.atlassian.net/browse/PE-7856  -->

- The Edge [Terminal User Interface (TUI)](../clusters/edge/site-deployment/site-installation/initial-setup.md) now
  allows IP address updates after cluster creation, including changing from static IP to DHCP.

<!-- https://spectrocloud.atlassian.net/browse/PE-7828 -->

- Graphics Processing Unit (GPU) specifications for Edge hosts can now be retrieved for non-Nvidia devices and devices
  without the `nvidia-smi` command-line interface (CLI) installed. Palette automatically displays GPU information for
  Edge hosts with certain GPU vendor-model combinations; for other GPUs, Palette sources the information using the
  vendor-specific driver or CLI installed on the Edge host. If GPU information cannot be pulled automatically, users can
  provide GPU information manually via the `user-data` file (Appliance and Agent mode) or with a
  `custom-hardware-specs-lookup.json` file (Appliance mode only). Refer to
  [Prepare User Data and Argument Files](../clusters/edge/edgeforge-workflow/prepare-user-data.md#configure-gpu-specifications-optional)
  for more information.

<!-- https://spectrocloud.atlassian.net//browse/PE-7322 -->

- A new `FORCE_INTERACTIVE_INSTALL` flag has been added to the
  [`.arg` file](../clusters/edge/edgeforge-workflow/palette-canvos/arg.md). When enabled, the **Palette Edge Interactive
  Installer** is selected by default in the GRUB menu on first boot, allowing manual disk selection for ISO-based
  installations.

#### Deprecations and Removals

- The `stylus.installationMode`
  [Edge Installer Configuration](../clusters/edge/edge-configuration/installer-reference.md) flag is no longer
  available. Use the `stylus.managementMode` flag instead, which has two allowed values: `central`, which means the Edge
  host is connected to Palette, and `local`, which means the Edge host has no connection to a Palette instance. Refer to
  the [Prepare User Data](../clusters/edge/edgeforge-workflow/prepare-user-data.md) guide for further information.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-4938 -->

- Fixed an issue that caused [Local UI](../clusters/edge/local-ui/local-ui.md) to display a **Running** status while
  pack updates were still being applied.

<!-- https://spectrocloud.atlassian.net/browse/PE-7504 -->

- Fixed an issue that caused some CoreDNS pods to enter the `CrashLoopBackOff` state on Edge clusters whose hosts run
  Ubuntu 24.04 with a Unified Kernel Image (UKI).

<!-- https://spectrocloud.atlassian.net/browse/PE-7625 -->

- Fixed an issue that caused stale User Data Protocol (UDP) sessions to appear in the `conntrack` table on Edge hosts
  that have been disconnected and reconnected from the Local Area Network (LAN) cable.

<!-- https://spectrocloud.atlassian.net/browse/PE-7702 -->

- Fixed an issue that prevented
  [registry mapping rules](../clusters/edge/edge-configuration/installer-reference.md#registry-mapping-rules) from
  working with local registries.

<!-- https://spectrocloud.atlassian.net/browse/PE-7727 -->

- Fixed an issue that prevented Palette from applying priority classes on critical upgrade pods, leading to scheduling
  errors during cluster upgrades.

<!-- https://spectrocloud.atlassian.net/browse/PE-7786 -->

- Fixed an issue that caused Edge reset operations to fail on nodes whose `COS_PERSISTENT` partition is LUKS-encrypted.

<!-- https://spectrocloud.atlassian.net/browse/PE-7862 -->

- Fixed an issue that caused the Edge
  [Terminal User Interface (TUI)](../clusters/edge/site-deployment/site-installation/initial-setup.md) to display the
  Local UI address with the `http` prefix instead of `https`.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.8.a) for more details.

- <TpBadge /> Palette VerteX now supports deploying Azure IaaS clusters to [Azure Government Secret
  cloud](https://azure.microsoft.com/en-us/explore/global-infrastructure/government/national-security), providing
  flexibility for organizations that need to meet stringent security requirements. Refer to the [Register and Manage
  Azure Cloud Account](../clusters/public-cloud/azure/azure-cloud.md#azure-government-secret-cloud) and [Create and
  Manage Azure IaaS Cluster](../clusters/public-cloud/azure/create-azure-cluster.md) guides for more information.

### Virtual Machine Orchestrator (VMO)

#### Improvements

<!-- https://spectrocloud.atlassian.net//browse/PEM-9039 -->

- The KubeVirt version has been upgraded to v1.7. Other components of the VMO pack have also been upgraded, enhancing
  system reliability and security.

<!-- https://spectrocloud.atlassian.net//browse/PEM-8306 -->

- The Virtual Machine Orchestrator (VMO) now supports the persistent EFI parameter, enhancing support for airgapped
  usecases. Previously, VM creation only supported Secure Boot under bootloader.efi and omitted persistent.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-8574 -->

- Fixed an issue that caused [VM migration](../vm-management/vm-migration-assistant/create-migration-plans.md) to fail
  due to `Missing smm: true` errors on VMs with secure boot enabled.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9294 -->

- Fixed an issue that prevented [private CA Certificate](../vm-management/configure-private-ca-certificate.md)
  configurations from being correctly applied.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.27.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.27.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2101 -->

- [Palette CLI](../automation/palette-cli/palette-cli.md) version 4.8.5 now includes the `--acknowledge-banner` flag on
  the [login](../automation/palette-cli/commands/login.md) command, allowing CI/CD environments to skip manual banner
  acceptance.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2092 -->
<!-- https://spectrocloud.atlassian.net/browse/PLT-2056 -->

- The cluster resources of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) now
  support configuring additional annotations and labels, as well machine pool update strategies. Additionally, the
  cluster resources now support time zone configuration, ensuring that maintenance tasks like upgrades execute at the
  appropriate local time for the cluster.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2073 -->

- The
  [`spectrocloud_cluster_apache_cloudstack` resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_apache_cloudstack)
  now supports template names for machine image configuration, allowing users to customize machine images for individual
  node pools.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2017 -->

- The
  [`spectrocloud_registry_oci` resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/registry_oci)
  now includes the `wait_for_sync` field, allowing you to wait for the OCI registry to complete its initial
  synchronization before marking the resource as created or updated. This operation is supported for Zarf and Helm
  registries.

### Packs

#### Pack Notes

<!-- https://spectrocloud.atlassian.net//browse/PEM-7631 -->

- The [Spectro Kubernetes Dashboard](../clusters/cluster-management/spectro-kubernetes-dashboard.md) pack is now
  supported on AWS EKS clusters.

<!-- https://spectrocloud.atlassian.net/browse/PAC-3418 -->

<!-- prettier-ignore-start -->

- <VersionedLink text="Kubernetes (AKS)" url="/integrations/packs/?pack=kubernetes-aks" /> version 1.34 now supports the configuration of pod CIDR and service ClusterIP ranges.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PAC-2620 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3541 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3446 -->
<!-- https://spectrocloud.atlassian.net/browse/PCOM-150 -->

| Pack Name                          | Layer      | Non-FIPS           | FIPS               | New Version |
| ---------------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Amazon EBS CSI                     | CSI        | :white_check_mark: | :x:                | 1.53.0      |
| AWS Application Loadbalancer       | Add-on     | :white_check_mark: | :x:                | 2.17.0      |
| AWS Cluster Autoscaler             | Add-on     | :white_check_mark: | :x:                | 1.35.0      |
| Argo CD                            | CSI        | :white_check_mark: | :x:                | 9.1.7       |
| Argo CD                            | CSI        | :white_check_mark: | :x:                | 9.1.6       |
| Argo CD                            | CSI        | :white_check_mark: | :x:                | 9.1.4       |
| Calico                             | CNI        | :white_check_mark: | :x:                | 3.31.3      |
| Cert Manager                       | Add-on     | :white_check_mark: | :x:                | 1.19.1      |
| Cilium                             | CNI        | :white_check_mark: | :x:                | 1.18.4      |
| Crossplane                         | Add-on     | :white_check_mark: | :x:                | 2.1.1       |
| External DNS                       | Add-on     | :white_check_mark: | :x:                | 0.19.0      |
| External Secrets                   | Add-on     | :white_check_mark: | :x:                | 1.2.0       |
| External Secrets                   | Add-on     | :white_check_mark: | :x:                | 1.1.1       |
| Flux2                              | Add-on     | :white_check_mark: | :x:                | 2.17.2      |
| GCE Persistent Disk CSI            | CSI        | :white_check_mark: | :x:                | 1.22.5      |
| Istio                              | Add-on     | :white_check_mark: | :x:                | 1.28.2      |
| Karpenter                          | Add-on     | :white_check_mark: | :x:                | 1.8.3       |
| Kubernetes (AKS)                   | Kubernetes | :white_check_mark: | :white_check_mark: | 1.34        |
| Local Path Provisioner             | CSI        | :white_check_mark: | :white_check_mark: | 0.0.32      |
| Reloader                           | Add-on     | :white_check_mark: | :x:                | 1.4.12      |
| Reloader                           | Add-on     | :white_check_mark: | :x:                | 1.4.11      |
| Nginx                              | Add-on     | :white_check_mark: | :x:                | 1.14.1      |
| Palette eXtended Kubernetes - Edge | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.6      |
| Palette eXtended Kubernetes - Edge | Kubernetes | :white_check_mark: | :white_check_mark: | 1.32.10     |
| Palette eXtended Kubernetes - Edge | Kubernetes | :white_check_mark: | :white_check_mark: | 1.31.14     |
| Prometheus Agent                   | Add-on     | :white_check_mark: | :x:                | 27.51.0     |
| Prometheus Operator                | Add-on     | :white_check_mark: | :x:                | 80.4.2      |
| Zot Registry                       | Add-on     | :white_check_mark: | :white_check_mark: | 0.1.89-rev1 |

#### Deprecations and Removals

<!-- prettier-ignore-start -->

- <VersionedLink text="Cert Manager" url="/integrations/packs/?pack=certmanager" /> pack versions 1.1.0, 1.7.1, and 1.9.1 are now deprecated. Upgrade your workloads to use Cert Manager pack version 1.19.1 or later.
- The <VersionedLink text="Spectro Kubernetes Dashboard" url="/integrations/packs/?pack=spectro-k8s-dashboard" /> and <VersionedLink text="Kubernetes Dashboard" url="/integrations/packs/?pack=k8s-dashboard" /> packs are now deprecated. This is due to the archiving of upstream projects.

<!-- prettier-ignore-end -->

## December 30, 2025 - Release 4.8.16

### Improvements

<!-- prettier-ignore-start -->
<!-- PCP-5639 -->
- The process of deploying AWS EKS clusters using <VersionedLink text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss" /> has been streamlined. Users no longer need to disable the `kube-proxy` and `aws-node` DaemonSets or update the `charts.cilium.k8sServiceHost` parameter during deployment. Refer to [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md) for the updated deployment process.

<!-- prettier-ignore-end -->

<!-- PCP-5648 -->

- Two subnets can now be configured for MAAS LXD workload clusters using the Kubernetes layer of your MAAS cluster
  profile. One subnet is designed for the preboot execution environment (PXE), which is used for the initial booting and
  provisioning of LXD virtual machines. The other subnet is used to configure static IP addresses for workload traffic.
  Refer to
  [Create and Manage MAAS Clusters Using LXD VMs](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md#deploy-a-workload-cluster-with-lxd-vms-as-control-plane-nodes)
  for more information.

### Bug Fixes

<!-- PCP-5701 -->

- Fixed an issue where cluster profile updates were not applied to clusters until restarting the
  `cluster-management-agent` pod.

<!-- PE-7738 -->

- Fixed an issue where CoreDNS entered a crash loop after node reboots in Rocky Linux RKE2 FIPS clusters.

<!-- prettier-ignore-start -->
<!-- PEM-9432 -->
- Fixed a compatibility issue between the <VersionedLink text="Virtual Machine Orchestrator (VMO)" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> and <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> packs.
<!-- prettier-ignore-end -->

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->
<!-- PAC-3145 -->
- <VersionedLink text="Kubernetes (EKS)" url="/integrations/packs/?pack=kubernetes-eks" /> pack version 1.33 is now available. Due to a [known issue](./known-issues.md), if configuring Palette as your Identity Provider (IdP), you must add `identityProviderConfigName: "eks-oidc"` to the Kubernetes layer of your cluster profile.

    ```yaml {3}
    managedControlPlane:
      oidcIdentityProvider:
        identityProviderConfigName: "eks-oidc"
    ```
<!-- prettier-ignore-end -->

## December 19, 2025 - Component Updates {#component-updates-2025-51}

The following components have been updated for Palette version 4.8.6 - 4.8.12.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.26.2  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.26.2  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.8.12  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.8.12  |

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2068 -->

- Fixed an issue that caused duplicate cluster packs errors to appear when Terraform
  [`spectrocloud_cluster_profile`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_profile)
  updates triggered API validation errors.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2069 -->

- Fixed an issue that caused certain Day-2 cluster operations to fail for clusters with the Terraform
  [`spectrocloud_addon_deployment`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/addon_deployment)
  resource.

### Packs

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-3285 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3350 -->
<!-- prettier-ignore-start -->

- <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbort"/> pack version 1.18.1 now supports configuring HTTP access. Refer to the pack <VersionedLink text="Additional Details" url="/integrations/packs/?pack=harbor&tab=custom"/> tab for further information. 

- Users can now use Ubuntu 22.04 on [VMware](../clusters/data-center/vmware/vmware.md), [Azure](../clusters/public-cloud/azure/azure-cloud.md), and [MAAS](../clusters/data-center/maas/maas.md) clusters using the FIPS <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> pack version 1.33.5.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PAC-3504 -->

| Pack Name                    | Layer  | Non-FIPS           | FIPS               | New Version |
| ---------------------------- | ------ | ------------------ | ------------------ | ----------- |
| Calico                       | CNI    | :x:                | :white_check_mark: | 3.31.2      |
| Harbor                       | Add-on | :white_check_mark: | :x:                | 1.18.1      |
| Istio                        | Add-on | :white_check_mark: | :x:                | 1.28.1      |
| Kong                         | Add-on | :white_check_mark: | :x:                | 3.0.0       |
| Prometheus Agent             | Add-on | :white_check_mark: | :x:                | 27.49.0     |
| Prometheus Operator          | Add-on | :white_check_mark: | :x:                | 79.11.0     |
| Spectro Kubernetes Dashboard | Add-on | :white_check_mark: | :x:                | 7.13.0      |
| Ubuntu (Azure)               | OS     | :x:                | :white_check_mark: | 22.04       |
| Ubuntu (MAAS)                | OS     | :x:                | :white_check_mark: | 22.04       |
| Ubuntu (vSphere)             | OS     | :x:                | :white_check_mark: | 22.04       |

## December 17, 2025 - Release 4.8.12

The following component updates are applicable to this release:

- [December 19, 2025 - Component Updates](#component-updates-2025-51) <!-- omit in toc -->

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-4786 -->

- <TpBadge /> Palette now supports the cluster provisioning and management of CloudStack clusters. Refer to the
  [CloudStack](../clusters/data-center/cloudstack/cloudstack.md) section for further information. Review the active
  known issues that affect CloudStack on the [Known Issues](./known-issues.md) page.

- Terraform version 0.26.1 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- Crossplane version 0.26.1 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

<!-- https://spectrocloud.atlassian.net/browse/PLT-1986  https://spectrocloud.atlassian.net/browse/PLT-1995 -->

- The [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
  and [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette)
  now support CloudStack.

  - The `spectrocloud_cloudaccount_apache_cloudstack` data source supports the creation of CloudStack cloud accounts.
  - The `spectrocloud_cluster_apache_cloudstack` resource supports configuration and deployment of CloudStack clusters.

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-8906 -->

- The KubeVirt version used by the Palette [Virtual Machine Orchestrator](../vm-management/vm-management.md) is now
  v1.6.2.

<!-- https://spectrocloud.atlassian.net/browse/PEM-8172 -->

- The `virt-v2v` version used by the Palette
  [Virtual Machine Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) is now
  v2.9.0.

  As part of the upgrade, the
  [VMware Virtual Disk Development Kit (VDDK) image](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest)
  is now a requirement for migrations. This image was previously optional but is now necessary for the migration
  process. Refer to the [Create Source Providers](../vm-management/vm-migration-assistant/create-source-providers.md)
  guide for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-7479 -->

- The default timeout of [Local UI](../clusters/edge/local-ui/local-ui.md) JWT tokens has been reduced to 15 minutes.
  Additionally, tokens are now revoked upon log out.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5500 https://spectrocloud.atlassian.net/browse/PCP-5594 -->

- The dependencies of the `imageswap` and `imageswap-init` Palette images were updated to the latest versions, ensuring
  that they have the latest security patches. Additionally, the `ubuntu-systemd` image has been removed from Palette.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9158 -->

- The performance of the `/clusterprofiles` [Palette API](/api/introduction) endpoint has been improved.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-5551 -->

- Fixed an issue that caused [EKS clusters](../clusters/public-cloud/aws/eks.md) to fail to provision due to missing
  retry logic for trust policy ConfigMaps.

<!-- https://spectrocloud.atlassian.net/browse/PE-7790 -->
<!-- prettier-ignore-start -->
- Fixed an issue that caused Day-2 operations to fail on Palette [Edge clusters](../clusters/edge/edge.md) configured with
external provider registries in the <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)
" url="/integrations/packs/?pack=edge-k8s"/> pack.
<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PLT-2026 -->
- Fixed an issue that caused add-on deployments provisioned through the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) to
  remain in an unrecoverable, unhealthy state following a deployment error, even after fixing the root cause.

<!-- https://spectrocloud.atlassian.net/browse/PAC-3502 -->
<!-- prettier-ignore-start -->
- Fixed an issue that prevented the <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi"/> pack from being available to CloudStack clusters.
<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PE-7871 -->
- Fixed an issue that prevented [agent mode](../deployment-modes/agent-mode/agent-mode.md) from retaining network configurations after boot.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9332 -->
- Fixed an issue that caused the [Virtual Machine Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) plans to fail due to `PodSecurity` violation errors.

<!-- https://spectrocloud.atlassian.net/browse/PE-7817 -->
- Fixed an issue that caused [content bundle builds](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) configured on encrypted partitions to become stuck.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5574 -->
- Fixed an issue that caused multiple versions of the `spectro-reach` image to be installed in [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md).

<!-- https://spectrocloud.atlassian.net/browse/PCP-5573 -->
- Fixed an issue that caused an incorrect version of the `palette-agent` image to be referenced by the Palette `ally` service.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9217 -->
- Fixed an issue that prevented the **Delete** action from correctly displaying for [cluster templates](../cluster-templates/cluster-templates.md) in the Palette UI.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9350 -->
- Fixed an issue that caused Windows 25 server VMs to become inaccessible after being migrated using the [Virtual Machine Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-9395 -->
- Fixed an issue that caused the [CloudStack](../clusters/data-center/cloudstack/cloudstack.md) PCG type to appear under **Tenant Settings** even though it was disabled using a system administration [feature flag](../enterprise-version/system-management/feature-flags.md).

### Packs

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-3334 -->
- The following packs support [CloudStack](../clusters/data-center/cloudstack/cloudstack.md) deployment:
  - Ubuntu 24.04
  - Palette eXtended Kubernetes versions 1.31.14, 1.32.10, and 1.33.6
  - Calico 3.30.3-rev1
  - CloudStack CSI 2.5.0

<!-- https://spectrocloud.atlassian.net/browse/PAC-3492 https://spectrocloud.atlassian.net/browse/PAC-3445 -->
| Pack Name                   | Layer      | Non-FIPS           | FIPS               | New Version |
| --------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Azure Disk                  | Storage    | :white_check_mark: | :x:                | 1.33.7      |
| External Secrets Operator   | Add-on     | :white_check_mark: | :x:                | 1.1.0       |
| GCE Persistent Disk CSI     | Storage    | :white_check_mark: | :x:                | 1.22.4      |
| Nvidia GPU Operator         | Add-on     | :white_check_mark: | :x:                | 25.10.1     |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.6      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.32.10     |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.31.14     |
| Prometheus Agent            | Add-on     | :white_check_mark: | :x:                | 27.47.0     |
| Prometheus Operator         | Add-on     | :white_check_mark: | :x:                | 79.8.2      |
| Volume Snapshot Controller  | Add-on     | :white_check_mark: | :x:                | 8.4.0       |
| vSphere CSI                 | Storage    | :white_check_mark: | :white_check_mark: | 3.6.0       |

## December 12, 2025 - Component Updates {#component-updates-2025-50}

The following components have been updated for Palette version 4.8.6 - 4.8.9.

| Component                                                                                             | Version |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) | 4.8.10  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)        | 4.8.10  |

Review the active known issues that affect this component update on the [Known Issues](./known-issues.md) page.

### Bug Fixes

- Fixed an issue that caused [`stylus`](../clusters/edge/edge-configuration/installer-reference.md) to incorrectly map
  some image references.

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
| KubeRay Operator             | Add-on | :white_check_mark: | :x:                | 1.5.1       |
| Open Policy Agent            | Add-on | :white_check_mark: | :x:                | 3.21.0      |
| Prometheus Agent             | Add-on | :white_check_mark: | :x:                | 27.45.0     |
| Prometheus Operator          | Add-on | :white_check_mark: | :x:                | 79.5.0      |
| Ubuntu (GCP)                 | OS     | :white_check_mark: | :x:                | 24.04       |
| Zot Registry                 | Add-on | :white_check_mark: | :white_check_mark: | 0.1.89      |

## December 5, 2025 - Release 4.8.9

The following component updates are applicable to this release:

- [December 5, 2025 - Component Updates](#component-updates-2025-49) <!-- omit in toc -->
- [December 12, 2025 - Component Updates](#component-updates-2025-50) <!-- omit in toc -->
- [December 19, 2025 - Component Updates](#component-updates-2025-51) <!-- omit in toc -->

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
- [December 12, 2025 - Component Updates](#component-updates-2025-50) <!-- omit in toc -->
- [December 19, 2025 - Component Updates](#component-updates-2025-51) <!-- omit in toc -->

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
- [December 12, 2025 - Component Updates](#component-updates-2025-50) <!-- omit in toc -->
- [December 19, 2025 - Component Updates](#component-updates-2025-51) <!-- omit in toc -->

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
