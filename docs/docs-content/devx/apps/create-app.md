---
sidebar_label: "Create and Manage Apps"
title: "Create and Manage Apps"
description: "Learn how to create and manage an app in Palette Dev Engine."
hide_table_of_contents: false
sidebar_position: 0
tags: ["devx", "app mode", "pde"]
---

Use the following steps to create and deploy an app to a virtual cluster.

## Prerequisite

- An application profile. Use the guide
  [Create an App Profile](../../profiles/app-profiles/create-app-profiles/create-app-profiles.md) to learn about types
  of app profiles you can create.

:::info

A tutorial is available to help you learn how to use Palette Dev Engine by deploying an application. Check out
[Deploy an Application using Palette Dev Engine](../../tutorials/pde/deploy-app.md) to get started with Palette Dev
Engine.

:::

## Create a New App

1. Login to [Palette](https://console.spectrocloud.com).

2. Navigate to the top right **User Menu** and select **Switch to App Mode**.

3. Select the **Apps** from the left **Main Menu** and click on **New App**.

4. Next, provide the following information to the app creation wizard.

   - **Application name:** A custom name for the application.

   - **App Profile**: Select an app profile from the existing list by clicking **Select App Profile**.

5. Choose a Virtual Cluster deployment option. You have two options available.

   - **Deploy In A Palette Virtual Cluster**

   - **Deploy In An Existing Palette Virtual Cluster**

     Create a new virtual cluster or select an existing one from the available list, depending on your choice

6. Click on **Create an application** to complete the application wizard.

The application will begin the deployment process. This may take a few minutes, depending on the number of layers and
types of applications specified in the app profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the top right **User Menu** and select **Switch to App Mode**.

3. Select the **Apps** from the left **Main Menu** and click on **New App**.

4. Review the list and select your application to view the details page.

5. Ensure the **Status** is marked as **Deployed**.
