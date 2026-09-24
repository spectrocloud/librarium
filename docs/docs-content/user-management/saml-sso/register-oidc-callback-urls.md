---
sidebar_label: "Register OIDC Callback URLs"
title: "Register OIDC Callback URLs"
description:
  "Learn how to register the callback URLs that Palette accepts when it acts as an OIDC identity provider for your
  applications."
icon: ""
hide_table_of_contents: false
sidebar_position: 150
tags: ["user-management", "saml-sso", "oidc", "sso", "security"]
---

Palette can act as an OpenID Connect (OIDC) identity provider (IdP) for applications that run outside Palette, such as
the Virtual Machine Orchestrator (VMO) dashboard, [Headlamp](../../clusters/cluster-management/headlamp.md), and
`kubectl oidc-login`. When one of these applications starts a login, it gives Palette a callback URL, and Palette
returns the authentication token to that address.

Palette validates that callback URL on every authentication request and rejects any address that it does not allow. If
Palette does not allow an address by default, a tenant admin must register it before logins from that application
succeed.

## Callback URL Rules

A callback URL must be an absolute HTTP or HTTPS address with a host name, and cannot carry user information or a
fragment. Palette enforces these rules when you register an address and again when an application presents one at login,
whether or not enforcement is on.

Palette accepts two kinds of addresses in a request without prior registration.

- Your Palette domain and its subdomains, over HTTPS.

- An address on the local machine, such as `localhost`, `127.0.0.1`, or `::1`, over HTTP or HTTPS, on any port. This
  covers `kubectl oidc-login` on a workstation.

Every other address must be registered. A registered entry can use HTTP or HTTPS, and Palette matches it against the
complete address, including the path and any query string. Palette converts the scheme and host to lowercase before
matching, and treats the default port for the scheme as equivalent to no port, so
`https://vmo.example.com:443/auth/callback` and `https://vmo.example.com/auth/callback` are the same entry. Any other
port must match exactly.

### Wildcards

When you turn on **Allow wildcards**, an entry can use a wildcard in the host, in the path, or in both.

| **Entry**                              | **What It Matches**                                                                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `https://*.helix.example.com/callback` | Any subdomain of `helix.example.com` at any depth, at that exact path. The address `https://helix.example.com/callback` does not match. |
| `https://vmo.example.com/v1/*`         | Every path under `/v1/` on that host, and `/v1` itself.                                                                                 |
| `https://*.helix.example.com/v1/*`     | Both of the above combined.                                                                                                             |

The wildcard must replace the entire first part of the host name, and at least two more parts must follow it. For
example, `https://*.example.com` is accepted, but `https://*.com` and `https://vmo-*.example.com` are not. You cannot
use a wildcard with an IP address. While **Allow wildcards** is off, Palette rejects a wildcard entry when you save it
rather than storing it and ignoring it.

## Enforcement

**Enforce allowlist** is on by default. When you turn it off, Palette accepts any callback URL that passes the
structural checks, including an address that an attacker controls.

:::warning

Turn off **Enforce allowlist** only while you troubleshoot a login failure, and turn it back on afterward. While it is
off, a single request from a bad actor can deliver a signed-in user's token to an address outside your organization.

:::

## Addresses That Palette Registers for You

If your installation already had Virtual Machine Orchestrator or VM Migration Assistant clusters before upgrade, the
list already contains their console addresses. Palette registered each one as a wildcard covering every path under it,
so those logins continue to work, and turned on **Enforce allowlist** and **Allow wildcards**. Leave the entries in
place. Palette registers these addresses only once. Register the address of any cluster that you create afterward, and
whenever a cluster's console address changes.

A new installation starts with an empty list.

## Prerequisites

- Access to Palette with the [Tenant Admin](../palette-rbac/tenant-scope-roles-permissions.md#admin) role.

- The callback URL of each application that signs in through Palette. Refer to the application's documentation if you
  are not sure what it uses.

## Register a Callback URL

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings** > **SSO**.

3. Select the **Callback URLs** tab.

4. Confirm that **Enforce allowlist** is on.

5. _(Wildcard entries only)_ Turn on **Allow wildcards**. This switch is available only while **Enforce allowlist** is
   on.

6. In the **Enter callback URL** field, enter the address to register, and then select **Add URL**. The address appears
   in the **Allowed callback URLs** table.

   ```text hideClipboard title="Example entry"
   https://vmo.example.com/auth/callback
   ```

7. Repeat step 6 for each address that you want to register.

8. Select **Save**.

## Validate

1. Confirm that each address appears in the **Allowed callback URLs** table.

2. Sign in to the application that uses the address. The login completes instead of failing with an authorization error.

## Troubleshooting

### Scenario - Login Fails with a Redirect Address Error

A login fails and Palette displays the following message.

```text hideClipboard
The redirect address used by this login attempt is not allowed for this organization. Contact your administrator to
register it.
```

The application sent a callback URL that is not registered. Palette does not include the rejected address in the
message, because the address can carry credentials.

Register the exact address that the application uses, including its path. Because Palette matches the whole address, an
entry that omits the path does not cover a login that includes one. If you cannot determine the address, check the
application's OIDC configuration for its redirect URI.

### Scenario - Login Fails with an Organization Mismatch Error

A login fails and Palette displays the following message.

```text hideClipboard
This login attempt was started for a different organization. Please sign in again to continue.
```

The login was started for one organization while the browser held a session for another. Sign out, then sign in again
from the application that you want to use. Registering a callback URL does not change this result.

## Next Steps

Review the addresses that your Virtual Machine Orchestrator clusters use, and register any that Palette did not register
for you. Refer to
[Configure Direct Access to Virtual Machine Dashboard](../../vm-management/vmo-pack/configure-console-base-address.md)
for where that address is set.
