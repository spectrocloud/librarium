---
sidebar_label: "Legacy Pack Registries"
title: "Legacy Pack Registries"
description: "Learn how to add your own Pack Registries to Palette"
hide_table_of_contents: false
sidebar_position: 70
---

A Pack Registry is a server-side application that stores and serves packs to its clients. These packs are retrieved and
presented as options during the creation of a cluster profile. You can add your own Pack Registry to Palette and use the
packs in your cluster profiles.

To create your own Legacy Pack Registry, you must first stand up a server-side application registry that serves the
packs using the Spectro CLI. Refer to the [Add a Custom Registry](../adding-a-custom-registry.md) resource to learn how
to start a server-side application registry that serves packs.

:::info

We recommend you create an Open Container Initiative (OCI) Pack Registry versus using the Legacy Pack registry. OCI Pack
registries provide you with greater hosting flexibility and allow you to use existing OCI registries you may have in
your environment. Refer to the [OCI Registry](./oci-registry/oci-registry.md) resource to learn more about using OCI
registries in Palette.

:::

## Prerequisites

- You must have a server-side application registry that serves packs using the Spectro CLI. Refer to
  [Add a Custom Registry](../adding-a-custom-registry.md) page to learn how to start a server-side application registry
  that serves packs.

- Tenant admin access to Palette.

## Add Legacy Pack Registry

Use the following steps to add a Legacy Pack registry to Palette.

1. Log in to the [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left **Main Menu** select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Registries**.

4. Click on the **Pack Registries** tab.

5. Click **Add New Pack Registry**.

6. Fill out the following fields.

   | **Field**                    | **Description**                                                                                                                             |
   | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                     | Enter a name for the registry.                                                                                                              |
   | **Endpoint**                 | Enter the URL of the registry.                                                                                                              |
   | **Authentication Type**      | Select the authentication type used by the registry.                                                                                        |
   | **Username**                 | Enter the username to access the registry.                                                                                                  |
   | **Password**                 | Enter the password to access the registry.                                                                                                  |
   | **Insecure Skip TLS Verify** | Check this box if the registry is using a self-signed certificate or if the server certificate is not signed by a trusted CA.               |
   | **Certificate**              | If the registry is using a self-signed certificate or if the server certificate is not signed by a trusted CA, upload the X509 certificate. |

7. Click **Validate** to validate the registry. If the credentials are valid and Palette is able to connect to the
   registry, the registry is added to Palette. Otherwise, an error message is displayed.

:::tip

   If you are encountering issues with adding a registry, review the endpoint URL and ensure that it is accessible from
   Palette. Verify the credentials and try again. Lastly, if the registry is hosted on a server using a self-signed
   certificate, upload the certificate to Palette and skip TLS verification.

:::

8. Click **Confirm** to complete adding the registry.

## Validate

Use the following steps to validate that the registry is added to Palette correctly.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Click **Add Cluster Profile**.

4. Provide a name and select the type **Add-on**.

5. In the following screen, click **Add Pack**.

6. Verify the registry you added is displayed in the **Registry drop-down Menu**. If you added packs to the registry,
   the packs are displayed below.
