---
sidebar_label: "Palette SSO with Custom CA"
title: "Enable SSO with a Custom Certificate Authority"
description: "Learn how to set up Palette SSO with Microsoft Entra ID"
hide_table_of_contents: false
sidebar_position: 130
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "custom-ca", "rbac"]
---

A custom Certificate Authority (CA) refers to a certificate authority that is not part of the standard public CA
ecosystem but is instead managed internally within an organization. This guide explains how you can enable Palette SSO
with a custom CA certificate.

## Prerequisites

- Palette account with Tenant Admin access.

- Existing SSO configuration with an SSO provider supported in Palette. Refer to [SAML and OIDC SSO Setup](saml-sso.md)
  for links to provider-specific guides.

- Custom CA x509 certificate in the Privacy-Enhanced Mail (PEM) format issued by the SSO provider configured in Palette.

## Enable SSO with Custom CA

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant Admin.

2. From the left **Main Menu**, select **Tenant Settings**.

3. From the **Tenant Menu**, select **SSO** and, on the **Configure** tab, under **SSO Auth type**, select **OIDC**.

4. In the **Identity Provider CA Certificate** field, enter your custom CA x509 certificate in the PEM format.

   ![Palette that displays the OIDC configuration under SSO settings in the Tenant Settings menu. The Custom CA Certification field is highlighted.](/user-management_saml-sso_palette-sso-with-custom-ca_enter-cert.png)

5. Optionally, select the **Insecure Skip TLS Verify** checkbox to skip the TLS verification.

   :::info

   You cannot skip TLS verification for Palette VerteX instances. With Palette VerteX, you must provide a valid custom
   CA certificate.

   :::

6. At the bottom of the page, select **Enable** and, in the **Cluster Update Confirmation** modal, select **Continue**
   to confirm your changes.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) and follow the steps to sign in with your SSO provider.

2. If you have successfully logged in to Palette, then the custom CA certificate works as expected.
