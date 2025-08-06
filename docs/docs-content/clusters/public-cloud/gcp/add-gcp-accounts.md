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

<!-- prettier-ignore-start -->

- The service account must, at a minimum, have the following roles.

  - [Compute Admin](https://cloud.google.com/iam/docs/roles-permissions/compute#compute.admin) (`compute.admin`)
  - [Kubernetes Engine Admin](https://cloud.google.com/iam/docs/roles-permissions/container#container.admin)
    (`container.admin`)
  - [Service Account Token Creator](https://cloud.google.com/iam/docs/service-account-permissions#token-creator-role)
    (`iam.serviceAccountTokenCreator`)
  - [Service Account User](https://cloud.google.com/iam/docs/service-account-permissions#user-role)
    (`iam.serviceAccountUser`)
  - [Storage Object Viewer](https://cloud.google.com/iam/docs/roles-permissions/storage#storage.objectViewer)
    (`storage.objectViewer`)

  <br />

  :::info

  Alternatively, you can create a custom role and assign Palette the required GCP permissions. Check out the
  [Required IAM Permission](required-permissions.md) for a detailed list of all permissions.

  :::

<!-- prettier-ignore-end -->

- Ensure you have access to the JSON credential file for your service account. For additional guidance, refer to the
  [GCP Credentials](https://developers.google.com/workspace/guides/create-credentials) documentation.

## Create Account

<PartialsComponent category="palette-setup" name="gcp-cloud-account" />

## Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.

2. To review the list of cloud accounts, navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Next, click on **Cloud Accounts**. Your newly added GCP account is listed under the GCP section.

## Next Steps

Now that you have added a GCP account to Palette, you can deploy clusters to your GCP account. To learn how to get
started with deploying Kubernetes clusters to GCP, check out the
[Create and Manage GCP IaaS Cluster](create-gcp-iaas-cluster.md) guide or the
[Create and Manage AWS GKE Cluster](create-gcp-gke-cluster.md) guide.
