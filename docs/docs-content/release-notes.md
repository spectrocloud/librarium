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

## October 11, 2023 - Release 4.0.19

This release contains the following enhancements and minor bug fixes.

### Enhancements

- For Helm Chart and Palette CLI installations, you can now modify previously hardcoded registry mapping patterns to
  fetch images from internal Open Containers Initiative (OCI) and Docker repositories.

  For example, to pull images from an internal repository serving Docker images, you would configure
  `docker.io::teams-jfrog.spectrocloud.dev/v2/image-registry`.

- You can now disable local accounts on existing Azure Kubernetes Services (AKS) clusters at the Kubernetes layer by
  setting the `managedControlPlane.aadProfile.disableLocalaccounts` parameter to `true`. Using the same parameter, you
  can also create a new cluster with local accounts disabled and re-enable local accounts on existing clusters.

- You can now configure OpenID Connect (OIDC) for virtual clusters. Refer to
  [Configure OIDC for a Virtual Cluster](clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md).

- In Cluster Mode, you can now deploy add-on profiles on virtual clusters.

- When importing a cluster, Palette now supports HTTPS proxies and (Secure Sockets Layer) SSL interception of real-time
  certificate requests and generation based on the certificate authority (CA) path you provide.

### Bug Fixes

- In Kubernetes clusters that use Suse Linux Enterprise Server as their custom OS, the missing host path for
  certificates is now set correctly.

- The issue is fixed where RKE2 pack values were modified in the cluster configuration with the node IP address but were
  not being passed.

- The issue with Palette failing to create a target client when launching an EKS cluster with custom OIDC IAM Roles is
  resolved.

## October 11, 2023 - Release 4.0.17

This release contains the following enhancement.

### Enhancements

- Palette VerteX now supports air-gapped environments.

## October 3, 2023 - Release 4.0.15

This release contains enhancements and minor bug fixes.

### Enhancements

