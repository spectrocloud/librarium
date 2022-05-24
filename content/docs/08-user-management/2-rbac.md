---
title: "RBAC"
metaTitle: "RBAC in Spectro Cloud"
metaDescription: "Spectro Cloud's RBAC set up and the methods of restricting or allowing access"
icon: ""
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import Tooltip from "shared/components/ui/Tooltip";


# Role-Based Access Control (RBAC)

**RBAC** stands for Role-Based Access Control. This is a method that allows the same user to have a different type of access control, based on the resource being accessed. In other words, whereas a user logged in to a computer as a Tenant Admin can access all parts and data of the system, a guest user cannot. 

RBAC is an expansion as well as a modification of this scenario. RBAC allows the Tenant Admin to grant full and unrestricted access to some parts of the system and withhold it in some others. A few files can be made read-only for the guest. The alternative would be to make the guest either an admin or to make all types of access partially restricted. Both cases are undesirable, and that is where RBAC is helpful.

Palette's RBAC design allows granting granular access to resources and its operations. This is achieved using *Roles* and *Permissions*. Role-based access control primarily focuses on assigning permissions to roles instead of individual users. Multiple roles can be assigned to a user, which defines the permitted actions on the resource.


The Tenant Admin can access these settings in the Palette console under **Tenant Admin** > **Roles**. This page lists all the roles available along with the scope and status.


# Scope

A **Scope** defines the resources on which the role has coverage. The Scope will be either *Tenant* or *Project*. For example, a Role with the **Scope** *Project* can operate in only the projects. A combination of the user and the roles given to a user indicates the totality of the accesses made available to this user.

# Permissions

**Permissions** determine what operations are allowed on a resource. Permissions can be defined in the format: `component.operation` like `cluster.create`, `cluster.edit`, `cluster.activate`, etc.

# Roles

A **Role** is a collection of permissions.

The Role will have a *Type* and a *Scope*. The Type signifies the creator's scope and the Scope signifies the role visibility. Based on the role's scope, the permissions will be restricted to the permission's scope list. The *ProfileEditor* will be visible under **Tenant**, but neither the *Tenant* nor the *Project* admins are allowed to modify the Project Scopes.


# Creating roles

Clicking on a Role will show the permissions available under this Role. Default Roles (built-in into the Palette system) cannot be edited or deleted. A new Role can be created either under the Tenant Scope or the Project Scope, but not both. Note that Roles must have unique names. The names are case-insensitive (JOHN_DOE is the same as john_doe.) After entering the Role name, use the checkboxes to select the permissions. The checkbox list can be expanded to fine-tune the required permissions.
