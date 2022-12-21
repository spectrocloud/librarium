---
title: "Tag Based Access Control"
metaTitle: "Cluster Access Control Using "
metaDescription: "Clusters Location view on Map"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Overview

Palette provides granularity in toggling the access privileges using Tag Filtering.  This feature helps to set access privileges to clusters controlled using tags, roles, and permissions, Thereby filtering out the Clusters from multiple Projects to be accessible to you with different permissions and operations. 

## Major Steps:
* [Create Tag Filter](/clusters/cluster-management/cluster-tag-filter#createtagfilter)


* Create User and Assign Resource Role
  * Create New User
  * Assign Resource Role to the User

## Create Tag Filter

You need to create a filter in Palette to 

To create a resource filter, 
* Log in to Palette as **Tenant Admin** and go to **Tenant Settings** from the left main menu.


* Select **Filters** tab and click **+New Resource Filter**.


* To the **Create New Filter** wizard give the following information:
  * Filter Name: A custom name for the tag filter.
  * Filter expression to be created as per the below format: 

    |Conjunction| Property| Operator| Tag-Value|
    |-------|-----|---------|------------------|
    |and    | Tag | is      | Custom  tag value|
    |or     | Tag | is      | Custom  tag value|
    |and    | Tag | is not  | Custom  tag value| 
    |or     | Tag | is not  | Custom  tag value|  
    
* Click **Confirm** button to complete the filter creation wizard.


* The UI message will pop up to confirm the successful creation of the tag.


* Go to **Tenant Settings** -> **Filters** tab to access the **Manage Filters** page to find the filter name listed. You can **Edit** and **Delete** these filters from the three-dot (Kebab) menu toward the filter name.

## Assign Resource Role

Assign the resource role to new or existing users. Palette has a set of predefined Roles, which we refer to as **Global Roles** You can extend your permissions by creating New Roles. These roles can be assigned to you on demand.

<br />

### Create a New User

To create a new user in Palette:

* Login to Palette as a Tenant Admin.


* Select **Users and Teams** from the left main menu and click on **+Create User** button.


* To **create user** wizard, provide the following information and click the **Confirm** button.
  * First Name
  * Last Name
  * Email
  * Team(s)


* The UI pop-up message will confirm the user's creation.


* Validate the user creation from the **Users & Teams** page in the Tenant Admin console.

### Assign Resource Role to the User

Palette has adopted the security principle of least privilege. Each user is assigned Roles and Permissions to the Scopes, Resources, and Components. The Permissions format is `resourceKey.operation`, where resourceKey refers to a resource or the API functionality, and operation refers to the action or activity allowed.

The permissions can be:

<br />

* [Global Resource Roles](/clusters/cluster-management/cluster-tag-filter#globalresourceroles): Out of the box roles in the Palette.


* [Custom Resource Roles](/clusters/cluster-management/cluster-tag-filter#custompermissionsandoperations): You can create the roles from the available permissions and operations.


### Global Resource Roles 

The set of Global Resource Roles available within the Palette are:

<br />

* [Resource Cluster Admin](/user-management/palette-rbac/project-scope-roles-permissions#clusteradmin)


* [Resource Cluster Editor](/user-management/palette-rbac/project-scope-roles-permissions#clustereditor)


* [Resource Cluster Profile Admin](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofileadmin)


* [Resource Cluster Profile Editor](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofileeditor)


* [Resource Cluster Profile Viewer](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofileviewer)


* [Resource Cluster Viewer](/user-management/palette-rbac/project-scope-roles-permissions#clusterviewer)

###  Custom Permissions and Operations


The set of customizable Permissions and Operations supported by Palette are as follows:

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




To Assign resource role to the user:

<br />

* Login to Palette as Tenant Admin


* Select the user to be assigned with role from the **Users & Teams** from the left main menu to go to **User Details**.


* From the user details wizard, select **Resource Roles** Tab and click **+ New Resource Role**.


* In the **Add Roles to User** wizard, enter the following details:
  * **Projects**: The projects to which the user is assigned.
  * **Filers**: Select the filters to be assigned from the drop-down. The Filters created will be displayed in the drop-down menu.
  * Select the **check box** to assign the roles to the user from the list displayed. These are Palette built-in roles.


* Click **Confirm** to complete the Add Role wizard.


* The UI pop-up message will confirm the successful completion of the role assignment.

## Assign Custom Resource Roles to the User

Palette enables users to create `Custom Resource Roles` and assign them to the user. 

<br />

### Create Custom Roles

To create your custom resource roles in Palette:

* Log in to Palette as Tenant Admin and select **Roles** from the left main menu.


* Click **+Create Resource Role** button to open the **Add New Role (Resource)** wizard. 
  * Custom name for the role
  * Select permissions and operations as per the user's requirements 


* Once the required permissions are selected, click the **Save** button.


* A UI pop-up message will confirm the successful creation of the new custom resource role.


* Validate the role creation from **Roles** tab from the left main menu and go to **Resource Roles** tab. The New role will be listed on this page.








