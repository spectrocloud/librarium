---
sidebar_label: "SAML and SSO Setup"
title: "SAML and SSO Setup"
description: "Detailed instructions on creating Single Sign-on to log in to Palette using SAML 2.0"
icon: ""
hide_table_of_contents: false

---


# Overview

Palette supports Single Sign-On (SSO) with a variety of Identity Providers (IDP). You can enable SSO in Palette by using the following protocols for authentication and authorization.

<br />


- Security Assertion Markup Language (SAML) - SAML is a standalone protocol that requires a centralized identity provider (IDP) to manage user identities and credentials. SAML supports SSO and is commonly used for enterprise applications.


- OpenID Connect (OIDC) - OIDC more modern protocol designed for web and mobile applications. OIDC is built on top of [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749), a widely used authorization framework. OIDC supports distributed identity providers and supports social login providers such as Google or GitHub.

Enable SSO by following our [Enable SSO in Palette](/user-management/saml-sso/enable-saml) guide. 

# Resources

- [Enable SSO in Palette](/user-management/saml-sso/enable-saml)


- [Palette SSO with Azure Active Directory](/user-management/saml-sso/palette-sso-azure-ad)


- [Enable SSO with Microsoft Active Directory Federation Service (AD FS)](/user-management/saml-sso/palette-sso-with-adfs)


- [Palette SSO with Okta](/user-management/saml-sso/palette-sso-with-okta)
