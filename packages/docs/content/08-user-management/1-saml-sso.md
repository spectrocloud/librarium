---
title: "SSO Setup"
metaTitle: "SSO Setup"
metaDescription: "Detailed instructions on creating SSO to log in to Spectro Cloud using SAML 2.0"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';

# Overview

Single sign-on (SSO) is an authentication method that enables secured user authentication with multiple applications and websites by using a single set of credentials.
SSO works upon  a trust relationship set up between the service provider, and an identity provider such as Okta. This trust relationship is often based upon a certificate that is exchanged between the identity provider and the service provider. This certificate can be used to sign identity information that is being sent from the identity provider to the service provider so that the service provider knows it is coming from a trusted source. In SSO, this identity data takes the form of tokens which contain identifying bits of information about the users.
Spectro Cloud supports two type of SSO authentication as below. 

* SAML Based SSO
* OIDC Based SSO


<Tabs>

<Tabs.TabPane tab="SAML BASED SSO" key="saml">


# SAML 2.0 Based SSO

To setup IdP based SSO, log in to the Spectro Cloud console as the tenant admin. Access the tenant admin settings area by clicking the "Admin" button on the left panel. Choose the IdP from the "Service" dropdown menu. Select the "Settings" from the "Admin menu" and then click "SAML" on the Spectro Cloud console to view the SAML panel. Toggle the `Enable SSO` button to bring up the configuration boxes. The following parameters will be available for enabling the addition of Spectro Cloud as a "Service Provider" into the IdPs:

1. EntityId
1. NameId Format
1. Login URL
1. FirstName
1. LastName
1. Email
1. SpectroTeam
1. Service Provider Metadata

Using these parameters, Spectro Cloud should be added as the Service Provider (SP) app in the IdP's configuration. More details specific to IdPs follow.

The next step is to copy the `Identity Provider Metadata` from the IdP into the Spectro Cloud SAML panel. Click on *"Confirm"* to complete the setup.

## Recommended Identity Provider

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

Spectro Cloud layouts OpenID Connect, a de facto standard of contemporary authentication. This can provide congruous and secured identity management in a highly interoperable format. Now Spectro Users can leverage OIDC to enhance the user experience and security. 

To setup OIDC based SSO :
* Log in to the Spectro Cloud console as the tenant admin. 
* Access the tenant admin settings area by clicking the "Admin Settings" button on the left panel. 
* Choose SSO from the admin settings menu. 
* From manage SSO wizard, select the SSO Auth type as OIDC panel. 
* The following parameters will be available to enable Spectro Cloud as a "Service Provider".

	* Issuer URL - The URL of the OpenID identity provider.

	Note: For AWS users issuer URL to be generated in the below format:
	https://cognito-idp.[REGION].amazonaws.com/[USER-POOL-NAME]
	* Client ID - The ID for the client application that makes authentication requests.
	* Client Secret - Secret is known only to the application and the authorization. server
	* Callback URL - URL to which Auth0 redirects users after they authenticate. Ensure that this value is configured for the app you registered with the OIDC Identity Provider.
	* Logout URL - URL is taken from IdP - URL to be provided into IDP for Logout
	* Default Teams - Default team to which members unassigned to specific team belongs.
	* Scopes - The scopes are used by an application during authentication to authorize access to a user's details, like name and picture. Each scope returns a set of user attributes,called claims. 


* REQUIRED CLAIMS: The parameter values claimed by the user to be  mapped with the identity provider platform.The choice of parameters can be done by the users which can be an Email, First Name, Last Name, Spectro Team Etc.     

Update all the above values as per the IdP parameters and enable OIDC to find the setup completed message. Spectro Cloud should be added as the Service Provider (SP) app in the IdP's configuration using these parameters. More details specific to IdPs follow.           


## Recommended Identity Provider

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



<InfoBox>
 
SpectroTeam Parameter

* Any non-admin user that is added to a tenant must be added to at least one team when being created by the admin. This team can be changed later on if needed. See the ["teams"](/introduction/concept-overviews#team) section for more details on teams and creating them. 

* In case a user is not added to any team, the user can still login successfully but will not be able to see the console. The `SpectroTeam` attribute carries forward the available team/s for the user being authorized. This gives the admin the flexibility to add users into teams from both Spectro Cloud as well with IDP. 

* The values of the `SpectroTeam` parameter is case sensitive, so the tenant admin should ensure that the team names are identical on both the consoles. A team created on the IdP which is not mentioned in Spectro Cloud will be ignored.

* A sample use case is where a new member is to be added to the Spectro Cloud tenant by the tenant admin. The admin can have a default team that is common to all users. This can be applied to the Spectro Cloud SAML Panel as a one-time setting. When a new user is added, the IdP dashboard can be used to add this user to additional teams as required. Without this arrangement, the tenant admin would need to add the user and then perform the team assignment separately each time.

</InfoBox>
