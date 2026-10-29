---
sidebar_label: "Passkey Enforcement"
title: "Passkey Enforcement"
description: "Require users who sign in to your Palette tenant with a password to also verify a passkey."
icon: ""
hide_table_of_contents: false
sidebar_position: 45
tags: ["tenant-administration", "security", "authentication", "passkeys"]
---

Tenant administrators can require every user who signs in to the tenant with an email address and password to also
verify a passkey. A passkey is a second authentication factor that uses the
[WebAuthn](https://www.w3.org/TR/webauthn-2/) standard. Users create passkeys with an authenticator, such as a hardware
security key, a platform authenticator, or a password manager. When you turn on passkey enforcement, users without a
passkey must add one, and they get a grace period in which to do so. Users who have a passkey verify it after the
password each time they sign in, whether or not the tenant enforces passkeys.

Users add and delete their own passkeys. Refer to [Manage Passkeys](../user-management/authentication/passkeys.md) for
the user procedures.

## How Passkey Enforcement Works

Passkey enforcement applies to every user in the tenant who signs in with an email address and password, including
tenant administrators. The following table describes what happens when one of these users signs in while enforcement is
on.

| **User State**                        | **Sign-In Behavior**                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Has a passkey                         | Palette prompts for the passkey after the password. The user must verify it to sign in.                |
| No passkey, grace period not yet over | Palette prompts the user to add a passkey. The user can skip the prompt until their grace period ends. |
| No passkey, grace period over         | The user must add a passkey before Palette completes the sign-in.                                      |

Enforcement also behaves in the following ways.

- Each user's grace period starts on the date you turned on enforcement or the date the user account was created,
  whichever is later. A user added after you turn on enforcement gets the full grace period. During the grace period,
  users can find its end date on their **My Profile** > **Security** tab.

- Changing the grace period restarts it for every user from the date of the change, including users whose grace period
  had already ended.

- A passkey belongs to the user, not to the tenant. A user who belongs to more than one tenant uses the same passkeys in
  each one. After a user adds a passkey, Palette asks for it each time the user signs in with a password to any tenant
  they belong to, including tenants that do not enforce passkeys. Enforcement determines only whether users without a
  passkey must add one.

- If a user already verified a passkey in their current session, Palette does not prompt them again when they switch to
  another tenant.

- While any tenant a user belongs to enforces passkeys, that user cannot delete their last passkey. If none of the
  user's tenants enforces passkeys, the user can delete all their passkeys and sign in with a password only.

Passkey enforcement does not apply to the following authentication methods.

- Signing in through Single Sign-On (SSO). Your identity provider handles multi-factor authentication for these users.

- Authenticating API requests with an [API key](../user-management/authentication/api-key/api-key.md).

- Signing in with `kubectl` to a cluster whose Kubernetes layer uses **Palette** as the OpenID Connect (OIDC) identity
  provider. These sign-ins use the password only.

:::danger

Tenant administrators cannot reset another user's passkeys. A user who loses all their passkeys cannot sign in with a
password to any tenant they belong to, including tenants that do not enforce passkeys. We recommend that every user,
including tenant administrators, add at least two passkeys. Contact the support team to discuss recovery options.

:::

## Prerequisites

- Palette tenant admin access.

- At least one passkey added to your own user account, because enforcement also applies to tenant administrators. We
  recommend that you add two. Refer to [Add a Passkey](../user-management/authentication/passkeys.md#add-a-passkey).

## Enable Passkey Enforcement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. On the **Tenant Settings** menu, select **Passkeys**.

4. Turn on **Enable passkey enforcement**.

5. In **Grace period**, enter the number of days users have to add a passkey. Enter a value from 0 to 365. The default
   is 14 days.

   :::warning

   A grace period of 0 days requires every user without a passkey to add one the next time they sign in.

   :::

6. Select **Save**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) with the email address and password of a tenant user who has
   not added a passkey.

2. After you enter the password, verify that Palette prompts you to add a passkey. While the grace period is not yet
   over, the prompt displays a **Skip** button.

3. Select **Skip**.

4. From the **User Menu**, select **My Profile**, and then select the **Security** tab.

5. Verify that the tab displays the date by which you must add a passkey.

## Change the Grace Period

You can change the grace period only while passkey enforcement is on. Saving a new value restarts the grace period for
every user in the tenant from the date of the change.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. On the **Tenant Settings** menu, select **Passkeys**.

4. In **Grace period**, enter the new number of days.

5. Select **Save**.

## Disable Passkey Enforcement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. On the **Tenant Settings** menu, select **Passkeys**.

4. Turn off **Enable passkey enforcement**. Palette saves the change immediately.

After you disable enforcement, users no longer need a passkey to sign in to this tenant. Users keep the passkeys they
added, and Palette continues to ask users who have a passkey to verify it when they sign in.
