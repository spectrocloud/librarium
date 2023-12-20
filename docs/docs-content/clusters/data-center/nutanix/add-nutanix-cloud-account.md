---
sidebar_label: "Add Nutanix Cloud Account"
title: "Add Nutanix Cloud Account"
description: "Learn how to add a Nutanix cloud account in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---

 Once the Private Cloud Gateway (PCG) is installed, the Nutanix cloud account must be added to Palette.

## Prerequisites

- A Nutanix cloud that a system administrator has registered with Palette. 

- A PCG installed that connects the Nutanix cloud with Palette. For guidance, refer to [Install Private Cloud Gateway](install-pcg.md).


## Add Cloud Account

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant administrator.

2. From the **left Main Menu**, select **Tenant Settings**. 

3. Next, select **Cloud Accounts** in the **Tenant Setting Menu**.

4. Locate Nutanix and click **Add Nutanix Cloud**.  

5. Fill out the following input values and click on **Confirm** to continue. 

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Name**| A custom name for the account. |
  | **Private Cloud Gateway**| Select the PCG from the list of deployed PCGs in your setup.|
  | **NUTANIX_USER**| The Prism Central user name.|
  | **NUTANIX_PASSWORD** | The Prism Central user password.|
  | **NUTANIX_ENDPOINT** | The Prism Central IP address or the fully qualified domain name (FQDN) assigned to Prism.|
  | **NUTANIX_PORT** | Specify the default port you assigned in the ``cloudClusterTemplate.yaml`` file. The default value is `9440`. |
  | **NUTANIX_INSECURE** | Specify the SSL behavior you used in the ``cloudClusterTemplate.yaml`` file. The default behavior is `false`. |

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2. From the **left Main Menu**, select **Tenant Settings**. 

3. Next, select **Cloud Accounts** in the **Tenant Settings Menu**. 

4. Verify the account you added is listed and available.


## Next Steps

Now that you have added a Nutanix account to Palette, you can start deploying Kubernetes clusters to your Nutanix infrastructure. To learn how to get started deploying Kubernetes clusters to Nutanix, review the [Create and Manage Nutanix Cluster](/clusters/data-center/nutanix/create-manage-nutanix-cluster.md) guide.