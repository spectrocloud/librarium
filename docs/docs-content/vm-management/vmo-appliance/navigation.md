# Navigation Guide

This guide explains how to navigate VMO Manager, including the sidebar structure, theme and language options, global search, and permission-based visibility.

After login, you may see a **Last Login** banner at the top of the page showing your previous login time and IP address. This helps you verify that no one else has accessed your account. The banner can be dismissed and reappears on each new login.

## Sidebar Structure

The sidebar organizes the platform into workflow-centric groups. Each group has an icon and, when expanded, a list of child items.

### Expanded Mode

When the sidebar is expanded (default):

- **Click the group label** — Navigates to the group's primary route (e.g., clicking "Workloads" goes to `/vms`).
- **Click the chevron** — Expands or collapses the child items. The chevron rotates to indicate state.
- **Click a child item** — Navigates to that specific page (e.g., "Virtual Machines" goes to `/vms`).

The first child in each group typically links to the same primary route as the group (e.g., "Virtual Machines" and "Workloads" both go to `/vms`).

### Collapsed Mode

When the sidebar is collapsed (narrow icon-only view):

- **Click the group icon** — Navigates to the group's primary route and opens a **flyout** sub-menu with child items.
- **Hover over the icon** — Shows the flyout temporarily.
- **Click the X** — Closes the pinned flyout.
- **Active group** — Shows a checkmark badge when you are on a page within that group.

> **Tip:** Use the sidebar toggle button in the header to switch between expanded and collapsed modes.

## Sidebar Groups

| Group | Icon | Primary Route | Children |
|-------|------|---------------|----------|
| Dashboard | Gauge | `/` | (none — single item) |
| Workloads | CPU | `/vms` | Virtual Machines, Templates, Preferences, Instance Types, Snapshot Policies |
| Image Catalog | Stack | `/images` | Golden Images, Customization Templates, Auto Install Scripts, Packages |
| Inventory | Warehouse | `/inventory` | Clusters, Compute, Networks, Storage, Namespaces |
| System | Heartbeat | `/system` | Platform Health, Cluster Events, Audit |
| Settings | Gear | `/settings` | Access Management and Platform tabs (see below) |

Separators appear before System and Settings to visually distinguish administrative sections.

## Settings Page Layout

The Settings page is organized into two main sections:

### Access Management

Tabs under Access Management:

- **Access Policies** — View and manage access policies, Grant Access Wizard quick actions, and the Auth Flow diagram
- **Users** — Manage Keycloak users (requires Keycloak)
- **Groups** — Manage Keycloak groups (requires Keycloak and group-management feature flag)
- **RBAC** — View and edit ClusterRoleBindings and RoleBindings
- **IAM Roles** — Manage VMO IAM roles and group-to-role mappings
- **API Keys** — Admin-wide management of programmatic API keys (requires Keycloak and api-keys feature flag, plus `vmo:api-keys:read`/`write`). For self-service management of your own keys, use **My API Keys** in the user-menu dropdown (top-right of the header, route `/me/api-keys`).
- **Local Users** — Manage local admin accounts (requires local-auth feature flag)

When you are in any Access Management tab, a collapsible **Auth Flow** section shows how access is granted: Browser to IdP to VMO Manager to Kubernetes API. Quick action cards let you open the **Grant Access Wizard** for onboarding users, granting access, or creating groups.

### Platform

Tabs under Platform:

- **Configuration** — Runtime config and layered overrides
- **Certificates** — CA trust and TLS certificate management
- **Branding** — Logo, favicon, and color customization
- **Feature Flags** — Enable or disable experimental and stable features
- **Monitoring** — Metrics backend configuration
- **Storage** — VMO data PVC status and expansion
- **CRD Catalog** — Discover and manage CRDs (requires crd-catalog feature flag)
- **Dashboards** — Dashboard manifest management (requires dashboard-manifests feature flag)
- **Admission Control** — CPU and memory overcommit policies

## Theme Toggle

The header includes a theme picker with three options:

- **Light** — Light mode
- **Dark** — Dark mode
- **System** — Follow the operating system preference

The selected theme is persisted across sessions.

## Language Picker

When internationalization is enabled (`I18N_ENABLED=true`), a language picker appears in the header. Supported languages include English, French, and German. The selection is persisted across sessions.

> **Note:** The language picker is hidden when i18n is disabled (default).

## Global Search (Cmd+K)

Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux) to open the global search dialog. You can search across:

- Virtual Machines
- Templates
- Data Volumes
- Networks
- Namespaces
- Users
- Groups
- Access Policies

Type to filter results. Click a result to navigate to that resource. The search respects your permissions; you only see resources you can access.

## Permission-Based Visibility

Sidebar items and Settings tabs are **hidden** when you lack the required permission. For example:

- **System** group — Requires `vmo:system:read`. Users without this permission do not see the System group.
- **Platform Health, Cluster Events, Audit** — Each requires `vmo:system:read` or `vmo:audit:read`.
- **Settings tabs** — Each tab has a `requiredPermission` (e.g., `vmo:iam:read`, `vmo:config:read`). Tabs you cannot access are not shown.

Feature flags also affect visibility. Tabs such as API Keys, Local Users, CRD Catalog, and Dashboards are hidden when their feature flag is disabled.

> **Warning:** Hiding UI elements is not a security boundary. The backend enforces permissions on every API call. Users without permission receive 403 Forbidden when attempting unauthorized operations.
