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

<PartialsComponent category="self-hosted" name="feature-flags-intro" edition="vertex" />

## Limitations

<PartialsComponent category="self-hosted" name="feature-flags-limitations" />

## Prerequisites

<PartialsComponent category="self-hosted" name="feature-flags-prerequisites" edition="vertex" />

## Enable a Feature

<PartialsComponent category="self-hosted" name="feature-flags-enablement" edition="vertex" version="Palette VerteX" />

### Customize AWS Secret and Top Secret Endpoints

With the **AwsSecretPartition** feature flag enabled, you can customize API endpoints for individual AWS services to
meet the requirements of your airgapped environment. If your environment uses custom endpoints, you must configure them
in the Palette VerteX system console before Palette VerteX can provision and manage clusters in AWS Secret or Top Secret
cloud.

1. Log in to the Palette VerteX [system console](./system-management.md#system-console).

2. From the left main menu, select **Administration**.

3. Select the **Feature Flags** tab.

4. In the **AwsSecretPartition** section, select **Configure Endpoints**.

5. In the **AWS Secret and Top Secret API Endpoints** dialog, select the **Secret** or **Top Secret** tab depending on
   the partition you are configuring endpoints for.

   ![Customizing endpoints for AWS Secret and Top Secret](/feature-flags_customize-endpoints.webp)

6. Use the drop-down menu to select the applicable cloud region.

7. Use the following table to customize endpoints as needed. To discards any unsaved changes and restore all fields to
   their last saved configuration, select **Reset**.

   | **Field**                | **Description**                                                                                                                                                                                                              |
   | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Credentials endpoint** | The URL for the credentials provider used to obtain temporary security credentials. For AWS Top Secret (C2S) cloud, this is the C2S Access Portal (CAP). For AWS Secret (SC2S) cloud, this is the SC2S Access Portal (SCAP). |
   | **DNS suffix**           | The base domain suffix for AWS service endpoints in the selected region.                                                                                                                                                     |
   | **eks**                  | [Amazon Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/)                                                                                                                                                        |
   | **ec2**                  | [Amazon Elastic Compute Cloud](https://docs.aws.amazon.com/ec2/)                                                                                                                                                             |
   | **iam**                  | [AWS Identity and Access Management](https://docs.aws.amazon.com/iam/)                                                                                                                                                       |
   | **sts**                  | [AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html)                                                                                                                               |
   | **ecr**                  | [Amazon Elastic Container Registry](https://docs.aws.amazon.com/ecr/)                                                                                                                                                        |
   | **autoscaling**          | [AWS Auto Scaling](https://docs.aws.amazon.com/autoscaling/)                                                                                                                                                                 |
   | **elasticloadbalancing** | [Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/)                                                                                                                                                  |
   | **cloudformation**       | [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation/)                                                                                                                                                            |
   | **s3**                   | [Amazon Simple Storage Service](https://docs.aws.amazon.com/s3/)                                                                                                                                                             |
   | **ssm**                  | [AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)                                                                                                             |

8. Ensure your endpoint values are correct and **Save** your changes.

:::warning

Incorrect endpoints can prevent Palette VerteX from communicating with AWS services, which may cause cluster
provisioning or management operations to fail.

:::

You can update endpoints at any time, including after workload clusters are deployed. When you update an endpoint,
Palette VerteX restarts the internal cluster management controller pods to apply the new endpoint configurations.
Updated endpoint configurations are applied to existing clusters during the next reconciliation cycle, which occurs
approximately every 15 minutes. Workloads on running clusters are not interrupted during this process.

## Validate

<PartialsComponent category="self-hosted" name="feature-flags-validate" />
