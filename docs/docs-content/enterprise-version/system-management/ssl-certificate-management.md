---
sidebar_label: "System Address Management"
title: "System Address Management"
description: "Manage system address and SSL certificates in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
tags: ["palette", "management"]
keywords: ["self-hosted", "enterprise"]
---

Palette uses Secure Sockets Layer (SSL) certificates to secure internal and external communication with Hypertext
Transfer Protocol Secure (HTTPS). External Palette endpoints, such as the
[system console](../system-management/system-management.md#system-console),
[Palette dashboard](../../getting-started/dashboard.md), Palette API, and gRPC endpoints, are enabled by default with
HTTPS using an auto-generated self-signed certificate.

The Palette system console provides you with the ability to replace the self-signed certificate with a custom SSL
certificate to secure these endpoints. Additionally, you can update the system address, which is the IP address or Fully
Qualified Domain Name (FQDN) that you use to access your Palette installation. The system address and certificates may
be updated simultaneously.

:::warning

You can swap out the external endpoint certificate at any time without affecting the system functionality. However,
updating the system address may require manual reconciliation.

:::

## Prerequisites

- Access to the Palette system console.

- You need to have an x509 certificate and a key file in PEM format. The certificate file must contain the full
  certificate chain. Reach out to your network administrator or security team if you do not have these files.

- Ensure the certificate is created for the custom domain name you specified for your Palette installation. If you did
  not specify a custom domain name, the certificate must be created for the Palette system console's IP address. You can
  also specify a load balancer's IP address if you are using a load balancer to access Palette .

## Enablement

You can update your Palette system address and SSL certificates by using the following steps.

1. Log in to the Palette system console.

2. Navigate to the left **Main Menu** and select **Administration**.

3. Select the tab titled **System Address**.

4. Update your Palette domain in the **System Address (UI and API)** field.

5. Copy and paste the certificate into the **Certificate** field.

6. Copy and paste the certificate key into the **Key** field.

7. Copy and paste the certificate authority into the **Certificate authority** field.

   ![A view of the certificate upload screen](/palette_system-management_ssl-certificate-management_system-address.webp)

8. Click on **Update** to save your changes.

Palette validates the combination of system address, certificate, key, and Certificate Authority (CA). Ensure that the
certificate is not expired, as well as that it is valid for the CA and the system address. Additionally, ensure that
that the system address is accessible from the system console.

You will receive an error message if the provided values are not valid. Once the certificate is uploaded successfully,
Palette will refresh its listening ports and start using the newly configured values.

## Validate

You can validate that your certificate is uploaded correctly by using the following steps.

1. Log out of the Palette system console. If you are already logged in, log out and close your browser session. Browsers
   cache connections and may not use the newly enabled HTTPS connection. Closing your existing browser session avoids
   issues related to your browser caching an HTTP connection.

2. Log back into the Palette system console. Ensure the connection is secure by checking the URL. The URL should start
   with `https://`.

3. If you have any deployed clusters, navigate to the left **Main Menu** and select **Clusters**. Palette displays the
   status of your clusters.

Palette is now using your uploaded certificate to create a secure HTTPS connection with external clients. Users can now
securely access the system console, Palette dashboard, the gRPC endpoint, and the Palette API endpoint.
