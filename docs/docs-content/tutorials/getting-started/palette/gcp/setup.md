---
sidebar_label: "Set up Palette"
title: "Set up Palette with GCP"
description: "Learn how to set up Palette with GCP."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "gcp", "tutorial"]
---

In this guide, you will learn how to set up Palette for use with your Google Cloud Platform (GCP) cloud account. These
steps are required in order to authenticate Palette and allow it to deploy host clusters. The concepts you learn about
in the Getting Started section are centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-setup-intro" />

## Prerequisites

- A Palette account with [tenant admin](../../../../tenant-settings/tenant-settings.md) access.

- Sign up to a service account from [GCP](https://cloud.google.com/docs/get-started). The GCP account must have the
  required [IAM permissions](../../../../clusters/public-cloud/gcp/required-permissions.md).

## Enablement

Palette needs access to your GCP cloud account in order to create and manage GCP clusters and resources.

### Add Cloud Account

<PartialsComponent category="palette-setup" name="gcp-cloud-account" />

### Create a Palette API Key

Follow the steps below to create a Palette API key. This is required for the
[Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

<PartialsComponent category="palette-setup" name="create-tenant-api-key" />

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

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-setup-end" />
