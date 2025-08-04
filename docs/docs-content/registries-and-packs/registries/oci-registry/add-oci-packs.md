---
sidebar_label: "Add OCI Packs Registry"
title: "Add OCI Packs Registry"
description: "Learn how to add your own OCI Packs Registry to Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
---

You can add an OCI Pack registry to Palette and use the packs in your cluster profiles. OCI Pack registries are
different from the legacy Pack registries. To interact with an OCI Pack registry, you use a tool, such as
[Oras](https://oras.land/docs/) CLI, to push and pull packs to and from the registry.

:::tip

For guidance on how to add a custom pack to an OCI pack registry, check out the
[Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md) tutorial.

:::

## Prerequisites

- Tenant admin access to Palette.

- Credentials to access the OCI registry. If you are using an Amazon Elastic Container Registry (ECR), you must have the AWS credentials to an
  IAM user or add a trust relationship to an IAM role so that Palette can access the registry.

- If the OCI registry is using a self-signed certificate, or a certificate that is not signed by a trusted certificate
  authority (CA), you will need the certificate to add the registry to Palette.

- If you are using an Amazon ECR in an airgapped or restricted network, you must whitelist the S3 endpoint that corresponds to the region of your Amazon ECR. This is because image layers are stored in S3, not the registry. The S3 endpoint uses the following format. Replace `<region>` with the region your ECR is hosted in.

  ```shell
  prod-<region>-starport-layer-bucket.s3.<region>.amazonaws.com
  ```

  ```shell hideClipboard title="Example S3 endpoint"
  prod-us-east-1-starport-layer-bucket.s3.us-east-1.amazonaws.com
  ```

- If you are using an Amazon ECR, ensure you have the following Identity Access Management (IAM) permissions
  attached to the IAM user or IAM role that Palette will use to access the registry. You can reduce the `Resource` scope
  from `*` to the specific Amazon Resource Name (ARN) of the ECR you are using.

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

## Add OCI Packs Registry

Use the following steps to add an OCI Packs registry to Palette. Select the tab that corresponds to the type of OCI
registry you are adding.

<Tabs groupId="registry">
<TabItem value="basic" label="Basic">

1. Log in to the [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left **Main Menu** select **Tenant Settings**.

3. From the **Tenant Settings Menu**, Select **Registries**.

4. Click on the **OCI Registries** tab.

5. Click **Add New OCI Registry**.

6. Fill out the **Name** field and select **Pack** as the provider type.

7. Select the **OCI Authentication Type** as **Basic**.

8. Provide the registry URL in the **Endpoint** field.

9. Specify the **Base Content Path**. This is the path to the OCI registry where the OCI Packs are stored. For example,
   if the OCI registry URL is `https://registry.example.com` and the OCI Packs are stored in the `internal` repository,
   the base content path is `internal`. You can specify multiple base paths by pressing the Enter key after each path.
   Providing multiple base paths is useful when Helm Charts are stored in different directories or projects, such as
   multiple projects in a Harbor registry.

10. Fill out the **Username** and **Password** fields with the credentials to access the registry.

11. If your OCI registry server is using a self-signed certificate or if the server certificate is not signed by a
    trusted CA, check the **Insecure Skip TLS Verify** box to skip verifying the x509 certificate, and click **Upload
    file** to upload the certificate.

12. Click **Confirm** to complete adding the registry.

</TabItem>

<TabItem value="aws" label="Amazon ECR">

1. Log in to the [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left **Main Menu** select **Tenant Settings**.

3. From the **Tenant Settings Menu**, Select **Registries**.

4. Click on the **OCI Registries** tab.

5. Click **Add New OCI Registry**.

6. Fill out the **Name** field and select **Pack** as the provider type.

7. Select the **OCI Authentication Type** as **ECR**.

8. Provide the registry URL in the **Endpoint** field. Exclude the `https://` prefix.

9. Specify the **Base Content Path**. This is the path to the OCI registry where the OCI Packs are stored. For example,
   if the OCI registry URL is `https://registry.example.com` and the OCI Packs are stored in the `custom` repository,
   the base content path is `custom`.

10. If you are using a private ECR, toggle the **Enable Authentication** option to expose the authentication
    fields.

11. Select the **AWS Authentication Method**. Choose **Credentials** if you want to provide the static AWS credentials
    for an IAM user. Choose **STS** if you want to Palette to assume an IAM role that has access to the ECR
    through the Security Token Service (STS). Refer to the table below to learn more about each credential type.

#### Credentials

    | **Field** | **Description** |
    | --- | --- |
    | Access Key | The access key ID of the IAM user. |
    | Secret access key | The secret access key of the IAM user. |

#### STS

| **Field** | **Description**                                                                                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ARN       | The Amazon Resource Name (ARN) of the IAM role to assume. Refer to the instructions exposed in the side-drawer to the right of the input field to review the IAM trust relationship changes you must add to your IAM role. |

<br />

:::warning

If you selected **STS** as the authentication method, you must add a trust relationship to the IAM role you are using to
access the ECR. Refer to the instructions exposed in the side-drawer to the right of the input field to review
the IAM trust relationship changes you must add to your IAM role. Failure to add the trust relationship will result in
an error when you attempt to validate the registry.

:::

12. Click **Confirm** to complete adding the registry.

</TabItem>

</Tabs>

## Validate

Use the following steps to validate that the OCI registry is added to Palette correctly.

1. Log in to the [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Click **Add Cluster Profile**.

4. Provide a name and select the type **Add-on**.

5. In the following screen, click **Add New Pack**.

6. Verify the OCI Pack registry you added is displayed in the filter **Registry drop-down Menu**.

All the Packs in the OCI registry are displayed below, sorted by category. You can filter the Packs by **Type** or
search for a specific Pack by name.
