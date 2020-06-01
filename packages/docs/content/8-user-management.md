---
title: "User management"
metaTitle: "About adding and managing access to users on Spectro Cloud"
metaDescription: "Learn about how RBAC, SAML based SSO, users and tenant admins have been setup on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

# User Management

Apart from the *Email ID + Password* combination, Spectro Cloud uses SAML based SSO authentication and authorisation to enable user login and management. This is separate from the Role-based Access Control (RBAC) used for the team members within Projects and will be explained in the relevant section.

The tenant admin's login credentials are created with a temporary password by Spectro Cloud for the initial login. Once the tenant admin has changed the password, they can add other users.

These users can be provided with the following options to log on:-

* Email ID and Password Combination on the Spectro Cloud login page.
* SSO using Identity Providers that use SAML 2.0:
  * Azure Active Directory
  * Okta
  * Keycloak
  * OneLogin
  * Microsoft ADFS
  * Others

To setup IdP based SSO, login to the Spectro Cloud console as the tenant admin. Access the admin settings area by clicking the "Admin" button on the left panel.
Select the "Settings" from the "Admin menu" and then click "SAML" on the dashboard to view the SAML panel. Toggle the `Enable SSO` button to bring up the configuration boxes.
Choose the IdP from the dropdown menu. Click the name of your preferred IdP below to see detailed instructions.
* [Okta](/8-user-management/1-okta)
* [Azure Active Directory](/8-user-management/2-azure-ad)
* [KeyCloak](/8-user-management/3-keycloak)
* [OneLogin](/8-user-management/4-onelogin)
* [MSFT ADFS](/8-user-management/5-msft-adfs)
