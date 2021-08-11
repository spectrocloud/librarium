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
	* Sync Teams - Teams created in IdP if needed to be linked to Spectro Cloud.
	* Default Teams - Default team to which members unassigned to specific team belongs.
	* Scopes - The scopes are used by an application during authentication to authorize access to a user's details, like name and picture. Each scope returns a set of user attributes,called claims. 


* REQUIRED CLAIMS: The values claimed by the user at the identity provider platform.

	* Email
	* First Name
	* Last Name
	* Spectro Team     

Update all the above values as per the IdP parameters and enable OIDC to find the setup completed message. Spectro Cloud should be added as the Service Provider (SP) app in the IdP's configuration using these parameters. More details specific to IdPs follow.           


</Tabs.TabPane>

</Tabs>


# Identity Provider Specific Instructions

<Tabs>

<Tabs.TabPane tab="Okta" key="okta">

## Okta

In the Spectro Cloud SAML Panel, after selecting Okta as the IdP service from the dropdown, copy the `Login URL` using the copy icon next to the URL box. This URL along with other information such as `Service Provider Metadata` will be needed to add Spectro Cloud as a new "application" in your Okta dashboard.

In a new tab, open www.okta.com and login to access its dashboard.

Under the `Applications` main tab, select the `Applications` option again.

Click `Add Application` and then click the `Create New App` option.

In the window that opens next, under "General Settings", choose "Web" as the "Platform" and select `SAML 2.0` as the sign-on method. Click `Create` to add the new app.

Your new app is added to Okta and needs to be configured. Give a name to the app that has been created.

**We strongly recommend using the** `ENTITYID` **as it is from the Spectro Cloud SAML Panel as the app name.**

Click `Next` to go to the "Configure SAML" tab.

In the "GENERAL" section, the "Single Sign On URL" should be the same as the  `LOGIN URL` in the Spectro Cloud SAML Panel. Check the box for "Use this for Recipient URL and Destination URL."

Copy-paste the `ENTITYID` from the Spectro Cloud SAML Panel into the "Audience URI (SP Entity ID)".

In the "NameID format", select `EmailAddress` from the dropdown. In the "ATTRIBUTE STATEMENTS (OPTIONAL)" section, add the following fields:

|Name| Name Format (Optional)   | Value   |
|---|---|---|
|FirstName   | unspecified            | user.firstName|
| LastName    | unspecified            | user.lastName                                 |
| Email       | unspecified            | user.email                                    |
| SpectroTeam | unspecified            | *Enter default team. See explanation below* |

Finish the "teams" configuration and click `Next` to access the last tab on the Okta dashboard, which is the `Feedback` tab. Here, select the "***I'm a software vendor***" option and click `Finish` to complete the Okta configuration.

This will return to the Okta `Applications` page. The Spectro Cloud should now be visible. Under the `Sign On` tab, click on the `View Setup Instructions` button. This opens a new tab showing the IdP SAML details. Copy the `IDP Metadata` and paste it into the corresponding box in the Spectro Cloud SAML Console. Click `Confirm` to finish the process. A success banner should be visible on the top left which ensures the completion of the configuration.

With this, the tenant admin is ready to start adding users from the Okta dashboard. In the Okta `Applications` page under the Spectro Cloud application, use the `Assignments` tab to add users. Click on the `Assign` button and select the `Assign to people` option. (If you have set up groups, you can use this option as well.) In the popup window, select the users who are to be given access to Spectro Cloud.

Now a user can log in with the `LOGIN URL`. This will automatically redirect to the Okta sign-in page. If the user is already signed in to Okta, the page will again redirect to Spectro Cloud automatically.

This completes the sign-in process for the user.

## References

https://developer.okta.com/docs/guides/build-sso-integration/saml2/before-you-begin/

</Tabs.TabPane>

<Tabs.TabPane tab="Azure AD" key="azure_ad">

## Azure Active Directory

Log in to the portal and click on `Enterprise applications`. Click on `New application` and select the `Non-gallery application` with a name of your choice.

Once the application is created, [add the users](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/add-users-azure-active-directory) and/or groups into the application as needed. Then click on the `Set up single sign on` option.

Select `SAML` to open the configuration page. Here, the individual attributes of the Spectro Cloud metadata file can be configured. Under the `Basic SAML Configuration` section, copy the `ENTITYID` from the Spectro Cloud SAML Panel into the `Identifier (Entity ID)` box.

Copy the ACS URL from the `LOGIN URL` section in the Spectro Cloud SAML panel into the `Reply URL` box. Similarly, copy the `LOGIN URL` in the Spectro Cloud SAML Panel into the `Sign on URL` box. Click `Save` to complete the configuration.

Edit the `User Attributes and Claims` box on the Azure portal, to configure the `Additional Claims` as follows:

|  **Claim Name** | **Value**   |
|---|---|
| FirstName  | user.firstName  |
| LastName | user.lastName |
| Email| user.email |
| SpectroTeam | *Enter default team. See below for explanation.* |

Once the configuration is saved, download the `Federation Metadata XML` in the `SAML Signing Certificate` module. The contents of this XML are to be provided into the `IDENTITY PROVIDER METADATA` on the Spectro Cloud SAML panel. This completes the SAML based SSO for Azure AD into Spectro Cloud.

## References

https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/configure-single-sign-on-non-gallery-applications

</Tabs.TabPane>

<Tabs.TabPane tab="KeyCloak" key="keycloak">

## KeyCloak

## References

https://www.keycloak.org/docs/latest/server_admin/#saml-clients

</Tabs.TabPane>

<Tabs.TabPane tab="OneLogin" key="onelogin">

## OneLogin

## References

https://developers.onelogin.com/saml/app-catalog

</Tabs.TabPane>

<Tabs.TabPane tab="MSFT AD FS" key="msft_adfs">

## Microsoft AD FS

## References

https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-fed-saml-idp

</Tabs.TabPane>

</Tabs>

# About the `SpectroTeam` Parameter

Any non-admin user that is added to a tenant must be added to at least one team when being created by the admin. This team can be changed later on if needed. See the ["teams"](/introduction/concept-overviews#team) section for more details on teams and creating them. In case a user is not added to any team, the user can still login successfully but will not be able to see the console. The `SpectroTeam` attribute carries forward the available team/s for the user being authorized. This gives the admin the flexibility to add users into teams from both Spectro Cloud as well as Okta. The values of the `SpectroTeam` parameter is case sensitive, so the tenant admin should ensure that the team names are identical on both the consoles. A team created on the IdP which is not mentioned in Spectro Cloud will be ignored.

A sample use case is where a new member is to be added to the Spectro Cloud tenant by the tenant admin. The admin can have a default team that is common to all users. This can be applied to the Spectro Cloud SAML Panel as a one-time setting. When a new user is added, the IdP dashboard can be used to add this user to additional teams as required. Without this arrangement, the tenant admin would need to add the user and then perform the team assignment separately each time.
