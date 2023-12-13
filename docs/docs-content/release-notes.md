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



## December 16, 2023 - Release 4.2.0

Palette 4.2.0 is a release that includes new features and various improvements. New features include support for Nutanix clusters, automatic SSL certificate renewal, and enhanced cluster repave control and mitigation. Improvements include support for MicroK8S on MAAS clusters, several network enhancements for Edge deployments, a new differential editor that helps you identify cluster profile changes, and support for a local image registry for Edge clusters. Check out the notes below to learn more about the new features and improvements.


### Palette


#### Features


- Palette now supports the cloud provider, [Nutanix](https://www.nutanix.com/). You can deploy Kubernetes clusters on Nutanix using Palette. Support for Nutanix is currently under technical preview and subject to change as we continue to improve the integration.


- Automatic SSL certificate renewal is now supported for clusters deployed through Palette. In the past, this was a manual action that had to be performed by the user, which also caused node repaves. Palette will automatically renew the certificate 30 days before the expiration date without triggering a node repave. This feature is available in all supported infrastructure providers except for Edge and Cox Edge. For more information, refer to the [Certificate Management](./clusters/cluster-management/certificate-management.md) resource.


- Enhanced cluster repave control and mitigation. In the Palette 4.1 release, repave notification warnings become available through the User Console (UI). In this release, cluster administrators, project administrators, and tenant administrators must acknowledge the repave notification and decide whether to proceed with the action. This feature helps prevent accidental repaves and provides a way to mitigate repaves by allowing administrators to cancel the repave action.


- Palette CLI now supports integration with [Validator](https://github.com/spectrocloud-labs/validator), an open-source framework that you can use to validate your environment. Validator performs Day 0-2 validation and configuration drift detection in a composable manner across various systems. Use the `palette validator` command to verify your environment before installing a self-hosted instance of Palette or VerteX. For more information, refer to the [Validator](./palette-cli/commands/validator.md) CLI reference.


- Support for passkeys is now available for the self-hosted Palette admin user. When accessing the system console, you can now use passkeys to authenticate to the admin user account. For more information, refer to the [System Console Credentials](./enterprise-version/system-management/account-management/credentials.md) resource.


- You can start a local Palette documentation server by using the Palette CLI's `docs` command. This feature is useful when you want to access Palette documentation offline. For more information, refer to the [Docs](./palette-cli/commands/docs.md) command page.

#### Improvements

- MicroK8S is now available for MAAS clusters. Create a cluster profile with MicroK8S as the Kubernetes pack to deploy a MAAS cluster with MicroK8S. 

- An improved differential editor is now available. The new editor provides a side-by-side comparison of the changes that will be applied to the cluster profile. The editor also identifies the YAML customizations you have added and guides you through carrying over the customization to the new version of the YAML. The ability to undo changes and accept all changes is also available.

- When updating a deployed cluster profile or an active cluster's profile, the new differential editor is available to help you identify the changes that will be applied to the cluster profile.



### Edge

#### Breaking Changes

- Edge hostnames are not allowed to have special characters. Validation has been added to prevent issues arising from using special characters in host names. Edge host names must comply with RFC1035, refer to the [Edge Installer Configuration](./clusters/edge/edge-configuration/edge-configuration.md) and review the `name` parameter for more information.

#### Features

- Overlay support for DHCP. Edge hosts can now self-discover VxLAN overlay within a single ethernet broadcast domain. Clusters using this feature will remain operational when the host IP addresses change unexpectedly. Check out the [Enable Overlay Network](clusters/edge/networking/vxlan-overlay.md) resource for more information.


- Local registry support. You can deploy a self-hosted [Harbor registry](https://goharbor.io) on your Edge cluster and use the registry to store images for your workloads and initialize a cluster's other edge host nodes. Using a local registry can help you reduce the amount of data transferred over the network, cache images locally, and provide a backup for when internet access is unavailable. 

- Edge Kubernetes network interface management support. You can now specify the network interface for your edge hosts versus relying on the default interface selected by Kubernetes. This feature is useful when you have multiple network interfaces on your edge hosts and want to use a specific interface for your workloads or if you are using the new overlay support for DHCP. 


#### Improvements

- New Edge clusters can now retrieve provider images from authenticated registries. Previously, only public registries were supported for non-airgapped clusters. Now, you can use authenticated registries to store your provider images and retrieve them during cluster deployment. For more information, refer to the [Deploy Cluster with a Private Registry](clusters/edge/site-deployment/deploy-private-registry.md) guide.

- Extended [kube-vip customization](https://kube-vip.io/docs/installation/flags/) is now available for new Edge clusters. You can now specify additional kube-vip configuration parameters as part of the Kubernetes pack layer configuration. To learn more about the available kube-vip configuration parameters, refer to the [Publish Cluster Services with Kube-vip](clusters/edge/networking/kubevip.md) resource.


### Palette Dev Engine (PDE)


#### Improvements

- The default deployed Kubernetes version for new virtual clusters is now v1.26.


### Virtual Machine Orchestrator (VMO)

#### Features

- You can deploy edge clusters when using VMO. Edge clusters are useful when deploying Kubernetes clusters in remote locations.  


### VerteX


#### Features

- Azure Government Cloud support is now available for VerteX. You can now deploy Azure IaaS clusters on Azure Government accounts. The following Azure regions are available: US Gov Arizona, US Gov Texas, and US Gov Virginia. For more information, refer to the [Supported Platforms](./vertex/supported-platforms.md) resource.


- Canonical MAAS support is now available for VerteX. You can now deploy Canonical MAAS clusters with VerteX. Refer to the [MAAS](./clusters/data-center/maas/maas.md) resource for more information on deploying MAAS clusters.


- Support for passkeys is now available for the admin user. When accessing the system console, you can now use passkeys to authenticate to the admin user account. For more information, refer to the [System Console Credentials](vertex/system-management/account-management/credentials.md) resource.

#### Improvements

- To better support airgap installs and customers in internet-restricted environments. You can now access Palette documentation offline by using the Palette documentation container. For more information, refer to the [Offline Documentation](./vertex/install-palette-vertex/airgap/offline-docs.md) page.

### Terraform

#### Breaking Changes

- The parameter `cluster_context` is now a required attribute for the resource `spectrocloud_application`.

- The resource `spectrocloud_cluster_edge_native` is deprecating the following arguments; `ssh_key`, and `host_uids`.

#### Features 

- Version 0.17.1 of the [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is available. For more details, refer to the Terraform provider [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- The [Deploy a Custom Pack](./registries-and-packs/deploy-pack.md) tutorial has been updated to include instructions on deploying a custom pack with a custom OCI Pack registry.

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

- Check out the [Deprecated Packs](integrations/deprecated-packs.md) page for a list of deprecated packs.
