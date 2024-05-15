---
sidebar_label: "SSL Certificate Management"
title: "SSL Certificate"
description: "Upload and manage SSL certificates in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
tags: ["palette", "management"]
keywords: ["self-hosted", "enterprise"]
---

Palette uses Secure Sockets Layer (SSL) certificates to secure internal and external communication with Hypertext
Transfer Protocol Secure (HTTPS). External Palette endpoints, such as the
[system console](../system-management/system-management.md#system-console),
[Palette dashboard](../../getting-started/dashboard.md), Palette API, and gRPC endpoints, are enabled by default
with HTTPS using an auto-generated self-signed certificate. You can replace the self-signed certificate with a custom SSL
certificate to secure these endpoints.

:::info

You can swap out the external endpoint certificate at any time without affecting the system functionality.

:::

## Prerequisites

- Access to the Palette system console.

- You need to have an x509 certificate and a key file in PEM format. The certificate file must contain the full
  certificate chain. Reach out to your network administrator or security team if you do not have these files.

- Ensure the certificate is created for the custom domain name you specified for your Palette installation. If you did
  not specify a custom domain name, the certificate must be created for the Palette system console's IP address. You can
  also specify a load balancer's IP address if you are using a load balancer to access Palette .

## Enablement

You can upload an SSL certificate in Palette by using the following steps.

1. Log in to the Palette system console.

2. Navigate to the left **Main Menu** and select **Administration**.

3. Select the tab titled **Certificates**.

4. Copy and paste the certificate into the **Certificate** field.

5. Copy and paste the certificate key into the **Key** field.

6. Copy and paste the certificate authority into the **Certificate authority** field.

   ![A view of the certificate upload screen](/palette_system-management_ssl-certifiacte-management_certificate-upload.webp)

7. Save your changes.

If the certificate is invalid, you will receive an error message. Once the certificate is uploaded successfully, Palette
will refresh its listening ports and start using the new certificate.

## Validate

You can validate that your certificate is uploaded correctly by using the following steps.

1. Log out of the Palette system console. If you are already logged in, log out and close your browser session. Browsers
   cache connections and may not use the newly enabled HTTPS connection. Closing your existing browser session avoids
   issues related to your browser caching an HTTP connection.

2. Log back into the Palette system console. Ensure the connection is secure by checking the URL. The URL should start
   with `https://`.

Palette is now using your uploaded certificate to create a secure HTTPS connection with external clients. Users can now
securely access the system console, Palette dashboard, the gRPC endpoint, and the Palette API endpoint.
