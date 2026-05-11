# IAM Roles & Permissions

This document describes VMO Manager's IAM roles, permission format, and how roles map to Kubernetes RBAC.

## Built-in Roles

VMO Manager seeds four built-in roles on startup. These roles are reconciled on every restart: missing permissions are added, and permissions no longer in the canonical set are removed.

| Role | Intent | Key Permissions |
|------|--------|-----------------|
| **Platform Admin** | Full control | All permissions |
| **Editor** | VM workflow builder | packages, templates, dashboards (r+w), networks, namespaces, CRD catalog (r), system health (r) |
| **Operator** | Day-to-day ops | templates, dashboards (r+w), packages (r), audit, system, monitoring, storage (r) |
| **Viewer** | Read-only consumer | templates, packages (r), dashboards (r+w own), system health (r), networks, namespaces (r) |

## Permission Format

Permissions follow the format: `vmo:<domain>:<action>`

| Part | Description |
|------|-------------|
| **domain** | Functional area (e.g. `config`, `storage`, `network`). |
| **action** | `read` or `write` (or domain-specific actions like `manage-manifests`, `export`, `import`). |

## Permission Domains

VMO Manager defines 19 permission domains:

| Domain | Description |
|--------|-------------|
| `config` | Platform configuration (env vars, feature flags). |
| `config-bundle` | Export/import configuration bundles. |
| `branding` | Branding assets (logo, colors). |
| `certificates` | TLS certificates. |
| `features` | Feature flags. |
| `packages` | Package repository. |
| `templates` | VM templates. |
| `dashboards` | Dashboards and metrics. |
| `local-users` | Local auth accounts. |
| `iam` | IAM roles, group mappings, access policies. |
| `audit` | Audit log. |
| `system` | System health, platform info. |
| `crd-catalog` | CRD catalog. |
| `monitoring` | Monitoring configuration. |
| `storage` | StorageClasses, StoragePools, PVCs. |
| `network` | NADs, network capabilities. |
| `namespace` | Namespaces and namespace policies. |
| `roles` | Custom role management (when role-management feature flag enabled). |
| `admission` | Admission control policies. |

## Custom Roles

When the **role-management** feature flag is enabled, you can create custom roles:

1. Go to **Settings > IAM Roles**.
2. Click **Create Role**.
3. Name the role.
4. In the **Pages** field, type to search and select the platform pages (permission domains) the role should cover. Each selected page shows action chips:
   - For most pages: **read** and **update** (maps to `read` and `write` on the backend).
   - For **Virtual Machines**, **Network**, and **Namespaces**: **create**, **read**, **update**, **delete** (CRUD).
   - Non-CRUD actions such as `operate` (VM console, start/stop) and `snapshot` are not shown in the editor but are preserved when saving a role that already holds them.
5. Toggle the action chips to enable or disable individual actions for each selected page.
6. Click **Save**.

Custom roles are stored as CRDs. Both group-to-role and user-to-role mappings can reference custom roles. Access policies map IAM roles to Kubernetes ClusterRoles; custom roles must be mapped to a supported K8s role (e.g. spectro-vmo-viewer) for access policies to work.

## Role Mappings

VMO IAM resolves permissions from two mapping types:

| Mapping type | Key | Managed via |
|-------------|-----|-------------|
| **Group mappings** | OIDC group name | Grant Access wizard or `/api/v1/role-mappings` API |
| **User mappings** | OIDC subject, email, or username | Grant Access wizard, User edit modal, or `/api/v1/user-role-mappings` API |

When resolving a user's permissions, VMO unions the permissions from all group mappings (matched by OIDC groups) and user mappings (matched by sub/email/username). Each subject can hold one VMO role per mapping type.

The **Settings > IAM Roles** page shows only the Roles table. Group-to-role mapping is managed through the Grant Access wizard (**Settings > Access Management > Grant Access**) or the API — there is no dedicated Group Mappings tab on the IAM Roles page.

## Role Reconciliation

On every VMO Manager restart, `reconcileBuiltinPermissions()` runs:

- **Adds missing permissions** — If a built-in role is missing a permission that was added in an upgrade, it is added.
- **Removes stale permissions** — If a built-in role has a permission that is no longer in the canonical set (e.g. after a scope tightening), it is removed.

Custom roles are not modified by reconciliation. Only built-in roles (Platform Admin, Editor, Operator, Viewer) are reconciled.
