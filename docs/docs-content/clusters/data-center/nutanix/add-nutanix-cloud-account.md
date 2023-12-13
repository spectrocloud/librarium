---
sidebar_label: "Add Nutanix Cloud Account"
title: "Add Nutanix Cloud Account"
description: "Learn how to add a Nutanix cloud account in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---

 Once the Private Cloud Gateway (PCG) is installed, the Nutanix cloud account must be added to Palette. The required fields to add the cloud are pre-defined by the System Administrator during the cloud registration process. These cloud-specific fields vary based on the cloud type.

## Prerequisites

- A Nutanix cloud and cloud account that a System Administrator has registered with Palette.


## Add Cloud Account

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the **left Main Menu**, select **Tenant Settings**. 

3. Next, select **Cloud Accounts** in the **Tenant Settings** menu.

4. Locate Nutanix and click **+ Add Nutanix Cloud**.  

5. Fill out the following input values and click on **Confirm** to continue. 

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Name**| A custom name for the account. |
  | **Private Cloud Gateway**| This name is auto-filled based on the name you provided when you installed the PCG.|
  | **NUTANIX_USER**| Prism Central user name.|
  | **NUTANIX_PASSWORD** | Prism Central password.|
  | **NUTANIX_ENDPOINT** | Prism Central IP address or fully qualified domain name (FQDN).|
  | **NUTANIX_PORT** | Specify the default in the ``cloudClusterTemplate.yaml``: 9440 |
  | **NUTANIX_INSECURE** | Specify the default in the ``cloudClusterTemplate.yaml``: false |

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the **left Main Menu**, select **Tenant Settings**. 

3. Next, select **Cloud Accounts** in the **Tenant Settings** menu. 

4. Verify the account you added is listed and available.


## Next Steps

Now that you have added a Nutanix account to Palette, you can start deploying Kubernetes clusters to your Nutanix infrastructure. To learn how to get started with deploying Kubernetes clusters to Nutanix, review the [Create and Manage Nutanix] guide.