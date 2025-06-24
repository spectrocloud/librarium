---
sidebar_label: "Set up Palette"
title: "Set up Palette with VMware"
description: "Learn how to set up Palette with VMware."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "vmware", "tutorial"]
---

In this guide, you will learn how to set up Palette for use with your VMware user account. These steps are required in
order to authenticate Palette and allow it to deploy host clusters. The concepts you learn about in the Getting Started
section are centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-setup-intro" />

## Prerequisites

- A Palette account with [tenant admin](../../../../tenant-settings/tenant-settings.md) access.

- A [VMware vSphere](https://docs.vmware.com/en/VMware-vSphere/index.html) user account with the
  [required permissions](../../../../clusters/data-center/vmware/permissions.md).

## Enablement

Palette needs access to your VMware user account in order to create and manage VMware resources.

### Create a Palette API Key

<PartialsComponent category="palette-setup" name="create-tenant-api-key" />

### Create and Upload an SSH Key

Follow the steps below to create an SSH key using the terminal and upload it to Palette. This step is optional for the
[Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

<PartialsComponent category="palette-setup" name="generate-ssh-key" />

## Validate

You can verify your Palette API key is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **API Keys**.

5. Verify the API key is listed in the table with the correct user name and expiration date.

## Next Steps

Now that you set up Palette for use with VMware vSphere, you can start deploying a Private Cloud Gateway (PCG), which is
the bridge between Palette and your private infrastructure environment.

To learn how to get started with deploying Kubernetes clusters to VMware virtual machines, we recommend that you
continue to the [Deploy a PCG with Palette CLI](./deploy-pcg.md) tutorial.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-setup-end" />
