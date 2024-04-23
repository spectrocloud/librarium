---
sidebar_label: "Set up Palette"
title: "Set up Palette with Azure"
description: "Learn how to set up Palette with Azure."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "azure"]
---

In this guide, you will learn how to set up Palette for use with your AWS cloud account. These steps are required in
order to authenticate Palette and allow it to deploy host clusters.

## Prerequisites

The prerequisite steps to getting started with Palette on AWS are as follows.

- Sign up to [Palette](https://www.spectrocloud.com/get-started).

  - Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
    [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
    documentation for more information.

- Sign up to a public cloud account from
  [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account).

- Access to a terminal window.

- The utility `ssh-keygen` or similar SSH key generator software.

## Enablement

Palette needs access to your Azure cloud account in order to create and manage Azure clusters and resources.

### Add Azure Cloud Account

import AzureCloud from "../../_partials/_azure-cloud-account-setup.mdx";

<AzureCloud />

### Create and Upload an SSH Key

import SSHKey from '../../_partials/_create-upload-ssh-key.mdx';

<SSHKey />

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts.

## Next Steps

Now that you set up Palette for use with Azure, you can start deploying Kubernetes clusters to your Azure account. To
learn how to get started with deploying Kubernetes clusters to AWS, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your s host
cluster.
