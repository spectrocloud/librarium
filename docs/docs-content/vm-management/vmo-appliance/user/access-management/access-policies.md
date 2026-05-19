# Access Policies

This document describes unified VMO access policies and the Grant Access Wizard, which create Kubernetes ClusterRoleBindings and RoleBindings.

## Grant Access Wizard

The Grant Access Wizard is the primary UI for onboarding users, creating groups, and granting access. It also manages group-to-role and user-to-role VMO IAM mappings — there is no separate Group Mappings tab on the IAM Roles page. Open the wizard from **Settings > Access Management** or via the **Grant Access** button.

### Quick Actions (Intents)

| Intent | Description |
|--------|-------------|
| **Onboard Users** | Create new users (or bulk upload via CSV) and grant them access. |
| **Create Group** | Create a new group and optionally assign a role and scope. |
| **Grant Access** | Grant access to existing users or groups. |

### Multi-Step Wizard

The wizard has four steps:

| Step | Description |
|------|-------------|
| **Who** | Select users or groups. For Onboard Users: add users via form or CSV upload. For Create Group: enter group name. |
| **Role** | Select VMO IAM role (Platform Admin, Editor, Operator, Viewer). Optional: skip if only creating a group. |
| **Scope** | Cluster-wide or namespace-scoped. Select namespaces or create new ones. Optional: skip for cluster-wide only. |
| **Review** | Review selections and submit. |

When you add new users on the **Who** step, **Next** stays disabled until the first row meets username, email, and password rules (or **Temporary** is checked with no password). Invalid email format, username characters, password policy issues, and non-matching confirmation appear inline as you type. Empty fields do not show “required” messages until there is something to validate against. Password fields include show/hide controls.

### Bulk CSV Upload

In the **Who** step, switch to **CSV** mode to upload a file. Format:

```
username,email,firstName,lastName,password
alice,alice@example.com,Alice,Smith,secret123
bob,bob@example.com,Bob,Jones,
```

- At least `username` and `email` are required.
- Email must be valid (contain `@`).
- Password is optional; users can set it on first login if configured.

## How Policies Map to K8s RBAC and VMO IAM

Access policies unify two authorization planes:

| Plane | What it controls | Stored as |
|-------|-----------------|-----------|
| **K8s RBAC** | Direct `kubectl` access and KubeVirt API calls | ClusterRoleBinding / RoleBinding |
| **VMO IAM** | Platform UI permissions (read/write gates, sidebar visibility) | User or group-to-role mapping on VMORole CRDs |

A single grant can create both a K8s binding **and** a VMO role mapping, or either one independently.

### Supported Roles (K8s plane)

Any ClusterRole or namespaced Role that exists in the cluster can be bound
through Access Policies. The backend validates that the referenced role
exists before creating the binding but does **not** restrict which roles
may be selected. The four built-in VMO ClusterRoles are the expected
choice for VMO-scoped access:

| ClusterRole | VMO Role | Purpose |
|-------------|----------|---------|
| `spectro-vmo-admin` | Platform Admin | Full access including RBAC, Cilium, quotas, audit |
| `spectro-vmo-power-user` | Editor | Full VM/DV/network access, read-only templates/namespaces |
| `spectro-vmo-user` | Operator | Operate VMs (start/stop/console) but not create/delete |
| `spectro-vmo-viewer` | Viewer | Read-only all VMO resources |

Custom ClusterRoles created through the **RBAC** tab appear in the role
dropdown alongside the four built-in roles — the backend tags them with
`app.kubernetes.io/managed-by: vmo-manager`, and the picker shows only
roles carrying that label to keep the list manageable in busy clusters
(Kubernetes, CNI, and operator ClusterRoles would otherwise flood the
dropdown). ClusterRoles created directly with `kubectl` without that
label will not appear in the picker; to surface one, either re-create
it through the RBAC tab or add the label:

```bash
kubectl label clusterrole <name> app.kubernetes.io/managed-by=vmo-manager
```

