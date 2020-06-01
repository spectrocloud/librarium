---
title: "Azure AD SSO Setup"
metaTitle: "Setting up SAML 2.0 based SSO for Spectro Cloud using Azure AD as the IdP"
metaDescription: "Detailed instructions on creating SSO to log in to Spectro Cloud using SAML 2.0 with Azure Active Directory as the Identity Provider"
icon: ""
hideToC: true
fullWidth: false
---

# SAML 2.0 based SSO with Azure AD

Detailed instructions can be found at the bottom.

## TL; DR version

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

## About the `SpectroTeam` attribute

Any non-admin user that is added to a tenant must be added into at least one team when being created by the admin. This team can be changed later on if needed. See the teams section for more details on teams and creating them. In case a user is not added to any team, the user can still login successfully but will not be able to see the dashboard. The `SpectroTeam` attribute carries forward the available team/s for the user being authorized. This gives the admin the flexibility to add users into teams from both Spectro Cloud as well as from Azure Active Directory. The values of the `SpectroTeam` parameter is case sensitive, so the tenant admin should ensure that the team names are identical on both the dashboards. A team created on Azure AD which is not mentioned in the Spectro Cloud will be ignored.

A sample use case is where a new member is to be added to the Spectro Cloud tenant by the tenant admin. The admin can have a default team which is common to all users. This can be applied to the Spectro Cloud SAML Panel as a one-time setting. When a new user is added, the Azure AD dashboard can be used to add this user to additional teams as required. Without this arrangement, the tenant admin would need to add the user and then perform the team assignment separately each time.