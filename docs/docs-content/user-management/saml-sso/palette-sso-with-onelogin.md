---
sidebar_label: 'Palette SSO with OneLogin'
title: 'Enable SSO with OneLogin'
description: 'Set up Palette SSO with OneLogin'
icon: ""
hide_table_of_contents: false
sidebar_position: 50
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "onelogin"]
---

OneLogin is a cloud-based Identity and Access Management (IAM) provider that designs and develops enterprise-level identity management solutions. It's an Identity Provider (IdP) tool designed to secure, manage, and facilitate user access across multiple networks, applications, and devices. OneLogin's platform offers a variety of features, including Single Sign-On (SSO), Multi-Factor Authentication (MFA), user provisioning, compliance reporting, and end-user self-service. 


You can integrate OneLogin with Palette to enable SSO for your users. This integration allows you to use OneLogin as a third-party Identity Provider (IdP) to authenticate users in Palette. This integration also allows you to use the same OneLogin application for OIDC-based SSO in your Kubernetes cluster.

This guide will guide you through the steps required to configure OneLogin as a third-party IdP in Palette.

## Prerequisites

- An active OneLogin subscription and administrator-level permissions. If you arre using this for testing purposes, OneLogin provides a [developer subscription](https://developers.onelogin.com/). 


- For OIDC-based SSO in your Kubernetes cluster, you will need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle the retrieval of access tokens for your cluster.


## Setup

Use the following steps to configure OneLogin as a third-party IdP in Palette.

### Create a OneLogin Application

1. Log in to your [OneLogin account](https://www.onelogin.com/) with administrative credentials.

2. Navigate to the **Applications** section of your OneLogin admin dashboard and click on the **Add App** button to create a new application. 

3. In the search bar, type "OpenID Connect" to find the generic OIDC app connector. 

  ![Search for OpenID Connect](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_search-oidc.png)  
  

4. Select the "OpenID Connect" app connector to add it to your account. Next, you will be taken to the application configuration page where you can provide a **Display Name**. Use the display name **Spectro Cloud Palette OIDC** and click on **Save**. 

  ![Enter Display Name](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_oidc-app-name.png)


5. After clicking the **Save** button, you will be redirected to your new application configuration screen. Select the **Configuration** tab on the left. Here you will need to fill in the **Login Url**, **Redirect URI's** and **Post Logout Redirect URIs** fields. 

  |**Field**|**Description**|
  |--------|--------|
  |Login URL|This is the URL where users are sent to log in.|
  |Redirect URIs|These are the Uniform Resource Identifiers (URI) to which OneLogin will redirect the user after successful authentication.|
  |Post Logout Redirect URIs|These are the URIs where the user will be redirected after they successfully log out from their session.|


6. The URLs needed to configure OneLogin can be found in your Palette account. From the left **Main Menu** click on **Tenant Admin**. Next, select **Tenant Settings** to access the settings page. From the settings page, select **SSO**, click on the **OIDC** tab. Copy the **Callback URL** value to your clipboard. 

  ![Copy Callback URL](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_callbackurl.png)


7. Paste the Palette **Callback URL** value in the **Login Url** and **Redirect URI's** sections. 

  ![Add Login URL and Redirect URL](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_login-redirect-uris.png)


8. Next, do the same for the **Logout Redirect URIs** and copy the **Logout URL** value which sits below the **Callback URL** from Palette. 

  ![Add Logout URL](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_logout-uri.png)


9. Your configuration should look similar to the following screenshot. 

  ![URI config](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_uri-config.png)


10. Select the **Parameters** tab and click on the **Groups** field. Make sure the bottom configuration contains the **MemberOf** value. This will ensure that the correct group value is passed.  

  ![Check MemberOf field](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_group-field.png)


11. Navigate to the left **Main Menu** and select **SSO**. From the SSO settings page, copy the **Client ID**, **Client Secret**, and **Issuer URL** values. These values are important credentials that Palette will use to authenticate with OneLogin. Make sure to save them securely. Click **Save** to save all changes. 

  ![ClientID & Client Secret](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_clientid-clientsecret.png)


### Create Role, Security Policy and Group

12. Go to your OneLogin dashboard and select **Users**. Next, click on **Roles** to access the Role page and select **New Role**. Create an **Admin** role and select your **Role App**. The **Spectro Cloud Palette OIDC** app is used in this example. When selecting the app, a green checkmark will appear behind the name. Click on **Save**. 

  ![Add Role](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_app-role.png)


13. You can optionally create a security policy if desired. To create a Security Policy, navigate to **Security** --> **Policies** and select **New User Policy** on the top right. Fill out a name for the policy, for example, "Admin policy".  Continue to configure the policy to your needs. Click **Save** to continue. 

14. Apply the policy to a group of users, but first, you will need a group. Navigat to  **Users** --> **Groups** and select **New Group**. Assign the new group a name, select your security policy, and click **Save**.  

  ![Add Security Policy](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_group-sec-policy.png)


15. You will automate the mapping of a user to a role and group by creating a *Mapping*. Navigate to **Users** --> **Mappings** and select **New Mapping**. Assign the mapping a name and set it to map every member of the Administrators group to assign the Admin role automatically. Set the **MemberOf** value to **Administrators**. The latter step is essential, so the response from OneLogin contains the group name, which you will match with a Team in Palette. Without explicitly setting the **MemberOf** value, Palette will not get the group name and will not be able to set the correct RBAC settings for your user. 

  ![Add Mapping](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_mapping-role-group.png)


16. Navigate to **Users** --> **Users** and select your user. Select the **Authentication** tab and select the group and security policy you created earlier. Click on **Save**. 

  ![Add User to Group](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_user-auth-group.png)

### Enable OIDC in Palette 
17. Navigate back to Palette and fill in the **Client ID**, **Client Secret**, and **Issuer URL** values. Add the **groups** scope to the **Scopes** field. Without the proper scopes, Palette won't receive the group name. Click **Enable** to continue. 

  ![Full OIDC config](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_oidc-full-palette.png)


### Create Teams in Palette

18. In order for Palette to map the groups configured in OneLogin, you need to create a team in Palette. The team name needs to match the value that is returned for the groups configured in OneLogin. In this example, you will create an **Administrators** team in Palette. This team name also matches with the Administrators value that is assigned to each member of the Administrators group in OneLogin. 

  In Palette, navigate to left **Main Menu**, select **Tenant Settings** and click on **Users & Teams**. Next, select **Teams**, and click on **Create team**. You only need to fill in the team name. Don't manually add members, as OneLogin will manage the users. In OneLogin, users who are part of the mapped group, administrators, will be automatically added to the team. Click **Confirm** to continue. 

  ![Create New Team](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_new-team.png)


19. Next, you need to assign the members of this team a set of permissions. Assign all members the Tenant Admin permissions. You can customize the assigned permissions as needed, but for this example admin access is granted. To set the correct permissions, navigate to left **Main Menu**, select **Tenant Settings** --> **Users & Teams** --> **Teams**. Select the team you created. Click on **Tenant Roles** --> **Add Tenant Role** and select the **Tenant Admin** box. This will auto-select all other permission boxes.  Click **Confirm**.

  ![Add Tenant Role](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_tenant-admin-role.png)


Click **Confirm** and you should have a configuration similar to this. 

  ![Permissions](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_roles-full.png)

You have now configured Palette to use OneLogin as a third-party IDP. Use the above steps to create additional groups in OneLogin and Palette. As you start deploying clusters, keep in mind that if you use Palette's Extended Kubernetes distribution, you can configure the cluster to inherit OIDC configurations from the tenant. Refer to the [Palette eXtended Kubernetes](../../integrations/kubernetes.md#configure-custom-oidc) reference page to learn more about out-of-the-box support for OIDC.

## Validate

Use the following steps to validate the configuration.

1. Log out of Palette by clicking on the user **drop-down Menu** in the top-right corner and selecting **Log Out**. You will be redirected to a new login screen.

  ![Logout](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_logout.png)


2. The login screen now defaults to a **Sign In** button. Click on **Sign In**. You will be required to authenticate with OneLogin. If you are already authenticated with OneLogin you will be automatically signed in to Palette with the proper permissions inherited from the respective Palette team you are a member of. If you cannot sign in, you can use the username and password method. 

  ![SSO Login Screen](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_login-screen.png)


3. You can check what teams you are mapped to by navigating to the left **Main Menu** and selecting **Tenant Settings**. Select **Users & Teams** --> **Users**. Find your user name to review the teams you are a member of. 

  ![Check Team Member](/oidc-onelogin-images/user-management_saml-sso_palette_sso_with_onelogin_team-member.png)

:::tip

With the [OpenID Connect Inspector](https://developers.onelogin.com/openid-connect/inspector), you can send requests to OneLogin and check what is sent in the payload. This way you can make sure that you are using the right claims and scopes. When using this, you will need to add the Inspector callback URL to your applications Redirect URIs list. Check out the - [OpenID Connect Inspector Tutorial](https://youtu.be/do0agd71hE8) to learn more.


:::info

## Resources


- [OneLogin](https://www.onelogin.com/)

- [Documentation](https://developers.onelogin.com/)

- [OpenID Connect Inspector](https://developers.onelogin.com/openid-connect/inspector)




