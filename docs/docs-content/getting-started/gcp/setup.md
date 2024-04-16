---
sidebar_label: "Set up Palette"
title: "Set up Palette with GCP"
description: "Learn how to set up Palette with GCP."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started"]
---

In this guide, you learn how to set up Palette for use with your AWS cloud account. These steps are required in order to
authenticate Palette and allow it to deploy host clusters.

## Enablement

The prerequisite steps to getting started with Palette on GCP are as follows.

- Sign up to [Palette](https://www.spectrocloud.com/get-started).

  - Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
    [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
    documentation for more information.

- Sign up to a public cloud account from [GCP](https://cloud.google.com/docs/get-started).

  - Register the cloud account in Palette. The
    [Register and Manage GCP Accounts](../../clusters/public-cloud/gcp/add-gcp-accounts.md) page provides additional
    guidance.

- Create an SSH key and upload it to Palette. Check out the [Create and Upload an SSH Key](../../clusters/cluster-management/ssh-keys.md) guide for more information.

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **GCP** with all other available GCP cloud accounts.

## Next Steps

Now that you set up Palette for use with Google Cloud, you can start deploying Kubernetes clusters to your GCP account.
To learn how to get started with deploying Kubernetes clusters to GCP, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your host cluster.
