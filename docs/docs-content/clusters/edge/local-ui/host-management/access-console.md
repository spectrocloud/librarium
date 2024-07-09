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

:::preview

:::

This page guides you through how access the console, and log in, and manage your username and password.

## Log in to Local UI

### Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- The Edge host does not have a connection to a Palette instance and the installation is conducted with the
  `installationMode` parameter set to `airgap`. For more information, refer to
  [Installer Configuration](../../edge-configuration/installer-reference.md).

- You have completed or skipped the initial configuration of the Edge host. For more information, refer to
  [Edge Host Initial Configuration](../../site-deployment/initial-setup.md).

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any Operating System (OS) user can be used to log into Local UI.

### Instructions

1. Ensure the Edge host is powered on.

2. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your Edge host. If you have
   access to the Edge host terminal, the address of Local UI console is displayed on the terminal screen. If you have
   changed the default port of the console, replace `5080` with Local UI port.

3. You will be prompted to log in. Enter your username and password to log in.

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

  - Through Local UI: The `stylus.disablePasswordUpdate` parameter is not set to `true` in the installer configuration
    user data. The default value of the parameter is `false`.

  - Through the terminal: A keyboard connected to the Edge host for input.

  - Through the API: [curl] is installed on the machine you plan to use to change the password. You also need to be able
    access port 5080 of your Edge host from the machine.

  :::info

  If the ability to change the password is disabled from Local UI, you can still log in to the terminal or use the
  Palette API to update the password. For more information about resetting passwords with Palette API, refer to
  [Resets User Password](https://docs.spectrocloud.com/api/edge-v1/v-1-user-password-reset/).

  :::

### Instructions

<Tabs>

<TabItem value="Local UI">

1. [Log in](#log-in-to-local-ui) to Local UI.

2. From Local UI, navigate to the top right **User Menu**.

3. Click **Update password**.

4. Provide your existing credentials and enter the new password.

</TabItem>

<TabItem value="Terminal">

1. Press **Alt + right arrow key**, or **Ctrl + Alt + F1**. Replace **Alt** with **Options** on a Mac keyboard. This
   will bring up the login screen for you to log in to the terminal. Alternatively, establish an SSH connection to the
   Edge host.

2. Issue the command `passwd`.

3. Enter your current password to authenticate.

4. Enter your new password and hit **Enter**. Enter the new password again to confirm.

</TabItem>

<TabItem value="API">

1. Use the POST /v1/users/default/login endpoint to generate an authentication token with your OS username and password.
   The following curl command is an example. Replace edge-host-ip with the IP of your Edge host and replace os-username
   and os-password with your OS user credentials.

   ```bash
   curl --location 'https://edge-host-ip:5080/v1/users/default/login' \
    --header 'Content-Type: application/json' \
    --data '{
        "username": "os-username",
        "password": "os-password"
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
   curl -L -X POST 'https://edge-host-ip:5080/v1/users/default/password/reset' \
   -H 'Content-Type: application/json' \
   -H 'Accept: application/json' \
   --data-raw '{
   "newPassword": "string",
   "oldPassword": "string"
   }'
   --header 'Authorization: *******'
   ```

</TabItem>

</Tabs>

### Validate

1. [Log out](#log-out-of-local-ui) of the console.

2. Enter your new credentials to log back in and confirm that the password has been updated.
