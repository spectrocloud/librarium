---
sidebar_label: "System-Level Registries"
title: "System-Level Registries"
description: "Learn how to add a system-level registry in self-hosted Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 130
tags: ["self-hosted", "management", "registry"]
keywords: ["self-hosted", "management", "registry"]
---

You can add a registry at the system level or tenant level. Registries added at the system level are available to all
the tenants. Registries added at the tenant level are available only to that tenant. This section describes how to add a
system-level registry. For guidance on adding a registry at the tenant scope, check out
[Add Tenant-Level Registry](../../../tenant-settings/add-registry.md).

## Prerequisites

- Access to the Palette system console.

## Add an OCI Pack Registry

Use the following steps to add a system-level OCI pack registry.

1. Log in to the Palette system console. You can do this by visiting the IP address or the custom domain name assigned
   to your Palette cluster and appending the /system path to the URL.

2. From the left **Main Menu** select **Administration**.

3. Select the **Pack Registries** tab, and click on the **Add New Pack Registry** button.

4. Provide a custom name for the registry, and select **OCI** as the registry type.

Accessing the registry is different depending on the OCI authentication type you choose. Select the tab below that
applies to your authentication method.

<Tabs groupId="authentication">

<TabItem label="Basic" value="Basic">

5. Provide the registry URL in the **Endpoint** field.

6. In the **Base Content Path** field, provide the base path or namespace of the repository you want to target in the
   registry.

7. If you have credentials, provide them in the **Username** and **Password** fields. Otherwise, leave these fields
   blank.

8. Click the **Validate** button. If the credentials you provided are correct, a _Credentials validated_ success message
   with a green check is displayed.

9. If an error message displays that pack registry details could not be validated, you can upload a self-signed
   Certificate Authority (CA) certificate. To do this, check the **Insecure Skip TLS Verify** box to skip verifying the
   x509 certificate, and click **Upload file** to upload the certificate.

10. When you have completed inputting values and credentials are validated, click **Confirm** to complete adding the
    registry.

</TabItem>

<TabItem label="ECR" value="ECR">

5. Provide the URL to the registry endpoint.

6. Provide the base path or namespace of the repository you want to target in the registry.

7. If you are adding an unprotected OCI registry, click the **Validate** button. To add a protected registry, enable the
   **Protected** toggle and select an AWS authentication method.

8. When accessing a protected registry, if you use **Credentials**, provide these in the **Access Key** and **Secret
   access key** fields. To use Security Token Service, review the guidance in the right panel that displays when you
   select **STS**.

9. Click the **Validate** button. If the credentials you provided are correct, a _Credentials validated_ success message
   with a green check is displayed.

10. If an error message displays that pack registry details could not be validated, you can upload a self-signed
    Certificate Authority (CA) certificate. To do this, check the **Insecure Skip TLS Verify** box to skip verifying the
    x509 certificate, and click **Upload file** to upload the certificate.

11. When you have completed inputting values and credentials are validated, click **Confirm** to complete adding the
    registry.

</TabItem>
</Tabs>

You have successfully added a system-level pack registry. Registries added at the system level can only be removed at
that level.

## Validate

You can verify the registry has been added if Palette displayed a _Credentials validated_ success message with a green
check when you added the registry. Use these steps to further verify the registry is added.

1. Log in to the [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu** select **Administration**.

3. Select the **Pack Registries** tab and verify the registry you added is listed and available.
