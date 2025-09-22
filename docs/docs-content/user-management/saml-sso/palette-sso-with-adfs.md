---
sidebar_label: "Palette SSO with Microsoft AD FS"
title: "Set up Palette SSO with Microsoft Active Directory Federation Service (AD FS)"
description: "Set up Palette SSO with Microsoft Active Directory Federation Service (AD FS)"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
hiddenFromNav: false
tags: ["user-management", "saml-sso"]
---

Single sign-on (SSO) is an authentication method that enables users to log in to multiple applications and websites with
one set of credentials. SSO works upon a trust relationship established and maintained between the service provider (SP)
and an identity provider (IdP) using certificates. Palette supports SSO based on either SAML or OIDC.

The following steps will guide you to enable Palette SSO with
[Microsoft AD FS](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/ad-fs-openid-connect-oauth-concepts)
based on OIDC.

:::warning

You cannot use Microsoft AD FS for SAML-based SSO with Palette. Microsoft AD FS does not support the Canonical XML 1.1
standard that Palette employs. You can only use the OIDC-based approach for Microsoft AD FS.

:::

## Prerequisites

- For Microsoft AD FS to work correctly with Palette, you must enable HTTPS and configure TLS.

- In order to setup OIDC-based SSO with Microsoft AD FS, you need to use one of the following versions:

  - Microsoft AD FS 2022 (comes with Windows Server 2022)
  - Microsoft AD FS 2019 (comes with Windows Server 2019)
  - Microsoft AD FS 2016 (comes with Windows Server 2016)

