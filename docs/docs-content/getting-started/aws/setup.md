---
sidebar_label: "Set up Palette"
title: "Set up Palette with AWS"
description: "Learn how to set up Palette with AWS."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "aws"]
---

In this guide, you will learn how to set up Palette for use with your AWS cloud account. These steps are required in
order to authenticate Palette and allow it to deploy host clusters. The concepts you learn about in the Getting Started
section are centered around a fictional case study company, Spacetastic Ltd.

<MyCarousel />

## Prerequisites

- A Palette account with [tenant admin](../../tenant-settings/tenant-settings.md) access.

- Sign up to a public cloud account from
  [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account). The AWS cloud account
  must have the required [IAM policies](../../clusters/public-cloud/aws/required-iam-policies.md).

- An SSH key pair available in the region where you want to deploy the cluster. Check out the
  [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html) for guidance.

## Enablement

Palette needs access to your AWS cloud account in order to create and manage AWS clusters and resources.

### Static Credentials Access

<PartialsComponent category="palette-setup" name="aws-static-credentials" />

### Create a Palette API Key

Follow the steps below to create a Palette API key. This is required for the
[Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

<PartialsComponent category="palette-setup" name="create-tenant-api-key" />

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **AWS** with all other available AWS cloud accounts.

## Next Steps

Now that you set up Palette for use with AWS, you can start deploying Kubernetes clusters to your AWS account. To learn
how to get started with deploying Kubernetes clusters to AWS, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your host cluster.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-setup-end" />
