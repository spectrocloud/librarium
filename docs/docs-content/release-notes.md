---
sidebar_label: "Release Notes"
title: "Release Notes"
description: "Spectro Cloud release notes for Palette and its sub-components."
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 3
sidebar_position: 0
sidebar_custom_props: 
  icon: "audits"
tags: ["release-notes"]
---

## November 7, 2023 - Release 4.1.9

This release contains the following minor bug fixes related to protected Helm Chart and Open Container Initiative (OCI) registries.

### Bug Fixes
- An issue where Palette was displaying the UID of protected Helm Chart and Open Container Initiative (OCI) registries instead of the expected registry name is now corrected.

- The issue is fixed where Palette did not allow Helm charts from private or protected Helm Chart and OCI registries to be attached to cluster profiles. 

- The issue is resolved where Palette did not display packs for selection that belonged to a protected Helm Chart registry, preventing cluster profile creation. 



## October 22, 2023 - Release 4.1.0

Palette 4.1.0 introduces several new features and enhancements to the platform. New features, such as static IP address for Edge hosts and node repavement warnings, are designed to continue to help you manage Kubernetes clusters with confidence. The new built-in notification system for our SaaS platform is another addition designed to help you stay up-to-date with announcements and changes by bringing the news directly to you. 

Check out the following sections to learn about all the new features and improvements introduced in this release.

### Palette

#### Breaking Changes

