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

For an end-to-end cluster provisioning example, please follow the appropriate guide under the Spectro Cloud provider resources.
One usage example on `spectrocloud_cloudaccount_openstack` linked for quick reference: [Spectro Cloud E2E Examples](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources).

Examples of other managed resources are also available in the [Spectro Cloud Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_openstack#:~:text=spectrocloud%20provider-,Resources,-spectrocloud_appliance) directory.




## Modules

There are two modules available to help you provision Spectro Cloud infrastructure resources. 

- [Palette Edge Native Terraform Module](https://registry.terraform.io/modules/spectrocloud/edge/spectrocloud/latest)
- [Spectro Cloud Terraform Modules](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest)

## Module to Provider Compatibility Matrix

The [Spectro Cloud Terraform Modules](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest) are compatible with the following versions of the Spectro Cloud Terraform provider.
<br />
<InfoBox>

Palette Terraform Supports:

* Sandbox Clusters starting from Provider version 0.10.1
* Edge Native Clusters starting from Provider version 0.10.1

</InfoBox>

|Module|Provider Version|Module Example|
|----- |------|------------------------|
|0.4.1 |0.10.5|
|0.4.1 |0.10.2|
|0.4.1 |0.10.1|            |
|0.4.0 |0.10.0|[Edge](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest/examples/edge), [Edge vSphere](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest/examples/edge-vsphere), [EKS](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest/examples/eks), [libvirt](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest/examples/libvirt), [Macro](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest/examples/macro), [TKE](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest/examples/tke)|
|0.3.1 |0.9.1 |  |
|0.3.0 |0.9.0 |  |
|0.2.3 |0.8.9 |  |
|0.2.3 |0.8.8 |  |
|0.1.8 |0.7.7 |  |
|0.1.8 |0.7.6 |
|0.1.8 |0.7.5 |
|0.1.8 |0.7.4 |
|0.1.8 |0.7.3 |
|0.1.8 |0.7.2 |
|0.1.8 |0.7.1 |
|0.1.0 |0.7.0 |  
|0.0.13|0.6.15| 
|0.0.12|0.6.14|
|0.0.11|0.6.13| 
|0.0.10|0.6.12|
