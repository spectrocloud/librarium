---
sidebar_label: "Access Local UI"
title: "Access Local UI"
description: "Instructions for accessing the Local UI."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

Local UI allows you to manage Edge hosts in your network locally, upload content such as images and packs, and create
Edge clusters without connections to a Palette installation.

This page guides you through how access the console, and log in, and manage your username and password.

## Log in to Local UI

### Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any Operating System (OS) user can be used to log into Local UI.

### Instructions

1. Ensure the Edge host is powered on.

2. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your Edge host. If you have
   access to the Edge host terminal, the address of Local UI console is displayed on the terminal screen. If you have
   changed the default port of the console, replace `5080` with Local UI port.

3. You will be prompted to log in. Enter your username and password to log in.

#### Login Security Behavior

In case of several consecutive unsuccessful login attempts, Local UI enforces a short delay before you can attempt to log in again. The delay starts at one second and doubles with each subsequent failed attempt. By default, the delay
mechanism begins after three unsuccessful login attempts.

If you reach the maximum number of consecutive unsuccessful login attempts, Local UI temporarily blocks access for your
user. By default, this lockout occurs after five consecutive failed attempts and lasts for 15 minutes.

You can customize the default values in the `user-data` file for Edge hosts built with Palette agent version
4.7.c-canvos or later. For more information, refer to the `stylus.localUI.login` parameters description in the
[Edge Installer Configuration Reference](../../edge-configuration/installer-reference.md#palette-agent-parameters).

### Validate

A successful login directs you to the Edge management console. Displayed is an overview of your Edge host.

## Log out of Local UI

### Prerequisites

- You are logged in to Local UI.

### Instructions

1. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your Edge host. If you have
   access to the Edge host terminal, the address of Local UI console is displayed on the terminal screen. If you have
   changed the default port of the console, replace `5080` with Local UI port.

2. From Local UI, navigate to the top right **User Menu**.

3. Click **Sign out**.

### Validate

A successful sign-out takes you back to the login page. You need to enter your credentials to log in again.

## Change User Password

You can change the password of an OS user through Local UI, through the terminal, or through the Palette API.

### Prerequisites

- Network access to the Edge host's port where Local UI is exposed. Default is port 5080.

- Credentials to log in to Local UI. Any OS user can be used to log into Local UI.

- Depending on how you want to change the password, additional prerequisites are required.

  <Tabs groupId="access-method">

  <TabItem value="Local UI">

  - Through Local UI: The `stylus.disablePasswordUpdate` parameter is set to `false` in the installer configuration user
    data. The default value of the parameter is `false`. For more information, refer to
    [Installer Reference](../../edge-configuration/installer-reference.md#site-parameters).

  </TabItem>

  <TabItem value="Terminal">

  - None.

  </TabItem>

  <TabItem value="API">

  - Through the API: [curl](https://curl.se/docs/install.html) or another similar tool you can use to make HTTP requests
    is installed on the machine you use to access the Edge Management API.

  </TabItem>

  </Tabs>

:::info

If the ability to change the password is disabled from Local UI, you can still log in to the terminal or use the Palette
API to update the password.

:::

### Instructions

<Tabs groupId="access-method">

<TabItem value="Local UI">

1. [Log in](#log-in-to-local-ui) to Local UI.

2. From Local UI, navigate to the top right **User Menu**.

3. Click **Update password**.

4. Provide your existing credentials and enter the new password.

</TabItem>

<TabItem value="Terminal">

1. Power up the Edge host.

2. Press the **ALT + RIGHT ARROW** keys, or **CTRL + ALT + F1** on a keyboard connected to the Edge host. Replace
   **ALT** with **OPTION** on a Mac keyboard. This will bring up the login screen for you to log in to the terminal.

   Alternatively, establish an SSH connection to the Edge host.

3. Issue the command `passwd`.

4. Enter your current password to authenticate.

5. Enter your new password and hit **Enter**. Enter the new password again to confirm.

</TabItem>

<TabItem value="API">

1. Use the POST /v1/users/default/login endpoint to generate an authentication token with your OS username and password.
   The following curl command is an example. Replace `edge-host-ip` with the IP of your Edge host and replace
   os-username and os-password with your OS user credentials.

   ```bash
   curl --location 'https://edge-host-ip:5080/v1/users/default/login' \
   --header 'Content-Type: application/json' \
   --data '{
       "username": "******",
       "password": "******"
   }'
   ```

   If your credentials are valid, you will receive a authorization token.

   ```json hideClipboard
   {
     "Token": {
       "Authorization": "******"
     }
   }
   ```

2. Issue the following command to change the password. Replace the authorization token with the one you obtained in the
   previous step. This will change the password of the user whose credentials you used to obtain the authorization
   token. You do not need to provide a username.

   ```bash
   curl --location 'https://edge-host-ip:5080/v1/users/default/password/reset' \
   -H 'Content-Type: application/json' \
   -H 'Accept: application/json' \
   --data '{
   "newPassword": "******",
   "oldPassword": "******"
   }'
   --header 'Authorization: *******'
   ```

   For more information about the API endpoint, refer to [Reset User Password](/api/edge-v1/v-1-user-password-reset/).

</TabItem>

</Tabs>

### Validate

1. [Log out](#log-out-of-local-ui) of the console.

2. Enter your new credentials to log back in and confirm that the password has been updated.
