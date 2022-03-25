---
title: "Palette Terraform Support"
metaTitle: "Palette Terraform Support"
metaDescription: "Understanding, installing and operating Spectro Cloud's Terraform Provider."
icon: "terraform"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs'; 
import WarningBox from 'shared/components/WarningBox'; 
import InfoBox from 'shared/components/InfoBox'; 
import PointsOfInterest from 'shared/components/common/PointOfInterest'; 
import Tooltip from "shared/components/ui/Tooltip";


# Overview

Palette supports open-source infrastructure as code software tool to provide consistent CLI workflow support to multiple cloud services. Terraform codifies cloud APIs into declarative configuration files. Terraform supports to write configuration files, check whether the execution plan for a configuration matches your expectations before deployment and then  apply these changes to hundreds of cloud providers. 

# Terraform Provider Spectro Cloud

The SaaS and On-Prem management API of Spectro Cloud are resourced with [Spectro Cloud Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) as well.

## Pre-Requisites
To use this Spectro Cloud provider, you must meet the following requirements:
* Spectro Cloud account [Sign-up for a free trial account](https://www.spectrocloud.com/free-trial)
* Terraform (minimum version 0.13+)
* Kubernetes/Kubectl CLI (minimum version 1.16+)

## Usage

For an end end-to-end cluster provisioning example, please follow the appropriate guide under [Spectro Cloud E2E Examples](https://github.com/spectrocloud/terraform-provider-spectrocloud/tree/main/examples/e2e).

Examples of other managed resources are also available in the [examples/resources/ directory](https://github.com/spectrocloud/terraform-provider-spectrocloud/tree/main/examples/resources).

Detailed documentation on supported data sources and resources are available on the Terraform Spectro Cloud Provider Documentation. Find the links those documents at [Resources](/terraform/resources/#spectrocloudproviderresources) and [Datasources](/terraform/datasources/#spectrocloudproviderdatasource).


## Latest Terraform Versions Supported
The below section consolidates the different versions of Terraform providers supported by Spectro Cloud Palette and changes pertaining to each version.


<Tabs>

<Tabs.TabPane tab="v0.6.1" key="v0.6.1">

## Changes

The major changes are:
* Added datasource for appliances 
* Edge cluster support
* Helm registry data support
* RBAC support 
* Edge appliance create, update and delete fix
* Taints and labels support
* Support autoscaling settings for EKS

Version Changes [in detail](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases/tag/v0.6.1)

Full Changelog: [v0.6.0...v0.6.1](https://github.com/spectrocloud/terraform-provider-spectrocloud/compare/v0.6.0...v0.6.1)

## Assets

[Asset Details](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases/tag/v0.6.1#:~:text=akhilesh2410%20and%20nikchern-,Assets,-17) of terraform provider Spectro Cloud Palette.

</Tabs.TabPane>
 
<Tabs.TabPane tab="v0.6.1-pre" key="v0.6.1-pre">

## Changes

Major changes are:

* Edge cluster support
* Helm registry data support
* RBAC support 
* Edge appliance create, update and delete fix
* Taints and labels support

Version Changes [in detail](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases/tag/v0.6.1-pre)

Full Changelog: [v0.6.0...v0.6.1-pre](https://github.com/spectrocloud/terraform-provider-spectrocloud/compare/v0.6.0...v0.6.1-pre)

## Assets

[Asset Details](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases/tag/v0.6.1-pre#:~:text=3pings%2C%20and%20nikchern-,Assets,-17) of terraform provider Spectro Cloud Palette.

</Tabs.TabPane>


<Tabs.TabPane tab="v0.6.0" key="v0.6.0">

## Changes

Major changes are:

* Read cloud config and cache it in state
* Add by default BastionDisabled flag as true
* Maas support for terraform

Version Changes [in detail](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases/tag/v0.6.0)

Refer to Full Changelog:[v0.5.18...v0.6.0](https://github.com/spectrocloud/terraform-provider-spectrocloud/compare/v0.5.18...v0.6.0)

## Assets
[Asset Details](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases#:~:text=anand%20and%20nikchern-,Assets,-17) of terraform provider Spectro Cloud Palette.

</Tabs.TabPane>

<Tabs.TabPane tab="v0.5.18" key="v0.5.18">

## Whats changed
* Set unlimited fetch size for profiles

Version Changes [in detail](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases/tag/v0.5.18)

Refer to Full Changelog: [v0.5.17...v0.5.18](https://github.com/spectrocloud/terraform-provider-spectrocloud/compare/v0.5.17...v0.5.18)

## Assets
[Asset Details](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases#:~:text=Assets-,17,-terraform%2Dprovider%2Dspectrocloud_0.5.18_darwin_amd64) of terraform provider Spectro Cloud Palette.


</Tabs.TabPane>


</Tabs>




