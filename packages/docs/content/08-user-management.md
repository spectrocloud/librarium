---
title: "User management"
metaTitle: "User management"
metaDescription: "Learn about adding and managing access to users on Spectro Cloud using SAML based SSO. Also explains how users and tenant admins have been setup on Spectro Cloud"
icon: "audits"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# User management

This section touches upon the initial login aspects for tenant admins and non-admin users; and about RBAC setup within Spectro Cloud.

# User Login

For a tenant admin, the password shall be set upon the initial login. Non-admin users can be added by the tenant admin. For all users, login can be made available using the following options:-

* Using Spectro Cloud credentials on the login page.
* SSO using Identity Providers that use SAML 2.0:
  * Azure Active Directory.
  * Okta.
  * Keycloak.
  * OneLogin.
  * Microsoft ADFS.
  * Others.

To setup IdP based SSO, login to the Spectro Cloud console as the tenant admin. Access the tenant admin settings area by clicking the "Admin" button on the left panel.
Select the "Settings" from the "Admin menu" and then click "SAML" on the Spectro Cloud console to view the SAML panel. Toggle the `Enable SSO` button to bring up the configuration boxes.
Choose the IdP from the dropdown menu. Click the name of your preferred IdP below to see detailed instructions.
* [Okta](/user-management/okta).
* [Azure Active Directory](/user-management/azure-ad).
* [KeyCloak](/user-management/keycloak).
* [OneLogin](/user-management/ßonelogin).
* [MSFT ADFS](/user-management/msft-adfs).

# RBAC

Spectro Cloud allows the users that have been added to be allowed or restricted access to resources based on the roles set by the tenant admin. This Role-Based Access Control is explained in detail in the [RBAC](/user-management/rbac) page.

## Roles and permissions

The tenant admin can allow or restrict access of resources to users which can differ as per the scenario. A user can have complete access to a specific project but can be restricted access to other projects in which there is no involvement. An intermediate stage is also possible where read-only access can be provided in some projects. The [Roles and Permissions](/user-management/about-roles-and-permissions) page provides more details on this.
