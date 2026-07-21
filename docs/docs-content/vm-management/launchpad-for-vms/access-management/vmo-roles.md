---
sidebar_label: "VMO Roles"
title: "VMO Roles"
description: "Learn about the built-in VMO IAM roles in Launchpad for VMs."
icon: " "
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad", "access management", "iam"]
---

Launchpad for VMs ships with four built-in VMO IAM roles: **Platform Admin**, **Editor**, **Operator**, and
**Viewer**. Each role is a named bundle of permissions that controls what a user can view and do in the platform UI.
Roles are read-only in this release. Use them to assign VMO access to users on the [Users](./users.md) page or to
groups on the [Groups](./groups.md) page.

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](../install-vmla-iso.md) for
  guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## VMO Roles Page

From the left main menu, select **Settings** > **Access Management** > **VMO Roles** to view all built-in roles in
the appliance.

The **VMO Roles** table lists the following columns.

| **Column**      | **Description**                                                                       |
| --------------- | ------------------------------------------------------------------------------------- |
| **Name**        | The role name.                                                                        |
| **Description** | A short summary of the role's intent.                                                 |
| _(unlabeled)_   | Displays **Default** for built-in roles that ship with Launchpad for VMs.             |

Select a column header to sort. Use the **Filter rows** search box to filter by any field.

## Built-in Roles

The following table describes each built-in role and the intended audience.

| **Role**           | **Intent**              | **Summary of permissions**                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Platform Admin** | Full control            | All permissions across all namespaces.                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Editor**         | VM workflow builder     | Full VM lifecycle (create, read, update, delete, operate, and snapshot), Image Catalog (read and write, including golden image upload, delete, and build), templates (read and write), dashboards (read), audit, system and monitoring (read), CRD catalog (read), and Infrastructure (read only, required for the VM creation wizard's NAD, StorageClass, and namespace pickers). No Settings access. No Infrastructure write. No platform-content curation. |
| **Operator**       | Day-to-day VM operator  | VMs (read, operate, and snapshot), templates (read), dashboards (read), audit, and system and monitoring (read). No Image Catalog. No Infrastructure (network, storage, or namespace). No Settings access.                                                                                                                                                                                                                                          |
| **Viewer**         | Read-only consumer      | VMs (read only), templates (read), dashboards (read), audit, and system and monitoring (read). No Image Catalog. No Infrastructure. No Settings. No operate or snapshot actions. No writes anywhere.                                                                                                                                                                                                                                                |

Each VMO role also binds a fixed Kubernetes ClusterRole that grants the underlying access to the KubeVirt API.
Launchpad selects the matching ClusterRole automatically when you assign a role to a user or group.

| **VMO Role**   | **Kubernetes ClusterRole** |
| -------------- | -------------------------- |
| Platform Admin | `spectro-vm-admin`         |
| Editor         | `spectro-vm-power-user`    |
| Operator       | `spectro-vm-user`          |
| Viewer         | `spectro-vm-viewer`        |

## Permission Format

Every VMO permission follows the format `vmo:<domain>:<action>`.

| **Part**   | **Description**                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `vmo`      | Static prefix identifying the permission as a VMO IAM permission.                                                         |
| `domain`   | The functional area the permission controls, such as `config`, `storage`, or `network`.                                   |
| `action`   | The operation the permission grants. Most domains use `read` and `write`; some define other domain-specific actions.      |

For example, `vmo:packages:write` grants write access to the package repository, and `vmo:audit:read` grants read
access to the audit log.

### VM Domain Actions

The `vm` domain uses granular CRUD (`create`, `read`, `update`, `delete`) plus two action groups.

| **Action**  | **Description**                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `operate`   | Start, stop, restart, migrate, and open the console of a VM.                                                |
| `snapshot`  | Create, restore, and manage VM snapshots.                                                                   |

### Permission Domains

The following table lists every VMO permission domain.

| **Domain**       | **Description**                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`         | Platform configuration, including environment variables.                                                                                              |
| `config-bundle`  | Export and import configuration bundles.                                                                                                              |
| `branding`       | Branding assets (logo, colors).                                                                                                                       |
| `certificates`   | TLS certificates.                                                                                                                                     |
| `packages`       | Package repository. Golden image DataVolume operations (upload, delete, build) also use this domain.                                                  |
| `templates`      | VM templates.                                                                                                                                         |
| `dashboards`     | Dashboards and metrics.                                                                                                                               |
| `local-users`    | Local authentication accounts.                                                                                                                        |
| `api-keys`       | API key creation and revocation. Refer to [API Keys](./api-keys.md).                                                                                  |
| `iam`            | IAM roles, group mappings, and access policies.                                                                                                       |
| `audit`          | Audit log.                                                                                                                                            |
| `system`         | System health and platform information.                                                                                                               |
| `crd-catalog`    | CRD catalog.                                                                                                                                          |
| `monitoring`     | Monitoring configuration.                                                                                                                             |
| `storage`        | StorageClasses, StoragePools, HA settings, and system storage resize.                                                                                 |
| `network`        | Network Attachment Definition (NAD) resources and network capabilities.                                                                               |
| `namespace`      | Namespaces and namespace policies.                                                                                                                    |
| `roles`          | Built-in VMO role definitions (read-only in the UI).                                                                                                  |
| `features`       | Feature flags.                                                                                                                                        |
| `kubevirt`       | Cluster-level KubeVirt configuration.                                                                                                                 |
| `admission`      | Admission control policies.                                                                                                                           |

## Role Reconciliation

On every Launchpad for VMs restart, the platform reconciles the four built-in roles against the canonical permission
set:

- **Adds missing permissions.** If an upgrade adds a permission to a built-in role, the reconciler adds it to
  existing installations.

- **Removes stale permissions.** If a built-in role has a permission that is no longer in the canonical set
  (for example, after a scope tightening), the reconciler removes it.

The reconciler runs only against the four built-in roles (Platform Admin, Editor, Operator, Viewer). You do not
need to take any action to keep them current across upgrades.

## Next Steps

- Assign a VMO role to a user. Refer to [Users](./users.md).

- Assign a VMO role to a group. Refer to [Groups](./groups.md).

- View existing role mappings and Kubernetes bindings. Refer to [Access Mapping](./access-mapping.md).
