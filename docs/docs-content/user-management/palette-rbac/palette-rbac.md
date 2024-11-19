---
sidebar_label: "Roles and Permissions"
title: "Roles"
description: "Palette User Access control using RBAC"
icon: ""
hide_table_of_contents: false
tags: ["user-management", "rbac"]
---

Palette provides you with the ability to create and manage roles to control access to resources. Roles are a collection
of [permissions](./permissions.md) that define the actions a user, or a team, can perform on a resource. By assigning
roles to users or teams, you can control the level of access they have to resources in Palette.

## Role-Based Access Control

Role-Based Access Control (RBAC) allows a user or team to have different types of access control based on the resource
being accessed. Palette supports an RBAC approach for granting users granular access to resources and their operations
within the Palette platform.

RBAC focuses on assigning permissions to roles rather than individual users or teams. Users and teams are then assigned
these roles, which specify their access to various resources. A user or team can be assigned multiple roles, each
defining their permitted actions on those resources.

:::info

Palette RBAC is separate from Kubernetes RBAC and is used to manage access to the Palette platform and its resources.
The access control inside a Kubernetes cluster is managed by Kubernetes RBAC and requires the usage of
[Kubernetes roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole) and
[role bindings](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings). For
fine-grained access control to Kubernetes resources, use the
[Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) system. You can use OpenID Connect
(OIDC) to integrate Kubernetes RBAC with Palette RBAC. Refer to the [OIDC](../saml-sso/saml-sso.md) page for more
information.

:::

## RBAC Model

The Palette RBAC Model is based on the following three components:

- Scope
- Permissions
- Roles

### Scope

Scope defines the context in which the resources are located in and the visiblity. The scope will be either Tenant or
Project. For example, a role within the project scope can conduct actions within a project. Whereas, a role within the
tenant scope can conduct actions across all projects within the tenant.

:::info

Self-hosted Palette and VerteX instances have an additional scope called the System Scope. The system scope applies to
the entire system. System-scope actions are only allowed for the system administrator. Only users with the system
administrator role can perform actions in the system scope. System administrator access is only available to self-hosted
instances.

:::

Scopes are organized hierarchically, with each level becoming more specific. Roles can be assigned at different scope
levels, and the level you choose determines the role's range of influence. Use the scope to control the visibility of
resources and to reduce the number resources a Role has access to.

![palette-rbac-scope.webp](/user-management_palette-rbac_palette-rbac_scope-overview.webp)

Some key points to remember about scopes:

- Scopes control the visibility of the resource. The resource created in the higher scope will be visible and accessible
  for use in the lower scope. For example, a cluster profile created in the tenant scope will be visible, and accessible
  in the project scope.

- Resource isolation is achieved by creating resources in the lower scope.

- Resources with the same name may co-exist across scopes and will be distinguished with scope icon in the context
  column.

- In Terraform, when using the Spectro Cloud provider, the term context is used instead of scope. Refer to the
  [Spectro Cloud provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) for more
  information.

### Visiblity

As a user, you can only view the resources that are in the same scope as your role, or what is allowed by the highest
scope role you have. For example, if you have a role in the project scope, you can only view resources in the defined
project or projects allowed by the role. If you have a role in the tenant scope, you can view resources in the tenant
scope and all projects within the tenant.

When you log in to Palette, depending on the roles you have, you can change the scope from the
[Project Dashboard](../../introduction/dashboard.md) page. Use the **drop-down Menu** at the top to change the project
or switch to the tenant scope.

### Resource

Different resources in Palette exist at different scopes. Some resources are global and can be accessed across all
scopes, while others are specific to a particular scope. For example, Users and Teams are managed at the Tenant scope,
and are only accessible to Tenant administrators, or Tenant roles with user modification permissions. Cloud accounts on
the other hand, can be defined at the Tenant scope and at the Project scope. However, if a cloud account is defined at
the Tenant scope, it is accessible to all projects within the tenant. If a cloud account is defined at the Project
scope, it is only accessible to that project.

