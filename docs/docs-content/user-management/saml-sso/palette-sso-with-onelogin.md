---
sidebar_label: "Palette SSO with OneLogin"
title: "Enable SSO with OneLogin"
description: "Set up Palette SSO with OneLogin."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "onelogin"]
---

OneLogin is a cloud-based Identity and Access Management (IAM) provider that designs and develops enterprise-level identity management solutions. It is an Identity Provider (IdP) tool designed to secure, manage, and facilitate user access across multiple networks, applications, and devices. OneLogin's platform offers a variety of features, including Single Sign-On (SSO), Multi-Factor Authentication (MFA), user provisioning, compliance reporting, and end-user self-service.

You can integrate OneLogin with Palette to enable SSO for your users. This integration allows you to use OneLogin as a third-party IdP to authenticate users in Palette. This integration also allows you to use the same OneLogin application for OIDC-based SSO in your Kubernetes cluster.

## Prerequisites

- An active OneLogin subscription and administrator-level permissions. If you are using this for testing purposes, OneLogin provides a [developer subscription](https://developers.onelogin.com/).

- For OIDC-based SSO in your Kubernetes cluster, you will need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to retrieve access tokens for your cluster.

## Setup

Use the following steps to configure OneLogin as a third-party IdP in Palette.

### Create a OneLogin Application

1. Log in to your [OneLogin account](https://www.onelogin.com/) with administrative credentials.

2. Navigate to the **Applications** section of your OneLogin admin dashboard and click on the **Add App** button to create a new application.

3. In the search bar, type "OpenID Connect" to find the generic OIDC app connector.

![Search for OpenID Connect](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_search-oidc.png)

4. Select the **OpenID Connect** app connector to add it to your account.

5. Next, you will be taken to the application configuration page, where you can provide a **Display Name**. Use the display name **Spectro Cloud Palette OIDC** and click **Save**. OpenLog displays the configuration screen for your new application.

![Enter Display Name](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_oidc-app-name.png)

6. Select the **Configuration** tab and fill out the following input values.

| **Field**                 | **Description**                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Login URL                 | The URL where users are sent to log in.                                                                           |
| Redirect URIs             | The Uniform Resource Identifiers (URIs) to which OneLogin will redirect the user after successful authentication. |
| Post Logout Redirect URIs | The URIs where you will be redirected after successfully logging out of the current session.                      |

7. The URLs needed to configure OneLogin can be found in your Palette account. From the left **Main Menu** click on **Tenant Admin**. Next, select **Tenant Settings** to access the settings page. From the settings page, select **SSO** and click on the **OIDC** tab. Copy the **Callback URL** value to your clipboard.

![Copy Callback URL](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_callbackurl.png)

8. Paste the Palette **Callback URL** value in the **Login Url** and **Redirect URI's** sections.

![Add Login URL and Redirect URL](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_login-redirect-uris.png)

9. Next, do the same for the **Logout Redirect URIs** and copy the **Logout URL** value located below the **Callback URL** from Palette.

![Add Logout URL](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_logout-uri.png)

10. Your configuration should look similar to the following screenshot.

![URI config](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_uri-config.png)

11. Select the **Parameters** tab and click on the **Groups** field. Ensure the bottom configuration contains the **MemberOf** value so that the correct group value is passed.

![Check MemberOf field](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_group-field.png)

12. Navigate to the left **Main Menu** and select **SSO**. From the SSO settings page, copy the **Client ID**, **Client Secret**, and **Issuer URL** values. These values are important credentials that Palette will use to authenticate with OneLogin. Make sure to save them securely. Click **Save** to save all changes.

![ClientID & Client Secret](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_clientid-clientsecret.png)

### Create Role, Security Policy, and Group

13. Go to your OneLogin dashboard and select **Users**. Next, click on **Roles** to access the Role page and select **New Role**. Create an **Admin** role and select your **Role App**. The **Spectro Cloud Palette OIDC** app is used in this example. When selecting the app, a green check will appear next to the name. Click **Save**.

![Add Role](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_app-role.png)

14. You can create an optional security policy. To create a security policy, navigate to **Security** and select **Policies**.

15. Click **New User Policy**. Provide a policy name, such as "Admin policy", and configure the policy to meet your requirements. Click **Save** to continue.

16. Apply the policy to a user group that you create. To create a user group, navigate to the left **Main Menu**, select **Users**, and then select **Groups**.

17. Click **New Group** and assign a group name.

18. Select your security policy and click **Save**.

![Add Security Policy](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_group-sec-policy.png)

19. Automate the mapping of a user to a role and group by creating a _Mapping_. Navigate to **Users**, followed by **Mappings** and select **New Mapping**.

20. Assign the mapping a name and set it to map every member of the Administrators group. Set the **MemberOf** value to **Administrators**.

:::caution
Setting the **MemberOf** value to **Administrators** is essential so the response from OneLogin contains the group name, which you will match with a Team in Palette. If you do not explicitly set the **MemberOf** value, Palette will not receive the group name. As a result, Palette will not be able to set the correct RBAC settings for your user.
:::

![Add Mapping](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_mapping-role-group.png)

21. Navigate to the **Users** screen and select your user.

22. Select the **Authentication** tab and select the group and security policy you created earlier. Click on **Save**.

![Add User to Group](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_user-auth-group.png)

### Enable OIDC in Palette

23. Navigate back to Palette, and from the left **Main Menu**, select **Tenant Settings**. Next, select **SSO** and click on the **OIDC** tab.

24. Fill in the fields **Client ID**, **Client Secret**, and **Issuer URL** with the values that OneLogin provided.

25. Next, add the **groups** scope in the **Scopes** field, and click **Enable** to continue.

:::caution
Ensure the expected scopes are added. Otherwise, Palette may be unable to retrieve the group name.
:::

![Full OIDC config](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_oidc-full-palette.png)

You now have a working configuration for OneLogin as a third-party IdP in Palette. Check out the [Create Teams in Palette](#create-teams-in-palette) section to learn how to create teams in Palette and map them to groups in OneLogin.

## Validate

Use the following steps to validate the configuration.

1. Log out of Palette by navigating to the top right **User Menu** and selecting **Log Out**. You will be redirected to a new login screen.

![Logout](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_logout.png)

2. In the login screen that displays, click the **Sign In** button. You will be required to authenticate with OneLogin. If you are already authenticated with OneLogin, you will be signed in automatically to Palette with the proper permissions inherited from the Palette team you are a member of. If you cannot sign in, you can use the username and password method.

![SSO Login Screen](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_login-screen.png)

3. To check which teams you are mapped to, navigate to the left **Main Menu** and select **Users & Teams**. In the **Users** tab, find your user name to review the teams you are a member of.

![Check Team Member](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_team-member.png)

:::tip

With the [OpenID Connect Inspector](https://developers.onelogin.com/openid-connect/inspector), you can send requests to OneLogin and check what is sent in the payload. This way, you can ensure you are using the correct claims and scopes. Add the Inspector's callback URL to your application's Redirect URIs list when using the Inspector. Check out the - [OpenID Connect Inspector Tutorial](https://youtu.be/do0agd71hE8) to learn more.

:::info

## Create Teams in Palette

You must create a team in Palette so that Palette can map the team with groups configured in OneLogin. The team name must match the value returned for the groups configured in OneLogin. In this example, you will create an Administrators team in Palette. This team name matches the Administrators value assigned to each member of the Administrators group in OneLogin.

### Prerequisites

- An active Palette account with administrative permissions.

- A OneLogin mapping that maps the user to a group.

### Team Creation

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant administrator.

2. From the left **Main Menu**, select **Users & Teams**.

3. Next, select **Teams**, and click on **Create team**.

4. You only need to fill in the team name. Do not manually add members, as OneLogin will manage the users. In OneLogin, users who are part of the mapped administrators group will be automatically added to the team. Click **Confirm** to continue.

![Create New Team](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_new-team.png)

5. Next, you need to assign the members of this team a set of permissions. Assign all members the **Tenant Admin** permissions. You can customize the assigned permissions as needed. For this example admin access is granted.

6. To set the correct permissions, select the team you created, and click on the **Tenant Roles** tab.

7. Next, click on **Add Tenant Role** and select the **Tenant Admin** box. This will automatically select all other permission boxes. Click on **Confirm**.

8. You should have a configuration similar to the following image.

![Permissions](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_roles-full.png)

You have now configured Palette to use OneLogin as a third-party IDP. Use the above steps to create additional groups in OneLogin and Palette.

As you start deploying clusters, keep in mind that if you use the [Palette eXtended Kubernetes (PKE)](../../integrations/kubernetes.md) distribution, you can configure the cluster to inherit OIDC configurations from the tenant. Refer to the [Palette eXtended Kubernetes](../../integrations/kubernetes.md#configure-custom-oidc) reference page to learn more about out-of-the-box support for OIDC.

### Validate

To verify the team is created and the correct permissions are assigned, log in to Palette as a user who is a member of the team.

1. Log in to [Palette](https://console.spectrocloud.com/) as a user who is a member of the team you created and available in OneLogin.

2. Authenticate with OneLogin once you are redirected to the login screen. A successful login will redirect you to the Palette dashboard and indicate that you are logged in as a member of the team you created.

3. Ensure you can access the **Tenant Settings** page. Select the **Tenant Admin** scope. From the left **Main Menu**, select **Tenant Settings**. If you have the correct permissions, you will be able to access the settings page.

## Resources

- [OneLogin](https://www.onelogin.com/)

- [Documentation](https://developers.onelogin.com/)

- [OpenID Connect Inspector](https://developers.onelogin.com/openid-connect/inspector)
