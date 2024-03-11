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

- Credentials to log in to the Local UI. Any OS user can be used to log into Local UI.

### Instructions

1. Ensure the Edge host is powered on.

2. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your Edge host. If you have
   access to the Edge host terminal, the address of the Local UI console is displayed on the terminal screen. If you
   have changed the default port of the console, replace `5080` with the Local UI port.

3. You will be prompted to log in. Enter your username and password to log in.

### Validate

A successful login directs you to the Edge management console. Displayed is an overview of your Edge host.

## Log out of Local UI

### Prerequisites

- You are logged in to Local UI.

### Instructions

1. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your Edge host. If you have
   access to the Edge host terminal, the address of the Local UI console is displayed on the terminal screen. If you
   have changed the default port of the console, replace `5080` with the Local UI port.

2. From the Local UI, navigate to the top right **User Menu**.

3. Click **Sign out**.

### Validate

A successful sign-out takes you back to the login page. You need to enter your credentials to log in again.

## Change User Password

### Prerequisites

- Network access to the Edge host's port where Local UI is exposed. Default is port 5080.

- Credentials to log in to the Local UI. Any OS user can be used to log into Local UI.

### Instructions

1. [Log in](#log-in-to-edge-management-console) to the Local UI.

2. From the Local UI, navigate to the top right **User Menu**.

3. Click **Update password**.

4. Provide your existing credentials and enter the new password.

### Validate

1. [Log out](#log-out-of-edge-management-console) of the console.

2. Enter your new credentials to log back in and confirm that the password has been updated.
