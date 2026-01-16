---
sidebar_label: "Set up Palette"
title: "Set up Palette with AWS"
description: "Learn how to set up Palette with AWS."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "aws", "tutorial"]
---

In this guide, you will learn how to set up Palette for use with your AWS cloud account. These steps are required in
order to authenticate Palette and allow it to deploy host clusters. The concepts you learn about in the Getting Started
section are centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-setup-intro" />

## Prerequisites

<PartialsComponent
  category="clusters-aws-account-setup"
  name="aws-static-credentials-prerequisites"
  edition="Palette"
/>

## Enablement

Palette needs access to your AWS cloud account in order to create and manage AWS clusters and resources.

### Static Credentials Access

<PartialsComponent
  category="clusters-aws-account-setup"
  name="aws-static-credentials-enablement-1"
  partition="AWS"
  edition="Palette"
/>

**Validate** your AWS credentials and select **Confirm** to add your AWS account to Palette.

### Create a Palette API Key

Follow the steps below to create a Palette API key. This is required for the
[Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

<PartialsComponent category="palette-setup" name="create-tenant-api-key" />

## Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" edition="Palette" />

## Next Steps

Now that you set up Palette for use with AWS, you can start deploying Kubernetes clusters to your AWS account. To learn
how to get started with deploying Kubernetes clusters to AWS, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your host cluster.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-setup-end" />
