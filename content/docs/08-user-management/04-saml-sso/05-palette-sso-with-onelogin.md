---
title: 'Palette SSO with OneLogin'
metaTitle: 'Set up Palette SSO with OneLogin'
metaDescription: 'Set up Palette SSO with OneLogin'
icon: ""
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Enable SSO with OneLogin

OneLogin is a cloud-based Identity and Access Management (IAM) provider that designs and develops enterprise-level identity management solutions. It's an Identity Provider (IdP) tool designed to secure, manage, and facilitate user access across multiple networks, applications, and devices. OneLogin's platform offers a variety of features, including Single Sign-On (SSO), Multi-Factor Authentication (MFA), user provisioning, compliance reporting, and end-user self-service. 

The following steps will walk you through the process of setting up Palette SSO with OneLogin based on OpenID Connect (OIDC).

# Prerequisites

- You will need an active OneLogin subscription and administrator-level permissions. If you're using this for testing purposes, OneLogin provides a [developer subscription](https://developers.onelogin.com/). 


- If you would like to use the same OneLogin application for OIDC-based SSO in your Kubernetes cluster, you will need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle the retrieval of access tokens for your cluster.


# Setup 

## Create a OneLogin Application

1. Log in to your [OneLogin account](https://www.onelogin.com/) with administrative credentials.

2. Go to the **Applications** section of your OneLogin admin dashboard and click on the **Add App** button to create a new application. 

3. In the search bar, type "OpenID Connect" to find the generic OIDC app connector. 

<br />
  
  ![Search for OpenID Connect](/oidc-onelogin-images/search-oidc.png)  
  
<br />  

4. Select the "OpenID Connect" app connector to add it to your account. Next, you will be taken to the application configuration page where you can provide a **Display Name** and click the **Save** button. You will use the display name **Spectro Cloud Palette OIDC**in this example.  

<br />

  ![Enter Display Name](/oidc-onelogin-images/oidc-app-name.png)

<br />

5. After clicking the **Save** button, you will be redirected to your new application configuration screen. Select the **Configuration** tab on the left. Here you will need to fill in the **Login Url**, **Redirect URI's** and **Post Logout Redirect URIs** fields. 
 
<br />

|Field|Description|
|--------|--------|
|Login URL|This is the URL where users are sent to log in.|
|Redirect URIs|These are the Uniform Resource Identifiers (URI) to which OneLogin will redirect the user after successful authentication.|
|Post Logout Redirect URIs|These are the URIs where the user will be redirected after they successfully log out from their session.|

<br />

6. The URLs needed to configure OneLogin can be found in your Palette instance. Go to **Tenant Admin** --> **Tenant Settings** --> **SSO**, select **OIDC** as your SSO Auth type and click the button next to **Callback URL** to copy the value.  

<br />

  ![Copy Callback URL](/oidc-onelogin-images/callbackurl.png)

<br />

7. Next, paste the **Callback URL** value in the **Login Url** and **Redirect URI's** sections. 

<br />

  ![Add Login URL and Redirect URL](/oidc-onelogin-images/login-redirect-uris.png)

<br />

8. Next, do the same for the **Logout Redirect URIs** and copy the **Logout URL** value which sits below the **Callback URL** from Palette. 

<br />

  ![Add Logout URL](/oidc-onelogin-images/logout-uri.png)

<br />

9. Your configuration should look similar to the following screenshot. 

<br />

  ![URI Config](/oidc-onelogin-images/uri-config.png)

<br />

10. Select the **Parameters** tab and click on the **Groups** field. Make sure the bottom configuration contains the **MemberOf** value. This will ensure that the correct group value is passed.  

<br />

![Check MemberOf field](/oidc-onelogin-images/group-field.png)

<br />

11. Navigate to the left **Main Menu** and select **SSO**. From the SSO settings page, copy the **Client ID**, **Client Secret**, and **Issuer URL** values. These values are important credentials that Palette will use to authenticate with OneLogin. Make sure to save them securely. Click the **Save** button to save all changes. 

<br />

  ![ClientID & Client Secret](/oidc-onelogin-images/clientid-clientsecret.png)

<br />

## Create Role, Security Policy and Group

12. Go to your OneLogin dashboard and select **Users** --> **Roles** and select **New Role**. Create an **Admin** role and select your **Role App**. The **Spectro Cloud Palette OIDC** app is used in this example. When selecting the app, a green checkmark will appear behind the name. Click the **Save** button. 

<br />

  ![Add Role](/oidc-onelogin-images/app-role.png)

<br />

13. You can optionally create a security policy if desired. To create a Security Policy,  navigate to **Security** --> **Policies** and select **New User Policy** on the top right. Fill out a name for the policy, for example, "Admin policy."  Continue to configure the policy to your needs. Click **Save** to contiue. 

14. Apply the policy to a group of users, but first, you will need a group. Go to **Users** --> **Groups** and select **New Group**. Assign the new group a name, select your security policy, and click **Save**.  

<br />
  
  ![Add Security Policy](/oidc-onelogin-images/group-sec-policy.png)

<br />

15. You will automate the mapping of a user to a role and group by creating a *Mapping*. Navigate to **Users** --> **Mappings** and select **New Mapping**. Assign the mapping a name and set it to map every member of the *Administrators* group to get the *Admin* role automatically. Set the **MemberOf** value to *Administrators*. The latter step is essential, so the response from OneLogin contains the group name, which you will match with a *Team* in Palette. Without explicitly setting the *MemberOf* value, Palette will not get the group name and won't be able to set the correct RBAC settings for your user. 

<br />

  ![Add Mapping](/oidc-onelogin-images/mapping-role-group.png)

<br />

16. Go to **Users** --> **Users** and select your user. Select the **Authentication** tab and select the group and security policy you just created. Click Save. 

<br />

  ![Add User to Group](/oidc-onelogin-images/user-auth-group.png)

<br />

## Enable OIDC in Palette 
17. Navigate back to Palette and fill in the **Client ID**, **Client Secret**, and **Issuer URL** values. Add the **groups** scope to the **Scopes** field. Without the proper scopes, Palette won't receive the group name. Click **Enable** to continue. 

<br />

  ![Full OIDC Config](/oidc-onelogin-images/oidc-full-palette.png)

<br />

## Creating Teams in Palette

18. In order for Palette to map the groups configured in OneLogin, you need to create a Team in Palette. This Team name needs to match the value that is returned for the groups configured in OneLogin. In this example, you will create an **Administrators** team. This also matches with the Administrators value that is assigned to each member of the Administrators group in OneLogin. In Palette, navigate to left **Main Menu**, select **Tenant Settings** --> **Users & Teams** --> **Teams**, and select **Create team**. You only need to fill in the Team name. Don't manually add members, as OneLogin will manage the users. In OneLogin, users who are part of the mapped group, administrators, will be automatically added to the team. Click **Confirm** to continue. 

<br />

  ![Create New Team](/oidc-onelogin-images/new-team.png)

<br />

19. Next, you need to give the members of this team a set of permissions. Assign all members *Tenant Admin* permissions because this is the Administrators team. You can define permissions fully to your liking. To set the correct permissions, navigate to left **Main Menu**, select **Tenant Settings** --> **Users & Teams** --> **Teams**. Select the team you created. Click on **Tenant Roles** --> **Add Tenant Role** and select the **Tenant Admin** box. This will auto-select all other permission boxes.  Click **Confirm**.

<br />

  ![Add Tenant Role](/oidc-onelogin-images/tenant-admin-role.png)

<br />

Click **Confirm** and you should have a configuration similar to this. 

<br />

  ![Permissions](/oidc-onelogin-images/roles-full.png)

<br />
You have now configured Palette to use OneLogin as a third-party IDP. Use the above steps to create additional groups in OneLogin and Palette. As you start deploying clusters, keep in mind that if you use Palette's Extended Kubernetes distribution, you can configure the cluster to inherit OIDC configurations from the tenant. Refer to the [Palette eXtended Kubernetes](/integrations/kubernetes#configureoidcidentityprovider) reference page to learn more about out-of-the-box support for OIDC.
# Validate

1. The SSO configuration is now complete and it's time to test all of our efforts. You can logout out of Palette and you'll be redirected to a new login screen. 

<br />

  ![Logout](/oidc-onelogin-images/logout.png)

<br />

2. The login screen now defaults to a **Sign In** button. If you are already signed in into OneLogin, once you click on **Sign In** you will be automatically signed in and should have the correct permissions set. If you are unable to sign in, you can always use a username and password. 

<br />

  ![SSO Login Screen](/oidc-onelogin-images/login-screen.png)

<br />


3. You can check what teams you are mapped to by navigating to the left **Main Menu** and selecting **Tenant Settings**. Select **Users & Teams** --> **Users**. Find your user name to review the teams you are a member of. 

<br />

  ![Check Team Member](/oidc-onelogin-images/team-member.png)

<br />

# References
[OneLogin](https://www.onelogin.com/)
[Documentation](https://developers.onelogin.com/)
[OpenID Connect Inspector](https://developers.onelogin.com/openid-connect/inspector)

<InfoBox>

**Troubleshooting**
With the OpenID Connect Inspector, you can send requests to OneLogin and check what is sent in the payload. This way you can make sure that you are using the right claims and scopes. When using this, you will need to add the Inspector callback URL to your applications Redirect URIs list. 
[OpenID Connect Inspector Tutorial](https://youtu.be/do0agd71hE8)
[OpenID Connect Inspector](https://developers.onelogin.com/openid-connect/inspector)

</InfoBox>