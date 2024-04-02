---
sidebar_label: "Add a Pack to a Basic OCI Registry"
title: "Add a Pack to a Basic OCI Registry"
description: "Learn how to upload packs to a Basic OCI registry."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
---

Palette supports the use of Open Container Initiative (OCI) registries. You can register a private OCI registry with
Palette, publish custom packs, and then use the packs in your cluster profiles.

Two types of OCI authentication are available: registries that support basic authentication, such as
[Harbor](https://goharbor.io/), and [AWS Elastic Container Registry (ECR)](./add-pack-oci-ecr.md), which is supported as
a third-party registry provider. To upload packs to OCI registries, you can use [ORAS](https://oras.land/docs/), a CLI
tool for pushing and pulling OCI artifacts to and from OCI registries. To learn more about OCI registries and how they
work in Palette, refer to the [OCI Registry](./oci-registry.md) documentation page.

This guide explains how to upload packs to an OCI registry that supports basic authentication. You will learn how to
authenticate to your Basic OCI registry, push a custom pack, and configure the registry in Palette.

## Prerequisites

- Tenant administrator access.

- Custom pack files available on your local machine. Refer to the [Add an Add-on Pack](../../adding-add-on-packs.md)
  guide to learn how to create a custom pack.

- A private OCI registry that supports basic authentication. This guide uses [Harbor](https://goharbor.io/) as an
  example. Learn how to set up a Harbor registry server using the
  [Harbor Installation and Configuration](https://goharbor.io/docs/2.9.0/install-config/) guide.

- [ORAS](https://oras.land/docs/installation/) v1.0.0 installed and available.

- [Tar](https://www.gnu.org/software/tar/) installed and available.

- If your OCI registry is using a self-signed certificate or a certificate that is not signed by a trusted Certificate
  Authority (CA), you will need the certificate to add the registry to Palette.

## Upload Pack to a Basic OCI Registry

Palette supports all OCI-compliant registries that use basic authentication. This guide uses a
[Harbor](https://goharbor.io/) registry as an example. Follow the steps described below to set up your Harbor registry,
push the pack, and configure the registry in Palette.

1. Access the Harbor registry server domain on your web browser and log in using your credentials. If you have kept the
   default credentials, the username and password are **admin** and **Harbor12345**, respectively.

2. From the **Projects** section, click **New Project**. A project in Harbor contains all repositories of an
   application.

3. Give your project a name and keep the default settings for the remaining configuration. Click **OK** to proceed.

4. In your terminal, export the `HARBOR_ADDRESS` variable, which will store your Harbor address. Do not include the
   "https://" prefix.

   ```bash
   export HARBOR_ADDRESS=<Your_Harbor_Address>
   ```

5. Issue the command `oras login` to log in to your Harbor registry. When prompted, enter your username and password. If
   the login is successful, you will receive a confirmation message.

   ```bash
   oras login $HARBOR_ADDRESS
   ```

6. Next, export the variables required for creating the Harbor repository and pushing the pack.

   - `HARBOR_PROJECT` - Specify a name for the Harbor project that will store the repositories and the pack files. For
     example, `spectro-oci-registry`.
   - `NAME` - The pack's name, which must match the `name` parameter in the **pack.json** file.
   - `VERSION` - The pack's version, which must match the `version` parameter in the **pack.json** file.

   ```bash
   export HARBOR_PROJECT=<Your_Repository_Name>
   export NAME=<Your_Pack_Name>
   export VERSION=<Your_Pack_Version>
   ```

7. Navigate to the directory containing the folder with the pack files.

8. Before pushing the pack to the registry, compress the contents of the pack folder into an archive file. Issue the
   command below to create the archive file. Replace `<Your_Pack_Folder_Name>` with the name of the folder containing
   the pack files.

   ```bash
   tar -czvf $NAME-$VERSION.tar.gz <Your_Pack_Folder_Name>
   ```

9. Create a base path repository to store your pack repositories. Note that Harbor creates a repository when the user
   pushes an artifact to a project.

   ```bash
   oras push $HARBOR_ADDRESS/$HARBOR_PROJECT/spectro-packs/archive
   ```

10. Now, proceed to create the pack repository and push your pack to the Harbor registry.

    ```bash
    oras push $HARBOR_ADDRESS/$HARBOR_PROJECT/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
    ```

:::warning

Make sure to include the **spectro-packs/archive** path in _all_ your repositories. Palette expects this namespace in
custom OCI registries.

:::

11. After pushing the pack to the Harbor registry, follow the steps in [Add OCI Packs Registry](./add-oci-packs.md) to
    add your Harbor registry to Palette.

:::info

Palette automatically synchronizes the registries. However, you can manually trigger the synchronization if needed. From
the **OCI Registries** page, click the **three-dot Menu** next to the registry name you added and select **Sync**.

:::

## Validate

Follow the steps below to validate that your pack has been successfully pushed to your OCI registry.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Click **Add Cluster Profile**.

4. Provide a name and select the type **Add-on**.

5. In the following screen, click **Add Pack**.

6. Select the Basic OCI registry you added in the **Registry drop-down Menu**.

7. Verify the pack you uploaded to the Harbor registry is displayed.
