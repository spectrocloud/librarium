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

The page guides you on how to create a Palette Resource Filter and add these filters to the users to establish cluster access restrictions.

# Create Resource Filter

You must create a Resource Filter in Palette to establish user-based access restrictions to clusters across multiple projects. The resource filters are created under the scope of Tenant Admin. To create a resource filter, follow the steps below:
 
<br />

1. Log in to Palette as **Tenant Admin** and go to **Tenant Settings** from the left **Main Menu**.


2. Select **Filters** tab and click **+New Resource Filter**.


3. To the **Create New Filter** wizard give the following information:
  * Filter Name: A custom name for the tag filter.
  * A filter expression. Use the following table to familiarize yourself with the filter expression format: 

    |Conjunction| Property| Operator| Tag-Value|
    |-------|-----|---------|------------------|
    |and    | Tag | is      | Custom  tag value|
    |or     | Tag | is      | Custom  tag value|
    |and    | Tag | is not  | Custom  tag value| 
    |or     | Tag | is not  | Custom  tag value|  
    
4. Click the **Confirm** button to complete the filter creation wizard.

## Validation

Upon creating a filter, a display message will pop up to confirm the successful creation of the tag. You can also use the following steps to review the filter is available for use.

1. Navigate to the left **Main Menu** and click on **Tentant Settings**.

2. Access the **Manage Filters** page to find the filter name listed. 

3. You can **Edit** and **Delete** filters by clicking on the three-dots at the end of the row.

# Add Resource Role

You can assign the resource filter created, in combination with roles, to a [user](/user-management/new-user#createanewuser) to enforce access restriction. Palette provisions two types of roles:

* [Palette Global Roles](/user-management/palette-rbac/resource-scope-roles-permissions#paletteglobalresourceroles), the set of roles that are available in Palette console

* [Custom Resource Roles](/user-management/palette-rbac/resource-scope-roles-permissions#palettecustomresourceroles),  can be generated according to your requirements from the available set of permissions and operations. 

## Prerequisites

* A [Palette account](https://www.spectrocloud.com/get-started/) with Tenant scope privileges.

* A [user created](/user-management/new-user#createanewuser) to assign the resource privileges.

To assign the resource roles and filter to the user follow the below steps:
<br />

1. Log in to Palette as Tenant Admin


2. Select the user to be assigned with a role from the **Users & Teams** from the left **Main Menu** to go to **User Details**.


3. From the user details wizard, select **Resource Roles** Tab and click **+ New Resource Role**.


4. In the **Add Roles to User** wizard, enter the following details:
  * **Projects**: The projects to which the user is assigned.
  * **Filers**: Select the filters to be assigned from the drop-down. The Filters created will be displayed in the drop-down menu.
  * Select the **check box** to assign the roles to the user from the list displayed. These are Palette built-in roles.


5. Click **Confirm** to complete the Add Role wizard.

## Remove or Edit the Role 

To remove or edit an attached role:

1. Login to Palette as Tenant Admin


2. From the left ** Main Menu** click on **Users & Teams**. This will take you to the **User Details** page.


3. From the **Resource Roles** tab, click the **three-dot** menu towards the role name.


4. Click **Edit** or **Remove** option from the drop-down menu.

## Validation

* The UI pop-up message will confirm the successful completion of the role assignment.

* Log in to Palette and check the visibility of clusters as per the access privileges set for validation.

## Resource

* [Create a New User](/user-management/new-user#createanewuser)

