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

5. Enter the registry URL in the **Endpoint** field.

6. Choose whether to **Enable Authentication** for your registry. If enabled, you must enter your registry credentials
   in the **Username** and **Password** fields.

7. If your OCI registry server is using a self-signed certificate, or if the server certificate is not signed by a
   trusted CA, select **Insecure Skip TLS Verify** to skip verifying the x509 certificate, and select **Upload file** to
   upload the certificate.
8. **Confirm** your registry.

## Validate

Take the following steps to confirm that the OCI registry was added to Palette.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Choose **Add Cluster Profile**.

4. Enter a **Name** for the profile. For the **Type**, choose **Add-on**, and select **Next**.

5. On the **Profile Layers** screen, select **Add Zarf**.

6. Verify the Zarf registry you added is displayed in the **Registry** drop-down menu.
