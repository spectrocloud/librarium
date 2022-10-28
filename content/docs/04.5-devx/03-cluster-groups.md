---
title: "Cluster Groups"
metaTitle: "Palette Devx for Enterprise Developer"
metaDescription: "Explore Palette Devx as Free Developer"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Tenant Scope - DevOps Persona

The enterprise developer can create and utilize the Palette compute under the scope of a Tenant admin. Once these compute resources are launched and ready to use they can shift to the Palette Dev Engine to explore our developer centric offerings. The creation of Cluster Groups is a deployment under the tenant scope. They can also utilize:

<br />

* The Cluster Groups available under the Palette [System Scope](/devx/cluster-groups#systemscope).


* The Cluster Groups launched in the [developer's enterprise datacenter/environment](/devx/cluster-groups#tenantscope).

# Cluster Groups
Cluster Group is an aggregation of host clusters deployed through Palette. Palette sandbox clusters can be launched into these host cluster groups. The cluster groups are created under two scopes:

## System Scope

  * Palette provides a default cluster group called `beehive` at the system scope in the us-east region. 

## Tenant Scope

### Create Your Cluster Group (Tenant Scope) 

To create Palette Host Cluster Groups, the developer needs to [deploy healthy running Palette host clusters](/clusters). Then, these clusters can be aggregated as a Cluster Group. To create a Palette Host cluster group:

<br />

1. Log in to Palette Console as `Tenant Admin` and select `Cluster Groups` from the right side bar.


2. Click on `+New Cluster Groups` to create a new cluster group and provide the following information to the Cluster Group creation wizard:


   * **Basic Information: **

  |         Parameter           | Description  |
  |-------------------------------|-----------------|
  |Group Name                 | A custom name for the cluster group|
  |Description (optional)   | Description of the group, if any | 
  |Tag (optional)               | Tags on a cluster group are propagated to the cloud/data center environments.|


  * **Add clusters** to the group from the existing tenant scope healthy host clusters.


  * **Cluster Group Configurations:** Two types of configurations needs to be done as below:

    
  **Host Configuration:** The cluster group consists of the ‘n’ number of tenant scope clusters. 
    
|**Host Cluster Config**        |        **Description**                    |
|--------------------------------------|-------------------------------------------|
|Oversubscription (%):                 | Default is 120%, can be customized|
|Cluster endpoint type:                | LB or Ingress|
|Host DNS:                             | If the cluster endpoint selected is Ingress, then for each selected host cluster provide the Host DNS. |


**Note:**  Please ensure that a wildcard DNS record exists that maps the provided Host Pattern to the NGINX Ingress Controller load balancer for this cluster.


   **Sandbox Cluster Configuration:** The configuration for clusters launched into the host clusters. This configuration can be done when the sandbox clusters are getting launched.

 |**Sandbox andbox Cluster Limits ** | **Description**   |
 |------------------------ --|-------------------|
 |CPU (per request)          | 6 default         |
 | Memory (per request)      | 8 Gi default      |
 | Storage (per request)     |  10 Gi default    |


3. Review the settings and deploy the cluster group. The Palette host cluster group is all set to host the sandbox clusters.


### Manage your Cluster Group

Once the cluster group is created, the day two operations on them can be done as follows:

1. Select the `Cluster Group’ to be managed and click `Settings` to access different cluster management activities. 


2. To delete a cluster group, select `Delete Cluster,` enter the cluster name, and confirm the delete operation.

### Platforms Supported

* AWS
* EKS
* Azure
* AKS
* VMWare

### Cluster Import Support

* EKS
* AKS
* GKE


<br />
