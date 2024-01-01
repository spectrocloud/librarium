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

2. Create (4) Palette teams with each team named after the "Entra ID Group ID" from Azuure ID. 

| Palette Team Name = Entra Group ID | Entra ID Group Name     |  
|-------------------|--------------------------------------------------------------------|
| e3ac07cc-bd12-4edc-92a4-983d783153ba |  palette_tenant_admins     |  
| 88f61c49-1dd1-40c3-a820-68a513a38725 |  palette_default_project_admins    
| 3f33c3a5-e0af-4ef6-9671-c7545fe264f3 |  k8s_cluster_admins     | Project      
| c4606295-e8b0-4df0-891b-de4428d7e54f |  k8s_cluster-editor     | Project     

Assign the following Roles to each Folder


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



The following screen allows you to configure the new Web App Integration. On the **App integration name** field, change the name from `My Web App` to `Spectro Cloud Palette OIDC`. If desired, you can also upload a logo for the application. Leave the **Grant type** to its default value - **Authorization Code**.

  <br />

  ![Configure General Settings](/oidc-Entra ID-images/oidc-Entra ID_Entra ID-general-settings.png)

  <br />


5. Open a web browser and navigate to your Palette subscription. Navigate to **Tenant Settings** --> **SSO** and click **OIDC**. Click the button next to **Callback URL** to copy the value to the clipboard.

  <br />

  ![Copy Callback URL](/oidc-Entra ID-images/oidc-Entra ID_copy-callback-url.png)

  <br />

6. Switch back to your Entra ID Admin console and paste the copied value into the **Sign-in redirect URIs** field, replacing the existing value:

  <br />

  ![Paste Redirect URI](/oidc-Entra ID-images/oidc-Entra ID_paste-redirect-uri.png)

  <br />

7. Switch back to Palette in the web browser and click the button next to **Logout URL** to copy the value to the clipboard.

  <br />

  ![Copy Logout URL](/oidc-Entra ID-images/oidc-Entra ID_copy-logout-url.png)

<br />

7. Switch back to your Entra ID Admin console and paste the copied value into the **Redirect URI** field, then click **Add** to add it to the list:

  <br />

  ![Paste Logout URI](/oidc-Entra ID-images/oidc-Entra ID_paste-logout-uri.png)

<br />

8. These two redirect URIs are required for SSO to work with Palette. You can also add additional redirect URIs. The URIs in the table below are useful when you want to use Entra ID for OIDC authentication into your Kubernetes clusters.

  <br />

  | URL | Type of Access |
  | --- | --- |
  | `http://localhost:8000` | Using kubectl with the kube-login plugin from a workstation. |
  | `https://console.spectrocloud.com/v1/shelly/oidc/callback` | Using the web-based kubectl console. |
  | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard. |

  <br />

9. When you have completed entering redirect URIs, scroll down to the **Assignments** section and section and select **Allow everyone in your organization to access**. Leave the **Enable immediate access with Federation Broker Mode** option enabled and click **Save**.

  <br />

  ![Configure Assignments](/oidc-Entra ID-images/oidc-Entra ID_assignments.png)

<br />

10. You have now created the Entra ID Application! Next, you need to retrieve the Client ID and Client Secret information, which you will use in the following steps. You should have landed on the **General** tab of your Entra ID Application. Click the **Copy to clipboard** button next to the **Client ID** to copy the secret value and save it somewhere. You will need this value for later.

  <br />

  ![Copy Client ID](/oidc-Entra ID-images/oidc-Entra ID_copy-client-id.png)

<br />

11. Click the **Copy to clipboard** button next to the **Client Secret** to copy the secret value and save it. You will need this value for a later step.

  <br />

  ![Copy Shared Secret](/oidc-Entra ID-images/oidc-Entra ID_copy-shared-secret.png)

<br />

### Create an Entra ID Authorization Server

