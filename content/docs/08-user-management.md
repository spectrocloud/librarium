---
title: "User Management"
metaTitle: "User Management"
metaDescription: "Learn about adding and managing access to users on Spectro Cloud using SAML based SSO. Also explains how users and tenant admin have been setup on Spectro Cloud"
icon: "roles"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import Tooltip from "shared/components/ui/Tooltip";

# User Management

This section touches upon the initial login aspects for Tenant Admins and non-admin users and the RBAC setup within Palette.

## User Login

For a Tenant admin, the password shall be set upon the initial login. The Tenant admin can add non-admin users. For all users, login can be made available using the following options:

* Using Palette credentials on the login page.
  
* SSO using Identity Providers that use SAML 2.0:
  * Azure Active Directory
  * Okta
  * Keycloak
  * OneLogin
  * Microsoft ADFS
  * Others

## RBAC

Palette allows the users that have been added to be allowed or restricted access to resources based on the roles set by the tenant admin. This Role-Based Access Control is explained in detail in the <Tooltip trigger={<u>RBAC</u>}>Palette's <a href="/user-management#rbac">RBAC</a> design allows granting granular access to resources and its operations </Tooltip> [page](/user-management/palette-rbac#rbac).

# Roles and Permissions

The Tenant admin can allow or restrict access of resources to users which can differ as per the scenario. A user can have complete access to a specific project but can be restricted access to other projects in which there is no involvement. An intermediate stage is also possible where read-only access can be provided in some projects. The <Tooltip trigger={<u>Roles</u>}>A <a href="/user-management/rbac#roles">Role</a> is a collection of permissions.</Tooltip> and <Tooltip trigger={<u>Permissions</u>}><a href="/user-management/rbac#permission">Permissions</a> are associated with specific actions within the platform.</Tooltip> sections in the [RBAC](/user-management/palette-rbac#rbac) page provide more details on this.

To add a user to a project:
  1. Sign in as a Tenant admin and go to the **Users and Teams** section of the [Tenant Admin Dashboard](/getting-started#admindashboard). 
    
  1. Click on the user that you want to enable access to. 
    
  1. In the **Role** editor that opens to the side, find the **Project Roles** section and click **Add Role**. 
    
  1. Select the required **Project** from the dropdown menu and enable the **Roles** as needed.

# Multi-Organization Support for Users

Palette is incorporating multi-organization support for its users. With this feature, we provide our users with the flexibility of having a unique email address ID across multiple organizations. Hence, the users can maintain SSO credentials across multiple organizations/tenants.

The key benefits of this feature are:

* The use of a single email address ID across multiple organizations.
* Within an organization, maintain a unique email ID.
* In the case of password-based authentication, the same password is applicable across multiple organizations. The change of password, made under a particular organization, is applied across other organizations to maintain a single password across all organizations.
* The password policy stays independent of organizations/tenants. Each tenant retains individual password policy. 
* For SSO-based authentication, for each organization/tenant, the individual identity provider client application can be configured. Hence, allowing the configuration of a single SSO with multiple identity providers across multiple tenants/organizations mapping each client app to a tenant.
* However, for self-sign-up, the unique email address ID is enforced across tenants to avoid conflicts.
* In the Palette console, the users can switch between the organizations/tenants using the Organization drop down menu of the login page.
