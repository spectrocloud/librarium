---
sidebar_label: "Manage User Credentials"
title: "Manage User Credentials"
description: "Update and manage the user credentials"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["vertex", "management", "account", "credentials"]
keywords: ["self-hosted", "vertex"]
---

You can manage the credentials of the admin user by logging in to the system console. You can also enable passkeys to
access the admin panel. The passkey feature supports both virtual passkey and physical passkey.

Use the sections below to learn how to manage user credentials.

## Change Password

Use the following steps to change the password of the admin user.

### Prerequisites

- Access to the Palette VerteX system console.

- Current password of the admin user.

- A Simple Mail Transfer Protocol (SMTP) server must be configured in the system console. Refer to
  [Configure SMTP](../smtp.md) page for guidance on how to configure an SMTP server.

### Steps

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide.

2. From the **left Main Menu** select **My Account**.

3. In the field **Current Password** type the current password of the admin user.

4. In the field **New Password** type the new password for the admin user.

5. Type the new password again in the field **Re-Enter New Password**.

6. Click **Change Password** to save the changes.

### Validate

1. Log out of the system console. You can log out by clicking the **Logout** button in the bottom right corner of the
   **left Main Menu**.

2. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console)
   guide.

3. Use the new email address and your current password to log in to the system console.

A successful login indicates that the password has been changed successfully.

## Add Passkeys

VerteX supports the usage of passkeys (using the
[WebAuthn Level2 protocol](https://developers.yubico.com/WebAuthn/Concepts/WebAuthn_Level_2_Features_and_Enhancements.html))
to authenticate. When you enable passkeys, the admin user will still be required to provide an email address and
password to log in to the system console. However, the admin user will also be required to provide a passkey to log in
to the system console.

The passkey can be a password manager, a physical device, or a web browser that supports the WebAuthn Level2 protocol.

:::danger

We recommend you create at least two passkeys for the admin user, in case you lose the ability to access the passkey. If
you lose all passkeys, you will not be able to log in to the system console. Contact the support team to discuss
recovery options.

:::

### Prerequisites

- Access to the Palette VerteX system console.

- A password manager, physical device, or a web browser that supports the WebAuthn Level2 protocol to create passkeys.
  We recommend you use a physical device, such as a YubiKey, to create passkeys that comply with the standards and
  regulations of your organization.

  :::warning

  Not all passkey solutions are FIPS certified. Discuss with your security team to determine the best solution for your
  organization.

  :::

- If you are using a self-signed certificate, or a certificate signed by an unknown certificate authority (CA) for
  VerteX that is not trusted by the browser, you may have to add the certificate to the operating system's trust store
  or certificate store before you can add passkeys. Different browsers behave differently in how strict they are in
  enforcing the trust of the certificate. For example, Chrome is more strict than Firefox. Refer to the documentation of
  your operating system for guidance on how to add a certificate to the trust store or certificate store:

  - [MacOS](https://support.apple.com/guide/keychain-access/add-certificates-to-a-keychain-kyca2431/mac) - Use the
    application, Keychain Access, to add the server certificate to the system keychain.

  - [Windows](https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/certmgr) - Use the command-line tool
    `CertMgr` in PowerShell to add the server certificate to the local machine store.

### Add Passkey

Use the following steps to add a passkey for the admin user.

1. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console)
   guide.

2. From the **left Main Menu** select **My Account**.

3. Click **Add passkey**.

![View of the adding passkey view](/vertex_account-management_credentials_add-passkey.png)

4. Provide a nickname for the passkey in the field **Passkey nickname**. Depending on the type of passkey you are
   adding, you will be prompted to select the type of passkey, such as password manager, physical device, or web
   browser.

5. The passkey will be added to the list of passkeys. You can use the **Delete** button to delete the passkey.

### Validate

1. Log out of the system console. You can log out by clicking the **Logout** button in the bottom right corner of the
   **left Main Menu**.

2. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console)
   guide.

3. Use the new passkey to log in to the system console. If your passkey has additional security features, such as a PIN,
   you will be prompted to provide the PIN before you can log in to the system console.

A successful login indicates that the passkey has been added successfully.

## Delete Passkeys

Use the following steps to delete a passkey for the admin user. We recommend you have at least two passkeys for the
admin user, in case you lose the ability to access the passkey.

### Prerequisites

- Access to the Palette VerteX system console.

### Delete Passkey

1. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console)
   guide.

2. From the **left Main Menu** select **My Account**.

3. Click the **Delete** button next to the passkey you want to delete.

