---
title: "SSO Setup"
metaTitle: "SSO Setup"
metaDescription: "Detailed instructions on creating Single Sign-on to log in to Palette using SAML 2.0"
icon: ""
hideToC: false
fullWidth: false
---
import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Single sign-on (SSO) is an authentication method that enables secured exchange user authentication using a single set of credentials with multiple applications and websites. SSO works upon a trust relationship established and maintained between the service provider (SP) and an identity provider (IdP) using certificates.

Spectro Cloud supports the following two types of SSO authentication options:<p></p><br />

   1. **Security Assertion Markup Language (SAML) Based SSO** - You can create a Tenant Cluster Profile with SAML SSO within Palette. This is a manual process that is explained below. <p></p><br />
   2.  **OpenID Connect (OIDC) Based SSO** - You can use OIDC to enable OIDC SSO between Palette and the recommended IdP. It requires application registration to issue a Client ID, Client Secret, and Validation.<p></p><br />

<br />

----

<Tabs>
<Tabs.TabPane tab="SAML BASED SSO" key="saml">

# How to Set Up SAML 2.0-based SSO within Palette

With Palette, you can use SAML 2.0 single sign-on (SSO) to enable the secure exchange of user authentication via an IdP and Spectro Cloud Palette.

<br />

## Procedure

To set up Spectro Cloud Palette with an identity provider (IdP) SAML based SSO:<p></p><br />
1. Log in to the Palette console as a Tenant Admin.<p></p><br />
2. Select **Tenant Settings** > **SSO Auth Type** > **SAML** to view the SAML panel.<p></p><br />
3. Complete the assertion form with the requested parameters. See below for more details specific to the supported IdPs.<p></p><br />
    The following options will be available for configuring SAML SSO within Palette: <p></p><br />

      - **Service** - Choose your IdP (Azure Active Directory, Okta, Keycloak, OneLogin, ADFS, Other).<p></p><br />
      - **Identity Provider Metadata** - Enter the Identity Provider Metadata.<p></p><br />
      - **Default Teams** - Add the authenticated user's Default Team(s) Palette membership.<p></p><br />
      - **NameID Format** - Choose the appropriate version of the format in use (SAML 1.1, SAML 2.0, email address, other).<p></p><br />

    The following parameters will enable Spectro Cloud Palette as a **Service Provider** (SP) in your IdP. Your IdP will require some or all the information listed below to enable SSO with Palette. <p></p><br />

      - **Single Logout URL** - The IdP will use the logout URL for the SAML SSO configuration.<p></p><br />
      - **EntityId** - https://www.spectrocloud.com<p></p><br />
      - **FirstName** - Attribute in First Name format.<p></p><br />
      - **LastName** - Attribute in Last Name format.<p></p><br />
      - **Email** - Attribute in Email format.<p></p><br />
      - **SpectroTeam** - Attribute in SpectroTeam format.<p></p><br />
      - **Service Provider Metadata** - Provide the EntityDescriptor.<p></p><br />

4. Edit each parameter as necessary and click **Enable** to complete the setup wizard.<p></p><br />

<br />

# Common Identity Providers

## Next Steps

Find the SSO solution with these supported IdPs with Palette.

<br />

----

<Tabs>
<Tabs.TabPane tab="Okta" key="okta">

### Okta

Okta's single sign-on solution can quickly connect and sync to Palette.<p></p><br />

#### References

https://developer.okta.com/docs/guides/build-sso-integration/saml2/before-you-begin/

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="MFST Azure AD" key="azure_ad">

### Azure Active Directory






#### References

https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal-setup-sso

</Tabs.TabPane>

<Tabs.TabPane tab="KeyCloak" key="keycloak">

### KeyCloak

#### References

https://www.keycloak.org/docs/latest/server_admin/#saml-clients

</Tabs.TabPane>
<Tabs.TabPane tab="OneLogin" key="onelogin">

