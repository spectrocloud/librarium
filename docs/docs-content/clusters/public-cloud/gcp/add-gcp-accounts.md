---
sidebar_label: "Register and Manage GCP Accounts"
title: "Register and Manage GCP Accounts"
description: "Learn how to add a GCP account to Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["public cloud", "gcp"]
---

Palette supports integration with Google Cloud Platform (GCP) accounts. This section explains how to create a GCP cloud
account in Palette.

## Prerequisites

- You must have a GCP service account available for use with Palette. For detailed instructions on creating a service
  account, refer to
  [Creating and managing service accounts](https://cloud.google.com/iam/docs/creating-managing-service-accounts).

- The service account must, at a minimum, have the following roles.

  - Compute Admin
  - Service Account User
  - Storage Object Viewer

  {" "}

  <br />

  :::info

  Alternatively, you can create a custom role and assign Palette the required GCP permissions. Check out the
  [Required IAM Permission](required-permissions.md) for a detailed list of all permissions.

  :::

- Ensure you have access to the JSON credential file for your service account. For additional guidance, refer to the
  [GCP Credentials](https://developers.google.com/workspace/guides/create-credentials) documentation.

## Create Account

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Cloud Accounts** and click on **Add GCP Account**.

4. In the cloud account creation wizard, provide the following information:

   - **Account Name:** Custom name for the cloud account.

   - **JSON Credentials:** The JSON credentials object.

   {" "}

   <br />

   :::info

   You can use the **Upload** button to upload the JSON file you downloaded from the GCP console.

   :::

5. Click the **Validate** button to validate the credentials.

6. When the credentials are validated, click on **Confirm** to save your changes.

## Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.

2. To review the list of cloud accounts, navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Next, click on **Cloud Accounts**. Your newly added GCP account is listed under the GCP section.

## Next Steps

Now that you have added an AWS account to Palette, you deploy clusters to your GCP account. To learn how to get started
with deploying Kubernetes clusters to GCP, check out the
[Create and Manage GCP IaaS Cluster](create-gcp-iaas-cluster.md) guide or the
[Create and Manage AWS GKE Cluster](create-gcp-gke-cluster.md) guide.
