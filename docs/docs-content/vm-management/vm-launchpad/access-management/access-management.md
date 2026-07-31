---
sidebar_label: "Access Management"
title: "Access Management"
description: "Learn how to manage users and groups in PaletteAI VM Launchpad."
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad", "access management", "virtual machines", "VMs"]
---

PaletteAI VM Launchpad integrates with Keycloak for user identity and manages VMO IAM roles and their underlying
Kubernetes ClusterRoleBindings and RoleBindings on your behalf. Use the **Access Management** section under **Settings**
to create users, group them, and assign VMO roles and namespace scopes.

## Access Management Workflows

| **Workflow**          | **Description**                                                                    |
| --------------------- | ---------------------------------------------------------------------------------- |
| [Users](./users.md)   | View, create, edit, reset passwords, and delete users.                             |
| [Groups](./groups.md) | Group users together and manage their VMO role and Kubernetes access in one place. |
