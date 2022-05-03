---
title: "SSO Setup"
metaTitle: "SSO Setup"
metaDescription: "Detailed instructions on creating SSO to log in to Palette using SAML 2.0"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Single sign-on (SSO) is an authentication method that enables secured user authentication with multiple applications and websites by using a single set of credentials.
SSO works upon a trust relationship set up between the service provider and an identity provider, such as Okta. This trust relationship is often based upon a certificate that is exchanged between the identity provider and the service provider.

This certificate can be used to sign identity information that is being sent from the identity provider to the service provider so that the service provider knows it is coming from a trusted source. In SSO, this identity data takes the form of tokens which contain identifying bits of information about the users.
Palette supports the following two types of SSO authentication mechanisms:

* SAML Based SSO
* OIDC Based SSO


<Tabs>

<Tabs.TabPane tab="SAML BASED SSO" key="saml">


# SAML 2.0 Based SSO

1. To set up an identity provider (IdP) based SSO, sign in to the Palette console as the *Tenant Admin*.
2. Access the Tenant Admin settings area by clicking the **Admin** button on the left panel.
3. Choose the IdP from the **Service** dropdown menu, select the **Tenant Settings** from the **Tenant Admin** menu, and then click from the SSO click **SAML** on the Palette console to view the SAML panel.
4. Toggle the **Enable SSO** button to bring up the configuration boxes.
5. The following parameters will be available for enabling the addition of Palette as a **Service Provider** into the IdPs:
    - EntityId
    - NameId Format
    - Login URL
    - FirstName
    - LastName
    - Email
    - SpectroTeam
    - Service Provider Metadata

Using these parameters, Palette should be added as the Service Provider (SP) app in the IdP's configuration. More details specific to IdPs to follow.

The next step is to copy the **Identity Provider Metadata** from the IdP into the Palette SAML panel. Click on **Confirm** to complete the setup.

## Recommended Identity Providers

<Tabs>

<Tabs.TabPane tab="Okta" key="okta">

### Okta


#### References

https://developer.okta.com/docs/guides/build-sso-integration/saml2/before-you-begin/

</Tabs.TabPane>

<Tabs.TabPane tab="Azure AD" key="azure_ad">

### Azure Active Director

#### References

https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal-setup-sso

</Tabs.TabPane>

<Tabs.TabPane tab="KeyCloak" key="keycloak">

### KeyCloak

#### References

https://www.keycloak.org/docs/latest/server_admin/#saml-clients

</Tabs.TabPane>

<Tabs.TabPane tab="OneLogin" key="onelogin">

### OneLogin

#### References

https://developers.onelogin.com/saml/app-catalog

</Tabs.TabPane>

<Tabs.TabPane tab="MSFT AD FS" key="msft_adfs">

### Microsoft AD FS

#### References

https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-fed-saml-idp

</Tabs.TabPane>

</Tabs>



</Tabs.TabPane>


<Tabs.TabPane tab="OIDC BASED SSO" key="oidc">


# OIDC BASED SSO

Palette supports, **OpenID Connect**, a defacto standard of contemporary authentication that provides secured identity management in a highly interoperable format.

To set up OIDC based SSO:
1. Log in to the Palette console as the Tenant Admin.
2. Access the Tenant Admin settings area by clicking the **Admin Settings** button on the left panel.
3. Choose *SSO* from the Tenant Admin settings menu.
4. From the **Manage the SSO** wizard, select the *SSO Auth* type.
5. The following parameters will be available to enable Palette as a **Service Provider**.
  - **Issuer UR**L - The URL of the OpenID identity

<InfoBox>

 **Note**: For AWS users, the issuer URL is to be generated in the below format:
 https://cognito-idp.[REGION].amazonaws.com/[USER-POOL-ID]

</InfoBox>

  - **Client ID** - The ID for the client application that makes authentication requests.
  - **Client Secret** - Secret is known only to the application and the authorization server
  - **Callback URL** - URL to which Auth0 redirects users after they authenticate. Ensure that this value is configured for the app you registered with the OIDC Identity Provider.
  - **Logout URL** - URL is taken from IdP - URL to be provided into IDP for Logout
  - **Default Teams** - Default team to which members unassigned to specific team belongs.
  - **Scopes** - The scopes are used by an application during authentication to authorize access to a user's details, like name and picture. Each scope returns a set of user attributes, called claims.

**Required Claims**: The parameter values claimed by the user to be mapped with the identity provider platform. The choice of parameters can be done by the users which can be an email, first name, last name, or Spectro Team.

Palette should be added as the Service Provider (SP) app in the IdP's configuration using these parameters. More details specific to IdPs to follow.

<InfoBox>

**SpectroTeam Parameters**

* Any non-admin user that is added to a Tenant must be added to at least one Team when being created by the admin. This Team can be changed later on if needed. See the ["teams"](/introduction/concept-overviews#team) section for more details on Teams and creating them.

* In case a user is not added to any team, the user can still sign in successfully but will not be able to see the console. The `SpectroTeam` attribute carries forward the available team(s) for the user being authorized. This gives the admin the flexibility to add users into Teams from both Palette and from the IdP.

* The values of the `SpectroTeam` parameter is case-sensitive, so the Tenant Admin should ensure that the Team names are identical on both the consoles. A Team created on the IdP which is not mentioned in Palette will be ignored.

* A sample use case is where a new member is to be added to the Palette tenant by the Tenant admin. The admin can have a default Team that is common to all users. This can be applied to the Palette SAML Panel as a one-time setting. When a new user is added, the IdP dashboard can be used to add this user to additional Teams as required. Without this arrangement, the Tenant Admin will need to add the user and then perform the team assignment separately each time.

</InfoBox>


## Recommended Identity Providers

<Tabs>

<Tabs.TabPane tab="Okta" key="okta">

### Okta


#### References

https://developer.okta.com/docs/guides/build-sso-integration/openidconnect/before-you-begin/

</Tabs.TabPane>

<Tabs.TabPane tab="Azure AD" key="azure_ad">

### Azure Active Director

#### References

https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc

</Tabs.TabPane>

<Tabs.TabPane tab="KeyCloak" key="keycloak">

### KeyCloak

#### References

https://www.keycloak.org/docs/latest/server_admin/#_oidc

</Tabs.TabPane>

<Tabs.TabPane tab="OneLogin" key="onelogin">

### OneLogin

#### References

https://developers.onelogin.com/openid-connect

</Tabs.TabPane>

<Tabs.TabPane tab="MSFT AD FS" key="msft_adfs">

### Microsoft AD FS

#### References


https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/ad-fs-openid-connect-oauth-concepts

</Tabs.TabPane>

</Tabs>



</Tabs.TabPane>



</Tabs>
