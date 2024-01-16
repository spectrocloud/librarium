---
sidebar_label: "SAML and SSO Setup"
title: "SAML and SSO Setup"
description: "Detailed instructions on creating Single Sign-on to log in to Palette using SAML 2.0"
icon: ""
hide_table_of_contents: false
tags: ["user-management", "saml-sso"]
---

Palette supports Single Sign-On (SSO) with a variety of Identity Providers (IDP). You can enable SSO in Palette by using the following protocols for authentication and authorization.

<br />

- Security Assertion Markup Language (SAML) - SAML is a standalone protocol that requires a centralized identity provider (IDP) to manage user identities and credentials. SAML supports SSO and is commonly used for enterprise applications.

- OpenID Connect (OIDC) - OIDC more modern protocol designed for web and mobile applications. OIDC is built on top of [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749), a widely used authorization framework. OIDC supports distributed identity providers and supports social login providers such as Google or GitHub.

Enable SSO by following our [Enable SSO in Palette](enable-saml.md) guide.

## Resources

- [Enable SSO in Palette](enable-saml.md)

- [Palette SSO with Azure Active Directory](palette-sso-azure-ad.md)

- [Enable SSO with Microsoft Active Directory Federation Service (AD FS)](palette-sso-with-adfs.md)

- [Palette SSO with Okta OIDC](palette-sso-with-okta.md)

- [Palette SSO with Okta SAML](palette-sso-with-okta-saml.md)

- [Palette SSO with OneLogin](palette-sso-with-onelogin.md)

- [Palette SSO with Keycloak](palette-sso-with-keycloak.md)
