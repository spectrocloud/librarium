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

## December 15, 2024 - Release 4.5.15

### Palette {#palette-enterprise-4-5-12}

#### Features

<!-- prettier-ignore -->
- Palette provides the ability to migrate VMs from VMware vSphere to Virtual Machine Orchestrator (VMO) using the
  Virtual Machine Migration Assistant (VM Migration Assistant). The <VersionedLink text="VM Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant-pack" /> add-on
  pack provides you with an UI to perform the VM migrations. Refer to the [VM Migration
  Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) section for further information.

- The Spectro Cloud Artifact Repository (SCAR) is now hosted inside an Open Container Initiative (OCI) repository.
  Previously, airgaped self-hosted Palette or VerteX installations required a file server to host the SCAR repository.
  With this release, the SCAR repository is now hosted inside the same OCI registry hosting packs and images. This
  removes the need for a file server to host the SCAR content. New installations of Palette Enterprise and VerteX will automatically use the new architecture. Existing self-hosted Palette Enteprise and VerteX installations are not affected by this change.

#### Improvements

- The "Export Profile" and "Delete" buttons were renamed to "Export profile version" and "Delete profile version" in the
  cluster profile editor. The revised text clarifies that the export and delete operations only apply to a single
  profile version.

- Palette's Virtual Machine (VM) cloning capabilities were improved to cover complete VM configurations, including data
  volumes and data volume templates. These improved capabilities ensure accurate VM duplication, allowing users to
  correctly replicate environments. Refer to the [Clone a VM](../vm-management/create-manage-vm/clone-vm.md) guide for
  further details.

- The reconciliation loop that Palette uses to check the status of Kubernetes resources was optimized. The improvements
  involve using a session cache, improved session management and enhanced session keep alives. These changes allow
  Palette to operate on environments experiencing heavy load.

- Palette's message brokers are now automatically scaled, ensuring that a quorum is available for each management plane
  cluster. By default, two replicas of the message broker are created in each management plane cluster. This improvement
  supports Palette's ability to manage large enterprise Kubernetes clusters, which are often distributed across numerous
  Kubernetes clusters. Refer to the [Message Brokers](../architecture/architecture-overview.md#message-brokers) for
  further details.

- Audit log entries now display the **Resource UID** in the Palette UI. This facilitates precise event and user action
  tracking for Palette users. Refer to the [Audit Logs](../audit-logs/audit-logs.md) section to learn more about how to
  use and enable audit logs.

- The cluster profile differential editor was improved with a change legend and informative tooltips. These changes
  provide an improved user experience for users who modify and update cluster profiles. Refer to the
  [Modify Cluster Profiles](../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md) to learn
  about all the ways cluster profiles can be modified.

- Cluster backups now provide three backup options of cluster resources. These options allow users to specify whether to
  include cluster-wide resources regardless of namespace in their backup configuration. By default, Palette now backs up
  only namespaced resources and their associated persistent volumes. Refer to the
  [Create Cluster Backup](../clusters/cluster-management/backup-restore/create-cluster-backup.md) guide to learn more
  about Palette's backup capabilities.

### Edge

#### Features

- <TpBadge /> Palette now supports the ability to link Edge hosts deployed in disconnected environments for the purpose
  of creating a multi-node cluster through Local UI. Previously, Local UI only supported single-node clusters. Host
  linking provides Edge hosts with the necessary network and security infrastructure to form a cluster. This feature
  allows you to create multi-node clusters using Local UI, providing you with more flexibility when deploying Edge
  clusters. Check out the [Link Hosts](../clusters/edge/local-ui/cluster-management/cluster-management.md) guide to
  learn more about this feature.

#### Improvements

- The EdgeForge build process utility, CanvOS, now supports adding multiple certificates that may be required for
  network proxy configurations. The certificates can be stored in the **certs** folder in the root of the project
  directory. The **certs** folder is automatically included in the CanvOS build process. Refer to the
  [Build Provider Images](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md) for guidance on
  using the **certs** folder to pass multiple proxy certificates to the CanvOS build process.

<!-- prettier-ignore-start -->

- The Edge <VersionedLink text="BYOOS" url="/integrations/packs/?pack=edge-native-byoi" /> pack has new parameters that
  allow you to configure node draining behavior during cluster upgrades or repaves. Previously, nodes were always
  drained during upgrades and repaves, even for single-node clusters. Refer to
  [Skip Node Draining](../clusters/edge/cluster-management/skip-draining.md) for guidance on configuring draining
  behavior.

  <!-- prettier-ignore-end -->

#### Bug Fixes

- Upgrading the Palette agent from 4.4.x to 4.5.11 and later will now automatically renew the Certificate Authority (CA)
  certificate for `stylus-webhook` Mutating Webhook Configuration. The corresponding Palette version for Palette agent
  4.5.11 is 4.5.15.

  This was an issue that affected 4.4.x and prior versions and was partially addressed in 4.5.0. The new version fully
  addresses the issue by automatically renewing the CA certificate for 10 years during an upgrade. In previous 4.5.x
  versions, while you would not encounter the certificate expiry issue if your cluster was created using a 4.5.x version
  of the Palette agent, upgrading from 4.4.x would not have renewed the certificate automatically.

#### Deprecations and Removals

- The EdgeForge build process utility, CanvOS has an argument variable named `PROXY_CERT_PATH`. This variable is
  deprecated and no longer the recommended way to pass proxy certificates to the CanvOS build process. Use the **certs**
  folder in the root of the project directory to store proxy certificates. The **certs** folder is automatically
  included in the CanvOS build process. Refer to the
  [Build Provider Images](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md) for guidance on
  using the **certs** folder to pass proxy certificates to the CanvOS build process.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-5-12) for more details.

