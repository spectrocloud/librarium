---
sidebar_label: "API Key"
title: "API Key"
description: "Learn about API Key authentication methods in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management", "authentication", "api-key"]
---

Palette API keys can be used to authenticate requests to the Palette REST API calls. You can use the API key to make
REST API calls without providing your username and password. If you are a tenant admin, you can create API keys for
yourself or other users.

Tenant administrators have additional permissions and capabilities to manage API keys. Tenant admins can create, edit,
revoke, and delete API keys for any user within the tenant. Each of these actions is described in detail in the
following resources.

## Permissions

API keys are associated with the user who creates them. The permissions associated with the API key are the same as
those of the user who created the key. If the user has the necessary permissions to perform an action, then the user's
API key can be used to perform the same action programmatically.

The API key permissions automatically reflect any changes to the user's permissions. If the user belongs to an OIDC/SAML
group, any changes to the external user's group membership are reflected the next time the user logs in.

## Limitations

Palette API keys that belong to Palette users removed from the organization through OIDC/SAML are not automatically
removed. We recommend that you remove these keys to ensure that they are no longer used. You can programmatically remove
the API keys using the REST API or the Palette SDK. Check out the [Delete API Key](./delete-api-key.md) page for more
information on how to delete an API key programmatically.

:::tip

Tenant administrators can view all API keys created for the tenant. Users are limited to actions for their own API keys.
To learn more about the API key management tasks you can perform as a tenant administrator, refer to the
[Tenant API Key Management](../../../tenant-settings/api-key-management.md) page.

:::

## Best Practices

The following are best practices we recommend for managing Palette API keys:

- Set an expiration date for API keys to ensure that they are not used indefinitely. Preferably, set the expiration date
  to a short duration, such as 30 days, and renew the key as needed.

- Store API keys securely. Do not expose API keys in public repositories or share them with unauthorized users. Use
  secure storage mechanisms, such as a password manager, to store API keys.

- Regularly review and audit API keys to ensure that they are still required. Remove any API keys that are no longer
  needed.

## Resources

- [Create API Key](create-api-key.md)

- [Edit API Key](modify-api-key.md)

- [Revoke API Key](revoke-api-key.md)

- [Delete API Key](delete-api-key.md)
