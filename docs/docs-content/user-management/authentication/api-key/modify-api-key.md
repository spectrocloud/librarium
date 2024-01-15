---
sidebar_label: "Edit API Key"
title: "Edit API Key"
description: "Modify an existing API Key in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["user-management", "authentication", "api-key"]
---

You can edit an API key you have already created. The following attributes of an API key can be changed:

| **Attribute**       | **Description**                        | **Edit** |
| ------------------- | -------------------------------------- | -------- |
| **API Key Name**    | The user assigned name of the API key. | ✅       |
| **Description**     | An optional description about the key. | ✅       |
| **Expiration Date** | The expiration date of the key.        | ✅       |
| **Value**           | The API key value.                     | ❌       |

Tenant administrators can edit an API key on behalf of any user within the tenant. Select the Tenant tab below to learn more about editing an API key as a tenant admin.

:::info

Tenant administrators can only edit the API key name, description, and expiration date. The API key value and the assigned user cannot be edited.

:::

## Prerequisites

<Tabs groupId="scope">
<TabItem label="User" value="user">

- You must have a Palette account, and you must be logged in.

- An existing API key.

</TabItem>
<TabItem label="Tenant" value="tenant">

- You must have a Palette account, and you must be logged in.

- An existing API key.

- Tenant administrator access.

</TabItem>
</Tabs>

## Edit API Key

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table, and click on the **three-dot Menu**.

4. Click on **Edit**.

5. Make the necessary changes to the API key attributes and click **Save**.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Identify your API key in the table, and click on the **three-dot Menu**.

6. Click on **Edit**.

7. Make the necessary changes to the API key attributes and click **Save**.

</TabItem>
</Tabs>

## Validate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table.

4. Verify the changes you made to the API key attributes are reflected in the table, including API key name, description, and expiration date.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Identify the altered API key in the table.

6. Verify the changes you made to the API key attributes are reflected in the table, including the API key name, description, and expiration date.

</TabItem>
</Tabs>
