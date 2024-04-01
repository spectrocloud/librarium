---
sidebar_label: "Add a Pack to an OCI Registry"
title: "Add a Pack to an OCI Registry"
description: "Learn how to upload packs to an OCI registry."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
---

Palette supports the use of Open Container Initiative (OCI) registries. You can register a private OCI registry with
Palette, publish custom packs, and then use the packs in your cluster profiles.

Two types of OCI authentication are available: registries that support basic authentication, such as Harbor, and AWS
ECR, which is supported as a third-party registry provider. To upload packs to OCI registries, you can use
[ORAS](https://oras.land/docs/), a CLI tool for pushing and pulling OCI artifacts to and from OCI registries. Refer to
[OCI Registry](./oci-registry.md) for more information.

This guide explains how to upload packs to OCI registries. You will learn how to authenticate to your OCI registry, push
a custom pack, and configure the registry in Palette.

## Prerequisites

- Palette's tenant admin access to add a new registry.

- Custom pack files available on your local machine. Refer to the [Add an Add-on Pack](../../adding-add-on-packs.md)
  guide to learn how to create a custom pack.

- A private OCI registry such as [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) or
  [Harbor](https://goharbor.io/). Learn how to set up a Harbor registry server using the
  [Harbor Installation and Configuration](https://goharbor.io/docs/2.9.0/install-config/) guide.

- [ORAS](https://oras.land/docs/installation/) and [Tar](https://www.gnu.org/software/tar/) installed on your machine.

- If you are using an ECR OCI registry, ensure you have
  [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and an AWS Identity
  and Access Management (IAM) user with the following permissions.

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

- If your OCI registry is using a self-signed certificate or a certificate that is not signed by a trusted certificate
  authority (CA), you will need the certificate to add the registry to Palette.

## Enablement

### Configure the OCI Registry

<Tabs groupId="registry-server">

<TabItem label="ECR" value="ECR_Registry">

1. In your terminal, export your AWS credentials as environment variables to authenticate with your AWS account.

   ```bash
   export AWS_ACCESS_KEY_ID=<Your_Access_Key_ID>
   export AWS_SECRET_ACCESS_KEY=<Your_Secret_Access_Key>
   export AWS_DEFAULT_REGION=<Your_Default_Region>
   ```

2. Additionally, export the required variables for creating the ECR repository and pushing the pack.

   - `REPOSITORY_NAME` - Specify a name for the repository that will store the pack files. For example,
     `spectro-oci-registry`.
   - `NAME` - The pack's name, which must match the name in the **pack.json** file.
   - `VERSION` - The pack's version, which must match the version in the **pack.json** file.
   - `ACCOUNT_ID` - Your AWS account ID, containing only numerical digits and no dashes.

   ```bash
   export REPOSITORY_NAME=<Your_Repository_Name>
   export NAME=<Your_Packs_Name>
   export VERSION=<Your_Packs_Version>
   export ACCOUNT_ID=<Your_AWS_Account_ID>
   ```

3. Issue the command below to create a base path repository to store your pack repositories.

   ```bash
   aws ecr create-repository --repository-name $REPOSITORY_NAME/spectro-packs/archive --region $AWS_DEFAULT_REGION
   ```

4. Create the repository to store your pack.

   ```bash
   aws ecr create-repository --repository-name $REPOSITORY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION
   ```

:::warning

Make sure to include the **spectro-packs/archive** path in _all_ your repositories to meet Palette's requirements.

:::

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

1. Access the Harbor registry server domain on your web browser and log in using your credentials. If you have kept the
   default credentials, the username and password are **admin** and **Harbor12345**, respectively.

2. From the **Projects** section, click **New Project**. A project in Harbor contains all repositories of an
   application.

3. Give your project a name and keep the default settings for the remaining configuration. Click **OK** to proceed.

</TabItem>

</Tabs>

### Authenticate to the OCI Registry

<Tabs groupId="registry-server">

<TabItem label="ECR" value="ECR_Registry">

5. Issue the command below to authenticate to your ECR registry. The `aws ecr get-login-password` generates an
   authorization token, which is then passed to the `oras login` command.

   ```bash
   aws ecr get-login-password --region $AWS_DEFAULT_REGION | oras login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
   ```

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

4. In your terminal, export the `HARBOR_ADDRESS` variable, which will store your Harbor address. Do not include the
   "https://" prefix.

   ```bash
   export HARBOR_ADDRESS=<Your_Harbor_Address>
   ```

5. Issue the command `oras login` to log in to your Harbor registry. When prompted, enter your username and password.

   ```bash
   oras login $HARBOR_ADDRESS
   ```

</TabItem>

</Tabs>

### Push the Pack to the OCI Registry

<Tabs groupId="registry-server">

<TabItem label="ECR" value="ECR_Registry">

6. In your terminal, navigate to the directory containing the folder with the pack files.

7. Compress the contents of the pack folder into an archive file. Issue the command below to create the archive file.
   Replace `<Your_Packs_Folder_Name>` with the name of the folder containing the pack files.

   ```bash
   tar -czvf $NAME-$VERSION.tar.gz <Your_Packs_Folder_Name>
   ```

8. Push the pack to the ECR registry.

   ```bash
   oras push $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPOSITORY_NAME/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
   ```

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

6.  In your terminal, export the variables required for creating the Harbor repository and pushing the pack.

    - `HARBOR_PROJECT` - Specify a name for the Harbor project that will store the repositories and the pack files. For
      example, `spectro-oci-registry`.
    - `NAME` - The pack's name, which must match the name in the **pack.json** file.
    - `VERSION` - The pack's version, which must match the version in the **pack.json** file.

    ```bash
    export HARBOR_PROJECT=<Your_Repository_Name>
    export NAME=<Your_Packs_Name>
    export VERSION=<Your_Packs_Version>
    ```

7.  Navigate to the directory containing the folder with the pack files.

8.  Compress the contents of the pack folder into an archive file. Issue the command below to create the archive file.
    Replace `<Your_Packs_Folder_Name>` with the name of the folder containing the pack files.

    ```bash
    tar -czvf $NAME-$VERSION.tar.gz <Your_Pack's_Folder_Name>
    ```

9.  Issue the command below to create a base path repository to store your pack repositories. Note that Harbor creates a
    repository when the user pushes an artifact to a project.

    ```bash
    oras push $HARBOR_ADDRESS/$HARBOR_PROJECT/spectro-packs/archive
    ```

10. Create the pack repository and push your pack to the Harbor registry.

    ```bash
    oras push $HARBOR_ADDRESS/$HARBOR_PROJECT/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
    ```

:::warning

Make sure to include the **spectro-packs/archive** path in _all_ your repositories to meet Palette's requirements.

:::

</TabItem>

</Tabs>

### Configure the Registry in Palette

<Tabs groupId="registry-server">
<TabItem label="ECR" value="ECR_Registry">

9. Follow the steps in [Add OCI Packs Registry](./add-oci-packs.md) to add your ECR registry to Palette.

:::info

Palette automatically syncs the registries. However, you can sync them manually if needed. From the **OCI Registries**
page, click the **three-dot Menu** next to the registry name you added and select **Sync**.

:::

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

11. Follow the steps in [Add OCI Packs Registry](./add-oci-packs.md) to add your Harbor registry to Palette.

:::info

Palette automatically syncs the registries. However, you can sync them manually if needed. From the **OCI Registries**
page, click the **three-dot Menu** next to the registry name you added and select **Sync**.

:::

</TabItem>

</Tabs>

## Validate

Follow the steps below to validate that your pack has been successfully pushed to your OCI registry.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Click **Add Cluster Profile**.

4. Provide a name and select the type **Add-on**.

5. In the following screen, click **Add Pack**.

6. Select the OCI registry you added in the **Registry drop-down Menu**.

7. Verify the pack you uploaded to the OCI registry is displayed.