4. A confirmation dialog will appear confirming the deletion of the passkey.

### Validate

1. Log out of the system console. You can log out by clicking the **Logout** button in the bottom right corner of the
   **left Main Menu**.

2. Log in to the system console. Refer to [Access the System Console](../system-management.md#access-the-system-console)
   guide.

3. The deleted passkey should not be available in the list of passkeys.

## Passkeys and API Access

When you enable passkeys, you cannot authenticate system API calls with the JSON Web Token (JWT) returned by the login
endpoint. The normal flow to access the system console API endpoint is to provide the username and password of the admin
user to the `/v1/auth/syslogin` endpoint and use the JWT token returned in future API requests by providing the token in
the `Authorization` header.

```bash
curl --insecure --location 'https://vertex.domain.example/v1/auth/syslogin' \
 --header 'Content-Type: application/json' \
 --data '{
  "password": "**********",
  "username": "**********"
 }'
```

```json hideClipboard
{
  "Authorization": "**********",
  "IsEmailSet": true,
  "IsEmailVerified": false,
  "IsMfa": true,
  "IsPasswordReset": true
}
```

However, when you enable passkeys, you cannot use the JWT token returned by the `/v1/auth/syslogin` endpoint to access
the system API endpoints. To circumvent this limitation, you must use the Authorization cookie created when you
authenticate into the system console through a web browser. Use the following steps to access the system API endpoints
with passkeys enabled.

### Prerequisites

- Access to the Palette VerteX system console. Refer to
  [Access the System Console](../system-management.md#access-the-system-console) for guidance on how to access the
  system console.

- The admin user must have at least one passkey configured.

- An internet browser that contains developer tools.

### Steps

The following steps assume you are using the Chrome browser. The steps may vary slightly if you are using a different
browser.

1. Log in to the system console.

2. Open up the browser's developer tools. You can open the developer tools by clicking the **three-dot Menu** in the top
   right corner of the browser and select **More tools** and then **Developer tools**.

3. Navigate to the **Application** tab in the developer tools window.

4. From the **left Main Menu** select **Storage** and expand the **Local Storage** section.

5. Click on the entry that matches the URL of the system console. For example, if the URL of the system console is
   `https://vertex.domain.example`, then click on the entry that matches `https://vertex.domain.example`.

6. Copy the value of the **lscache-loginauthToken** cookie. The image below highlights the sections of importance.

![View of the auth cookie](/vertex_account-management_credentials_browser-cache-token.png)

7. Access the system console API endpoints using the Authorization header with the value of **lscache-loginauthToken**
   cookie. .

### Validate

You can validate that you can access the system console API endpoint by attempting a query. For example, you can query
the `/v1/system/tenant` endpoint to get information about the available tenants.

1. Use the following `curl` command and replace the placeholder `REPLACE_ME` with the value of the
   **lscache-loginauthToken** cookie and use your Vertex URL instead of `vertex.domain.example` that is used in the
   example.

```bash
curl --location 'https://vertex.domain.example/v1/tenants' \
--header 'Authorization: REPLACE_ME'
```

```json hideClipboard
{
  "items": [
    {
      "metadata": {
        "annotations": {
          "ownerUid": "sysadmin",
          "permissions": "tag.update,tenant.delete,tenant.get,tenant.list,tenant.update",
          "scope": "tenant",
          "scopeVisibility": "5",
          "tenantUid": "657cf2da4be57501577a0ffc"
        },
        "creationTimestamp": "2023-12-16T00:44:10.010Z",
        "deletionTimestamp": "0001-01-01T00:00:00.000Z",
        "lastModifiedTimestamp": "2023-12-16T00:44:10.955Z",
        "uid": "657cf2da4be57501577a0ffc"
      },
      "spec": {
        "address": {},
        "authType": "password",
        "defaultLoginMode": "devops",
        "orgEmailId": "example@spectrocloud.com",
        "orgName": "example",
        "planUid": "123456789"
      },
      "status": {
        "cleanUpStatus": {
          "cleanUpTimestamp": "0001-01-01T00:00:00.000Z",
          "cleanedResources": null,
          "isCompleted": false,
          "isInProgress": false
        },
        "isActive": true,
        "toBeDeleted": false
      }
    }
  ],
  "listmeta": {
    "continue": "",
    "count": 1,
    "limit": 50,
    "offset": 0
  }
}
```

2. A successful query indicates that you are able to access the system console API endpoint with passkeys enabled. Use
   the same method to access other system console API endpoints.
