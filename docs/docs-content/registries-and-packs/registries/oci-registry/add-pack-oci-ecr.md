---
sidebar_label: "Add a Pack to an ECR Registry"
title: "Add a Pack to an ECR Registry"
description: "Learn how to upload packs to an ECR registry."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
---

Palette supports the use of Open Container Initiative (OCI) registries. You can register a private OCI registry with
Palette, publish custom packs, and then use the packs in your cluster profiles.

Two types of OCI authentication are available: registries that support [basic authentication](./add-pack-oci-basic.md),
such as [Harbor](https://goharbor.io/), and AWS Elastic Container Registry (ECR), which is supported as a third-party
registry provider. To upload packs to OCI registries, you can use [ORAS](https://oras.land/docs/), a CLI tool for
pushing and pulling OCI artifacts to and from OCI registries. To learn more about OCI registries and how they work in
Palette, refer to the [OCI Registry](./oci-registry.md) page.

This guide explains how to upload packs to AWS ECR registries. You will learn how to authenticate to your AWS ECR
registry, push a custom pack, and configure the registry in Palette.

## Prerequisites

- Tenant administrator access.

- Custom pack files available on your local machine. Refer to the [Add an Add-on Pack](../../adding-add-on-packs.md)
  guide to learn how to create a custom pack.

- A private [AWS (ECR)](https://aws.amazon.com/ecr/) registry.

- An Identity and Access Management (IAM) user with the following permissions.

  - `ecr:CreateRepository`
  - `ecr:InitiateLayerUpload`
  - `ecr:CompleteLayerUpload`
  - `ecr:InitiateLayerUpload`
  - `ecr:PutImage`
  - `ecr:UploadLayerPart`
  - `ecr:BatchCheckLayerAvailability`
  - `ecr:ListImages`
  - `ecr:DescribeImages`
  - `ecr:BatchDeleteImage`
  - `ecr:DeleteRepository`

- The following software installed on your local machine.

- [ORAS](https://oras.land/docs/installation/) v1.0.0

  :::warning

  This specific version of ORAS is explicitly required for pushing packs to OCI registries.

  :::

- [Tar](https://www.gnu.org/software/tar/)
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Upload Pack to an ECR Registry

Follow the steps described below to set up your ECR registry, push the pack, and configure the registry in Palette.

1. Open up a terminal session and export your AWS credentials as environment variables to authenticate with your AWS
   account.

   ```bash
   export AWS_ACCESS_KEY_ID=<your-access-key-id>
   export AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
   export AWS_DEFAULT_REGION=<your-default-region>
   ```

2. Additionally, export the required variables for creating the ECR repository and pushing the pack.

   - `REPOSITORY_NAME` - Specify a name for the repository that will store the pack files. For example,
     `spectro-oci-registry`.
   - `NAME` - The pack's name, which must match the `name` parameter in the **pack.json** file.
   - `VERSION` - The pack's version, which must match the `version` parameter in the **pack.json** file.
   - `ACCOUNT_ID` - Your AWS account ID, containing only numerical digits and no dashes.

   ```bash
   export REPOSITORY_NAME=<your-repository-name>
   export NAME=<your-pack-name>
   export VERSION=<your-pack-version>
   export ACCOUNT_ID=<your-aws-account-id>
   ```

3. Issue the command below to create a base path repository to store your pack repositories.

   ```bash
   aws ecr create-repository --repository-name $REPOSITORY_NAME/spectro-packs/archive --region $AWS_DEFAULT_REGION
   ```

4. Next, proceed to create the repository to store your pack.

   ```bash
   aws ecr create-repository --repository-name $REPOSITORY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION
   ```

:::warning

Make sure to include the **spectro-packs/archive** path in _all_ your repositories. Palette expects this namespace in
custom OCI registries.

:::

5. After creating the ECR repositories, issue the command below to authenticate to your ECR registry. The
   `aws ecr get-login-password` generates an authorization token, which is then passed to the `oras login` command. If
   the login is successful, you will receive a confirmation message.

   ```bash
   aws ecr get-login-password --region $AWS_DEFAULT_REGION | oras login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
   ```

6. Navigate to the directory containing the folder with the pack files.

7. Before pushing the pack to the ECR registry, compress the contents of the pack folder into an archive file. Issue the
   command below to create the archive file. Replace `<Your_Pack_Folder_Name>` with the name of the folder containing
   the pack files.

   ```bash
   tar -czvf $NAME-$VERSION.tar.gz <Your_Pack_Folder_Name>
   ```

8. Push the pack to the ECR registry.

   ```bash
   oras push $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPOSITORY_NAME/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
   ```

9. After pushing the pack to the ECR registry, follow the steps in [Add OCI Packs Registry](./add-oci-packs.md) to add
   your ECR registry to Palette.

   :::info

   Palette automatically synchronizes the registries. However, you can manually trigger the synchronization if needed.
   From the **OCI Registries** page, click the **three-dot Menu** next to the registry name you added and select
   **Sync**.

   :::

## Validate

Follow the steps below to validate that your pack has been successfully pushed to your OCI registry.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Click **Add Cluster Profile**.

4. Provide a name and select the type **Add-on**.

5. In the following screen, click **Add Pack**.

6. Select the ECR registry you added in the **Registry drop-down Menu**.

7. Verify the pack you uploaded to the ECR registry is displayed.