To ensure Entra ID issues OIDC tokens with the correct claims, you must create a custom Authorization Server. A custom Authorization Server is required to customize the authorization tokens issued by Entra ID so that they contain the necessary OIDC claims required by Palette and Kubernetes. 

<br />

12. Navigate to **Security** --> **API** and on the **Authorization Servers** tab and click **Add Authorization Server**.

  <br />

  ![Add Authorization Server](/oidc-Entra ID-images/oidc-Entra ID_add-authz-server.png)

<br />

13. Enter a name for the server, for example `Palette OIDC`. For the **Audience** field, enter the client identifier that you saved in step **10**. Optionally provide a description. Then click **Save**.

  <br />

  ![Name Authorization Server](/oidc-Entra ID-images/oidc-Entra ID_name-authz-server.png)

<br />

14. Navigate to the **Claims** tab and click **Add Claim**.

  <br />

  ![Add Claims](/oidc-Entra ID-images/oidc-Entra ID_add-claims.png)


15. Enter the required information from the following tables below and click **Create**. Use this flow to create three claims in total. First, create two claims for the user information.

  <br />

  | Claim Name | Include in token type | Value Type | Value | Disable claim | Include In |
  |------------|-----------------------|------------|-------|---------------|------------|
  | u_first_name | ID Token (Always) | Expression | `user.firstName` | Unchecked | Any scope |
  | u_last_name | ID Token (Always) | Expression | `user.lastName` | Unchecked | Any scope |


16. Next, create a claim for group membership. The example below will include the names of any groups that the Entra ID user is a member of, that start with `palette-`, in the `groups` claim of the ticket. For Palette SSO, Palette will make the user a member of Teams in Palette that have the identical name.

  <br />

  | Claim Name | Include in token type | Value Type | Filter | Disable claim | Include In |
  |------------|-----------------------|------------|-------|---------------|------------|
  | groups | ID Token (Always) | Groups | Starts with: `palette-` | Unchecked | Any scope |

  <br />

  ![Claims Result](/oidc-Entra ID-images/oidc-Entra ID_claims-result.png)

  <br />

17. Click **<-- Back to Authorization Servers** at the top of the page to navigate back to the list of all servers. The authorization server you created is displayed in the list. Select the **Issuer URI** shown and copy it to the clipboard. Save this value as you will use it in a later step.

  <br />

  ![Get Issuer URI](/oidc-Entra ID-images/oidc-Entra ID_get-issuer-uri.png)

  <br />

18. Navigate to the **Access Policies** tab and click **Add Policy**.

  <br />

  ![Add Access Policy](/oidc-Entra ID-images/oidc-Entra ID_add-access-policy.png)

<br />

19. Set the **Name** and **Description** fields to `Palette`, then change the **Assign to** option to the Entra ID Application you created in step three -`Spectro Cloud Palette OIDC`. Type in the first few characters of the application name and wait for a search result to come up that you can click on.

  <br />

  ![Name Access Policy](/oidc-Entra ID-images/oidc-Entra ID_name-access-policy.png)

<br />

20. Click the **Add rule** button to add a rule to this Access Policy:

  <br />

  ![Add Policy Rule](/oidc-Entra ID-images/oidc-Entra ID_add-policy-rule.png)

<br />

21. Set the **Rule Name** to `AuthCode`. Then deselect all Grant types but one, only leaving **Authorization Code** selected. Then click **Create Rule**.

  <br />

  ![Configure Policy Rule](/oidc-Entra ID-images/oidc-Entra ID_configure-policy-rule.png)

<br />

You have now completed all configuration steps in Entra ID.
<br />

### Enable OIDC SSO in Palette

