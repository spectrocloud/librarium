---
sidebar_label: "Create API Key"
title: "Create API Key"
description: "Create an API Key to authenticate API requests to Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management", "authentication", "api-key"]
---

You can create an API key to authenticate API requests to Palette. Use the API key to make REST API calls without
providing your username and password. The API keys are limited to a single tenant and user. If you are a tenant admin,
you can create API keys for any user within the tenant.

Once you create an API key, you cannot view the key again. Save the key in a secure location, such as a password
manager. This restrictions applies to both the Palette User Interface and the REST API. When you create an API key, you
can set an expiration date for the key. The expiration date can be further customized after the key creation.

Tenant administrators have the ability to create an API on behalf of any user within the tenant. Select the Tenant tab
below to learn more about creating an API key as a tenant admin.

## Prerequisites

<Tabs groupId="scope">
<TabItem label="User" value="user">

- You must have a Palette account, and you must be logged in.

</TabItem>
<TabItem label="Tenant" value="tenant">

- You must have a Palette account, and you must be logged in.

- Tenant administrator access.

</TabItem>
</Tabs>

## Create API Key

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

   ![Image that points to the user drop-down Menu and points to the API key link](/tutorials/deploy-app/devx_apps_deploy-app_create-api-key.png)

3. Click on **Add New API key**.

4. Fill out the following input fields:

| **Input Field **    | **Description**                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **API Key Name**    | Assign a name to the API key.                                                                                     |
| **Description**     | Provide a description for the API key.                                                                            |
| **Expiration Date** | Select an expiration date from the available options. You can also specify a custom date by selecting **Custom**. |

5. Click the **Generate** button.

6. Copy the API key and save it in a secure location, such as a password manager.

:::warning

Ensure you save the API key in a secure location. You will not be able to view the API key again. :::

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Click on **Add New API key**.

6. Fill out the following input fields:

| **Input Field **    | **Description**                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **API Key Name**    | Assign a name to the API key.                                                                                     |
| **Description**     | Provide a description for the API key.                                                                            |
| **User Name**       | Select the user to assign the API key.                                                                            |
| **Expiration Date** | Select an expiration date from the available options. You can also specify a custom date by selecting **Custom**. |

5. Click the **Generate** button.

6. Copy the API key and save it in a secure location, such as a password manager. Share the API key with the user you
   created the API key for.

:::warning

Ensure you save the API key in a secure location. You will not be able to view the API key again. :::

</TabItem>

</Tabs>

## Validate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Verify your API key is listed in the table.

4. Test your API against the Palette API. Issue the command below in your terminal, replace `PLACE_YOUR_API_KEY_HERE`
   with your API key.

```shell
API_KEY=PLACE_YOUR_API_KEY_HERE
```

5. Use `curl` to send the HTTP request to the Palette API using your API key.

```shell
curl --location 'https://api.spectrocloud.com/v1/apiKeys' \
--header 'Accept: application/json' \
--header "apiKey: $API_KEY"
```

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Verify the API key is listed in the table with the correct user name and expiration date.

</TabItem>
</Tabs>
