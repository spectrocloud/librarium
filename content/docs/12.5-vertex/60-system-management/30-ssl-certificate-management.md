---
title: "SSL Certificate Management"
metaTitle: "SSL Certificate"
metaDescription: "Upload and manage SSL certificates in Palette VerteX."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

When you install Palette VerteX, a self-signed certificate is generated and used by default. You can upload your own SSL certificate to replace the default certificate.

Palette VerteX uses SSL certificates to secure external communication. All of Palette VerteX's internal communication is secured by default and use HTTPS. The external communication with Palette VerteX, such as the system console, gRPC endpoint, and API endpoint, requires you to upload an SSL certificate if you want to enable HTTPS.  


# Upload an SSL Certificate

You can upload an SSL certificate in Palette VerteX by following these steps.


## Prerequisites

- Access to the Palette VerteX system console.

- You need to have an x509 certificate and a key file in PEM format. The certificate file must contain the full certificate chain. Reach out to your network administrator or security team if you do not have these files.


## Enablement

1. Log in to the Palette VerteX system console.


2. Navigate to the left **Main Menu** and select **Administration**.


3. Select the tab titled **Certificates**.


4. Copy and paste the certificate into the **Certificate** field.


5. Copy and paste the certificate key into the **Key** field.


6. Copy and paste the certificate authority into the **Certificate authority** field.


  <br />

  ![A view of the certificate upload screen](/vertex_system-management_ssl-certifiacte-management_certificate-upload.png)


7. Save your changes.


## Validate

