---
sidebar_label: "Add OCI Helm Registry"
title: "Add OCI Helm Registry"
description: "Learn how to add your own OCI Helm Registry to Palette"
icon: ""
hide_table_of_contents: false
toc_max_heading_level: 2
sidebar_position: 10
---

You can add an OCI type Helm registry to Palette and use the Helm Charts in your cluster profiles.

## Limitations

- GitHub Container Registry (GHCR) is not officially supported at this time. To add a Helm chart from GHCR, you must
  create a separate OCI Helm registry in Palette for each chart. Refer to the
  [Add OCI Helm Registry - GHCR](#add-oci-helm-registry) section for more information.

## Prerequisites

- Tenant admin access to Palette.

- If the registry uses basic authentication, credentials to access the OCI registry. If you are using an Amazon Elastic
  Container Registry (ECR), you must have the AWS credentials to an IAM user or add a trust relationship to an IAM role
  so that Palette can access the registry.

- If the OCI registry is using a self-signed certificate, or a certificate that is not signed by a trusted certificate
  authority (CA), you will need the certificate to add the registry to Palette.

- If you are using an Amazon ECR and your [Palette](../../../enterprise-version/enterprise-version.md) or
  [Palette VerteX](../../../vertex/vertex.md) instance is installed in an airgapped environment or an environment with
  limited internet access, you must whitelist the S3 endpoint that corresponds to the region of your Amazon ECR. This is
  because image layers are stored in S3, not the registry. The S3 endpoint uses the following format. Replace `<region>`
  with the region your ECR is hosted in.

  ```shell
  prod-<region>-starport-layer-bucket.s3.<region>.amazonaws.com
  ```

  ```shell hideClipboard title="Example S3 endpoint"
  prod-us-east-1-starport-layer-bucket.s3.us-east-1.amazonaws.com
  ```

- If you are using an Amazon ECR, ensure you have the following Identity Access Management (IAM) permissions attached to
  the IAM user or IAM role that Palette will use to access the registry. You can reduce the `Resource` scope from `*` to
  the specific Amazon Resource Name (ARN) of the ECR you are using.

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": [
          "ecr-public:DescribeRegistries",
          "ecr:DescribeImageReplicationStatus",
          "ecr:ListTagsForResource",
          "ecr:ListImages",
          "ecr:DescribeRepositories",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetLifecyclePolicy",
          "ecr-public:DescribeImageTags",
          "ecr-public:DescribeImages",
          "ecr:GetRegistryPolicy",
          "ecr-public:GetAuthorizationToken",
          "ecr:DescribeImageScanFindings",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:GetDownloadUrlForLayer",
          "ecr-public:GetRepositoryCatalogData",
          "ecr:DescribeRegistry",
          "ecr:GetAuthorizationToken",
          "ecr-public:GetRepositoryPolicy",
          "ecr-public:DescribeRepositories",
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr-public:GetRegistryCatalogData",
          "ecr-public:ListTagsForResource",
          "ecr-public:BatchCheckLayerAvailability",
          "ecr:GetRepositoryPolicy"
        ],
        "Resource": "*"
      }
    ]
  }
  ```

## Add OCI Helm Registry

Use the following steps to add an OCI Helm registry to Palette. Select the tab that corresponds to the type of OCI
registry you are adding.

<Tabs groupId="registry">

<TabItem value="basic" label="Basic">

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Registries**.

4. On the **OCI Registries** tab, select **Add New OCI Registry**.

5. Enter the **Name** of the registry. For the **Provider** type, select **Helm**.

6. For **OCI Authentication Type**, select **Basic**.

7. Toggle the **Synchronization** option to enable or disable synchronization for the registry. For more information,
   refer to the [Helm Registry - Synchronization Behavior](../helm-charts.md#synchronization-behavior) section.

8. Provide the registry URL in the **Endpoint** field.

9. If **Synchronization** is enabled, in the **Base Content Path** field, enter the base path to the repository in the
   registry where the Helm charts are stored. You can specify multiple base paths by pressing the **ENTER** key after
   each path. Providing multiple base paths is useful when Helm charts are stored in different directories or projects.

10. Fill out the **Username** and **Password** fields with the credentials to access the registry. If the registry does
    not require authentication, leave the **Username** and **Password** fields empty.

11. If your OCI registry server is using a self-signed certificate, select **Upload file** to upload the certificate. If
    the server certificate is not signed by a trusted CA, select **Insecure Skip TLS Verify** to skip verifying the x509
    certificate.

12. Select **Confirm** to add the registry.

</TabItem>

<TabItem value="aws" label="Amazon ECR">

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Registries**.

4. On the **OCI Registries** tab, select **Add New OCI Registry**.

5. Enter the **Name** of the registry. For the **Provider** type, select **Helm**.

6. For **OCI Authentication Type**, select **ECR**.

7. Toggle the **Synchronization** option to enable or disable synchronization for the registry. For more information,
   refer to the [Helm Registry - Synchronization Behavior](../helm-charts.md#synchronization-behavior) section.

8. Provide the registry URL in the **Endpoint** field. Exclude the `https://` prefix.

