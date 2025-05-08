---
sidebar_label: "Palette SSO with Microsoft Entra ID"
title: "Enable SSO with Microsoft Entra ID"
description: "Learn how to set up Palette SSO with Microsoft Entra ID"
hide_table_of_contents: false
sidebar_position: 120
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "entra-id", "azure-ad", "rbac"]
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
flow. It authenticates the user's identity, grants and revokes access to resources, and issues tokens.

This document will guide you on deploying and enabling SSO with Microsoft Entra based on OIDC for integration with
Palette and Kubernetes clusters.

:::tip

If you want to enable OIDC at the Kubernetes cluster level, refer to the
[Enable OIDC in Kubernetes Clusters](#enable-oidc-in-kubernetes-clusters-with-entra-id) section.

:::

## Enable OIDC SSO in Palette

Use the following steps to enable OIDC SSO in Palette with Microsoft Entra ID.

### Prerequisites

- Palette or Palette VerteX version 4.0.X or greater.

- For Microsoft Entra ID to work correctly with Palette, you must enable HTTPS and configure TLS.

- A [Microsoft Entra ID](https://entra.microsoft.com/#home) subscription. You will need an account with one of the
  following roles: Global Administrator, Cloud Application Administrator, or Application Administrator. Alternatively,
  you may be the owner of the service principal.

- If you want to use the same Microsoft Entra ID application for OIDC-based SSO in your Kubernetes cluster itself, you
  need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle retrieval of
  access tokens for your cluster.

- Palette requires the following claims to be present in the OIDC token:

  | Claim Name       | Default Value        | Description                                            |
  | ---------------- | -------------------- | ------------------------------------------------------ |
  | **Email**        | `preferred_username` | The user's login name in email address form.           |
  | **First Name**   | `given_name`         | The user's first name.                                 |
  | **Last Name**    | `family_name`        | The user's last name.                                  |
  | **Spectro Team** | `groups`             | The user's group memberships in the Identity Provider. |

  Change the claim names in your IdP if they are different from the default values. Valid options for the "Email" claim
  or `email` or `preferred_username`.

  :::tip

  We recommend using `preferred_username` as this field will always be populated and match the user's login name for
  Entra. The `email` field might not always be populated and/or might not match the user's Entra login name, hence this
  typically isn't the best option.

  :::

  :::tip

  If the OIDC token does not contain these claims, or if you have a large number of groups, enable the **Use userinfo
  endpoint** option in the OIDC configuration to allow Palette to fetch the claims from the user information endpoint,
  instead of from the size-limited ID token.

  :::

- Entra ID returns the group membership in the form of group IDs by default (such as
  `a99cb9c2-b9df-4363-b91e-feb1a68670cd`), not group names. This can present some usability challenges, as names of
  Teams in Palette would need to use those IDs in order to enable automatic membership. We will be adding a description
  field to Teams to make this scenario easier to live with. Depending on your environment, you may have options to make
  Entra send group names instead of IDs:
  - If your groups were synchronized from an on-premise Active Directory environment, the groups contain a
    `sAMAccountName` property that typically has a friendlier value. For such groups, you can configure groups claim on
    the `palette-oidc` App Registration to send the `sAMAccountName` instead of the Group ID. Note that this does NOT
    work for cloud-based groups that were created in Entra directly.
  - If your Azure subscription includes Entra P1 (or higher), you can opt to assign groups to the `palette-oidc`
    Enterprise Application and then adjust the `palette-oidc` App Registration's manifest to make Entra send those
    groups by name instead of by ID. This approach however only is possible when you both have at least an Entra P1
    subscription and you assign groups to the `palette-oidc` Enterprise Application.

### Configure Microsoft Entra ID with Palette

1. Log in to [Palette](https://console.spectrocloud.com) as a **Tenant Admin**.

2. Navigate to the left main menu and select **Tenant Settings**. From the **Tenant Menu**, select **SSO**, and on the
   **Configure** tab, choose **OIDC**.

3. Copy the **Callback URL** to your clipboard. This URL will be used in step 14 to configure the Microsoft Entra ID app
   registration.

4. In a separate browser tab, log in to the Microsoft Entra ID Admin console and open the
   [App registration blade](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).

5. Click on **New registration** and assign a name to the new registration. In this guide, the example app registration
   is named `palette-oidc`.

6. Click **Register**.

7. From the app overview page, navigate to the left main menu and select **Certificates & secrets**. On the following
   screen, click on **New client secret**.

8. Add a description for the secret and select an expiration period. Click on **Add** to create the secret.

   :::warning

   We recommend you store the secret value in a secure location, such as a password manager. You will need this value
   later when you configure Palette.

   :::

9. From the application overview page, navigate to the left main menu and select **Token configuration**.

10. Select the **Add optional claim** button. Choose **Token type** as the **ID**, and add the claims `email`,
    `family_name`, `given_name` and `preferred_username`. When finished, click the **Add** button.

    ![Add a claim button](/oidc-entra-id-images/user-management_saml-sso_palette-sso-with-entra-id-twooptionalclaims.webp)

    :::info

    If you are still using
    [Entra v1 ID tokens](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#v10-and-v20-tokens),
    the claims `family_name` and `given_name` are already included in v1 tokens and do not need to be added.

    :::

11. In addition to allowing individual user authentication, Palette provides group claim functionality, allowing
    Microsoft Entra ID to specify the user's group membership, which gets matched to membership of Teams within Palette.

    To enable passing of group membership info, select the **Add groups claim** button. The correct type of groups claim
    depends on your scenario:

    - Selecting **Security groups** will make Entra list membership of security groups in the OIDC ticket. By default
      Entra will send these groups by **Group ID**, not by name. If your security groups are synchronized into Entra
      from on-premise Active Directory, you will have the option to have Entra send the groups by **sAMAccountName**
      instead. Note that this will NOT work for any groups created in Entra directly.
    - Alternatively, selecting **Groups assigned to the application** will will make Entra list membership of only
      groups that the user is both a member of AND that are assigned to the `palette-oidc` Enterprise Application. This
      approach is more suitable for when users are members of large amounts of groups. It however is only suitable to
      use when you have an Entra P1 or higher subscription, as the ability to assign groups to applications requires
      this subscription. This approach does not depend on whether groups come from Active Directory or not. By default
      Entra will also send these groups by **Group ID**, but we can adjust a setting later that makes Entra send the
      group names instead of the group IDs.

    Depending on your desired scenario, select **Security groups** or **Groups assigned to the application**.

    - If you selected **Security groups**, Entra will send the groups by Group ID. If that is ok, just click **Add** to
      complete the wizard.
      - If your security groups are coming from an on-premise Active Directory environment and you want to send the
        groups by by **sAMAccountName** instead, adjust the **Customize token properties by type** secton and select the
        `sAMAccountName` option for all three items (**ID**, **Access** and **SAML**). Then click **Add** to complete
        the wizard.
    - If you selected **Groups assigned to the application**, Entra will send the groups by Group ID. If that is ok,
      just click **Add** to complete the wizard.
      - If you want your application groups to be sent by name, click **Add** to complete the wizard and then navigate
        to the left main menu and select **Manifest**. In the JSON code, navigate to the `idToken` section and search
        for the block where `name: "groups"`. It should be lines 77-80. For this block, change
        `"additionalProperties": [],` to `"additionalProperties": ["cloud_displayname"],`. Then click **Save** at the
        top to save the manifest. The whole block should look like this:
        ```
        "idToken": [
          ...
          {
            "additionalProperties": ["cloud_displayname"],
            "essential": false,
            "name": "groups",
            "source": null
          }
        ],
        ```

    When completed, the **Token Configuration** page will look similar to the image below.

    ![A view of the token configuration screen](/oidc-entra-id-images/user-management_saml-sso_palette-sso-with-entra-id-token-configuration.webp)

12. From the application overview page, navigate to the left main menu and select **Authentication**.

13. Under **Platform configurations**, click **Add a platform** and select **Web** on the **Configure platforms**
    window.

14. Paste the **Callback URL** value obtained in step 3 into the **Redirect URIs** field, and click **Configure**.

    <details>

    <summary>Additional Redirect URLs</summary>

    You can also add additional redirect URLs if needed. For example, to enable integration with the Kubernetes
    Dashboard, add the following **Single-page application** redirect URIs to the app registration.

    | URL                                              | Type of Access                                                     |
    | ------------------------------------------------ | ------------------------------------------------------------------ |
    | `http://localhost:8000`                          | Use `kubectl` with the `kube-login` plugin from a workstation      |
    | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Use Entra ID to authenticate with OIDC to the Kubernetes Dashboard |

    </details>

15. From the application overview page, navigate to the left main menu and select the **Overview** tab. From the
    **Overview** selection, save the following fields for the next steps you will complete in Palette.

    | Field                       | Description                                                       |
    | --------------------------- | ----------------------------------------------------------------- |
    | **Application (client) ID** | The unique identifier for your Azure application.                 |
    | **Directory (tenant) ID**   | The unique identifier for your Azure AD tenant.                   |
    | **Secret Value**            | The value of the client secret you created in the previous steps. |

16. From the application overview page, navigate to the left main menu and select **API permissions**.

17. Click **Add a permission** and select **Microsoft Graph** from the **Request API permissions** window.

18. Ensure the following permissions are selected for the app.

    | **Type**  | **Category**       | **Permission** | **Admin consent required** |
    | --------- | ------------------ | -------------- | -------------------------- |
    | Delegated | OpenId permissions | `email`        | No                         |
    | Delegated | OpenId permissions | `profile`      | No                         |
    | Delegated | User               | `User.Read`    | No                         |

19. Click **Add permissions** after selecting the permissions.

20. If you select to assign groups to application, follow this procedure to set the groups that can be passed through to
    Palette. Otherwise skip this step.

    a. Navigate to the
    [Microsoft Entra ID Enterprise applications page](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview)

    b. Open the `palette-oidc` application and then open the **Users and groups** option. Click **+ Add user/group**

    c. On the **Add Assignment** page, under Users and Groups, click **None Selected**. Then click the **Groups** column
    to list groups.

    d. Select all the eligible groups that can be passed on to Palette. When ready, click **Select** at the bottom to
    confirm.

    e. Finally click **Assign** at the bottom to assign these groups to the application.

21. If you selected the default option of sending group membership by Group ID, use the following procedure to define
    Teams in Palette based on Group IDs.

    **If you will be sending groups by name, skip this step**.

    a. Navigate to the
    [Microsoft Entra ID Groups page](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups/menuId/AllGroups).

    b. Find the groups that you want to add to Palette and record each group's **Name** and **Object ID**. You will use
    this information in future steps to configure Palette.

    c. Log in to [Palette](https://console.spectrocloud.com).

    d. From the left main menu, select **Users and Teams**. Next, choose **Teams** and then select **Create New Team**.

    e. Create your Palette teams, with each team named after the **Entra ID Group ID** you recorded in step 21. The
    following table is an example configuration.

    | Palette Team Name is the Entra Group ID | Entra ID Group Name              |
    | --------------------------------------- | -------------------------------- |
    | `e3ac07cc-bd12-4edc-92a4-983d783153ba`  | `palette_tenant_admins`          |
    | `88f61c49-1dd1-40c3-a820-68a513a38725`  | `palette_default_project_admins` |
    | `3f33c3a5-e0af-4ef6-9671-c7545fe264f3`  | `k8s_cluster_admins`             |
    | `c4606295-e8b0-4df0-891b-de4428d7e54f`  | `k8s_cluster-editor`             |

    f. Assign **Roles** to each Palette team. The following table is an example configuration.

    | Palette Team Name                      | Role             | Entra ID Group Name              |
    | -------------------------------------- | ---------------- | -------------------------------- |
    | `e3ac07cc-bd12-4edc-92a4-983d783153ba` | Tenant Admin     | `palette_tenant_admins`          |
    | `88f61c49-1dd1-40c3-a820-68a513a38725` | Project Admin    | `palette_default_project_admins` |
    | `3f33c3a5-e0af-4ef6-9671-c7545fe264f3` | No role assigned | `k8s_cluster_admins`             |
    | `c4606295-e8b0-4df0-891b-de4428d7e54f` | No role assigned | `k8s_cluster-editor`             |

22. If you selected the option of sending group membership by group name, use the following procedure to define Teams in
    Palette that match those names.

    **If you will be sending groups by ID, skip this step**.

    a. Log in to [Palette](https://console.spectrocloud.com).

    b. From the left main menu, select **Users and Teams**. Next, choose **Teams** and then select **Create New Team**.

    c. Create your Palette teams, with each team named after the **Entra ID Group Name**. This is either the
    `sAMAccountName` for a security group synced in from Active Directory, or the regular group name of a group assigned
    to the `palette-oidc` Enterprise Application.

    f. Assign **Roles** to each Palette team. The following table is an example configuration.

    | Palette Team Name                | Role             |
    | -------------------------------- | ---------------- |
    | `palette_tenant_admins`          | Tenant Admin     |
    | `palette_default_project_admins` | Project Admin    |
    | `k8s_cluster_admins`             | No role assigned |
    | `k8s_cluster`                    | No role assigned |

23. Navigate to left main menu and select **Tenant Settings**. Next, click on **SSO** and select the **OIDC** tab.

24. Configure the OIDC settings in Palette. Use the table below as a reference and populate the fields with the
    information you saved from the previous steps.

    | Field             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Issuer URL**    | Refer to the [Find your app's OpenID configuration document URI](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc#find-your-apps-openid-configuration-document-uri) guide to learn how to determine your issuer URL. This will often be the same as the **Authority URL** and not contain the **Well-known configuration document path** appended. If you use Entra v2 tokens with the endpoint `https://login.microsoftonline.com/{tenant-ID}/v2.0`, ensure you added the claims `family_name` and `given_name` to the token configuration. |
    | **Client ID**     | The application ID from Entra ID.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | **Client Secret** | The application secret you created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **Default Teams** | Leave blank if you do not want users without group claims to be assigned to a default group; otherwise, enter the desired default group name. If you use this option, be careful with how much access you assign to the group.                                                                                                                                                                                                                                                                                                                                          |
    | **Scopes**        | Add `openid`, `profile` and `email`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | **Email**         | Use `email` as the default value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

25. Leave other fields with the default values and click **Enable**. If all required values are provided, you will
    receive a message stating that OIDC is configured successfully.

    ![Example of Palette with populated input fields](/oidc-entra-id-images/user-management_saml-sso_palette-sso-with-entra-id-enable.webp)

You have now successfully configured OIDC SSO in Palette. Next, validate the configuration by logging in to Palette with
an Entra ID user account.

### Validate

1. Log out of Palette. To log out, click on **User Menu** in the top right corner of the screen and select **Sign Out**.

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field. If
   this is your first time logging in with SSO, you will be redirected to the Entra ID login page. Depending on your
   organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication). Make
   sure you log in as a user who is a member of a Entra ID group that was added to Palette. Once authenticated, you will
   automatically be redirected back to Palette and logged into Palette as that user.

3. Navigate to the left main menu and ensure the **Tenant Settings** option is available. If the **Tenant Settings**
   option is not available, then you are not logged in as a user who is a member of a Entra ID group that was added to
   Palette.

   :::tip

   Below the **Sign In** button, there is a link titled **SSO issues? --> Use your password**. The link can be used to
   bypass SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette
   without SSO.

   :::

## Enable OIDC in Kubernetes Clusters With Entra ID

Kubelogin is a kubectl plugin for Kubernetes OIDC authentication. When you use kubectl, kubelogin opens up your browser,
starts a session, and redirects you to your IDP login site. Upon a successful login, you receive an authentication token
that is used to grant you access to the cluster.

Use the following steps to enable OIDC in Kubernetes clusters with Microsoft Entra ID.

### Prerequisites

- Palette or Palette VerteX version 4.0.X or greater.

- For Microsoft Entra ID to work correctly with Palette, you must enable HTTPS and configure TLS.

- OIDC configured in Palette with Microsoft Entra ID. Refer to the
  [Enable OIDC SSO in Palette](#enable-oidc-sso-in-palette) section for detailed guidance on how to configure OIDC in
  Palette.

- Install [kubelogin](https://github.com/Azure/kubelogin) your local workstation.

### Create Cluster Profile With RoleBindings

This section describes how to enable Entra ID SSO authentication to access a Kubernetes cluster.

1. Log in to [Palette](https://console.spectrocloud.com) as a **Tenant Admin**.

2. Navigate to the left main menu and select **Profiles**.

3. Create a new cluster profile of the type **Full**. Select an OS, and proceed to the Kubernetes selection step.

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
    pack values to match the YAML snippet below. Alternatively, copy and paste the entire block to your RBAC pack and
    modify you inputs where appropriate. Replace all the `name` fields that start with the value `INSERT` with the Entra
    groups' ID you created in Azure.

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
the previous steps. Once the cluster is deployed, you can log in to the cluster by using kubectl with the kubelogin
plugin from a workstation that has kubelogin installed.

1. Log in to [Palette](https://console.spectrocloud.com) as a user who is a member of one of the Entra ID groups you
   created in the previous steps.

2. Navigate to the left main menu and select **Clusters**.

3. Deploy a cluster using the cluster profile you created in the previous steps. Check out the
   [Getting Started](/getting-started/) tutorials for detailed guidance on how to deploy a cluster.

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
   simple login form or require Multi-Factor Authentication.

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
