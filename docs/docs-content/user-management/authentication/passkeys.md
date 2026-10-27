---
sidebar_label: "Passkeys"
title: "Manage Passkeys"
description:
  "Add and delete the passkeys you verify after your password when you sign in to a Palette tenant that enforces
  passkeys."
icon: ""
hide_table_of_contents: false
sidebar_position: 25
tags: ["user-management", "authentication", "security", "passkeys"]
---

A passkey is a second authentication factor that you verify after your password when you sign in to Palette. Palette
supports passkeys that use the [WebAuthn](https://www.w3.org/TR/webauthn-2/) standard, such as a hardware security key,
a platform authenticator like Touch ID or Windows Hello, or a password manager.

Palette asks for a passkey only when you sign in with an email address and password to a tenant that enforces passkeys.
Tenant admins turn on enforcement for the tenant. Refer to [Passkey Enforcement](../../tenant-settings/passkeys.md) for
more information. If you sign in through SSO, your identity provider handles multi-factor authentication instead.

Your passkeys belong to your user account, not to a tenant. If you belong to more than one tenant, you use the same
passkeys in each one.

:::danger

We recommend that you add at least two passkeys, in case you lose access to one. If you lose all your passkeys, you
cannot sign in to a tenant that enforces passkeys, and tenant admins cannot reset your passkeys. Contact the support
team to discuss recovery options.

:::

## Prerequisites

- A Palette user account that signs in with an email address and password.

- An authenticator that supports WebAuthn, such as a hardware security key, a platform authenticator, or a password
  manager. We recommend that you use a hardware security key, such as a YubiKey, to create passkeys that meet the
  standards and regulations of your organization.

- If you use self-hosted Palette or Palette VerteX with a self-signed certificate, or a certificate signed by a
  certificate authority (CA) that your browser does not trust, you may need to add the certificate to your operating
  system's trust store before you can add passkeys. Refer to the documentation of your operating system for guidance.

## Add a Passkey

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **My Profile**.

3. Select the **Security** tab.

4. Select **Add passkey**.

5. In the **Add a Passkey** dialog box, enter a name for the passkey in **Passkey nickname**. The nickname must be 3 to
   16 characters long and can contain letters, numbers, and spaces.

6. Select **Add Passkey**.

7. Follow the prompts from your browser to create the passkey with your authenticator. Depending on the authenticator,
   you may need to enter a PIN or scan your fingerprint.

The passkey appears in the list of passkeys on the **Security** tab.

### Validate

Palette asks for your passkey only in a tenant that enforces passkeys, so use such a tenant to validate.

1. Log out of Palette.

2. Log in to a tenant that enforces passkeys.

3. After you enter your password, select the passkey you added, and verify it with your authenticator.

A successful sign in confirms that the passkey works.

## Delete a Passkey

While any tenant you belong to enforces passkeys, you cannot delete your last passkey. Add another passkey before you
delete it.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **My Profile**.

3. Select the **Security** tab.

4. Select the trash can icon next to the passkey you want to delete.

5. In the confirmation dialog box, select **Delete**.

### Validate

1. From the **User Menu**, select **My Profile**.

2. Select the **Security** tab.

3. Verify that the deleted passkey is no longer listed.

## Next Steps

To learn how Palette prompts for your passkey, or for a new one, when you sign in, refer to
[Passkey Verification](./ui-autentication.md#passkey-verification). To authenticate API requests in a tenant that
enforces passkeys, refer to
[Authorization Tokens and Passkeys](./authorization-token.md#authorization-tokens-and-passkeys).
