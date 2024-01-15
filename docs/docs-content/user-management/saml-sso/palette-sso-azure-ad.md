---
sidebar_label: "Palette SSO with Azure Active Directory"
title: "Palette SSO with Azure Active Directory"
description: "Learn how to enable SSO in Palette with Azure Active Directory"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
hiddenFromNav: false
tags: ["user-management", "saml-sso"]
---

## Azure Active Directory and OIDC-Based Setup

After configuration, your organization can integrate Microsoft Azure Active Directory to authenticate access to Spectro Cloud Palette.

## Prerequisites

- Microsoft Azure Active Directory with appropriate permissions to create and modify users, groups, Enterprise Applications (SAML) or App Registrations (OIDC).<p></p><br />
- Access to Palette - Request access for a [Free Trial](../../getting-started/palette-freemium.md).<p></p><br />
- Appropriate rights and [enabled token IDs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc#enable-id-tokens) in Azure.<p></p><br />
- [kubelogin](https://github.com/int128/kubelogin) - This is a `kubectl` plugin for Kubernetes OpenID Connect (OIDC) authentication, also known as `kubectl` oidc-login.

<br />

<center> Kubelogin Architecture</center>

  <br />

![kubelogin](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg "Credential Plugin Diagram from kubelogin")

<br />

## Steps for OIDC Integration in Microsoft Azure Active Directory

From within Microsoft Azure AD, log in and find the Azure Active Directory service page. The following two libraries contain the necessary parameters to configure Palette.

<br />

1. **App registrations** - You will use Azure AD App registrations to configure OIDC SSO with Spectro Cloud Palette. <p></p><br />

2. **Enterprise applications** - You will use Azure AD Enterprise registrations to configure SAML SSO with Spectro Cloud Palette. <p></p><br />

![enterprise-app-registration](/oidc-azure-images/enterprise-app-registration.png)

<p></p>

## Integrating OIDC SSO for authenticating access to Kubernetes clusters using Microsoft Azure Active Directory

This section describes how to enable Azure AD SSO authentication to access a Kubernetes cluster.

1. From the sidebar menu, select **Tenant Settings** and ensure the **Tenant Admin** from dropdown is selected.<p></p><br />
2. Go to **Profiles** from within Tenant Admin or a Project and select an existing Cluster Profile. Alternatively, if a Cluster Profile does not exist, create a new Cluster Profile with a CNCF Kubernetes distribution. Once you select a profile, you will see the Infrastructure layers in the picture.<p></p><br />
3. Choose the **Kubernetes** layer and select the **Pack Values** to modify.<p></p><br />
4. The Pack Version Settings are exposed with the appropriate privileges (Tenant Admin). Notate the following **Variable** within the pack settings.<p></p><br />

## Configuring the Application OpenID Configuration in the Cluster

1.  Go to the **Kubeadminconfig**:**apiServer**:**extraArgs** section of the pack layer. <p></p><br />

    - **oidc-groups-claim** - "Groups"<p></p><br />
    - **oidc-username-claim** - "Email"<p></p><br />
    - **oidc-issuer-url** - "Issuer's URL"<p></p><br />
    - **oidc-client-id** - "Client ID"<p></p><br />

      ![kubeadminconfig](/oidc-azure-images/kubeadmconfig.png)

<p></p><br />

2.  Next, find the **clientConfig** section and modify the following parameters:<p></p><br />

    - **oidc-issuer-url** - This is the provider URL which allows the Palette to discover public signing keys.<p></p><br />
    - **oid-client-id** - The client ID is found under the Application Registration/Enterprise Application.<p></p><br />
    - **oidc-client-secret** - The secret provided by Azure AD.<p></p><br />
    - **oidc-extra-scope** - The scope tags.<p></p><br />

![oidc](/oidc-azure-images/client-config.png)

<p></p><br />

## Binding the Cluster Admin Role AD to Cluster Admin via RBAC

Configure the Role Based Access Control Pack (RBAC).<p></p><br />

### Adding an RBAC Pack

1. Under **Tenant Admin**, create an **RBAC Cluster** profile. <p></p><br />
2. Go to **Cluster Profile** > +**Add Cluster Profile** and complete the Basic Information.<p></p><br />
3. Enter the **Name**, **Version**, and **Description** (Optional) and click **Next**. <p></p><br />
4. Under **Type**, select **+Add-on New Pack**.<p></p><br />
5. Select **Authentication** as the Pack Type.<p></p><br />
6. From the **Registry** dropdown, click **Public Repo**.<p></p><br />
7. Choose **Spectro RBAC** as the Pack Name.<p></p><br />
8. Select the Pack Version.<p></p><br />
9. Click the **spectro-rbac 1.0.0** Pack Values to edit the pack layer settings.<p></p>
   **Note**: This is where you will edit the role settings.<p></p><br />
10. Click the **Confirm & Create** button.<p></p><br />

### Editing the RBAC Cluster Profile

1. From Palette, go to **Profiles** and choose the **RBAC** cluster profile.<p></p><br />
2. Click the layer image and specify the ClusterRoleBindings.<p></p><br />
3. Go to the **clusterRoleBindings**:**role** section and type **cluster-admin**.<p></p><br />
4. Change the settings to your requirements and specific groups.<p></p><br />

For Azure AD integration with RBAC, edit your RBAC pack value to below. Or, copy and paste the entire block to your RBAC pack and modify you inputs where appropriate:

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
            # For "name", input the Azure AD Group ID name and add a comment on what the Azure AD displayname is that corresponds to the Azure AD Group Name
            # Example: Azure AD Group Object Id "70d19fd6-####-####-####-##c6c915e301" is tied to the Azure AD Security Group with the display name of "cluster-admin-role".
            # name: "AZURE AD GROUP ID NAME"
            name: "INSERT AZURE AD GROUP ID For Cluster Admins"
      - role: admin
        name: bind-admin-role-to-admin
        subjects:
          #- type: User
          #name: user5
          - type: Group
            # For "name", input the Azure AD Group ID name and add a comment on what the Azure AD displayname is that corresponds to the Azure AD Group Name
            # Example: Azure AD Group Object Id "064f2e40-####-####-####-##b9f7927976" is tied to the Azure AD Security Group with the display name of "admin-role".
            # name: "AZURE AD GROUP ID NAME"
            name: "INSERT AZURE AD GROUP ID For Admins"
      - role: view
        name: bind-view-role-to-view
        subjects:
          #- type: User
          #name: user6
          - type: Group
            # For "name", input the Azure AD Group ID name and add a comment on what the Azure AD displayname is that corresponds to the Azure AD Group Name
            # Example: Azure AD Group Object Id "732edc96--####-####-####-##851dee3380" is tied to the Azure AD Security Group with the display name of "view-role".
            # name: "AZURE AD GROUP ID NAME"
            name: "INSERT AZURE AD GROUP ID For Viewers"
          #- type: ServiceAccount
          #name: group6
          #namespace: foo
      - role: edit
        name: bind-edit-role-to-edit
        subjects:
          #- type: User
          #name: user6
          - type: Group
            # For "name", input the Azure AD Group ID name and add a comment on what the Azure AD displayname is that corresponds to the Azure AD Group Name
            # Example: Azure AD Group Object Id "21b55c08-6-####-####-####-##a3e2245ad7" is tied to the Azure AD Security Group with the display name of "edit-role".
            # name: "AZURE AD GROUP ID NAME"
            name: "INSERT AZURE AD GROUP ID For Edit"
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

**Azure AD Group Object ID** "70\*\*\*\*\*\*\-355a-453b-aadf-\*\*\*\*\*\*\*\*\*301" is linked to the **Azure AD Security Group** with the display name of **cluster-admin-role**.

**name**: "AZURE AD GROUP ID NAME"

![oidc](/oidc-azure-images/client-config.png)

## Results

You have now established SSO authentication integrating Microsoft Azure AD and Spectro Cloud Palette using OIDC.

## References

[Microsoft Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc) <br />
[Credential Plugin Diagram](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg)<br />
[kubelogin](https://github.com/int128/kubelogin)<br />
