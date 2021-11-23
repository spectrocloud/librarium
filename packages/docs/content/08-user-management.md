---
title: "User management"
metaTitle: "User management"
metaDescription: "Learn about adding and managing access to users on Spectro Cloud using SAML based SSO. Also explains how users and tenant admins have been setup on Spectro Cloud"
icon: "roles"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# User management

This section touches upon the initial login aspects for tenant admins and non-admin users, and about RBAC setup within Spectro Cloud.

# User Login

For a tenant admin, the password shall be set upon the initial login. The tenant admin can add Non-admin users. For all users, login can be made available using the following options:

* Using Spectro Cloud credentials on the login page.
  
* SSO using Identity Providers that use SAML 2.0:
  * Azure Active Directory
  * Okta
  * Keycloak
  * OneLogin
  * Microsoft ADFS
  * Others

# RBAC

Spectro Cloud allows the users that have been added to be allowed or restricted access to resources based on the roles set by the tenant admin. This Role-Based Access Control is explained in detail in the <Tooltip trigger={<u>RBAC</u>}>Spectro Cloud's <a href="/user-management#rbac">RBAC</a> design allows granting granular access to resources and its operations.</Tooltip> page.

## Roles and permissions

The tenant admin can allow or restrict access of resources to users which can differ as per the scenario. A user can have complete access to a specific project but can be restricted access to other projects in which there is no involvement. An intermediate stage is also possible where read-only access can be provided in some projects. The <Tooltip trigger={<u>Roles</u>}>A <a href="/user-management/rbac#roles">Role</a> is a collection of permissions.</Tooltip> and <Tooltip trigger={<u>Permissions</u>}><a href="/introduction/concept-overviews#permission">Permissions</a> are associated with specific actions within the platform.</Tooltip> sections in the RBAC page provide more details on this.

To add a user to a project, sign in as an admin and go to the `Users and Teams` section of the [Admin Dashboard](/getting-started#admindashboard). Click on the user that you want to enable access to. In the role editor that opens to the side, click `Add Role` in the "PROJECT ROLES" section. Select the required project from the drop-down menu and enable the roles as needed.

# Multi-Organization Support for Users

Palette is incorporating multi-organization support for its users. With this feature, we provide our users w$

The key benefits of this feature are:

* The use of a Single email-Id across multiple organizations.
* Within an organization, maintain a unique email Id.
* In the case of password-based authentication, the same password is applicable across multiple organizations. The change of password made under a particular organization is applied across other organisations to maintain a single password across all organizations.
* The password policy stays independent of organisations/tenants. Each tenant retains individual password policy. 
* For SSO-based authentication, for each organization/tenant, the individual identity provider client application can be configured. Hence, allowing the configuration of a single SSO with multiple identity providers across multiple tenants/organizations mapping each client app to a tenant.
* However, for self-sign-up, the unique email-id is enforced across tenants to avoid conflicts.
* In Palette console the users can switch between the organizations/tenants using the "Organization" drop down menu of the login page.
