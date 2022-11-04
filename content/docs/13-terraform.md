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
* Spectro Cloud Palette account - [Sign up for a free trial account](https://www.spectrocloud.com/free-trial)
* Terraform (minimum version 0.13+)
* Kubernetes/kubectl CLI (minimum version 1.16+)

## Usage

For an end-to-end cluster provisioning example, please follow the appropriate guide under the Spectro Cloud provider resources.
One usage example on `spectrocloud_cloudaccount_openstack` linked for quick reference: [Spectro Cloud E2E Examples](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources).

Examples of other managed resources are also available in the [Spectro Cloud Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_openstack#:~:text=spectrocloud%20provider-,Resources,-spectrocloud_appliance) directory.

Detailed documentation on supported data sources and resources are available in the Terraform Spectro Cloud Provider documentation. Find the links to those documents at [Resources](/terraform/resources/#spectrocloudproviderresources) and [Datasources](/terraform/datasources/#spectrocloudproviderdatasource).

## Module to Provider Compatibility Matrix

|Module|Provider Version|Module Example|
|----- |------|------------------------|
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

<br />

<InfoBox>

Palette Terraform Supports:

* Sandbox Clusters starting from Provider version 0.10.1
* Edge Native Clusters starting from Provider version 0.10.1

</InfoBox>

<br />

## Latest Version of Spectro Cloud Terraform Provider:
The section below includes the different versions of Terraform providers, supported by Spectro Cloud Palette and the changes pertaining to each version.

<br />
<br />

### Latest Version Supported : `0.10.x`

Find the detailed patch changes and comparisons within below **tabs**.

<br />

<Tabs>

<Tabs.TabPane tab="v0.10.1" key="v0.10.1">

**Supported Module Version: 0.4.1**

# Changes 

**New Features:**

* Native Edge cluster support.
 
**Bugfix:**


* Pass host configuration to EKS cluster on create.


* Honor update timeout for add-on deployments.


* Read back the host uid and labels.


* Support regex for namespace selection.


* Fixing day-2 operations for cluster profile description.


* Fixing day-1 operations for cluster roles and role bindings.


* Fixing NPE issue when reading nested machine pool.

</Tabs.TabPane>

<Tabs.TabPane tab="v0.10.0" key="v0.10.0">

# Provider Changes 

* Palette Terraform support for Add-on deployment.
   * Add-on deployments: Support skip_packs tag
   * Add-on deployments: Attach cluster profile by name


* AWS cloud account is a mandatory attribute for AWS cluster resources.


* Nested Cluster schema support for all the cloud types.


**Fixes:**

* Disable machine pool hash for Edge to preserve pool order.


* Day-2 machine pool preserve for pool order.


* Name attribute improvement for error handling.

<br />


# Module Changes 


The compatible **Module** for provider 0.10.0 is **0.4.0**

<br />

* Support of add-on deployment.


* Add-on pack values override support for VMware cloud.


* Error handling for pack manifests.


* Cluster profile pack manifests provisioning for empty pack list.


* System profile update support.


* Add-on layers parameter override for edge clouds.


* Parameters override for system profile for edge clouds.


Refer to Full Changelog: [v0.9.1 to v0.10.0](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.10.0)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.9.1" key="v0.9.1">

The compatible **Module** for provider 0.9.1 is **0.3.1**

# Changes

* **Bug Fix**

  * **Issue**: Overriding the addon profile pack value for the vsphere_edge cloud type was impossible.
  * **Fix**: Added missing profile name in addon profile pack parameters index.

Refer to Full Changelog: [v0.9.0 to v0.9.1](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.9.1)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.9.0" key="v0.9.0">

The compatible **Module** for provider 0.9.0 is **0.3.0**

# Changes

* Image template folder support.
 

* VMware cloud type support for TF modules.


* Adding static IP-Pool for VMware.


Refer to Full Changelog: [v0.8.9 to v0.9.0](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.9.0)

</Tabs.TabPane>
<Tabs.TabPane tab="v0.8.9" key="v0.8.9">

The compatible **Module** for provider 0.8.9 is **0.2.3** 
# Changes

* Static placement support for AKS clusters.

* Tag update of cluster resources for all Palette-supported clouds.

Refer to Full Changelog: [v0.8.8 to v0.8.9](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.8.9)

</Tabs.TabPane>
<Tabs.TabPane tab="v0.8.8" key="v0.8.8">

# Provider Changes 

* Read back `ssh_key_name` for clusters .


* Added `Unknown` status for deployed clusters.


* Error message improvisation.


* Support RBACs, Taints, and additional Labels in AKS, AWS, and Azure clouds.


* Patch tags for Cluster Profiles.


* RBAC creation and update for AKS clusters.


* Tenant, organization, and system scope support for Cluster Profiles.


* Refactored cluster update strategy.


* Set versioning for the profile data source.


* Supports manifest for Maas, OpenStack, AWS, Azure, AKS, GCP, and VMware.

**Fixes:**

<br />

* `registry_uid` and `tags` correction on read .


* `os_type` and `system pool` settings.


# Module Changes 


The compatible **Module** for provider 0.8.8 is **0.2.3**

<br />

* Changing index for resources, adding outputs


* Refactoring profiles and packs resources.


* Support profiles contexting.


* Support dynamic placement for TKE clusters.   


* Assign min-max by default to count for TKE clusters.


* Support SSH key for TKE cloud.


* Profile context for libvirt API


* Support of multiple cloud types in one configuration folder.


* Support of macro resources. 

**Fixes:**


* Fixing profile dependency within a single module.


* Fixing profile version and override for the boolean value.

Refer to Full Changelog: [v0.7.7 to v0.8.8](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.8.8)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.7.7" key="v0.7.7">

## Changes

The major changes are:

* Fix: Dynamic provisioning in EKS.

* Import cluster tags and generic cloud changes.

Refer to Full Changelog: [v0.7.6 to v0.7.7](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.7)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.7.6" key="v0.7.6">

## Changes

The major changes are:

* Generic day 2 read. 

Refer to Full Changelog: [v0.7.5 to v0.7.6](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.6)

</Tabs.TabPane>
<Tabs.TabPane tab="v0.7.5" key="v0.7.5">

## Changes

The major changes are:

* Parameter 'Role Bindings' should not be empty.

Refer to Full Changelog: [v0.7.4 to v0.7.5](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.5)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.7.4" key="v0.7.4">

## Changes

The major changes are:

* Profile fix for imported clusters.

Refer to Full Changelog: [v0.7.3 to v0.7.4](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.4)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.7.3" key="v0.7.3">

## Changes

The major changes are:

* Update hapi for request retry.
* Fix of EKS update failure when encryption is enabled.
* Support of macros resource.
* Fix: Cluster import and appliance deletion errors.

Refer to Full Changelog: [v0.7.2 to v0.7.3](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.3)

</Tabs.TabPane>

<Tabs.TabPane tab="v0.7.2" key="v0.7.2">

## Changes

The major changes are:

* Fix: Dynamic provisioning in EKS.

* Import cluster tags and generic cloud changes.

Refer to Full Changelog: [v0.7.1 to v0.7.2](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.2)

</Tabs.TabPane>


<Tabs.TabPane tab="v0.7.1" key="v0.7.1">

## Changes

The major changes are:

* Support of OS patching in EKS. 

* Support EKS cluster encryption.

Refer to Full Changelog: [v0.7.0 to v0.7.1](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.1)

</Tabs.TabPane>


<Tabs.TabPane tab="v0.7.0" key="v0.7.0">

## Changes

The major change is:

* Download and Install version for cluster profile.  

Refer to Full Changelog: [v0.6.x to v0.7.0](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.7.0)

</Tabs.TabPane>


<Tabs.TabPane tab="v0.6.14" key="v0.6.14">

## Changes

The major change is:

* Update VMware cluster configuration to allow ssh key rotation.


Refer to Full Changelog: [v0.6.1 to v0.6.13](https://registry.terraform.io/providers/spectrocloud/spectrocloud/0.6.14)

</Tabs.TabPane>

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

<br />
<br />
