---
sidebar_label: "Add an External Identity Provider"
title: "Add an External Identity Provider"
description:
  "Step-by-step guidance for platform administrators on how to let people sign in to a PaletteAI Inference Launchpad
  appliance through an external identity provider, such as Okta or Auth0, and give their groups workspace access."
hide_table_of_contents: false
sidebar_position: 2.845
tags: ["paletteai-inference-launchpad", "access", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "identity provider",
    "federated sign-in",
    "single sign-on",
    "keycloak",
    "openid connect",
    "saml",
    "okta",
    "auth0",
  ]
---

This guide explains how to let people sign in to a PaletteAI Inference Launchpad appliance through your identity
provider, such as Okta or Auth0. You add the provider in Keycloak, the open source sign-in service that ships with the
appliance. Then you give the provider's groups access to a workspace. For the console labels and rules, refer to
[Identity Providers](../reference/access-and-policy-reference.md#identity-providers).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- The **Local Admin Username** and **Local Admin Password** that were set when the appliance was installed. For details,
  refer to [Local admin](../reference/profile-variables.md#local-admin).

- An application for the appliance at the external identity provider. For an OpenID Connect provider, the application's
  client ID and client secret. For the steps, refer to your provider's documentation.

  - For Okta with OpenID Connect, a **Web Application**. Refer to
    [Create OpenID Connect app integrations](https://help.okta.com/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm).

  - For Auth0, a **Regular Web Application**. Refer to
    [Register Regular Web Applications](https://auth0.com/docs/get-started/auth0-overview/create-applications/regular-web-apps).

- The provider's discovery endpoint, or its authorization, token, user info, and JSON Web Key Set (JWKS) URLs. For a
  Security Assertion Markup Language (SAML) 2.0 provider, the provider's single sign-on service URL instead.

- A groups claim at the provider that carries each person's groups, such as `groups`. For a SAML 2.0 provider, a group
  attribute statement named `groups` instead.

  - For Okta with OpenID Connect, a groups claim named `groups`, with the filter **Matches regex** and the value `.*`.
    Refer to
    [Customize tokens returned from Okta with a groups claim](https://developer.okta.com/docs/guides/customize-tokens-groups-claim/main/).

  - For Okta with SAML 2.0, a group attribute statement named `groups`, with a regular expression filter. Refer to
    [Define group attribute statements](https://help.okta.com/en-us/content/topics/apps/define-group-attribute-statements.htm).

  - For Auth0, a post-login Action that puts the person's roles in a namespaced claim, such as
    `https://inference-launchpad/groups`. Refer to
    [Add user roles to tokens](https://auth0.com/docs/manage-users/access-control/sample-use-cases-actions-with-authorization).

## Add the Provider in Keycloak

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **External access**, select **Identity Providers**.

3. Select **Open Keycloak**. The Keycloak sign-in page opens.

4. Sign in with the **Local Admin Username** and **Local Admin Password**. Keycloak opens **Identity providers** in the
   `ai` realm.

5. Select the provider type. If the page already lists providers, select the type from the **Add provider** drop-down
   menu.

   - To add an OpenID Connect provider, select **OpenID Connect v1.0**.

   - To add a SAML 2.0 provider, select **SAML v2.0**.

6. Enter an **Alias**, such as `okta`, and a **Display name** for the sign-in button, such as `Okta`.

7. Enter the provider's connection details.

   - For an OpenID Connect provider, enter the provider's discovery endpoint. If the provider has none, turn off **Use
     discovery endpoint**. Enter its authorization, token, user info, and JWKS URLs instead. Then enter the **Client
     ID** and the **Client Secret** from the provider's application.

   - For a SAML 2.0 provider, set the **Service provider entity ID** to `https://<appliance-address>/iam/realms/ai`.
     Replace `<appliance-address>` with the address of your appliance. Turn off **Use entity descriptor**. Then enter
     the provider's single sign-on service URL.

8. Copy the **Redirect URI** that Keycloak shows. At the provider, register it as the application's callback address.

9. Select **Add**. The provider's settings page opens.

10. In **Advanced settings**, turn on **Trust Email**. Leave **Sync mode** set to **Import**.

11. _(OpenID Connect providers only)_ Open **Advanced**, and set **Scopes** to `openid email profile`. For Okta, set
    **Scopes** to `openid email profile groups`.

12. Select **Save**.

## Map the Provider's Groups

1. On the provider's page in Keycloak, select **Mappers** > **Add mapper**.

2. Enter a **Name**, such as `groups`, and set **Mapper type** to **Attribute Importer**.

3. Enter the name of the field that holds the groups.

   - For an OpenID Connect provider, set **Claim** to the provider's groups claim, such as `groups`. For Auth0, set
     **Claim** to the namespaced claim from the post-login Action.

   - For a SAML 2.0 provider, set **Attribute Name** to `groups`.

4. Set **User Attribute Name** to `idp_groups`, and **Sync mode override** to **Force**.

5. Select **Save**. Keycloak confirms that the mapper was created.

## Give the Provider's Groups Access

1. In the console, add a group with the exact name that the provider sends, such as `platform-team`. For Auth0, use the
   role name. For the steps, refer to [Add a Group](./manage-groups.md#add-a-group).

2. Add the group as a member of each workspace that its people need, and give it a role. For the steps, refer to
   [Manage Workspace Members](./manage-workspace-members.md).

## Validate

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **External access**, select **Identity Providers**.

3. Confirm that the provider is in the list, that **Groups Mapper** is **Mapped**, and that **State** is **Enabled**.

4. Sign out of the console.

5. On the sign-in page, under **Or sign in with**, select the provider's button. Sign in with a provider account that is
   in the group, such as `platform-team`.

6. Confirm that the console opens in the group's workspace.

   If the console shows `You do not have access yet. Ask your administrator to add you to a workspace.` instead, check
   that a group on the appliance has the exact name that the provider sends, and that the group is a member of a
   workspace. For the steps, refer to [Give the Provider's Groups Access](#give-the-providers-groups-access).

7. Sign out, and then sign in again as a platform administrator.

8. From the left main menu, select **Users**.

9. On the **Users** tab, confirm that the **Signs in with** column names the provider for the person who signed in.

## Next Steps

- [Manage Users](./manage-users.md) to maintain the people who sign in through the provider.

- [Manage Workspace Members](./manage-workspace-members.md) to change a group's role in a workspace.

- [Access Management Reference](../reference/access-and-policy-reference.md#identity-providers) describes the **Identity
  Providers** section and provider sign-in.
