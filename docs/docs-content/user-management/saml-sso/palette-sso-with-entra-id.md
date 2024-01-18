---
sidebar_label: 'Palette SSO with Microsoft Entra ID'
title: 'Enable SSO with Microsoft Entra ID'
description: 'Learn how to set up Palette SSO with Microsoft Entra ID'
hide_table_of_contents: false
sidebar_position: 120
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "entra-id", "azure-ad"]
---


Single Sign-On (SSO) is an authentication method that enables users to log in to multiple applications and websites with one set of credentials. SSO uses Secure Socket Layer (SSL) certificates to establish and maintain trust between the Service Provider (SP) and an Identity Provider (IDP).

OpenID Connect (OIDC) lets developers authenticate users across websites and apps without owning and managing password files. This technology allows Palette to verify the identity of the person currently using the browser or application.

In October 2023, Microsoft renamed [Azure Active Directory](https://learn.microsoft.com/en-us/entra/fundamentals/new-name) to Microsoft Entra ID. For the purposes of this guide, please consider Microsoft Entra ID and Azure Active Directory to be synonymous. Microsoft Entra ID securely manages anything to do with the user's information, access, and the trust relationships between parties in a flow. It authenticates the user's identity, grants, and revokes access to resources, and issues tokens.

This document will guide you on how to deploy and enabling SSO with Microsoft Entra based on OpenID Connect for integration with Palette and Kubernetes clusters. 

:::tip

If you want to enable OIDC at the Kubernetes cluster level, refer to the [Enable OIDC in Kubernetes Clusters](#enable-oidc-in-kubernetes-clusters) section.

:::

## Prerequisites

- Palette or Palette VerteX version 4.0.X or greater. 

- A [Microsoft Entra ID](https://entra.microsoft.com/#home) subscription. You will need an account with one of the following roles, Global Administrator, Cloud Application Administrator, Application Administrator. Alternatively, you may be the owner of the service principal. 

- If you want to use the same Microsoft Entra ID application for OIDC-based SSO into your Kubernetes cluster itself, you need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle retrieval of access tokens for your cluster.



## Architecture


  ![Palette and EntraID](/oidc-entra-id-images/PalettewEntraID.png)



## Enable OIDC SSO in Palette


1. Log in to [Palette](https://console.spectrocloud.com) as a **Tenant Admin**. 

2. Navigate to the left **Main Menu** and select **Tenant Settings**. From the **Tenant Menu**, select **SSO**, then **Configure** and lastly, click on the **OIDC** tab.

  ![A view of the callback URL field](/oidc-entra-id-images/oidccallback.png)

3. Copy the **Callback URL** to your clipboard. This URL will be used in the next step to configure Microsoft Entra ID. 


4. In a separate browser tab, log in to the Microsoft Entra ID Admin console and open the [App registration blade](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).

5. Click on **New registration** and assign a name to new registration. In this guide, the example app registration is named *palette_oidc*.  


6. Next, select **Web**, and paste the *Palette Callback URL* value from your clipboard into the **Redirect URL (optional)** field, and Click **Register**.

  ![Azure application creation screen](/oidc-entra-id-images/palette-registration.png)
 
7. From the app overview page, navigate to the left **Main Menu** and select **Certificates & secrets**. In the following screen, click on **New client secret**. 


8. Add a description for the secret and select an expiration period. Click on **Add** to create the secret. 

  :::warning

  We recommend you store the secret value in a secure location, such as a password manager. You will need this value later when you configure Palette.

  :::

9. From the application overview page, navigate to the left **Main Menu** and select **Token configuration**.


10. Select **Add optional claim** button. Choose **Token type** as **ID**, and add the claims **email** and **preferred_username**. When finished, click the **Add** button.

  ![Add a claim button](/oidc-entra-id-images/twooptionalclaims.png)


11. In addition to allowing individual user authentication, Palette provides groups claim functionality, allowing an OpenID Connect identity provider, like Microsoft Entra ID, to identify the user's Entra ID group membership within Palette. To enable group membership, select the **Add groups claim** button. Then select **Security groups**, and **Group ID** for each property: **ID**, **Access** and **SAML**.

  ![Groups and inviduals can be assigned a group membership in Azure](/oidc-entra-id-images/groupsclaim.png)



When completed, the **Token Configuration** page will look similar to image below.

  ![A view of the token configuration screen](/oidc-entra-id-images/token-configuration.png)

12. From the application overview page, navigate to the left **Main Menu** and select the **Overview** tab.  From the **Overview** selection, save the following fields for the next steps in you will complete in Palette.

| Field  | Description   |
| ------------ | ------------ |
| **Application (client) ID**  | The Application ID, also known as the client ID. This is a unique identifier for your Azure application.  |
| **Object ID**     | The Object ID is the unique identifier for the application in Azure AD.  |
| **Directory (tenant) ID**    | The Directory ID is the unique identifier for your Azure AD tenant.  |
| **Secret Value**    | The Secret Value is the value of the client secret you created in the previous steps.  |

#### Configure Microsoft Entra ID with Users and Groups


13. Navigate to the [Microsoft Entra ID Groups page](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups/menuId/AllGroups). You can use existing groups or create new ones. In this guide, we will create four new groups for testing purposes.


14. Select **New Group** and assign a name to the new group. Repeat this step to create the remaining groups. Use the following names for the groups:
  - `palette_tenant_admins`
  - `palette_default_project_admins`
  - `k8s_cluster_admins`
  - `k8s_cluster-editor`

 
15. Record for future steps the group name and **Object ID** of each group. You will use this information in future steps to configure Palette. 

#### Add & Edit Entra ID Users for Testing 

16. Open the [Users](https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers/menuId/) page in Microsoft Entra ID. You will create three test users in Microsoft Entra ID for testing purposes.

17. Click on **New User** and assign a name to the new user. Repeat this step to create the remaining users. Use the following information for the users:

- Create the new user **Defaultprojectadmin** with the following inputs:
      - User principal name example: `defaultprojectadmin@SpectroCloud500.onmicrosoft.com`  
      - Display name example: `defaultprojectadmin`
      - Browse to Properties, Edit First Name: `DefaultProject`
      - Browse to Properties, Edit Last Name: `Admin`
      - Browse to Properties, add Email: `defaultprojectadmin@SpectroCloud500.onmicrosoft.com`  
      - Add this account to the Entra ID group `Palette_default_project_admins`

-	Create the new user **Test User** with the following inputs:
      - User principal name example: `testuser@SpectroCloud500.onmicrosoft.com`    
      - Display name example: Test `User`
      - Browse to Properties, Edit First Name: `Test`
      - Browse to Properties, Edit Last Name: `User`
      - Browse to Properties, add Email: `testuser@SpectroCloud500.onmicrosoft.com`
      - Do not add this account to any groups 

- Create an external user with your corporate/personal email account:
      - User principal name example: your corporate email address  
      - Display name example: Your First Name and Last Name
      - Browse to Properties, Edit First Name
      - Browse to Properties, Edit Last Name
      - Browse to Properties, add your corporate email address
      - Add this account to the Entra ID Group `palette_tenant_admins`
        
18.	Change your Entra ID admin account with group membership. This is the account you used to create the **App** in Microsoft Entra ID. Add the following groups to this account, `palette_tenant_admins` and `k8s_cluster_admins`. 



#### Configure Palette SSO 

19. At this point should have at least four Entra ID user objects, including the admin account used to access first access Entra ID. Your Palette tenant will need information from Microsoft to complete the OIDC setup. Navigate back to the browser tab with Palette open.

20. From the left **Main Menu** select **Users and Teams**. Next, choose **Teams** and then select **Create New Team**.

21. Create four Palette teams with each team named after the **Entra ID Group ID*** you created in the previous steps.  Use the table below as an example reference.

| Palette Team Name is the Entra Group ID | Entra ID Group Name     |  
|-------------------|-------------------------------------------------|
| `e3ac07cc-bd12-4edc-92a4-983d783153ba` | `palette_tenant_admins`     |  
| `88f61c49-1dd1-40c3-a820-68a513a38725` |  `palette_default_project_admins` |   
| `3f33c3a5-e0af-4ef6-9671-c7545fe264f3` |  `k8s_cluster_admins`     |      
| `c4606295-e8b0-4df0-891b-de4428d7e54f` |  `k8s_cluster-editor`     |    

22. Assign the following **Roles** to each Palette team. For example purposes, the same Entra Group ID values used in the table above are used in the table below.

| Palette Team Name | Role    | Entra ID Group Name |
|-------------------|---------| ------------------- |
| `e3ac07cc-bd12-4edc-92a4-983d783153ba` |  Tenant Admin     |   `palette_tenant_admins` |
| `88f61c49-1dd1-40c3-a820-68a513a38725` |  Project Admin   |   `palette_default_project_admins` |
| `3f33c3a5-e0af-4ef6-9671-c7545fe264f3` |  No role assigned    |   `k8s_cluster_admins` |
| `c4606295-e8b0-4df0-891b-de4428d7e54f` |  No role assigned   |  `k8s_cluster-editor` |

Refer to the images below to ensure you have the correct settings.

  ![Example of IDs](/oidc-entra-id-images/ba_tenantadmin.png)


  ![Example of IDs with Palette roles attached to a team](/oidc-entra-id-images/25_def_project_admin.png)


#### Palette SSO OIDC Configuration

23. Navigate to left **Main Menu**, select **Tenant Settings**. Next and click on **SSO** and select the **OIDC** tab. 

We will enter the following information:

| Palette Parameter                 | Value                                                             |
|-------------------------|--------------------------------------------------------------------|
| Issuer URL        | https://sts.windows.net/[Directory(tenant)ID]
| Client ID         | Application (client) ID from Entra ID|
| Client Secret     | The shared secret that you generated under **Certificates & secrets** blade in Entra ID |
| Default Teams     | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group. |
| Scopes            | Keep `openid`, `profile` and `email` as the default. Add `allatclaims` |
| Email             | Keep `email` as the default.  |

Using this example, our inputs are:

| Palette Parameter                 | Value                                                             |
|-------------------------|--------------------------------------------------------------------|
| Issuer URL        | `https://sts.windows.net/3077b90b-275e-4ace-b9c8-e40be0cdaafb`
| Client ID         | e8ab7251-e836-4a63-be41-1ac1966fa92e|
| Client Secret     | ECFxxxxxxxxxxxxxxxxxxxxxxxxx |
| Default Teams     | [Leave Blank] |
| Scopes            | Keep `openid`, `profile` ,`email` and `allatclaims` |
| Email             | Keep `email` as the default.  |

Leave other fields with the default values and click **Enable**.
<br />

![Example of Palette with populated input fields](/oidc-entra-id-images/enable.png)

Palette will provide a message that **OIDC configured successfully**.

## Validate

1. Log in to Palette through SSO with each Entra ID user created/modified above.  

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field. Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without SSO. Click on the **Sign in** button to log in via SSO.

3. If this is the first time you are logging in with SSO, you will be redirected to the Entra ID login page. Depending on your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).


  :::info
  Make sure you log in as a user that is a member of the `palette-tenant-admins` group in Entra ID. Once authenticated, you will automatically be redirected back to Palette and logged into Palette as that user.
  :::

<br />

**Troubleshooting**

Add the following redirect URIs to Microsoft Entra App to enable integration with the Kubernetes Dashboard:

You can also add additional redirect URIs. The URIs in the table below are useful when you want to use Entra ID for OIDC authentication into your Kubernetes clusters.

  | URL | Type of Access |
  | --- | --- |
  | `http://localhost:8000` | Using kubectl with the kube-login plugin from a workstation. |
  | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard. |




## Enable OIDC in Kubernetes Clusters

This section describes how to enable - Entra ID SSO authentication to access a Kubernetes cluster.

1. From the sidebar menu, select **Tenant Settings** and ensure the **Tenant Admin** from dropdown is selected.

2. Go to **Profiles** from within Tenant Admin or a Project and select an existing Cluster Profile. Alternatively, if a Cluster Profile does not exist, create a new Cluster Profile with a CNCF Kubernetes distribution. Once you select a profile, you will see the Infrastructure layers in the picture.

3. Choose the **Kubernetes** layer and select the **Pack Values** to modify.

4. The Pack Version Settings are exposed with the appropriate privileges (Tenant Admin). Notate the following **Variable** within the pack settings.

#### Configuring the Application OpenID Configuration in the Cluster

1.  Go to the **Kubeadminconfig**:**apiServer**:**extraArgs** section of the pack layer. 

    - **oidc-groups-claim** - "Groups" 
    - **oidc-username-claim** - "Email" 
    - **oidc-issuer-url** -  "Issuer's URL" 
    - **oidc-client-id** - "Client ID" 

Here is an example with of a an Entra ID configuration to configure SSO in a Kubernetes cluster:
       ![kubeadminconfig](/oidc-azure-images/kubeadmconfig.png)


2.  Next, find the **clientConfig** section and modify the following parameters:

    - **oidc-issuer-url** - This is the provider URL which allows the Palette to discover public signing keys.
    - **oid-client-id** - The client ID is found under the Application Registration/Enterprise Application.
    - **oidc-client-secret** - The secret provided by - Entra ID. 
    - **oidc-extra-scope** - The scope tags. 

![Palette OIDC configuration steps](/oidc-azure-images/client-config.png)
 
#### Binding the Cluster Admin Role AD to Cluster Admin via RBAC

Configure the Role Based Access Control Pack (RBAC).
#### Adding an RBAC Pack

1. Under **Tenant Admin**, create an **RBAC Cluster** profile.  
2. Go to **Cluster Profile** > +**Add Cluster Profile** and complete the Basic Information. 
3. Enter the **Name**, **Version**, and **Description** (Optional) and click **Next**.  
4. Under **Type**, select **+Add-on New Pack**. 
5. Select **Authentication** as the Pack Type. 
6. From the **Registry** dropdown, click **Public Repo**. 
7. Choose **Spectro RBAC** as the Pack Name. 
8. Select the Pack Version. 
9. Click the **spectro-rbac 1.0.0** Pack Values to edit the pack layer settings. 
   **Note**: This is where you will edit the role settings. 
10. Click the **Confirm & Create** button. 

#### Editing the RBAC Cluster Profile

1. From Palette, go to **Profiles** and choose the **RBAC** cluster profile. 
2. Click the layer image and specify the ClusterRoleBindings. 
3. Go to the **clusterRoleBindings**:**role** section and type **cluster-admin**. 
4. Change the settings to your requirements and specific groups. 

For - Entra ID integration with RBAC, edit your RBAC pack value to below. Or, copy and paste the entire block to your RBAC pack and modify you inputs where appropriate:

```yml
pack:
  spectrocloud.com/install-priority: "0"
charts:
  spectro-rbac:
    # Specify one or more ClusterRoleBinding
    # Note that the _name_ attribute is optional
    clusterRoleBindings:
      - role: cluster-admin
        name: bind-cluster-admin-role-to-cluster-admin
        subjects:
          #- type: User
            #name: user5
          - type: Group
          # For "name", input the - Entra ID Group ID name and add a comment on what the - Entra ID displayname is that corresponds to the - Entra ID Group Name
          # Example: - Entra ID Group Object Id "70d19fd6-####-####-####-##c6c915e301" is tied to the - Entra ID Security Group with the display name of "cluster-admin-role".
          # name: "- Entra ID GROUP ID NAME"
            name: "INSERT - Entra ID GROUP ID For Cluster Admins"
      - role: admin
        name: bind-admin-role-to-admin
        subjects:
          #- type: User
            #name: user5
          - type: Group
          # For "name", input the - Entra ID Group ID name and add a comment on what the - Entra ID displayname is that corresponds to the - Entra ID Group Name
          # Example: - Entra ID Group Object Id "064f2e40-####-####-####-##b9f7927976" is tied to the - Entra ID Security Group with the display name of "admin-role".
          # name: "- Entra ID GROUP ID NAME"
            name: "INSERT - Entra ID GROUP ID For Admins"
      - role: view
        name: bind-view-role-to-view
        subjects:
          #- type: User
            #name: user6
          - type: Group
          # For "name", input the - Entra ID Group ID name and add a comment on what the - Entra ID displayname is that corresponds to the - Entra ID Group Name
          # Example: - Entra ID Group Object Id "732edc96--####-####-####-##851dee3380" is tied to the - Entra ID Security Group with the display name of "view-role".
          # name: "- Entra ID GROUP ID NAME"
            name: "INSERT - Entra ID GROUP ID For Viewers"
          #- type: ServiceAccount
            #name: group6
            #namespace: foo
      - role: edit
        name: bind-edit-role-to-edit
        subjects:
          #- type: User
            #name: user6
          - type: Group
          # For "name", input the - Entra ID Group ID name and add a comment on what the - Entra ID displayname is that corresponds to the - Entra ID Group Name
          # Example: - Entra ID Group Object Id "21b55c08-6-####-####-####-##a3e2245ad7" is tied to the - Entra ID Security Group with the display name of "edit-role".
          # name: "- Entra ID GROUP ID NAME"
            name: "INSERT - Entra ID GROUP ID For Edit"
          #- type: ServiceAccount
            #name: group6
            #namespace: foo
    #namespaces:
      # Specify one or more RoleBindings
      #- namespace: team1
        #createNamespace: true
        #roleBindings:
          #- role: admin
            #name: special-override-name-admin-role
            #kind: ClusterRole
            #subjects:
              #- type: User
                #name: user3
              #- type: Group
                #name: team1namespaceadmin
          #- role: view
            #kind: ClusterRole
            #subjects:
              #- type: User
                #name: user4
              #- type: Group
                #name: team1namespaceview
      #- namespace: team2
        #createNamespace: true
        #roleBindings:
          #- role: admin
            #name: special
            #kind: ClusterRole
            #subjects:
              #- type: User
                #name: user1
              #- type: Group
                #name: group1
```

**Example**:

**- Entra ID Group Object ID** "70\*\*\*\*\*\*\-355a-453b-aadf-\*\*\*\*\*\*\*\*\*301" is linked to the **- Entra ID Security Group** with the display name of **cluster-admin-role**.

**name**: "- Entra ID GROUP ID NAME"

![Azure OIDC details view](/oidc-azure-images/client-config.png)


## References

- [Palette User Management](../user-management.md)
- [Palette SSO](./saml-sso.md)
- [Microsoft Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc) 
- [Credential Plugin Diagram](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg)
- [kubelogin](https://github.com/int128/kubelogin)