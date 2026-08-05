---
sidebar_label: "LDAP Federation"
title: "Federate LDAP Users with Keycloak"
description:
  "Learn how to satisfy the OIDC email claim requirement when you federate LDAP users into PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad", "access management"]
---

PaletteAI VM Launchpad uses Keycloak as its OIDC identity provider. If your organization already maintains user accounts
in an LDAP directory, you can federate those accounts into Keycloak instead of creating them individually on the
[Users](./users.md) page.

Federated LDAP users must present an email address before VM Launchpad can identify them and assign VMO roles. Many LDAP
directories do not populate an email attribute for every account. This page explains the requirement and how to satisfy
it with a Keycloak attribute mapper.

## Email Claim Requirement

The Kubernetes API server in a VM Launchpad cluster runs with `--oidc-username-claim=email`. Every token the API server
accepts must therefore contain both of the following claims.

| **Claim**        | **Required Value**                           | **Purpose**                                                         |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| `email`          | A valid email address, such as `user@domain` | Identifies the user to the Kubernetes API server.                   |
| `email_verified` | `true`                                       | Confirms the address is trusted. Unverified addresses are rejected. |

This is a hard requirement, not a recommendation. When a federated LDAP user has no email address, the Kubernetes API
server cannot determine a username for the account, and the following behavior occurs.

- The user authenticates successfully against Keycloak but has no effective permissions in VM Launchpad.

- VMO role assignment fails, because the ClusterRoleBindings and RoleBindings that VM Launchpad creates have no subject
  to bind to.

- Requests to the Kubernetes API are rejected as unauthenticated.

Creating the user manually on the **Users** page does not resolve the problem for a federated account. The address must
arrive in the token that Keycloak issues, which means it must come from the LDAP directory or from a Keycloak mapper.

:::info

VM Launchpad requires the **Email** field when you create a user directly on the **Users** page for this same reason.
Refer to [Create Users](./users.md#create-users).

:::

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

- Access to the Keycloak admin console for your appliance, along with the Keycloak administrator credentials you set
  during cluster deployment. Refer to the **Keycloak Admin** section in
  [Install VM Launchpad](../install.md#create-cluster).

- An LDAP user federation provider already configured in Keycloak. VM Launchpad does not configure LDAP federation for
  you. Refer to the Keycloak [LDAP user federation](https://www.keycloak.org/docs/latest/server_admin/index.html#_ldap)
  documentation for setup guidance.

- An LDAP attribute on each account that holds an email-formatted value. `userPrincipalName` is a common choice in
  Active Directory environments, because it stores values in `user@domain` form.

## Map an Email Attribute from LDAP

Keycloak creates a default `email` mapper when you add an LDAP provider. That mapper reads the LDAP `mail` attribute.
Point it at an attribute your directory actually populates.

1. Log in to the Keycloak admin console as an administrator.

2. Select your realm from the realm drop-down menu.

3. From the left main menu, select **User federation**, and then select your LDAP provider.

4. Select the **Mappers** tab.

5. Select the `email` mapper. If your provider has no `email` mapper, select **Add mapper** and set **Mapper type** to
   `user-attribute-ldap-mapper`.

6. Complete the following fields.

   | **Field**                       | **Value**                                                                                             |
   | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
   | **User Model Attribute**        | `email`                                                                                               |
   | **LDAP Attribute**              | The attribute that holds an email-formatted value, such as `userPrincipalName`.                       |
   | **Read Only**                   | Enable, unless you intend to write email changes back to the directory.                               |
   | **Always Read Value From LDAP** | Enable, so that Keycloak refreshes the value from the directory on every sync.                        |
   | **Is Mandatory in LDAP**        | Enable, so that accounts missing the attribute fail the sync instead of importing without an address. |

7. Select **Save**.

:::warning

Do not create a second mapper that also writes to the `email` user model attribute. Two mappers targeting the same
attribute produce unpredictable results. Edit the existing `email` mapper instead.

:::

## Trust Email Addresses from LDAP

The mapper populates the `email` claim, but the token still needs `email_verified: true`. Keycloak marks a federated
address as verified only when the LDAP provider is configured to trust it.

1. In the Keycloak admin console, select **User federation**, and then select your LDAP provider.

2. Expand the **Advanced settings** section.

3. Enable **Trust Email**.

4. Select **Save**.

With **Trust Email** enabled, Keycloak accepts the address supplied by the directory without sending a verification
email, and includes `email_verified: true` in the tokens it issues.

## Synchronize LDAP Users

Existing users that Keycloak imported before you made these changes keep their original attributes. Run a new
synchronization so the mapper applies to them.

1. In the Keycloak admin console, select **User federation**, and then select your LDAP provider.

2. From the **Action** drop-down menu, select **Sync all users**.

3. Wait for the synchronization to complete. Keycloak reports the number of accounts added and updated.

:::warning

Users who are already signed in continue to hold their previous token until it expires. That token does not carry the
new `email` claim. Ask affected users to sign out and sign in again to receive an updated token. API keys created before
the change also keep the old claims until the user signs in again.

:::

## Verify

1. In the Keycloak admin console, select **Users** from the left main menu, and then select a federated account. Confirm
   that the **Email** field is populated and that **Email verified** is enabled.

2. Log in to VM Launchpad.

3. From the left main menu, select **Settings** > **Access Management** > **Users**.

4. Confirm that the federated account appears in the table and that the **Email** column shows an address.

5. Assign a VMO role and namespace scope to the account. Refer to [Edit a User](./users.md#edit-a-user), or add the
   account to a group that already carries a role. Refer to [Groups](./groups.md).

6. Ask the user to sign in and confirm that the resources their role grants are available.

If the account still has no email address after a synchronization, the LDAP attribute you mapped is not populated for
that account. Refer to
[Troubleshooting VM Launchpad](../troubleshooting.md#scenario---federated-ldap-users-cannot-access-vm-launchpad).

## Next Steps

- Group federated users together and manage their VMO role and Kubernetes access in one place. Refer to
  [Groups](./groups.md).

- Review how VM Launchpad combines role grants from users and groups. Refer to
  [How Effective Permissions Are Calculated](./users.md#how-effective-permissions-are-calculated).