### Automation

- Terraform version 0.23.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

#### Deprecations and Removals

- The Terraform resource, `spectrocloud_cluster_import` is deprecated. To import a cluster deployed outside of the
  context of Palette, refer to the [Import a Cluster](../clusters/imported-clusters/cluster-import.md) guide.

### Docs and Education

- The Security Bulletins page has been updated with a new and improved table design to help you find information. You
  can now sort columns, change page size, enjoy a fixed column header, and link directly to different vulnerability
  reports for a specific product edition. Check out the [Security Bulletins](../security-bulletins/reports/reports.mdx)
  page for the latest security advisories.

- The User & Role Management section of the documentation has been updated to provide a more comprehensive information
  about user management in Palette. The section now includes guides on how to manage users, roles, and permissions in
  Palette. Check out the [User & Role Management](../user-management/user-management.md) section to learn more.

### Packs

#### Kubernetes

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| K3s                                      | 1.28.15     |
| K3s                                      | 1.29.10     |
| K3s                                      | 1.30.6      |
| K3s                                      | 1.31.1      |
| Kubernetes EKS                           | 1.31.1      |
| Palette eXtended Kubernetes (PXK)        | 1.28.15     |
| Palette eXtended Kubernetes (PXK)        | 1.29.10     |
| Palette eXtended Kubernetes (PXK)        | 1.30.6      |
| Palette eXtended Kubernetes (PXK)        | 1.31.1      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.28.15     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.29.10     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.30.6      |
| RKE2                                     | 1.28.15     |
| RKE2                                     | 1.29.10     |
| RKE2                                     | 1.30.6      |
| RKE2 - Edge                              | 1.28.15     |
| RKE2 - Edge                              | 1.29.10     |
| RKE2 - Edge                              | 1.30.6      |
| RKE2 - Edge                              | 1.31.1      |

#### CNI

| Pack Name          | New Version |
| ------------------ | ----------- |
| AWS VPC CNI (Helm) | 1.18.6      |
| Calico             | 3.29.0      |
| Flannel            | 0.26.1      |

#### CSI

| Pack Name            | New Version |
| -------------------- | ----------- |
| Longhorn             | 1.7.2       |
| Portworx /w Operator | 3.2.0       |

#### Add-on Packs

| Pack Name             | New Version |
| --------------------- | ----------- |
| Argo CD               | 7.6.12      |
| Calico Network Policy | 3.29.0      |
| Nginx                 | 1.11.3      |
| Vault                 | 0.29.1      |

#### FIPS Packs

| Pack Name                                | New Version |
| ---------------------------------------- | ----------- |
| Calico                                   | 3.29.0      |
| Flannel                                  | 0.26.1      |
| Palette eXtended Kubernetes (PXK)        | 1.28.15     |
| Palette eXtended Kubernetes (PXK)        | 1.29.10     |
| Palette eXtended Kubernetes (PXK)        | 1.30.6      |
| Palette eXtended Kubernetes (PXK)        | 1.31.1      |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.28.15     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.29.10     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.30.6      |
| RKE2                                     | 1.28.15     |
| RKE2                                     | 1.29.10     |
| RKE2                                     | 1.30.6      |
| RKE2 - Edge                              | 1.28.15     |
| RKE2 - Edge                              | 1.29.10     |
| RKE2 - Edge                              | 1.30.6      |
| RKE2 - Edge                              | 1.31.1      |

