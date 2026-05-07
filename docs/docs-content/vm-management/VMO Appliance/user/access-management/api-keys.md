# API Keys

API keys are first-party opaque tokens issued by VMO Manager for programmatic
access. They are independent of any user's interactive login session, but their
effective permissions are now bound to the **creator's identity** rather than to
a fixed role chosen at creation time.

## What API keys are

VMO Manager mints API keys directly. They are not Keycloak refresh tokens and
do not require Keycloak to be configured. Each key is stored as a cluster-scoped
`VmoApiKey` CRD; only a salted scrypt hash of the secret half is persisted,
never the plaintext.

Each key records the `Sub` (subject) of the user who created it. Authentication
with an API key resolves to a flat service principal (`apikey:<keyID>`) for
audit attribution, but the permissions used to authorize each request come from
the creator's `KnownUser` record (subjects + groups) at the moment the request
arrives. Lifecycle events (create, revoke) are attributed to the human operator
who initiated them; runtime requests authenticated by the key are attributed to
the key itself in the audit log.

## What an API key can do

An API key inherits the **creator's permissions live, on every request** -- it
does not snapshot a role at creation time. The auth path looks up the creator's
`KnownUser` CRD record by `Sub` and resolves permissions through the same
identity-based path as an interactive OIDC session (`subjects + groups` →
permissions).

> **Permissions are inherited from the creator's most recent OIDC login.**
> A user's groups and claims are written to their `KnownUser` CRD when they
> log in (or refresh tokens) interactively. API keys read from this record on
> every request, so if your IdP group membership changes, the new groups take
> effect on your keys only after **you log in again** through the UI -- the
> CRD record itself is not refreshed by API key traffic. Revoking and
> re-issuing the key has the same effect, but is not required.

Practical consequences:

