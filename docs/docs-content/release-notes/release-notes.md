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

## June 5, 2026 - Component Updates {#component-updates-2026-23}

<!-- COMPONENT UPDATES TICKET: DOC-2869 -->
<!-- RELEASE DATE: June 5, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.x -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.3 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.4 -->

The following components have been updated for Palette version 4.9.5 - 4.9.14.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                                | 4.9.3   |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.4  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.4  |

<!-- BEGIN COMPONENT UPDATES BODY. DO NOT DELETE. -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PAC-3667 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3668 -->

<!-- prettier-ignore-start -->

- Certificates are now automatically renewed before expiration, eliminating manual intervention and service downtime for <VersionedLink text="Zot Registry" url="/integrations/packs/?pack=zot-registry" /> and <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" />  in Edge clusters.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PLT-2215 -->

- The
  [`spectrocloud_cluster_aks` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aks)
  now allows you to specify the OS SKU for AKS node pools using the optional `os_sku` field in the `machine_pool` block.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2236 -->

- Terraform cluster resources now support triggering manual control plane Kubernetes Public Key Infrastructure (PKI)
  certificates for Palette clusters using the new `renew_k8s_certificates_now` field.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2173 -->

- Fixed a Terraform issue where updating the `cluster_profile` list on the
  [`spectrocloud_cluster_eks` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_eks)
  triggered an erroneous deletion of the removed profile and incorrectly updated the Terraform state.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2249 -->

- Fixed a Terraform issue where imported
[`spectrocloud_cluster_edge_native`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_edge_native)
resources would repeatedly show Terraform plan differences for sensitive cluster profile variables.
<!-- END COMPONENT UPDATES BODY. DO NOT DELETE. -->

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4123 -->

| Pack Name        | Layer  | Non-FIPS           | FIPS               | New Version |
| ---------------- | ------ | ------------------ | ------------------ | ----------- |
| Amazon EBS CSI   | CSI    | :x:                | :white_check_mark: | 1.60.0      |
| Azure Disk       | CSI    | :x:                | :white_check_mark: | 1.34.3      |
| Calico           | CNI    | :white_check_mark: | :x:                | 3.32.0      |
| External Secrets | Add-on | :white_check_mark: | :x:                | 2.5.0       |
| Flannel          | CNI    | :x:                | :white_check_mark: | 0.28.4      |
| Istio            | Add-on | :white_check_mark: | :x:                | 1.30.0      |
| Karpenter        | Add-on | :x:                | :white_check_mark: | 1.12.1      |
| MetalLB          | Add-on | :white_check_mark: | :x:                | 0.16.1      |

#### Pack Notes

<!-- prettier-ignore-start -->

- The <VersionedLink text="Crossplane" url="/integrations/packs/?pack=crossplane" /> pack version 2.3.0 is now available in the Palette Community Registry.

<!-- prettier-ignore-end -->

## May 31, 2026 - Release 4.9.14 {#release-notes-4-9-a}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-a}

#### Breaking Changes {#breaking-changes-4-9-a}

<!-- https://spectrocloud.atlassian.net/browse/PCP-6185 -->

- Palette now uses IAM Roles for Service Accounts (IRSA) instead of kube2iam for Velero backup operations on
  [EKS clusters](../clusters/public-cloud/aws/eks.md) that use AWS Security Token Service (STS) credentials.

  To prevent backup disruptions,
  [pause agent upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) on your EKS
  clusters before upgrading to Palette 4.9.14 and update the backup IAM role's trust policy by adding the EKS cluster's
  OpenID Connect (OIDC) provider as a federated principal and allowing the `sts:AssumeRoleWithWebIdentity` action. Refer
  to
  [Add Backup Location using Dynamic Credentials](../clusters/cluster-management/backup-restore/add-backup-location-dynamic.md)
  for detailed instructions on updating the trust policy.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-4787 -->

- <TpBadge /> Palette now supports overriding Cluster API (CAPI) properties on AWS IaaS and Azure AKS clusters. This
  allows you to configure advanced provider-specific settings not natively exposed by Palette by supplying YAML that
  targets the underlying CAPI provider objects directly. For more information, refer to [Override Cluster API (CAPI)
  Properties](../architecture/override-capi-properties/override-capi-properties.md).

<!-- https://spectrocloud.atlassian.net/browse/PCP-5930 -->

