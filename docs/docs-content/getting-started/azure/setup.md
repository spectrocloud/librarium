---
sidebar_label: "Set up Palette"
title: "Set up Palette with Azure"
description: "Learn how to set up Palette with Azure."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "azure"]
---

In this guide, you will learn how to set up Palette for use with your Azure cloud account. These steps are required in
order to authenticate Palette and allow it to deploy host clusters. The concepts you learn about in the Getting Started
section are centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-setup-intro" />

## Prerequisites

- A Palette account with [tenant admin](../../tenant-settings/tenant-settings.md) access.

- Sign up to a public cloud account from
  [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account). The Azure cloud account must have
  the [required permissions](../../clusters/public-cloud/azure/required-permissions.md).

- Access to a terminal window.

- The utility `ssh-keygen` or similar SSH key generator software.

## Enablement

Palette needs access to your Azure cloud account in order to create and manage Azure clusters and resources.

### Add Azure Cloud Account

<PartialsComponent category="palette-setup" name="azure-cloud-account" />

### Create and Upload an SSH Key

Follow the steps below to create an SSH key using the terminal and upload it to Palette. This step is not required for
the [Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

:::warning

Only RSA SSH keys are supported when deploying [Azure AKS clusters](../../clusters/public-cloud/azure/aks.md).

:::

<PartialsComponent category="palette-setup" name="generate-ssh-key" />

### Create a Palette API Key

Follow the steps below to create a Palette API key. This is required for the
[Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

<PartialsComponent category="palette-setup" name="create-tenant-api-key" />

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts.

## Next Steps

Now that you set up Palette for use with Azure, you can start deploying Kubernetes clusters to your Azure account. To
learn how to get started with deploying Kubernetes clusters to Azure, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your host cluster.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-setup-end" />
