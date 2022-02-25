---
title: "RBAC"
metaTitle: "RBAC in Spectro Cloud"
metaDescription: "Spectro Cloud's RBAC set up and the methods of restricting or allowing access"
icon: ""
hideToC: false
fullWidth: false
---

# RBAC

RBAC stands for Role-Based Access Control. This is a method that allows the same user to have a different type of access control based on the resource being accessed. In other words, whereas a user logged in to a computer as an admin can access all parts and data of the system, a guest user cannot. RBAC is an expansion as well as a modification of this scenario. RBAC allows the admin to grant full and unrestricted access to some parts of the system and withhold it in some others. A few files can be made read-only for the guest. The alternative would be to make the guest either an admin or to make all types of access partially restricted. Both cases are undesirable and that is where RBAC is helpful.

Spectro Cloud's RBAC design allows granting granular access to resources and its operations. This is achieved using Roles and Permissions. Role-based access control primarily focuses on assigning permission to roles instead of individual users. Multiple roles can be assigned to a user, which defines the permitted actions on the resource.

The tenant admin can access these settings in the Spectro Cloud console: **Admin** -> **Roles**. This page lists all the roles available along with the scope and status.
## Scope

A scope defines the resources on which the role has coverage. The scope will be either tenant or project. For example, a role with the scope "project" can operate on only the projects. A combination of the user and the roles given to a user indicates the totality of the accesses made available to this user.

# Permissions

* **Permissions** determine what operations are allowed on a resource.

Permissions can be defined in the format `component.operation` like `cluster.create`, `cluster.edit`, `cluster.activate`, etc.

# Roles

* A **Role** is a collection of permissions.

The role will have a *type* and a *scope*. The type signifies the creator's scope and the scope signifies the role visibility. Based on the role's scope, the permissions will be restricted to the permission's scope list. The *ProfileEditor* will be visible under tenant and the tenant or the project admin cannot modify the project scopes.

# Creating roles

Clicking on a role will show the permissions available under this role. Default roles (built-in into the Spectro Cloud system) cannot be edited or deleted. A new role can be created either under the tenant scope or the project scope but not both. Note that roles must have unique names. The names are case insensitive (JOHN_DOE is the same as john_doe.) After entering the role name, use the checkboxes to select the permissions. The checkbox list can be expanded to fine-tune the required permissions.
