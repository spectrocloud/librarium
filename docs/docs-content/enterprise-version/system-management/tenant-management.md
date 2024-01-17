---
sidebar_label: "Tenant Management"
title: "Tenant Management"
description: "Learn how to create and remove tenants in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 90
tags: ["palette", "self-hosted", "management"]
keywords: ["self-hosted", "enterprise"]
---


Tenants are isolated environments in Palette  that contain their own clusters, users, and resources. You can create multiple tenants in Palette  to support multiple teams or projects. Instructions for creating and removing tenants are provided below.


<br />

## Create a Tenant

You can create a tenant in Palette by following these steps.


### Prerequisites

* Access to the Palette system console.


### Enablement

1. Log in to the Palette system console.


2. Navigate to the left **Main Menu** and select **Tenant Management**.


3. Click **Create New Tenant**.


4. Fill out the **Org Name** and the properties of the admin user by providing the **First Name**, **Last Name**, and **Email**.


5. Confirm your changes.


6. From the tenant list view, find your newly created tenant and click on the **three dots Menu**. Select **Activate** to activate the tenant.

  <br />

  ![View of a tenant activation option](/enterprise-version_system-management_tenant-management_activate-tenant.png)

<br />

7. A pop-up box will present you with an activation URL. Copy the URL and paste it into your browser to activate the tenant.


8. Provide the admin user with a new password.


9. Log in to the tenant console using the admin user credentials.


### Validate 

1. Log in to Palette.


2. Verify that you can access the tenant as the admin user.



## Remove a Tenant

You can remove a tenant in Palette using the following steps.

### Prerequisites

* Access to the Palette system console.

### Removal

1. Log in to the Palette system console.


2. Navigate to the left **Main Menu** and select **Tenant Management**.


3. From the tenant list view, select the tenant you want to remove and click on the **three dots Menu**.


4. Select **Delete** to prepare the tenant for removal.


5. Click on your tenant's **three dot Menu** and select **Clean up** to remove all the tenant's resources.

<br />

  ![View of a tenant deletion option](/enterprise_version_system-management_tenant-management_remove-tenant.png)

  <br />

:::warning

If you do not clean up the tenant's resources, such as clusters and Private Cloud Gateways (PCGs), the tenant will remain in a **Deleting** state. You can use **Force Cleanup & Delete** to proceed with deletion without manually cleaning up tenant resources.

:::


After the cleanup process completes, the tenant will be removed from the tenant list view.

### Validate


1. Log in to the Palette system console. Refert to the [Access Palette](../enterprise-version.md#access-palette) section for instructions on how to access the Palette system console.


2. Navigate to the left **Main Menu** and select **Tenant Management**.


3. Validate that the tenant was removed by checking the tenant list view. 