---
sidebar_label: "User Roles"
title: "User Roles"
description:
  "Reference for the admin-plane roles available in Launchpad for AI, including access levels and constraints for each
  role."
hide_table_of_contents: false
sidebar_position: 25
tags: ["launchpad-for-ai", "reference", "rbac"]
keywords: ["launchpad", "ai", "roles", "rbac", "permissions", "operator", "auditor", "tenant-admin", "agent"]
---

Launchpad for AI uses role-based access control for the admin plane. Every user account is assigned exactly one role at
creation time. The role determines what the user can view and modify in the Console and on the admin API.

## Roles

### Operator

Full administrative access. An `operator` can read and modify any resource on the admin plane, including users, API
tokens, model configuration, tenants, quota policies, routing rules, and system metrics. Only an `operator` can create,
delete, or modify other users.

At least one `operator` must exist at all times. The appliance holds deletion fail-closed if it would remove the last
`operator` or the last admin account entirely.

### Auditor

Read-only access across the entire admin plane. An `auditor` can view users, metrics, request logs, configuration, and
governance policies but cannot make changes to any resource.

### Tenant-Admin

Governance access scoped to a single tenant. A `tenant-admin` can view and modify resources within their assigned
tenant, including quota policies and routing configuration, but cannot access global resources or other tenants.

A `tenant-admin` must be bound to a tenant at creation time. The binding cannot be changed after the account is created.

### Agent

Operator-equivalent access reserved for on-box automation and machine accounts. An `agent` has the same permissions as
an `operator` but is recorded separately in audit logs, making automated actions distinguishable from human operator
actions.

The Console create form does not include the `agent` role.

## Role Summary

| Role           | Read admin plane | Write admin plane | Scope         |
| -------------- | :--------------: | :---------------: | ------------- |
| `auditor`      |       Yes        |        No         | Global        |
| `tenant-admin` |   Tenant only    |    Tenant only    | Single tenant |
| `operator`     |       Yes        |        Yes        | Global        |
| `agent`        |       Yes        |        Yes        | Global        |
