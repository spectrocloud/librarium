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

## 🧑‍🚀 Back at Spacetastic HQ

The Spacetastic team decide to look for an external solution that can help them scale and manage their Kubernetes
services. Partnering with a team of Kubernetes experts allows them to focus on expanding their astronomy education
platform, instead of spending countless hours migrating and rehosting their services. They identify the following list
of benefits that their new platform should provide.

- Simplified Kubernetes cluster deployment processes across cloud providers.
- Cluster maintenance and security patching across environments.
- Monitoring and observability of Kubernetes workloads.

> "I have so many ideas for new features for our backlog." says Anya, Lead Astrophycist. "Our community of space
> explorers want to keep learning, so we shouldn't slow down our implementation cycle. We need to keep expanding our
> astronomy education product."
>
> Kai nods knowingly. As a Platform Engineer, they agree with Anya's concerns. "I've done some research on Kubernetes
> orchestration solutions. It seems that Palette has all the capabilities we need to help us grow."
>
> "I agree with both of you, but I want to review the developer experience in detail before we agree to implement a new
> solution in production." says Wren, whose main concern as Founding Engineer is to ensure development velocity does not
> decrease. "Let's reach out to Spectro Cloud to create an account. Then, we can make an informed decision after we
> complete their Getting Started tutorials."

## Prerequisites

- A Palette account with [tenant admin](../../tenant-settings/tenant-settings.md) access.

- Sign up to a public cloud account from
  [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account). The AWS cloud account
  must have the required [IAM policies](../../clusters/public-cloud/aws/required-iam-policies.md).

- An SSH key pair available in the region where you want to deploy the cluster. Check out the
  [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) for
  guidance.

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

After following the detailed Palette setup instructions, the Spacetastic team have added their cloud accounts on the
Palette dashboard. They are ready to learn about Palette.

> "The Spectro Cloud team has provided our Palette accounts" says Kai. "I have followed their setup guide and have added
> our cloud accounts. I can already tell at a first glance that they offer many Kubernetes customization features."
>
> Wren joins Kai in looking at the Palette dashboard. "I'm interested to learn more, but I never believe in _magic_
> solutions. We should review their Getting Started material in detail to ensure that Palette is a good fit for us."
