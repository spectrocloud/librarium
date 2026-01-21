---
sidebar_label: "Add OCI Zarf Registry"
title: "Add OCI Zarf Registry"
description: "Learn how to add your own OCI Zarf Registry to Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 50
---

You can add an OCI Zarf registry to Palette and use the Zarf packages in cluster profiles.

## Prerequisites

- You must have an OCI registry that contains Zarf packages. Refer to the
  [Zarf documentation](https://docs.zarf.dev/tutorials/6-publish-and-deploy/) for guidance on creating a Zarf package.

- Credentials to access the OCI registry. Public OCI registries are not supported.

- If the OCI registry is using a self-signed certificate, or a certificate that is not signed by a trusted certificate
  authority (CA), you will need the certificate to add the registry to Palette.

- Tenant admin access to Palette.

## Add OCI Zarf Registry

Take the following steps to add an OCI Zarf registry to Palette.

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings** menu, select **Registries > OCI Registries > Add New OCI Registry**.

4. Enter the **Name** of the registry. Select **Zarf** as the **Provider**.

5. Enable the **Synchronization** toggle if you want your public Zarf packages to be automatically imported into
   Palette.

   :::info

   The value of the **Synchronization** toggle is immutable and cannot be changed after the OCI registry has been added
   to Palette.

   :::

6. Enter the registry URL in the **Endpoint** field.

7. If you enabled registry synchronization, fill in the relative paths that you want the registry to synchronize in the
   **Base Content Path** field. You can list multiple paths using a comma separator. If you are using a Harbor registry,
   fill the project name in this field.

   :::info

   Any Zarf packages directly under the root directory are not available for synchronization. Ensure that you place all
   the packages you want synchronized in a base path that matches the contents of the **Base Content Path** field.

   :::

8. Choose whether to **Enable Authentication** for your registry. If enabled, enter your registry credentials in the
   **Username** and **Password** fields.

9. If your OCI registry server is using a self-signed certificate, or if the server certificate is not signed by a
   trusted CA, select **Insecure Skip TLS Verify** to skip verifying the x509 certificate, and select **Upload file** to
   upload the certificate.

10. **Confirm** your registry.

11. The list of OCI registries appears and a row is added for your new registry. If enabled, the synchronization process
    begins immediately after registry creation. A timestamp will display in the **Last Synced** column once it
    completes.

    :::info

    OCI registries with synchronization enabled are synchronized daily. Alternatively, you can also trigger
    synchronization on demand. Refer to the [Validate](#validate) section for further details.

    :::

## Validate

Take the following steps to confirm that the OCI registry was added to Palette.

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left main menu, select **Profiles**.

3. Choose **Add Cluster Profile**.

4. Enter a **Name** for the profile. For the **Type**, choose **Add-on**, and select **Next**.

5. On the **Profile Layers** screen, select **Add Zarf**.

6. Verify the Zarf registry you added is displayed in the **Registry** drop-down menu.

7. If you enabled synchronization, select **Tenant Settings** from the left main menu.

8. From the **Tenant Settings** menu, select **Registries > OCI Registries**. Find your registry in the list of OCI
   registries. Select **Sync** from the three-dot menu.

   ![Sync OCI registry dropdown](/registries-and-packs_registries_oci-registry_add-oci-zarf_sync-registry.webp)

   The **Last Synced** column displays **Sync in progress**. A timestamp appears in the column once the process
   completes.
