---
sidebar_label: "Revoke API Key"
title: "Revoke API Key"
description: "Revoke an existing API Key in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["user-management", "authentication", "api-key"]
---

You can revoke an API key you created in Palette. A tenant admin can also revoke an API key created by another user
within the tenant. A revoked API key cannot be used to authenticate API requests and requires a re-activation to be used
again.

Tenant administrators can revoke an API key in the tenant. Select the Tenant tab below to learn more about revoking an
API key as a tenant admin.

Use the steps outlined below for the workflow you want to perform:

- [Revoke API Key](#revoke-api-key)

- [Reactivate API Key](#reactivate-api-key)

## Revoke API Key

Use the following steps to revoke an API key.

### Prerequisites

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

### Revoke

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table, and click on the **three-dot Menu**.

4. Click on **Revoke**.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Identify your API key in the table, and click on the **three-dot Menu**.

6. Click on **Revoke**.

</TabItem>
</Tabs>

### Validate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table.

4. Verify the **Active** column in the table is set to **Inactive** for your API key.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Verify the **Active** column in the table is set to **Inactive** for the API key you revoked.

</TabItem>
</Tabs>

## Reactivate API Key

Use the following steps to reactivate an API key that has been revoked.

### Prerequisites

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

### Activate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table, and click on the **three-dot Menu**.

4. Click on **Re-activate**.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Identify the API key in the table you want to activate, and click on the **three-dot Menu**.

6. Click on **Re-activate**.

</TabItem>
</Tabs>

### Validate

<Tabs groupId="scope">
<TabItem label="User" value="user">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **User Menu**, and select **My API Keys**.

3. Identify your API key in the table.

4. Verify the **Active** column in the table is set to **Active** for your API key.

</TabItem>
<TabItem label="Tenant" value="tenant">

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Verify the **Active** column in the table is set to **Active** for the API key you re-activated.

</TabItem>
</Tabs>