9. If **Synchronization** is enabled, in the **Base Content Path** field, enter the base path to the repository in the
   registry where the Helm charts are stored. You can specify multiple base paths by pressing the **ENTER** key after
   each path. Providing multiple base paths is useful when Helm charts are stored in different directories or projects.

10. If you are using a private ECR, toggle the **Enable Authentication** option to expose the **AWS authentication
    method** fields. Choose **Credentials** if you want to provide the static AWS credentials for an IAM user. Choose
    **STS** if you want Palette to assume an IAM role that has access to the ECR through the Security Token Service
    (STS). Refer to the table below to learn more about each credential type.

    | **Authentication Method** | **Field**             | **Description**                                                                                                                                                                                                            |
    | ------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Credentials**           | **Access key**        | The access key ID of the IAM user.                                                                                                                                                                                         |
    | **Credentials**           | **Secret access key** | The secret access key of the IAM user.                                                                                                                                                                                     |
    | **STS**                   | **ARN**               | The Amazon Resource Name (ARN) of the IAM role to assume. Refer to the instructions exposed in the side-drawer to the right of the input field to review the IAM trust relationship changes you must add to your IAM role. |

    :::warning

    If you selected **STS** as the authentication method, you must add a trust relationship to the IAM role you are
    using to access the ECR. Refer to the instructions exposed in the side-drawer to the right of the input field to
    review the IAM trust relationship changes you must add to your IAM role. Failure to add the trust relationship will
    result in an error when you attempt to validate the registry.

    :::

11. Keep the default **TLS Configuration** settings.

12. Select **Confirm** to add the registry.

</TabItem>

<TabItem value="GHCR" label="GHCR">

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Registries**.

4. On the **OCI Registries** tab, select **Add New OCI Registry**.

5. Enter the **Name** of the registry. For the **Provider** type, select **Helm**.

6. For **OCI Authentication Type**, select **Basic**.

7. Ensure **Synchronization** is disabled. For more information, refer to the
   [Helm Registry - Synchronization Behavior](../helm-charts.md#synchronization-behavior) section.

8. Enter the Helm chart endpoint, omitting the `oci://` scheme and ending with `/charts`. For example, for the endpoint
   `oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator`, enter `ghcr.io/controlplaneio-fluxcd/charts`.

9. Leave the **Username** and **Password** fields empty.

10. Keep the default **TLS Configuration** settings.

11. Select **Confirm** to add the registry.

</TabItem>

</Tabs>

## Validate

Use the following steps to validate that the OCI registry is added to Palette correctly.

1. Log in to the [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Click **Add Cluster Profile**.

4. Enter a unique **Name** for the cluster profile and choose the type **Add-on**. Select **Next**.

5. On the **Profile Layers** screen, select **Add Helm Chart > Public Packs**. For GHCR, select **Private Packs**.

6. Verify the Helm chart registry you added is displayed in the **Registry** drop-down menu.

## Next Steps

Once your registry is added, you can add Helm charts from these registries to
[full](../../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or
[add-on cluster profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md).
Refer to our
[Add a Helm Chart](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md)
guide for more information.
