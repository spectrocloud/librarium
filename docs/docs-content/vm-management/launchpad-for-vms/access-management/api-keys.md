---
sidebar_label: "API Keys"
title: "API Keys"
description: "Learn how to create, use, and revoke API keys in Launchpad for VMs."
icon: " "
hide_table_of_contents: false
sidebar_position: 6
tags: ["vmo", "vm launchpad", "access management", "api keys"]
---

API keys are first-party opaque tokens that Launchpad for VMs issues for programmatic access to the platform API.
They are self-service: every authenticated user creates, lists, and revokes their own keys from the user menu, and
each key inherits its creator's effective VMO permissions live on every request.

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](../install-vmla-iso.md) for
  guidance.

- An account that can sign in to the Launchpad UI. Managing your own API keys does not require any specific
  permission.

## What an API Key Is

An API key is an opaque token minted by Launchpad for VMs and stored securely in the cluster. Launchpad persists only
a salted hash of the secret half of the key, never the plain text. When a caller authenticates with an API key, the
platform resolves permissions live from the creator's identity record on every request, so:

- If the creator's VMO role or namespace scope changes, the effective permissions of every API key they own change
  after a short cache delay.

- If the creator's identity provider group membership changes, the creator must sign in to the UI once for the new
  groups to propagate to their API keys. API key traffic alone does not refresh the group set.

- API keys cannot manage other API keys. Requests authenticated with an API key are rejected if they attempt to
  create or revoke keys through the API. Key lifecycle changes must originate from an interactive UI session.

:::info

Launchpad for VMs API keys are not Keycloak refresh tokens. They work with an external identity provider or with
local authentication, and they can be sent directly as a Bearer token without any prior token exchange.

:::

## API Keys Page

Manage API keys from the user menu, not the Access Management sidebar.

1. Select your user avatar in the top right of the header to open the user menu.

2. Select **API Keys**. The **My API Keys** page opens at `/me/api-keys` and lists the keys you have created.

The **My API Keys** table lists your keys with their label, key ID, creation date, expiry, and last four characters
of the secret. The full token is only shown once, at creation.

:::info

