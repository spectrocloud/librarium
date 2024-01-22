---
sidebar_label: "SSL Certificate Management"
title: "SSL Certificate"
description: "Upload and manage SSL certificates in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["palette", "management"]
---

When you install Palette, a self-signed certificate is generated and used by default. You can upload your own SSL
certificate to replace the default certificate.

Palette uses SSL certificates to secure external communication. Internal components communication is by default secured
and use HTTPS. External communication with Palette, such as the system console, gRPC endpoint, and API endpoint,
requires you to upload an SSL certificate to enable HTTPS.

:::info

Enabling HTTPS is a non-disruptive operation. You can enable HTTPS at any time without affecting the system's
functionality.

:::

## Upload an SSL Certificate

You can upload an SSL certificate in Palette by using the following steps.

### Prerequisites

- Access to the Palette system console.

- You need to have an x509 certificate and a key file in PEM format. The certificate file must contain the full
  certificate chain. Reach out to your network administrator or security team if you do not have these files.

- Ensure the certificate is created for the custom domain name you specified for your Palette installation. If you did
  not specify a custom domain name, the certificate must be created for the Palette system console's IP address. You can
  also specify a load balancer's IP address if you are using a load balancer to access Palette .

### Enablement

1. Log in to the Palette system console.

2. Navigate to the left **Main Menu** and select **Administration**.

3. Select the tab titled **Certificates**.

4. Copy and paste the certificate into the **Certificate** field.

5. Copy and paste the certificate key into the **Key** field.

6. Copy and paste the certificate authority into the **Certificate authority** field.

<br />

![A view of the certificate upload screen](/palette_system-management_ssl-certifiacte-management_certificate-upload.png)

<br />

7. Save your changes.

If the certificate is invalid, you will receive an error message. Once the certificate is uploaded successfully, Palette
will refresh its listening ports and start using the new certificate.

### Validate

You can validate that your certificate is uploaded correctly by using the following steps.

<br />

1. Log out of the Palette system console. If you are already logged in, log out and close your browser session. Browsers
   cache connections and may not use the newly enabled HTTPS connection. Closing your existing browser session avoids
   issues related to your browser caching an HTTP connection.

2. Log back into the Palette system console. Ensure the connection is secure by checking the URL. The URL should start
   with `https://`.

Palette is now using your uploaded certificate to create a secure HTTPS connection with external clients. Users can now
securely access the system console, gRPC endpoint, and API endpoint.
