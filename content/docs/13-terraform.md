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

Palette supports open-source Infrastructure as Code (IaC) software tools to provide consistent CLI workflow support to multiple cloud services. Terraform organizes cloud APIs into declarative, configuration files. Terraform supports the ability to write configuration files, checks whether the execution plan for a configuration matches your expectations (before deployment), and applies these changes to hundreds of cloud resources. 

# Spectro Cloud Provider

Spectro Cloud Palette's SaaS and On-Premise management API is resourced within the HashiCorp Terraform registry as [Spectro Cloud Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

## Prerequisites
To use this Spectro Cloud provider, have the following requirements ready:
* Spectro Cloud account - [Sign up for a free trial account](https://www.spectrocloud.com/free-trial)
* Terraform (minimum version 0.13+)
* Kubernetes/kubectl CLI (minimum version 1.16+)

## Usage

For an end-to-end cluster provisioning example, please follow the appropriate guide under Spectro Cloud provider resources.
One usage example on `spectrocloud_cloudaccount_openstack` linked for quick reference: [Spectro Cloud E2E Examples](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources).

Examples of other managed resources are also available in the [Spectro Cloud Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_openstack#:~:text=spectrocloud%20provider-,Resources,-spectrocloud_appliance) directory.

Detailed documentation on supported data sources and resources are available in the Terraform Spectro Cloud Provider documentation. Find the links to those documents at [Resources](/terraform/resources/#spectrocloudproviderresources) and [Datasources](/terraform/datasources/#spectrocloudproviderdatasource).


## Latest Version of Spectro Cloud Terraform Provider:
The below section includes the different versions of Terraform providers, supported by Spectro Cloud Palette and the changes pertaining to each version.

### Latest Version Supported : `0.6.x`

Find the detailed patch changes and comparisons of **0.6.x** at below tabs.

<Tabs>

<Tabs.TabPane tab="v0.6.13" key="v0.6.13">

## Changes

The major change is:
* Additional_labels update fix for libvirt cluster

Refer to Full Changelog: [v0.6.1 to v0.6.13](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.6.13)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.6.1" key="v0.6.1">

## Changes

The major changes are:
* Added data source for appliances 
* Edge Cluster support
* Helm registry data support
* RBAC support 
* Edge appliances create, update, and delete fix
* Taints and labels support
* Supports auto scaling settings for EKS


Refer to Full Changelog: [v0.6.0 to v0.6.1](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.6.1)


</Tabs.TabPane>
 

<Tabs.TabPane tab="v0.6.0" key="v0.6.0">

## Changes

Major changes are:

* Read the **cloud config** file and cache it in state
* Add by default the **BastionDisabled** flag as *True*
* MAAS support for Terraform

Refer to the Full Changelog: [v0.5.18 to v0.6.0](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.6.0)


</Tabs.TabPane>

</Tabs>




