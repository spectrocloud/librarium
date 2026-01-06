---
sidebar_label: "SAML and OIDC SSO"
title: "SAML and OIDC SSO"
description: "Learn how to enable Single Sign-On (SSO) in Palette with SAML and OIDC."
icon: ""
hide_table_of_contents: false
tags: ["user-management", "saml-sso", "oidc", "saml", "sso"]
---

Palette supports Single Sign-On (SSO) with a variety of Identity Providers (IDP). You can enable SSO in Palette by using
the following protocols for authentication and authorization.

- Security Assertion Markup Language (SAML) - SAML is a standalone protocol that requires a centralized identity
  provider (IDP) to manage user identities and credentials. SAML supports SSO and is commonly used for enterprise
  applications.

- OpenID Connect (OIDC) - OIDC more modern protocol designed for web and mobile applications. OIDC is built on top of
  [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749), a widely used authorization framework. OIDC supports distributed
  identity providers and supports social login providers such as Google or GitHub.

## Palette OIDC and PXK

<!-- prettier-ignore -->
Palette can act as an Identity Provider (IDP) when <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> is used as the Kubernetes distribution in a cluster profile. Palette eXtended Kubernetes (PXK) is a recompiled version of the open source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette. To learn more about PXK, refer to the <VersionedLink text="PXK" url="/integrations/packs/?pack=kubernetes" /> page.

## OIDC Limitations

:::warning

Palette enforces a strict one-to-one mapping between an SSO domain and a tenant.

We recommend planning tenant boundaries around identity domains, using distinct SSO domains to enforce tenant
separation.

:::

Palette [API keys](../authentication/api-key/api-key.md) that belong to Palette users removed from the organization
through OIDC/SAML are not automatically removed. We recommend that you remove these keys to ensure that they are no
longer used. You can programmatically remove the API keys using the REST API or the Palette SDK. Check out the
[Delete API Key](../authentication/api-key/delete-api-key.md) page for more information on how to delete an API key
programmatically.

:::tip

Tenant administrators can view all API keys created for the tenant. Users are limited to actions for their own API keys.
To learn more about the API key management tasks you can perform as a tenant administrator, refer to the
[Tenant API Key Management](../../tenant-settings/api-key-management.md) page.

:::

Check out the following resources to enable SSO in Palette with the supported Identity Providers (IDP).

## Resources

- [Enable SSO with Microsoft Active Directory Federation Service (AD FS)](palette-sso-with-adfs.md)

- [Palette SSO with Okta OIDC](palette-sso-with-okta.md)

- [Palette SSO with Okta SAML](palette-sso-with-okta-saml.md)

- [Palette SSO with OneLogin](palette-sso-with-onelogin.md)

- [Palette SSO with Keycloak](palette-sso-with-keycloak.md)

- [Palette SSO with Microsoft Entra ID](palette-sso-with-entra-id.md)

- [Palette SSO with Custom CA](palette-sso-with-custom-ca.md)
