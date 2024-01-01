---
sidebar_label: 'Palette SSO with Microsoft Entra ID'
title: 'Enable SSO with Microsoft Entra ID'
description: 'Set up Palette SSO with Microsoft Entra ID'
icon: ""
hide_table_of_contents: false
sidebar_position: 30
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "entra-id", "azure-ad"]
---


Single sign-on (SSO) is an authentication method that enables users to log in to multiple applications and websites with one set of credentials. SSO uses certificates to establish and maintain trust between the service provider (SP) and an identity provider. 

This following steps will guide you with end-to-end steps for deploying and enabling SSO with Palette and Microsoft Entra based on OpenID Connect (OIDC).

## Prerequisites

- Palette version 4.0.X or greater. 

- [Microsoft Entra ID](https://entra.microsoft.com/#home) subscription (free or paid). You will need an account with one of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal. 

- If you want to use the same Microsoft Entra ID application for OIDC-based SSO into your Kubernetes cluster itself, you need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle retrieval of access tokens for your cluster.


## OpenID Connect Authentication (OIDC)

OIDC lets developers authenticate users across websites and apps without owning and managing password files. This technology allows Palette to verify the identity of the person currently using the browser or application.

## Microsoft Entra ID

In October 2023, Microsoft renamed [Azure Active Directory](https://learn.microsoft.com/en-us/entra/fundamentals/new-name) to Microsoft Entra ID. For our purposes in this guide, please consider Microsoft Entra ID and Azure AD to be synonymous.

Microsoft Entra ID securely manages anything to do with the user's information, access, and the trust relationships between parties in a flow. It authenticates the user's identity, grants, and revokes access to resources, and issues tokens.

To learn the differences between Active Directory and Microsoft Entra ID, see [Compare Active Directory to Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/compare). 

## Architecture

  <br />

  ![Palette and EntraID](/oidc-entra-id-images/PalettewEntraID.png)

  <br />

  
  ![KubeFlow](/oidc-entra-id-images/Kubeflow.png)

## Integrating Palette and Microsoft Entra ID with OIDC

  <br />

### Register Spectro Cloud Palette as a Microsoft Entra ID Application

  <br />

1. Login to **Spectro Cloud Palette**. Browse to **Tenant Settings** -> **SSO** -> **Configure,** -> **SSO Auth type**.

![OIDC_Callback](/oidc-entra-id-images/oidccallback.png)
  <br />

  For future use, copy the **Palette Callback URL**, which will be used in the next step to configure Microsoft Entra ID.

  <br />

2. In a new tab, log in to the **Microsoft Entra ID Admin console** and open the [App registration blade](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)

![App-registration-blade](/oidc-entra-id-images/new-registration.png)

In this example, name thew new registration `palette_oidc`, select **Web**, and paste the Palette Callback URL from the previous into the **Redirect URL (optional)** field.

![Palette_Registration](/oidc-entra-id-images/palette-registration.png)

Click **Register**.

  <br />

3. Now, click on the **Certificates & secrets** blade and select **New client secret**. 

Name and save the client's secret value in a password keeper. In the screen that opens, select **OIDC - OpenID Connect**` for the sign-in method, then select **Web Application** for the application type. Then click **Next**.

![Palette_Secret](/oidc-entra-id-images/secret.png)

In this example, my palette secret expires after six months. 
### Configure Optional Claims

Click on the **Token configuration** sub-blade and select the **Add optional claim** button.

![Add_claims](/oidc-entra-id-images/claims.png)
  <br />

Choose **Token type** as **ID**, and add the claims **email** and **preferred_username**.

![Add_claims](/oidc-entra-id-images/twooptionalclaims.png)
  <br />

Click the **Add** button.
  <br />


## Configure Groups claim

In addition to allowing individual user authentication, Palette provides groups claim functionality, allowing an OpenID Connect identity provider, like Microsoft Entra ID, to identify the user's Entra ID group membership within Palette.

Select the **Add groups claim** button.

Select **Security groups**, and **Group ID** for each property: **ID**, **Access** and **SAML**.

![Add_claims](/oidc-entra-id-images/groupsclaim.png)
  <br />

When completed, the **Token Configuration** page will look like this:

![Token_Configuration](/oidc-entra-id-images/token-configuration.png)

Click on the **Overview** sub-blade. 

Save the following information for when we configure Spectro Cloud Palette:

- Application (client) ID
- Object ID
- Directory (tenant) ID

![Palette_OIDC_Overview](/oidc-entra-id-images/app_obj_dir_ids.png)
  <br />


# Configure Microsoft Entra ID with Users and Groups
## Add Groups for Testing SSO with Palette

Open the [Groups Blade](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups/menuId/AllGroups) in Microsoft Entra ID. We will create six (6) Test Groups in Microsoft Entra ID:

Create four (4) new Secruity Groups in Entra ID: 

        palette_tenant_admins
  <br />

        palette_default_project_admins
  <br />

        k8s_cluster_admins
  <br />

        k8s_cluster-editor
  <br />


 When completed, you should have at least four Entra ID group objects:

![Entra_Groups](/oidc-entra-id-images/allgroups.png)
  <br />

Record for future steps the group name and **Object ID** of each group. We will use this information in Palette.  Example:

| Entra ID Group    | Group ID Example                                                          |
|-------------------|--------------------------------------------------------------------|
| palette_tenant_admins     | e3ac07cc-bd12-4edc-92a4-983d783153ba |
| palette_default_project_admins     | 88f61c49-1dd1-40c3-a820-68a513a38725 |
| k8s_cluster_admins     | 3f33c3a5-e0af-4ef6-9671-c7545fe264f3 |
| k8s_cluster-editor     | c4606295-e8b0-4df0-891b-de4428d7e54f |


## Add & Edit Users for Testing 

Open the [Users Blade](https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers/menuId/) in Microsoft Entra ID. We will create three (3) Test Users in Microsoft Entra ID:

1.	Create the new user **Defaultprojectadmin** with the following inputs:
      - User principal name example: defaultprojectadmin@SpectroCloud500.onmicrosoft.com  
      - Display name example: defaultprojectadmin
      - Browse to Properties, Edit First Name: DefaultProject
      - Browse to Properties, Edit Last Name: Admin
      - Browse to Properties, add Email: defaultprojectadmin@SpectroCloud500.onmicrosoft.com  
      - add this account to the Entra ID group "Palette_default_project_admins"
  <br />
2.	Create the new user **Test User** with the following inputs:
      - User principal name example: testuser@SpectroCloud500.onmicrosoft.com    
      - Display name example: Test User
      - Browse to Properties, Edit First Name: Test
      - Browse to Properties, Edit Last Name: User
      - Browse to Properties, add Email: testuser@SpectroCloud500.onmicrosoft.com
      - Do not add this account to any groups 
  <br />
3.	Create an external user with your corporate/personal emaail account:
      - User principal name example: your corporate email address  
      - Display name example: Your First Name and Last Name
      - Browse to Properties, Edit First Name
      - Browse to Properties, Edit Last Name
      - Browse to Properties, add your corporatee email addresss
      - add this account to the Entra ID groups "palette_tenant_admins" and "k8s_cluster_admins"
  <br />
4.	Modify your Entra ID admin account with group memberships
      - add this account to the Entra ID groups **palette_tenant_admins** and **k8s_cluster-editor**
<br />
After creating, you should have at least four Entra ID user objects (including the admin account used to access first access Entra ID):

![Test_Users](/oidc-entra-id-images/testusers.png)
  <br />

## Palette SSO 

Your Palette tenant will need information from Microsoft to complete the setup. Please perform the following steps under Users & Teams in Palette:

1. Login to **Spectro Cloud Palette**. Browse to **Users and Teams** -> **Teams** -> **Create New Team**

2. Create (4) Palette teams with each team named after the "Entra ID Group ID" from Azuure ID:

| Palette Team Name = Entra Group ID | Entra ID Group Name     |  
|-------------------|--------------------------------------------------------------------|
| e3ac07cc-bd12-4edc-92a4-983d783153ba |  palette_tenant_admins     |  
| 88f61c49-1dd1-40c3-a820-68a513a38725 |  palette_default_project_admins    
| 3f33c3a5-e0af-4ef6-9671-c7545fe264f3 |  k8s_cluster_admins     | Project      
| c4606295-e8b0-4df0-891b-de4428d7e54f |  k8s_cluster-editor     | Project     

Assign the following Roles to each Palette Team:

| Palette Team Name | Role    |  
|-------------------|--------------------------------------------------------------------|
| e3ac07cc-bd12-4edc-92a4-983d783153ba |  Tenant Admin     |  
| 88f61c49-1dd1-40c3-a820-68a513a38725 |  Default Project Admin
| 3f33c3a5-e0af-4ef6-9671-c7545fe264f3 |  -     |   
| c4606295-e8b0-4df0-891b-de4428d7e54f |  -  | 


![gid_example](/oidc-entra-id-images/gid_example.png)
  <br />

![gid_example](/oidc-entra-id-images/ba_tenantadmin.png)
  <br />

![gid_example](/oidc-entra-id-images/25_def_project_admin.png)
  <br />


## Palette SSO OIDC Configuration

Open [Palette](https://console.spectrocloud.com). Navigate to **Tenant Settings** --> **SSO** and click on **OIDC**. 

We will be using the following information. Here is a short summary:

| Parameter         | Value                                                             |
|-------------------|--------------------------------------------------------------------|
| Issuer URL        | https://sts.windows.net/[ Directory(tenant)ID ]|
| Client ID         | Application (client) ID from Entra ID|
| Client Secret     | The shared secret that you generated under **Certificates & secrets** blade in Entra ID |
| Default Teams     | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group. |
| Scopes            | Keep `openid`, `profile` and `email` as the default. Add `allatclaims` |
| Email             | Keep `email` as the default.  |



1. Enter in Palette the ***Issuer URL**. In our example, the Issuer URL is `https://sts.windows.net/3077b90b-275e-4ace-b9c8-e40be0cdaafb`  
  <br />
2. Enter the Client Secret **Value** you created in Entra ID, under the App **palette-oidc** -> **Certificates & secrets** -> **palette**
  <br />
3. For now, leave the **Default Teams** blank. 
  <br />
4. For **Scopes**, add **allatclaims**. 
<br />
6. Click **Enable**
<br />

![gid_example](/oidc-entra-id-images/enable.png)

Palette will provide a message that **OIDC configured successfully**.


**Troubleshooting**


Add the following redirect URIs are required for SSO to work with Palette tools. You can also add additional redirect URIs. The URIs in the table below are useful when you want to use Entra ID for OIDC authentication into your Kubernetes clusters.

  <br />

  | URL | Type of Access |
  | --- | --- |
  | `http://localhost:8000` | Using kubectl with the kube-login plugin from a workstation. |
  | `https://console.spectrocloud.com/v1/shelly/oidc/callback` | Using the web-based kubectl console. |
  | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard. |

  <br />


### Validate

1. Log in to Palette through SSO with each Entra ID user created/modified above.  created/modified above.

For testing administartion, please make sure your account that is a member of the `palette-tenant-admins` group in Entra ID. If you're still logged into Palette with a non-SSO user, log out by selecting **Logout** in the **User  Drop-down Menu** at the top right.

  <br />

  ![User Logout](/oidc-Entra ID-images/oidc-Entra ID_user-logout.png)

<br />


2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field. Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without SSO. Click on the **Sign in** button to log in via SSO.

<br />

3. If this is the first time you are logging in with SSO, you will be redirected to the Entra ID login page. Depending on your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

  <br />

  :::info

  Make sure you log in as a user that is a member of the `palette-tenant-admins` group in Entra ID. Once authenticated, you will automatically be redirected back to Palette and logged into Palette as that user.

  :::

<br />

4. You are now automatically added to the `palette-tenant-admins` team in Palette. To verify, navigate to the left **Main Menu**, select **Tenant Settings** --> **Users & Teams** --> **Teams** tab. Click the **palette-tenant-admins** team and view the team members section.


5. 

## Resources

- [Palette User Management](../user-management.md)


- [Palette SSO](./saml-sso.md)