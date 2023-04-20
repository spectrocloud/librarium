---
title: "FIPS Compliance"
metaTitle: "Certification of FIPS Compliance"
metaDescription: "Palette is FIPS certificated. Read to learn more about Palette and its certification of FIPS Compliance"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview

Palette complies with FIPS certification and supports the FIPS-compliant versions of Kubernetes (PXK and PXK-E) for enhanced security for your mission-critical workload. You can enable FIPS mode for Palette at three scopes: tenant, project, or cluster scope. 

Platform FIPS enables FIPS support at the **Tenant** and **Project** scope. The cluster scope FIPS support is for deploying FIPS-enabled infrastructure layers for [cluster profiles](/cluster-profiles). When platform FIPS support is enabled you must ensure the infrastructure layers is FIPS compliant.

<br />

* [Tenant Scope](/compliance/fips-compliance#tenantscope)


* [Project Scope](/compliance/fips-compliance#projectscope)


* [Cluster Scope](/compliance/fips-compliance#clusterscope)

## Tenant Scope

To enable FIPS compliance for Palette's platform internal components, you must enable FIPS mode at the Tenant level. The tenant level compliance covers all the projects under the tenant.

<br />


To enable Tenant Scope FIPS compliance:

1. Log in to Palette as Tenant Admin and go to **Tenant Settings** from the left **Main Menu**.


2. Click **Platform Settings** and toggle **Platform FIPS Support** button. 


If you need to disable FIPS support, toggle back the **Platform FIPS Support** button.


## Project Scope

You can enable FIPS Mode for individual projects. This can be achieved by enabling FIPS at the project scope.

<br />


To enable Project scope FIPS compliance

1. Log in to Palette as Project Admin and go to **Project Settings** from the left main menu.


2. Click **Platform Settings** and toggle **Platform FIPS Support** button. 


If you need to disable FIPS support, toggle back the **Platform FIPS Support** button.


## Cluster Scope

Cluster scope FIPS mode provides FIPS-compliant Palette infrastructure layers. Palette supports the FIPS-compliant versions of Kubernetes (PXK and PXK-E) for the cluster profiles. Clusters by default run with Palette-enabled security features. When clusters are enabled in FIPS mode the cluster is deployed with FIPS-compliant Kubernetes versions and Palette components. Palette provisions FIPS-compliant images for all cluster deployments.


<br/>

To enable cluster-level FIPS mode while [creating cluster profile](/cluster-profiles/task-define-profile) add the layers from the FIPS-compliant pack registry. To access the FIPS registry, [contact Spectro Cloud support](https://spectrocloud.atlassian.net/servicedesk/customer/portals).
## Use Cases

The FIPS mode can cover different use cases as below:

|Use Cases | FIPS Mode   | Mandatory Condition|
|----------|--------------|--------------|                 
|All the projects under a tenant needs to be in FIPS mode | Tenant FIPS Support|Cluster Scope FIPS |
|Only selected projects under a tenant needs to be FIPS enabled| Enable Project FIPS Support for the selected projects|Cluster Scope FIPS|
|Only cluster scope FIPS to be enabled|Tenant and Project scope are not required| Enable only cluster scope FIPS mode|
   
**Note:** when platform FIPS supported is enabled, infra layers must be FIPS complaint.

<br />

<WarningBox>

FIPS enablement at the tenant or project scope can be disabled or enabled during cluster creation.  Toggle the **FIPS Mode** button while creating the cluster configurations of cluster deployment.

</WarningBox>

### Platforms Supported:

Palette supports FIPS compliance for the following platforms:

* AWS
* VMware

<br />