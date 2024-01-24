---
sidebar_label: "Enable SSO in Palette"
title: "Enable SSO in Palette"
description: "Learn how to enable SSO in Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management", "saml-sso"]
---

With Spectro Cloud Palette, you can use SAML 2.0 protocols for single sign-on (SSO) authentication using your IdP.

<br />

## Set Up SAML-based SSO

To set up Spectro Cloud Palette with an identity provider (IdP) SAML based SSO:<p></p><br />

1. Log in to the Palette console as a Tenant Admin.<p></p><br />
2. Select **Tenant Settings** > **SSO Auth Type** > **SAML** to view the SAML panel.<p></p><br />
3. Complete the assertion form with the requested parameters. See below for more details specific to the supported
   IdPs.<p></p><br /> The following options will be available for configuring SAML SSO within Palette: <p></p><br />

   - **Service** - Choose your IdP (Azure Active Directory, Okta, Keycloak, OneLogin, ADFS, Other).<p></p><br />
   - **Identity Provider Metadata** - Enter the Identity Provider Metadata.<p></p><br />
   - **Default Teams** - Add the authenticated user's Default Team(s) Palette membership.<p></p><br />
   - **NameID Format** - Choose the appropriate version of the format in use (SAML 1.1, SAML 2.0, email address,
     other).<p></p><br />

   The following parameters will enable Spectro Cloud Palette as a **Service Provider** (SP) in your IdP. Your IdP will
   require some or all the information listed below to enable SSO with Palette. <p></p><br />

   - **Single Logout URL** - The IdP will use the logout URL for the SAML SSO configuration.<p></p><br />
   - **EntityId** - https://www.spectrocloud.com<p></p><br />
   - **FirstName** - Attribute in First Name format.<p></p><br />
   - **LastName** - Attribute in Last Name format.<p></p><br />
   - **Email** - Attribute in Email format.<p></p><br />
   - **SpectroTeam** - Attribute in SpectroTeam format.<p></p><br />
   - **Service Provider Metadata** - Provide the EntityDescriptor.<p></p><br />

4. Edit each parameter as necessary and click **Enable** to complete the setup wizard.<p></p><br />

<br />

## Set Up OIDC-based SSO

Spectro Cloud Palette supports OpenID Connect (OIDC), a de facto standard of contemporary authentication that provides
secured identity management in a highly interoperable format.<p></p><br />

## Procedure

To set up an OIDC-based SSO in Spectro Cloud Palette perform the following steps:<p></p><br />

1. Log in to the Palette console as the Tenant Admin. <p></p><br />
2. Select the **Tenant Settings** > **SSO** > **OIDC** to view the panel.<p></p><br />
3. Enable Spectro Cloud as the **Service Provider** by completing the form with the following parameters. Select the
   tabs below for more details specific to IdPs supported with Palette.<p></p><br />

   - **Issuer URL** - The URL of the OpenID identity provider.<br /> **Note**: For AWS users, Issuer URL needs to be
     generated in the format as described below: <p></p><br />
     `https://cognito-idp.[REGION].amazonaws.com/[USER-POOL-ID]` <p></p><br />

   * **Client ID** - The ID for the client application that makes authentication requests.<p></p><br />
   * **Client Secret** - Enter the secret created by the IdP.<p></p><br />
   * **Default Teams** - The Default Palette Team(s) to which authenticated members are assigned
     automatically.<p></p><br />
   * **Scopes** - The user's details will be used as part of SSO, like _email_, _firstname_, _lastname_ or _groups_.
     Each scope returns a set of user attributes, called claims. <p></p><br />Microsoft Azure AD Example: "openid,
     profile, email, allatclaims"<p></p><br />
   * **REQUIRED CLAIMS** - These are the parameter values, claimed by the user, to be mapped with the Identity Provider
     Platform. Complete the Required Claims:<p></p><br />

     - **Email** - Azure AD Example: "email"<p></p><br />
     - **First Name** - Azure AD Example: "given_name"<p></p><br />
     - **Last Name** - Azure AD Example: "family_name"<p></p><br />
     - **Spectro Team Name** - Azure AD Example: "groups". <p></p><br />Any non-admin user that is added to a Tenant,
       must be added to at least one Team. This Team can be changed later if needed. See the
       [Teams](../../glossary-all.md#team) section for more details on Teams.<p></p><br />

       - If a user is not added to a Team, the user can still log in successfully but will not be able to see the
         console until proper Project or Tenant permissions are applied (Tenant Admin, Project Admin, Project Viewer,
         and so on). The **SpectroTeam** attribute carries forward the available team(s) for the user being authorized.
         This gives the administrator the flexibility to grant access to Spectro Cloud Palette using either Users or
         Groups in their IdP or by adding users directly to a Palette Team(s).<p></p><br />

       - The values of the **SpectroTeam** parameter is case-sensitive, so the Tenant Admin should ensure that the team
         names are identical on both consoles. To sync an IdP group with a Palette Team, ensure the IdP group Name (or
         if it's Azure Active Directory, use the Object Id corresponding to the IdP group Name) matches the Palette Team
         name.<p></p><br />

       - A use case example can be where a new member is to be added to the Palette Tenant by the Tenant Admin. The
         administrator can configure a default Palette Team or a synced IdP group that is common to all authenticated
         users. This default Palette Team/IdP group can be applied to the Palette SAML Panel as a one-time
         setting.<p></p><br />

:::info

Your IdP may require the following settings to configure OIDC SSO with Palette:

- **Callback URL** - The URL to which Auth0 redirects users after they authenticate. Ensure that this value is
  configured for the application you registered with the OIDC Identity Provider.

- **Logout URL** - The IdP will use the logout URL for the OIDC SSO configuration.

:::

## Results

You have now established the minimum configuration that is required to configure Palette OIDC, capable of communicating
with other IdPs configured as OpenID Connect Providers.
