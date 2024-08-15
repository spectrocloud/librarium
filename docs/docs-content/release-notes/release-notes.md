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

## Aug 17, 2024 - Release 4.4.14

<!-- Replace heading ID with the release version below -->

This release is specific to Palette Enterprise and does not apply to Palette VerteX.

### Palette {#release-4-4-14}

#### Breaking Changes

- The Palette CLI no longer has the `validator` command. To validate your self-hosted Palette or VerteX deployment, use
  the `ec` command instead with the `--validate` flag. Refer to the
  [Validate Environment](../automation/palette-cli/commands/ec.md#validate-environment) section of the Palette EC
  command documentation to learn more.

- `nodeDrainTimeout` for clusters has been changed from 10 mins from the previous version to infinite.

  - New clusters will have an infinite `nodeDrainTimeout` upon creation.
  - Existing clusters will retain their existing `nodeDrainTimeout` until there is a new machine created in the control
    plane through scaling, upgrading, or repaving, or when a worker node pool is added or scaled out.

  If any pods fail to be drained, they will be stuck in the draining process and would require manual intervention.

#### Features

- Introducing new filter options to improve the pack selection experience within Palette. Users can now easily filter
  packs by "Verified" and "FIPS Compliant" status using toggles, facilitating quicker and more efficient pack searches
  and selections.

- A new API now allows users to update both DNS hosts and SSL certificates simultaneously in Palette. This update
  addresses user-reported issues related to circular dependencies when updating DNS hosts and certificates separately.
  The change will also be reflected in the UI by merging DNS and certificate update functionalities onto a single page,
  enhancing user experience and functionality validation.

- The VMO airgap binary has moved out of Preview status into Production-ready state.

#### Improvements

- Improvements made to Palette reduced resource usage and improved the reliability and responsiveness of the cluster
  management.

- Reduced latency in permission resolution, especially for users with access to a large number of projects.

- Reduced CPU and memory consumption within the pods and enhanced overall system performance during machine health
  updates.

#### Fixes

- Fixed an issue that sometimes caused CSI errors if there are multiple instances of self-hosted Palette or VerteX in a
  single vSphere environment.

### Edge

#### Features

- Introducing a validation tool for the install configuration **user-data** for Edge hosts. Errors in **user-data**
  files can lead to significant delays and troubleshooting efforts. This feature validates the user-data file for both
  YAML formatting and schema compliance during build time to catch issues earlier. For more information, refer to
  [Validate User Data](../clusters/edge/edgeforge-workflow/validate-user-data.md).

- This release introduces file download support within Local UI, which allows users to write files to a fixed path on
  the Edge host and download them from Local UI. Previously, gathering files from Edge hosts required elevated
  privileges and could be error-prone when executed manually. For more information, refer to
  [Download Files from Local UI](../clusters/edge/local-ui/host-management/download-core-dump.md).

- Palette agent on Edge hosts will now produce audit logs. This capability captures timestamped records for a variety of
  events, including authentication attempts, configuration changes, and cluster management activities. In addition, you
  can program your own applications to send logs to the same location, and have Local UI display those log entries. For
  more information, refer to [Configure Audit Logs](../clusters/edge/local-ui/host-management/audit-logs.md).

- Local UI will now display progress and status during cluster deployment. Users can now monitor key milestones in
  real-time during the creation and updating of Edge clusters.

### Packs

#### Kubernetes Packs

| Pack                                       | New Version |
| ------------------------------------------ | ----------- |
| K3s                                        | 1.27.16     |
| K3s                                        | 1.28.12     |
| K3s                                        | 1.29.7      |
| Palette eXtended Kubernetes (PXK)          | 1.27.16     |
| Palette eXtended Kubernetes (PXK)          | 1.28.12     |
| Palette eXtended Kubernetes (PXK)          | 1.29.7      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.27.16     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.28.12     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.7      |
| RKE2                                       | 1.27.15     |
| RKE2                                       | 1.28.11     |
| RKE2                                       | 1.29.6      |
| RKE2 FIPS                                  | 1.27.15     |

#### CNI

| Pack   | New Version |
| ------ | ----------- |
| Cilium | 1.15.7      |

#### CSI

| Pack        | New Version |
| ----------- | ----------- |
| Azure Disk  | 1.30.1      |
| AWS EBS     | 1.33.0      |
| VSphere CSI | 3.3.0       |

#### FIPS

| Pack                               | New Version |
| ---------------------------------- | ----------- |
| Longhorn                           | 1.6.2       |
| Palette eXtended Kubernetes - FIPS | 1.27.16     |
| Palette eXtended Kubernetes - FIPS | 1.28.12     |
| Palette eXtended Kubernetes - FIPS | 1.29.7      |

#### Add-on Packs

| Pack       | New Version |
| ---------- | ----------- |
| MetalLB    | 0.14.5      |
| Prometheus | 58.6.0      |

### Automation

#### Features

- A new tool for building CAPI images is now available. The CAPI Image Builder reduces the challenges associated with
  creating images for Kubernetes clusters. It is based on the upstream
  [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html) project and includes all the
  dependencies required to build FIPS and non-FIPS images within a Docker container.

#### Improvements

- You will now receive a clear warning message in the terminal after issuing the `terraform plan` command if your action
  would result in a cluster repave. Previously, this notification is not available in Terraform-managed environments,
  leading to potential oversight by users.

### Docs and Education

Palette's Go SDK now has a dedicated documentation section. The new section also includes a guide on how to install,
configure, and use the SDK. This guide provides instructions and sample code for listing the active clusters in your
Palette environment. Check out the Palette Go SDK documentation for more details.

## Jul 31, 2024 - Release 4.4.12

#### Bug Fixes

- Fixed an issue where the Palette agent would fail to pull Helm charts from private registries when initializing Edge
  clusters.

## Jul 20, 2024 - Release 4.4.11

<!-- Custom heading applied due to linking of the Palette section in the VerteX section -->

### Palette {#release-4-4-8}

#### Features

- This release introduces a system-wide control User Interface (UI) for feature flags. System administrators can now
  turn features on or off through the system console. Once a feature flag is enabled, all tenants will have access to
  the feature. Check out the [Feature Flags](../enterprise-version/system-management/feature-flags.md) documentation to
  learn more.

- Kubernetes clusters deployed to Azure can now use network proxy configurations. To use this new feature, you must
  deploy a PCG in your Azure environment and configure the PCG to use your network proxy server. Once the PCG is
  deployed and configured with the proxy server details, the newly deployed Azure clusters will inherit the proxy
  configurations from the PCG. To learn more, refer to the
  [Proxy Configuration](../clusters/public-cloud/azure/architecture.md#proxy-configuration) guide.

- Palette now supports specifying a custom Certificate Authority (CA) when enabling OIDC integration. You now use
  self-signed root certificates from internal identity providers when configuring OIDC integration. To learn more, refer
  to the [Enable SSO with Custom CA](../user-management/saml-sso/saml-sso.md) guide.

- You can now deploy a cluster on Azure and only use private IP addresses for the control plane and worker nodes. When
  deploying the cluster, this new behavior requires using a Private Cloud Gateway (PCG) and static placement selection.
  To learn more about deploying a cluster with private IP addresses, refer to the
  [Deploy a Cluster with Private IP Addresses](../clusters/public-cloud/azure/create-azure-cluster.md) guide.

#### Improvements

- The Palette UI has been updated to improve the user experience for the project and tenant settings pages. The new
  **Settings Menu** enhances usability and reduces visual clutter. You can now collapse and expand categories within the
  **Settings Menu**.

- Self-hosted Palette and PCG instances deployed to Azure through a Helm Chart now accept proxy configurations for
  outbound traffic. The proxy configuration is set in the **values.yaml** file during the deployment process. Refer to
  the
  [Self-Hosted Helm Chart Configuration Reference](../enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref.md#reach-system)
  or the [Deploy a PCG to an Existing Kubernetes Cluster](../clusters/pcg/deploy-pcg-k8s.md) guide to learn more.

- Improvements to the Palette agent has reduced the frequency and bandwidth of agent communication with the Palette
  management platform. This change reduces the resource consumption by the Palette agent in a cluster and the bandwidth
  usage between the agent and the Palette management platform.

- Palette API responses now include the header `Cache-Control`. This header provides information on how long the
  response can be cached and helps improve the performance of the Palette UI.

- Self-Hosted Palette and Private Cloud Gateway (PCG) instances deployed on VMware vSphere now use the vSphere CSI
  driver version 3.2.0. The new version will automatically get picked up during an upgrade.

### Bug Fixes

- The issue preventing RKE2 and PXK clusters using Kubernetes version 1.29.4 from deploying on MAAS successfully is now
  resolved. Remove any existing MAAS Kubernetes 1.29.4 images from your environment to pull in the updated images.

### Edge

#### Breaking Changes

- A change in the EdgeForge process affects the Local UI customization process when using the CanvOS utility. In the
  past, placing a folder named **ui** at the root level of the CanvOS project was required. Moving forward, the **ui**
  folder will be placed in the **local-ui/** folder. This change is to align with the new CanvOS project structure. If
  you are using the EdgeForge process to create Edge artifacts, ensure you update the location of the **ui** folder in
  your CanvOS project. Refer to the Local UI [Custom Links](../clusters/edge/local-ui/host-management/custom-link.md)
  and [Customize Local UI Theme](../clusters/edge/local-ui/host-management/theming.md) to learn more about the changes.

#### Features

- A new Palette API endpoint, `v1/edgehosts/tags`, is available to retrieve all tags associated with Edge clusters.

- [The Edge Management API](/api/category/edge-management-api-v1/) now supports some operations on connected Edge hosts
  (non-airgap). In the past, the Edge Management API only supported airgap Edge hosts and clusters. The new
  functionality now allows you to perform some actions using the Edge Management API on connected Edge hosts. Refer to
  [List of Endpoints Unavailable to Connected Edge Hosts](/api/introduction/#list-of-endpoints-unavailable-to-connected-edge-hosts)
  section to learn more about the limitations of connected Edge hosts.

- Local UI now supports signed content bundles and cluster definitions. You can embed a public key in your Edge
  Installer ISO or provider image. Local UI can use the key to verify the content bundle and cluster definition
  cryptographically during uploads to ensure you are fulfilling compliance requirements. Refer to the
  [Build Content Bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) guide to learn
  more.

#### Improvements

- You can now disable password changes of Operating System (OS) users from Local UI. When password updates from Local UI
  are disabled, you can still update the OS user password from the OS or the Edge Management API. Check out the
  [Access Local UI](../clusters/edge/local-ui/host-management/access-console.md) page to learn more.

- Several enhancements have been made to the UI for Edge host management in the context of cluster creation and updates.
  These changes ensure a consistent and user-friendly experience, including new designs for the Edge host selection
  screen and a customizable, powerful grid view. This redesign provides a better user experience for managing many edge
  hosts in large-scale environments. Check out the
  [Edge Host Grid View](../clusters/edge/site-deployment/edge-host-view.md) page to learn more.

- EdgeForge now supports creating base images for Edge hosts using Ubuntu 24.04 UKI. To learn more about creating base
  images, refer to the [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md)
  guide.

### VerteX

#### Features

- Includes all Palette features and improvements in this release. Refer to the [Palette](#release-4-4-8) section for
  more details.

#### Bug Fixes

- Resolved the issue that made VerteX enterprise clusters unable to complete backup operations.

### Automation

- Terraform version 0.20.7 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- Palette Crossplane provider version 0.20.7 is available. For more details, refer to the provider
  [release page](https://github.com/crossplane-contrib/provider-palette/releases).

- The Palette CLI now supports automatic validation when deploying a self-hosted VerteX or Palette instance. Use the
  `--validate` flag to validate the deployment configuration before deploying the instance. Refer to the
  [Validate Environment](../automation/palette-cli/commands/ec.md#validate-environment) section of the Palette EC
  command documentation to learn more.

### Docs and Education

- Palette tutorials now have a dedicated view in the documentation. The [Tutorials](../tutorials/tutorials.md) page
  provides a list of tutorials to help you get started with Palette and its features, and other advanced topics.

### Packs

#### Kubernetes

| Pack                                       | New Version |
| ------------------------------------------ | ----------- |
| K3s                                        | 1.27.15     |
| K3s                                        | 1.28.11     |
| K3s                                        | 1.29.6      |
| Palette eXtended Kubernetes (PXK)          | 1.27.15     |
| Palette eXtended Kubernetes (PXK)          | 1.28.11     |
| Palette eXtended Kubernetes (PXK)          | 1.29.6      |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.27.15     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.28.11     |
| Palette eXtended Kubernetes - Edge (PXK-E) | 1.29.6      |
| RKE2                                       | 1.27.14     |
| RKE2                                       | 1.28.10     |
| RKE2                                       | 1.29.5      |
| RKE2 - Edge                                | 1.27.14     |
| RKE2 - Edge                                | 1.28.10     |
| RKE2 - Edge                                | 1.29.5      |

#### CNI

| Pack   | New Version |
| ------ | ----------- |
| Calico | 3.28.0      |

#### CSI

| Pack        | New Version |
| ----------- | ----------- |
| AWS EFS     | 2.0.4       |
| Rook Ceph   | 1.14.0      |
| vSphere CSI | 3.2.0       |

#### Add-on Packs

| Pack                      | New Version |
| ------------------------- | ----------- |
| External Secrets Operator | 0.9.16      |
| Kong                      | 2.38.0      |
| Reloader                  | 1.0.74      |
| Reloader                  | 1.0.107     |
| Spectro Proxy             | 1.5.3       |

#### FIPS

| Pack        | New Version |
| ----------- | ----------- |
| Calico      | 3.28.0      |
| Flannel     | 0.24.3      |
| RKE2        | 1.27.14     |
| RKE2        | 1.28.10     |
| RKE2        | 1.29.5      |
| RKE2 - Edge | 1.27.14     |
| RKE2 - Edge | 1.28.10     |
| RKE2 - Edge | 1.29.5      |

## Jul 7, 2024 - Release 4.4.7

#### Bug Fixes

- Fixed an issue where Edge hosts would lose the local network configuration after adding a node to the cluster.

- Fixed an issue where cluster profile manifest layers were switched, and as a result, different manifest layer YAML
  files were applied at the wrong time.

- Fixed an issue occurring with self-hosted Palette and VerteX upgrading to 4.4. x. Mongo DNS was incorrectly configured
  in the configserver ConfigMap, resulting in pod errors.

- Fixed an issue where the airgap setup script failed to push all the compressed images to the local registry.

## Jun 15, 2024 - Release 4.4.0 - 4.4.6

<!-- prettier-ignore -->
This release contains various new features and improvements. One new feature is the introduction of
[Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md) for Edge. Trusted Boot is a hardware-based security
feature that ensures that the system boots securely and that the boot process has not been tampered with. We also
improved the MicroK8s experience by exposing lifecycle commands. Other improvements include enhancements to the Cluster
Profile Variables user experience, automatic SSL certificate updates for Edge clusters in airgap environments, and new
network troubleshooting tools in Local UI. Check out the full release notes to learn more about this release's new
features and improvements.

### Security Notices

- Review the [Security Bulletins](../security-bulletins/security-bulletins.md) page for the latest security advisories.

### Palette

#### Breaking Changes

- In this release, Palette aligns Google Cloud Platform GKE behavior with Azure AKS and AWS EKS and removes the ability
  to specify a patch version when creating a cluster profile for AKS, EKS, and GKE. Only the major and minor versions
  are available for selection. The underlying cloud provider will automatically select the latest patch version
  available for the selected major and minor version.

- Validator Helm Charts have migrated from `https://github.com/spectrocloud-labs/validator` to
  `https://github.com/validator-labs/validator`. Former versions of the Palette CLI will point to the former repository
  when prompted for the Helm chart location and require a manual URL change. The new version of the Palette CLI will
  point to the new repository.

- Due to the removal of GKE Kubernetes patch versions, it's critical you update existing cluster profiles to use the new
  GKE Kubernetes packs to avoid issues. Active clusters using old GKE Kubernetes pack versions may encounter problems
  like pods failing to start and scaling issues. We recommend deploying new clusters with the updated GKE cluster
  profile and migrating workloads.

#### Features

- <TpBadge /> The MicroK8s pack layer now exposes `bootCommands`, `preRunCommands` and `postRunCommands`. You can use
  these commands to customize and configure MicroK8s as needed. MicroK8s is delivered as a Technical Preview for AWS and
  Canonical MAAS in this release. To learn more, refer to the MicroK8s pack
  <VersionedLink text="documentation" url="/integrations/packs/?pack=kubernetes-microk8s" />.

#### Improvements

- You can now upload a custom pack to a self-hosted OCI registry multiple times by using different namespaces in the OCI
  repository.

- This release removes terminology that may be culturally insensitive or create a barrier to inclusion. We removed the
  term "master" from our product and replaced it with "control-plane". This work aligns with the Linux Foundation
  initiative for [Diversity & Inclusivity](https://www.linuxfoundation.org/about/diversity-inclusivity).

#### Bug Fixes

- The issue where Google GKE cluster deployments failed is now resolved. You can now deploy GKE clusters using the
  latest available GKE versions.

#### Deprecations and Removals

- The term _master_ is removed from Palette and replaced with the term, _control plane_. This change is reflected in the
  UI, API and documentation. The following API endpoints are affected as a the payload object `includeMasterMachines` is
  deprecated and replaced with the new object, `includeControlPlaneMachines`:

  - POST `/v1/dashboard/spectroclusters/resources/usage`
  - POST `/v1/dashboard/spectroclusters/resources/cost`
  - POST `/v1/dashboard/spectroclusters/{uid}/resources/consumption`
  - POST `/v1/dashboard/spectroclusters/resources/consumption`
  - GET `/v1/metrics/{resourceKind}/{resourceUid}/values`
  - GET `/v1/metrics/{resourceKind}/values`

  <br />

  :::warning

  After six months, the `includeMasterMachines` object will be removed from the API. Use the
  `includeControlPlaneMachines` object moving forward.

  :::

#### Known Issues

- An issue prevents RKE2 and Palette eXtended Kubernetes (PXK) on version 1.29.4 from operating correctly with Canonical
  MAAS. A temporary workaround is using a version lower than 1.29.4 when using MAAS..

- <VersionedLink text="MicroK8s" url="/integrations/packs/?pack=kubernetes-microk8s" /> does not support a multi-node
  cluster deployment and is limited to a single-node cluster. As a result, the only supported upgrade strategy is
  `InPlaceUpgrade`.

- Clusters using <VersionedLink text="MicroK8s" url="/integrations/packs/?pack=kubernetes-microk8s"/> as the Kubernetes
  distribution, the control plane node fails to upgrade when using the `InPlaceUpgrade` strategy for sequential
  upgrades, such as upgrading from version 1.25.x to version 1.26.x and then to version 1.27.x. Refer to the
  [Control Plane Node Fails to Upgrade in Sequential MicroK8s Upgrades](../troubleshooting/pack-issues.md)
  troubleshooting guide for resolution steps.

- If you did not configure the Trusted Boot keys to auto-enroll, manual enrollment could take several times to be
  successful. For more information about key enrollment, refer to
  [Enroll Trusted Boot Keys in Edge Host](../clusters/edge/trusted-boot/deployment-day2/install.md#enroll-secure-boot-keys-into-edge-device).

- Edge hosts with FIPS-compliant RHEL Operating System (OS) distribution may encounter the error where the
  `systemd-resolved.service` service enters the **failed** state. This prevents the nameserver from being configured,
  which will result in cluster deployment failure. Refer to
  [TroubleShooting](../troubleshooting/edge.md#scenario---systemd-resolvedservice-enters-failed-state) for a workaround.

### Edge

#### Features

<!-- prettier-ignore -->
- <TpBadge /> [Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md) is an exciting new Edge capability developed as part of the [SENA
  framework](https://www.spectrocloud.com/product/sena). Trusted Boot is a hardware-based security feature that ensures that the system boots securely and that the boot process has
  not been tampered with. Trusted Boot does several significant things, all working in concert, to enhance security: 
  - Ensures that only trusted software can boot on the system. Any modification to any part of the hard disk will be detected. 
  - Encrypts all sensitive data on disk using hardware security Trusted Platform Module (TPM). 
  - Ensures that the TPM will only decrypt sensitive data if the boot process is clean and untampered.

  Unlike similar solutions, Trusted Boot utilizes a secure boot, measured boot, and encryption to protect 
  the booting system far more than other solutions. To learn more about Edge Trusted Boot, check out the
  [Edge Trusted Boot documentation](../clusters/edge/trusted-boot/trusted-boot.md).

#### Improvements

<!-- prettier-ignore -->
- <TpBadge /> The Cluster Profile Variables user experience has been improved. Users can now identify where a variable is used, preview the variable during creation time, and change the order of the variables displayed. An improved Day-2 management experience is also available. You can learn more about these new features in the [Cluster Profile Variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) documentation.


- Edge clusters managed by [LocalUI](../clusters/edge/local-ui/local-ui.md) now receive automatic SSL certificate updates for Kubernetes. Users can also manually trigger the SSL certificate update process. For more information, refer to the [Renew Certificates for Airgap Clusters](../clusters/edge/cluster-management/certificate-renewal.md) guide.

- [Local UI](../clusters/edge/local-ui/local-ui.md) now includes tools to help users troubleshoot network issues. The tools include ping and traceroute. For more information, refer to the [Local UI](../clusters/edge/local-ui/local-ui.md) documentation.

- Clusters managed by [Local UI](../clusters/edge/local-ui/local-ui.md) now include a new feature that allows users to download diagnostic logs from Local UI. This feature reduces the friction of troubleshooting issues on the cluster as the need to SSH into the cluster is reduced.

- Support for custom links, URLs, and static pages is now available in Local UI. You can populate custom links in the left **Main Menu** of [Local UI](../clusters/edge/local-ui/host-management/custom-link.md), which will either load content into in an iframe or act as en external link. You can also can host static pages in Local UI. This is useful when you need to deploy and host custom or specific content for a site and want to avoid introducing additional services to host a static site.

### Palette Dev Engine (PDE)

#### Known Issues

- During the platform upgrade from Palette 4.3 to 4.4,
  [Virtual Clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md) may encounter a scenario where
  the pod `palette-controller-manager` is not upgraded to the newer version of Palette. The virtual cluster will
  continue to be operational, and this does not impact its functionality. Refer to the
  [Controller Manager Pod Not Upgraded](../troubleshooting/palette-dev-engine.md#scenario---controller-manager-pod-not-upgraded)
  troubleshooting guide for resolution steps.

### Virtual Machine Orchestrator (VMO)

#### Improvements

- The KubeVirt version in use is now v1.2.0. Other minor maintenance updates in support of Kubevirt 1.2.0 are also
  included.

<!-- ### VerteX

#### Features

- You can now deploy Palette VerteX using Red Hat Linux Enterprise (RHEL) as the Operating System (OS) for the VerteX
  instance nodes. Using RHEL as the base OS is available for VerteX when deployed to a VMware vSphere environment using
  the Palette CLI. A prompt will ask you to select the OS during the VerteX deployment process. Refer to the Palette
  VerteX installation [guide](../vertex/install-palette-vertex/install-on-vmware/install.md) for more details. -->

### Automation

- Terraform version 0.20.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- Palette Crossplane provider version 0.20.0 is available. For more details, refer to the provider
  [release page](https://github.com/crossplane-contrib/provider-palette/releases).

- The Terraform data resources,
  [`spectrocloud_pack`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)
  and
  [`spectrocloud_pack_simple`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack_simple),
  will both require the attribute `registry_uid` to be set the next Terraform release, 0.21.0. We recommend you start
  using this attribute in your Terraform configurations to avoid issues in the future.

### Docs and Education

- [Palette's Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/latest)
  now has a dedicated documentation section. The new section also includes a few guides on how to deploy a Kubernetes
  clusters using Crossplane. Check out the [Crossplane Provider](../automation/crossplane/crossplane.md) documentation
  for more details.

### Packs

#### Pack Notes

- Cluster Autoscaler version 1.29.2 is a Helm-based pack. Previous versions of the pack were manifest-based. Upgrades to
  the new version require you to select the new Helm-based pack.

- The BYOOS pack is now available for Palette VerteX deployments. This allows users to bring their own Operating System
  (OS) image to deploy VerteX instances. RHEL is the only custom OS supported for VerteX deployments at this time.

- MicroK8s now supports boot, `preRun` and `postRun` commands on cloud-init. This allows users to execute custom
  commands before and after their MicroK8s deployment processes, providing enhanced flexibility and control over
  deployment environments.

- The Kubernetes pack parameter `k8sHardening` is removed and no longer used as the method for hardening images during
  the image creation process. This change does not impact users.

- Cluster Autoscaler is now a verified pack. Refer to the [Verified Packs](../integrations/verified_packs.md) page for
  more details on verified packs.

#### Kubernetes

| Pack                                     | New Version |
| ---------------------------------------- | ----------- |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.26.15     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.27.11     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.28.9      |
| Palette eXtended Kubernetes              | 1.27.13     |
| Palette eXtended Kubernetes              | 1.28.9      |
| Palette eXtended Kubernetes              | 1.29.4      |
| Kubernetes Azure AKS                     | 1.29        |
| Kubernetes Google GKE                    | 1.26        |
| Kubernetes Google GKE                    | 1.27        |
| Kubernetes Google GKE                    | 1.28        |
| Kubernetes Google GKE                    | 1.29        |
| RKE2                                     | 1.27.13     |
| RKE2                                     | 1.28.9      |
| RKE2                                     | 1.29.4      |
| RKE2 - Edge                              | 1.26.15     |
| RKE2 - Edge                              | 1.27.13     |
| RKE2 - Edge                              | 1.28.9      |
| RKE2 - Edge                              | 1.29.4      |

#### CNI

| Pack               | New Version |
| ------------------ | ----------- |
| AWS VPC CNI (Helm) | 1.17.1      |
| Calico             | 3.27.2      |
| Calico Azure       | 3.27.2      |
| Cilium OSS         | 1.15.3      |
| Flannel            | 0.24.3      |

#### CSI

| Pack                    | New Version |
| ----------------------- | ----------- |
| AWS EFS                 | 1.7.6       |
| AWS EBS CSI             | 1.28.0      |
| Azure Disk CSI Driver   | 1.30.0      |
| GCE Persistent Disk CSI | 1.13.2      |
| Portworx /w Operator    | 3.1.0       |

#### Add-on Packs

| Pack                          | New Version |
| ----------------------------- | ----------- |
| AWS Application Loadbalancer  | 2.7.2       |
| AWS Cluster Autoscaler (Helm) | 1.29.2      |
| MetalLB (Helm)                | 0.14.3      |
| Nginx                         | 1.10.0      |
| OpenPolicyAgent               | 3.15.1      |
| Portworx /w Operator          | 3.1.0       |
| Prometheus - Grafana          | 57.0.1      |

#### FIPS Packs

| Pack                                     | New Version |
| ---------------------------------------- | ----------- |
| AWS EBS CSI                              | 1.28.0      |
| AWS VPC CNI (Helm)                       | 1.1.17      |
| Calico Azure                             | 3.25.1      |
| Calico Azure                             | 3.26.3      |
| Cilium                                   | 1.13.4      |
| Cilium                                   | 1.14.3      |
| Cilium                                   | 1.14.5      |
| Longhorn                                 | 1.4.1       |
| Longhorn                                 | 1.5.3       |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.26.15     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.27.14     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.28.10     |
| Palette eXtended Kubernetes Edge (PXK-E) | 1.29.5      |
| Palette Optimized RKE2                   | 1.27.13     |
| Palette Optimized RKE2                   | 1.28.9      |
| Palette Optimized RKE2                   | 1.29.4      |
| Palette eXtended Kubernetes (PXK)        | 1.27.13     |
| Palette eXtended Kubernetes (PXK)        | 1.27.2      |
| Palette eXtended Kubernetes (PXK)        | 1.28.9      |
| Palette eXtended Kubernetes (PXK)        | 1.29.4      |
| RKE2                                     | 1.27.13     |
| RKE2                                     | 1.28.9      |
| RKE2                                     | 1.29.0      |
| RKE2                                     | 1.29.4      |
| RKE2 - Edge                              | 1.27.13     |
| RKE2 - Edge                              | 1.28.9      |
| RKE2 - Edge                              | 1.29.4      |
| vSphere CSI                              | 3.1.0       |
| vSphere CSI                              | 3.1.2       |

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
