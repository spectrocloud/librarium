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

## February 21, 2025 - Documentation & Education Updates

- The Documentation & Education team is enabling a new Q&A bot functionality on the Spectro Cloud official documentation
  site. Click the **Ask AI** widget in the bottom right corner or use the **CTRL + I** (**CMD + I** on macOS) keyboard
  shortcut to bring up the chat interface.

  The Q&A bot is only trained on the latest version of the Spectro Cloud documentation. It is unable to answer
  version-specific questions. As with all generative AI-powered services, its responses may not be accurate. Always
  verify answers using the documentation for important updates.

## Feb 26, 2024 - Release 4.2.13

### Bug Fixes

- Fixed an issue where AWS VPC CNI would not work with Kubernetes 1.28 when using AWS EKS.

- Fixed an issue with the Kubernetes Dashboard cookies and internal Palette ingress configuration that caused the
  Kubernetes Dashboard to fail to load.

- Fixed an issue with MicroK8s failing to launch pods due to a mismatch in node affinity labels.

- Resolved an issue with MAAS clusters failing to deploy when the default image endpoint is not set in an airgap
  environment

- Resolved the remaining MAAS node upgrade issues 4.2.12 did not address.

## Feb 16, 2024 - Release 4.2.12

### Bug Fix - IaaS Cluster Repaves Causing Cluster Downtime

#### Affected services

IaaS clusters in Palette 4.2.x prior to 4.2.12, including Palette SaaS, self-hosted Palette/VerteX, as well as dedicated
instances. Affected cluster types include the following:

- AWS IaaS (not EKS)
- Azure IaaS (not AKS)
- Google IaaS (not GKE)
- MAAS
- vSphere
- OpenStack

Managed Kubernetes clusters on EKS, GKE and AKS are not affected. Edge clusters are not affected.

#### Issue Summary

We identified an issue related to cluster repaves in Palette 4.2.x. During a cluster upgrade that required a repave, the
Palette Agent deployed within the clusters would delete all the worker nodes within a worker pool before provisioning
new worker nodes. This results in the worker pool being down during an upgrade. All workloads within the pool will be
offline during the upgrade.

If the cluster is configured to enable updating worker pools in parallel, then this can result in all services on the
cluster becoming unavailable.

#### Customer Guidance

This issue has been addressed in Palette 4.2.12 and its corresponding Palette Agent version 4.2.4. Use the following
steps to identify whether your cluster uses an affected agent version.

