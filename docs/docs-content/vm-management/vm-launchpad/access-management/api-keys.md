---
sidebar_label: "API Keys"
title: "API Keys"
description: "Learn how to create, use, and revoke API keys in PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 6
tags: ["vmo", "vm launchpad", "access management", "api keys"]
---

API keys are tokens that PaletteAI VM Launchpad issues for programmatic access to the platform API. They are
self-service: every authenticated user creates, lists, and revokes their own keys from the **User Menu**, and each key
inherits its creator's effective VMO permissions live on every request.

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account that can sign in to the VM Launchpad UI. Managing your own API keys does not require any specific
  permission.

## What an API Key Is

An API key is an opaque token minted by VM Launchpad and stored securely in the cluster. VM Launchpad persists only a
salted hash of the secret half of the key, never the plain text. When a caller authenticates with an API key, the
platform resolves permissions live from the creator's identity record on every request, so:

- If the creator's VMO role or namespace scope changes, the effective permissions of every API key they own change after
  a short cache delay.

- If the creator's identity provider group membership changes, the creator must sign in to the UI once for the new
  groups to propagate to their API keys. API key traffic alone does not refresh the group set.

- API keys cannot manage other API keys. Requests authenticated with an API key are rejected if they attempt to create
  or revoke keys through the API. Key lifecycle changes must originate from an interactive UI session.

:::info

VM Launchpad API keys are not Keycloak refresh tokens. They work with an external identity provider or with local
authentication, and they can be sent directly as a Bearer token without any prior token exchange.

:::

## API Keys Page

Manage API keys from the **User Menu**, not the Access Management sidebar.

1. Select your user identifier in the top right of the header, such as `admin@vmo.local`, to open the **User Menu**.

2. Select **My API Keys**. The **My API Keys** page opens at `/me/api-keys` and lists the keys you have created.

The **My API Keys** table lists your keys with the following columns.

| **Column**    | **Description**                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------- |
| **Label**     | The human-readable name you gave the key at creation.                                               |
| **Created**   | The date the key was created.                                                                       |
| **Expires**   | The date the key expires.                                                                           |
| **Last Used** | The most recent date and time the key was used to authenticate a request, or _never_ if never used. |
| **Suffix**    | The last four characters of the secret half of the token. Safe to log or share.                     |
| **Status**    | Whether the key is **Active**, **Expired**, or **Revoked**.                                         |

The full token is only shown once, at creation.

:::info

