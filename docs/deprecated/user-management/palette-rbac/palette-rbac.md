---
sidebar_label: "Roles"
title: "Roles"
description: "Palette User Access control using RBAC"
icon: ""
hide_table_of_contents: false
tags: ["user-management", "rbac"]
---

RBAC stands for Role-Based Access Control. RBAC allows a single user to have different types of access control based on
the resource being accessed. RBAC is the scenario that allows the Tenant Admin to grant full and unrestricted access to
some parts of the system and withhold it for some others.

Palette enforces a very well-structured RBAC design on how to grant granular access to resources and their operations
within our management console. We maintain precise Roles and Resource Access Control List. Role-based access control
primarily focuses on assigning permissions to roles instead of individual users and then assigning these roles to users.
Multiple roles can be assigned to a user, which defines the permitted actions on the resource. This module lists and
enumerates all the roles available within the Palette console within specific scopes.

Palette enables:

- A role can have multiple permissions. We encourage custom role creation, coupling the wide range of Palette
  permissions.

- Multiple roles can be assigned to a single user, defining the permitted actions on a Palette resource.

## Palette RBAC Model

The Palette RBAC Model, is based on the following three components:

- Scopes
- Permissions
- Roles

### Scopes

A Scope defines the resources on which the role has coverage. The scope will be either `Tenant` or `Project`. For
example, a role within the scope project can operate within the projects. The combination of user and roles indicates
the totality of the accessibility available to that user. Scopes are structured in a parent-child relationship. Each
level of hierarchy makes the Scope more specific. The roles are assigned at any of these levels of Scope. The level you
select determines how widely the role is applied. Lower levels inherit role permissions from higher levels.
![palette-rbac-scope.webp](/palette-rbac-scope.webp)

The following are the major properties of Palette driven Scopes:

- Scopes control the visibility of the resource.

- Resource created in the higher scope will be visible in the lower scope as read-only. The cluster profiles created by
  a tenant will be available to all the projects created by that tenant.

- Resource Isolation: Resources within the same scope will be restricted to the respective scope entity.

  - Cluster Profile created in project-1 will not be available in project-2 of the same tenant

- Resource with the same name can co-exist across scopes and will be distinguished with scope prefix (icon)
  - A profile with the same name can be created in tenant and project scope. The resource will have the scope
    information, which helps to distinguish them.

Palette resources can be allocated to roles under **Three Scopes**:

- **System** (The system admin internal to Palette)

- **Tenant**

- **Project**

