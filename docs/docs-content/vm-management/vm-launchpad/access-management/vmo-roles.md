---
sidebar_label: "VMO Roles"
title: "VMO Roles"
description: "Learn about the built-in VMO IAM roles in PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad", "access management", "iam"]
---

PaletteAI VM Launchpad ships with four built-in VMO IAM roles: **Platform Admin**, **Editor**, **Operator**, and
**Viewer**. Each role is a named bundle of permissions that controls what a user can view and do in the platform UI.
Roles are read-only in this release. Use them to assign VMO access to users on the [Users](./users.md) page or to groups
on the [Groups](./groups.md) page.

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## VMO Roles Page

From the left main menu, select **Settings** > **Access Management** > **VMO Roles** to view all built-in roles in the
appliance.

The **VMO Roles** table lists the following columns.

| **Column**      | **Description**                                                      |
| --------------- | -------------------------------------------------------------------- |
| **Name**        | The role name.                                                       |
| **Description** | A short summary of the role's intent.                                |
| _(unlabeled)_   | Displays **Default** for built-in roles that ship with VM Launchpad. |

Select a column header to sort. Use the **Filter rows** search box to filter by any field.

## Built-in Roles

The following table lists each built-in role, the description shown on the **VMO Roles** page, and a summary of the
role's permissions.