1. Log in to [Palette](https://console.spectrocloud.com/).
2. From the left **Main Menu**, click on **Clusters**. Select your cluster to access the cluster details page.
3. At the bottom of the cluster details page, the Palette agent version used by your cluster is displayed. If your Agent
   version is any of the following versions, your cluster is still susceptible to this issue: 4.2.0, 4.2.1, 4.2.2,
   4.2.3.

:::warning

Ensure that you do not initiate any cluster repaves as long as you are using an affected agent version. Changes in the
OS or the Kubernetes layer would initiate an cluster repave attempt. When you get the cluster repave notification,
reject the repave.

:::

**If you are not using an affected agent version**, no action is required on your part. If you plan to upgrade to 4.2.x
in the future, ensure you upgrade to a version of Palette that's 4.2.12 or later.

**If you are using an affected agent version**, first make sure that your Palette instance version is 4.2.12 or newer.
Once you have confirmed your Palette version, unpause Agent upgrades for your cluster if they are paused. To learn how
to toggle agent upgrades, refer to
[Pause Platform Upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md). In 5 - 10
minutes, the Palette agent will upgrade to a new version that includes the bug fix. If the agent does not upgrade for an
extended period of time, contact support@spectrocloud.com.

## February 3, 2024 - Release 4.2.9

### Bug Fixes

- Fixed an issue that caused errors when creating pods after certificate renewals.
- Resolved image pull errors from the AWS ECR registry.

## January 25, 2024 - Release 4.2.7

### Bug Fixes

- Fixed an issue that caused MinIO S3 URL setting to be missing in backup location settings.
- Fixed an issue that prohibited updating Helm packs in cluster profiles.
- Fixed an issue that caused certain OCI registries created before the Palette 4.2 upgrade to be unlisted.
- Fixed an issue that caused HTTP 400 errors when visiting the Kubernetes Dashboard. The issue was caused by an internal
  cookie size limit that was insufficient for the Kubernetes Dashboard.

## January 9, 2024 - Release 4.2.4

### Bug Fixes

- An invalid toggle User Interface option that appeared in the Edge cluster creation process when defining node groups
  has been removed.

## January 6, 2024 - Release 4.2.0

Palette 4.2.0 is a release that includes new features and various improvements. New features include support for Nutanix
clusters, automatic SSL certificate renewal, and enhanced cluster repave control and mitigation. Improvements include
support for MicroK8S on MAAS clusters, several network enhancements for Edge deployments, a new differential editor that
helps you identify cluster profile changes, and support for a local image registry for Edge clusters. Check out the
notes below to learn more about the new features and improvements.

### Palette

#### Features

- Palette now supports the cloud provider, [Nutanix](https://www.nutanix.com/), as a Technical Preview feature. You can
  deploy Kubernetes clusters on Nutanix using Palette. Technical Preview features are subject to change as we continue
  to improve the integration. Refer to the [Nutanix](../clusters/data-center/nutanix/nutanix.md) resource to learn more
  about deploying Nutanix clusters with Palette.

- Automatic SSL certificate renewal is now supported for clusters deployed through Palette. In the past, this was a
  manual action that had to be performed by the user, which also caused node repaves. Palette will now automatically
  renew the certificate 30 days before the expiration date without triggering a node repave. This feature is available
  in all supported infrastructure providers except for Edge. For more information, refer to the
  [Certificate Management](../clusters/cluster-management/certificate-management.md) resource.

- Enhanced cluster repave control and mitigation. In the Palette 4.1 release, repave notification warnings become
  available through the User Console (UI). In this release, cluster administrators, project administrators, and tenant
  administrators must acknowledge the repave notification and decide whether to proceed with the action. This feature
  helps prevent accidental node upgrades that may cause downtime and provides a way to mitigate repaves by allowing
  administrators to cancel the action that will trigger a repave.

- A Pack's README file is displayed during the cluster profile creation and editing process. You can find additional
  information about a pack in the [Packs List](../integrations/integrations.mdx) page.

- Palette CLI now supports integration with [Validator](https://github.com/spectrocloud-labs/validator), an open source
  framework that you can use to validate your self-hosted Palette, VerteX, or workload cluster environment. Validator
  performs Day 0-2 validation and configuration drift detection in a composable manner across various systems. Use the
  `palette validator` command to verify your environment before installing a self-hosted instance of Palette or VerteX.
  You can also use Validator to verify the environment requirements for deploying a cluster. For more information, refer
  to the [Validator](../automation/palette-cli/commands/validator.md) CLI reference.

- Support for passkeys is now available for the self-hosted Palette admin user. When accessing the system console, you
  can now use passkeys to authenticate to the admin user account. For more information, refer to the
  [System Console Credentials](../enterprise-version/system-management/account-management/credentials.md) resource.

- You can start a local Palette documentation server by using the Palette CLI's `docs` command. This feature is useful
  when you want to access Palette documentation offline. For more information, refer to the
  [Docs](../automation/palette-cli/commands/docs.md) command page.

#### Improvements

- MicroK8S is now available for MAAS clusters. Create a cluster profile with MicroK8S as the Kubernetes pack to deploy a
  MAAS cluster with MicroK8S.

- An improved differential editor is now available. The new editor provides a side-by-side comparison of the changes
  that will be applied to the cluster profile. The editor also identifies the YAML customizations you have added and
  guides you through carrying over the customizations to the new version of the YAML. The ability to undo changes and
  accept all changes is also available.

- When updating a deployed cluster profile or an active cluster's profile, the new differential editor is available to
  help you identify the changes that will be applied to the cluster profile.

- Private Cloud Gateway (PCG) deployments now use Kubernetes version 1.26. Previously, the default Kubernetes version
  was 1.24. Use the latest version of the [Palette CLI](../spectro-downloads.md#palette-cli) to install PCG clusters.
  Existing Private Cloud Gateway deployments will require a manual reconciliation of the cluster profile to update the
  Kubernetes version to 1.26. Make sure you carry over any customizations the current cluster profile may have, such as
  pod CIDR and service CIDR before updating the cluster profile with the new Kubernetes version. Refer to the
  [Update a Cluster Profile](../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#update-the-pack-version)
  guide to learn more on reconciling a cluster profile pack layer change.

#### Known Issues

- The ability to change the underlying node type of a node pool is not available for Google Cloud Platform GKE clusters.

- Clusters launched in VMware vSphere with the Container Network Interface (CNI) Cilium, lose node-to-node connectivity
  when the vSphere adapter is configured to use VMXNET3. This is a known issue with Cilium and VMXNET3. Refer to the
  [GitHub issue discussion](https://github.com/cilium/cilium/issues/21801) to learn more about this issue.

- Enabling [passkeys](../enterprise-version/system-management/account-management/credentials.md) in a self-hosted
  Palette instance will cause JSON Web Tokens (JWT) returned by the system API endpoint `/v1/auth/syslogin` to be
  invalid. Refer to the
  [Passkeys and API Access](../enterprise-version/system-management/account-management/credentials.md#passkeys-and-api-access)
  resource for more information on accessing the system API when passkeys are enabled. This issue does not affect the
  regular Palette API used by clusters and users.

### Edge

#### Breaking Changes

- Edge hostnames are not allowed to have special characters. Validation has been added to prevent issues arising from
  using special characters in host names. Edge hostnames must comply with
  [RFC1035](https://datatracker.ietf.org/doc/html/rfc1035), refer to the
  [Edge Installer Configuration](../clusters/edge/edge-configuration/edge-configuration.md) and review the `name`
  parameter for more information.

#### Features

- Overlay support for DHCP is now available as a Tech Preview feature. Edge clusters can now establish an VxLAN overlay
  network during cluster creation, and Edge hosts can self-discover the overlay network within a single ethernet
  broadcast domain. Clusters using this feature will remain operational when the host IP addresses change unexpectedly.
  Check out the [Enable Overlay Network](../clusters/edge/networking/vxlan-overlay.md) resource for more information.

- Local registry support. You can deploy a self-hosted [Harbor registry](https://goharbor.io) on your Edge cluster and
  use the registry to store images for your workloads and initialize a cluster's other edge host nodes. Using a local
  registry can help you reduce the amount of data transferred over the network, cache images locally, and provide a
  backup for when internet access is unavailable.

- Edge Kubernetes network interface management support. You can now specify the network interface for your edge hosts
  versus relying on the default interface selected by Kubernetes. This feature is useful when you have multiple network
  interfaces on your edge hosts and want to use a specific interface for your workloads or if you are using the new
  overlay support for DHCP. Check out the
  [Create Cluster Definition](../clusters/edge/site-deployment/site-installation/cluster-deployment.md) resource for
  more information on how to specify the network interface for your edge hosts during cluster deployment.

#### Improvements

- New Edge clusters can now retrieve provider images from authenticated registries. Previously, only public registries
  were supported for non-airgapped clusters. Now, you can use authenticated registries to store your provider images and
  retrieve them during cluster deployment. For more information, refer to the
  [Deploy Cluster with a Private Registry](../clusters/edge/site-deployment/deploy-private-registry.md) guide.

- Extended [kube-vip customization](https://kube-vip.io/docs/installation/flags/) is now available for new Edge
  clusters. You can now specify additional kube-vip configuration parameters as part of the Kubernetes pack layer
  configuration. To learn more about the available kube-vip configuration parameters, refer to the
  [Publish Cluster Services with Kube-vip](../clusters/edge/networking/kubevip.md) resource.

#### Known Issues

- The following known issues apply to the VxLAN network overlay feature:

  - When adding multiple nodes to an existing cluster with overlay enabled, failure to add one node will block the
    addition of the other nodes.

  - When deleting an Edge host from a cluster with overlay enabled, ensure the node doesn't have the `palette-webhook`
    pod on it, or the node will be stuck in the deleting state. You can use the command
    `kubectl get pods --all-namespaces --output wide` to identify which node the pod `palette-webhook` is on. Reach out
    to our support team [support@spectrocloud.com](mailto:support@spectrocloud.com) if you need to remove a node with
    the `palette-webhook` pod on it.

<!-- prettier-ignore -->
- In a multi-node cluster with <VersionedLink text="PXK-E" url="/integrations/packs/?pack=edge-k8s" /> as the Kubernetes distribution, you cannot change the Network Interface Card (NIC). When you add an Edge host to such a cluster, leave the NIC field as its
  default value.

<!-- prettier-ignore -->
- The following known issues apply to <VersionedLink text="Harbor Edge Native Config" url="/integrations/packs/?pack=harbor-edge-native-config" /> when deployed with the
  <VersionedLink text="Longhorn" url="/integrations/packs/?pack=csi-longhorn" /> Container Storage Interface (CSI) driver:

  - The Harbor job service pod is in a _Terminating_ and _ContainerCreating_ state in an Edge Native High Availability
    (HA) cluster after a Day-2 operation.

  - The Harbor database pod might fail to start due to file permission issues. This is a
    [known issue](https://github.com/goharbor/harbor-helm/issues/1676) in the Harbor GitHub repository.

  - A cluster may get stuck in the provisioning state. If this happens, remove the cluster and try again.

### Palette Dev Engine (PDE)

#### Improvements

- The default deployed Kubernetes version for new virtual clusters is now v1.26.

### Virtual Machine Orchestrator (VMO)

#### Features

- You can now deploy virtual machines using VMO on an Edge cluster. Edge clusters are useful when deploying Kubernetes
  clusters in remote locations. Refer to the [Create a VMO Profile](../vm-management/create-vmo-profile.md) to learn how
  to create an Edge cluster profile for VMO.

### VerteX

#### Features

- Azure Government Cloud support is now available for VerteX. You can now deploy Azure IaaS clusters on Azure Government
  accounts. The following Azure regions are available: US Gov Arizona, US Gov Texas, and US Gov Virginia. For more
  information, refer to the [Supported Platforms](../vertex/supported-platforms.md) resource.

- Canonical MAAS support is now available for VerteX. You can now deploy Canonical MAAS clusters with VerteX. Refer to
  the [MAAS](../clusters/data-center/maas/maas.md) resource for more information on deploying MAAS clusters.

- Support for passkeys is now available for the admin user. When accessing the system console, you can now use passkeys
  to authenticate the admin user account. For more information, refer to the
  [System Console Credentials](../vertex/system-management/account-management/credentials.md) resource.

#### Improvements

- To better support airgap installs and customers in internet-restricted environments. You can now access Palette
  documentation offline by using the Palette documentation container. For more information, refer to the
  [Offline Documentation](../vertex/install-palette-vertex/airgap/offline-docs.md) page.

#### Known Issues

- Enabling [passkeys](../vertex/system-management/account-management/credentials.md#add-passkeys) in a VerteX instance
  will cause JSON Web Tokens (JWT) returned by the system API endpoint `/v1/auth/syslogin` to be invalid. Refer to the
  [Passkeys and API Access](../vertex/system-management/account-management/credentials.md#passkeys-and-api-access)
  resource for more information on accessing the system API when passkeys are enabled. This issue does not affect the
  regular VerteX API used by clusters and users.

### Terraform

#### Breaking Changes

- The parameter `cluster_context` is now a required attribute for the resource `spectrocloud_application`.

- The resource `spectrocloud_cluster_edge_native` is deprecating the following arguments; `ssh_key`, and `host_uids`.

#### Features

- Version 0.17.2 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- The [Deploy a Custom Pack](../tutorials/packs-registries/deploy-pack.md) tutorial has been updated to include
  instructions on deploying a custom pack with a custom OCI Pack registry.

- The Palette Offline Documentation container image is now cryptographically signed. You can verify the authenticity of
  the container image by using the [Cosign CLI](https://docs.sigstore.dev/signing/quickstart) and the public key. Refer
  to the [Offline Documentation](../vertex/install-palette-vertex/airgap/offline-docs.md#container-image-authenticity)
  page for more information.

### Packs

#### Kubernetes

| **Pack**                           | **New Version** |
| :--------------------------------- | :-------------- |
| Kubernetes Azure AKS               | 1.28.2          |
| Kubernetes Amazon EKS              | 1.28.2          |
| Kubernetes Cox Edge                | 1.28.2          |
| Kubernetes Cox Edge                | 1.27.6          |
| Kubernetes Cox Edge                | 1.26.9          |
| Kubernetes Cox Edge                | 1.25.14         |
| Kubernetes Google GKE              | 1.27.6          |
| Kubernetes Google GKE              | 1.26.9          |
| Kubernetes Google GKE              | 1.25.14         |
| K3s                                | 1.28.2          |
| K3s                                | 1.27.7          |
| K3s                                | 1.26.10         |
| K3s                                | 1.25.15         |
| Palette eXtended Kubernetes - Edge | 1.28.2          |
| Palette eXtended Kubernetes - Edge | 1.27.7          |
| Palette eXtended Kubernetes - Edge | 1.26.10         |
| Palette eXtended Kubernetes - Edge | 1.25.15         |
| Palette eXtended Kubernetes        | 1.28.3          |
| Palette eXtended Kubernetes        | 1.27.7          |
| Palette eXtended Kubernetes        | 1.26.10         |
| Palette eXtended Kubernetes        | 1.25.15         |
| RKE2                               | 1.28.2          |
| RKE2                               | 1.27.8          |
| RKE2                               | 1.26.11         |
| RKE2 - Edge                        | 1.28.4          |
| RKE2 - Edge                        | 1.27.7          |
| RKE2 - Edge                        | 1.26.10         |
| RKE2 - Edge                        | 1.25.15         |

#### CNI

| **Pack**    | **New Version** |
| :---------- | :-------------- |
| AWS VPC CNI | 1.15.1          |
| Calico CNI  | 3.26.3          |
| Ciliium OSS | 1.14.3          |
| Flannel CNI | 0.23.0          |

#### CSI

| **Pack**              | **New Version** |
| :-------------------- | :-------------- |
| Azure Disk CSI Driver | 1.29.1          |
| AWS EBS CSI           | 1.24.0          |
| Longhorn CSI          | 1.5.3           |
| Nutanix CSI           | 2.6.6           |
| Portworx CSI          | 3.0.4           |
| Rook Ceph CSI         | 1.12.7          |

#### Add-on Packs

| **Pack**                  | **New Version** |
| :------------------------ | :-------------- |
| External Secrets Operator | 0.9.7           |
| Flux2                     | 2.10.2          |
| Harbor Edge Native Config | 1.0.0           |
| Istio                     | 1.17.2          |
| Kong Ingress              | 2.32.0          |
| MetalLB                   | 0.13.11         |
| Nginx Ingress             | 1.9.4           |
| Nvidia GPU Operator       | 23.9.1          |
| Open Policy Agent         | 3.13.2          |
| Prometheus Operator       | 51.0.3          |
| Reloader                  | 1.0.43          |
| Imageswap                 | 1.5.3           |

#### FIPS Packs

| **Pack**                           | **New Version** |
| :--------------------------------- | :-------------- |
| Azure CSI Driver                   | 1.28.3          |
| Palette eXtended Kubernetes        | 1.28.3          |
| Palette eXtended Kubernetes        | 1.27.7          |
| Palette eXtended Kubernetes        | 1.26.10         |
| Palette eXtended Kubernetes        | 1.25.15         |
| Palette eXtended Kubernetes - Edge | 1.27.2          |
| Palette eXtended Kubernetes - Edge | 1.26.4          |
| Palette eXtended Kubernetes - Edge | 1.25.9          |
| RKE2                               | 1.28.6          |
| RKE2                               | 1.27.8          |
| RKE2                               | 1.26.11         |
| RKE2 - Edge                        | 1.27.2          |
| RKE2 - Edge                        | 1.26.4          |
| RKE2 - Edge                        | 1.25.2          |

#### Pack Notes

- A Pack's README file is displayed during the cluster profile creation and editing process. You can find additional
  information about a pack in the [Packs List](../integrations/integrations.mdx) page.
- ArgoCD is now a verified pack, starting with version 5.46.8.
- Spot.io is now a verified pack, starting with version 1.0.117.
- Edge cluster nodes deployed in a single node configuration using RKE2 version 1.26.X must upgrade to the latest minor
  version of 1.26.10 before upgrading to 1.27.7.
- The prior issue related to Edge clusters deployed in a single node configuration using RKE2 version 1.26.X has been
  resolved starting with version 1.26.10.

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of deprecated packs.