![A diagram of Palette's RBAC model](/user-management_palette-rback_palette-rbac-model.webp)

### Permissions

Permissions determine the type of operations allowed on a resource. Permissions can be defined in the following format:

`resourceKey.operation`

Examples:

- `cluster.create`
- `cluster.edit`
- `cluster.delete`

Each permission has a defined scope. The role creation is based on scope, type and permissions.

#### Palette Permissions

Palette has a wide range of permissions and these permissions can be combined in any combination as per the user
requirements to create a role. If the Palette built-in roles does not meet the specific needs of your organization,
custom roles can be created using different combination of these permissions. Just like built-in roles, you can assign
custom roles to users or teams within a specific scope (Tenant or Project). Refer to the available set of permissions in
the [Permissions](permissions.md) page.

### Roles

A Role is a collection of permissions. When a role is assigned to a user, it means all the permissions the role contains
are assigned to that user. The Role will have a **Scope**. The Type signifies the creator's scope and the Scope
signifies the role visibility. The permissions will be restricted to the permission's scope list based on the role's
scope. The ProfileEditor will be visible under Tenant, but neither the Tenant nor the Project admins are allowed to
modify the Project Scopes.

## Access Modes

- Tenant
- Project

### Tenant

Tenant is an isolated workspace within the Palette. `Users` and `Teams` with specific `Roles` can be associated with the
Tenant(s) you create. Palette provides a [wide set of permissions](tenant-scope-roles-permissions.md) under the scope of
a Tenant. Everyone is a user and there should be at least one user with Tenant Admin privilege to control the product
operations.

### Project

The Global Project Scope holds a group of resources, in a logical grouping, to a specific project. The project acts as a
namespace for resource management. Users and Teams with specific roles can be associated with the project, cluster, or
cluster profile you create. Users are members of a tenant who are assigned
[project scope roles](./project-scope-roles-permissions.md) that control their access within the platform.

## Default Palette Roles

Palette RBAC has several built-in roles that can be assigned to users and teams. Role assignments are the way you
control access to Palette resources.

### Tenant Scope Default Roles

Global Tenant roles are scoped at the tenant level. Palette has several built-in tenant roles that can be assigned to
users and teams. Refer to [Tenant Scope Roles](./tenant-scope-roles-permissions.md) for a detailed list of all the roles
available in Palette.

### Project Scope Default Roles

The Project scope roles can be assigned to users and teams at the project scope. Palette has several built-in project
scoped roles that can be assigned to users and teams. Refer to
[Project Scope Roles](./project-scope-roles-permissions.md) for a detailed list of all the roles available Pallete.

## Assign Palette Specific Roles to Users

The Default (built-in) roles of Palette can be directly assigned to a user. The roles needs to be assigned based on who
needs the access. The roles can be assigned to Users or Teams. The appropriate role needs to be selected from the list
of several built-in roles. If the built-in roles are not meeting the specific needs of your organization, you can
[create your own custom roles](./create-custom-role.md).

1. Login to Palette console as `Tenant Admin`.

2. Select **Users and Teams** from the left **Main Menu** to list the created users.

3. From the list of users **select the user** to be assigned with role to open the role addition wizard.

4. Make the choice of role category from the top tabs:

   - Project Role
   - Tenant Role
   - Workspace Role

5. Once the choice of category is made Click on **+ New Role**.

6. In the **Add Roles to User-name** wizard, select the project name from the drop down and select the roles from the
   list.

7. Confirm to complete the wizard.

8. The role user association can be edited and deleted from the **left Main Menu**.

### Assign Custom Roles to Users

1. Login to Palette console as `Tenant Admin`.

2. Select **Users and Teams** from the left ribbon menu to list the [created users](../user-management.md).

3. From the list of users **select the user** to be assigned with role to open the role addition wizard.

4. Make the choice of role category from the top tabs:

   - Project Role
   - Tenant Role
   - Workspace Role

5. Once the choice of category is to br made by clicking on **+ New Role**.

6. In the **Add Roles to User-name** wizard, select the project name from the drop down and select the roles from the
   list.

7. Confirm to complete the wizard.

8. The role user association can be edited and deleted from the `kebab menu`.

## Example Scenario:

Palette has a number of permissions that you can potentially include in your custom role. Here is an example scenario
enumerating the minimum permissions required for a user to **Create a Cluster** in Palette platform.

#### 1. Decide the actions, scopes and permissions required by the user to Create a Cluster.

The role creation is done from the `Tenant Admin` console. For the above scenario, two roles needs to be created under
`Project` and `Tenant` scope and attached to the user.

#### 2. Identify the Permissions required under `Project Scope`:

- Add the minimum `Project` management permissions

  - project.list
  - project.get

- Add the minimum permissions required for `Cloud Account` creation

  - cloudaccount.create
  - cloudaccount.get
  - cloudaccount.list

- Add the `ClusterProfile` permissions

  - clusterProfile.create
  - clusterProfile.delete
  - clusterProfile.get
  - clusterProfile.list
  - clusterProfile.publish
  - clusterProfile.update

- Add the `Cluster` permissions (for creating and listing the cluster)

  - cluster.create
  - cluster.list
  - cluster.get

- Add the `Location` permission.

  - location.list

- Add the `Cloud Configuration` permissions for node pool management
  - cloudconfig.create

#### 3. Identify the Permissions required under `Tenant Scope`:

To attach the Packs and Integrations from Palette public repository, add the `Registry Permissions`. The minimum
permission required in this scenario is:

- packRegistry.get

#### 4. Attach Roles to the User and Create the Cluster

- Once both the roles are created with the above scopes, attach them to the user.

- Login to Palette console using the user credentials to create the cluster profile and the cluster.
