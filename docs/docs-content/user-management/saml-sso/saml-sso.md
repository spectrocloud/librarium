---
sidebar_label: "SAML and OIDC SSO"
title: "SAML and OIDC SSO"
description: "Learn how to enable Single Sign-On (SSO) in Palette with SAML and OIDC."
icon: ""
hide_table_of_contents: false
tags: ["user-management", "saml-sso"]
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

Check out the following resources to enable SSO in Palette with the supported Identity Providers (IDP).

## Resources

- [Enable SSO with Microsoft Active Directory Federation Service (AD FS)](palette-sso-with-adfs.md)

- [Palette SSO with Okta OIDC](palette-sso-with-okta.md)

- [Palette SSO with Okta SAML](palette-sso-with-okta-saml.md)

- [Palette SSO with OneLogin](palette-sso-with-onelogin.md)

- [Palette SSO with Keycloak](palette-sso-with-keycloak.md)