Every user sees only their own keys on this page. Platform Admins do not have a UI to view or revoke keys created by
other users; cluster-wide governance is done through VMO role assignments on the [Users](./users.md) and
[Groups](./groups.md) pages. A direct API path is available for cluster-wide administration; refer to
[Cluster-Wide Administration](#cluster-wide-administration).

:::

## Create an API Key

1. Open the user menu and select **API Keys**.

2. Select **Create API Key**.

3. Complete the following fields.

   | **Field**             | **Description**                                                                                             |
   | --------------------- | ----------------------------------------------------------------------------------------------------------- |
   | **Label**             | A short human-readable name for the key. Up to 64 characters. Appears in the key list and audit log.        |
   | **Expires in (days)** | _(Optional)_ The number of days until the key expires. Leave blank to create a key that never expires.      |

4. Select **Create**. Launchpad displays the full token in a reveal modal.

5. Copy the token with **Copy**, or download it as a text file with **Download**. Store it somewhere secure such as a
   password manager or a CI secrets store.

6. Close the modal.

:::warning

Launchpad for VMs cannot show the token again after you close the reveal modal. If you lose the token, revoke the
key and create a new one.

:::

Each API key inherits your effective VMO permissions live. There is no role picker on this form. If you hold the
**Viewer** role, keys you mint can only read; if you hold **Platform Admin**, keys you mint can do anything.

### Token Format

An API key is a 62-character string with three segments separated by underscores.

```text
vmok_a3k9pqr2x7m4_NjQwMjU2OTQyZTYxNjE5MjVkOWI1MjkyZjE4Y2RmZjA=
```

| **Segment** | **Description**                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `vmok_`     | Literal prefix. Lets the authentication middleware route the token without contacting the identity provider.        |
| `keyID`     | 12-character public identifier. Appears in audit logs and the key list. Safe to log or share.                       |
| `secret`    | 44-character secret half. Shown once at creation. Launchpad stores a salted PBKDF2 hash of this segment.            |

## Use an API Key

Send the key as a standard `Authorization: Bearer` header on any Launchpad API request.

```bash
curl --header "Authorization: Bearer vmok_a3k9pqr2x7m4_NjQwMjU2OTQyZTYxNjE5MjVkOWI1MjkyZjE4Y2RmZjA=" \
     https://<vmo-url>/api/v1/vms
```

Every Launchpad API endpoint accepts API keys through this header. Because the middleware matches on the `vmok_`
prefix, API keys keep working even when the identity provider is unreachable or not configured.

## Revoke an API Key

1. Open the user menu and select **API Keys**.

2. Select the row for the key you want to revoke, or open its context menu, and select **Revoke**.

3. Confirm the revocation.

Revocation is immediate on the replica that processes it. In a highly available deployment, other replicas observe
the revocation after their internal API key cache expires, typically within about 30 seconds. Requests made with the
revoked key return `401 Unauthorized` once every replica has caught up.

:::info

Revoking a key does not delete or disable the user who created it. To remove a user's access entirely, delete
the user or clear the **Enabled** checkbox on the [Users](./users.md) page, and revoke any keys they created.

:::

## Permission Staleness

Launchpad for VMs refreshes an API key creator's identity record only when the creator signs in interactively or
refreshes their UI session. API key traffic does not refresh it. This has two consequences worth understanding
before you give a highly privileged user long-lived API keys.

- If the creator's identity provider group membership changes but the creator never signs in to Launchpad again,
  every API key they own keeps authenticating with the group set from their last interactive login. Revoke the key
  or evict the creator's identity record to break this loop.

- If the creator's VMO role or namespace scope changes on the [Users](./users.md) or [Groups](./groups.md) pages,
  their API keys observe the new permissions after a short cache delay, typically within about 90 seconds.

## Cluster-Wide Administration

The **My API Keys** page is self-service, so administrators do not manage other users' keys from the UI. The
following table describes the two direct API paths available for callers holding the appropriate permissions.

| **Permission**         | **Allows**                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vmo:api-keys:read`    | List every API key in the cluster through `GET /api/v1/api-keys` (without the `?scope=self` query parameter).                                                    |
| `vmo:api-keys:write`   | Revoke any API key in the cluster through `DELETE /api/v1/api-keys?id=<keyID>`.                                                                                  |

Only the built-in **Platform Admin** role holds these permissions by default. The Launchpad UI does not surface
either endpoint, so the cluster-wide list and revoke paths are only used by direct API callers such as `kubectl` or
CI tooling.

## Rate Limits

Launchpad for VMs applies the following rate limits to protect the platform.

| **Scope**                            | **Threshold** | **Window** | **Response**                                         |
| ------------------------------------ | ------------- | ---------- | ---------------------------------------------------- |
| Failed authentication per source IP  | 10 attempts   | 1 minute   | `429 Too Many Requests` with a `Retry-After` header. |
| Failed authentication per key ID     | 5 attempts    | 1 minute   | `429 Too Many Requests` with a `Retry-After` header. |
| Active self-service keys per creator | 25 keys       | -          | `429 Too Many Requests` on create.                   |

Launchpad does not rate limit successful authentication. Revoke unused keys to free quota against the per-creator
cap.

## Security

- **Hashed at rest.** Launchpad stores only a salted PBKDF2-HMAC-SHA-256 hash of each key's secret half, plus the
  last four characters of the secret for display in the key list. The plain text never leaves the response that
  created the key.

- **Identity-bound.** Every key is tied to its creator's identity and resolves permissions live from that identity
  record on every request. A leaked key cannot escalate beyond whatever its creator currently holds.

- **Self-replication guard.** API-key-authenticated sessions cannot create or revoke API keys. Key lifecycle changes
  must come from an interactive UI session.

- **Reaper for expired keys.** A background reaper deletes keys whose expiry date is more than 30 days in the past.
  This window lets you investigate a key's history before the record disappears.

- **Audit trail.** Launchpad attributes key creation and revocation to the human operator who performed them, and
  attributes API-key-authenticated requests to `apikey/<keyID>` so audit consumers can distinguish service traffic
  from interactive user traffic.

## Next Steps

- Review the roles that determine what your API keys can do. Refer to [VMO Roles](./vmo-roles.md).

- Check who has access to what across the cluster. Refer to [Access Mapping](./access-mapping.md).
