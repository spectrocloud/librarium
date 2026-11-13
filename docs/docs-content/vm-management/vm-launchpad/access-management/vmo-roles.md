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
Built-in roles are read-only. When no built-in role fits, a Platform Admin can create a custom role with the permissions
you choose. Refer to [Custom Roles](#custom-roles). Use roles to assign VMO access to users on the [Users](./users.md)
page or to groups on the [Groups](./groups.md) page.

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## VMO Roles Page

From the left main menu, select **Settings** > **Access Management** > **VMO Roles** to view all built-in and custom
roles in the appliance.

The **VMO Roles** table lists the following columns.

| **Column**      | **Description**                                                               |
| --------------- | ----------------------------------------------------------------------------- |
| **Role**        | The role name.                                                                |
| **Type**        | **Built-in** for the roles that ship with VM Launchpad, or **Custom**.        |
| **Permissions** | The number of permissions that the role grants.                               |
| **Mapped**      | The groups and users that hold the role.                                      |
| **Kubernetes**  | The Kubernetes ClusterRole that grants the role's access to the KubeVirt API. |

Select a column header to sort. Use the **Filter rows** search box to filter by any field. Each role offers **View** and
**Clone**. Custom roles also offer **Edit** and **Delete**.

## Built-in Roles

The following table lists each built-in role, the description shown on the **VMO Roles** page, and a summary of the
role's permissions.

| **Role**           | **Description**                                                       | **Summary of permissions**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Platform Admin** | Full platform control. All VMO permissions.                           | All permissions across all namespaces.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Editor**         | VM workflow and operational tooling. Templates, dashboards, packages. | Full VM lifecycle (create, read, update, delete, operate, and snapshot), Image Catalog (read and write, including golden image upload, delete, and build), templates (read and write), instance types and preferences (read only), dashboards (read), audit, system and monitoring (read), CRD catalog (read), and Infrastructure (read only, required for the VM creation wizard's NAD, StorageClass, and namespace pickers). No Settings access. No Infrastructure write. No platform-content curation. No create, edit, or delete of instance types or preferences. |
| **Operator**       | Day-to-day operations. Own dashboards, read audit and system.         | VMs (read, operate, and snapshot), templates (read), dashboards (read), audit, and system and monitoring (read). No Image Catalog. No Infrastructure (network, storage, or namespace). No Settings access.                                                                                                                                                                                                                                                                                                                                                             |
| **Viewer**         | Read-only with own dashboard config.                                  | VMs (read only), templates (read), dashboards (read), audit, and system and monitoring (read). No Image Catalog. No Infrastructure. No Settings. No operate or snapshot actions. No writes anywhere.                                                                                                                                                                                                                                                                                                                                                                   |

You cannot modify or delete a built-in role. Both the UI and the API reject these operations. To change what a built-in
role grants, clone it into a custom role. Refer to [Custom Roles](#custom-roles).

Each built-in VMO role also binds a fixed Kubernetes ClusterRole that grants the underlying access to the KubeVirt API.
VM Launchpad selects the matching ClusterRole automatically when you assign a role to a user or group.

| **VMO Role**   | **Kubernetes ClusterRole** |
| -------------- | -------------------------- |
| Platform Admin | `spectro-vm-admin`         |
| Editor         | `spectro-vm-power-user`    |
| Operator       | `spectro-vm-user`          |
| Viewer         | `spectro-vm-viewer`        |

Local users are an exception. A local user receives the VMO role without a matching ClusterRole binding, because local
authentication reaches the Kubernetes API through the VMO Manager pod's ServiceAccount instead of a per-user binding.

## Custom Roles

A custom role grants the VMO permissions that you choose. Use one when no built-in role fits, for example, to let a
group operate VMs in one namespace without access to settings. Only the **Platform Admin** role can create, edit,
delete, and assign custom roles.

### Create a Custom Role

1. From the left main menu, select **Settings** > **Access Management** > **VMO Roles**.

2. Select **Create Role**. To start from the permissions of an existing role, select **Clone** on that role instead.

3. Enter a **Role ID**, a **Display Name**, and an optional **Description**. The role ID must be a DNS-1123 label of up
   to 63 characters, and it cannot start with `spectro-vm-`. You cannot change the role ID later.

4. Under **App Console Permissions**, select at least one permission. You can grant only permissions that you hold.
   Permissions reserved for Platform Admin, such as `vmo:roles:write` and `vmo:iam:write`, are not available.

5. Select **Create Role**.

VM Launchpad creates a Kubernetes ClusterRole named `spectro-vm-custom-<role-id>` for the role and keeps its rules in
step with the role's permissions. Until the ClusterRole exists, the **Kubernetes** column shows a dash and you cannot
assign the role. Do not edit the ClusterRole manually, because VM Launchpad reverts manual changes.

### Assign a Custom Role

Assign a custom role to a user or a group in the **Assign Member Role** step of the access wizard, or when you edit the
user or group. Custom roles appear under **Custom Roles**. Choose **Cluster-wide access**, or the namespaces where the
role applies.

- A custom role adds to the built-in role of the user or group and to any other custom roles they hold. Custom roles
  that a user receives directly and through groups also add up. Built-in roles still follow the rules in
  [Users](./users.md) and [Groups](./groups.md).

- In a namespace, a custom role grants only its VM, network, template read, storage read, and namespace read
  permissions. Its other permissions, such as audit or settings access, apply only when you assign the role
  cluster-wide.

:::warning

Assign custom roles to namespaces where you can. Assigned cluster-wide, a role with `vmo:vm:create` or `vmo:vm:update`
can create and delete Secrets in every namespace, including the VMO namespace. A role with `vmo:namespace:delete` can
delete any namespace, including system namespaces.

:::

### Edit or Delete a Custom Role

- To change the display name, description, or permissions of a custom role, select **Edit**. You must hold every
  permission that the role grants. Changes apply immediately to everyone who holds the role.

- To delete a custom role, select **Delete** and type the role ID to confirm. VM Launchpad does not delete a role that
  is still assigned, so remove its assignments first.

`VMORole` resources that you create with `kubectl` also appear on the **VMO Roles** page as custom roles. If you delete
one with `kubectl`, its role bindings remain. Remove them before you reuse the role ID.

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

Three domains define a single action. The `audit` domain defines only `read`, and the `branding` and `instancetypes`
domains define only `write`.

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
| `instancetypes` | `write`                                                     | Cluster-scoped instance types and preferences (Platform Admin only). Viewing them requires `vmo:vm:read`.   |
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
| `roles`         | `read`, `write`                                             | VMO role definitions. `write` creates, edits, and deletes custom roles. Platform Admin only.                |
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
