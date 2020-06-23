---
title: "User management"
metaTitle: "User management"
metaDescription: "Learn about adding and managing access to users on Spectro Cloud using SAML based SSO. Also explains how users and tenant admins have been setup on Spectro Cloud"
icon: "roles"
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

# RBAC

Spectro Cloud allows the users that have been added to be allowed or restricted access to resources based on the roles set by the tenant admin. This Role-Based Access Control is explained in detail in the [RBAC](/user-management/rbac) page.

## Roles and permissions

The tenant admin can allow or restrict access of resources to users which can differ as per the scenario. A user can have complete access to a specific project but can be restricted access to other projects in which there is no involvement. An intermediate stage is also possible where read-only access can be provided in some projects. The [Roles and Permissions](/user-management/about-roles-and-permissions) page provides more details on this.
