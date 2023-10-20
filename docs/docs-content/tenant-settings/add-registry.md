---
sidebar_label: "Add Tenant-Level Registry"
title: "Add Tenant-Level Registry"
description: "Learn how to add a tenant-level registry in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["enterprise", "management", "registry"]
---

You can add a registry at the system level or tenant level. Registries added at the system level are available to all the tenants. Registries added at the tenant level are available only to that tenant. This section describes how to add a tenant-level registry. For steps to add a system-level registry, refer to [Add System-Level Registry](../enterprise-version/system-management/add-registry.md). 

## Prerequisites

- You need tenant admin privileges. 

## Add an OCI Registry

Use the following steps to add a tenant-level OCI registry.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu** select **Tenant Settings**. 

3. In the **Tenant Settings** menu, select **Registries**.

4. Select the **OCI Registries** tab and click on the **Add New OCI Registry** button.

5. Fill out the following input values to add an OCI registry. Contact our support team to obtain the registry endpoint, base path, and credentials.

  | **Field**            | **Description**                   |
  |----------------------|-----------------------------------|
  | **Name**                 |  A custom name for the registry.  |
  | **Provider**             |  Select **Pack**.
  | **Registry Type**        |  Select **OCI**.                  |
  | **OCI Authentication Type**  |  Select **ECR**. Our OCI packs are hosted in the Amazon Elastic Container Registry (ECR). |
  | **Endpoint**             |  Provide the registry endpoint, and prefix the endpoint with `https://`. |
  | **Base Content Path**    |  Provide the registry base path. |

6. Enable the **Protected** toggle. Palette displays the **AWS authentication method** as **Credenditals**, the **Access key** field, and **Secret access key** field. Provide the credentials you received from our support team.

7. Click the **Validate** button. If the credentials you provided are correct, Palette displays a *Credentials validated* success message with a green check.

8. Click **Confirm**.

You have successfully added a tenant-level registry. Registries added at the tenant level can only be removed at that level.


## Validate

You can verify the registry has been added if Palette displayed a *Credentials validated* success message with a green check when you added the registry. Use these steps to further verify the registry is added.  

1. Log in to the [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu** select **Tenant Settings**. 

3. In the **Tenant Settings** menu, select **Registries**, and click on the **OCI Registries** tab. 

4. Verify the registry you added is listed and available.


## Resources

- [Add System-Level Registry](../enterprise-version/system-management/add-registry.md)