#### Community Packs

## November 20, 2024 - Release 4.5.11

### Bug Fixes

- Fixed an issue that prevented the instructions screen from appearing when users select Security Token Service (STS) as
  the authentication method used for adding OCI registries to Palette.

- Fixed an issue that affected the deployment of edge clusters on VerteX.

- Fixed an issue that caused pod presets to fail to be installed correctly after upgrades, blocking pod preset users
  from upgrading their Palette or VerteX installation.

- Fixed an issue that prevented the **Add New Cluster** and **Import Cluster** buttons from appearing in the Palette UI
  when users have selected projects without any clusters.

## November 13, 2024 - Release 4.5.10

### Bug Fixes

- Fixed an issue that caused add-on packs belonging to Helm registries to fail to download due to incorrect Helm
  registry path lookup logic. This issue affected Edge clusters.

- Fixed an issue where Azure users could not select a Private DNS zone from a cluster resource group when creating a new
  Azure cluster.

## November 9, 2024 - Release 4.5.8

### Palette {#palette-enterprise-4-5-8}

#### Breaking Changes

- The _Beehive_ [cluster group](../clusters/cluster-groups/cluster-groups.md) is no longer available starting with this
  release. If you need to deploy a virtual cluster, create a cluster group in your tenant or project. You can learn more
  about creating a new cluster group in the
  [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide.

- The Cluster API (CAPI) label selectors for Nutanix clusters have been updated. The change impacts active Nutanix
  clusters and requires manual intervention to return the cluster to a healthy state. Refer to the
  [Nutanix Cluster Machine Template Updates](../troubleshooting/cluster-deployment.md#scenario---nutanix-capi-deployment-updates)
  for resolution steps. New Nutanix clusters will automatically use the updated label selectors.

#### Features

- Palette now supports Azure Disk Encryption for IaaS clusters deployed to Azure. This feature allows you to leverage
  [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault) for end-to-end encryption for Azure disks
  attached to your IaaS clusters deployed to Azure. Refer to the
  [Azure Disk Encryption](../clusters/public-cloud/azure/azure-disk-encryption.md) guide to learn more about this
  feature.

#### Improvements

- The Palette SaaS login page has received a visual refresh. You can check out the new login page by visiting the
  [Palette](https://console.spectrocloud.com) login page.

- Additional Palette images that are required by internal Palette microservices are migrated to the new image registry,
  `us-docker.pkg.dev`. Refer to the Palette 4.5.3 [Breaking Changes](#breaking-changes-4-5-3) section for more
  information about the new image registry.

- A new cluster filter capability has been added to the Palette UI. The new filter experience provides several quick
  filters out-of-the-box, such as filtering by cluster status, environment, cluster profile, architecture, and more. The
  new filter side drawer is located on the Clusters page. Refer to the
  [Cluster Filters](../clusters/cluster-management/cluster-map-filters.md) guide to learn more about the new cluster
  filters.

### Edge

#### Features

- You can now add Edge clusters to Cluster Groups. This feature allows you to use Edge clusters to host virtual clusters
in Cluster Groups. Check out the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md)
guide to learn how to create a Cluster Group.
<!-- prettier-ignore -->
- You can now add additional manifests to the
  <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor-edge-native-config" /> pack that invoke the Harbor
  API to customize the Harbor registry. This allows you to standardize custom Harbor configurations, such as creating
  additional projects, in your cluster profile.

#### Improvements

<!-- prettier-ignore -->
- Palette will now create separate Harbor projects for packs and Helm charts when the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor-edge-native-config" /> pack is enabled an Edge cluster profile. Existing Edge clusters may continue to use the same Harbor project for both packs and Helm charts. You can also add additional Harbor projects to the Harbor through the Harbor pack configuration. Refer to the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor-edge-native-config" /> pack documentation to learn more about this feature.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-5-8) for more details.

### Automation

- Terraform version 0.22.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- A new Terraform resource, `spectrocloud_ssh_key`, is now available for uploading SSH keys to Palette. You can also use
  the data resource `spectrocloud_ssh_key` to look up information about an SSH key in Palette. For more information,
  refer to the Spectro Cloud Terraform
  provider [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- The Terraform resource, `spectrocloud_privatecloudgateway_dns_map` is now available for creating a DNS mapping with a
  Private Cloud Gateway. A data resource is also available for retrieving information about a DNS mapping for a Private
  Cloud Gateway. For more information, refer to the Spectro Cloud Terraform provider
  [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

- The Palette CLI's usage of Forklift has been updated to version `2.6.3`. The Palette CLI can leverage Forklift to
  migrate a Virtual Machine to a VMO cluster. Check out the
  [Migrate a VM to a VMO cluster](../vm-management/create-manage-vm/advanced-topics/migrate-vm-kubevirt.md) guide to
  learn more about this feature.

- You can now specify a private VMware Virtual Disk Development Kit (VDDK) image to help optimize the migration process
  when migrating a Virtual Machine to a VMO cluster. Refer to the
  [Migrate a VM to a VMO cluster](../vm-management/create-manage-vm/advanced-topics/migrate-vm-kubevirt.md) guide to
  learn more about this feature.

#### Deprecations and Removals

- The Terraform resource, `spectrocloud_cluster_import` is deprecated. To import a cluster deployed outside of the
  context of Palette, refer to the [Import a Cluster](../clusters/imported-clusters/cluster-import.md) guide.

### Docs and Education

- A new announcement page is now available. Use the announcement page to stay informed about upcoming breaking changes,
  deprecations, and removals in Palette. Check out the [Announcements](./annoucements.md) page to learn more.

- The Azure Required IAM permissions have been updated with granular permissions required to support dynamic and static
  placement for Azure IaaS and Azure AKS use cases. Check out the
  [Azure Required IAM Permissions](../clusters/public-cloud/azure/required-permissions.md) to review the updated
  content.

### Packs

#### Kubernetes

| Pack Name   | New Version |
| ----------- | ----------- |
| Nodeadm     | 1.29.0      |
| Nodeadm     | 1.30.0      |
| RKE2        | 1.28.14     |
| RKE2        | 1.29.9      |
| RKE2        | 1.30.5      |
| RKE2 - Edge | 1.28.14     |
| RKE2 - Edge | 1.29.9      |
| RKE2 - Edge | 1.30.5      |

#### CSI

| Pack Name  | New Version |
| ---------- | ----------- |
| Azure CSI  | 1.30.5      |
| GCP Driver | 1.15.1      |
| Rook Ceph  | 1.15.3      |

#### Add-on Packs

| Pack Name                    | New Version |
| ---------------------------- | ----------- |
| AWS Application Loadbalancer | 2.9.1       |
| AWS Cluster Autoscaler       | 1.30.0      |
| Kong                         | 2.42.0      |
| Prometheus - Grafana         | 65.3.1      |
| Reloader                     | 1.1.0       |
| Volume-Snapshot-controller   | 8.1.0       |

#### FIPS Packs

| Pack Name   | New Version |
| ----------- | ----------- |
| Azure CSI   | 1.30.5      |
| Cillium CNI | 1.16.0      |

#### Community Packs

| Pack Name              | New Version |
| ---------------------- | ----------- |
| vSphere No-Provisioner | 1.0.0       |

### Bug Fixes

- Fixed an issue where cluster tags were not propagated to AWS volumes when creating new AWS IaaS clusters.

## October 26, 2024 - Release 4.5.5

### Breaking Changes

- Edge [content bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) created with the
  latest version of the Edge CLI, version `4.5.5`, are incompatible with Palette agent versions before `4.5.4` due to a
  new format schema. If you are using an older version of the Palette agent, use the Edge CLI version `4.5.3` or earlier
  to create content bundles. To download the latest version of the Edge CLI, visit the
  [Downloads](../spectro-downloads.md#palette-edge-cli) page.

### Improvements

<!-- prettier-ignore -->
- <VersionedLink text="BYOOS Edge OS" url="/integrations/packs/?pack=edge-native-byoi" /> pack version 2.0.0 is now available with support for [agent mode deployment](../deployment-modes/agent-mode/agent-mode.md).

- Cluster [Profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) marked as hidden now include the ability to be mutable, hidden, and read-only.

- [Edge content bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) will now retain tags and image signatures. In the past, tags and signatures were stripped when the content bundle was created. Use the latest version of the Edge CLI to create content bundles that retain tags and signatures. To download the latest version of the Edge CLI, visit the
  [Downloads](../spectro-downloads.md#palette-edge-cli) page.

- Support for multiple authenticated external registries with domain mapping capabilities is now available for Edge clusters. Refer to the [External Registries](../clusters/edge/edge-configuration/installer-reference.md#multiple-external-registries) section in the Edge Installer Configuration Reference page for more information.

### Bug Fixes

- Resolved an issue where Edge nodes removed from a cluster remained in the Palette UI after a node delete operation was
  completed.

- Fixed an issue with Palette agent version 4.4.10 was unable to connect to the Palette management plane due to a gRPC
  connection error.

- Fixed an upgrade error causing clusters on K3s version 1.29 to fail to upgrade to a newer version.

- Fixed an issue where pack names containing the `/` character did not fail validation during pack creation.

- Fixed an issue where clusters, without prior backups, using Velero and Restic, were unable to accept resource quotas.

- Resolved an issue where CoreDNS was not upgraded during a Kubernetes upgrade.

- Fixed an issue where [system macros](../registries-and-packs/pack-constraints.md#pack-macros) were causing errors
  during cluster profile downloads.

## October 13, 2024 - Release 4.5.0 - 4.5.3

This release of Palette features a new deployment model, Agent Mode, and contains several new improvements and
enhancements. Take a moment and review the breaking changes and deprecation messages to ensure you stay informed of
upcoming changes. We also have a new and improved [Getting Started](../getting-started/getting-started.md) series worth
checking out, especially if you have new users who need to get familiar with Palette. Check out the following sections
to learn more about the changes introduced in this release.

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-5-3}

#### Breaking Changes {#breaking-changes-4-5-3}

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we are adding a new image registry that Palette agents will use to pull images. The new registry
  is `us-docker.pkg.dev`. If you have network restrictions in place, ensure that the new registry is allowed. The new
  registry is available for use starting with this release. Ensure network connections to `grc.io` are allowed until the
  migration is complete. Refer to the
  [Proxy Requirements](../enterprise-version/install-palette/install-palette.md#proxy-requirements) for a complete list
  of domains that must be allowed.

#### Features

- <TpBadge /> A new deployment model is available in Palette, Agent Mode. Agent mode allows you to use your preferred
  security-hardened Operating System (OS) or immutable OS and machine without sharing cloud provider credentials with
  Palette. The Palette agent is downloaded and installed on the machine, and the machine is then registered with
  Palette. The new model provides more flexibility for customers who want to use their own OS and manage the
  infrastructure provisioning process. In this release, the first supported use case for agent mode is Edge deployments.
  Check out the [Agent Mode](../deployment-modes/agent-mode/agent-mode.md) section to learn more about this new
  deployment model. This feature is only available to Palette Enterprise, and is not available in Palette VerteX.

#### Improvements

- You can now use OIDC user information endpoints to retrieve user information from your designated Identity Provider
  (IdP), such as roles and groups. This improvement allows you to automate the synchronization of user roles and groups
  in Palette with your IdP. Refer to [OIDC](../user-management/saml-sso/saml-sso.md) to learn more about enabling OIDC
  integration in Palette.

- Palette now supports automatic synchronization for OCI Helm registries. Previously, you had to trigger the
  synchronization process manually. With this release, you can enable automatic synchronization for OCI Helm registries.
  This feature is only available to new OCI Helm registries added to Palette. Existing OCI Helm registries will continue
  to require manual synchronization. Re-register existing OCI Helm registries to take advantage of automatic
  synchronization. Refer to the [Add OCI Helm Registry](../registries-and-packs/registries/oci-registry/add-oci-helm.md)
  guide to learn more about adding an OCI Helm registry.

- The self-hosted Palette [system console](../enterprise-version/system-management/system-management.md#system-console)
  login page has now improved visual feedback for login errors. If the username and password fields are empty, they will
  be highlighted in red.

- Several improvements have been introduced to the Palette UI in this release.These upgrades include better support for
  wider screens, optimized page width, ensuring headings are visible on all screen sizes, and other responsive design
  improvements. In addition, event and audit logs can now occupy the entire screen width.

- The difference editor during
  [cluster profile upgrades](../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) received
  minor improvements to make it more user-friendly.

- Palette's internal database, MongoDB, has been upgraded to version 6.0.

#### Deprecations and Removals

- The [cluster group](../clusters/cluster-groups/cluster-groups.md), Beehive, will be sunset on November 9, 2024. As of
  the 4.5.0 release, you are no longer able to deploy any new virtual clusters into Beehive. If you are using Palette
  SaaS and have virtual clusters in the Beehive cluster group, migrate the workload to new virtual clusters hosted in a
  self-managed cluster group before November 9, 2024. You can learn more about creating a new cluster group in the
  [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide.

### Edge

#### Features

- You can now use LocalUI to facilitate user authentication for applications deployed onto Edge clusters. Application
  developers can use the JWT token provided by LocalUI to authenticate users for their applications hosted in the Edge
  cluster. The LocalUI provides a shared public key to each Edge host that you can use to verify the JWT token produced
  by LocalUI. This feature enables a single authentication source for applications deployed onto your Edge cluster.
  Check out the [Share Local UI Authentication](../clusters/edge/local-ui/cluster-management/share-auth.md) guide to
  learn more about this feature.

#### Improvements

- You can now disable the webhook Edge hosts use to redirect image pulls to the appropriate locations depending on your
  Edge user data configuration. Turning off the default webhook allows you to use diverse registry setups, such as
  private authenticated registries and airgap domains. Check out the
  [Disable Webhook to Customize Image Pull Behavior](../clusters/edge/site-deployment//deploy-custom-registries/webhook-disable.md)
  guide to learn more about this feature.

#### Bug Fixes

<!-- prettier-ignore -->
- Fixed an issue where the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor-edge-native-config" /> pack's SSL certificate was not updated when a new certificate was specified in the pack YAML configuration.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-5-3) for more details.

### Automation

- Terraform version 0.21.5 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- The [Getting Started](../getting-started/getting-started.md) section of the documentation has been updated to provide
  a more comprehensive guide for new users to get started with Palette. In the Getting Started section, you can now find
  guides featuring AWS, Azure, GCP, and VMware vSphere. The sections have been updated with new tutorials and feature
  the fictional company Spacetastic to help you understand how to use Palette to manage your infrastructure.

- A new tutorial for Edge is now available. The
  [Deploy an Edge Cluster on VirtualBox](../tutorials/edge/deploy-cluster-virtualbox.md) tutorial provides a
  step-by-step guide to deploying an Edge cluster on VirtualBox. This tutorial is great for new users who want to learn
  more about Edge and gain hands-on experience without needing access to physical hardware.

### Packs

#### Pack Notes

<!-- prettier-ignore -->
- NVIDIA has released a software update for the NVIDIA Container Toolkit and NVIDIA GPU Operator that addresses a
  critical vulnerability, [NVIDIA CVE-2024-0132](https://nvidia.custhelp.com/app/answers/detail/a_id/5582), that affects
  the NVIDIA Container Toolkit versions v1.16.1 or earlier. To address this vulnerability, we recommend you upgrade to the latest <VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator" /> pack version v24.6.2.

#### OS

| Pack Name | New Version |
| --------- | ----------- |
| BYOS      | 2.0.0       |

#### Kubernetes

| Pack Name | New Version |
| --------- | ----------- |
| K3s       | 1.28.14     |
| K3s       | 1.29.9      |
| K3s       | 1.30.5      |
| Microk8s  | 1.28        |

#### CNI

| Pack Name  | New Version |
| ---------- | ----------- |
| Calico     | 3.28.2      |
| Custom CNI | 1.0.0       |

#### CSI

| Pack Name           | New Version |
| ------------------- | ----------- |
| AWS EBS             | 1.35.0      |
| Custom CSI          | 1.0.0       |
| Portworx w/Operator | 3.1.5       |
| Rook Ceph           | 1.14.9      |

#### Add-on Packs

| Pack Name                 | New Version |
| ------------------------- | ----------- |
| AWS ALB                   | 2.8.3       |
| Cillium Tetragon          | 1.2.0       |
| Dex                       | 2.39.1      |
| ExternalDNS               | 0.15.0      |
| External Secrets Operator | 0.10.3      |
| Istio                     | 1.23.1      |
| Kong                      | 2.41.1      |
| Nginx                     | 1.11.2      |
| Spectro Proxy             | 1.5.4       |
| Vault                     | 0.28.1      |

#### FIPS Packs

| Pack Name | New Version |
| --------- | ----------- |
| AWS EBS   | 1.35.0      |
| Calico    | 3.28.2      |

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
