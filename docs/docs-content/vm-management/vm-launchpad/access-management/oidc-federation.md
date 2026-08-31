---
sidebar_label: "OIDC Federation"
title: "Federate an External Identity Provider with Keycloak"
description:
  "Learn how to federate an external OIDC identity provider, such as Okta, into PaletteAI VM Launchpad through Keycloak."
icon: " "
hide_table_of_contents: false
sidebar_position: 8
tags: ["vmo", "vm launchpad", "access management", "oidc", "okta"]
---

PaletteAI VM Launchpad uses [Keycloak](https://www.keycloak.org/documentation) as its OIDC identity provider. If your
organization authenticates users through an external identity provider, you can federate that provider into Keycloak
instead of creating accounts individually on the [Users](./users.md) page. Keycloak calls this pattern
[identity brokering](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_broker). Users sign in
against your provider, and Keycloak issues the token that VM Launchpad and the Kubernetes API server consume.

This page uses [Okta](https://www.okta.com) as the example provider. The same steps apply to any OIDC-compliant
provider, though field names in the provider's administration console vary.

Federating a provider is not sufficient on its own. A brokered account must satisfy two separate requirements before it
can use VM Launchpad, and each one fails in a way that looks like a permissions problem rather than a configuration
problem. Review both before you begin.

## Federation Requirements

| **Requirement**  | **Why It Is Needed**                                                                              | **How It Is Satisfied**                             |
| ---------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Email claim      | The Kubernetes API server identifies users by email address.                                      | Trust the email address on the identity provider.   |
| Group membership | VM Launchpad resolves VMO roles from Keycloak group membership, not from claims inside the token. | Map the provider's groups claim to Keycloak groups. |

### Email Claim Requirement

The Kubernetes API server in a VM Launchpad cluster runs with `--oidc-username-claim=email`. Every token the API server
accepts must contain both of the following claims.

| **Claim**        | **Required Value**                           | **Purpose**                                                         |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| `email`          | A valid email address, such as `user@domain` | Identifies the user to the Kubernetes API server.                   |
| `email_verified` | `true`                                       | Confirms the address is trusted. Unverified addresses are rejected. |

This requirement is identical to the one that applies to federated LDAP accounts. Refer to
[Email Claim Requirement](./ldap-federation.md#email-claim-requirement) for the full explanation of how VM Launchpad
behaves when the claim is absent.

### Group Membership Requirement

VM Launchpad reads a user's groups from Keycloak through the Keycloak Admin API. It does not read a groups claim out of
the token. A brokered user who signs in successfully is therefore a member of no Keycloak group until a mapper places
them in one, and a user in no group carries no VMO role.

The symptom is a user who authenticates without error, reaches VM Launchpad, and finds that no resources are available
to them. Refer to [Map Provider Groups to Keycloak Groups](#map-provider-groups-to-keycloak-groups) to configure the
mapper that resolves this.

:::info

You can also assign a VMO role to a brokered user directly on the [Users](./users.md) page after their first sign-in,
without configuring a group mapper. Group mapping is the maintainable approach when you manage access for more than a
handful of users, because it keeps the source of truth in your identity provider.

:::

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

- Access to the Keycloak admin console for your appliance. The console is available at `https://<platform-ip>/iam`,
  where `<platform-ip>` is the platform IP address you assigned during cluster creation. Sign in with the Keycloak
  administrator credentials you set in the **Keycloak Admin** section of
  [Install VM Launchpad](../install.md#create-cluster).

- Administrator access to the external identity provider, with permission to create an OIDC application and to configure
  the claims that the application emits.

- The Keycloak groups that carry your VMO roles already exist. Refer to [Groups](./groups.md) to create them.

## Collect the Keycloak Redirect URI

The identity provider needs the exact URI that Keycloak listens on for the brokered response. Keycloak generates this
value and displays it when you add the provider.

1. Log in to the Keycloak admin console as an administrator.

2. From the left main menu, select **Manage realms**. In the realm list, select the `vmo` realm. The admin console opens
   in a different realm by default, so confirm that `vmo` shows as the current realm before you continue.

   ![The Keycloak admin console Manage realms page. The Manage realms item in the left main menu is highlighted, and an arrow points to the vmo realm row in the list, which is labeled Current realm.](/vm-management_vm-launchpad_access-management_oidc-federation_keycloak-manage-realms.webp)

3. From the left main menu, select **Identity providers**.

4. Select **OpenID Connect v1.0**.

5. In the **Redirect URI** field at the top of the form, copy the displayed value. It follows this pattern.

   ```text
   https://<platform-ip>/iam/realms/vmo/broker/<alias>/endpoint
   ```

   The `<alias>` segment reflects the **Alias** field, which appears below the URI on the same form. Set the alias
   before you copy the URI, because changing the alias later changes the redirect URI and breaks the provider
   configuration.

   ![The Keycloak Add OpenID Connect provider form. The Redirect URI field at the top and the Alias field directly below it are highlighted; the URI ends in the alias value.](/vm-management_vm-launchpad_access-management_oidc-federation_keycloak-redirect-uri.webp)

Leave this page open. You return to it after you create the application in your identity provider.

## Create the OIDC Application

Create an application in your identity provider that Keycloak authenticates against. In Okta, go to **Applications** >
**Applications** > **Create App Integration** and select **OIDC - OpenID Connect** with an application type of **Web
Application**.

Configure the application as follows.

| **Setting**                | **Value**                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **Grant type**             | Enable **Authorization Code**. Enable **Refresh Token** to avoid repeated sign-in prompts.     |
| **Sign-in redirect URIs**  | The Keycloak redirect URI you collected in the previous section. The value must match exactly. |
| **Sign-out redirect URIs** | _(Optional)_ Set only if you configure a logout URL on the Keycloak identity provider.         |
| **Assignments**            | Assign the users and groups that need VM Launchpad access.                                     |

Record the **Client ID** and **Client Secret**. Keycloak requires both.

### Configure the Groups Claim

Keycloak cannot map groups that the provider does not send. In Okta, open the application, select the **Sign On** tab,
and edit the **OpenID Connect ID Token** section.

| **Field**             | **Value**                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Groups claim type** | `Filter`                                                                                 |
| **Groups claim name** | `groups`                                                                                 |
| **Filter**            | `Matches regex` with a pattern covering the groups you grant access to, such as `vmo-.*` |

:::warning

Okta applies a limit to the number of groups in a claim, which defaults to 100. A broad filter combined with a user who
belongs to many groups can produce a truncated claim, which silently omits the group that carries the user's VMO role.
Keep the filter narrow enough that the groups you use for access are always present.

:::

## Add the Identity Provider in Keycloak

Return to the Keycloak admin console, on the **OpenID Connect v1.0** form you opened earlier.

1. Complete the following fields.

   | **Field**              | **Value**                                                                                                                                                                    |
   | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Alias**              | A short identifier for the provider, such as `okta`. This value appears in the redirect URI.                                                                                 |
   | **Display name**       | A human-readable label for the provider in Keycloak, such as `Okta`.                                                                                                         |
   | **Discovery endpoint** | Your provider's OIDC discovery document, such as `https://<your-okta-domain>/.well-known/openid-configuration`. Keycloak populates the authorization and token URLs from it. |
   | **Client ID**          | The client ID from the application you created.                                                                                                                              |
   | **Client Secret**      | The client secret from the application you created.                                                                                                                          |

2. Select **Add**.

3. On the provider's settings page, in the **OpenID Connect settings** section, expand **Advanced**.

4. Set **Scopes** to `openid profile email groups` so that the provider returns the groups claim alongside the identity
   claims.

5. Select **Save**.

Refer to
[OpenID Connect v1.0 identity providers](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_broker_oidc)
in the Keycloak documentation for the full field reference.

## Trust Email Addresses from the Provider

Keycloak marks a brokered address as verified only when the identity provider is configured to trust it. **Trust Email**
is a setting on the identity provider, and it defaults to **Off**. Without it, tokens carry `email_verified: false` and
the Kubernetes API server rejects the user.

1. In the Keycloak admin console, select **Identity providers** from the left main menu, and then select your provider.

2. Scroll to the **Advanced settings** section.

3. Set **Trust Email** to **On**.

4. Select **Save**.

:::tip

Enable **Trust Email** before the first user signs in. Keycloak sets the verified flag when it creates the local account
during the initial brokered sign-in, so accounts created before you enable the setting keep `email_verified: false`, and
you must correct each one individually on the **Users** page.

:::

## Map Provider Groups to Keycloak Groups

This mapper is what places a brokered user into a Keycloak group, which is what gives them a VMO role. Create one mapper
for each group you federate. Refer to
[Mapping claims and assertions](https://www.keycloak.org/docs/latest/server_admin/index.html#_mappers) in the Keycloak
documentation for the full list of mapper types and the sync-mode semantics.

1. In the Keycloak admin console, select **Identity providers**, and then select your provider.

2. Select the **Mappers** tab, and then select **Add mapper**.

3. Complete the following fields.

   | **Field**              | **Value**                                                                                                                                                      |
   | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**               | A descriptive name for the mapping, such as `okta-vmo-admins`.                                                                                                 |
   | **Sync mode override** | **Force**, so that Keycloak reapplies the mapping on every sign-in and reflects group changes made in the provider.                                            |
   | **Mapper type**        | **Advanced Claim to Group**.                                                                                                                                   |
   | **Claims**             | Select **Add Claims** to expose the Key and Value inputs, then set Key to `groups` and Value to the group name as the provider emits it, such as `vmo-admins`. |
   | **Regex Claim Values** | Leave **Off**. The example claim value is a literal string, not a regex pattern.                                                                               |
   | **Group**              | The Keycloak group that carries the VMO role you want the user to receive.                                                                                     |

4. Select **Save**. Reload the **Mappers** tab and confirm the new mapper appears in the list before you initiate a
   federated sign-in. Keycloak returns the success toast before the mapping is fully applied, and a user who signs in
   during that window lands with no VMO role and sees a "not allowed" error.

5. Repeat for each provider group you federate.

:::warning

Set **Sync mode override** to **Force**. With the default sync mode, Keycloak applies the mapping only when it first
creates the account, so a user removed from a group in your identity provider retains their VM Launchpad access
indefinitely.

:::

### Refresh Existing Sessions

Users who are already signed in continue to hold their previous token until it expires, and that token does not reflect
the new mapping. Ask affected users to sign out and sign in again. API keys created before the change also keep the old
permissions until the user signs in again. Refer to [API Keys](./api-keys.md).

## Verify

### Verify the Keycloak configuration

1. In the Keycloak admin console for the `vmo` realm, select **Identity providers** from the left main menu, and confirm
   that the provider you configured appears in the list.

2. Select the provider. On the **Settings** tab, in the **OpenID Connect settings** section, expand **Advanced** and
   confirm that **Scopes** is set to `openid profile email groups`.

3. Scroll to the **Advanced settings** section and confirm that **Trust Email** is set to **On**.

4. Select the **Mappers** tab and confirm that a mapper exists for each provider group you federate. Confirm that each
   mapper uses the **Advanced Claim to Group** mapper type with **Sync mode override** set to **Force** and that its
   **Claims** and **Group** values match the provider group and the target Keycloak group.

### Verify a federated user's account

Complete these steps after a federated user has completed their first brokered sign-in.

1. In the Keycloak admin console, select **Users** from the left main menu, and then select the account. Confirm that
   the **Email** field is populated and that **Email verified** is enabled.

2. Select the **Groups** tab for that account, and confirm that the mapped Keycloak group is listed.

3. Log in to VM Launchpad and go to **Settings** > **Access Management** > **Access Mapping**. Confirm that the account
   resolves to the VMO role and namespace scope you expect. Refer to [Access Mapping](./access-mapping.md).

4. Ask the user to confirm that the resources their role grants are available.

If the account appears in Keycloak with no group, the claim that the provider sent does not match the **Claims** value
on the mapper. Compare the group name in the provider against the mapper configuration, including case.

## Next Steps

- Review the VMO roles you can assign to federated groups. Refer to [VMO Roles](./vmo-roles.md).

- Manage the role and namespace scope for each federated group in one place. Refer to [Groups](./groups.md).

- Review how VM Launchpad combines role grants from users and groups. Refer to
  [How Effective Permissions Are Calculated](./users.md#how-effective-permissions-are-calculated).
