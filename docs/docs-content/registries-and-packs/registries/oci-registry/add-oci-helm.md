---
sidebar_label: "Add OCI Helm Registry"
title: "Add OCI Helm Registry"
description: "Learn how to add your own OCI Helm Registry to Palette"
icon: ""
hide_table_of_contents: false
toc_max_heading_level: 2
sidebar_position: 10
---

You can add OCI registries containing Helm charts to Palette and use those Helm charts in your cluster profiles.

## Limitations

- Anonymous authentication is not supported for GitHub Container Registry (GHCR).

## Prerequisites

Certain prerequisites apply to all OCI Helm registries, while others are specific to Amazon Elastic Container Registry
(ECR) or GHCR.

<Tabs groupId="registry">

<TabItem value="basic" label="Basic">

- Tenant admin access to Palette.

- Credentials to access the OCI registry.

- If your OCI registry uses a self-signed certificate, or a certificate that is not signed by a trusted certificate
  authority (CA), you will need the certificate to add the registry to Palette.

<PartialsComponent category="registries-and-packs" name="acr-prerequisite-oci" />

</TabItem>

<TabItem value="aws" label="Amazon ECR">

- Tenant admin access to Palette.

- AWS credentials to an IAM user or a trust relationship to an Identity Access Management (IAM) role so that Palette can
  access the registry.

- Ensure you have the following IAM permissions attached to the IAM user or IAM role that Palette will use to access the
  registry. You can reduce the `Resource` scope from `*` to the specific Amazon Resource Name (ARN) of the ECR you are
  using.

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

- If your [Palette](../../../enterprise-version/enterprise-version.md) or [Palette VerteX](../../../vertex/vertex.md)
  instance is installed in an airgapped environment or an environment with limited internet access, you must whitelist
  the S3 endpoint that corresponds to the region of your Amazon ECR. This is because image layers are stored in S3, not
  the registry. The S3 endpoint uses the following format. Replace `<region>` with the region your ECR is hosted in.

  ```shell
  prod-<region>-starport-layer-bucket.s3.<region>.amazonaws.com
  ```

  ```shell hideClipboard title="Example S3 endpoint"
  prod-us-east-1-starport-layer-bucket.s3.us-east-1.amazonaws.com
  ```

</TabItem>

<TabItem value="GHCR" label="GHCR">

- Tenant admin access to Palette.

- A GitHub account (user or organization) and a Personal Access Token (PAT) that has the appropriate OAuth scope for
  GHCR. Refer to
  [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
  for additional information.

- Helm charts (packages) uploaded to GHCR must be linked to a repository in order to be indexed by Palette.

</TabItem>

</Tabs>

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

    <PartialsComponent category="registries-and-packs" name="acr-tip-oci" />

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

11. Keep the default **TLS Configuration** settings. Amazon ECR uses certificates signed by well-known CAs.

12. Select **Confirm** to add the registry.

</TabItem>

<TabItem value="GHCR" label="GHCR">

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Registries**.

4. On the **OCI Registries** tab, select **Add New OCI Registry**.

5. Enter the **Name** of the registry. For the **Provider** type, select **Helm**.

6. For **OCI Authentication Type**, select **Basic**.

7. Enable **Synchronization** for the registry. Synchronization is required for GHCR. For more information, refer to the
   [Helm Registry - Synchronization Behavior](../helm-charts.md#synchronization-behavior) section.

8. In the **Endpoint** field, enter the appropriate endpoint depending on whether the Helm chart package is owned by an
   individual user or organization.

   <Tabs>

   <TabItem value="user" label="User">

   Replace `<username>` with the GitHub username that owns the package.

   ```shell
   ghcr.io/users/<username>
   ```

   </TabItem>

   <TabItem value="organization" label="Organization">

   Replace `<organization>` with the GitHub organization name that owns the package.

   ```shell
   ghcr.io/orgs/<organization>
   ```

   </TabItem>

   </Tabs>

9. Leave the **Endpoint Suffix** blank.

10. Enter the **Base Content Path** for the Helm charts you want Palette to index. This is the GitHub repository that
    the Helm chart is linked to. You can specify multiple base paths by pressing the **ENTER** key after each path.
    Providing multiple base paths is useful when Helm charts are stored in different repositories.

11. In the **Username** field, enter your GitHub username or organization. A username is required for authentication,
    but the user or organization does not need to be associated with the repository where the Helm chart is stored.

12. In the **Password or Token** field, enter the PAT associated with the entered **Username**.

13. Keep the default **TLS Configuration** settings. GHCR uses certificates signed by well-known CAs.

14. Select **Confirm** to add the registry.

</TabItem>

</Tabs>

## Validate

Use the following steps to validate that the OCI registry is added to Palette correctly.

1. Log in to the [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles** > **Add Cluster Profile**.

3. In the **Add a new cluster profile** wizard, enter a unique **Name** for the cluster profile. Choose a **Type** of
   **Add-on** and select **Next**.

4. On the **Profile Layers** wizard step, select **Add Helm Chart** > **Public Packs**.

5. Verify the Helm chart registry you added is displayed in the **Registry** drop-down.

## Next Steps

Once your registry is added, you can add Helm charts from these registries to
[full](../../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or
[add-on cluster profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md).
Refer to our
[Add a Helm Chart](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md)
guide for more information.