![A diagram of Palette's RBAC model](/user-management_palette-rback_palette-rbac-model.webp)

## Permissions

Permissions determine the type of operations allowed on a resource. Permissions can be defined in the following format,
`resourceKey.operation`. The resource key is the resource type, and the operation is the action that can be performed on
the resource. For example, `cluster.create` allows the role to create a cluster. Permissions are assigned to roles.

Review the [Permissions](permissions.md) page for a detailed list of all the permissions available in Palette.

## Roles

A Role is a collection of permissions. When a role is assigned to a user or team, it means all the permissions the role
contains are applied to the user or users in the team. The role's scope is determined by the type of role. Palette
supports three types of roles. Refer to the table below for more information about the role types.

| Role Type | Scope   | Description                                                                                                                                                                   |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant    | Tenant  | Tenant roles are assigned at the Tenant scope. These roles are used to manage resources at the Tenant scope and have access to all projects within the tenant.                |
| Project   | Project | Project roles are assigned at the Project scope. These roles are used to limit a role's access to a specific project or set of projects.                                      |
| Resource  | Project | Resource roles are unique roles that can be assigned at the project scope. They are more granular in nature and can be used to achieve Attribute-Based Access Control (ABAC). |

For each role type, Palette provides a set of predefined roles out-of-the-box that you may use. Check out the following
pages for more information:

- [Default Tenant Roles](./tenant-scope-roles-permissions.md)

- [Default Project Roles](./project-scope-roles-permissions.md)

- [Default Resource Roles](./resource-scope-roles-permissions.md)

You can also create your own custom role of any type. To create a custom role, refer to the
[Creating a Custom Role](./create-custom-role.md) page for detailed instructions.

### Attribute-Based Access Control

Attribute-Based Access Control (ABAC) is a model that uses attributes to determine access control. In Palette, ABAC is
supported for a limited set of resources using [Resource roles](./resource-scope-roles-permissions.md). Resource roles
are unique roles that can be assigned at the project scope. Each Resource role must be paired with a
[Resource Filter](../../tenant-settings/filters.md), which is a set of attributes that define the resources the role can
access. When a user is assigned a Resource role, they can only access resources that match the Resource Filter.

To illustrate ABAC with Resource roles, consider a scenario where you have a Resource role called **security-enforcer**
that has the permissions `clusterProfile.update`. This Resource role is paired with a Resource Filter that specifies the
attribute, Tag, with a value `prodAllowed`. When a user is assigned the **security-enforcer** role, they can only update
cluster profiles that have the attribute `prodAllowed`.

:::info

In the example provided, assume the user with the Resource role assigned has other permissions required to view
projects, and to list cluster profiles. For brevity, these permissions are not listed.

:::

In the diagram below, the Resource role, **security-enforcer**, is allowed to update the cluster profile in Project A,
with the tag `prodAllowed`. If the user attemps to update the cluster profile in Project B, that lacks the tag,
`productionAllowed`, the operation is denied. If the cluster profile in Project B had the tag, `prodAllowed`, the user
would have been able to update the cluster profile.

![ABAC with Resource roles](/user-management_palette-rback_abac_example.webp)

If you are interested in using ABAC with Palette, check out the [Permissions](./permissions.md) page and review all the
available Palette components that are eligible for use with a Resource role. You can get started with the
[default Resource Roles](./resource-scope-roles-permissions.md) available in Palette, or create your own
[custom Resource role](./create-custom-role.md#create-a-custom-resource-role).

## Resources

- [Creating a Custom Role](./create-custom-role.md)

- [Create and Manage a Role Assignment](./assign-a-role.md)

- [Permissions](permissions.md)

- [Default Tenant Roles](./tenant-scope-roles-permissions.md)

- [Default Project Roles](./project-scope-roles-permissions.md)

- [Default Resource Roles](./resource-scope-roles-permissions.md)
