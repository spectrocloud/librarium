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


## December 9, 2023 - Release 4.2.0



### Palette


#### Breaking Changes



#### Features




#### Deprecations and Removals

#### Known Issues




### Edge

#### Breaking Changes

- Edge host names are not allowed to have special characters. Validation has been added to prevent issues that may arise from using special characters in host names. Edge host names must comply with RFC1035, refer to the [Edge Installer Configuration](./clusters/edge/edge-configuration/edge-configuration.md) and review the `name` parameter for more information.

#### Features

- Overlay support for DHCP. Edge hosts can now self-discover VxLAN overlay within a single ethernet brodcast domain. Clusters using this feature will remain operational in the scenario the host IP addresses changes unexpectedly. 


- Local registry support. You can deploy a self-hosted [Harbor registry](https://goharbor.io) on your Edge cluster and use the registry to store images for your workloads and to initialize the other edge host nodes of a cluster. Using a local registry can help you reduce the amount of data that is transferred over the network, cache images locally, and provide a backup for when internet access is not available. 

- Kubernetes network interface management. You can now specify the network interface to use for your edge hosts versus versus relying on the default interface selected by Kubernetes. This feature is useful when you have multiple network interfaces on your edge hosts and you want to use a specific interface for your workloads, or if you are using the new overlay support for DHCP. 


#### Improvements

- New Edge clusters can now retrieve provider images from authenticated registries. Previously, edge hosts could only pull provider images from unauthenticated registries.

- Extended [kube-vip customization](https://kube-vip.io/docs/installation/flags/) is now available for new Edge clusters. You can now specify additional kube-vip configuration paramters as part of the Kubernetes pack layer configuration. 


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





#### Improvements

- You can now access Palette documentation offline by using the Palette documenation container. Refer to the [Offline Documentation](./vertex/install-palette-vertex/airgap/offline-docs.md) page for more information.

### Terraform

- Version 0.17.0 of the [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is available. For more details, refer to the Terraform provider [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Breaking Changes

- The resource `spectrocloud_cluster_edge_native` is deprecating the following arguments; `cloud_config_id`, `ssh_key`, and `host_uids`.

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
