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

## May 26, 2025 - Release 4.6.28

### Bug Fixes

- Fixed an issue where add-on packs and Helm chart artifacts were not found while synchronizing registries for
  [Edge](../clusters/edge/edge.md) clusters.
- Fixed an issue that prevented add-on profiles from being deployed on [Edge](../clusters/edge/edge.md) clusters
  containing the `harbor-edge-native-config` pack.

## May 20, 2025 - Release 4.6.26

### Bug Fixes

- Fixed an issue that occasionally caused `stylus-agent` restarts and a `stylus-operator` failure loop when deploying
  clusters due to unsafe concurrent data access.

## May 7, 2025 - Release 4.6.25

### Bug Fixes

- Fixed an issue that caused the deletion of [GCP clusters](../clusters/public-cloud/gcp/gcp.md) to fail for clusters
  associated with cloud accounts that have been created on older Palette versions.

## May 5, 2025 - Release 4.6.24

### Bug Fixes

- Fixed an issue that caused [Edge hosts](../clusters/edge/edge.md) to reboot continuously after a cluster deletion and
  completed [reset](../clusters/edge/local-ui/host-management/reset-reboot.md#reset-edge-host).
- Fixed an issue where Kubernetes version upgrades initiated through [Local UI](../clusters/edge/local-ui/local-ui.md)
  failed for [Edge](../clusters/edge/edge.md) clusters containing the `harbor-edge-native-config` pack.
- Fixed an issue where
  [Software Bill of Materials (SBOM)](../clusters/cluster-management/compliance-scan.md#sbom-dependencies--vulnerabilities)
  scans failed to execute successfully for all clusters.
- Fixed an issue where POST API calls to `/v1/spectroclusters/edge-native` failed for U.S. multi-tenant SaaS
  environments.
- Fixed an issue that caused pack downloads with a double hyphen (`--`) in the label prefix to fail.
- Fixed an issue that caused pack downloads to fail if the pack registry endpoint contained a port.
- Fixed a UI discrepancy between the **Last Modified** timestamp on the cluster list and the cluster **Overview** tab.
- Fixed an issue where [Edge cluster](../clusters/edge/edge.md) deployment failed when a certificate for a
  [private provider registry](../clusters/edge/site-deployment/deploy-custom-registries/deploy-private-registry.md) was
  included in the cluster profile.

### Improvements

- The default timeout for [remote shell](../clusters/edge/cluster-management/remote-shell.md) has been increased to 12
  hours of inactivity.

## April 19, 2025 - Release 4.6.23 {#release-notes-4.6.b}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.6.b}

#### Breaking Changes {#breaking-changes-4.6.b}

- New Cluster Groups will now default to a newer version of vCluster,
  [version 0.22.x](https://github.com/loft-sh/vcluster/releases), which includes new features and improvements. Existing
  Cluster Groups will continue to use older versions. If you want to use a later version of vCluster, refer to the
  [Palette Virtual Clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md#upgrade-virtual-clusters)
  page to learn how to migrate your virtual cluster workloads.

#### Bug Fixes

- Fixed an issue where tags that contained spaces prevented [AWS](../clusters/public-cloud/aws/aws.md) clusters from
  being deployed via API.
- Fixed an issue where simultaneous updates to [EKS](../clusters/public-cloud/aws/eks.md) logging and VPC configuration
  caused reconciliation failures due to API limitations.
- Fixed an issue in [MAAS](../clusters/data-center/maas/maas.md) clusters where only the first node pool got repaved
  when a full cluster repave was expected.
- Fixed a UI discrepancy where the worker node count on the cluster **Review** page displayed the **Number of nodes in
  pool** instead of the **Minimum size** and **Maximum size** for clusters with autoscaler enabled. This did not affect
  cluster functionality.
- Fixed an issue that caused repeated reconciliation errors when deploying an [EKS](../clusters/public-cloud/aws/eks.md)
  cluster with private cluster endpoint access. This did not affect cluster functionality.
- Fixed an issue during cluster setup where selecting **Copy from Control Plane Pool** would reset certain worker pool
  configurations, such as autoscaler. Copied changes are now restricted to cloud configurations.

#### Improvements

- Palette and VerteX emails have been redesigned to ensure consistency and improve accessibility. The updates have been
  applied to sign-up, login, password reset, and billing update emails.
- ResourceQuota and LimitRange resources are now set in the `system-upgrade` namespace.

#### Deprecations and Removals

- Palette no longer integrates with the [libvirt](https://libvirt.org/) virtualization API. Support has been removed
  across various components including the Palette UI, Terraform providers, the user interface, and packs.

### Edge

#### Features

<!-- prettier-ignore -->
- <TpBadge /> Palette now allows the configuration of an in-cluster primary registry that stores the images required for
  cluster deployment. Any OCI-compliant registry can be configured as the primary registry. Palette offers
  out-of-the-box support for Zot and Harbor registries with minimum configuration required. 
  Refer to [Deploy Cluster with Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/deploy-primary-registry.md) for
  further information.
- The [Palette CLI](../automation/palette-cli/palette-cli.md) has a new `content` command that supports the creation of
  [content bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md). This command provides
  the ability to create bundles directly from the command-line. Refer to the
  [Content](../automation/palette-cli/commands/content.md) command reference page for further information.

#### Improvements

- [Local UI](../clusters/edge/local-ui/local-ui.md) has been updated with a new color scheme and logo. These new
  elements are displayed across the entire product interface. Check out the
  [Welcome to the fold: meet the new Spectro Cloud brand](https://www.spectrocloud.com/blog/meet-the-new-spectro-cloud-brand)
  blog post to learn more.

#### Bug Fixes

- Fixed an issue that prevented DNS configuration changes made using the Terminal User Interface (TUI) from being
  applied without restarting the `CoreDNS` deployment.
- Fixed an issue where password updates were delayed on appliance mode [Edge](../clusters/edge/edge.md) hosts.

#### Deprecations and Removals

- The `harbor-edge-native-config` pack has been deprecated. You need to use the new `registry-connect` and `harbor`
  packs to implement the Harbor registry. This allows you to keep your system up to date with the latest upstream
  updates. Refer to
  [Migrate from Harbor Edge-Native Config Pack](../clusters/edge/site-deployment/deploy-custom-registries/migrate-edge-native-config.md)
  for further details.

### Palette Dev Engine (PDE)

#### Features

- New Cluster Groups will now default to a newer version of vCluster,
  [version 0.22.x](https://github.com/loft-sh/vcluster/releases), which includes new features and improvements. Existing
  Cluster Groups will continue to use older versions. If you want to use a later version of vCluster, refer to the
  [Palette Virtual Clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md#upgrade-virtual-clusters)
  page to learn how to migrate your virtual cluster workloads.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.6.b) for more details.

### Automation

:::info

Check out the [Palette CLI Downloads](../downloads/cli-tools.md) page to find the compatible version of the Palette CLI.

:::

#### Breaking Changes {#breaking-changes-automation-4.6.b}

- The `spec.jsonCredentialsFileUid` field in API requests is deprecated and will be removed in an upcoming release.
  Users who create GCP cloud accounts using the API should now use the `spec.jsonCredentials` field to supply their
  credentials in JSON format. Any API `GET` operations on GCP cloud accounts will continue to be available until the
  `spec.jsonCredentialsFileUid` is removed. Refer to the [API documentation](/api/introduction) for further details.

#### Features

- The [Palette CLI](../automation/palette-cli/palette-cli.md) has a new `content` command that supports the creation of
  [content bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md). This command provides
  the ability to create bundles directly from the command-line. Refer to the
  [Content](../automation/palette-cli/commands/content.md) command reference page for further information.
- Terraform version 0.23.5 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- A new Terraform resource, `spectrocloud_sso resource`, is now available for enforcing
  [Single Sign-On (SSO)](../user-management/saml-sso/saml-sso.md) in Palette. For more information, refer to the Spectro
  Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

#### Improvements

- The performance of Palette APIs has been improved, resulting in increased
  [API rate limits](/api/introduction/#rate-limits) for component events and optimized platform updates.
- The `spectrocloud_pack` Terraform data source now supports filtering based on pack type, add-on type, pack layer, and
  environment. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- The `spectrocloud_cluster_eks` Terraform resource now supports the specification of availability zones and subnets.
  For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- The `spectrocloud_cluster_profile` Terraform resource now supports defining cluster profile variables and referencing
  them in the applicable `spectrocloud_cluster_<type>` resource during the same `terraform apply`. For more information,
  refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- The `spectrocloud_cluster_aws` and `spectrocloud_cluster_eks` Terraform resources now support `tag_maps`. For more
  information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Virtual Machine Orchestrator (VMO)

#### Improvements

- The user interface and messaging for virtual machine topology has been improved to indicate the sockets, cores, and
  threads of the machine vCPU. Refer to the
  [Manage CPU and Memory](../vm-management/create-manage-vm/enable-cpu-hotplug.md) guide for further details.

### Docs and Education

#### Bug Fixes

- Fixed a bug that resulted in some dependencies to have the incorrect
  [open-source license](../legal-licenses/oss-licenses-index/oss-licenses-index.md) listed.

### Packs

#### Kubernetes

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| Palette Optimized K3s                      | 1.32.2      |
| Palette Optimized K3s                      | 1.31.6      |
| Palette Optimized K3s                      | 1.30.10     |
| Palette Optimized K3s                      | 1.29.14     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.32.2      |
| Palette Optimized RKE2                     | 1.32.2      |
| Palette Optimized RKE2                     | 1.31.6      |
| Palette Optimized RKE2                     | 1.30.10     |
| Palette Optimized RKE2                     | 1.29.14     |
| RKE2                                       | 1.32.2      |
| RKE2                                       | 1.31.6      |
| RKE2                                       | 1.30.10     |
| RKE2                                       | 1.29.14     |

#### CNI

| Pack Name | New Version |
| --------- | ----------- |
| Cilium    | 1.17.1      |

#### CSI

| Pack Name               | New Version |
| ----------------------- | ----------- |
| Amazon EBS CSI          | 1.41.0      |
| Amazon EFS              | 2.1.6       |
| Azure Disk CSI          | 1.32.0      |
| GCE Persistent Disk CSI | 1.15.4      |
| Portworx /w Operator    | 3.2.2       |

#### Add-on Packs

| Pack Name              | New Version |
| ---------------------- | ----------- |
| Argo CD                | 7.8.8       |
| AWS Cluster Autoscaler | 1.32.0      |
| Amazon EFS             | 2.1.6       |
| Calico Network Policy  | 1.15.3      |
| Istio                  | 1.24.3      |
| Nginx                  | 1.15.3      |
| Nginx                  | 1.12.1      |
| Open Policy Agent      | 3.18.2      |
| Portworx /w Operator   | 3.2.2       |
| Spectro Proxy          | 1.5.6       |
| Registry Connect       | 0.1.0       |

#### FIPS Packs

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| Amazon EBS CSI                             | 1.41.0      |
| Azure Disk CSI                             | 1.32.0      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.32.2      |
| Palette Optimized RKE2                     | 1.32.2      |
| Palette Optimized RKE2                     | 1.31.6      |
| Palette Optimized RKE2                     | 1.30.10     |
| Palette Optimized RKE2                     | 1.29.14     |
| RKE2                                       | 1.32.2      |
| RKE2                                       | 1.31.6      |
| RKE2                                       | 1.30.10     |
| RKE2                                       | 1.29.14     |

#### Deprecations and Removals

- The packs `ubuntu-libvirt`, `generic-vm-libvirt`, `centos-libvirt`, and `pfsense-vm-libvirt` have been removed.
- The `harbor-edge-native-config` pack has been deprecated. You need to use the `registry-connect` and `harbor` packs to
  implement the Harbor registry. This allows you to keep your system up to date with the latest upstream updates. Refer
  to
  [Migrate from Harbor Edge-Native Config Pack](../clusters/edge/site-deployment/deploy-custom-registries/migrate-edge-native-config.md)
  for further details.

## April 3, 2025 - Automation Updates

Terraform version 0.23.4 of the
[Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
available. For more details, refer to the Terraform provider
[release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Bug Fixes

- Fixed an issue that resulted in Admin Kubeconfig files to be fetched instead of the Kubeconfig file when using the
  `kubeconfig` field on cluster resources. Refer to the
  [Kubeconfig Files](../clusters/cluster-management/kubeconfig.md#kubeconfig-files) for more details.

## March 28, 2025 - Release 4.6.18

### Bug Fixes

- Fixed an issue where users could not connect to Edge hosts using
  [remote shell](../clusters/edge/cluster-management/remote-shell.md) in VerteX SaaS environments.
- Fixed an issue that prevented host machines from automatically rebooting after installing the
  [Palette agent](../deployment-modes/agent-mode/install-agent-host.md).
- Fixed an issue that prevented [AWS](../clusters/public-cloud/aws/aws.md) clusters with tags containing certain special
  characters from being provisioned or deleted.
- Fixed an issue where [Edge](../clusters/edge/edge.md) native clusters remained stuck in the bootstrapping phase during
  deployment.

### Security Notices

- On March 24, 2025, a security vulnerability regarding certain versions of
  [ingress-nginx](https://github.com/kubernetes/ingress-nginx) was reported. The vulnerable versions were used in
  Palette's and VerteX's management planes and were also available as packs for workload clusters. As of April 4, 2025,
  all vulnerable Nginx packs have been deprecated, all managed Palette instances have been patched, and patches are
  available for connected and airgapped Palette Enterprise and VerteX versions 4.4 - 4.6.

  All workload clusters across all Palette and VerteX installations must be updated manually. All users should review
  their [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) and workload clusters and upgrade the Nginx
  pack to version `1.11.5`. For more information, refer to our
  [Security Advisory](../security-bulletins/security-advisories/security-advisories.md).

## March 20, 2025 - Release 4.6.13

### Bug Fixes

- Fixed an issue where [AWS EKS](../clusters/public-cloud/aws/eks.md) clusters using the AWS VPC CNI (Helm)
  [pack](../integrations/integrations.mdx) assigned incorrect IP addresses to pods.
- Fixed an issue where OIDC configuration failed when using
  [Microsoft Entra ID](../user-management/saml-sso/palette-sso-with-entra-id.md).

### Automation

#### Features

- Terraform version 0.23.2 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.23.2 of the
  [Palette Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/) is
  available. For more details, refer to the Crossplane provider
  [release page](https://github.com/crossplane-contrib/provider-palette/releases).

## March 15, 2025 - Release 4.6.12

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-6-a}

#### Features

- The Palette UI has been updated with a new color scheme and logo. These new elements are displayed on the login page,
  left **Main Menu**, and product tour. Check out the
  [Welcome to the fold: meet the new Spectro Cloud brand](https://www.spectrocloud.com/blog/meet-the-new-spectro-cloud-brand)
  blog post to learn more.
- Palette and VerteX emails have been updated with a new color scheme and logo. The visual elements match the changes
  made to the Palette UI.
- [Azure IaaS clusters](../clusters/public-cloud/azure/azure.md) now support autoscaling functionality. This
  functionality allows Palette to scale the worker pool horizontally based on its per-node workload counts. Autoscaling
  can be enabled during cluster creation or by changing the
  [worker node pool configuration](../clusters/cluster-management/node-pool.md#worker-node-pool). Refer to the
  [Create and Manage Azure IaaS Cluster](../clusters/public-cloud/azure/create-azure-cluster.md) guide for further
  information.
- [Agent mode](../deployment-modes/agent-mode/agent-mode.md) feature has now exited Tech Preview and is ready to use for
  production workloads. Check out the [Install Palette Agent](../deployment-modes/agent-mode/install-agent-host.md)
  guide for further details.

#### Improvements

- The [cluster filtering](../clusters/cluster-management/cluster-map-filters.md) functionality of the Palette UI has
  been modified to add the **Deleted** option under the **Status** filter. This improvement provides a simplified
  process of managing and filtering cluster views.
- Palette's internal database, MongoDB, has been upgraded to version 7.0.

#### Deprecations and Removals

- The `PROXY_CERT_PATH` variable is no longer available in the CanvOS build process. Use the **certs** folder in the
  root of the project directory to store proxy certificates. The **certs** folder is automatically included in the
  CanvOS build process. Refer to the
  [Build Provider Images](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md) for guidance on
  using the **certs** folder to pass proxy certificates to the CanvOS build process.
- Palette's internal message communication between components transitioned from NATS to gRPC. The previous usage of NATS
  has been removed. This change primarily affects customers using Palette agents on versions older than 4.0, and the
  NATS namespace must be [manually removed](../troubleshooting/nodes.md#scenario---remove-deprecated-nats-namespace)
  from affected clusters. To learn more about Palette's internal network architecture, refer to the
  [Network Ports](../architecture/networking-ports.md) page. If you are using network proxies, we recommend you review
  the [gRPC and Proxies](../architecture/grps-proxy.md) documentation for potential issues.

### Edge

#### Features

- <TpBadge /> Palette introduces a remote shell capability for troubleshooting remote edge hosts. This new feature
  allows direct shell access via Palette without depending on user credentials or an active Kubernetes cluster. Refer to
  the [Remote Shell](../clusters/edge/cluster-management/remote-shell.md) guide for further information.

#### Improvements

- Edge clusters now support
  [automatic certificate renewal](../clusters/cluster-management/certificate-management.md#automatic-certificate-renewal)
  for clusters that are not connected to Palette. Auto-renewal ensures that certificates are updated with minimal
  downtime.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette](#palette-enterprise-4-6-a) section for more details.

### Automation

:::info

Check out the [Palette CLI Downloads](../downloads/cli-tools.md) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.23.1 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- A new Terraform resource, `spectrocloud_platform_setting`, is now available for
  [platform settings](../clusters/cluster-management/platform-settings/platform-settings.md) such as session timeout,
  agent upgrade, and cluster remediation. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- A new Terraform resource, `spectrocloud_registration_token`, is now available for the creation of
  [registration tokens](../clusters/edge/site-deployment/site-installation/create-registration-token.md). For more
  information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).
- A new Terraform resource, `spectrocloud_developer_setting`, is now available for setting
  [tenant developer user quotas](../devx/manage-dev-engine/resource-quota.md#tenant-developer-user-quotas). For more
  information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Docs and Education

- The Spectro Cloud Documentation site UI has been updated with a new color scheme and logo. The visual elements match
  the changes made to the [Palette](https://console.spectrocloud.com) UI.

### Packs

#### Kubernetes

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| Palette eXtended Kubernetes (PXK)          | 1.32.2      |
| Palette eXtended Kubernetes (PXK)          | 1.31.6      |
| Palette eXtended Kubernetes (PXK)          | 1.30.10     |
| Palette eXtended Kubernetes (PXK)          | 1.29.14     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.6      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.30.10     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.14     |

#### CNI

| Pack Name      | New Version |
| -------------- | ----------- |
| Calico         | 3.29.2      |
| Calico (Azure) | 3.29.2      |
| Cilium         | 1.16.6      |

#### CSI

| Pack Name        | New Version |
| ---------------- | ----------- |
| Longhorn         | 1.8.0       |
| Rook-Ceph (Helm) | 1.16.3      |

#### Add-on Packs

| Pack Name                 | New Version |
| ------------------------- | ----------- |
| External Secrets Operator | 0.13.0      |
| Harbor                    | 1.16.2      |
| KubeArmor                 | 1.4.6       |
| Longhorn                  | 1.8.0       |
| Prometheus - Grafana      | 68.4.4      |
| Registry Connect          | 0.1.0       |
| Rook-Ceph (Helm)          | 1.16.3      |
| Zot                       | 0.1.66      |

#### FIPS Packs

| Pack Name                                  | New Version |
| ------------------------------------------ | ----------- |
| Calico                                     | 3.29.2      |
| Calico (Azure)                             | 3.29.2      |
| Cilium                                     | 1.16.6      |
| Palette eXtended Kubernetes (PXK)          | 1.32.2      |
| Palette eXtended Kubernetes (PXK)          | 1.31.6      |
| Palette eXtended Kubernetes (PXK)          | 1.30.10     |
| Palette eXtended Kubernetes (PXK)          | 1.29.14     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.31.6      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.30.10     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.14     |

## March 3, 2025 - Release 4.6.9

### Bug Fixes

- Fixed an issue that caused [Local UI](../clusters/edge/local-ui/local-ui.md) to incorrectly show the configuration
  status of healthy edge hosts as "Not Configured." This issue did not affect any other edge cluster operations.

## February 28, 2025 - Release 4.6.8

### Bug Fixes

- Fixed an issue that caused TLS 1.0 and 1.1 to be incorrectly enabled by internal
  [Local UI](../clusters/edge/local-ui/local-ui.md) services. All services are now using TLS 1.2.
- Fixed an issue that caused the [metrics server](https://github.com/kubernetes-sigs/metrics-server) deployment to be
  created without any resource limits. Resource quotas are now correctly applied, preventing the server from interfering
  with critical cluster functions.
- Fixed an issue that caused edge nodes to pull images from external registries instead of the local image cache.
  Cluster deployment now progresses with local images.
- Fixed an issue that K3s certificate renewals to be incorrectly applied to
  [Two-node Edge clusters](../clusters/edge/architecture/two-node.md).
- Fixed an issue that caused signed images to fail to be loaded by K3s [edge clusters](../clusters/edge/edge.md).
- Fixed an issue that allowed [Local UI](../clusters/edge/local-ui/local-ui.md) to start updates on inaccessible
  clusters, resulting in inconsistent configurations. Updates are now allowed only on accessible clusters.
- Fixed an issue that allowed concurrent NTP updates to be triggered from the
  [Local UI](../clusters/edge/local-ui/local-ui.md) and API. Only one update can be in progress now.
- Fixed an issue where installing a Palette [pack](../integrations/integrations.mdx) through a Helm chart incorrectly
  sets the Helm install version.
- Fixed an issue where NTP settings modified via [Local UI](../clusters/edge/local-ui/local-ui.md) did not persist.

### Features

#### Edge

- Certificate renewal periods can now be configured for [edge clusters](../clusters/edge/edge.md) using a ConfigMap. You
  can configure the renewal period using the `cert-renewal-day` field in the `palette-edge-config` ConfigMap.

### Documentation & Education Updates

- The Documentation & Education team is enabling a new Q&A bot functionality on the Spectro Cloud official documentation
  site. Click the **Ask AI** widget in the bottom right corner or use the **CTRL + I** (**CMD + I** on macOS) keyboard
  shortcut to bring up the chat interface.

  The Q&A bot is only trained on the latest version of the Spectro Cloud documentation. It is unable to answer
  version-specific questions. As with all generative AI-powered services, its responses may not be accurate. Always
  verify answers using the documentation for important updates.

### Packs

#### Kubernetes

| Pack Name | New Version |
| --------- | ----------- |
| RKE2      | 1.32.1      |
| RKE2      | 1.31.5      |
| RKE2      | 1.30.9      |
| RKE2      | 1.29.13     |

#### FIPS

| Pack Name | New Version |
| --------- | ----------- |
| RKE2      | 1.32.1      |
| RKE2      | 1.31.5      |
| RKE2      | 1.30.9      |
| RKE2      | 1.29.13     |

## February 19, 2025 - Release 4.6.7

### Bug Fixes

- Fixed an issue that caused incorrect validation errors when users select the **AWS US Gov** partition. Refer to the
  [AWS GovCloud Account (US)](../clusters/public-cloud/aws/add-aws-accounts.md#aws-govcloud-account-us) section for
  further details.

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

- The KubeVirt version in use is now v1.4.0. Other minor maintenance updates in support of KubeVirt 1.4.0 are also
  included.

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->

- Palette's support for <VersionedLink text="MicroK8s" url="/integrations/packs/?pack=kubernetes-microk8s" /> 1.29 and 1.30 has been enhanced to provide airgap support, as well as deployments on [MAAS](../clusters/data-center/maas/maas.md) and [AWS](../clusters/public-cloud/aws/aws.md). Additionally, this update validates multi-node control planes.

<!-- prettier-ignore-end -->

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we have added a new image registry that Palette agents will use to pull images. The new registry
  is `us-docker.pkg.dev`. This was [announced](./announcements.md#removals) as part of the Palette 4.5.3 release. If you
  have network restrictions in place, ensure that the new registry is allowed. The migration of images to this new
  registry is now complete. Redirects from the old registry to the new registry are in place, so no user actions are
  required at this time. Refer to the [Proxy Requirements](../enterprise-version/install-palette/#proxy-requirements)
  for a complete list of domains that must be allowed.

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
