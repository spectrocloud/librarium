---
sidebar_label: "Create a Registration Token"
title: "Create a Registration Token"
description: "Learn how to create a tenant registration token for Edge host registrations."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Registration tokens are tokens that are associated with a project in Palette. You need the registration token in the
following situations:

- When you need to register an Edge host with Palette. For more information, refer to
  [Edge Host Registration](./edge-host-registration.md).
- When you need to pair a locally managed cluster with Palette so that it can be managed centrally. For more
  information, refer to [Pair Local Cluster with Palette](../../local-ui/cluster-management/local-to-central.md).

To create a registration token, use the following steps.

## Prerequisites

- You Palette account has Tenant Admin access.

## Create Token

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left main menu and select **Tenant Settings**.

4. Select **Registration Tokens** in the **Tenant Settings Menu**.

5. Click **Add New Registration Token**.

6. Fill out the input fields for and **Confirm** your changes.

   - **Registration Token Name** - Used to name the token.

   - **Description** - An optional value used to explain the context usage of the token.

   - **Default Project** - Set a default project for Edge host registration.

   :::warning

   To ensure your hosts register with Palette, you must either set a default project for the token or provide the
   `stylus.site.projectName` parameter in the `user-data` file before building edge artifacts.

   :::

   - **Expiration Date** - Set an expiration date for the token.

7. Save the **Token** value.

## Validate

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the tenant scope.

3. Navigate to the left main menu and select **Tenant Settings**.

4. Select **Registration Tokens** in the **Tenant Settings Menu**.

5. Verify that the tenant registration token is available. Palette displays only the first and last four characters of
   the token value. To view the entire token, click the eye icon.

## Next Steps

If you have not built the Edge artifacts required to install Palette Edge on an Edge host, refer to
[EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md) to learn how to build the necessary artifacts and
use your registration token to configure the installer.

If you have already built the Edge artifacts and are currently performing an on-site deployment, you can put the
registration token in the site user data. Refer to [Apply Site User Data](../site-installation/site-user-data.md) for
more information.