The backend itself still accepts any ClusterRole that exists in the
cluster on grant submission, so API/CLI callers are not restricted to
the labeled set. Namespace-scoped grants can reference a namespaced
`Role` (roleKind: `Role`) instead of a ClusterRole.

> **UI scoping — namespace-scoped grants**
>
> When an OIDC user has only namespace-scoped RoleBindings (no ClusterRoleBinding and no
> VMO IAM role mapping), the VMO UI automatically scopes their view to those namespaces.
> The VM list page, dashboard widgets (VM Status Distribution, VMs by Namespace, VMs
> Needing Attention), and all namespace dropdowns show only the namespaces covered by
> their bindings. Users with a ClusterRoleBinding or a VMO IAM role mapping see all
> managed namespaces regardless of any RoleBindings they also hold.
>
> This scoping is enforced on page load and cached for 30 seconds. If you grant or revoke
> namespace access and the user's view does not update immediately, they can refresh the
> page to force a re-check.

> **Security note — widened role scope**
>
> Because any ClusterRole is bindable, a Platform Admin granting access
> through this page can hand out cluster-wide privileges that reach
> beyond VMO resources — up to and including `cluster-admin`. The
> authorization model is unchanged (only holders of `vmo:iam:write`, i.e.
> Platform Admins, can grant access, and those users could already bind
> any ClusterRole via `kubectl`), but the UI no longer structurally
> limits grants to `spectro-vmo-*` roles. Prefer the built-in VMO
> ClusterRoles for VMO-scoped access, and reserve custom or broader
> ClusterRoles for operators who genuinely need cluster-scoped
> privileges. API keys remain restricted to `spectro-vmo-*` so that a
> leaked offline token cannot escalate beyond VMO.

### VMO Role Mappings (IAM plane)

VMO role mappings assign a VMO IAM role directly to a user or group identity, independent of K8s RBAC. This controls platform-level permissions (what the user sees and can do in the VMO UI).

- Each subject (user or group) can hold **one VMO role** at a time.
- Assigning a different role requires revoking the existing mapping first.
- Re-assigning the same role is idempotent (succeeds without error).

### Grant Flow

When you grant access via the wizard or API:

1. **K8s binding** (if a K8s role is selected): VMO creates the appropriate ClusterRoleBinding or RoleBinding.
2. **VMO role mapping** (if a VMO role is selected): VMO maps the subject to the selected IAM role.
3. For namespace scope, a RoleBinding is created in each selected namespace.

## Viewing Access

- **Settings > Access Management > Access Policies** -- Lists all VMO-managed K8s bindings and VMO role mappings in a unified view.
- Entries with `bindingKind: VMORoleMapping` represent VMO IAM-only mappings (no K8s binding).
- Entries with both a `role` and a `vmoRole` indicate dual-plane grants.
- **Auth Flow Diagram** -- Visualize Group -> Role -> ClusterRole -> Namespace for the current user.

## Revoking Access

1. Go to **Settings > Access Management > Access Policies**.
2. Find the policy for the user or group.
3. Click **Revoke** or **Delete**.
4. Confirm.

Revoking can remove the K8s binding, the VMO role mapping, or both, depending on the grant. When both are revoked in a single operation, the K8s binding is deleted first; if that fails, the VMO mapping is preserved so nothing is silently lost.

## User-to-Role Mappings API

The `/api/v1/user-role-mappings` endpoint manages direct user-to-VMO-role assignments. This is separate from group mappings and allows assigning VMO IAM roles to individual OIDC users by their subject, email, or username.

| Method | Description |
|--------|-------------|
| `GET` | List all user-to-role mappings. Returns `[{"user": "...", "roleId": "...", "roleName": "..."}]`. |
| `PUT` | Set a mapping: `{"user": "alice@example.com", "roleId": "vmo-viewer"}`. Only one role per user. |
| `DELETE` | Remove a mapping: `?user=alice@example.com`. |

Requires `vmo:roles:read` (GET) or `vmo:roles:write` (PUT/DELETE) permission.