### OneLogin

#### References

https://developers.onelogin.com/saml/app-catalog

</Tabs.TabPane>
<Tabs.TabPane tab="MSFT AD FS" key="msft_adfs">

### Microsoft AD FS

#### References

https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-fed-saml-idp

</Tabs.TabPane>
</Tabs>
</Tabs.TabPane>
<Tabs.TabPane tab="OIDC BASED SSO" key="oidc">

# How to Set Up OIDC-based SSO within Palette

Spectro Cloud Palette supports OpenID Connect (OIDC), a de facto standard of contemporary authentication that provides secured identity management in a highly interoperable format.<p></p><br />

## Procedure

To set up an OIDC-based SSO in Spectro Cloud Palette perform the following steps:<p></p><br />

1. Log in to the Palette console as the Tenant Admin. <p></p><br />
2. Select the **Tenant Settings** > **SSO** > **OIDC** to view the panel.<p></p><br />
3. Enable Spectro Cloud as the **Service Provider** by completing the form with the following parameters. Select the tabs below for more details specific to IdPs supported with Palette.<p></p><br />

   * **Issuer URL** - The URL of the OpenID identity provider.<br /> **Note**: For AWS users, Issuer URL needs to be generated in the format as described below: <p></p><br />
	`https://cognito-idp.[REGION].amazonaws.com/[USER-POOL-ID]` <p></p><br />

   - **Client ID** - The ID for the client application that makes authentication requests.<p></p><br />
   - **Client Secret** - Enter the secret created by the IdP.<p></p><br />
   - **Default Teams** - The Default Palette Team(s) to which authenticated members are assigned automatically.<p></p><br />
   - **Scopes** - The user's details will be used as part of SSO, like *email*, *firstname*, *lastname* or *groups*. Each scope returns a set of user attributes, called claims. <p></p><br />Microsoft Azure AD Example: "openid, profile, email, allatclaims"<p></p><br />
   - **REQUIRED CLAIMS** - These are the parameter values, claimed by the user, to be mapped with the Identity Provider Platform. Complete the Required Claims:<p></p><br />
     - **Email** - Azure AD Example: "email"<p></p><br />
     - **First Name** - Azure AD Example: "given_name"<p></p><br />
     - **Last Name** - Azure AD Example: "family_name"<p></p><br />
     - **Spectro Team Name** - Azure AD Example: "groups". <p></p><br />Any non-admin user that is added to a Tenant, must be added to at least one Team. This Team can be changed later if needed. See the [Teams](/glossary-all#team) section for more details on Teams.<p></p><br />

          - If a user is not added to a Team, the user can still log in successfully but will not be able to see the console until proper Project or Tenant permissions are applied (Tenant Admin, Project Admin, Project Viewer, and so on). The **SpectroTeam** attribute carries forward the available team(s) for the user being authorized. This gives the administrator the flexibility to grant access to Spectro Cloud Palette using either Users or Groups in their IdP or by adding users directly to a Palette Team(s).<p></p><br />

          - The values of the **SpectroTeam** parameter is case-sensitive, so the Tenant Admin should ensure that the team names are identical on both consoles. To sync an IdP group with a Palette Team, ensure the IdP group Name (or if it's Azure Active Directory, use the Object Id corresponding to the IdP group Name) matches the Palette Team name.<p></p><br />

          - A use case example can be where a new member is to be added to the Palette Tenant by the Tenant Admin. The administrator can configure a default Palette Team or a synced IdP group that is common to all authenticated users. This default Palette Team/IdP group can be applied to the Palette SAML Panel as a one-time setting.<p></p><br />

<InfoBox>
Your IdP may require the following settings to configure OIDC SSO with Palette:

  - **Callback URL** - The URL to which Auth0 redirects users after they authenticate. Ensure that this value is configured for the application you registered with the OIDC Identity Provider.

  - **Logout URL** - The IdP will use the logout URL for the OIDC SSO configuration.

</InfoBox>

## Results
You have now established the minimum configuration that is required to configure Palette OIDC, capable of communicating with other IdPs configured as OpenID Connect Providers.

<br />

# Recommended Identity Providers

-----

<br />

<Tabs>
<Tabs.TabPane tab="Okta" key="okta">

## Okta

#### References

https://developer.okta.com/docs/guides/build-sso-integration/openidconnect/before-you-begin/

</Tabs.TabPane>
<Tabs.TabPane tab="MSFT Azure AD" key="azure_ad">

## Azure Active Directory

After configuration, your organization can integrate Microsoft Azure Active Directory to authenticate access to Spectro Cloud Palette.

## Prerequisites

- Microsoft Azure Active Directory with appropriate permissions to create and modify users, groups, Enterprise Applications (SAML) or App Registrations (OIDC).<p></p><br />
- Access to Palette - Request access for a [Free Trial](/getting-started/palette-freemium).<p></p><br />
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

![enterprise-app-registration](/enterprise-app-registration.png)
<p></p>

## Integrating OIDC SSO for authenticating access to Kubernetes clusters using Microsoft Azure Active Directory

This section describes how to enable Azure AD SSO authentication to access a Kubernetes cluster.

1. From the sidebar menu, select **Tenant Admin** and click the **Tenant Settings** dropdown.<p></p><br />
2. Go to **Profiles** from within Tenant Admin or a Prjoect, and select an existing Cluster Profile. Alternatively, if no cluster profile eists, create a new cluster profile with a CNCF Kubernetes distribution. Once you select a profile, you will see the Infrastructure layers in the picture.<p></p><br />
3. Choose the **Kubernetes** layer and from the **Pack Version** dropdown, select the version to modify.<p></p><br />
4. The Pack Version Settings are exposed with the appropriate privileges (Tenant Admin). Notate the following **Variable** within the pack settings.<p></p><br />

## Configuring the Application OpenID Configuration in the Cluster

1.  Go to the **Kubeadminconfig**:**apiServer**:**extraArgs** section of the pack layer. <p></p><br />

    - **oidc-groups-claim** - "Groups"<p></p><br />
    - **oidc-username-claim** - "Email"<p></p><br />
    - **oidc-issuer-url** -  "Issuer's URL"<p></p><br />
    - **oidc-client-id** - "Client ID"<p></p><br />

       ![kubeadminconfig](/kubeadmconfig.png)

<p></p><br />

2.  Next, find the **clientConfig** section and modify the following parameters:<p></p><br />

    - **oidc-issuer-url** - This is the provider URL which allows the Palette to discover public signing keys.<p></p><br />
    - **oid-client-id** - The client ID is found under the Application Registration/Enterprise Application.<p></p><br />
    - **oidc-client-secret** - The secret provided by Azure AD.<p></p><br />
    - **oidc-extra-scope** - The scope tags.<p></p><br />

![oidc](/client-config.png)
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

![oidc](/client-config.png)

## Results

You have now established SSO authentication integrating Microsoft Azure AD and Spectro Cloud Palette using OIDC.

## References

[Microsoft Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc) <br />
[Credential Plugin Diagram](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg)<br />
[kubelogin](https://github.com/int128/kubelogin)<br />

<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="KeyCloak" key="keycloak">

### KeyCloak

#### References

https://www.keycloak.org/docs/latest/server_admin/#_oidc

</Tabs.TabPane>

<Tabs.TabPane tab="OneLogin" key="onelogin">

### OneLogin

#### References

https://developers.onelogin.com/openid-connect

</Tabs.TabPane>

<Tabs.TabPane tab="MSFT AD FS" key="msft_adfs">

### Microsoft AD FS

#### References


https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/ad-fs-openid-connect-oauth-concepts

</Tabs.TabPane>

</Tabs>


</Tabs.TabPane>
</Tabs>
