---
sidebar_label: "Deploy Cluster with an Amazon ECR Provider Registry"
title: "Deploy Cluster with an Amazon ECR Provider Registry"
description:
  "Configure an Edge cluster to pull provider images from a private Amazon ECR repository with token-based
  authentication, without storing static AWS credentials on the Edge hosts."
hide_table_of_contents: false
sidebar_position: 45
tags: ["edge"]
---

[Amazon Elastic Container Registry (ECR)](https://docs.aws.amazon.com/ecr/) is a managed AWS service for storing and
distributing container images. This guide describes how to configure an Edge cluster to pull provider images from a
private Amazon ECR repository with token-based authentication.

You add the ECR repository to Palette as an image registry, and then select that registry for the cluster. Palette
issues short-lived ECR tokens to the Edge hosts, which use them to pull the provider image when the cluster is created
and when it is upgraded. You do not need to store static AWS credentials on the Edge hosts.

## Limitations

- Token-based authentication is supported only for connected clusters in appliance mode. Clusters in local mode ignore
  the image registry selected for the cluster. If your cluster cannot use token-based authentication, refer to
  [Configure Amazon ECR Authentication Manually](./deploy-ecr-provider-registry-manual.md).

- The image registry supplies credentials only for images on its own endpoint. Set the `system.uri` option in the OS
  layer of your cluster profile to a provider image on the registry's endpoint. Otherwise, the image is pulled without
  credentials, and the pull fails for a private repository.

- The image registry covers provider images only. It does not supply credentials for application workload images.

- ECR image registries support only AWS Security Token Service (STS) authentication.

- You cannot change the provider type of a registry after you create it.

- Using token-based authentication and the [manual configuration](./deploy-ecr-provider-registry-manual.md) together on
  the same cluster has not been tested.

## Prerequisites

- Tenant administrator access to Palette.

- A private Amazon ECR repository that contains a provider image you built during the EdgeForge process. For more
  information, refer to [Build Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md).

- An IAM role in the AWS account that owns the repository, with read access to ECR. Palette assumes this role through
  the AWS Security Token Service (STS). The Palette UI lists the required permissions and trust relationship when you
  add the registry.

- A cluster profile whose OS layer sets `system.uri` to the provider image in your ECR repository.

## Add the ECR Repository as an Image Registry

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Registries**.

4. On the **OCI Registries** tab, select **Add New OCI Registry**.

5. Enter a **Name** for the registry. For **Provider**, select **Image**.

6. For **OCI Authentication type**, select **ECR**.

   Palette turns on **Enable Authentication** and sets **AWS authentication method** to **STS**. You cannot change these
   settings for an ECR image registry. **Synchronization** is not supported for image registries.

7. In the **Endpoint** field, enter the ECR registry URL, for example `123456789012.dkr.ecr.us-east-1.amazonaws.com`.
   Exclude the `https://` prefix and the repository name.

8. In the **ARN** field, enter the Amazon Resource Name (ARN) of the IAM role for Palette to assume.

   :::warning

   You must add a trust relationship to the IAM role. Refer to the instructions in the side drawer next to the **ARN**
   field to review the permissions and the IAM trust relationship to add to your IAM role. If the trust relationship is
   missing, Palette cannot validate the registry.

   :::

9. Keep the default **TLS Configuration** settings. Amazon ECR uses certificates signed by well-known certificate
   authorities.

10. Select **Confirm** to add the registry.

## Select the Image Registry for the Cluster

You can select the image registry when you create the cluster. You can also add or change the image registry on an
existing cluster.

You do not need to set `providerCredentials` in the Edge host user data or the cluster profile.

### Select the Image Registry for a New Cluster

When you [create an Edge Native cluster](../cluster-deployment.md), select your registry from the **Image registry**
drop-down menu on the cluster configuration page, where you provide the Virtual IP (VIP) address. The field is optional.

### Select the Image Registry for an Existing Cluster

You can change the image registry in any cluster state. The change does not repave the nodes.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select your Edge Native cluster.

3. From the cluster details page, select **Settings** > **Cluster Settings**.

4. Select **Cluster Configuration**.

5. From the **Image registry** drop-down menu, select your registry.

6. Select **Save Changes**.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select your Edge Native cluster.

3. On the **Overview** tab, confirm that the **Cluster Status** field displays **Running**.

## Next Steps

To upgrade the cluster to a new provider image, push the image to the same ECR registry, update `system.uri` in the
cluster profile, and apply the change. For more information, refer to
[Update a Cluster](../../../cluster-management/cluster-updates.md).
