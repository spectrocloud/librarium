---
sidebar_label: "Add a Registry"
title: "Add a Registry"
description: "Learn how to add a registry in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["vertex", "management", "registry"]
---

You can add a registry at the system level or the tenant level. Registries added at the system level are available to all the tenants. Registries added at the tenant level are available only to that tenant. This section describes how to add a system-level registry. For guidance on adding a registry at the tenant scope, check out [Add a Tenant-Level Registry](../../tenant-settings/add-registry.md).

## Prerequisites

- Access to the Palette VerteX system console. 

## Add an OCI Registry

Use the following steps to add a system-level OCI registry. 

To add our non-FIPS registries, refer to the table in the [Use non-FIPS Packs](../system-management/enable-non-fips-settings/use-non-fips-addon-packs.md) guide for endpoint and base path details. You will need to repeat these steps and specify the base path for each repository you want to target in the registry.

1. Log in to the Palette VerteX system console. Refer to [Access the System Console](system-management.md#access-the-system-console) guide.

2. From the left **Main Menu** select **Administration**. 

3. Select the **Pack Registries** tab and click on the **Add New Pack Registry** button.

4. Fill out the following input values to add an OCI registry. 

  | **Field**            | **Description**                   |
  |----------------------|-----------------------------------|
  | **Name**                 |  A custom name for the registry.  |
  | **Registry Type**        |  Select **OCI**.                  |
  | **OCI Authentication Type**  |  Select **ECR**. Our OCI packs are hosted in the Amazon Elastic Container Registry (ECR). |
  | **Endpoint**             |  Provide the URL to the registry endpoint. |
  | **Base Content Path**    |  Provide the base path or namespace of the repository you want to target in the registry. |

5. If you are adding an unprotected OCI registry, click the **Validate** button. Otherwise, enable the **Protected** toggle and provide the appropriate credentials in the fields that VerteX displays. 

  If the credentials you provided are correct, a *Credentials validated* success message with a green check is displayed.

6. Click **Confirm** to complete adding the registry.


You have successfully added a system-level registry. Registries added at the system level can only be removed at that level.


## Validate

You can verify the registry has been added if VerteX displayed a *Credentials validated* success message with a green check when you added the registry. Use these steps to further verify the registry is added.  

1. Log in to the Palette VerteX system console. Refer to [Access the System Console](system-management.md#access-the-system-console) guide.

2. From the left **Main Menu** select **Administration**. 

3. Select the **Pack Registries** tab and verify the registry you added is listed and available.


## Resources

- [Add a Tenant-Level Registry](../../tenant-settings/add-registry.md)

- [Use non-FIPS Packs](../system-management/enable-non-fips-settings/use-non-fips-addon-packs.md)