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

You add your ECR registry to Palette as an OCI registry with the **Image** provider type (an image registry), and then
select that image registry for the cluster. Palette issues short-lived ECR tokens to the Edge hosts, which use them to
pull the provider image when the cluster is created and when it is upgraded. You do not need to store static AWS
credentials on the Edge hosts.

## Limitations

- Token-based authentication is supported only for centrally managed Edge Native clusters in appliance mode. Locally
  managed clusters ignore the image registry selected for the cluster.

- Token-based authentication is not specific to a Kubernetes distribution. Spectro Cloud tested it with the PXK-E
  (kubeadm) distribution on Ubuntu 22.04 and also created a K3s cluster with it. If your PXK-E cluster cannot use
  token-based authentication, refer to
  [Configure Amazon ECR Authentication Manually](./deploy-ecr-provider-registry-manual.md).

- The image registry supplies credentials only for images on its own endpoint. Set the `system.uri` option in the OS
  layer of your cluster profile to a provider image on the registry's endpoint. Otherwise, the Edge host pulls the image
  without credentials, and the pull fails for a private repository.

- The image registry covers provider images only. It does not supply credentials for application workload images.

- ECR image registries support only AWS Security Token Service (STS) authentication.

- You cannot change the provider type of an image registry, and you cannot convert a registry of another provider type
  to an image registry. To use an ECR registry that is already in Palette as a **Helm** or **Packs** OCI registry, add
  the same endpoint again with the **Image** provider type and a new name.

- You cannot delete a registry while a cluster uses it.

- Spectro Cloud has not tested token-based authentication and the
  [manual configuration](./deploy-ecr-provider-registry-manual.md) together on the same cluster.

## Prerequisites

- Tenant administrator access to Palette.

- A private Amazon ECR repository that contains a provider image you built during the EdgeForge process. For more
  information, refer to [Build Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md).

- A centrally managed Edge Native cluster in appliance mode, or the Edge hosts for a new one. Every Edge host of the
  cluster must run Palette agent version 4.10.b or later. An older agent ignores the selected image registry and does
  not report an error. <!-- Release day: replace 4.10.b with the Palette agent version for 4.10.b. -->

- An IAM role in the AWS account that owns the repository. The role needs a trust relationship that allows Palette to
  assume it through STS, and the following permissions.

  - `ecr:GetAuthorizationToken`
  - `ecr:DescribeRepositories` (Palette uses this permission to validate the registry)
  - `ecr:BatchCheckLayerAvailability`, `ecr:GetDownloadUrlForLayer`, and `ecr:BatchGetImage` on the repository

  When you add the registry, the side drawer next to the **ARN** field lists the trust relationship to add.

- A cluster profile whose OS layer sets `system.uri` to the provider image in your ECR repository.

## Add Amazon ECR as an Image Registry

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

   You must add a trust relationship to the IAM role. The side drawer next to the **ARN** field lists the permissions
   and the trust relationship to add. If the trust relationship is missing, Palette cannot validate the registry.

   :::

9. Keep the default **TLS Configuration** settings. Amazon ECR uses certificates signed by well-known certificate
   authorities.

10. Select **Confirm** to add the registry.

## Select the Image Registry for the Cluster

You can select the image registry when you create the cluster. You can also add or change the image registry on an
existing cluster.

The image registry selected for the cluster takes precedence over `providerCredentials` in the Edge host user data and
the OS pack, including static credentials. A `registry` mirror still receives the credentials.

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

For a new cluster, the **Running** status confirms that the Edge hosts pulled the provider image from your ECR registry.

For an existing cluster, Palette uses the image registry at the next upgrade, and there is no earlier check. After the
upgrade, the Edge host logs display `uses the credentials of Palette registry`.

## Next Steps

To upgrade the cluster to a new provider image, push the image to the same ECR registry, update `system.uri` in the
cluster profile, and apply the change. For more information, refer to
[Update a Cluster](../../../cluster-management/cluster-updates.md).
