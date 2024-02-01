---
sidebar_label: "Palette SSO with Microsoft Entra ID"
title: "Enable SSO with Microsoft Entra ID"
description: "Learn how to set up Palette SSO with Microsoft Entra ID"
hide_table_of_contents: false
sidebar_position: 120
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "entra-id", "azure-ad"]
---

Single Sign-On (SSO) is an authentication method that enables users to log in to multiple applications and websites with
one set of credentials. SSO uses Secure Socket Layer (SSL) certificates to establish and maintain trust between the
Service Provider (SP) and an Identity Provider (IDP).

OpenID Connect (OIDC) lets developers authenticate users across websites and apps without owning and managing password
files. This technology allows Palette to verify the identity of the person currently using the browser or application.

In October 2023, Microsoft renamed
[Azure Active Directory](https://learn.microsoft.com/en-us/entra/fundamentals/new-name) to Microsoft Entra ID. For the
purposes of this guide, please consider Microsoft Entra ID and Azure Active Directory to be synonymous. Microsoft Entra
ID securely manages anything to do with the user's information, access, and the trust relationships between parties in a
flow. It authenticates the user's identity, grants, and revokes access to resources, and issues tokens.

This document will guide you on deploying and enabling SSO with Microsoft Entra based on OpenID Connect for integration
with Palette and Kubernetes clusters.

:::tip

If you want to enable OIDC at the Kubernetes cluster level, refer to the
[Enable OIDC in Kubernetes Clusters](#enable-oidc-in-kubernetes-clusters) section.

:::

## Enable OIDC SSO in Palette

Use the following steps to enable OIDC SSO in Palette with Microsoft Entra ID.

### Prerequisites

- Palette or Palette VerteX version 4.0.X or greater.

- A [Microsoft Entra ID](https://entra.microsoft.com/#home) subscription. You will need an account with one of the
  following roles: Global Administrator, Cloud Application Administrator, or Application Administrator. Alternatively,
  you may be the owner of the service principal.

- If you want to use the same Microsoft Entra ID application for OIDC-based SSO in your Kubernetes cluster itself, you
  need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle retrieval of
  access tokens for your cluster.

### Configure Microsoft Entra ID with Palette

1.  Log in to [Palette](https://console.spectrocloud.com) as a **Tenant Admin**.

2.  Navigate to the left **Main Menu** and select **Tenant Settings**. From the **Tenant Menu**, select **SSO**, then
    **Configure**, and lastly, click on the **OIDC** tab.

    ![A view of the callback URL field](/oidc-entra-id-images/oidcallback.png)

3.  Copy the **Callback URL** to your clipboard. This URL will be used in the next step to configure Microsoft Entra ID.

4.  In a separate browser tab, log in to the Microsoft Entra ID Admin console and open the
    [App registration blade](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).

5.  Click on **New registration** and assign a name to the new registration. In this guide, the example app registration
    is named _palette_oidc_.

6.  Next, select **Web**, and paste the _Palette Callback URL_ value from your clipboard into the **Redirect URL
    (optional)** field, and Click **Register**.

    ![Azure application creation screen](/oidc-entra-id-images/palette-registration.png)

7.  From the app overview page, navigate to the left **Main Menu** and select **Certificates & secrets**. In the
    following screen, click on **New client secret**.

8.  Add a description for the secret and select an expiration period. Click on **Add** to create the secret.

    :::warning

    We recommend you store the secret value in a secure location, such as a password manager. You will need this value
    later when you configure Palette.

    :::

9.  From the application overview page, navigate to the left **Main Menu** and select **Token configuration**.

10. Select **Add optional claim** button. Choose **Token type** as **ID**, and add the claims **email** and
    **preferred_username**. When finished, click the **Add** button.

    ![Add a claim button](/oidc-entra-id-images/twooptionalclaims.png)

11. In addition to allowing individual user authentication, Palette provides group claim functionality, allowing an
    OpenID Connect identity provider, like Microsoft Entra ID, to identify the user's Entra ID group membership within
    Palette. To enable group membership, select the **Add groups claim** button. Then select **Security groups**, and
    **Group ID** for each property: **ID**, **Access** and **SAML**.

    ![Groups and inviduals can be assigned a group membership in Azure](/oidc-entra-id-images/groupsclaim.png)

    When completed, the **Token Configuration** page will look similar to the image below.

    ![A view of the token configuration screen](/oidc-entra-id-images/token-configuration.png)

12. From the application overview page, navigate to the left **Main Menu** and select the **Overview** tab. From the
    **Overview** selection, save the following fields for the next steps in you will complete in Palette.

    | Field                       | Description                                                                                                |
    | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
    | **Application (client) ID** | The Application ID is also known as the client ID. This is a unique identifier for your Azure application. |
    | **Object ID**               | The Object ID is the unique identifier for the application in Azure AD.                                    |
    | **Directory (tenant) ID**   | The Directory ID is the unique identifier for your Azure AD tenant.                                        |
    | **Secret Value**            | The Secret Value is the value of the client secret you created in the previous steps.                      |

      <details>

    <summary>Additional Redirect URLs</summary>

          You can also add additional redirect URIs if needed. For example, to enable integration with the Kubernetes Dashboard,
          add the following redirect URI to the list of redirect URIs in the Azure AD application:

          | URL | Type of Access |
          | --- | --- |
          | `http://localhost:8000` | UsUseing kubectl with the kube-login plugin from a workstation |
          | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Use OIDC to authenticate and log in to the Kubernetes Dashboard |

      </details>

#### Configure Microsoft Entra ID with Users and Groups

13. Navigate to the
    [Microsoft Entra ID Groups page](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups/menuId/AllGroups).
    You can use existing groups or create new ones. In this guide, we will create four new groups for testing purposes.

14. Select **New Group** and assign a name to the new group. Repeat this step to create the remaining groups. Use the
    following names for the groups:

    - `palette_tenant_admins`
    - `palette_default_project_admins`
    - `k8s_cluster_admins`
    - `k8s_cluster-editor`

15. Record each group's group name and **Object ID** for future steps. You will use this information in future steps to
    configure Palette.

#### Add & Edit Entra ID Users for Testing

16. Open the
    [Users](https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers/menuId/)
    page in Microsoft Entra ID. You will create three test users in Microsoft Entra ID for testing purposes.

17. Click on **New User** and assign a name to the new user. Repeat this step to create the remaining users. Use the
    following information for the users:

    - Create the new user **Defaultprojectadmin** with the following inputs: - User principal name example:
      `defaultprojectadmin@SpectroCloud500.onmicrosoft.com`

      - Display name example: `defaultprojectadmin` - Browse to Properties, Edit First Name: `DefaultProject` - Browse
        to Properties, Edit Last Name: `Admin` - Browse to Properties, add Email:
        `defaultprojectadmin@SpectroCloud500.onmicrosoft.com`
      - Add this account to the Entra ID group `Palette_default_project_admins`

    - Create the new user **Test User** with the following inputs:

      - User principal name example: `testuser@SpectroCloud500.onmicrosoft.com`
      - Display name example: Test `User`
      - Browse to Properties, Edit First Name: `Test`
      - Browse to Properties, Edit Last Name: `User`
      - Browse to Properties, add Email: `testuser@SpectroCloud500.onmicrosoft.com`
      - Do not add this account to any groups

    - Create an external user with your corporate/personal email account: - User principal name example: your corporate
      email address
      - Display name example: Your First Name and Last Name - Browse to Properties, Edit First Name - Browse to
        Properties, Edit Last Name - Browse to Properties, add your corporate email address - Add this account to the
        Entra ID Group `palette_tenant_admins`

18. Add your Entra ID admin account, the account you used to create the **App** in Microsoft Entra ID, to the following
    groups: `palette_tenant_admins` and `k8s_cluster_admins`.

#### Configure Palette SSO

19. At this point, you should have at least four Entra ID user objects, including the admin account in Entra ID. Your
    Palette tenant will need information from Microsoft to complete the OIDC setup. Navigate back to the browser tab
    with Palette open.

20. From the left **Main Menu** select **Users and Teams**. Next, choose **Teams** and then select **Create New Team**.

21. Create four Palette teams, with each team named after the **Entra ID Group ID\*** you created in the previous steps.
    Use the table below as an example reference.

    | Palette Team Name is the Entra Group ID | Entra ID Group Name              |
    | --------------------------------------- | -------------------------------- |
    | `e3ac07cc-bd12-4edc-92a4-983d783153ba`  | `palette_tenant_admins`          |
    | `88f61c49-1dd1-40c3-a820-68a513a38725`  | `palette_default_project_admins` |
    | `3f33c3a5-e0af-4ef6-9671-c7545fe264f3`  | `k8s_cluster_admins`             |
    | `c4606295-e8b0-4df0-891b-de4428d7e54f`  | `k8s_cluster-editor`             |

22. Assign the following **Roles** to each Palette team. For example purposes, the same Entra Group ID values used in
    the table above are used in the table below.

    | Palette Team Name                      | Role             | Entra ID Group Name              |
    | -------------------------------------- | ---------------- | -------------------------------- |
    | `e3ac07cc-bd12-4edc-92a4-983d783153ba` | Tenant Admin     | `palette_tenant_admins`          |
    | `88f61c49-1dd1-40c3-a820-68a513a38725` | Project Admin    | `palette_default_project_admins` |
    | `3f33c3a5-e0af-4ef6-9671-c7545fe264f3` | No role assigned | `k8s_cluster_admins`             |
    | `c4606295-e8b0-4df0-891b-de4428d7e54f` | No role assigned | `k8s_cluster-editor`             |

Refer to the images below to ensure you have the correct settings.

    ![Example of IDs](/oidc-entra-id-images/ba_tenantadmin.png)


    ![Example of IDs with Palette roles attached to a team](/oidc-entra-id-images/25_def_project_admin.png)

#### Palette SSO OIDC Configuration

23. Navigate to left **Main Menu**, select **Tenant Settings**. Next, click on **SSO** and select the **OIDC** tab.

24. You will now configure the OIDC settings in Palette. Use the table below as a reference and populate the fields with
    the information you saved from the previous steps.

| Field             | Description                                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Issuer URL**    | Add your tenant URL. The tenant URL looks like the following but with your unique tenant ID at the end `https://sts.windows.net/[**Directory (tenant) ID**]`                                                                 |
| **Client ID**     | The application ID from Entra ID                                                                                                                                                                                             |
| **Client Secret** | The application secret you created                                                                                                                                                                                           |
| **Default Teams** | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group |
| **Scopes**        | Add `openid`, `profile` and `email`.                                                                                                                                                                                         |
| **Email**         | Use `email` as the default value                                                                                                                                                                                             |

25. Leave other fields with the default values and click **Enable**. If all required values are provided, you will
    receive a message stating that OIDC is configured successfully.

    ![Example of Palette with populated input fields](/oidc-entra-id-images/enable.png)

You have now successfully configured OIDC SSO in Palette. Next, validate the configuration by logging in to Palette with
an Entra ID user account.

### Validate

1. Log out of Palette. To log out, click on **User Menu** in the top right corner of the screen and select **Sign Out**.

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field. If
   this is your first time logging in with SSO, you will be redirected to the Entra ID login page. Depending on your
   organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication). Make
   sure you log in as a user who is a member of the `palette-tenant-admins` group in Entra ID. Once authenticated, you
   will automatically be redirected back to Palette and logged into Palette as that user.

3. Navigate to the left **Main Menu** and ensure the **Tenant Settings** option is available. If you do not see the
   **Tenant Settings** option, you are not logged in as a user who is a member of the `palette-tenant-admins` group in
   Entra ID.

:::tip

Below the **Sign In** button, there is a link titled **SSO issues? --> Use your password**. The link can be used to
bypass SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette
without SSO.

:::

## Enable OIDC in Kubernetes Clusters With Entra ID

Kubelogin is a kubectl plugin for Kubernetes OpenID Connect (OIDC) authentication. When you use kubectl, kubelogin opens
up your browser, starts a session, and redirects you to your IDP's login site. Upon a succesfull login, you receive an
authentication token that is used to grant you access to the cluster.

In the following diagram, Entra ID is the IDP. Once Kubelogin gets a token from Entra ID or similar IDP, you can then
use kubectl to access the Kubernetes cluster API.

    ![Palette and EntraID](/oidc-entra-id-images/PalettewEntraID.png)

Use the following steps to enable OIDC in Kubernetes clusters with Microsoft Entra ID.

### Prerequisites

- Palette or Palette VerteX version 4.0.X or greater.

- OIDC configured in Palette with Microsoft Entra ID. Refer to the
  [Enable OIDC SSO in Palette](#enable-oidc-sso-in-palette) section for detailed guidance on how to configure OIDC in
  Palette.

- Install [kubelogin](https://github.com/Azure/kubelogin) your local workstation.

### Create Cluster Profile With RoleBindings

This section describes how to enable Entra ID SSO authentication to access a Kubernetes cluster.

1. Log in to [Palette](https://console.spectrocloud.com) as a **Tenant Admin**.

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Create a new Cluster Profile of the type **Full**. Select an OS, and proceed to the Kubernetes selection step.

4. Choose the **Kubernetes** layer and click on **Values** to modify the pack YAML values.

5. Navigate to the `kubeadminconfig.apiServer.extraArgs` section of the pack layer. Modify the following parameters:

   | Parameter               | Description                                                                                                                                |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
   | **oidc-username-claim** | The claim to use as the user name. This is the claim that will be used to identify the user in Kubernetes                                  |
   | **oidc-groups-claim**   | The claim to use as the user's group membership. This is the claim that will be used to identify the user's group membership in Kubernetes |
   | **oidc-issuer-url**     | The URL of the OIDC provider                                                                                                               |
   | **oidc-client-id**      | The client ID for the OIDC provider. This is the client ID that will be used to authenticate to the OIDC provider                          |

   ```yaml hideClipboard
   kubeadminconfig:
     apiServer:
       extraArgs:
         oidc-groups-claim: "groups"
         oidc-username-claim: "email"
         oidc-issuer-url: "https://sts.windows.net/************"
         oidc-client-id: "**************"
   ```

6. Next, find the `clientConfig` section and modify the following parameters with the values you saved when you created
   the Azure Entra ID application.

   | Parameter              | Description                                                                                                               |
   | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
   | **oidc-issuer-url**    | The URL of the OIDC provider                                                                                              |
   | **oidc-client-id**     | The client ID for the OIDC provider. This is the client ID that will be used to authenticate to the OIDC provider         |
   | **oidc-client-secret** | The client secret for the OIDC provider. This is the client secret that will be used to authenticate to the OIDC provider |
   | **oidc-extra-scope**   | The scope tags                                                                                                            |

   ```yaml hideClipboard
   clientConfig:
     oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
     oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
     oidc-client-secret: "**************************"
     oidc-extra-scope: "profile,email"
   ```

7. Complete the remaining steps to create the cluster profile. Once you have specified the container network interface
   and the storage container interface, select **Add New Pack** to add the RBAC addon pack.

8. Select the **Spectro RBAC** from the **Public Repo** or the **Palette Registry**.

9. Select the latest version and click on the **Values** button to modify the pack YAML values.

10. Navigate to the `clusterRoleBindings` section of the pack layer. For Entra ID integration with RBAC, edit your RBAC
    pack values to match the YAML snippet below. Or, copy and paste the entire block to your RBAC pack and modify you
    inputs where appropriate. Replace all the `name` fields that start with the value `INSERT` with the Entra groups' ID
    you created in Azure.

    ```yml {17,27,37,50}
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

    You are matching the out-of-the-box Kubernetes roles _cluster-admin_, _admin_, _view_, and _edit_ to the Entra ID
    groups you created in the previous steps. Members of the Entra ID group will be assigned the corresponding
    Kubernetes role. For example, members of the Entra ID group `k8s_cluster_admins` will be assigned the Kubernetes
    role `cluster-admin`. You can change the YAML and use _roleBindings_ to assign roles to specific namespaces versus
    using a _clusterRoleBinding_ to assign roles to the entire cluster.

11. Click on **Confirm & Create** to proceed with the cluster profile creation. Click on **Next** to proceed to the
    **Review** step.

12. Review the cluster profile settings and click on **Finish Configuration** to create the cluster profile.

You now have a cluster profile that will use Entra ID SSO authentication to access a Kubernetes cluster. You can now
create a cluster using this profile. You will be redirected to the Entra ID login page when you log in to the cluster.
Depending on your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor
Authentication).

### Validate

You can validate the Entra ID SSO integration by deploying a Kubernetes cluster with the cluster profile you created in
the previous steps. Once the cluster is deployed, you can log in to the cluster by using kubectl with the kube-login
plugin from a workstation that has kubelogin installed.

1. Log in to [Palette](https://console.spectrocloud.com) as a user who is a member of one of the Entra ID groups you
   created in the previous steps.

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Deploy a cluster using the cluster profile you created in the previous steps. Check out the tutorial
   [Deploy a Cluster](../../clusters/public-cloud/deploy-k8s-cluster.md) for detailed guidance on how to deploy a
   cluster.

4. Once the cluster is deployed, select the cluster from the cluster list view to access the cluster details page.

5. Download the kubeconfig file for the cluster.

6. Configure kubectl to use the kubeconfig file you downloaded in the previous step. Refer to the
   [Configure kubectl](../../clusters/cluster-management/palette-webctl.md) documentation for detailed guidance on how
   to configure kubectl.

7. Issue a kubectl command to access the cluster. For example, you can issue the following command to view the nodes in
   the cluster.

   ```shell
   kubectl get pods --all-namespaces
   ```

8. You will be redirected to the Entra ID login page. Depending on your organization's SSO settings, this could be a
   simple login form or require MFA (Multi-Factor Authentication).

9. Once you have successfully authenticated, you will be redirected back to the terminal and the kubectl command will be
   issued.

A list of pods in the cluster will be displayed if everything is configured correctly. If you are not able to access the
cluster, check the kubeconfig file to ensure the OIDC configuration is correct. Also, make sure you have
[kubelogin](https://github.com/Azure/kubelogin) installed on your workstation. Refer to the
[Configure kubectl](../../clusters/cluster-management/palette-webctl.md) documentation for detailed guidance on how to
configure kubectl.

## Resources

- [Credential Plugin Diagram](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg)
- [kubelogin](https://github.com/int128/kubelogin)
- [Microsoft Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc)
- [Palette SSO](./saml-sso.md)
- [Palette User Management](../user-management.md)
