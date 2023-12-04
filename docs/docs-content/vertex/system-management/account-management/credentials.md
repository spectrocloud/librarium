---
sidebar_label: "User Credentials"
title: "User Credentials"
description: "Update and manage the user credentials"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["vertex", "management", "account", "credentials"]
keywords: ["self-hosted", "vertex"]
---

You can manage the credentials of the admin user by logging in to the system console. You can also enable passkeys to access the admin panel. The passkey feature support both virtual passkey and physical passkey.

Use the sections below to learn how to manage user credentials.


## Change Password

Use the following steps to change the password of the admin user.

### Prerequisites

- Access to the Palette VerteX system console.

- Current password of the admin user.

### Steps

1. Log in to the Palette VerteX system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

2. From the **left Main Menu** select **My Account**.

3. In the field **Current Password** type the current password of the admin user.

4. In the field **New Password** type the new password for the admin user.

5. Type the new password again in the field **Re-Enter New Password**.

6. Click **Change Password** to save the changes.


### Validate 

1. Log out of the system console. You can log out by clicking the **Logout** button in the bottom right corner of the **left Main Menu**.

2. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

2. Use the new email address and your current password to log in to the system console.

A successful login indicates that the password has been changed successfully.


## Add Passkeys

VerteX supports the usage of passkeys (using the [WebAuthn Level2 protocol](https://developers.yubico.com/WebAuthn/Concepts/WebAuthn_Level_2_Features_and_Enhancements.html)) to authenticate. When you enable passkeys, the admin user will still be required to provide an email address and password to log in to the system console. However, the admin user will also be required to provide a passkey to log in to the system console. 

The passkey can be a password manager, a physical device, or a web browser that supports the WebAuthn Level2 protocol.
If you enable the passkeys, we recommend you create at least two passkeys for the admin user, in case you lose the ability to access the passkey.

:::danger

We recommend you to create at least two passkeys for the admin user, in case you lose the ability to access the passkey. If you lose all passkeys, you will not be able to log in to the system console. Contact the support team to discuss recovery options.

:::


### Prerequisites

- Access to the Palette VerteX system console.


- A password manager, physical device, or a web browser that supports the WebAuthn Level2 protocol to create passkeys. We recommend you use a physical device, such as a YubiKey, to create passkeys that comply with the standards and regulations of your organization.


:::caution

Not all passkey solutions are FIPS certified. Discuss with your security team to determine the best solution for your organization.

:::


### Add Passkey

Use the following steps to add a passkey for the admin user.

1. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

2. From the **left Main Menu** select **My Account**.

3. Click **Add passkey**.

  ![View of the adding passkey view](/vertex_account-management_credentials_add-passkey.png)

4. Provide a nickname for the passkey in the field **Passkey nickname**. Depending on the type of passkey you are adding, you will be propmted to select the type of passkey, such as password manager, physical device, or web browser.

5. The passkey will be added to the list of passkeys. You can use the **Delete** button to delete the passkey.


### Validate

1. Log out of the system console. You can log out by clicking the **Logout** button in the bottom right corner of the **left Main Menu**.

2. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

3. Use the new passkey to log in to the system console.

A successful login indicates that the passkey has been added successfully.

## Delete Passkeys

Use the following steps to delete a passkey for the admin user. We recommend you have at least two passkeys for the admin user, in case you lose the ability to access the passkey.

### Prerequisites

- Access to the Palette VerteX system console.

### Delete Passkey

1. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

2. From the **left Main Menu** select **My Account**.

3. Click the **Delete** button next to the passkey you want to delete.

4. A confirmation dialog will appear confirming the deletion of the passkey.

### Validate

1. Log out of the system console. You can log out by clicking the **Logout** button in the bottom right corner of the **left Main Menu**.

2. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

3. The deleted passkey should not be available in the list of passkeys.

