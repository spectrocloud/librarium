---
sidebar_label: "Release Notes"
title: "Release Notes"
description: "Release notes for Palette and its sub-components."
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 3
sidebar_position: 0
sidebar_custom_props: 
  icon: "audits"
tags: ["release-notes"]
---


## December 9, 2023 - Release 4.2.0



### Palette


#### Breaking Changes



#### Features


- Palette now supports the cloud provider, [Nutanix](https://www.nutanix.com/). You can deploy Kubernetes clusters on Nutanix using Palette. Support for Nutanix is currently under technical preview and subject to change as we continue to improve the integration.


- Enhanced cluster repave control and mitigation. In the Palette 4.1 release, repave notification warnings become available through the User Console (UI). In this release, cluster administrators, project administrators, and tenant administrators must acknowledge the repave notification and decide whether to proceed with the action. This feature helps prevent accidental repaves and provides a way to mitigate repaves by allowing administrators to cancel the repave action.


- Palette CLI now supports intergation with [Validator](https://github.com/spectrocloud-labs/validator), an open-source framework that you can use to validate your environment. Validator performs Day 0-2 validation and configuration drift detection in a composable manner across a wide variety of systems. Use the `palette validator` command to verify your environment before installing a self-hosted instance of Palette or VerteX. Refer to the [Validator](./palette-cli/commands/validator.md) CLI reference for more information.


- Support for passkeys is now available for the self-hosted Palette admin user. You can now use passkeys to authenticate to the admin user account when accessing the system console. Refer to the [System Console Credentials](./enterprise-version/system-management/account-management/credentials.md) resource for more information.
#### Improvements


#### Improvements


- An improved differential editor is now available. The new editor provides a side-by-side comparison of the changes that will be applied to the cluster profile. The editor also identifies YAML customziations you have added and guides you through the process of carrying over the customization to the new version of the YAML. The ability to undo changes and accept all changes is also available.

- When updating a deployed cluster profile or updating an active cluster's profile, the new differantial editior is available to help you identify the changes that will be applied to the cluster profile.



### Edge

#### Breaking Changes

- Edge host names are not allowed to have special characters. Validation has been added to prevent issues that may arise from using special characters in host names. Edge host names must comply with RFC1035, refer to the [Edge Installer Configuration](./clusters/edge/edge-configuration/edge-configuration.md) and review the `name` parameter for more information.

#### Features

- Overlay support for DHCP. Edge hosts can now self-discover VxLAN overlay within a single ethernet brodcast domain. Clusters using this feature will remain operational in the scenario the host IP addresses changes unexpectedly. Check out the [Enable Overlay Network](clusters/edge/networking/vxlan-overlay.md) resource for more information.


- Local registry support. You can deploy a self-hosted [Harbor registry](https://goharbor.io) on your Edge cluster and use the registry to store images for your workloads and to initialize the other edge host nodes of a cluster. Using a local registry can help you reduce the amount of data that is transferred over the network, cache images locally, and provide a backup for when internet access is not available. 

- Kubernetes network interface management. You can now specify the network interface to use for your edge hosts versus versus relying on the default interface selected by Kubernetes. This feature is useful when you have multiple network interfaces on your edge hosts and you want to use a specific interface for your workloads, or if you are using the new overlay support for DHCP. 


#### Improvements

- New Edge clusters can now retrieve provider images from an authenticated registries. Previously, only public registries were supported for non-airgapped clusters, now you can use authenticated registries to store your provider images and retrieve them during cluster deployment. Refer to the [Deploy Cluster with a Private Registry](clusters/edge/site-deployment/deploy-private-registry.md) guide for more information.

- Extended [kube-vip customization](https://kube-vip.io/docs/installation/flags/) is now available for new Edge clusters. You can now specify additional kube-vip configuration paramters as part of the Kubernetes pack layer configuration. To learn more about the available kube-vip configuration parameters, refer to the [Publish Cluster Services with Kube-vip](clusters/edge/networking/kubevip.md) resource.


#### Known Issues



### Palette Dev Engine (PDE)

#### Features


#### Improvements

- The default deployed Kubernetes version for new virtual clusters is now v1.26.




### Virtual Machine Orchestrator (VMO)

#### Features

- You can deploy edge clusters when using VMO. Edge clusters are useful when you want to deploy Kubernetes clusters in remote locations.  



### VerteX


#### Features

- Azure Government Cloud support is now available for VerteX. You can now deploy Azure IaaS clusters on Azure Government accounts. The following Azure regions are available; US Gov Arizona, US Gov Texas, and US Gov Virginia. Refer to the [Supported Platforms](./vertex/supported-platforms.md) resource for more information.


- Canonical MAAS support is now available for VerteX. You can now deploy Canonical MAAS clusters with VerteX. Refer to the [MAAS](./clusters/data-center/maas/maas.md) resource for more information on how to deploy MAAS clusters.


- Support for passkeys is now available for the admin user. You can now use passkeys to authenticate to the admin user account when accessing the system console. Refer to the [System Console Credentials](vertex/system-management/account-management/credentials.md) resource for more information.
#### Improvements

- You can now access Palette documentation offline by using the Palette documenation container. Refer to the [Offline Documentation](./vertex/install-palette-vertex/airgap/offline-docs.md) page for more information.

### Terraform

- Version 0.17.1 of the [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is available. For more details, refer to the Terraform provider [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Breaking Changes

- The parameter `cluster_context` is now a required attribute for the resource `spectrocloud_application`.

- The resource `spectrocloud_cluster_edge_native` is deprecating the following arguments; `ssh_key`, and `host_uids`.

### Docs and Education


### Packs



#### Kubernetes

| **Pack**| **New Version**|
| :--- | :--- |




#### CNI

| **Pack**| **New Version**|
| :--- | :--- |


#### CSI

| **Pack**| **New Version**|
| :--- | :--- |


#### Add-on Packs

| **Pack**| **New Version**|
| :--- | :--- |



#### FIPS Packs

| **Pack**| **New Version**|
| :--- | :--- |



#### Community Packs

| **Pack**| **New Version**|
| :--- | :--- |




#### Pack Notes


#### Deprecations and Removals

- For a list of deprecated packs, check out the [Deprecated Packs](integrations/deprecated-packs.md) page.
