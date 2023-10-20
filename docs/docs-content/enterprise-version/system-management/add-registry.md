---
sidebar_label: "Add System-Level Registry"
title: "Add System-Level Registry"
description: "Learn how to add a system-level registry in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["enterprise", "management", "registry"]
---

You can add a registry at the system level or tenant level. Registries added at the system level are available to all the tenants. Registries added at the tenant level are available only to that tenant. This section describes how to add a system-level registry. For steps to add a tenant-level registry, refer to [Add a Tenant-Level Registry]... 

## Prerequisites

- You need tenant admin privileges to add a system-level registry. 

## Add an OCI Registry

Use the following steps to add a system-level OCI registry.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu** select **Administration**. 

3. Select the **Pack Registries** tab and click on the **Add New Pack Registry** button.

4. Fill out the following input values to add an OCI registry. Contact our support team to obtain the registry endpoint, base path, and credentials.

  | **Field**            | **Description**                   |
  |----------------------|-----------------------------------|
  | Name                 |  A custom name for the registry.  |
  | Registry Type        |  Select **OCI**.                  |
  | Authentication Type  |  Select **ECR**. Our OCI packs are hosted in the Amazon Elastic Container Registry (ECR). |
  | Endpoint             |  Provide the registry endpoint, and prefix the endpoint with `https://`. |
  | Base Content Path    |  Provide the registry base path. |

5. Enable the **Protected** toggle. Palette displays the **Access key** and **Secret access key** fields. Provide the credentials you received from our support team.

6. Click the **Validate** button. If the credentials you provided are correct, VerteX displays a *Credentials validated* success message with a green check.

7. Click **Confirm**.

You have successfully added a system-level registry. Registries added at the system level can only be removed at that level.


## Validate

You can verify the registry has been added if Palette displayed a *Credentials validated* success message with a green check when you added the registry. Use these steps to further verify the registry is added.  

1. Log in to the [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu** select **Administration**. 

3. Select the **Pack Registries** tab and verify the registry you added is listed.

<!-- 2. Try creating a cluster profile and verify the registry you added is available and packs are displayed. For guidance, review the [Cluster Profiles](../../profiles/cluster-profiles/cluster-profiles.md) documentation. -->

