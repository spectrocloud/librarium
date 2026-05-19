# Audit Log

VMO Manager records audit events for security-relevant actions. Audit events are stored as `VmoAuditEvent` custom resources and can be viewed and filtered from the System console.

## What Gets Audited

The following actions are recorded:

| Category | Actions |
|----------|---------|
| Authentication | `login`, `login-failed`, `logout`, `password-change` |
| Resources | Create, update, delete for config, certificates, VMs, templates, namespaces, and other managed resources |

### Authentication Events

- **login** — Successful OIDC or local user login
- **login-failed** — Failed login attempt (invalid credentials, etc.)
- **logout** — User logged out
- **password-change** — Local user password change (e.g., via Set Password)

### Resource Events

Resource CRUD events include the resource type, name, namespace (if applicable), and the user who performed the action. Examples: `create` on `config`, `delete` on `vm`, `update` on `template`.

## VmoAuditEvent CRD

Audit events are persisted as `VmoAuditEvent` custom resources in the `spectrocloud.com/v1beta1` API group. Each event contains:

- **Action** — The operation performed (e.g., `login`, `create`, `delete`)
- **Resource** — The resource type (e.g., `oidc-user`, `local-user`, `vm`, `config`)
- **ResourceName** — Name of the affected resource
- **User** — Identity of the user who performed the action
- **Timestamp** — When the event occurred
- **Details** — Optional additional context

## Viewing Audit Events

1. Go to **System > Audit** in the sidebar.
2. The audit log displays events in reverse chronological order (newest first).

### Filtering

You can filter the audit log by:

| Filter | Description |
|--------|-------------|
| Action | Filter by action type (e.g., `login`, `create`, `delete`) |
| Resource | Filter by resource type (e.g., `vm`, `config`, `oidc-user`) |
| User | Filter by username or user identifier |

Apply filters to narrow the list to the events you need for compliance or troubleshooting.

## Audit Event Retention

Audit events are retained according to your cluster's resource policies. For long-term retention, consider:

- Exporting audit data periodically to an external SIEM or log aggregator
- Configuring a retention policy or cleanup job for old `VmoAuditEvent` resources
- Using cluster-level logging to forward audit events to a central logging system

> **Note:** Audit events are stored in the cluster and consume etcd storage. In high-activity environments, plan for retention and archival to avoid unbounded growth.