- Palette now supports deployment of
  [Generation 2 (Gen 2) Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/generation-2) on AKS
  clusters. When you select an instance type that supports Gen 2 (for example, `Standard_D8ds_v6`), Azure automatically
  provisions the nodes as Gen 2 VMs instead of Gen 1 VMs. Changing a node pool's instance type between Gen 1 and Gen 2
  variants on a running cluster triggers a
  [node pool repave](../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration). For more
  information, refer to [Create and Manage Azure AKS Cluster](../clusters/public-cloud/azure/aks.md).

  - For further upgrade guidance, review the
    [Azure documentation](https://learn.microsoft.com/en-us/azure/virtual-machines/generation-2). This covers supported
    size families and the move to UEFI-based boot architecture.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5897 -->

- SSH key injection is now supported for [MAAS clusters](../clusters/data-center/maas/create-manage-maas-clusters.md).

<!-- https://spectrocloud.atlassian.net/browse/PRM-2624 -->

- [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) version 4.9.14 are now
  available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/DOC-2822 -->

- <TpBadge /> You can now use a pre-built Docker image to import a MAAS-compatible CentOS Stream CoreOS (SCOS) image
  when [preparing the CoreOS
  image](../clusters/data-center/maas/create-manage-maas-openshift-clusters-hypershift/prepare-coreos-image.md) required
  for OpenShift workload clusters on MAAS using HyperShift. This provides a faster alternative to building a custom Red
  Hat Enterprise Linux CoreOS (RHCOS) image from source.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2788 -->

- The metrics server commands for
  [imported read-only clusters](../clusters/imported-clusters/cluster-import.md#read-only-mode) now use the
  [Kubernetes Metrics Server](https://kubernetes-sigs.github.io/metrics-server/) Helm chart instead of Bitnami.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9692 -->

- The ability to **Force sync** [registries](../registries-and-packs/registries/registries.md) has been added to
  **Tenant Settings** > **Registries**. Use this option to interrupt and restart ongoing synchronization processes that
  have been in progress for at least one hour.

<!-- https://spectrocloud.atlassian.net/browse/PEM-8010 -->

- A list of available and allocated IP addresses is now displayed for VMware vSphere
  [IP Address Management (IPAM) node pools](../clusters/pcg/manage-pcg/create-manage-node-pool.md).

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/PEM-10226 -->

- The internal [Ingress Nginx](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) controller used by
  Palette and Palette VerteX management plane services has been fully removed. Traefik, introduced in 4.8.47, is now the
  sole management cluster ingress controller. The management plane removes leftover Ingress Nginx objects automatically
  at startup (such as Deployments, Services, Secrets, and more), preventing the need for manual cleanup. Self-hosted
  installations retain the `ingress-nginx` namespace and `default-ssl-certificate` Secret due to the the cert-bridge
  introduced in 4.8.47, which continues to copy the uploaded Transport Layer Security (TLS) certificate from that Secret
  into Traefik.

  - **Google Kubernetes Engine (GKE) pre-upgrade requirement** - The principal running `helm upgrade` must have the
    `container.roles.delete`, `container.roleBindings.delete`, `container.clusterRoles.delete`, and
    `container.clusterRoleBindings.delete` Cloud Identity and Access Management (IAM) permissions. Refer to
    [Upgrade Palette on Kubernetes](../enterprise-version/upgrade/upgrade-k8s/non-airgap.md) for details.
  - **Recommended `values.yaml` hygiene** - The `ingress.type` and `ingress.ingress.internal` fields have been removed
    from the Palette Helm chart. Any references that remain in your override file are ignored; however, we recommend
    removing both fields for hygiene purposes. Refer to
    [Helm Configuration Reference](../enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref.md) for
    the current set of supported parameters.
  - **Recovery** - If the `configserver` is not **Ready** after upgrading due to leftover Ingress Nginx pods holding
    host ports, refer to our
    [Troubleshooting](../troubleshooting/palette-upgrade.md#configserver-stuck-on-init-rootdomain-traefik-after-upgrade-to-4914)
    guide for the manual cleanup procedure.

<!-- https://spectrocloud.atlassian.net/browse/PE-8669 -->

- [EKS Hybrid Nodes](../clusters/public-cloud/aws/eks-hybrid-nodes/eks-hybrid-nodes.md) are now deprecated in Palette
  and Palette VerteX. We recommend that customers deploy their workloads to
  [EKS clusters](../clusters/public-cloud/aws/eks.md) instead.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10824 -->

- Fixed an issue that caused strict YAML validators and GitOps tools to reject
  [self-hosted Palette](../enterprise-version/enterprise-version.md) deployment templates due to a duplicate
  `securityContext` configuration block in the Helm chart.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6583 -->

- Fixed an issue that caused scheduled [OS patching](../clusters/cluster-management/os-patching.md) to run only once
  instead of on the configured recurring schedule.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10718 -->

- Fixed an issue that caused the **Clusters** page to hang indefinitely when accessed by users with a
  [custom tenant role](../user-management/palette-rbac/create-custom-role.md) that lacked virtual cluster permissions.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10636 -->

- Fixed an issue that caused multi-line formatting in
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) and cluster description fields to be lost after
  saving.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6498 -->

- Fixed an issue that caused changes to additional security groups on
  [AWS IaaS](../clusters/public-cloud/aws/create-cluster.md) node pools to be silently ignored when replacing one
  security group with another without changing the total count.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10599 -->

- Fixed an issue that caused intermittent `no subscriber found` errors when performing
  [MAAS cloud account](../clusters/data-center/maas/register-manage-maas-cloud-accounts.md) operations through a
  [Private Cloud Gateway (PCG)](../clusters/pcg/pcg.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-10547 -->

- Fixed an issue that caused the **Cluster Settings** > **Cluster Configuration** page to display a generic error when
  attempting to show SSH key names for users whose role lacked the permission `sshKey.list`.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6452 -->

- Fixed an issue that caused [MAAS cluster](../clusters/data-center/maas/create-manage-maas-clusters.md) node pools
  configured with multiple placement tags to match machines using only the last tag instead of all specified tags.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10527 -->

- Fixed an issue that caused [EKS cluster](../clusters/public-cloud/aws/eks.md) add-on packs to appear as not ready in
  the Palette UI, even though the packs were deployed successfully and the cluster was running.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5840 -->

- Fixed an issue that caused
  [add-on Helm charts](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md)
  that entered an `uninstalling` state to remain stuck indefinitely, preventing the pack from being redeployed.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6478 -->

- Fixed an issue that caused [virtual clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md)
  deployed on EKS 1.34 and 1.35 host clusters to fail or have add-on packs permanently stuck in a not ready state.

  <!-- https://spectrocloud.atlassian.net/browse/PCP-6453 -->

- Fixed an issue that prevented [virtual clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md)
  from being deployed on EKS host clusters when the Kubernetes version on the virtual cluster and host cluster did not
  match.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-691 -->

- Fixed an issue that prevented
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) version 4.9.8
  from installing on Secure Boot hardened infrastructures.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.14 Palette release is 4.9.10.

:::

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PE-8427 -->

- The Palette agent can now be uninstalled from Edge hosts deployed with Agent Mode using the `palette-agent uninstall`
command. Refer to our
[Install Palette Agent](../deployment-modes/agent-mode/install-agent-host.md#uninstall-palette-agent) guide for more
information.
<!-- https://spectrocloud.atlassian.net/browse/PE-3561 -->

<!-- prettier-ignore-start -->

- <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> is now supported for Trusted Boot. Refer to the [Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md) page for a list of supported configurations for clusters deployed on Trusted Boot-enabled Edge hosts.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PE-7637 -->

- Network Time Protocol (NTP) values can now be configured per Edge host via
  [user data](../clusters/edge/edge-configuration/installer-reference.md) using `stylus.site.ntpServers`, the
  [Edge TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md), or
  [Local UI](../clusters/edge/local-ui/local-ui.md). NTP values used during cluster creation override the servers
  configured on individual hosts.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8523 -->

- Fixed an issue that could allow unauthenticated users to
  [upload content bundles](../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) to Edge hosts under
  certain conditions. Refer to
  [Security Advisory 016](../security-bulletins/security-advisories/security-advisories.md#security-advisory-016---upload-service-authentication-bypass)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-8716 -->

- Fixed an issue on Edge clusters with [image swap](../clusters/cluster-management/image-swap.md) enabled that caused
  cluster upgrade tasks to get stuck due to the image-swap webhook interfering with Kubernetes Job completion.

<!-- https://spectrocloud.atlassian.net/browse/PE-8570 -->

- Fixed an issue that caused Kubernetes upgrades on [Edge clusters](../clusters/edge/edge.md) to fail when the host OS
  root password had expired.

<!-- https://spectrocloud.atlassian.net/browse/PE-8507 -->

- Fixed an issue that caused `systemd-networkd-wait-online.service` to fail on the first boot of
  [Edge hosts](../clusters/edge/site-deployment/site-installation/site-installation.md) with `managementMode: local` and
  `includeTui: true`, even after configuring network settings through the TUI.

<!-- https://spectrocloud.atlassian.net/browse/PE-7651 -->

- Fixed an issue that allowed a Kubernetes upgrade to proceed on [Edge clusters](../clusters/edge/edge.md) even when a
  previous upgrade had not completed successfully, potentially leaving the cluster in an inconsistent state.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-a) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/DOC-2801 -->

- The Palette Edge CLI has been deprecated and there will be no further releases. For continued functionality, use the
  Palette CLI instead. Refer to the [Palette CLI documentation](../automation/palette-cli/palette-cli.md) for more
  information.

#### Features

- Terraform version 0.29.3 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.29.3 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2246 -->
<!-- https://spectrocloud.atlassian.net/browse/PLT-2226 -->

- The
  [`spectrocloud_cluster_aks`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aks)
  and
  [`spectrocloud_cluster_aws`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws)
  Terraform resources now support Cluster API property overrides using the `override_cluster_api_config` field.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2232 -->

- The
  [`spectrocloud_cluster_maas`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_maas)
  Terraform resource now supports the injection of SSH keys into MAAS nodes using the `ssh_keys` field.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2242 -->

- Fixed an issue that caused the
  [`spectrocloud_cluster_edge_native`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_edge_native)
  Terraform resource to incorrectly reconcile VIP values after import.

### Docs and Education

- A new
  [Standardize Cluster Provisioning and Maintenance with Cluster Templates using Terraform](../tutorials/clusters/cluster-templates/standardize-clusters-with-cluster-templates-terraform.md)
  tutorial is now available. Follow it to learn how to use the Spectro Cloud Terraform provider to create cluster
  templates, deploy standardized clusters, and manage lifecycle updates with infrastructure as code.

- Documentation improvements have been made for EKS Pod Identity on the
  [Register and Manage AWS Accounts](../clusters/public-cloud/aws/add-aws-accounts.md) and
  [Enable Pod Identity for ECR Authentication](../clusters/public-cloud/aws/enable-pod-identity-ecr.md) pages. This
  includes clarifying the required permissions for the Palette IAM role when using
  [Minimum Permissions Policies](../clusters/public-cloud/aws/required-iam-policies/minimum-permissions-policies.md) and
  providing more detailed instructions for identifying the IAM role for ECR authentication.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4115 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4101 -->

| Pack Name                  | Layer  | Non-FIPS           | FIPS | New Version |
| -------------------------- | ------ | ------------------ | ---- | ----------- |
| Amazon EFS                 | CSI    | :white_check_mark: | :x:  | 3.2.0       |
| Cilium                     | CNI    | :white_check_mark: | :x:  | 1.19.4      |
| Headlamp                   | Add-on | :white_check_mark: | :x:  | 0.42.0      |
| Karpenter                  | Add-on | :white_check_mark: | :x:  | 1.12.1      |
| Portworx with Operator     | CSI    | :white_check_mark: | :x:  | 3.6.0       |
| Volume Snapshot Controller | Add-on | :white_check_mark: | :x:  | 8.5.0-rev1  |

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-4101 -->

<!-- prettier-ignore-start -->

The <VersionedLink text="Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> version 8.5.0-rev1 supports the [snapshot conversion webhook](https://github.com/kubernetes-csi/external-snapshotter/blob/master/deploy/kubernetes/webhook-example/README.md).

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

The following community packs have been released:

- <VersionedLink text="Fluentbit" url="/integrations/packs/?pack=fluentbit" /> version 5.0.5
- <VersionedLink text="Trident" url="/integrations/packs/?pack=csi-trident" /> version 26.02.1

<!-- prettier-ignore-end -->

## May 22, 2026 - Component Updates {#component-updates-2026-21}

The following components have been updated for Palette version 4.9.5 - 4.9.8.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                                | 4.9.2   |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.2  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.2  |

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2240 -->

- Fixed a Terraform issue where `terraform apply` failed to reconcile add-on cluster profile drift in clusters when the
  add-on cluster profile is managed in Terraform but updated in the Palette UI.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-3910 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4071 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4073 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4074 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4075 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4099 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4105 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4110 -->

| Pack Name                                                                | Layer  | Non-FIPS           | FIPS               | New Version |
| ------------------------------------------------------------------------ | ------ | ------------------ | ------------------ | ----------- |
| [Amazon EBS CSI](/integrations/packs/?pack=csi-aws-ebs)                  | CSI    | :white_check_mark: | :x:                | 1.60.0      |
| [Amazon EFS](/integrations/packs/?pack=csi-aws-efs)                      | CSI    | :white_check_mark: | :x:                | 3.1.0       |
| [Calico Network Policy](/integrations/packs/?pack=calico-network-policy) | Add-on | :white_check_mark: | :x:                | 3.32.0      |
| [ExternalDNS](/integrations/packs/?pack=external-dns)                    | Add-on | :white_check_mark: | :x:                | 0.21.0      |
| [GCE Persistent Disk CSI](/integrations/packs/?pack=csi-gcp-driver)      | CSI    | :white_check_mark: | :x:                | 1.25.2      |
| [Spectro Proxy](/integrations/packs/?pack=spectro-proxy)                 | Add-on | :x:                | :white_check_mark: | 1.5.6       |
| [Tigera Operator](/integrations/packs/?pack=tigera-operator)             | CNI    | :white_check_mark: | :x:                | 3.32.0      |
| [Traefik](/integrations/packs/?pack=traefik)                             | Add-on | :white_check_mark: | :x:                | 40.2.0      |

#### Community Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4095 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4096 -->

| Pack Name                                                  | Layer  | New Version |
| ---------------------------------------------------------- | ------ | ----------- |
| [ECK Operator](/integrations/packs/?pack=elastic-operator) | Add-on | 3.4.0       |
| [ECK Stack](/integrations/packs/?pack=elastic-stack)       | Add-on | 0.19.0      |

## May 15, 2026 - Component Updates {#component-updates-2026-20}

The following components have been updated for Palette version 4.9.5 - 4.9.8.

| Component                                                                                             | Version |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                    | 4.9.1   |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) | 4.9.8   |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)        | 4.9.8   |

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PCOM-442 -->

- The [Artifact Studio](../downloads/artifact-studio.md) pack version dropdown now displays expanded version
  information, distinguishing between the pack component version and the Palette compatibility version. A tooltip also
  helps users clarify the difference between these version types.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4060 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4097 -->

| Pack Name                    | Layer  | Non-FIPS           | FIPS | New Version |
| ---------------------------- | ------ | ------------------ | ---- | ----------- |
| AWS Application Loadbalancer | Add-on | :white_check_mark: | :x:  | 3.3.0       |
| Cilium Tetragon              | Add-on | :white_check_mark: | :x:  | 1.7.0       |
| External Secrets             | Add-on | :white_check_mark: | :x:  | 2.4.1       |
| Harbor                       | Add-on | :white_check_mark: | :x:  | 1.19.0      |
| Karpenter                    | Add-on | :white_check_mark: | :x:  | 1.12.0      |
| Open Policy Agent            | Add-on | :white_check_mark: | :x:  | 3.22.2      |
| Traefik                      | Add-on | :white_check_mark: | :x:  | 40.0.0      |

## May 14, 2026 - Release 4.9.8

The following component updates are applicable to this release:

- [May 15, 2026 - Component Updates](#component-updates-2026-20) <!-- omit in toc -->
- [May 22, 2026 - Component Updates](#component-updates-2026-21) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-2824 -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-8535 -->

- The [Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md) now supports changing the root
  user's password.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PPD-1603 -->

- Fixed an issue in the [vCluster](https://www.vcluster.com/) template that caused vCluster deployments to fail for both
  k3s and generic Kubernetes configurations.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6604 -->

- Fixed an issue that caused
  [MAAS Clusters Using LXD VMs](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md) to fail with "no
  eligible LXD host found" due to storage availability being incorrectly parsed as zero, even when hosts had sufficient
  free disk space.

<!-- https://spectrocloud.atlassian.net/browse/PE-8641 -->

- Fixed an issue where Kubernetes and [kube-vip](https://kube-vip.io/) continue running with stale certificates after a
  certificate renewal.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6633 -->

- Fixed an issue that caused [EKS clusters](../clusters/public-cloud/aws/eks.md) configured with static placement or
  private endpoint access to fail to deploy due to EC2 permission errors.

## May 11, 2026 - Release 4.9.6

The following component updates are applicable to this release:

- [May 15, 2026 - Component Updates](#component-updates-2026-20) <!-- omit in toc -->
- [May 22, 2026 - Component Updates](#component-updates-2026-21) <!-- omit in toc -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-8525 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-8545 -->

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports dropdown profile variables for locally managed Edge
  clusters.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8509 -->

- Fixed an issue that caused Palette to register `429` rate limit errors due to excessive calls on the `/v1/edgehosts`
  [API endpoint](/api/category/palette-api-v1/).

<!-- https://spectrocloud.atlassian.net/browse/PCP-6560 -->
<!-- prettier-ignore-start -->

- Fixed an issue that caused Azure IaaS clusters using <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> version 1.32.13 or earlier to get stuck when upgrading to a PXK version in 1.33.x series.

<!-- https://spectrocloud.atlassian.net/browse/PE-8607 -->

- Fixed an issue that caused Edge hosts using <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> to become inaccessible after certificate renewal.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PEM-10677 -->

- The dependencies of the `mongo-enterprise` Palette image were updated to the latest versions, ensuring that it has the
  latest security patches.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6259 -->

- The Spectro Cloud Ubuntu images were rebuilt to ensure that they contain the latest security patches.

<!-- https://spectrocloud.atlassian.net/browse/PE-8564 -->

- The dependencies of the Palette agent were updated to the latest versions, ensuring that it has the latest security
  patches.

## May 8, 2026 - Component Updates {#component-updates-2026-19}

The following components have been updated for Palette version 4.9.5.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.1  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.1  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.9.6   |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.9.6   |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.8.54  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.8.54  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.7.40  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.7.40  |

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PCOM-404 -->

- The Palette AI [Artifact Studio](../downloads/artifact-studio.md) is now available at
  [https://artifact-studio.spectrocloud.com/palette-ai-studio](https://artifact-studio.spectrocloud.com/palette-ai-studio).

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2228 -->

- Fixed an issue that caused the Terraform plan operation of the
  [`spectrocloud_cluster_eks` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_eks)
  to fail when the `eks_launch_template` block is added inside `machine_pool`.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-413 -->

- Fixed an issue that caused
  [Palette VerteX installations in an airgap VMware vSphere environment](../vertex/install-palette-vertex/install-on-vmware/airgap-install/airgap-install.md)
  to fail due to OVA download timeout errors.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-418 -->

- Fixed an issue that caused
  [Palette VerteX installations in an airgap VMware vSphere environment](../vertex/install-palette-vertex/install-on-vmware/airgap-install/airgap-install.md)
  to fail due to incorrect CoreDNS configuration.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-3972 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3977 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3973 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4019 -->

| Pack Name                    | Layer      | Non-FIPS           | FIPS               | New Version |
| ---------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Amazon EBS CSI               | CSI        | :white_check_mark: | :x:                | 1.59.0      |
| Amazon EBS CSI               | CSI        | :x:                | :white_check_mark: | 1.58.0      |
| Amazon EFS                   | CSI        | :white_check_mark: | :x:                | 3.0.1       |
| AWS Application Loadbalancer | Add-on     | :white_check_mark: | :x:                | 3.22.2      |
| Azure Disk                   | CSI        | :white_check_mark: | :x:                | 1.34.3      |
| K3s                          | Kubernetes | :white_check_mark: | :x:                | 1.35.3      |
| K3s                          | Kubernetes | :white_check_mark: | :x:                | 1.34.6      |
| K3s                          | Kubernetes | :white_check_mark: | :x:                | 1.33.10     |
| Palette Optimized RKE2       | Kubernetes | :white_check_mark: | :white_check_mark: | 1.35.3      |
| Palette Optimized RKE2       | Kubernetes | :white_check_mark: | :white_check_mark: | 1.34.6      |
| Palette Optimized RKE2       | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.10     |
| Traefik                      | Add-on     | :white_check_mark: | :x:                | 39.0.8      |

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-3705 -->
<!-- prettier-ignore-start -->

- The debug logs for the <VersionedLink text="Local Path Provisioner" url="/integrations/packs/?pack=csi-local-path-provisioner" /> pack version 0.32 were disabled.

- The following community packs have been released:

  - <VersionedLink text="Crossplane" url="/integrations/packs/?pack=crossplane" /> version 2.2.1
  - <VersionedLink text="Fluentbit" url="/integrations/packs/?pack=fluentbit" /> version 5.0.3
  - <VersionedLink text="ECK Operator" url="/integrations/packs/?pack=elastic-operator" /> version 3.3.2
  - <VersionedLink text="ECK Stack" url="/integrations/packs/?pack=elastic-stack" /> version 0.18.2

<!-- prettier-ignore-end -->

## May 3, 2026 - Release 4.9.5 {#release-notes-4-9-0}

The following component updates are applicable to this release:

- [May 9, 2026 - Component Updates](#component-updates-2026-19) <!-- omit in toc -->
- [May 15, 2026 - Component Updates](#component-updates-2026-20) <!-- omit in toc -->
- [May 22, 2026 - Component Updates](#component-updates-2026-21) <!-- omit in toc -->

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-0}

#### Breaking Changes {#breaking-changes-4-9-0}

<!-- https://spectrocloud.atlassian.net/browse/PEM-10236 -->

- [AWS GovCloud](../clusters/public-cloud/aws/add-aws-accounts.md#aws-govcloud) and
  [Azure Government cloud](../clusters/public-cloud/azure/azure-cloud.md#azure-government-cloud) are now disabled in the
  Palette UI. To use AWS GovCloud or Azure Government cloud in Palette, you must do so via the
  [Palette API](/api/category/palette-api-v1/),
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs), or
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette);
  however, these methods will be removed in an [upcoming release](./announcements.md#upcoming-breaking-changes). To
  continue deploying and managing clusters using AWS GovCloud or Azure Government cloud, we recommend using
  [Palette VerteX](../vertex/vertex.md) instead.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-4778 -->

- <TpBadge /> Deployment of OpenShift clusters on MAAS using HyperShift host clusters is now supported. Refer to the
  [Create and Manage MAAS OpenShift
  Clusters](../clusters/data-center/maas/create-manage-maas-openshift-clusters-hypershift/create-manage-maas-openshift-clusters-hypershift.md)
  guide for more information.

<!-- https://spectrocloud.atlassian.net//browse/PCP-5570 -->
<!-- https://spectrocloud.atlassian.net/browse/DOC-2726 -->

- The `iam:ListRoleTags` permission has been added to the
  [Core IAM Policies](../clusters/public-cloud/aws/required-iam-policies/core-iam-policies.md) as part of the
  **PaletteDeploymentPolicy**. This permission allows Palette to propagate tags to IAM Roles for Service Accounts (IRSA)
  roles it creates.

<!-- https://spectrocloud.atlassian.net/browse/PEM-7485 -->

- Kubeconfig file contents for workload clusters can now be copied to the clipboard by selecting the **Copy** icon
  beside the **Kubeconfig File** or **Admin Kubeconfig File** download link. Refer to our
  [Kubeconfig](../clusters/cluster-management/kubeconfig.md) and
  [Kubectl](../clusters/cluster-management/palette-webctl.md) guides for more information.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9357 -->

- GitHub Container Registry (GHCR) is now a supported Open Container Initiative (OCI) Helm registry in Palette. Refer to
  [Add OCI Helm Registry](../registries-and-packs/registries/oci-registry/add-oci-helm.md) for details on how to add
  GHCRs to Palette and
  [Add a Helm Chart](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md) for
  how to use GHCR-sourced Helm charts in your clusters.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2774 -->

- The `compute.zoneOperations.get` and `compute.zoneOperations.list` permissions have been added to GCP
  [Required IAM Permissions](../clusters/public-cloud/gcp/required-permissions.md). These permissions allow Palette to
  optimize the cluster creation process.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10389 -->

- Palette now supports
  [EKS Pod Identity](https://aws.amazon.com/blogs/containers/amazon-eks-pod-identity-a-new-way-for-applications-on-eks-to-obtain-iam-credentials/)
  for [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) authentication. Refer to the
  [Configure EKS Pod Identity for ECR Registries](../clusters/public-cloud/aws/enable-pod-identity-ecr.md) guide for
  more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5801 -->

- Palette now supports the option to skip worker node upgrades on
  [MAAS](../clusters/data-center/maas/create-manage-maas-clusters.md) and
  [VMware vSphere](../clusters/data-center/vmware/create-manage-vmware-clusters.md) clusters. For example, if you have
  worker pools running critical databases or real-time processing services, you can enable this option to maintain
  service continuity during control plane upgrades, then schedule
  [worker node updates](../clusters/cluster-management/cluster-updates.md#trigger-worker-node-upgrade) during planned
  maintenance windows.

  The version difference between the control plane and worker nodes must not exceed the
  [N-3 minor version skew supported by Kubernetes](https://kubernetes.io/releases/version-skew-policy/). Palette
  enforces this during cluster profile updates and blocks you from updating if you attempt to exceed the N-3 threshold.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-10373 -->

- The **Cloud Type** options for [imported clusters](../clusters/imported-clusters/imported-clusters.md) have been
  updated for clarity (**AWS IaaS**, **Azure IaaS**, **GCP IaaS**, and **Generic**). Users should now select **Generic**
  when importing AWS EKS-Anywhere, OpenShift, and VMware vSphere clusters.

<!-- https://spectrocloud.atlassian.net/browse/PEM-7095 -->

- The **Context** field on the cluster **Overview** tab now contains a hyperlink to the cluster's parent project. This
  link is available from the Tenant Admin scope only.

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net//browse/PCP-5494 -->

- Amazon Linux 2 (AL2) AMIs have been disabled in Palette. You will not be able to create new EKS clusters with AL2
  worker nodes. For existing EKS clusters, you must create new worker nodes using AL2023 AMIs. Existing AL2 AMI worker
  nodes will no longer receive bug fixes or security patches. Refer to our
  [Scenario - Unable to Upgrade EKS Worker Nodes from AL2 to AL2023](../troubleshooting/cluster-deployment.md#scenario---unable-to-upgrade-eks-worker-nodes-from-al2-to-al2023)
  guide for help with migrating workloads.

  - In addition, Kubernetes upgrades to v1.33 and later are not supported on EKS clusters with AL2 worker nodes. If you
    want to upgrade your cluster to v1.33 or later, you must first migrate your workloads to AL2023 worker nodes.

<!-- https://spectrocloud.atlassian.net//browse/PE-8280 -->

- Support for Red Hat Enterprise Linux (RHEL) 8.x in Edge workflows has been deprecated, including FIPS-enabled
  configurations. Use RHEL 9.x or RHEL 10.x instead.

- Support for Ubuntu 20.04 in Edge workflows has been deprecated, including FIPS-enabled configurations. Use Ubuntu
- Support for Ubuntu 20.04 in Edge workflows has been deprecated. We recommend using either Ubuntu 22.04 (when requiring
  FIPS 140-3 certification) or Ubuntu 24.04 (when FIPS 140-3 compliance is sufficient). Ubuntu 24.04 FIPS certification
  is still in progress at the vendor-level and cannot be relied upon to meet auditory compliance until certification is
  reached.”

<!-- https://spectrocloud.atlassian.net/browse/PEM-10602 -->

- The internal [Ingress Nginx](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) controller used by
  Palette management plane services is now [deprecated](./announcements.md#deprecations). Traefik replaced Nginx as the
  default management cluster ingress controller starting with Palette 4.8.47. For self-hosted Palette environments
  [installed using Helm charts](../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md),
  set `ingress.type` to `traefik` to avoid service disruptions. Refer to
  [Helm Configuration Reference](../enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref.md) for
  more information.

  If you have made custom modifications to the Ingress Nginx configuration in your self-hosted environment, such as
  custom annotations, load balancer settings, or Transport Layer Security (TLS) configurations, these customizations may
  not carry over automatically and could affect your deployment. Review your ingress configuration before upgrading and
  [contact our Support team](https://support.spectrocloud.io/) if you need assistance migrating custom ingress settings
  to Traefik. For installations configured to use DNS, you must also update your records to point to the new Traefik
  `LoadBalancer` service after upgrading. Refer to the
  [Upgrade Palette on Kubernetes](../enterprise-version/upgrade/upgrade-k8s/non-airgap.md) guide for details.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10575 -->

- The `/clusterprofiles`[API endpoint](/api/introduction) is now deprecated. Use the `/dashboard/clusterprofiles`
  endpoint instead, which includes improved data retrieval capabilities.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10647 -->

- Fixed an issue that prevented clusters from being deployed when gRPC ports are blocked and WebSocket is used as a
  fallback.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10634 -->

- Fixed an issue that prevented clusters from being deployed or managed using
  [cluster templates](../cluster-templates/cluster-templates.md) if the cluster was scoped to a project different from
  the one the template was created in.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6470 -->

<!-- prettier-ignore-start -->

- Fixed an issue in [self-hosted Palette](../enterprise-version/enterprise-version.md) and [Palette VerteX](../vertex/vertex.md)
  that caused workload clusters deployed with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> version 1.34.3 or later to fail
  to pull images through configured [registry mirrors](../enterprise-version/system-management/registry-override.md). 

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PEM-10556 -->

- Fixed an issue that caused [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) updates to fail with
  `Manifest <UID> is not found in the project` errors.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10448 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-10431 -->

- Fixed an issue that caused the Palette UI to crash when creating or editing
  [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) with empty or missing version fields.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10381 -->

- Fixed an issue that caused the **Save Changes** button to remain disabled when editing an imported
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) containing an empty manifest.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6311 -->

- Fixed an issue that caused the Velero Helm release to fail when enabling
  [cluster backups](../clusters/cluster-management/backup-restore/backup-restore.md) using Azure as the backup storage
  location.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6310 -->

- Fixed an issue that prevented
  [backup storage location](../clusters/cluster-management/backup-restore/backup-restore.md) credential and
  configuration updates from being propagated to workload clusters, causing backups to fail.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10285 -->

- Fixed an issue that caused creating or updating [VMware vSphere](../clusters/data-center/vmware/vmware.md) node pools
  after initial cluster deployment to lose cluster-level datacenter, folder, and image template folder settings.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6217 -->

- Fixed an issue that caused EKS Pod Identity job failures in clusters using
  [image swap](../clusters/cluster-management/image-swap.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-9996 -->

- Fixed an issue that caused repeated false pack update notifications on
  [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) when no changes were made to the pack or profile.

<!-- https://spectrocloud.atlassian.net/browse/PCP-4372 -->

- Fixed an issue that caused cluster status fields to display Go pointer values instead of actual values.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.5 Palette release is 4.9.4.

:::

#### Improvements

<!-- https://spectrocloud.atlassian.net//browse/PE-7582 -->
<!-- https://spectrocloud.atlassian.net//browse/PE-7583 -->

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports multiline and dropdown
  [cluster profile variable](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  types. Dropdown profile variables are not supported for airgapped Local UI clusters.

<!-- https://spectrocloud.atlassian.net//browse/PE-8122 -->
<!-- https://spectrocloud.atlassian.net//browse/PE-7779 -->

- Pluggable Authentication Modules (PAM) policy enforcement is now enabled, including password expiry checks, which can
  be set using the `stylus.site.users[*].passwordExpiry`
  [user data](../clusters/edge/edge-configuration/installer-reference.md) field. For examples of configuring PAM via the
  Dockerfile, refer to
  [Build Edge Artifacts - Advanced workflow](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md?difficulty=advanced_create_artifacts).

<!-- https://spectrocloud.atlassian.net//browse/PE-8215 -->
<!-- https://spectrocloud.atlassian.net//browse/PE-8512 -->

- Edge workflows have been updated to Kairos v4.0.3. Due to upstream changes, this update does not apply to
  [Unified Kernel Image (UKI)-based Trusted Boot images](../clusters/edge/trusted-boot/trusted-boot.md), which remain on
  Kairos v3.5.9. This does not impact functionality.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-373 -->

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) ISOs now include
  `/opt/spectrocloud/bin` in the default `PATH`, making kubectl and Helm immediately available for debugging and
  operations.

<!-- https://spectrocloud.atlassian.net/browse/PE-8375 -->

- kube-vip is now automatically disabled if the virtual IP (VIP) address assigned to the cluster during cluster creation
  is the same as the Edge host's IP address (for example, in the case of single-node clusters).

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8328 -->

- Fixed an issue that caused nodes deleted via `kubectl` to remain visible in the Palette UI, resulting in duplicate
  entries when the node rejoined the cluster.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-0) for more details.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10334 -->

- Fixed an issue that caused upgrading [self-hosted Palette VerteX](../vertex/vertex.md) installations earlier than
  4.6.12 to fail due to legacy MongoDB values.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.29.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.29.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

- The Palette CLI [`content build`](../automation/palette-cli/commands/content.md#build) command now supports the
  environment variable `INCLUDE_COMPLIANCE_IMAGES`. When the variable is set to `true`, the resulting content bundle
  includes additional container images required for compliance scanning.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-255 -->

- The [Artifact Studio](../downloads/artifact-studio.md) UI has been refactored to refer to VerteX as
  [Palette VerteX](../vertex/vertex.md).

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2207 -->

- Fixed an issue that caused unnecessary in place updates on the
  [`spectrocloud_sso` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/sso)
  when configuration had not changed.

### Docs and Education

- A new [Enable AI Workloads with the NVIDIA GPU Operator Pack](../ai-workloads/nvidia-gpu-operator.md) guide is now
  available. Follow it to verify that GPU workloads can run in your clusters.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2598 -->

- <TpBadge /> The [Palette MCP Server](../automation/palette-mcp/palette-mcp.md) allows you to use Large Language Models
  (LLMs) to interact with the Palette API. Refer to the [Get Started with the Palette MCP
  Server](../tutorials/ai/palette-mcp/get-started-palette-mcp.md) and [Integrate Palette MCP in an Agentic
  Workflow](../tutorials/ai/palette-mcp/integrate-palette-mcp-agentic.md) tutorials to learn how to incorporate the
  Palette MCP server into your workflows.

<!-- https://spectrocloud.atlassian.net/browse/DOC-765 -->

- The [Security Advisories](../security-bulletins/security-advisories/security-advisories.md) page can now be followed
  using our [Security Advisories RSS feed](https://docs.spectrocloud.com/security-advisories.xml). Subscribe to it using
  your favorite application.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-3974 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3980 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4002 -->

| Pack Name                   | Layer      | Non-FIPS           | FIPS               | New Version |
| --------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Calico                      | CNI        | :x:                | :white_check_mark: | 3.31.5      |
| Calico Network Policy       | Add-on     | :white_check_mark: | :x:                | 3.31.5      |
| Cilium                      | CNI        | :white_check_mark: | :x:                | 1.19.3      |
| External Secrets            | Add-on     | :white_check_mark: | :x:                | 2.3.0       |
| Flannel                     | CNI        | :white_check_mark: | :x:                | 0.28.4      |
| Flux2                       | Add-on     | :white_check_mark: | :x:                | 2.18.3      |
| Istio                       | Add-on     | :white_check_mark: | :x:                | 1.29.2      |
| Open Observe                | Add-on     | :white_check_mark: | :x:                | 0.70.3      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.35.3      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.34.6      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.10     |
| Prometheus Agent            | Add-on     | :white_check_mark: | :x:                | 29.2.1      |
| Prometheus Operator         | Add-on     | :white_check_mark: | :x:                | 83.5.0      |
| vSphere CSI                 | CSI        | :x:                | :white_check_mark: | 3.7.0       |

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10660 -->
<!-- https://spectrocloud.atlassian.net/browse/DOC-2729 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4022 -->

- <TpBadge /> Headlamp is now available. It provides a web-based Kubernetes UI for cluster management and monitoring.
  Refer to the [Headlamp](../clusters/cluster-management/headlamp.md) guide for more information.

- The <VersionedLink text="KubeVirt" url="/integrations/packs/?pack=kubevirt" /> and
  <VersionedLink text="KubeVirt-CDI" url="/integrations/packs/?pack=kubevirt-cdi" /> packs are now deprecated.
