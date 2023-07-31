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

Palette supports the open-source Infrastructure as Code (IaC) software tool, [Terraform](https://www.terraform.io/), to provide consistent CLI workflow support to multiple cloud services. 

Terraform organizes cloud APIs into declarative, configuration files. Terraform supports the ability to write configuration files, checks whether the execution plan for a configuration matches your expectations (before deployment), and applies the changes to all the managed resources. 

# Spectro Cloud Provider

Spectro Cloud Palette's SaaS and On-Premise management API can be used with the Spectro Cloud Terraform provider. The provider is available in the HashiCorp Terraform registry as [Spectro Cloud Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs). 
<br />

### Release Notes
Information about the latest changes in the Spectro Cloud provider can be found in the [release notes](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
<br />

### Provider Documentation
Detailed documentation on supported data sources and resources are available in the Terraform Spectro Cloud Provider [documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) page. 
<br />

## Prerequisites
The Spectro Cloud provider has the following requirements:
* Spectro Cloud Palette account - [Sign up for a free trial account](https://www.spectrocloud.com/free-trial)
* Terraform (minimum version 0.13+)
* Kubernetes/kubectl CLI (minimum version 1.16+)
<br />

## Usage

For an end-to-end cluster provisioning example, please follow the appropriate guide: [Spectro Cloud E2E Examples](https://github.com/spectrocloud/terraform-provider-spectrocloud/tree/main/examples/e2e).

Specific resource examples are available directory in the [Spectro Cloud Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud) Terraform provider documentation. One usage example on `spectrocloud_cloudaccount_vsphere` linked for quick reference: [spectrocloud_cloudaccount_vsphere](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_vsphere).


## Modules

There are two modules available to help you provision Spectro Cloud infrastructure resources. 

- [Palette Edge Native Terraform Module](https://registry.terraform.io/modules/spectrocloud/edge/spectrocloud/latest)
- [Spectro Cloud Terraform Modules](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest)

Review the [Spectro Cloud modules readme](https://github.com/spectrocloud/terraform-spectrocloud-modules#module-resources--requirements) document to learn more about supported provider versions and other requirements.
