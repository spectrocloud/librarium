---
sidebar_label: "Manage Password Blocklist"
title: "Manage Password Blocklist"
description: "Learn how to manage the password blocklist in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["vertex", "management", "account", "credentials"]
keywords: ["self-hosted", "vertex"]
---

You can manage a password blocklist to prevent users from using common or weak passwords. The password blocklist is a
list of passwords that are not allowed to be used by users when setting or updating their passwords. The password
blocklist is enforced when users set or update their passwords.

:::info

Refer to [Password Requirements and Security](credentials.md#password-requirements-and-security) to learn more about the
password requirements and security in Palette VerteX.

:::

The internal System API is used to manage the password blocklist. Review the following sections to learn how to maintain
the password blocklist.

## Update the Password Blocklist

Use the following steps to insert new passwords into the password blocklist.

### Prerequisites

- Access to the Palette VerteX system console.

- The role of Root Administrator or Operations Administrator.

- curl or any other tool to make HTTP requests.

- Access to a shell terminal.

:::warning

If you enabled passkeys for your system administrator account then the System API login endpoint will be disabled. Refer
to the [Passkeys and API Access](./credentials.md#passkeys-and-api-access) for guidance on how to use passkeys to access
the System API.

:::

### Insert Passwords into the Blocklist

1.  Open a terminal session and log in to the Palette VerteX System API by using the `/v1/auth/syslogin` endpoint. Use
    the `curl` command below and replace the URL with the custom domain URL you assigned to Palette VerteX or use the IP
    address. Ensure you replace the credentials below with your system console credentials.

    ```bash
    curl --location 'https://vertex.example.com/v1/auth/syslogin' \
    --header 'Content-Type: application/json' \
    --data '{
      "password": "**********",
      "username": "**********"
    }'
    ```

    :::tip

    If you are using the default self-signed certificate, you can use the `--insecure` flag to bypass the certificate
    check.

    :::

    Output

    ```json hideClipboard
    {
      "Authorization": "**********.",
      "IsPasswordReset": true
    }
    ```

2.  Using the output you received, copy the authorization value to your clipboard and assign it to a shell variable.
    Replace the authorization value below with the value from the output.

    ```shell hideClipboard
    TOKEN=**********
    ```

3.  Use the `curl` command below to insert new passwords into the password blocklist. Replace the URL with the custom
    domain URL you assigned to Palette VerteX or use the IP address. Ensure you replace the `TOKEN` value with the value
    you assigned to the shell variable.

    ```bash
    curl --location 'https://vertex.example.com/v1/sys/passwords' \
    --header "Authorization: $TOKEN" \
    --header 'Content-Type: application/json' \
    --data '{
      "spec": {
          "passwords": [
                "Password",
                "password",
                "123456",
                "qwerty",
          ]
      }
    }'
    ```

    :::info

    The payload expects the `spec.passwords`field to be an array of strings. You can add as many passwords as you want
    as long as they are separated by a comma.

    :::

4.  The endpoint returns a `204` status code if the operation is successful. No output is returned. If the operation
    fails, the endpoint returns an error message. In case of an error, verify the authorization token is valid and the
    password blocklist is in the expected format.

### Validate

To validate the password blocklist, use the following steps.

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide.

2. From the **left Main Menu** select **My Account**.

3. In the field **Current Password** type the current password of your admin user.

4. In the field **New Password** type one of the passwords you added to the password blocklist.

5. Type the new password again in the field **Re-Enter New Password**.

6. Click **Change Password** to save the changes.

7. An error message is displayed and the password is not updated. The error message indicates the password is in the
   blocklist.