| **Role**           | **Description**                                                       | **Summary of permissions**                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Platform Admin** | Full platform control. All VMO permissions.                           | All permissions across all namespaces.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Editor**         | VM workflow and operational tooling. Templates, dashboards, packages. | Full VM lifecycle (create, read, update, delete, operate, and snapshot), Image Catalog (read and write, including golden image upload, delete, and build), templates (read and write), dashboards (read), audit, system and monitoring (read), CRD catalog (read), and Infrastructure (read only, required for the VM creation wizard's NAD, StorageClass, and namespace pickers). No Settings access. No Infrastructure write. No platform-content curation. |
| **Operator**       | Day-to-day operations. Own dashboards, read audit and system.         | VMs (read, operate, and snapshot), templates (read), dashboards (read), audit, and system and monitoring (read). No Image Catalog. No Infrastructure (network, storage, or namespace). No Settings access.                                                                                                                                                                                                                                                    |
| **Viewer**         | Read-only with own dashboard config.                                  | VMs (read only), templates (read), dashboards (read), audit, and system and monitoring (read). No Image Catalog. No Infrastructure. No Settings. No operate or snapshot actions. No writes anywhere.                                                                                                                                                                                                                                                          |

You cannot create a custom role or modify a built-in role in this release. Both the UI and the API reject these
operations.

Each VMO role also binds a fixed Kubernetes ClusterRole that grants the underlying access to the KubeVirt API. VM
Launchpad selects the matching ClusterRole automatically when you assign a role to a user or group.

| **VMO Role**   | **Kubernetes ClusterRole** |
| -------------- | -------------------------- |
| Platform Admin | `spectro-vm-admin`         |
| Editor         | `spectro-vm-power-user`    |
| Operator       | `spectro-vm-user`          |
| Viewer         | `spectro-vm-viewer`        |

Local users are an exception. A local user receives the VMO role without a matching ClusterRole binding, because local
authentication reaches the Kubernetes API through the VMO Manager pod's ServiceAccount instead of a per-user binding.

## Permission Format

Every VMO permission follows the format `vmo:<domain>:<action>`.

| **Part** | **Description**                                                                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vmo`    | Static prefix identifying the permission as a VMO IAM permission.                                                                                                                |
| `domain` | The functional area the permission controls, such as `config`, `storage`, or `network`.                                                                                          |
| `action` | The operation the permission grants. Most domains use `read` and `write`. Others define granular or domain-specific actions. Refer to [Permission Actions](#permission-actions). |

For example, `vmo:packages:write` grants write access to the package repository, and `vmo:audit:read` grants read access
to the audit log.

### Permission Actions

Most domains use `read` and `write`. The following table describes every other action and the domains that define it.

| **Action**                           | **Domains**                  | **Description**                                                                                                                             |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`, `read`, `update`, `delete` | `namespace`, `network`, `vm` | Granular access to create, read, update, and delete individual resources in the domain. These three domains do not define a `write` action. |
| `operate`                            | `vm`                         | Start, stop, restart, migrate, and open the console of a VM.                                                                                |
| `snapshot`                           | `vm`                         | Create, restore, and manage VM snapshots.                                                                                                   |
| `export`, `import`                   | `config-bundle`              | Export and import configuration bundles. This domain does not define `read` or `write`.                                                     |
| `manage-manifests`                   | `dashboards`                 | Create, list, and delete dashboard manifests.                                                                                               |
| `configure`                          | `monitoring`                 | Change the monitoring configuration.                                                                                                        |
| `device-discovery`                   | `storage`                    | Discover devices available on cluster nodes.                                                                                                |

Only the Platform Admin role includes the `configure` and `device-discovery` actions. No procedure in this section
depends on either one.

Two domains define a single action. The `audit` domain defines only `read`, and the `branding` domain defines only
`write`.

### Permission Domains

The following table lists every VMO permission domain and the actions each domain defines.

| **Domain**      | **Actions**                                                 | **Description**                                                                                             |
| --------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `vm`            | `create`, `read`, `update`, `delete`, `operate`, `snapshot` | Virtual machines, including lifecycle, console access, and snapshots.                                       |
| `config`        | `read`, `write`                                             | Platform configuration, including environment variables.                                                    |
| `config-bundle` | `export`, `import`                                          | Export and import configuration bundles.                                                                    |
| `branding`      | `write`                                                     | Branding assets (logo, colors).                                                                             |
| `certificates`  | `read`, `write`                                             | TLS certificates.                                                                                           |
| `packages`      | `read`, `write`                                             | Package repository. Golden image DataVolume operations (upload, delete, build) also use this domain.        |
| `templates`     | `read`, `write`                                             | VM templates.                                                                                               |
| `dashboards`    | `read`, `manage-manifests`                                  | Dashboards and metrics.                                                                                     |
| `local-users`   | `read`, `write`                                             | Local authentication accounts.                                                                              |
| `api-keys`      | `read`, `write`                                             | API key creation and revocation. Refer to [API Keys](./api-keys.md).                                        |
| `iam`           | `read`, `write`                                             | IAM roles, group mappings, and access policies.                                                             |
| `audit`         | `read`                                                      | Audit log.                                                                                                  |
| `system`        | `read`, `write`                                             | System health and platform information.                                                                     |
| `crd-catalog`   | `read`, `write`                                             | CRD catalog.                                                                                                |
| `monitoring`    | `read`, `configure`                                         | Monitoring configuration.                                                                                   |
| `storage`       | `read`, `write`, `device-discovery`                         | StorageClasses, StoragePools, DataVolumes other than golden images, HA settings, and system storage resize. |
| `network`       | `create`, `read`, `update`, `delete`                        | Network Attachment Definition (NAD) resources and network capabilities.                                     |
| `namespace`     | `create`, `read`, `update`, `delete`                        | Namespaces and namespace policies.                                                                          |
| `roles`         | `read`, `write`                                             | Built-in VMO role definitions. Roles are immutable in this release.                                         |
| `features`      | `read`, `write`                                             | Feature flags.                                                                                              |
| `kubevirt`      | `read`, `write`                                             | Cluster-level KubeVirt configuration.                                                                       |
| `admission`     | `read`, `write`                                             | Admission control policies.                                                                                 |

:::info

The **KubeVirt Configuration** page in the UI is additionally gated on cluster-admin privileges and OIDC authentication.
A user who holds only the `kubevirt` domain permissions cannot open the page.

:::

## Built-in Role Maintenance

VM Launchpad maintains the definitions of the four built-in roles, so you do not need to take any action to keep them
current. Their permission sets belong to the release rather than to your installation, which means an upgrade can change
what a built-in role grants.

After an upgrade, review the [Built-in Roles](#built-in-roles) table for the version you run and confirm that each role
still matches the access you intend to grant.

## Next Steps

- Assign a VMO role to a user. Refer to [Users](./users.md).

- Assign a VMO role to a group. Refer to [Groups](./groups.md).

- View existing role mappings and Kubernetes bindings. Refer to [Access Mapping](./access-mapping.md).
