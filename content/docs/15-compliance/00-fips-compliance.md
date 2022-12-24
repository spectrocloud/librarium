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

Federal Information Processing Standards (FIPS) 140-2 is a mandatory standard for protecting sensitive and valuable data within federal systems. FIPS 140-2 is a National Institute of Standards and Technology (NIST) publication that lists security requirements for cryptographic modules protecting sensitive but unclassified information in computer and telecommunications systems. In addition, it applies to not only cryptographic hardware components and modules but also software and firmware programs and modules. 


## Palette FIPS
Palette complies with FIPS certification, which implies that Palette supports the FIPS-compliant versions of Kubernetes (PXK and PXK-E) for enhanced security for your mission-critical workload. You can run Palette clusters in two modes. 

**Non-FIPS Mode:** The cluster mode with Palette-enabled security features. 

**FIPS Mode**: Run your clusters with FIPS-compliant Kubernetes versions and Palette components. Palette provisions FIPS-compliant images for all cluster deployments. Platform FIPS support is about enabling FIPS support at the Tenant and Project scope. The cluster scope FIPS support is about deploying FIPS-enabled infra layers for the Palette cluster profiles. When platform FIPS support is enabled, infra layers must be FIPS compliant.

# Configure FIPS for Cluster Deployment

You can apply FIPS compliance at three levels to Palette:

<br />

* [Tenant Scope](/compliance/fips-compliance#tenantscope)


* [Project Scope](/compliance/fips-compliance#projectscope)


* [Cluster Scope](/compliance/fips-compliance#clusterscope)

## Tenant Scope

To provide FIPS compliance for Palette platform internal components, you must enable FIPS mode at the Tenant level. The Tenant-level compliance covers all the projects under the tenant.

<br />


To enable Tenant Scope FIPS compliance:

* Log in to Palette as Tenant Admin and go to **Tenant Settings** from the left **Main Menu**.


* Click **Platform Settings** and toggle **Platform FIPS Support** button. 


* To disable FIPS support, toggle back the Platform FIPS Support.


## Project Scope

You can enable FIPS Mode for individual projects. This can be achieved by enabling FIPS at the Project Platform scope.

<br />


To enable Project scope FIPS compliance

* Log in to Palette as Project Admin and go to **Project Settings** from the left main menu.


* Click **Platform Settings** and toggle **Platform FIPS Support** button. 


* To disable FIPS support, toggle the **Platform FIPS Support** button .


## Cluster Scope

Cluster scope FIPS mode provides FIPS-compliant Palette infrastructure layers. Palette supports the FIPS-compliant versions of Kubernetes (PXK and PXK-E) for the cluster profiles.

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

<br />