- If the creator's roles or VMO-side access policies change, the effective
  permissions of every API key they own change at the next request (after the
  cache TTL -- see [Revocation propagation](#revocation-propagation)).
- If the creator's IdP **group membership** changes, the creator must log in
  to the UI (or refresh their session) before the new groups propagate to the
  `KnownUser` CRD. Until then, existing keys keep using the groups from the
  creator's previous login.
- If you cannot wait for the creator's next login -- e.g. you removed them
  from a privileged group and need that to take effect immediately -- have
  the user revoke the key from their **My API Keys** page (or, for a
  cluster-wide kill-switch as an administrator, use the direct API:
  `DELETE /api/v1/api-keys?id=<keyID>` with `vmo:api-keys:write`).
- If the creator's `KnownUser` record is deleted, all of their keys fail
  authentication closed.

API keys cannot manage other API keys: requests authenticated by an API key are
rejected with 403 if they attempt to call `POST` or `DELETE` on
`/api/v1/api-keys` or `/api/v1/me/api-keys`. This prevents key self-replication
if a token is leaked.

### OIDC users with no `KnownUser` record

If your account has never logged in interactively, you have no `KnownUser`
record yet. API keys created before your first interactive login will fail
authentication with `401`. Log in once via the UI, then create or recreate
keys.

### Local recovery admin keys

Keys created by the local recovery admin (creator `Sub` starting with
`local:*`) always inherit full admin permissions because the recovery account
is the break-glass administrator and bypasses identity-based permission
resolution. Use sparingly and rotate frequently.

### Permission staleness

VMO Manager only refreshes a user's `KnownUser` CRD when the user logs in
interactively (or refreshes their OIDC session through the UI). API key
traffic does **not** trigger a refresh. This has one consequence worth
internalising before granting cluster-admin powers via API keys:

> If an administrator is removed from `cluster-admins` (or any privileged
> group) in the IdP **but never logs in to the VMO UI again**, every API key
> they own will continue to authenticate with the privileged groups recorded
> at their last interactive login -- indefinitely. The 60-second
> `KnownUser` cache TTL is irrelevant here: the upstream record itself is
> stale, not the cache.

The mitigation is to treat the API key surface as governance, not as a
fire-and-forget cache:

- **Revoke the key**: have the owning user revoke it from **My API Keys**
  in the user-menu, or use the direct API for a cluster-wide kill-switch
  (`DELETE /api/v1/api-keys?id=<keyID>` with `vmo:api-keys:write`). Hard
  delete of the underlying CRD; no IdP round-trip required. This is the
  preferred response when an individual user's privileges change.
- **Delete the `KnownUser` record** (`kubectl delete vmoknownuser ku-<email>`
  or via the IAM admin tooling). Every API key created by that subject fails
  authentication and stays failed until the user logs in again with the new
  groups. Use this as the cluster-wide kill-switch when you need to evict a
  former operator's keys without revoking them individually.

  > **Up to 60-second propagation delay.** Each VMO replica caches successful
  > `KnownUser` lookups for 60 seconds to keep the auth path off a full
  > `ListKnownUsers` scan on every Bearer request. After deleting the
  > `KnownUser` CRD, the deleted user's keys may continue to authenticate
  > on a given replica for up to 60 seconds (until that replica's cache
  > entry expires). For an immediate hard-stop, **revoke the underlying
  > `VmoApiKey` CRDs as well** — the revoke path explicitly invalidates
  > the API-key cache entry on the responding replica, and other replicas
  > will see the revocation within `apiKeyLookupCacheTTL` (30 s).

Deleting the `KnownUser` record is the closest VMO Manager has to "log this
user out everywhere": active interactive sessions also lose authorization at
the next request because IAM resolves through the same record.

## Token format

```
vmok_a3k9pqr2x7m4_NjQwMjU2OTQyZTYxNjE5MjVkOWI1MjkyZjE4Y2RmZjA=
└──┘ └──────────┘ └──────────────────────────────────────────┘
prefix    keyID                       secret
```

| Segment | Length | Notes |
|---------|--------|-------|
| `vmok_` | 5 chars | Literal prefix; lets the auth middleware route the token without OIDC verification. |
| `keyID` | 12 chars | Lowercase base32. Doubles as the `VmoApiKey` CRD `metadata.name`. Safe to log. |
| `secret` | 44 chars | Standard base64 (`A-Z`, `a-z`, `0-9`, `+`, `/`) with one trailing `=` pad. 128 bits of entropy. Hashed with PBKDF2-HMAC-SHA-256 (NIST SP 800-132, the approved password-based KDF) before storage. |

The complete token is 62 characters. The `keyID` is what appears in audit logs
and in the API Keys list view; the full token is shown exactly once at
creation and cannot be retrieved again.

## Where to manage keys

API keys are **self-service**: every authenticated user manages their own
keys via the user-menu dropdown in the top-right of the header. There is
no admin-wide UI surface — Platform Admin governance happens through VMO
roles, not through cross-user key visibility.

Open the **user-menu dropdown** and select **API Keys**, or navigate to
`/me/api-keys`. From this page you can:

- View the keys you have created.
- Create a new key (label, optional expiry).
- Revoke any of your own keys.

Self-service requires no special permission -- every authenticated user may
create and manage their own keys. The keys inherit your current permissions
live, so a Viewer can only mint keys that act as a Viewer; a Platform Admin
can mint keys that act as Platform Admin. **The VMO role assigned to the
user is what controls what their keys can do** — administrators do not need
visibility into other users' keys to govern the cluster, only the right
role assignments.

> **Direct API access for kubectl/CI.** A caller holding `vmo:api-keys:read`
> can still list every key in the cluster via `GET /api/v1/api-keys`
> (without `?scope=self`), and `vmo:api-keys:write` lets them revoke any
> key. Both permissions remain available for power users and CI tooling
> but are no longer surfaced anywhere in the UI. By default only the
> built-in Platform Admin role holds them.

## Creating an API key

1. Open the **user-menu dropdown** in the header and click **API Keys**.
2. Click **Create API Key**.
3. Fill the form:
   - **Label** -- a short human-readable name (max 64 characters). Used for
     identification in the list view and audit log.
   - **Expires in (days)** -- optional. Leave blank for a key that never
     expires. Expired keys are removed by the reaper 30 days after expiry.
4. Submit. A reveal modal shows the full `vmok_...` token. Use **Copy** to
   place it on the clipboard or **Download** to save it as a `.txt` file.
   Once you close the modal, VMO Manager cannot show the token again.

There is no role picker. The key always inherits the creator's identity-based
permissions live.

## Using an API key

Send the token as a standard `Authorization: Bearer` header:

```bash
curl -H "Authorization: Bearer vmok_a3k9pqr2x7m4_b8h2nv5fz9wt6yqe4cju3rks7xpdmgbc" \
     https://<vmo-url>/api/v1/vms
```

Every protected API endpoint accepts API keys via this header. The auth
middleware short-circuits OIDC verification when the token starts with
`vmok_`, so opaque API keys work even when the OIDC provider is unreachable
or not configured at all.

What the key can do is whatever the creator's roles allow at the moment of the
request:

- A key created by a user holding only **Viewer** can list VMs but cannot
  create or modify them.
- A key created by a user holding **Operator** can read VMs, start/stop/migrate
  them, and manage snapshots.
- A key created by a user holding **Platform Admin** can do anything.
- A key created by the local recovery admin can do anything.

If the creator is later granted or revoked permissions, existing keys reflect
the change after the cache TTL.

## Listing and revoking

In **My API Keys** (`/me/api-keys`), every authenticated user sees only
their own keys. The page sends `?scope=self` on every request, so even an
admin holding `vmo:api-keys:read` does not accidentally see cluster-wide
keys when viewing their personal page.

To revoke a key:

1. Right-click the row (or open the action menu in the rightmost column).
2. Select **Revoke**.
3. Confirm.

Revocation is a hard delete of the underlying `VmoApiKey` CRD. The next
authentication attempt with that token returns 401. Owners always revoke
their own keys via the UI; cluster-wide revocation is available to callers
holding `vmo:api-keys:write` through the direct API
(`DELETE /api/v1/api-keys?id=<keyID>`).

### Revocation propagation

Revocation and permission changes propagate asynchronously due to caching:

| Change | Worst-case propagation | Why |
|--------|-----------------------|-----|
| Local revocation on the same replica | Immediate | Revoke explicitly invalidates the cache entry. |
| Revocation on a different replica (HA) | ~30 seconds | API key lookup cache TTL on the other replica must expire before the revoked record is re-read from the CRD. |
| Creator's VMO role / access policy change | ~90 seconds | API key lookup cache (~30s) plus IAM resolver cache (~60s) before the new permission set is observed. |
| Creator's IdP **group** membership change | Until the creator's next interactive login | Group memberships are sourced from the creator's `KnownUser` record; that record is only updated when the creator logs in or refreshes their session interactively. API key traffic does not refresh it. |

The creator's `KnownUser` identity is itself cached at the auth layer for
~60 seconds per replica, so even after a fresh login expect up to one minute
of additional propagation delay across replicas. Caches are per-replica; in
HA deployments, each replica refreshes independently within these windows.

## Security

- **Hashed at rest.** The CRD stores only `spec.secretHash` (the
  apikeygen-formatted PBKDF2-HMAC-SHA-256 output -- literal `{hash}` prefix
  followed by URL-safe base64 of the 32-byte derived key, salted with a
  deployment-stable secret derived from `SESSION_KEY`) plus the last four
  characters of the secret for UI display. Raw SHA-256 of a secret is not
  an approved password-hashing KDF; the package now uses PBKDF2 from NIST
  SP 800-132 (the FIPS-approved password-based KDF) so the construction
  satisfies FIPS 140-3 deployments. The plaintext token never leaves the
  response that minted it.
- **Identity-bound.** Each key carries the creator's `Sub`. Authorization
  resolves through the creator's `KnownUser` record on every request -- there
  is no decoupled role to drift away from the creator's actual access.
- **Fail-closed when identity is missing.** OIDC creators with no `KnownUser`
  record (never logged in interactively) fail authentication with `401`.
- **Rate-limited failed authentication.** Failed Bearer-token attempts are
  counted per source IP and per key ID. When the threshold is exceeded the
  next failed attempt returns `429 Too Many Requests` with a `Retry-After`
  header. Successful authentication does not reset the counter.
- **Reaper for stale keys.** A background reaper running on the leader
  replica deletes keys whose `expiresAt` is more than 30 days in the past.
  This forensic window lets you investigate a key's history before the CRD
  disappears.
- **Self-replication guard.** API-key-authenticated sessions cannot create
  or revoke API keys.

## Rate limits

| Scope | Threshold | Window | Response |
|-------|-----------|--------|----------|
| Failed auth per source IP | 10 attempts | 1 minute | `429` with `Retry-After` |
| Failed auth per key ID | 5 attempts | 1 minute | `429` with `Retry-After` |
| Self-service active keys per creator | 25 keys | -- | `429` on create |

Auth-failure counters are kept in memory per replica. Successful authentication
is not rate-limited. The per-creator cap protects the cluster-wide list and
etcd from runaway self-service traffic; revoke unused keys to free quota.
Callers with `vmo:api-keys:write` are exempt from the cap because that
permission already implies admin-style governance.

## Audit trail

| Event | Actor | Resource |
|-------|-------|----------|
| Key creation | Human operator (`Sub`) | `apikey/<keyID>` |
| Key revocation | Human operator (`Sub`) | `apikey/<keyID>` |
| Authenticated request | `apikey/<keyID>` | The resource being accessed |
| API-key-principal attempting key lifecycle | `apikey/<keyID>` | `apikey/` |

Every authentication that succeeds with an API key is logged with the
`apikey/<keyID>` actor so audit-trail consumers can distinguish service
traffic from interactive user traffic.

## Differences from the previous behavior

| Aspect | Previous behavior | Current behavior |
|--------|-------------------|------------------|
| Token type | Keycloak offline refresh token | First-party opaque token (`vmok_...`) |
| Use as Bearer | Required token exchange to obtain access JWT | Sent directly as `Authorization: Bearer` |
| Permission source | Role chosen at creation time (`roleRef` on the CRD) | Creator's identity-based permissions, resolved live on every request |
| Identity | Inherited the creator's OIDC identity | Flat audit principal (`apikey:<keyID>`); permissions resolved via the creator's `KnownUser` record |
| Keycloak | Required | Optional -- works with OIDC disabled |
| Storage | Plaintext refresh token + Keycloak offline session | Salted PBKDF2-HMAC-SHA-256 hash (NIST SP 800-132) in `VmoApiKey` CRD (`spec.secretHash`, `{hash}<base64>`) |
| Permission domain | Reused `vmo:iam:write` | Dedicated `vmo:api-keys:read/write` |
| Management surface | Single admin tab | Self-service in the user-menu only (**My API Keys**, route `/me/api-keys`); cluster-wide listing remains available via direct API for kubectl/CI |

## Permissions reference

| Permission | Allows |
|------------|--------|
| `vmo:api-keys:write` | Revoke any key in the cluster via direct API (`DELETE /api/v1/api-keys?id=<keyID>`). Not used by the UI. |
| `vmo:api-keys:read` | List every key in the cluster via direct API (`GET /api/v1/api-keys` without `?scope=self`). Not used by the UI. |
| (none) | List, create, and revoke your own keys via **My API Keys** (the user-menu dropdown, `/me/api-keys`). |

Only Platform Admin holds `vmo:api-keys:read` and `vmo:api-keys:write` in
the built-in role set; the UI does not surface those permissions, so the
cluster-wide listing/revoke paths are available only to callers using
direct API (e.g. kubectl/CI tooling). If you need a custom role to
manage API keys cluster-wide for a service principal, add
`vmo:api-keys:read` and/or `vmo:api-keys:write` to it in
**Settings > Access Management > VMO Roles**. Self-service key management
in the UI requires no special permission.

## See also

- [IAM Roles & Permissions](iam-roles.md) -- how roles are defined and assigned.
- [Auth Flow Overview](auth-flow.md) -- how interactive sessions and Bearer
  tokens flow through the auth middleware.
- [Audit Log](../system/audit.md) -- where API key lifecycle and request events
  are recorded.
