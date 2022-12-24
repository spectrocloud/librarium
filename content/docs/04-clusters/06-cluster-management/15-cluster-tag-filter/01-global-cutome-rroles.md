---
title: "Palette Resource Roles"
metaTitle: "Palette Global and Custom Resource Roles "
metaDescription: "Palette Global and Custom Resource Roles "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview

The page encompasses the Palette Resource Roles. We support two broad classifications of Resource Roles:

<br />

* [Palette Global Resource Roles](/clusters/cluster-management/cluster-tag-filter/global-cutome-rroles#globalresourceroles), the set of roles built in and available to you.


* [Palette Custom Roles](/clusters/cluster-management/cluster-tag-filter/global-cutome-rroles#customroles), the roles you can create in Palette using our available set of permissions and operations.
   * [Create Custom Role](/clusters/cluster-management/cluster-tag-filter/global-cutome-rroles#createcustomroles), how to create a custom role in the Palette console.


## Global Resource Roles 

Palette provides the following global resource roles out-of-the-box:

<br />

* [Resource Cluster Admin](/user-management/palette-rbac/project-scope-roles-permissions#clusteradmin)


* [Resource Cluster Editor](/user-management/palette-rbac/project-scope-roles-permissions#clustereditor)


* [Resource Cluster Profile Admin](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofileadmin)


* [Resource Cluster Profile Editor](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofileeditor)


* [Resource Cluster Profile Viewer](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofileviewer)


* [Resource Cluster Viewer](/user-management/palette-rbac/project-scope-roles-permissions#clusterviewer)



##  Platform Permissions



The following is a list of permissions and operations supported by Palette. Use these permissions when creating a custom role to control its access.

<br />

1. CloudAccount
   * Cloudaccount.get
   * cloudaccount.list


2. CloudConfig  
   * cloudconfig.delete  
   * cloudconfig.get  
   * cloudconfig.list  
   * cloudconfig.update


 3. Cluster  
    * cluster.delete  
    * cluster.get  
    * cluster.list  
    * cluster.update
   

4. ClusterProfile  
   * clusterProfile.delete  
   * clusterProfile.get  
   * clusterProfile.list  
   * clusterProfile.publish  
   * clusterProfile.update
   

5. DNS Mapping  
   * dnsMapping.get  
   * dnsMapping.list
  

6. Location  
   * location.get  
   * location.list


7.  Machine  
    * machine.get  
    * machine.list


8.  Macro  
    * macro.get  
    * macro.list


9.  Registry  
    * packRegistry.get  
    * packRegistry.list


## Create Custom Roles

To create your custom resource roles in Palette:

1.  Log in to Palette as Tenant Admin and select **Roles** from the left **Main Menu**.


2. Go to the **Resource Roles** tab from the top menu and click on the **+Create Resource Role** button to open the **Add New Role (Resource)** wizard. Fill out the following inputs.
  * Name of the role.
  3. Assign permissions and operations.


4. Once the required permissions are selected, click the **Save** button.


A UI pop-up message will confirm the successful creation of the new custom resource role.


# Validation


* To validate the role creation go to the **Roles** tab from the left main menu and click on **Resource Roles** tab to find the new role name listed.


# Edit and Delete Role


* To **Edit and Delete** the role from the role listing page, click the role to be deleted or edited to go to the role details page.


* Click on **Delete Role or Edit Role** button to delete or edit the role respectively.