- Configurable options to specify pricing for Azure Kubernetes Service (AKS) cluster control planes are now available in
  the Kubernetes **values.yaml** pack. You can review examples of how to use the `managedControlPlane.sku` parameter in
  [AKS Architecture](clusters/public-cloud/azure/architecture.md#pricing-options) highlights.

- Palette now supports the space character for the `scopesDelimiter` field for OpenID Connect (OIDC) configuration.
  Previously, Palette used only a comma delimiter.

### Bug Fixes

- API calls to update edge hosts no longer time out after 60 seconds.

- The issue where system pods in the `hubble-system` namespace restarted frequently is now resolved.

- The issue with Palette displaying incorrect interface of an edge host during cluster deployment is now resolved.

## September 20, 2023 - Release 4.0.13

This release contains minor bug fixes.

### Bug Fixes

- An issue where `etcd` sometimes retained an incorrect state entry of cluster nodes during scaling operations is now
  resolved.

- The issue where Palette does not display Helm Charts in third-party registries that contain charts without a logo URL
  is now resolved.

- Longhorn and Cilium Helm Chart-based packs are fixed to deploy with correct values.

- An issue where Palette was updating clusters when _Pause Platform Updates_ was enabled at the project level is fixed.
  This issue did not cause nodes to repave or for clusters to become unhealthy.

## September 1, 2023 - Release 4.0.8

This release contains minor bug fixes.

### Bug Fixes

- A bug that caused ARM64 Nvidia Jetson cluster deployment to fail has been resolved.

- The problem with a blank **drop-down Menu** when trying to add a CoxEdge cloud account is resolved with a populated
  menu.

## August 31, 2023 - Release 4.0.7

This release contains minor bug fixes.

### Bug Fixes

- A problem with Palette retaining original pack values in manifests after users apply modifications has been resolved.

## August 27, 2023 - Release 4.0.0 {#release-4-0}

Palette 4.0.0 introduces new features and improvements, including [Palette VerteX](vertex/vertex.md) - a FIPS-compliant
edition - and the [Virtual Machine Orchestrator](vm-management/vm-management.md) (VMO) which enables unified management
of containerized applications and virtual machines in Kubernetes. Additionally, Palette 4.0.0 introduces a new Pack User
Interface (UI) that improves the user experience for finding and installing packs. Check out the
[Upgrade Notes](enterprise-version/upgrade/upgrade.md) and release notes below to learn more about the new features and
improvements in Palette 4.0.0.

### Palette {#release-4-0-palette}

#### Breaking Changes {#release-4-0-palette-breaking-changes}

- Deploying Virtual Clusters directly into host clusters is no longer supported. Use Cluster Groups to deploy Virtual
  Clusters in host clusters. For guidance on deploying Virtual Clusters into a Cluster Group, check out the
  [Add Virtual Clusters to a Cluster Group](clusters/palette-virtual-clusters/deploy-virtual-cluster.md) documentation.

#### Features {#release-4-0-palette-features}

- The Virtual Machine Orchestrator (VMO) is now available in Palette. You can natively manage virtual machines from
  Palette. Palette uses kubevirt under the hood to facilitate the management of virtual machines. Review the
  [VMO](vm-management/vm-management.md) documentation to learn more.

- Custom Pack registries now support the ability for you to upload your own SSL Certificate Authority (CA). You can use
  HTTPS to connect to your private registries by providing your SSL certificate. Refer to the
  [Configure a Custom Pack Registry in Palette](registries-and-packs/adding-a-custom-registry.md) documentation to learn
  more.

- A new Pack User Interface (UI) is available in Palette. This new UI allows you to search for packs across registries
  while providing you with important metadata. The new search experience improves the user experience for finding and
  installing packs.

- Pack registries now support the Open Container Initiative (OCI) image format. This allows you to use OCI images in
  your custom pack registries instead of the previous Palette-specific format.

- Palette now supports VMware vSphere 8.0. You can now deploy host clusters with VMware vSphere 8.0.

- Host clusters deployed to VMware now support [VMware NSX](https://www.vmware.com/products/nsx.html) overlay
  networking.

- Palette's internal message communication between components now uses the gRPC protocol. The previous usage of
  [NATS](https://nats.io/) has been deprecated and will be removed in a future release. You can review a network diagram
  of Palette's communication architecture on the [Network Ports](architecture/networking-ports.md) page. If you are
  using network proxies, we encourage you to review the [gRPC and Proxies](architecture/grps-proxy.md) documentation for
  potential issues.

- Pack deprecated status is now available in the Palette UI. This lets you identify which packs are deprecated and will
  be removed in future releases. Review the [Maintenance Policy](integrations/maintenance-policy.md) documentation to
  learn more.

- Self-hosted Palette now provides a new installation method using the
  [Palette CLI](automation/palette-cli/palette-cli.md). You can now install a self-hosted Palette through the Palette
  CLI. The CLI provides an interactive installation experience allowing you to configure Palette's installation
  parameters. Check out the [Install Enterprise Cluster](enterprise-version/install-palette/install-palette.md)
  documentation to learn more. The previous installation method using the Palette OVA Installer is deprecated and
  unavailable in this release.

- Private Cloud Gateway (PCG) deployments are now available through the Palette CLI. You can now install a PCG through
  the Palette CLI. The CLI provides an interactive installation experience allowing you to configure the PCG
  installation parameters. Check out the Palette CLI [PCG install command](automation/palette-cli/commands.md#pcg)
  documentation to learn more. The previous installation method using the PCG Docker image is deprecated and unavailable
  in this release.

- You can now specify namespace labels and annotations in a Container Network Interface (CNI), Container Storage
  Interface (CSI), and Add-on pack's YAML configuration. This allows you to specify labels and annotations that are
  applied to specific namespaces in the cluster. To learn more about configuring labels and annotations, refer to
  [Create an Add-on Profile](profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md).

#### Improvements {#release-4-0-palette-improvements}

- You can now download different kubeconfig files for your host clusters in Palette. You can download an admin
  kubeconfig file or a user kubeconfig file. The admin kubeconfig file allows you to perform all actions on the cluster.
  In contrast, the user kubeconfig file is only accessible to those with the proper Palette permissions to access the
  cluster. To learn more, check out the Palette [kubeconfig](clusters/cluster-management/kubeconfig.md) documentation.

- You can now install a self-hosted Palette through the Palette CLI. The CLI provides an interactive installation
  experience allowing you to configure Palette's installation parameters. Learn more about the Palette
  [EC command](automation/palette-cli/commands.md#ec) documentation.

- The login banner message in Palette is now also exposed in the Palette CLI. Users logging in to Palette through the
  CLI will receive the same message as those logging in through the UI. Refer to the
  [Login Banner](tenant-settings/login-banner.md) documentation to learn more.

- You can now configure the logout timer for users in Palette. This allows you to set the time a user can be inactive
  before they are automatically logged out of Palette. The default value is 240 minutes.

- Private Cloud Gateway (PCG) deployments and self-hosted Palette Enterprise Clusters (EC) are now deployed with
  Kubernetes version 1.25.

- Palette now supports Kubernetes 1.27.x. You can deploy host clusters with Kubernetes 1.27.x.

- The Cox Edge provider is upgraded to version 0.5.0.

- You can now access Palette documentation directly from the Palette UI. This allows you to quickly access the
  documentation for the page you are currently on. You can find the documentation link in the top right corner of the
  Palette UI.

- Palette now supports configuring the time interval for node repavement. The time interval is the amount of time that
  Palette waits before it starts the node replacement process on nodes in the cluster. The default time interval is 15
  minutes. Refer to the [Node Pool](clusters/cluster-management/node-pool.md) documentation to learn more.

#### Deprecations and Removals {#release-4-0-palette-deprecation-removals}

- The Palette OVA Installer is deprecated and no longer provided as of this release. Self-hosted Palette now provides a
  new installation method using the Palette CLI. The CLI provides an interactive installation experience allowing you to
  configure Palette's installation parameters. Check out the
  [Install Enterprise Cluster](enterprise-version/install-palette/install-palette.md) documentation to learn more.

- The Palette PCG Docker installation method is deprecated and not available in this release. You can now install a PCG
  through the Palette CLI. The CLI provides an interactive installation experience allowing you to configure Palette's
  installation parameters. Check out the Palette CLI [PCG install command](automation/palette-cli/commands.md#pcg)
  documentation to learn more.

#### Known Issues {#release-4-0-palette-known-issues}

- With the deprecation of deploying Virtual Clusters directly into host clusters. The ability to specify an Add-on
  profile to a Palette Virtual Cluster is currently unavailable. This will be addressed in an upcoming release.

### Edge {#release-4-0-edge}

#### Features {#release-4-0-edge-features}

- Palette Edge now supports ARM64 architecture. This is a preview feature and still active in development. You can
  deploy Palette Edge on ARM64 architecture, such as Nvidia Jetson (Orin). Review the list of available
  [ARM64 packs](integrations/integrations.mdx) in Palette before deploying Palette Edge on ARM64 architecture.

- Palette Edge now supports the ability for you to configure OIDC Identity Providers (IDP) at the Kubernetes layer of a
  Cluster Profile. Refer to the Kubernetes distributions [pack documentation](integrations/integrations.mdx) to learn
  more.

#### Improvements {#release-4-0-edge-improvements}

- You can now assign dynamic tags to your edge hosts by specifying files or invoking a script that returns a JSON
  payload containing the tag values. This allows you to dynamically assign tags to your Edge hosts based on the host's
  local environment. Refer to the
  [Edge Installer Configuration Tags](clusters/edge/edge-configuration/installer-reference.md#tags) documentation to
  learn more.

- You can now skip the auto registration of Edge hosts in Palette. This allows you to manually register your Edge hosts
  in Palette by either using the QR code method or by providing the machine ID in Palette. Set the Edge Installer
  configuration parameter `disableAutoRegister` to `true` to turn off auto registration. Refer to the
  [Edge Installer Configuration](clusters/edge/edge-configuration/installer-reference.md) documentation to learn more.

- You can configure the node drainage behavior for your Edge hosts. To learn more about configuring node drainage, refer
  to the [Bring Your Own OS (BYOOS) pack](integrations/byoos.md#parameters) documentation.

#### Known Issues {#release-4-0-edge-known-issues}

- Palette eXtended Kubernetes - Edge (PXKE) and RKE2 cannot be upgraded from version 1.26.4 to 1.27.2 in an active
  cluster. Create a new cluster profile with the latest version of PXKE or RKE2 to upgrade to version 1.27.2. This will
  be addressed in an upcoming release.

### Palette Dev Engine (PDE) {#release-4-0-pde}

#### Features {#release-4-0-pde-features}

- A Visual Studio Code (VS Code) extension is now available for Palette Dev Engine (PDE). This extension allows you to
  deploy and manage virtual clusters directly from VS Code. To learn more, you can review the
  [Palette PDE Plugin](https://marketplace.visualstudio.com/items?itemName=SpectroCloud.extension-palette)
  documentation.

- The Palette CLI now supports managing App Profiles and Apps in Palette Dev Engine (PDE). You can now create, update,
  and delete App Profiles and Apps directly from the CLI. Use the `palette pde app-profile` and `palette pde app`
  commands to manage App Profiles and Apps. Refer to the [Palette CLI](automation/palette-cli/commands.md) documentation
  or use the `--help` flag to learn more.

### Virtual Machine Orchestrator (VMO) {#release-4-0-vmo}

#### Features {#release-4-0-vmo-features}

- Host clusters supporting Virtual Machine (VM) workloads can now be placed in host maintenance mode, with the ability
  to choose which Kubernetes node to place in maintenance mode. When a node is placed in maintenance mode, also known as
  “cordoned”, the VM workload is automatically migrated without any disruptions to another healthy node in the cluster.

- VMO supports the ability to import a VMware OVA template from VMware vSphere into Palette. This allows you to import a
  VM template from VMware vSphere into Palette and deploy it as a VM workload in a host cluster.

- You can now migrate a VM from VMware vSphere to a host cluster in Palette through the Palette CLI. The CLI provides an
  interactive migration experience allowing you to configure the VM migration parameters.

### VerteX {#release-4-0-vertex}

#### Features {#release-4-0-vertex-features}

- [Palette VerteX](https://www.spectrocloud.com/news/spectro-cloud-announces-palette-vertex-for-government) is now
  available and brings FIPS 140-2 cryptographic modules to the Palette management platform and deployed clusters.
  Palette VerteX is available to all government and private sector organizations that value strong data protection,
  backed by the Spectro Cloud Government practice, a growing ecosystem of specialist channel partners, and continental
  US technical support. Refer to the [Palette VerteX](vertex/vertex.md) documentation to learn more.

- You can install Palette VerteX in a VMware environment through the Palette CLI. The CLI provides an interactive
  installation experience allowing you to configure Palette VerteX's installation parameters. To learn more, refer to
  the Palette [VMware install instructions](vertex/install-palette-vertex/install-on-vmware/install.md) documentation.
  You can also install Palette VerteX in a FIPS-certified Kubernetes cluster. Check out the
  [Kubernetes install instructions](vertex/install-palette-vertex/install-on-kubernetes/install.md) for more details.

### Terraform {#release-4-0-terraform}

- Version 0.15.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Education {#release-4-0-education-features}

- A new Edge tutorial is available to learn how to deploy an Edge cluster using Palette with VMware. The
  [Deploy an Edge Cluster on VMware](clusters/edge/site-deployment/deploy-cluster.md) provides an end-to-end tutorial
  that walks you through creating Edge artifacts, creating a Cluster Profile, and deploying an Edge cluster on VMware.

- The documentation site for Palette now provides a chatbot capable of answering your questions about Palette. The
  chatbot is available in the bottom right corner of the documentation site. You can ask the chatbot questions about
  Palette, and it will provide you with relevant answers and documentation links.

### Packs {#release-4-0-packs}

#### Pack Notes {#release-4-0-packs-pack-notes}

- A new community pack repository is available. The Palette Community Repository allows partners and customers to
  contribute and share their packs. For more details, refer to the Palette Community Repository
  [README](https://github.com/spectrocloud/pack-central).

- The Spectro-VM-Dashboard pack is renamed to Virtual Machine Orchestrator.

- This release introduces the start of a formal maintance policy for packs. Several packs are now marked as deprecated,
  disabled, and deleted. A completed list of packs that are deprecated, disabled, and deleted is available in the
  [Deprecations and Removals](#release-4-0-packs-pack-deprecation-removals) section below. To learn more about the pack
  maintenance policy, refer to the [Maintenance Policy](integrations/maintenance-policy.md) documentation.

The following news packs are available in Palette 4.0.0.

<br />

#### Kubernetes {#release-4-0-packs-kubernetes}

| **Pack**                           | **New Version** |
| ---------------------------------- | --------------- |
| K3s                                | 1.27.2          |
| Kubernetes AKS                     | 1.27.0          |
| Kubernetes Coxedge                 | 1.25.10         |
| Kubernetes Coxedge                 | 1.26.5          |
| Kubernetes Coxedge                 | 1.27.2          |
| Kubernetes EKS                     | 1.27.0          |
| Kubernetes GKE                     | 1.24.14         |
| Kubernetes GKE                     | 1.25.10         |
| Kubernetes GKE                     | 1.26.5          |
| Kubernetes GKE                     | 1.27.2          |
| MicroK8s                           | 1.27.0          |
| Palette eXtended Kubernetes        | 1.24.14         |
| Palette eXtended Kubernetes        | 1.25.10         |
| Palette eXtended Kubernetes        | 1.26.5          |
| Palette eXtended Kubernetes        | 1.27.1          |
| Palette eXtended Kubernetes - Edge | 1.27.2          |
| RKE2                               | 1.24.6          |
| RKE2                               | 1.25.10         |
| RKE2                               | 1.26.3          |
| RKE2                               | 1.26.5          |
| RKE2                               | 1.27.2          |

#### CNI {#release-4-0-packs-cni}

| **Pack**    | **New Version** |
| ----------- | --------------- |
| AWS VPC CNI | 1.13.0          |
| AWS VPC CNI | 1.17.0          |
| Calico      | 3.25.1          |
| Calico      | 3.26.0          |
| Cilium OSS  | 1.14.0          |
| Flannel     | 0.22.0          |

#### CSI {#release-4-0-packs-csi}

| **Pack**       | **New Version** |
| -------------- | --------------- |
| AWS EBS CSI    | 1.17.0          |
| AWS EBS CSI    | 1.20.0          |
| AWS EFS CSI    | 1.5.06          |
| Azure Disk CSI | 1.26.3          |
| Longhorn CSI   | 1.4.1           |
| Portworx CSI   | 3.0.0           |
| Rook Ceph      | 1.11.9          |
| vSphere CSI    | 3.0.0           |
| vSphere CSI    | 3.0.2           |

#### Add-on Packs {#release-4-0-packs-add-on-packs}

| **Pack**                  | **New Version** |
| ------------------------- | --------------- |
| AWS ALB                   | 2.5.1           |
| AWS Cluster Autoscaler    | 1.26.3          |
| External Secrets Operator | 0.8.1           |
| Image Swap                | 1.5.2           |
| MetalLB                   | 0.13.10         |
| Nvidia GPU Operator       | 23.3.2          |
| Open Policy Agent         | 3.12.0          |
| Prometheus Grafana        | 46.4.0          |
| Vault                     | 0.25.0          |

#### Community Packs {#release-4-0-packs-community-packs}

| **Pack**                 | **New Version** |
| ------------------------ | --------------- |
| Ngrok Ingerss Controller | 0.9.0           |

#### FIPS Packs {#release-4-0-packs-fips-packs}

| **Pack**                                  | **New Version** |
| ----------------------------------------- | --------------- |
| AWS EBS CSI                               | 1.17.0          |
| AWS VPC CNI                               | 1.1.17          |
| Calico                                    | 3.25.1          |
| Calico                                    | 3.4.1           |
| Longhorn CSI                              | 1.4.1           |
| Palette eXtended Kubernetes               | 1.24.10         |
| Palette eXtended Kubernetes               | 1.24.13         |
| Palette eXtended Kubernetes               | 1.24.14         |
| Palette eXtended Kubernetes               | 1.25.6          |
| Palette eXtended Kubernetes               | 1.25.9          |
| Palette eXtended Kubernetes               | 1.25.10         |
| Palette eXtended Kubernetes               | 1.26.3          |
| Palette eXtended Kubernetes               | 1.26.4          |
| Palette eXtended Kubernetes               | 1.26.5          |
| Palette eXtended Kubernetes               | 1.27.1          |
| Palette eXtended Kubernetes               | 1.27.2          |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.24.13         |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.25.9          |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.26.4          |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.27.2          |
| RKE2                                      | 1.24.6          |
| RKE2                                      | 1.25.0          |
| RKE2                                      | 1.25.2          |
| RKE2                                      | 1.25.10         |
| RKE2                                      | 1.26.4          |
| RKE2                                      | 1.26.5          |
| RKE2                                      | 1.27.2          |
| vSphere CSI                               | 3.0             |

#### Deprecations and Removals {#release-4-0-packs-pack-deprecation-removals}

The following packs are marked as deprecated, disabled, or deleted. Refer to the
[Maintenance Policy](integrations/maintenance-policy.md) for more details on the deprecation and removal process.

<br />

#### Operating Systems

| **Pack**          | **Version** | **Status** |
| ----------------- | ----------- | ---------- |
| OpenSuse Leap     | 15.4        | Disabled   |
| Ubuntu (For Edge) | 20.04       | Disabled   |
| Ubuntu (For Edge) | 22.04       | Disabled   |

#### Kubernetes

| **Pack**                                  | **Version** | **Status** |
| ----------------------------------------- | ----------- | ---------- |
| MicroK8s                                  | 1.23        | Deprecated |
| Konvoy                                    | 1.19.10     | Deleted    |
| Konvoy                                    | 1.19.15     | Deleted    |
| Konvoy                                    | 1.20.8      | Deleted    |
| Konvoy                                    | 1.20.11     | Deleted    |
| Konvoy                                    | 1.21.6      | Deleted    |
| Kubernetes AKS                            | 1.22        | Deleted    |
| Kubernetes AKS                            | 1.23        | Deleted    |
| Kubernetes AKS                            | 1.24        | Deleted    |
| Kubernetes Coxedge                        | 1.21.14     | Deprecated |
| Kubernetes Coxedge                        | 1.22.12     | Deprecated |
| Kubernetes Coxedge                        | 1.23.9      | Deprecated |
| Kubernetes EKS                            | 1.17        | Deprecated |
| Kubernetes EKS                            | 1.18        | Deprecated |
| Kubernetes EKS                            | 1.18        | Deprecated |
| Kubernetes EKS                            | 1.19        | Deprecated |
| Kubernetes EKS                            | 1.20        | Deprecated |
| Kubernetes EKS                            | 1.21        | Deprecated |
| Kubernetes EKS                            | 1.22        | Deprecated |
| Kubernetes EKS                            | 1.23        | Deprecated |
| Kubernetes EKSD                           | 1.18.9      | Disabled   |
| Kubernetes EKSD                           | 1.19.6      | Disabled   |
| Kubernetes EKSD                           | 1.20.8      | Disabled   |
| Kubernetes EKSD                           | 1.21.6      | Disabled   |
| Kubernetes GKE                            | 1.24.10     | Deleted    |
| Kubernetes GKE                            | 1.25.7      | Deleted    |
| Kubernetes GKE                            | 1.26.4      | Deleted    |
| K3s                                       | 1.22.13     | Deprecated |
| K3s                                       | 1.22.15     | Deprecated |
| K3s                                       | 1.23.10     | Deprecated |
| K3s                                       | 1.23.12     | Deprecated |
| K3s                                       | 1.24.6      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.0      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.4      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.5      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.6      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.7      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.8      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.9      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.10     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.11     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.12     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.13     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.14     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.15     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.19.16     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.0      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.1      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.2      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.4      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.5      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.6      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.7      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.8      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.9      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.10     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.11     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.12     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.20.14     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.0      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.1      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.2      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.3      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.5      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.6      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.8      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.10     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.21.14     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.22.7      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.22.12     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.23.4      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.23.9      | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.23.16     | Deprecated |
| Palette eXtended Kubernetes (PXK)         | 1.23.17     | Deprecated |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.22.15     | Deprecated |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.23.12     | Deprecated |
| Palette eXtended Kubernetes - Edge (PXKE) | 1.24.6      | Deprecated |
| RKE2                                      | 1.22.12     | Disabled   |
| RKE2                                      | 1.22.13     | Deprecated |
| RKE2                                      | 1.22.15     | Deprecated |
| RKE2                                      | 1.23.9      | Disabled   |
| RKE2                                      | 1.23.10     | Deprecated |
| RKE2                                      | 1.23.12     | Deprecated |
| RKE2                                      | 1.24.6      | Deprecated |

#### CNI

| **Pack**    | **Version** | **Status** |
| ----------- | ----------- | ---------- |
| Calico      | 3.9         | Deprecated |
| Calico      | 3.10        | Deprecated |
| Calico      | 3.16        | Deprecated |
| Calico      | 3.19        | Deprecated |
| Calico      | 3.22        | Deprecated |
| Cilium OSS  | 1.10.9      | Deprecated |
| Cilium OSS  | 1.12.3      | Deprecated |
| Cilium OSS  | 1.12.4      | Deprecated |
| Flannel CNI | 0.10.0      | Deprecated |

#### CSI

| **Pack**                | **Version** | **Status** |
| ----------------------- | ----------- | ---------- |
| AWS EBS CSI             | 1.0.0       | Deprecated |
| AWS EBS CSI             | 1.5.1       | Deprecated |
| AWS EBS CSI             | 1.8.0       | Deprecated |
| AWS EBS CSI             | 1.10.0      | Deprecated |
| AWS EBS CSI             | 1.12.0      | Deprecated |
| AWS EFS CSI             | 1.3.6       | Deprecated |
| Azure CSI Driver        | 1.20.0      | Deprecated |
| Azure Disk              | 1.0.0       | Deprecated |
| GCE Persistent Disk CSI | 1.7.1       | Deprecated |
| GCE Persistent Disk     | 1.0.0       | Deprecated |
| Openstack Cinder        | 1.18        | Deprecated |
| Openstack Cinder        | 1.19        | Deprecated |
| Openstack Cinder        | 1.20        | Deprecated |
| Openstack Cinder        | 1.21        | Deprecated |
| Openstack Cinder        | 1.22        | Deprecated |
| Openstack Cinder        | 1.23        | Deprecated |
| Portworx CSI AWS        | 2.9.0       | Deprecated |
| Portworx CSI AWS        | 2.10        | Deprecated |
| Portworx CSI GCP        | 2.6.1       | Deprecated |
| Portworx CSI Generic    | 2.11.2      | Deprecated |
| Portworx CSI Generic    | 2.11.4      | Deprecated |
| Portworx CSI Vsphere    | 2.8.0       | Deprecated |
| Portworx CSI Vsphere    | 2.9.0       | Deprecated |
| Portworx CSI Vsphere    | 2.10        | Deprecated |
| Rook-Ceph CSI           | 1.5.9       | Deprecated |
| VSphere CSI             | 1.0.0       | Deprecated |
| VSphere CSI             | 2.3.0       | Deprecated |
| VSphere CSI             | 2.5.2       | Deprecated |
| VSphere Volume          | 1.0.0       | Deprecated |

#### Add-on

| **Pack**                  | **Version** | **Status** |
| ------------------------- | ----------- | ---------- |
| AWS Cluster Autoscaler    | 1.0.0       | Deprecated |
| AWS EFS Addon             | 1.3.6       | Deprecated |
| Dex                       | 2.21.0      | Deprecated |
| Dex                       | 2.25.0      | Deprecated |
| Dex                       | 2.28.0      | Deprecated |
| External DNS              | 0.7.2       | Deprecated |
| External Secrets          | 8.5.0       | Deprecated |
| External Secrets Operator | 0.5.6       | Deprecated |
| External Secrets Operator | 0.6.0       | Deprecated |
| Hashicorp Vault           | 0.3.1       | Deprecated |
| Hashicorp Vault           | 0.6.0       | Deprecated |
| Hashicorp Vault           | 0.9.0       | Deprecated |
| Hashicorp Vault           | 0.11.0      | Deprecated |
| Hashicorp Vault           | 0.17.1      | Deprecated |
| Hashicorp Vault           | 0.20.1      | Deprecated |
| Image Swap                | 1.4.2       | Deprecated |
| Istio                     | 1.6.2       | Deprecated |
| Kong                      | 1.4         | Deprecated |
| Kubernetes Dashboard      | 2.0.1       | Deprecated |
| Kubernetes Dashboard      | 2.1.0       | Deprecated |
| Kubernetes Dashboard      | 2.4.0       | Deprecated |
| Kubernetes Dashboard      | 2.5.1       | Deprecated |
| MetalLB                   | 0.8.3       | Deprecated |
| MetalLB                   | 0.9.5       | Deprecated |
| Nginx                     | 0.26.1      | Deprecated |
| Nginx                     | 0.43.0      | Deprecated |
| Nginx                     | 1.0.4       | Deprecated |
| Nginx                     | 1.2.1       | Deprecated |
| Nginx                     | 1.3.0       | Deprecated |
| Nvidia GPU Operator       | 1.9.1       | Deprecated |
| Open Policy Agent         | 3.5.1       | Deprecated |
| Open Policy Agent         | 3.6.0       | Deprecated |
| Palette Upgrader          | 3.0.51      | Deprecated |
| Palette Upgrader          | 3.0.70      | Deprecated |
| Palette Upgrader          | 3.0.95      | Deprecated |
| Palette Upgrader          | 3.1.26      | Deprecated |
| Portworx Generic Addon    | 2.11.2      | Deprecated |
| Portworx Generic Addon    | 2.11.4      | Deprecated |
| Prometheus Operator       | 12.3.0      | Deprecated |
| Prometheus Operator       | 19.2.3      | Deprecated |
| Prometheus Operator       | 30.0.3      | Deprecated |
| Prometheus Operator       | 30.2.0      | Deprecated |
| Prometheus Operator       | 35.5.1      | Deprecated |
| Prometheus Operator       | 37.2.0      | Deprecated |
| Reloader                  | 0.0.104     | Deprecated |
| Spectro Proxy             | 1.0.0       | Deprecated |
| Spectro Proxy             | 1.1.0       | Deprecated |
