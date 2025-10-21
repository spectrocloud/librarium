---
sidebar_label: "Feature Flags"
title: "Feature Flags"
description: "Learn how to to use feature flags to manage features in Palette VerteX"
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["vertex", "management", "feature-flags"]
keywords: ["self-hosted", "vertex", "feature-flags"]
---

Feature flags allow
[system administrators](../system-management/account-management/account-management.md#system-administrators) to manage
what features are available to the system's tenants. Use this capability to roll out new features to tenants in a
controlled manner or choose not to implement a feature for tenants due to security or compliance reasons.

Features enabled by system administrators apply to all tenants in the system. Once a feature is enabled, it cannot be
disabled. All feature flags are Tech Preview features. When a feature graduates from Tech Preview, the feature flag is
removed, and the feature is no longer gated.

The following feature flags are currently available.

| **Feature Flag**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                       | **Palette Support** | **Palette VerteX Support** |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----------------: | :------------------------: |
| **AwsSecretPartition** | Configure [AWS Secret Cloud](https://aws.amazon.com/federal/secret-cloud/) accounts and deploy EKS clusters in AWS Secret cloud. Refer to our [Register and Manage AWS Accounts](../../clusters/public-cloud/aws/add-aws-accounts.md#aws-secret-cloud-account-us) guide for more information.                                                                                                                                                         |         :x:         |     :white_check_mark:     |
| **AzureUSSecretCloud** | Configure [Azure Government Secret](https://azure.microsoft.com/en-us/explore/global-infrastructure/government/national-security) cloud accounts and deploy Azure IaaS clusters in Azure Government Secret cloud.                                                                                                                                                                                                                                     |         :x:         |     :white_check_mark:     |
| **ClusterTemplate**    | Create reusable blueprints that reference [cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and [policies](../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md), allowing you to declaratively define and manage the software and governance stack for a fleet of clusters. Refer to our [Cluster Templates](../../cluster-templates/cluster-templates.md) guide for more information. | :white_check_mark:  |     :white_check_mark:     |
| **LxdMaas**            | Spawn multiple control plane nodes as LXD VMs and consolidate them on MAAS-managed servers while your worker nodes run on bare metal devices. Refer to our [Create and Manage MAAS Clusters Using LXD VMs](../../clusters/data-center/maas/create-manage-maas-lxd-clusters.md) guide for more information.                                                                                                                                            | :white_check_mark:  |     :white_check_mark:     |

:::warning

We recommend trying out new features in a test environment before enabling them in a production environment. Enabling
certain features may have a significant impact on the system and current workloads.

:::

## Limitations

- All feature flags are disabled for multi-tenant SaaS. To enable a feature flag on a dedicated SaaS environment,
  contact your Spectro Cloud customer support representative.

## Prerequisites

- A [self-hosted Palette](../../enterprise-version/enterprise-version.md) or [Palette VerteX](../vertex.md) instance.

- A system administrator with the
  [Operations Administrator](../system-management/account-management/account-management.md#operations-administrator) or
  [Root Administrator](../system-management/account-management/account-management.md#root-administrator) role.

- Access to the [system console](../system-management/system-management.md#access-the-system-console).

## Enable a Feature

1. Log in to the [system console](../system-management/system-management.md#access-the-system-console).

2. From the left main menu, select **Administration**.

3. Select the **Feature Flags** tab.

4. Locate the feature you want to activate and toggle the switch to enable it. Once you enable the feature, you cannot
   disable it.

## Validate

Validations steps vary based on the feature enabled. In general, if you do not activate a feature, you cannot view any
options related to the feature.

For example, if you enable the **AwsSecretPartition** feature flag in Palette VerteX, the option **AWS US Secret** is
available from the **Partition** drop-down menu at **Tenant Settings > Cloud Accounts > Add AWS Account**, and you can
select your AWS Secret cloud account when deploying an EKS cluster. Likewise, if you do not enable the
**AwsSecretPartition** feature flag, you do not have the option to register an AWS Secret cloud account and cannot
deploy clusters to AWS Secret cloud.
