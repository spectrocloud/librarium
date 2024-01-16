---
sidebar_label: "Delete API Key"
title: "Delete API Key"
description: "Delete an existing API Key in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["user-management", "authentication", "api-key"]
---

You can delete an API key from Palette. A tenant admin can also delete an API key created by another user within the tenant. Use the following steps to delete an API key.

Tenant administrators can delete an API key on behalf of any user within the tenant. Select the Tenant tab below to learn more about deleting an API key as a tenant admin.

## Prerequisites

<Tabs groupId="scope">
<TabItem label="User" value="user">

- You must have a Palette account, and you must be logged in.

- You must have an API key created. Refer to the [Create API Key](create-api-key.md) section for more information.

</TabItem>
<TabItem label="Tenant" value="tenant">

- You must have a Palette account, and you must be logged in.

- Tenant administrator access.

- An existing API key must be available.

</TabItem>
</Tabs>

## Delete API Key

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table, and click on the **three-dot Menu**.

4. Click on **Delete**.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Identify the API key in the table you want to remove, and click on the **three-dot Menu**.

6. Click on **Delete**.

</TabItem>
</Tabs>

## Validate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Verify your API key is not listed in the table.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Verify the API key is not listed in the table.

</TabItem>
</Tabs>