22. Open a web browser and navigate to your [Palette](https://console.spectrocloud.com) subscription.

Navigate to **Tenant Settings** --> **SSO** and click on **OIDC**. Enter the following information.

| Parameter         | Value                                                             |
|-------------------|--------------------------------------------------------------------|
| Issuer URL        | The Issuer URI that you saved in step **15**.|
| Client ID         | The client identifier that you saved in step **10**. |
| Client Secret     | The shared secret that you generated in step **11**. |
| Default Teams     | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group. |
| Scopes            | Keep `openid`, `profile` and `email` as the default. |
| Email             | Keep `email` as the default.  |
| First Name        | Set this to `u_first_name`. |
| Last Name         | Set this to `u_last_name`. |
| Spectro Team      | Keep `groups` as the default. |

  <br />

  ![Enable Palette OIDC SSO](/oidc-Entra ID-images/oidc-Entra ID_configure-palette-oidc.png)

<br />

23. When all the information has been entered, click **Enable** to activate SSO. You will receive a message stating **OIDC configured successfully**.


###
 Create Teams in Palette

The remaining step is to create teams in Palette for the group that you allowed to be passed in the OIDC ticket in Entra ID, and give them the appropriate permissions. For this example, you will create the `palette-tenant-admins` team and give it **Tenant Admin** permissions. You can repeat this for any other team that you have a matching Entra ID group for.

24. Open a web browser and navigate to your Palette subscription. Navigate to **Tenant Settings** --> **Users & Teams** --> **Teams** tab, and click **+ Create Team**.

  <br />

  ![Create Palette Team](/oidc-Entra ID-images/oidc-Entra ID_create-team.png)

<br />

25. Specify `palette-tenant-admins` in the **Team name** field. You don't need to set any members now, as this will happen automatically from the SSO. Click **Confirm** to create the team.

  <br />

  ![Name Palette Team](/oidc-Entra ID-images/oidc-Entra ID_name-team.png)

<br />

26. The list of teams displays again. Select the newly created **palette-tenant-admins** team to review its details. To give this team administrative access to the entire tenant and all the projects in it, assign the **Tenant Admin** role. Select  **Tenant Roles**  and click **+ Add Tenant Role**:

  <br />

  ![Palette Tenant Roles](/oidc-Entra ID-images/oidc-Entra ID_tenant-roles.png)

<br />

27. Click on **Tenant Admin** to enable the role. Click **Confirm** to add the role.

  <br />

  ![Add Tenant Role](/oidc-Entra ID-images/oidc-Entra ID_add-tenant-role.png)

<br />

You will receive a message stating **Roles have been updated**. Repeat this procedure for any other teams while ensuring they are given the appropriate access permissions.

28. Click the **X** next to **Team Details** in the top left corner to exit this screen.

You have now successfully configured Palette SSO based on OIDC with Entra ID.


### Validate

1. Log in to Palette through SSO as a user that is a member of the `palette-tenant-admins` group in Entra ID to verify that users are automatically added to the `palette-tenant-admins` group in Palette. If you're still logged into Palette with a non-SSO user, log out by selecting **Logout** in the **User  Drop-down Menu** at the top right.

  <br />

  ![User Logout](/oidc-Entra ID-images/oidc-Entra ID_user-logout.png)

<br />


2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field. Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without SSO. Click on the **Sign in** button to log in via SSO.

  <br />

  ![User SSO Login](/oidc-Entra ID-images/oidc-Entra ID_palette-login.png)

<br />

3. If this is the first time you are logging in with SSO, you will be redirected to the Entra ID login page. Depending on your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

  <br />

  :::info

  Make sure you log in as a user that is a member of the `palette-tenant-admins` group in Entra ID. Once authenticated, you will automatically be redirected back to Palette and logged into Palette as that user.

  :::

<br />

4. You are now automatically added to the `palette-tenant-admins` team in Palette. To verify, navigate to the left **Main Menu**, select **Tenant Settings** --> **Users & Teams** --> **Teams** tab. Click the **palette-tenant-admins** team and view the team members section.




## Resources

- [Entra ID Workforce Identity Cloud](https://www.Entra ID.com/products/single-sign-on/)


- [Palette User Management](../user-management.md)


- [Palette SSO](./saml-sso.md)