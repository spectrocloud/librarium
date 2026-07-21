---
sidebar_label: "Access Management"
title: "Access Management"
description: "Learn how to manage users, groups, roles, and API keys in Launchpad for VMs."
hide_table_of_contents: false
sidebar_position: 3
tags: ["vmo", "vm launchpad appliance", "access management", "virtual machines", "VMs"]
---

Launchpad for VMs integrates with Keycloak for user identity and manages VMO IAM roles and their underlying Kubernetes
ClusterRoleBindings and RoleBindings on your behalf. Use the **Access Management** section under **Settings** to
create users, group them, and assign VMO roles and namespace scopes.

## How Access Works

Access in Launchpad for VMs is composed of two planes that Launchpad keeps in sync:

- **VMO IAM** controls what a user can view and do in the platform UI. It uses four built-in roles: **Platform
  Admin**, **Editor**, **Operator**, and **Viewer**. Refer to [VMO Roles](./vmo-roles.md) for the permission set of
  each role.

- **Kubernetes RBAC** controls direct `kubectl` and KubeVirt API access. Launchpad pairs each VMO role with a fixed
  Kubernetes ClusterRole that grants the matching Kubernetes access.

When you grant access on the [Users](./users.md) or [Groups](./groups.md) pages, Launchpad creates both the VMO IAM
mapping and the matching Kubernetes ClusterRoleBinding or RoleBinding in a single action, scoped to the namespaces
you select. To view the resolved bindings for every user and group, use [Access Mapping](./access-mapping.md).

A user's effective permissions are the union of every role and namespace scope granted to them, whether the grant
comes from the user directly or from any group they belong to. Refer to
[How Effective Permissions Are Calculated](./users.md#how-effective-permissions-are-calculated) for details.

## Access Management Workflows

| **Workflow**                          | **Description**                                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [Users](./users.md)                   | View, create, edit, reset passwords, and delete users.                                                           |
| [Groups](./groups.md)                 | Group users together and manage their VMO role and Kubernetes access in one place.                               |
| [VMO Roles](./vmo-roles.md)           | Review the four built-in VMO IAM roles, the `vmo:<domain>:<action>` permission format, and permission domains.   |
| [Access Mapping](./access-mapping.md) | View the resolved Kubernetes bindings and VMO IAM mappings across every user and group.                          |
| [API Keys](./api-keys.md)             | Create, use, and revoke self-service API keys for programmatic access.                                           |
