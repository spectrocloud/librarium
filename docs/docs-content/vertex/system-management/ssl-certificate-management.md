---
sidebar_label: "SSL Certificate Management"
title: "SSL Certificate"
description: "Upload and manage SSL certificates in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
tags: ["vertex", "management"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX uses Secure Sockets Layer (SSL) certificates to secure internal and external communication with Hypertext
Transfer Protocol Secure (HTTPS). External VerteX endpoints, such as the
[system console](../system-management/system-management.md#system-console),
[VerteX dashboard](../../getting-started/dashboard.md), the VerteX API, and the gRPC endpoint, are enabled by default
with HTTPS using an auto-generated self-signed certificate. You can replace the self-signed certificate with your SSL
certificate to secure these endpoints.

:::info

You can swap out the external endpoint certificate at any time without affecting the system's functionality.

:::

## Prerequisites

- Access to the Palette VerteX system console.

- You need to have an x509 certificate and a key file in PEM format. The certificate file must contain the full
  certificate chain. Reach out to your network administrator or security team if you do not have these files.

- Ensure the certificate is created for the custom domain name you specified for your Palette VerteX installation. If
  you did not specify a custom domain name, the certificate must be created for the Palette VerteX system console's IP
  address. You can also specify a load balancer's IP address if you are using a load balancer to access Palette VerteX.

## Enablement

You can upload an SSL certificate in Palette VerteX by using the following steps.

1. Log in to the Palette VerteX system console.

2. Navigate to the left **Main Menu** and select **Administration**.

3. Select the tab titled **Certificates**.

4. Copy and paste the certificate into the **Certificate** field.

5. Copy and paste the certificate key into the **Key** field.

6. Copy and paste the certificate authority into the **Certificate authority** field.

   ![A view of the certificate upload screen](/vertex_system-management_ssl-certifiacte-management_certificate-upload.webp)

7. Save your changes.

If the certificate is invalid, you will receive an error message. Once the certificate is uploaded successfully, Palette
VerteX will refresh its listening ports and start using the new certificate.

## Validate

You can validate that your certificate is uploaded correctly by using the following steps.

1. Log out of the Palette VerteX system console. If you are already logged in, log out and close your browser session.
   Browsers cache connections and may not use the newly enabled HTTPS connection. Closing your existing browser session
   avoids issues related to your browser caching an HTTP connection.

2. Log back into the Palette VerteX system console. Ensure the connection is secure by checking the URL. The URL should
   start with `https://`.

VerteX is now using your uploaded certificate to create a secure HTTPS connection with external clients. Users can now
securely access the system console, VerteX dashboard, the gRPC endpoint, and the VerteX API endpoint.
