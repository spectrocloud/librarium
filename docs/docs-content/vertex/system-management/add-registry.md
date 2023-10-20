---
sidebar_label: "Add a Registry"
title: "Add a Registry"
description: "Learn how to add a registry in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["vertex", "management", "registry"]
---

You can add a registry at the system level or tenant level. Registries added at the system level are available to all the tenants. Registries added at the tenant level are available only to that tenant. This section describes how to add a system-level registry. For steps to add a tenant-level registry, refer to [Add a Tenant-Level Registry]... 

## Prerequisites

- You need tenant admin privileges to add a system-level registry. 

## Add an OCI Registry

Use the following steps to add a system-level OCI registry.

1. Log in to the Palette VerteX system console.

2. From the left **Main Menu** select **Administration**. 

3. Select the **Pack Registries** tab and click on the **Add New Pack Registry** button.

4. Fill out the following input values to add an OCI registry.

  | **Field**            | **Description**                   |
  |----------------------|-----------------------------------|
  | Name                 |  A custom name for the registry.  |
  | Registry Type        |  Select **OCI**.                  |
  | Authentication Type  |  Select **ECR**. Our OCI packs are hosted in the Amazon Elastic Container Registry (ECR). |
  | Endpoint             |  Provide the endpoint `415789037893.dkr.ecr.us-east-1.amazonaws.com`, and prefix the endpoint with `https://`. |
  | Base Content Path    |  Provide the registry base path: `production` or `community`.  |

5. Enable the **Protected** toggle. Palette displays the **Access key** and **Secret access key** fields. Provide the credentials you received from our support team.

6. Click the **Validate** button. If the credentials you provided are correct, VerteX displays a *Credentials validated* success message with a green check.

7. Click **Confirm**.

8. To add both of the non-FIPS registries listed in the [Use non-FIPS Packs](../system-management/enable-non-fips-settings/enable-non-fips-settings.md) guide, repeat steps 4 through 7 and specify the other base path.

You have successfully added a system-level registry. Registries added at the system level can only be removed at that level.


## Validate

You can verify the registry has been added if VerteX displayed a *Credentials validated* success message with a green check when you added the registry. Use these steps to further verify the registry is added.  

1. Log in to the Palette VerteX system console.

2. From the left **Main Menu** select **Administration**. 

3. Select the **Pack Registries** tab and verify the registry you added is listed.

<!-- 2. Try creating a cluster profile and verify the registry you added is available and packs are displayed. For guidance, review the [Cluster Profiles](../../profiles/cluster-profiles/cluster-profiles.md) documentation. -->