Every user sees only their own keys on this page. Platform Admins do not have a UI to view or revoke keys created by
other users; cluster-wide governance is done through VMO role assignments on the [Users](./users.md) and
[Groups](./groups.md) pages. A direct API path is available for cluster-wide administration; refer to
[Cluster-Wide Administration](#cluster-wide-administration).

:::

## Create an API Key

1. Open the **User Menu** and select **My API Keys**.

2. Select **Create API Key**.

3. Complete the following fields.

   | **Field**             | **Description**                                                                 |
   | --------------------- | ------------------------------------------------------------------------------- |
   | **Label**             | A short human-readable name for the key. Appears in the key list and audit log. |
   | **Expires in (days)** | The number of days until the key expires. Minimum 1 day. Maximum 90 days.       |

4. Select **Create**. The **API Key Created** dialog opens and displays the full token, along with its label, key ID,
   and expiration date and time.

5. Select **Copy token** to copy the token, or **Download as .txt** to save it as a text file. Store it somewhere secure
   such as a password manager or a CI secrets store.

6. Select **Done** to close the dialog.

:::warning

VM Launchpad cannot show the token again after you close the **API Key Created** dialog. If you lose the token, revoke
the key and create a new one.

:::

Each API key inherits your effective VMO permissions live. There is no role picker on this form. If you hold the
**Viewer** role, keys you create can only read; if you hold **Platform Admin**, keys you create can do anything.

### Token Format

An API key is a 62-character string with three segments separated by underscores.

```text
vmok_a3k9pqr2x7m4_NjQwMjU2OTQyZTYxNjE5MjVkOWI1MjkyZjE4Y2RmZjA=
```

| **Segment** | **Description**                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| `vmok_`     | Literal prefix. Lets the authentication middleware route the token without contacting the identity provider. |
| `keyID`     | 12-character public identifier. Appears in audit logs and the key list. Safe to log or share.                |
| `secret`    | 44-character secret half. Shown once at creation. VM Launchpad stores a salted PBKDF2 hash of this segment.  |

## Use an API Key

Send the key as a standard `Authorization: Bearer` header on any VM Launchpad API request.

```bash
curl --header "Authorization: Bearer <your_api_key>" \
     https://<vmo-url>/api/v1/vms
```

Every VM Launchpad API endpoint accepts API keys through this header. Because the middleware matches on the `vmok_`
prefix, API keys keep working even when the identity provider is unreachable or not configured.

## Revoke an API Key

1. Open the **User Menu** and select **My API Keys**.

2. In the row for the key you want to revoke, select the trash icon at the end of the row. The **Revoke API Key** dialog
   opens.

3. Select **Revoke** to confirm.

Revocation is immediate on the replica that processes it. In a highly available deployment, other replicas observe the
revocation after their internal API key cache expires, typically within about 30 seconds. Requests made with the revoked
key return `401 Unauthorized` once every replica has caught up.

:::info

Revoking a key does not delete or disable the user who created it. To remove a user's access entirely, delete the user
or clear the **Enabled** checkbox on the [Users](./users.md) page, and revoke any keys they created.

:::

## Permission Staleness

VM Launchpad refreshes an API key creator's identity record only when the creator signs in interactively or refreshes
their UI session. API key traffic does not refresh it. This has two consequences when a highly privileged user issues
API keys.

- If the creator's identity provider group membership changes but the creator never signs in to VM Launchpad again,
  every API key they own keeps authenticating with the group set from their last interactive login. Revoke the key or
  evict the creator's identity record to break this loop.

- If the creator's VMO role or namespace scope changes on the [Users](./users.md) or [Groups](./groups.md) pages, their
  API keys observe the new permissions after a short cache delay, within about 90 seconds.

## Cluster-Wide Administration

The **My API Keys** page is self-service, so administrators do not manage other users' keys from the UI. The following
table describes the two direct API paths available for callers holding the appropriate permissions.

| **Permission**       | **Allows**                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `vmo:api-keys:read`  | List every API key in the cluster through `GET /api/v1/api-keys` (without the `?scope=self` query parameter). |
| `vmo:api-keys:write` | Revoke any API key in the cluster through `DELETE /api/v1/api-keys?id=<keyID>`.                               |

Only the built-in **Platform Admin** role holds these permissions by default. The VM Launchpad UI does not present
either endpoint, so the cluster-wide list and revoke paths are only used by direct API callers such as `kubectl` or CI
tooling.

## Rate Limits

VM Launchpad applies the following rate limits to protect the platform.

| **Scope**                            | **Threshold** | **Window** | **Response**                                         |
| ------------------------------------ | ------------- | ---------- | ---------------------------------------------------- |
| Failed authentication per source IP  | 10 attempts   | 1 minute   | `429 Too Many Requests` with a `Retry-After` header. |
| Failed authentication per key ID     | 5 attempts    | 1 minute   | `429 Too Many Requests` with a `Retry-After` header. |
| Active self-service keys per creator | 25 keys       | -          | `429 Too Many Requests` on create.                   |

VM Launchpad does not rate limit successful authentication. Revoke unused keys to free quota against the per-creator
cap.

## Security

- **Hashed at rest.** VM Launchpad stores only a salted PBKDF2-HMAC-SHA-256 hash of each key's secret half, plus the
  last four characters of the secret for display in the key list. The plain text never leaves the response that created
  the key.

- **Identity-bound.** Every key is tied to its creator's identity and resolves permissions live from that identity
  record on every request. A leaked key cannot escalate beyond whatever its creator currently holds.

- **Self-replication guard.** API-key-authenticated sessions cannot create or revoke API keys. Key lifecycle changes
  must come from an interactive UI session.

- **Reaper for expired keys.** A background reaper deletes keys whose expiry date is more than 30 days in the past. This
  window lets you investigate a key's history before the record disappears.

- **Audit trail.** VM Launchpad attributes key creation and revocation to the human operator who performed them, and
  attributes API-key-authenticated requests to `apikey/<keyID>` so audit consumers can distinguish service traffic from
  interactive user traffic.

## Next Steps

- Review the roles that determine what your API keys can do. Refer to [VMO Roles](./vmo-roles.md).

- Check who has access to what across the cluster. Refer to [Access Mapping](./access-mapping.md).
