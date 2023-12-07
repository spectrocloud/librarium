---
sidebar_label: "Configure SMTP"
title: "Configure SMTP"
description: "Learn how to configure an SMTP server for your Palette instance."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["vertex", "management"]
keywords: ["self-hosted", "vertex"]
---

You can configure a Simple Mail Transport Protocol (SMTP) server to send emails on behalf of your Palette VerteX instance. An SMTP server is required to change the email address of the admin user and to send the initial tenant invitation email.

## Prerequisites

- Access to the system console.

- SMTP server details such as the host name, port number, and credentials.

- The outgoing port number of the SMTP must be open to allow Palette to send emails.

## Configure SMTP

1. Log in to the system console. Refer to [Access the System Console](system-management.md#access-the-system-console) guide.

2. From the **left Main Menu** select **Administration**.

3. Click on the **SMTP** tab.

4. Fill out the following fields.

  | **Field** | **Description** |
  | --- | --- |
  | **Outgoing Server** | The host name of the SMTP server. For example `smtp.gmail.com`. |
  | **Outgoing Port** | The port number of the SMTP server.|
  | **From Email** | The email address from which the emails will be sent. Emails sent from Palette will be sent from this email address. |
  | **Username** | The username of the SMTP server. |
  | **Password** | The password of the SMTP server. |
  | **Insecure Skip TLS Verify** | Enable this option if your SMTP server is using a self-signed certificate, or has a certificate that is not trusted by the system. This option disables the TLS certificate verification. |


5. Click **Validate configuration** to validate the SMTP configuration. If the configuration is valid, a success message is displayed, otherwise an error message is displayed.


6. Save your changes by clicking **Save**.


## Validate

The SMTP configuration is validated when you click **Validate configuration**. If the configuration is valid, a success message is displayed, otherwise an error message is displayed.