- If you need to be able to your AD FS service from outside your corporate network, you will also need an AD FS Reverse
  Proxy. An official Microsoft tutorial for setting up an AD FS Reverse Proxy is not available, but you can use this
  blog post from
  [Matrixpost](https://blog.matrixpost.net/set-up-active-directory-federation-services-ad-fs-5-0-adfs-reverse-proxy-part-2/)
  for additional guidance.

## Enablement

### Create the AD FS Application Group for Palette

1. Open the AD FS Management console on your Windows Server and add a new Application Group for Palette:

   ![Add AD FS Application Group](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-application-group.webp)

2. Provide a suitable name for the application group and select **Server Application** from the list of templates. Then
   click **Next**:

   ![Name Application Group](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_name-application-group.webp)

3. The next screen displays the **Client Identifier** for this Application Group:

   ![Get Client Identifier](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_get-client-identifier.webp)

4. Copy the client identifier value and save it somewhere. You will need to enter this value into the Palette SSO
   configuration later.

5. Open a web browser and navigate to your Palette subscription. Navigate to **Tenant Settings** --> **SSO** and click
   **OIDC**. Click the button next to **Callback URL** to copy this value to the clipboard:

   ![Copy Callback URL](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_copy-callback-url.webp)

6. Switch back to your AD FS Management console and paste the copied value into the **Redirect URI** field, then click
   **Add** to add it to the list:

   ![Paste Redirect URI](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_paste-redirect-uri.webp)

7. Switch back to Palette in the web browser and click the button next to **Logout URL** to copy this value to the
   clipboard.

8. Switch back to your AD FS Management console and paste the copied value into the **Redirect URI** field, then click
   **Add** to add it to the list:

   ![Paste Logout URI](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_paste-logout-uri.webp)

9. These two redirect URIs are required for SSO to work with Palette. You can also add additional redirect URIs. The
   URIs in the table below are useful when you want to use AD FS for OIDC authentication into your Kubernetes clusters.

   | URL                                              | Type of Access                                              |
   | ------------------------------------------------ | ----------------------------------------------------------- |
   | `http://localhost:8000`                          | Using kubectl with the kube-login plugin from a workstation |
   | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard         |

10. When you have completed entering redirect URIs, click **Next**. On the next page of the wizard, select **Generate a
    shared secret** and click **Copy to clipboard** to copy the secret value and save it somewhere. You will need to
    enter this value into the Palette SSO configuration later:

    ![Copy Shared Secret](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_copy-shared-secret.webp)

11. Click **Next** and on the Summary screen, click **Next** again to complete the wizard. You need to add another
    application to the application group. Select the newly created application group and click **Properties**:

    ![Open Application Group](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_open-oidc-app.webp)

12. In the Properties screen, click **Add application...**. In the wizard that opens, select **Web API** and click
    **Next**:

    ![Add Web API application](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-web-api.webp)

13. In the **Identifier** field, add the following entries:

- The **Client Identifier** value you saved when creating the application group.
- The base URL of your Palette tenant. This is equal to the URL shown by your browser when logged into Palette minus the
  path. Example `https://johndoe-spectrocloud.console.spectrocloud.com`.

  ![Find Base URL](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_base-url.webp)

  ![Add Web API Identifiers](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-identifiers.webp)

14. Click **Next** when done. On the next screen, select a suitable policy for who can use this SSO and under what
    circumstances. If you're not sure which policy to choose, select **Permit everyone**, then click **Next**:

    ![Select Access Control Policy](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_select-policy.webp)

15. On the next screen, by default only the `openid` scope is ticked. However, to include the user's groups in the OIDC
    claim, you need to also enable the `allatclaims` scope. If your AD FS server does not yet have an `allatclaims`
    scope in the list, click **New scope...** and type `allatclaims` in the Name field, then click **OK** to add it.
    Ensure both scopes are enabled and then click **Next**:

    ![Enable Permitted Scopes](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_enable-scopes.webp)

16. On the Summary screen, click **Next** to finish the wizard. You need to set the **Issuance Transform Rules** for the
    Web API application. Open the application again by double-clicking on the Web API entry or clicking **Edit**.

    ![Re-open Web API Application](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_reopen-webapi-app.webp)

17. Navigate to the **Issuance Transform Rules** tab and click **Add Rule**.

    ![Add Issuance Transform Rule 1](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-transform-rule-1.webp)

18. Select the **Send LDAP Attributes as Claims** template and click **Next**:

    ![Send LDAP As Claims Rule](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_ldap-as-claims.webp)

19. Name the rule `OpenID - LDAP Attribute Claims`. Select **Active Directory** as the Attribute store and add the
    following LDAP mappings:

    - **E-Mail-Addresses** --> `email`
    - **Given Name** --> `given_name`
    - **Surname** --> `family_name`

    You can select the items on the left from the list. You will need to type the items on the right manually. Ensure
    you use all lowercase characters for the values on the right:

    ![Set LDAP Claims](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_set-ldap-claims.webp)

20. Click **Finish** to add the rule. Now click on **Add Rule...** again to add the second rule:

    ![Add Issuance Transform Rule 2](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-transform-rule-2.webp)

21. Select the **Send Group Membership as Claims** template and click **Next**:

    ![Send Groups As Claims Rule](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_groups-as-claims.webp)

22. In the next screen, define the group claim as desired. In the following example, a group in Active Directory is
    called `SpectroTeam - Admins`. The desired behavior is for anyone that is a member of that group, to be issued a
    `groups` claim with the value `Admins`. In Palette this user will automatically be mapped to a group with the same
    name, `Admins`. You can assign RBAC permissions to that group in Palette to give it the desired access.

    ![Set Group Claim](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_set-group-claim.webp)

23. Click **Finish** to add the rule. Click **OK** to save the changes to the Web API rule and click **OK** again to
    save the changes to the application group.

24. Take note of your AD FS identifier, you will need this for Palette in the next step. Typically this is your AD FS
    name plus `/adfs`. You can also take the Federation Service identifier and remove `/services/trust` from that URL:

    ![Note AD FS Name](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_note-adfs-name.webp)

### Enable OIDC SSO in Palette

25. Open a web browser and navigate to your [Palette](https://console.spectrocloud.com) subscription.

    Navigate to **Tenant Settings** --> **SSO** and click on **OIDC**. Enter the following information.

    | Parameter     | Value                                                                                                                                                                                                                       |
    | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Issuer URL    | Your AD FS issuer URL. Typically this is your AD FS name plus /adfs.                                                                                                                                                        |
    | Client ID     | The client identifier that you saved in step **4**.                                                                                                                                                                         |
    | Client Secret | The shared secret that you generated in step **8**.                                                                                                                                                                         |
    | Default Teams | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you give to the group. |
    | Scopes        | Set this to `openid` and `allatclaims`.                                                                                                                                                                                     |
    | Email         | Keep `email` as the default.                                                                                                                                                                                                |
    | First Name    | Keep `given_name` as the default.                                                                                                                                                                                           |
    | Last Name     | Keep `family_name` as the default.                                                                                                                                                                                          |
    | Spectro Team  | Keep `groups` as the default.                                                                                                                                                                                               |

    ![Enable Palette OIDC SSO](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_configure-palette-oidc.webp)

26. When all the information has been entered, click **Enable** to enable SSO. You will receive a message stating **OIDC
    configured successfully**.

### Create Teams in Palette

The remaining step is to create teams in Palette for the group claims that you configured in AD FS, and give them the
appropriate permissions. For this example, you will create the `Admins` team and give it **Tenant Admin** permissions.
You can repeat this for any other team that you configured with group claims.

27. Open a web browser and navigate to your Palette subscription. Navigate to **Tenant Settings** --> **Users & Teams**
    --> **Teams** tab, and click **+ Create Team**.

    ![Create Palette Team](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_create-team.webp)

28. Specify `Admins` in the **Team name** field. You don't need to set any members now, as this will happen
    automatically from the SSO. Click **Confirm** to create the team.

    ![Name Palette Team](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_name-team.webp)

29. The list of teams displays again. Select the newly created **Admins** team to review its details. To give this team
    administrative access to the entire tenant and all the projects in it, assign the **Tenant Admin** role. Select
    **Tenant Roles** and click **+ Add Tenant Role**:

    ![Palette Tenant Roles](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_tenant-roles.webp)

30. Click on **Tenant Admin** to enable the role. Click **Confirm** to add the role.

    ![Add Tenant Role](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-tenant-role.webp)

    You will receive a message stating **Roles have been updated**. Repeat this procedure for any other teams, taking
    care to ensure they are given the appropriate permissions.

31. Click the **X** next to **Team Details** in the top left corner to exit this screen.

You have now successfully configured Palette SSO based on OIDC with Microsoft AD FS.

## Validate

1. Log in to Palette through SSO as a user that is a member of the `SpectroTeam - Admins` group in Active Directory to
   verify that users are automatically added to the `Admins` group in Palette.

   If you're still logged into Palette with a non-SSO user, log out by selecting **Logout** in the **User Menu** at top
   right.

   ![User Logout](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_user-logout.webp)

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field.
   Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass
   SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without
   SSO.

   Click on the **Sign in** button to log in via SSO.

   ![User SSO Login](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_palette-login.webp)

3. If this is the first time you are logging in with SSO, you will be redirected to the Microsoft AD FS login page.
   Depending on your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor
   Authentication).

   Make sure you log in as a user that is a member of the `SpectroTeam - Admins` group in Active Directory. Once
   authenticated, you will automatically be redirected back to Palette and logged into Palette as that user.

4. You are now automatically added to the `Admins` team in Palette. To verify, navigate to the left **Main Menu**,
   select **Tenant Settings** --> **Users & Teams** --> **Teams** tab. Click the **Admins** team and view the team
   members section.

   ![Palette Team Members](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_team-members.webp)

   The user you logged in as has automatically been added to this team.

## Resources

- [Microsoft AD FS](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/ad-fs-openid-connect-oauth-concepts)

- [Microsoft AD FS Reverse Proxy](https://blog.matrixpost.net/set-up-active-directory-federation-services-ad-fs-5-0-adfs-reverse-proxy-part-2/)

- [Palette User Management](../user-management.md)

- [Palette SSO](./saml-sso.md)
