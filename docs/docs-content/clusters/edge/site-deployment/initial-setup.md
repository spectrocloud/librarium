---
sidebar_label: "Initial Edge Host Configuration"
title: "Initial Edge Host Configuration"
description: "Instructions for configuring the Edge host when booting up the Edge host for the first time."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

When you boot up an Edge host for the first time after installation, you will be prompted to configure the Edge host and
its network environment. You may already have specified some of these configurations in the **user-data** file in the
EdgeForge process or have supplied them with site-specific **user-data**, and can either keep them as they are or update
them during this step. For more information about EdgeForge and site user data, refer to
[EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md) and
[Apply Site User Data](./site-installation/site-user-data.md).

## Prerequisite

- An Edge host with Palette Edge 4.3 or later. The Edge host must be booting up for the first time since installation.

- A keyboard or another input device connected to the Edge host.

## Set up Edge Host

1. Power up the Edge host. Do not make any input and allow Palette to choose the boot option automatically.

2. A terminal user interface will display a **Create User** page. This allows you to create a Linux user with the
   necessary permissions to operate Palette. Enter a username and password to create a new user and press the Enter key
   to progress to the next screen.

   You may have already created a user in your **user-data** file. If so, you cannot use the same username.

3. Next, the terminal will display a console for you to provide hostname and network configurations to the Edge host.

   ![A terminal user interface showing displaying network configuration options](/cluster_edge_site-deployment_installation_initial-setup_tui.png)

   Check the existing hostname and, optionally, change it to a new one.

4. In **Network Adapters**, choose a network adapter that the Edge host will use to communicate with Palette.

   By default, the network adapter requests an IP automatically from the DHCP server. Optionally, you can also specify a
   static IP.

5. In **DNS Configuration**, specify the IP address of the primary and secondary name servers.

6. After you are satisfied with the configurations, navigate to **Quit** and hit enter to finish configuration.

## Validate

1. Shortly after you finish configuration, the terminal screen will display the hostname and network information of your
   Edge host.

2. Verify that all displayed information is consistent with your configurations.