- API key values are no longer displayed in Palette. Palette will continue supporting existing API keys but not reveal the key value. Moving forward, Palette will not store the API key value in the database but instead retain metadata about the key. Ensure you store the API key value in a secure location after its creation, as the value will not be retrievable from Palette. To learn more about API keys, refer to the [API Key](user-management//authentication/api-key/api-key.md) documentation.

#### Features


- Support for encrypting the root volume of EKS host clusters is now available. You can enable this feature when creating a host cluster. 


- MAAS clusters can now be assigned tags so Palette can deploy nodes onto the MAAS machines matching the provided tags. Refer to the [Create and Manage MAAS Clusters](clusters/data-center/maas/create-manage-maas-clusters.md) to learn more about deploying MAAS clusters.


- Self-hosted Palette installations, and Private Cloud Gateway (PCG), now support the ability to control the node affinity for the internal Palette components. You can configure the Palette Enterprise, or PCG cluster to deploy all internal component pods on control plane nodes. This is an option you enable during the install. 


- Palette, in a multi-SaaS environment, has been updated with a new feature that allows you and your team to receive platform notifications. This feature will keep you informed of any upcoming changes, news, or releases related to Palette. Additionally, you can now access product information and more through the new widget located in the bottom right corner of the Palette user interface. 


- The enhanced pack experience introduced in Palette 4.0.0 for add-on packs is now available to all packs.


- When creating an AWS EKS cluster, you can now configure the public and private CIDR ranges allowed to communicate to the cluster's Kubernetes API servers. In the past users could only configure the public CIDR range.


- Palette now displays a warning message when you are about to trigger an action from the UI that will cause nodes to repave. Use these warnings to avoid triggering a node repave when it is not desired.


- You can now configure auto upgrade channels for Azure AKS clusters. Refer to the [Azure Architecture](./clusters//public-cloud/azure/architecture.md#upgrade-channels) documentation for more information.


#### Deprecations and Removals

- The support widget previously used in Palette SaaS environments to create support tickets has been replaced with a new and improved widget. Use the new widget to create support tickets, access the Palette documentation, and more. 

#### Known Issues

- When conducting [OS Patching](./clusters/cluster-management/os-patching.md), sometimes the patching process can time out and fail. This issue is due to some OS patches requiring GRUB packages. GRUB updates often require user prompts, and if a user prompt is required during the OS patching process, the patching process will fail. Refer to the [Nodes and Clusters](./troubleshooting/nodes.md#os-patch-fails) for guidance on resolving this issue.


### Edge

#### Features

- Edge hosts can now be configured with static IP addresses when added to an Edge cluster. You can configure the default gateway, DNS servers, IP address, and the subnet mask for the host.


#### Improvements

- Palette now supports [etcd](https://etcd.io/) backup snapshots of each etcd member in the host cluster. You can use these snapshots to recover a host cluster.


#### Known Issues

- Single node Edge clusters using RKE2 versions 1.24.6, 1.25.2,1.26.4, and 1.27.2 are experiencing issues during reboots and upgrades. Use instead RKE2 versions 1.25.13, 1.26.8, and 1.27.5 when creating single node Edge clusters. These issues are absent in multi-node Edge clusters.

### Palette Dev Engine (PDE)

#### Features

- You can now select a different Kubernetes distribution when creating a cluster group. The two supported distributions are [Kubernetes](https://kubernetes.io/) and [K3s](https://k3s.io/). To learn more about cluster groups, refer to the [Cluster Groups](./clusters/cluster-groups/cluster-groups.md) documentation.


- Cluster groups can now be configured with default add-on profiles. All virtual clusters deployed in the cluster group will automatically install the add-on profiles. These add-on profiles defined at the cluster group allow administrators to enforce a set of add-on profiles to act as a base for all virtual clusters. To learn more about cluster groups, refer to the [Cluster Groups](./clusters/cluster-groups/cluster-groups.md) documentation.



### Virtual Machine Orchestrator (VMO)

#### Improvements

- The default VMO virtual machine templates contain several new enhancements that help improve the virtual machine lifecycle and availability.

- The VMO pack now contains all the required dependencies for Kubevirt. In the past, you had to install the dependencies manually.

### VerteX


#### Features

- Palette VerteX now supports the deployment of Azure IaaS clusters. Refer to the [Supported Platforms](./vertex/supported-platforms.md) documentation information about the supported platforms.

- Palette VerteX installations now support the ability to control the node affinity for the Palette components. You can configure the Palette Enterprise cluster to deploy all internal component pods on control plane nodes. To learn more about this feature, refer to the [VerteX](vertex/install-palette-vertex/install-palette-vertex.md) documentation.


#### Improvements

- The use of non-FIPS compliant packs is now supported. Prior versions of VerteX allowed non-FIPS packs for add-on packs. This change now allows non-FIPS packs for all packs. Check out the [Use non-FIPS Packs](./vertex/system-management/enable-non-fips-settings/enable-non-fips-settings.md)


### Terraform

- Version 0.16.0 of the [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is available. For more details, refer to the Terraform provider [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).


### Docs and Education

- The Palette documentation website has undergone a significant upgrade, improving content navigation and search experiences and adding new documentation features that enhance the reader experience.  

- Content versioning is now supported. You can now view the documentation for a specific version of Palette.

### Packs



#### Kubernetes

| **Pack**| **New Version**|
| :--- | :--- |
| Edge RKE2 | 1.27.5 |
| Edge RKE2 | 1.26.2 |
| Edge RKE2 | 1.25.13|
| K3S| 1.27.5|
| K3S| 1.26.8|
| K3S| 1.25.13|
| Kubernetes GKE| 1.27.5 |
| Kubernetes GKE| 1.26.8 |
| Kubernetes GKE| 1.25.13 |
| Palette eXtended Kubernetes (PXK)| 1.28.2 |
| Palette eXtended Kubernetes (PXK)| 1.27.5 |
| Palette eXtended Kubernetes (PXK)| 1.26.8 |
| Palette eXtended Kubernetes (PXK)| 1.25.13 |
| Palette eXtended Kubernetes - Edge (PXK-E)| 1.27.5 |
| Palette eXtended Kubernetes - Edge (PXK-E)| 1.26.8 |
| Palette eXtended Kubernetes - Edge (PXK-E)| 1.25.13|
| RKE2| 1.26.2 |
| RKE2| 1.25.10 |



#### CNI

| **Pack**| **New Version**|
| :--- | :--- |
| AWS VPC CNI EKS | 1.15.0|
| Calico| 3.26.1 |


#### CSI

| **Pack**| **New Version**|
| :--- | :--- |
| AWS EBS CSI | 1.22.0|
| Azure CSI Driver| 1.28.3|
| Longhorn CSI | 1.5.1 |
| RookCeph CSI | 1.11.9 |

#### Add-on Packs

| **Pack**| **New Version**|
| :--- | :--- |
| AWS ALB | 2.6.0 |
| Calico Network Policy | 3.26.1 |
| Cilium Tetragon | 0.10.0 |
| External DNS | 0.13.5 |
| External Secrets Operator | 0.9.4|
| Kong Ingress | 2.26.5 |
| Nginx Ingress | 1.8.1 |
| Reloader| 1.0.40|


#### FIPS Packs

| **Pack**| **New Version**|
| :--- | :--- |
| Cilium CNI OSS | 1.13.4 |


#### Community Packs

| **Pack**| **New Version**|
| :--- | :--- |
| AppDynamics Collector | 1.14.714 |
| AppDynamics Collector | 1.14.168 |
| AppDynamics Collector | 1.13.684 |




#### Pack Notes

- ngrok published a documentation page where you can learn more about their ingress pack and how to use it. You can review their contribution by visiting the [ngrok](integrations/ngrok.md) documentation page.

#### Deprecations and Removals

- For a list of deprecated packs, check out the [Deprecated Packs](integrations/deprecated-packs.md) page.