---
sidebar_label: "Register and Manage Azure Cloud Account"
title: "Register and Manage Azure Cloud Account"
description: "This guide will help you register and manage an Azure cloud account in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 10
---

Palette supports integration with Azure cloud accounts. This section explains how to create an Azure cloud account in
Palette. You can use any of the following authentication methods to register your cloud account.

## Prerequisites

- A [Palette Account](https://console.spectrocloud.com/).

* An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired regions. Refer to the
  [Required Permissions](./required-permissions.md) section for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

## Add Azure Cloud Account

<PartialsComponent category="palette-setup" name="azure-cloud-account" />

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts.

:::tip

Use the **three-dot Menu** in the row of the cloud account to edit Azure account information in Palette or remove the
account from Palette.

:::
