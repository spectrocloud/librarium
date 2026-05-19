# Local Auth

This document describes local authentication: Day 0 admin access before Keycloak is configured.

## Purpose

Local auth provides admin access when no OIDC provider (Keycloak) is available. Typical use cases:

- **Day 0 bootstrap** — Initial platform setup before identity provider configuration.
- **Air-gapped or isolated environments** — Where Keycloak is not yet deployed.
- **Recovery** — Fallback access if OIDC is misconfigured.

## How It Works

| Component | Description |
|-----------|-------------|
| **Passwords** | Stored as bcrypt hashes in Kubernetes Secrets. VMO Manager never stores plaintext passwords. |
| **Session** | Login creates a session with `IsLocal: true`. Session cookie is AES-256-GCM encrypted. |
| **K8s access** | Local users use the pod's service account (SA) token for Kubernetes API calls. No OIDC token is forwarded. |

Local users receive full Platform Admin permissions directly (they bypass the group-mapping resolver).

### Palette Mode (Day 0 Bootstrap)

When VMO Manager is deployed via Palette (indicated by a path in `BASE_URL`, e.g. `/v1/tenants/abc`):

- **Local auth is automatically enabled** unless explicitly disabled with `LOCAL_AUTH_ENABLED=false`.
- The **Access Denied** page shows a "Sign in with a local account" link when local auth is enabled, directing users to `/local-login` for Day 0 access before OIDC is configured.

## Initial Setup

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOCAL_AUTH_ENABLED` | Enable local auth. Set to `true` when no OIDC issuer is configured. | Auto-enabled when `OIDC_ISSUER_URL` is empty; also auto-enabled in Palette mode (when `BASE_URL` has a path) unless set to `false` |
| `LOCAL_ADMIN_USERNAME` | Username for the Day 0 admin account. | `admin` |
| `LOCAL_ADMIN_PASSWORD` | Password for the Day 0 admin. Required to seed the initial account. | (empty) |

### Helm Values

When deploying via Helm:

```yaml
vmo-manager:
  features:
    localAuth:
      enabled: true
      adminUsername: admin
      adminPassword: <secure-password>
```

When `palette.enabled: true`, local auth is automatically enabled and the admin password from `features.localAuth.adminPassword` is included in the Secret for Day 0 bootstrap.

> **Warning:** Do not commit passwords to version control. Use a secrets manager or Helm `--set` for production.

### Bootstrap Behavior

On startup, when `LocalAuthEnabled` is true and `LOCAL_ADMIN_PASSWORD` is set:

1. VMO Manager checks if any local users exist.
2. If none exist, it creates the Day 0 admin with the configured username and password.
3. The seeded admin has `MustChangePassword: true`.
4. The `local-auth` feature flag is enabled.

If local users already exist, `SeedLocalAdmin` does nothing. The configured password is not used to update existing users.

## Password Management

### Must-Change-Password on First Login

The Day 0 admin (and any admin-created local user) is created with `MustChangePassword: true`. On first login:

1. User logs in with username and password.
2. The login response includes `mustChangePassword: true`.
3. The UI prompts the user to change password.
4. User submits current and new password via `POST /api/v1/local-auth/change-password`.
5. After a successful change, `MustChangePassword` is cleared.

Until the password is changed, the user may be restricted from certain actions (depending on UI implementation).

### Admin Password Reset

Admins with `vmo:local-users:write` can reset another local user's password:

1. Go to **Settings > Local Users**.
2. Select the user and choose **Reset Password**.
3. Enter the new password (minimum 8 characters).
4. The user can log in with the new password. `MustChangePassword` can be set to require a change on next login.

### User-Initiated Password Change

Logged-in local users can change their own password:

1. Use the **Change Password** flow (e.g. in user menu or profile).
2. Provide current password and new password.
3. New password must be at least 8 characters.

## Local Users Page

**Settings > Local Users** (requires `local-auth` feature flag and `vmo:local-users:read`):

- **List** — View all local users.
- **Create** — Add a new local user (username, password). New users have `MustChangePassword: true`.
- **Reset password** — Admin resets a user's password.
- **Delete** — Remove a local user. You cannot delete your own account.

Local users are stored as CRDs with companion Secrets for password hashes.

> **Tip:** Local auth is intended for Day 0 bootstrap. Configure Keycloak for production use and migrate to OIDC when possible.
