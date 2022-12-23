---
title: "Cluster Resource Filter"
metaTitle: "Create and Add Cluster Resource Filter "
metaDescription: "Create and Add Cluster Resource Filter"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview

The page encompasses the creation of a Palette Resource Filter and adding these filters to the users to establish cluster access restrictions.

* [Create Resource Filter](/clusters/cluster-management/cluster-tag-filter/create-add-filter#createresourcefilter)


* [Add Resource Role](/clusters/cluster-management/cluster-tag-filter/create-add-filter#addresourcerole)


# Create Resource Filter

You must create a Resource Filter in Palette to establish user-based access restrictions to clusters across multiple projects. The resource filters are created under the scope of Tenant Admin. To create a resource filter, follow the below steps:
 
<br />

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

## Validation

* The UI message will pop up to confirm the successful creation of the tag.


* From the  **Tenant Settings** go to **Filters** tab.

* Access the **Manage Filters** page to find the filter name listed. 

* You can **Edit** and **Delete** these filters from the three-dot (Kebab) menu toward the filter name.

# Add Resource Role

You can assign the resource filter created along with Palette roles to the [users](/clusters/cluster-management/cluster-tag-filter/new-user) to provision the access restriction. Palette provisions two type of roles:

* [Palette Global Roles](/clusters/cluster-management/cluster-tag-filter/global-cutome-rroles#globalresourceroles), the set of roles that are available in Palette console

* [Custom Roles](/clusters/cluster-management/cluster-tag-filter/global-cutome-rroles#customroles), that can be generated as per your requirements from the available set of permissions and operations. 
To assign the resource roles and filter to the user follow the below steps:
<br />

* Login to Palette as Tenant Admin


* Select the user to be assigned with role from the **Users & Teams** from the left main menu to go to **User Details**.


* From the user details wizard, select **Resource Roles** Tab and click **+ New Resource Role**.


* In the **Add Roles to User** wizard, enter the following details:
  * **Projects**: The projects to which the user is assigned.
  * **Filers**: Select the filters to be assigned from the drop-down. The Filters created will be displayed in the drop-down menu.
  * Select the **check box** to assign the roles to the user from the list displayed. These are Palette built-in roles.


* Click **Confirm** to complete the Add Role wizard.

## Remove or Edit the Role 

To remove or Edit an attached role:

* Login to Palette as Tenant Admin


* Select the user from the **Users & Teams** from the left main menu to go to **User Details**.


* From the **Resource Roles** tab, click the **three** dot menu towards the role name.


* Click **Edit** or **Remove** option from the drop-down menu.

## Validation

* The UI pop-up message will confirm the successful completion of the role assignment.

* Log in to Palette and check the visibility of clusters as per the access privileges set for validation.



## Resource

* [Create New User](/clusters/cluster-management/cluster-tag-filter/new-user)

