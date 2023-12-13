---
sidebar_label: "Add OCI Zarf Registry"
title: "Add OCI Zarf Registry"
description: "Learn how to add your own OCI Zarf Registry to Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 50
---


You can add an OCI Zarf registry to Palette and use the Zarf packages  cluster profiles. 


## Prerequisites

- You must have an OCI registry that contains Zarf packages.  

- Credentials to access the OCI registry. 

- If the OCI registry is using a self-signed certificate, or a certificate that is not signed by a trusted certificate authority (CA), you will need the certificate to add the registry to Palette. 

- Tenant admin access to Palette.


## Add OCI Zarf Registry

Use the following steps to add an OCI Zarf registry to Palette.

1. Log in to the [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left **Main Menu** select **Tenant Settings**. 

3. From the **Tenant Settings Menu**, Select **Registries**.

4. Click on the **OCI Registries** tab.

5. Click **Add New OCI Registry**.

6. Fill out the **Name** field and select **Helm** as the registry type.

7. Select the **OCI Authentication Type** as **Basic**.

8. Provide the registry URL in the **Endpoint** field.

9. Fill out the **Username** and **Password** fields with the credentials to access the registry.

10. If your OCI registry server is using a self-signed certificate or if the server certificate is not signed by a trusted CA, check the **Insecure Skip TLS Verify** box to skip verifying the x509 certificate, and click **Upload file** to upload the certificate.

11. Click **Confirm** to complete adding the registry.

## Validate


Use the following steps to validate that the OCI registry is added to Palette correctly.

1. Log in to the [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Click **Add Cluster Profile**.

4. Provide a name and select the type **Add-on**.

5. In the following screen, click **Add Zarf**.

6. Verify the Zarf registry you added is displayed in the **Registry drop-down Menu**.