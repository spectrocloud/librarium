---
sidebar_label: "Register and Manage Cox Edge Accounts"
title: "Register and Manage Cox Edge Accounts"
description: "Learn how to add and manage a Cox Edge account in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["public cloud", "cox edge"]
---

Palette supports integration with Cox Edge accounts and account environments. This section explains how to create a Cox
Edge account in Palette.

## Add Cox Edge Account

To add a Cox Edge account to Palette, use the following instructions.

## Prerequisites

- A [Spectro Cloud](https://console.spectrocloud.com) account.

- A [Cox Edge](https://portal.coxedge.com/login) account.

- Tenant admin access in Palette.

- Your Cox Edge organization id. Ask your system administrator for this value or use the API endpoint
  `api/v2/organizations` to retrieve the organization id.

  ```shell
  curl --silent  "https://portal.coxedge.com/api/v2/organizations" \
  --header "MC-Api-Key: YourAPIkeyHere" | jq '.data[] | {id}'
  ```

  ```shell hideClipboard
  {
    "id": "268ce256-15ef-465f-bc0f-952fac3e7c1e"
  }
  ```

## Enablement

You can use the steps below or the interactive guide to help you add a Cox Edge account to Palette. Click on the first
image link to navigate the destination site with the tutorial at right.

<iframe
  src="https://scribehow.com/embed/Add_Cox_Edge_Account_to_Palette__kgxQ9zckTo2aIM587hmdYw?removeLogo=true"
  width="800"
  height="640"
  allowfullscreen
  frameborder="0"
></iframe>

1. Log in to the [Cox Edge](https://portal.coxedge.com/login) portal.

2. Navigate to the drop-down **User Menu** and click on **API Credentials**.

3. Select **Generate API key**.

4. Give the key a name and select **Generate**.

5. Copy the API key value to a secure location. You will use this value in the future.

6. Copy the API endpoint URL. The API endpoint is located above the table that lists all your API keys.

7. Click the **four-tile Home** button at the top and select **Edge Compute**.

8. Next, click on the environment drop-down menu and select **Add Environment** to create a compute environment. A
   compute environment is required when adding a Cox Edge account to Palette. If you already have a compute environment
   available, skip to step 11.

9. Provide a name and description and click **Next**.

10. Add members to the compute environment. You can also add members at a later point. Apply the changes.

11. Open another browser tab and log in to [Palette](https://console.spectrocloud.com) as a Tenant admin.

12. Go to **Tenant Settings** > **Cloud Accounts** and click **+Add Cox Edge Account**.

13. Fill out the following input fields.

    - Account Name: Assign a name to the Cox Edge account.

    - API Base URL: Add the API endpoint URL you copied down earlier. You can locate this value in the API Key overview
      page in the Cox Edge portal.

    - API Key: Provide the API key you generated earlier.

    - Organization Id: Ask your system administrator for this value or use the Cox Edge API to retrieve the organization
      id.

    - Environment: This optional field allows you to enter name of the environment you wish to target if you have one.

    - Service: Use the value `edge-services`.

14. Click **Validate** to confirm you have access to the Cox Edge account.

15. Select **Confirm** to add the Cox Edge account to Palette.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings** to ensure you are in the **Cloud Accounts** page.

3. Your Cox Edge account is now listed with all the other infrastructure provider accounts.

4. You can also deploy a cluster to Cox Edge to validate everything is working. Use the
   [Create and Manage Cox IaaS Cluster](create-cox-cluster.md) guide to create and deploy a cluster to Cox Edge.
