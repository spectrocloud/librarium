---
sidebar_label: "Access Management"
title: "Access Management"
description: "Learn how to manage users, groups, roles, and API keys in PaletteAI VM Launchpad."
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad", "access management", "virtual machines", "VMs"]
---

PaletteAI VM Launchpad integrates with Keycloak for user identity and manages VMO IAM roles and their underlying
Kubernetes ClusterRoleBindings and RoleBindings on your behalf. Use the **Access Management** section under **Settings**
to create users, group them, and assign VMO roles and namespace scopes.

## How Access Works

Access in VM Launchpad is composed of two planes that the platform keeps in sync:

- **VMO IAM** controls what a user can view and do in the platform UI. It uses four built-in roles: **Platform Admin**,
  **Editor**, **Operator**, and **Viewer**. Refer to [VMO Roles](./vmo-roles.md) for the permission set of each role.

- **Kubernetes RBAC** controls direct `kubectl` and KubeVirt API access. VM Launchpad pairs each VMO role with a fixed
  Kubernetes ClusterRole that grants the matching Kubernetes access.

When you grant access on the [Users](./users.md) or [Groups](./groups.md) pages, VM Launchpad creates both the VMO IAM
mapping and the matching Kubernetes ClusterRoleBinding or RoleBinding in a single action, scoped to the namespaces you
select. To view the resolved bindings for every user and group, use [Access Mapping](./access-mapping.md).

Group membership takes precedence over a role assigned to a user directly. When a user belongs to any group that carries
a VMO role, the group mappings determine their effective permissions. Refer to
[How Effective Permissions Are Calculated](./users.md#how-effective-permissions-are-calculated) for details.

## Access Management Workflows

| **Workflow**                            | **Description**                                                                                                |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [Users](./users.md)                     | View, create, edit, reset passwords, and delete users.                                                         |
| [Groups](./groups.md)                   | Group users together and manage their VMO role and Kubernetes access in one place.                             |
| [VMO Roles](./vmo-roles.md)             | Review the four built-in VMO IAM roles, the `vmo:<domain>:<action>` permission format, and permission domains. |
| [Access Mapping](./access-mapping.md)   | View the resolved Kubernetes bindings and VMO IAM mappings across every user and group.                        |
| [API Keys](./api-keys.md)               | Create, use, and revoke self-service API keys for programmatic access.                                         |
| [LDAP Federation](./ldap-federation.md) | Federate users from an LDAP directory and satisfy the OIDC email claim requirement.                            |
| [OIDC Federation](./oidc-federation.md) | Federate an external OIDC identity provider, such as Okta, and map its groups to VMO roles.                    |
