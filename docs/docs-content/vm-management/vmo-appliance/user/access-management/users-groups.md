# Users & Groups

This document describes how VMO Manager manages users and groups via Keycloak.

## User Management via Keycloak Admin API

VMO Manager integrates with Keycloak for user and group management. When configured, users and groups are created, updated, and deleted through the Keycloak Admin API. VMO Manager uses a service account with admin privileges to perform these operations.

## Creating Users — Onboard Users Wizard

User creation uses the multi-step **Onboard Users Wizard**, opened from the Users page:

1. Go to **Settings > Access Management > Users**.
2. Click **Create User**.
3. The wizard opens at the **Who** step. Fill in at least one user row:
   - **Username** — Required. Letters, numbers, periods, underscores, and hyphens only (max 255 characters).
   - **Email** — Required. Must be a valid email address.
   - **First name** and **Last name** — Optional.
   - **Password** — Must meet the platform password policy (see below). Check **Temporary** to force a password reset on first login.
4. Optionally assign the new user to one or more existing groups using the checkboxes below the user rows.
5. Click **Add row** to create multiple users in one flow, or switch to **CSV** upload mode for bulk creation.
6. Click **Next** to advance through the remaining wizard steps:
   - **Role** — Optionally assign a VMO IAM role (Platform Admin, Editor, Operator, Viewer).
   - **Scope** — Optionally set cluster-wide or per-namespace Kubernetes access scope. Required if a role is selected and a K8s binding is needed.
   - **Review** — Confirm all selections before submitting.

Inline validation appears as you type for invalid email format, username characters, password strength, and non-matching confirmation. **Next** stays disabled until the row is complete and valid. Empty fields do not show “required” text until you have started filling the row.

### Password Policy

Passwords must meet the following requirements:

- Minimum 6 characters
- At least one uppercase letter (A–Z)
- At least one lowercase letter (a–z)
- At least one digit (0–9)
- At least one special character (e.g. `!`, `@`, `#`, `$`)

Policy violations appear inline as you type. The **Next** button stays disabled until all violations are resolved or **Temporary** is checked (which bypasses the password requirement, prompting the user to set a password on first login).

Users are stored in Keycloak. VMO Manager does not store user credentials; it delegates to Keycloak.

## Editing Users

1. Go to **Settings > Access Management > Users**.
2. Click a user row or use the context menu and choose **Edit**.
3. Update email, first/last name, or enabled status.
4. Add or remove group membership from the same modal.
5. Optionally assign or change the user's **VMO Role** (Platform Admin, Editor, Operator, Viewer). Selecting a role reveals the **Namespace Scope** section:
   - **Cluster-wide** — Creates a ClusterRoleBinding granting access across all namespaces.
   - **Per-namespace** — Check one or more namespaces to create RoleBindings scoped to those namespaces only.
   - A scope selection (cluster-wide or at least one namespace) is required when a K8s role is assigned.
6. Click **Save**.

The email verified status is not shown or editable in this modal. It is set to `false` on save to maintain a consistent Keycloak state.

## Deleting Users

1. Go to **Settings > Access Management > Users**.
2. Select the user and click **Delete** (or use the context menu).
3. Confirm deletion.

Deleting a user removes them from Keycloak. Their access policies (ClusterRoleBindings, RoleBindings) may remain until explicitly revoked. See Access Policies for revoking access.

## Bulk CSV User Upload

The Onboard Users Wizard supports bulk user creation via CSV upload:

1. Go to **Settings > Access Management > Users** and click **Create User**.
2. In the **Who** step, switch to **CSV** upload mode.
3. Upload a CSV file with columns: `username`, `email`, `firstName`, `lastName`, `password` (optional).
4. At least `username` and `email` are required. Valid email format is enforced.
5. Proceed through the **Role** and **Scope** steps to assign access as needed, then **Review** and submit.

## Group Management

Users belong to groups. Groups map to VMO IAM roles through the Grant Access Wizard (**Settings > Access Management > Grant Access**) or the `/api/v1/role-mappings` API.

### Creating Groups

1. Go to **Settings > Access Management > Groups**.
2. Click **Create Group**.
3. Enter a group name (e.g. `vmo-operators`). Names must follow DNS label rules (lowercase alphanumeric and hyphens).
4. Configure Kubernetes access for the group:
   - **Kubernetes Cluster Role** — Select a ClusterRole to bind (e.g. `spectro-vmo-user`). Only VMO-managed roles (`spectro-vmo-*`) are currently supported for access policy creation.
   - **Namespace Scope** — Choose **Cluster-wide** to bind a ClusterRoleBinding across all namespaces, or select one or more specific namespaces to create RoleBindings scoped to those namespaces only.
5. Click **Create**.

If a Kubernetes role is selected, a namespace scope (cluster-wide or at least one namespace) is required.

### Editing Groups

1. Open a group's detail view by clicking the row or using the context menu.
2. The edit modal has two sections:
   - **Kubernetes access** — Modify the bound ClusterRole and the namespace scope (cluster-wide or per-namespace). Click **Save access** to apply changes. The button is enabled only when the access configuration differs from the current state.
   - **Members** — Add or remove users from the group. Member changes take effect on next login (or token refresh).
3. Changes to Kubernetes access create or revoke ClusterRoleBindings and RoleBindings in the cluster.

### Deleting Groups

- **Delete** — Remove the group from Keycloak. Group-to-role mappings and access policies for that group are unaffected until you update IAM Roles or revoke access policies.

## Palette-Managed Environments

When VMO Manager is deployed in a **Palette-managed** environment (e.g. Spectro Cloud), user and group creation may be **hidden**. User and group lifecycle is managed by the parent platform (Palette/VerteX proxy). In that case, VMO Manager still displays users and groups for viewing and access policy assignment, but creation is done elsewhere.
