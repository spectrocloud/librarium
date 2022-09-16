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

Single sign-on (SSO) is an authentication method that enables secure, user authentication with multiple applications and websites by using a single set of credentials.

SSO works upon a trust relationship set up between the service provider and an identity provider (IdP) such as Okta, Azure AD, KeyCloak, Google ID, OneLogin, etc.

This trust relationship occurs when a certificate is exchanged between the IdP and the service provider (SP). This certificate can be used to sign identity information that is being sent from the IdP to the SP, so that the service provider knows where is coming from a trusted source.
 
In SSO, this identity data takes the form of tokens which contain identifying bits of information about the users.
 
This document provides information to synchronize the two different types of SSO authentication methods between Palette and the supported IdP as well as SSO authentication across Kubernetes.
 
The two types of SSO authentication methods Palette supports are: <p></p><br />
 
   1. **Security Assertion Markup Language (SAML) Based SSO** - You can create a Tenant cluster profile with SAML SSO within Palette. This is a manual process as explained below. <p></p><br />
   2.  **OpenID Connect (OIDC) Based SSO** - You can use OIDC to enable single sign-on (SSO) between Palette and the recommended IdP. It requires application registration to issue clientiD, client secret, and validation.


<br />


<Tabs>
<Tabs.TabPane tab="SAML BASED SSO" key="saml">

# How to Set Up SAML 2.0-Based SSO within Palette

With Palette, you can use SAML 2.0 single sign-on (SSO) to enable authentication using an IdP when logging into Palette.   
 
## Procedure 

1. To set up an Identity provider (IdP) based SSO, log in to the Palette console as the Tenant Admin.<p></p><br />
2. Select the **Tenant Settings** > **SSO Auth Type** > **SAML** to view the SAML panel.<p></p><br />
3. Complete the assertion form with the requested parameters. See below for more details specific to supported IdPs.<p></p><br />
 
     - Issuer - The unique identifier. In this case it is Palette.
     - Certificate - This certificate is generated (from where?)
     - Service - 
     - Identity Provider Metadata
     - Default Teams -
         - Enable Single Logout -
 
4. These parameters enable Palette as a **Service Provider** (SP) into the IdP:<br /> (Pre-configured from the …)
     - Single Logout URL -
     - EntityId - 
     - NameId Format - 
     - Login URL - 
     - FirstName -
     - LastName -
     - Email - 
     - SpectroTeam - 
     - Service Provider Metadata -
    
4. Copy the **Identity Provider Metadata** from the IdP into the Palette SAML panel for each metadata. {There is no Metadata? Do we need this step?}
 
5. Click **Enable** to complete the setup wizard.

## Results


## Recommended Identity Providers

Find the SSO solution with these supported IdPs with Palette.

<br />

<Tabs>

<Tabs.TabPane tab="Okta" key="okta">

### Okta

Okta's single sign-on solution can quickly connect to and sync to Palette.

### References

https://developer.okta.com/docs/guides/build-sso-integration/saml2/before-you-begin/

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Azure AD" key="azure_ad">

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


# How to Set Up OIDC-Based SSO on Palette

   Palette supports OpenID Connect (OIDC) as the de facto standard of contemporary authentication providing secured, identity management in a highly interoperable format. The following steps will enable Palette as a Service Provider.

## Procedure

To set up an OIDC-based SSO:

1. Log in to the Palette console as the Tenant Admin. <p></p><br />
2. Select the **Tenant Settings** > **SSO** > **OIDC** to view the panel.<p></p><br />
3. Enable Spectro Cloud as a **Service Provider** by completing the following parameters. Select the tabs below for more details specific to IdPs supported with Palette.
   - **Issuer URL** - The URL of the OpenID identity provider.<br />
**Note**: For AWS users issuer URL to be generated in the below format:

   `https://cognito-idp.[REGION].amazonaws.com/[USER-POOL-ID]`
<br />

   - **Client ID** - The ID for the client application that makes authentication requests.
<br />

   - **Client Secret** - Secret is known only to the application and the authorization server.
<br />

   - **Callback URL** - URL to which Auth0 redirects users after they authenticate. Ensure that this value is configured for the application you registered with the OIDC Identity Provider.
<br />

   - **Logout URL** - URL is taken from IdP - URL to be provided into IDP for logout to clear the provider-side session.
<br />

   - **Default Teams** - Default team to which members unassigned to specific team belongs.
<br />

   - **Scopes** - The scopes are used by an application during authentication to authorize access to a user's details, like name and picture. Each scope returns a set of user attributes, called claims. You can enter multiple scopes.
<br />

   - **REQUIRED CLAIMS** - These are the parameter values, claimed by the user, to be mapped with the Identity Provider Platform. Complete the Required Claims:
     - **Email**
    <br />
     - **First Name**
    <br />
     - **Last Name**
    <p></p><br />

4. Add Palette as the Service Provider (SP) application in the IdP's configuration using these parameters. More details specific to IdPs follow.

      **SpectroTeam** 
      - Any non-admin user that is added to a Tenant must be added to at least one Team when being created by the admin. This Team can be changed later on if needed. See the [Teams](/introduction/concept-overviews#team) section for more details on Teams and creating them.<p></p><br />
      
      - In case a user is not added to any team, the user can still login successfully but will not be able to see the console. The **SpectroTeam** attribute carries forward the available team(s) for the user being authorized. This gives the admin the flexibility to add users into teams from both Palette and from the IdP.<p></p><br />
      
      - The values of the **SpectroTeam** parameter is case-sensitive, so the Tenant Admin should ensure that the team names are identical on both the consoles. A team created on the IdP (which is not mentioned in Palette) will be ignored.<p></p><br />
      
      - A sample use case is where a new member is to be added to the Palette tenant by the tenant admin. The admin can have a default team that is common to all users. This can be applied to the Palette SAML Panel as a one-time setting. When a new user is added, the IdP dashboard can be used to add this user to additional teams as required. Without this arrangement, the tenant admin would need to add the user and then perform the team assignment separately each time.

## Results
You have now established the minimum configuration that is required to configure Palette OIDC, capable of communicating with other IdPs configured as OpenID Connect Providers.

<!-- (Clarify) -->


<br />

# Recommended Identity Providers
<br />


<Tabs>
<Tabs.TabPane tab="Okta" key="okta">

## Okta

#### References

https://developer.okta.com/docs/guides/build-sso-integration/openidconnect/before-you-begin/

</Tabs.TabPane>
<Tabs.TabPane tab="Azure AD" key="azure_ad">

# Azure Active Directory

(blurb on intro how AD works and connects to Palette)


## Prerequisites

Before you begin, you will need - Azure AD (license Azure AD premium 2)
- Access to Palette - Request access for a [Free Trial](/getting-started/palette-freemium)
- Appropriate rights and [enabled token IDs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc#enable-id-tokens) in Azure
- [kubelogin](https://github.com/int128/kubelogin) - This is a kubectl plugin for Kubernetes OpenID Connect (OIDC) authentication, also known as kubectl oidc-login.

  <br />

## Architecture

<br />

![kubelogin](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg "Credential Plugin Diagram from kubelogin")

<br />

## Steps for OIDC Integration in Microsoft Azure Active Directory

From within Microsoft Azure, log in and find the Azure Active Directory service page. The following two libraries contain the necessary parameters to include in Palette.

<br />

1. **App registrations** - This is where you will find the registered apps with the essential assertions {use dif word} to use within the Service Provider.  <br />

2. **Enterprise applications** - You will set up your OIDC configuration for Azure AD

![enterprise-app-registration](/enterprise-app-registration.png)


## Integrating Palette OIDC SSO with Microsoft Azure Active Directory

This section shows you how to configure the parameters inside the Kubernetes CNCF pack layer to perform an Azure AD authentication with a regular Kubernetes cluster.

1. From the slide menu, select **Tenant Admin** and click the **Tenant Settings** dropdown.<p></p><br />

2. Go to **Profiles** (from within Tenant Admin) and click the (corresponding) Cluster Profile from the list. You will see the Infrastructure layers in the picture.<p></p><br />

3. Choose the **Kubernetes** layer and from the **Pack Version** dropdown, select the version to modify.<p></p><br />

4. The Pack Version Settings are exposed with the appropriate privileges (Tenant Admin). Notate the following **Variable** within the pack settings.

### Configuring the Application OpenID Configuration in the Cluster

1.  Go to the **Kubeadminconfig**:**apiServer**:**extraArgs** section of the pack layer. <br />

    - **oidc-groups-claim** - "groups"
    - **oidc-username-claim** - "email"
    - **oidc-issuer-url** - 
    - **oidc-client-id** -

       ![kubeadminconfig](/kubeadmconfig.png)

2.  Next, find the **clientConfig** section and modify the following parameters:

    - **oidc-issuer-url**  -  This is the provider URL which allows the Palette to discover public signing keys.
    - **oid-client-id** -   The client ID is found under the Application Registration/Enterprise Application.
    - **oidc-client-secret** - [enter description here] The secrets guide from Azure AD
    - **oidc-extra-scope** - [enter description here]

{Add video of how to do this / maybe}


# Bind the Cluster Admin Role AD to Cluster Admin via RBAC

## Role Based Access Control
Configure the Role Based Access Control Pack (RBAC)

### Adding an RBAC Pack
   1. Under Tenant Admin, create a RBAC Cluster Profile.
   2. Go to **Cluster Profile** and click the +**Add Cluster Profile**.
   3. Complete the Basic Information
      1. Name, Version, and Description (Optional)
      2. Under **Type**, select **+Add-on New Pack**
      3. Select **Authentication** as the Pack Type.
      4. From the **Registry** dropdown, click **Public Repo**.
      5. Choose **Spectro RBAC**  as the Pack Name.
      6. Select the Pack Version.
      7. Click the **spectro-rbac 1.0.0** Pack Values to edit the pack layer settings.
         **Note**: This is where you will edit the role settings.
      8. Click the **Confirm & Create** button.

### Editing the RBAC Cluster Profile

   1. From Palette, go to **Profiles** and choose the **RBAC** cluster profile.
   2. Click the layer image in order to edit it.
   3. Specify the ClusterRoleBindings:
      1. Go to the **clusterRoleBindings**:**role** section and type **cluster-admin**.
         Change the settings to your requirements and specific groups.

For Azure AD integration with RBAC, edit your RBAC pack value to below. Or, copy and paste the entire block to your RBAC pack, and modify you inputs where appropriate:

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
          # Example: Azure AD Group Object Id "70d19fd6-355a-453b-aadf-7cc6c915e301" is tied to the Azure AD Security Group with the display name of "cluster-admin-role".
          # name: "AZURE AD GROUP ID NAME"
            name: "INSERT AZURE AD GROUP ID For Cluster Admins"
      - role: admin
        name: bind-admin-role-to-admin
        subjects:
          #- type: User
            #name: user5
          - type: Group
          # For "name", input the Azure AD Group ID name and add a comment on what the Azure AD displayname is that corresponds to the Azure AD Group Name
          # Example: Azure AD Group Object Id "064f2e40-f848-4bc5-ab8c-88b9f7927976" is tied to the Azure AD Security Group with the display name of "admin-role".
          # name: "AZURE AD GROUP ID NAME"
            name: "INSERT AZURE AD GROUP ID For Admins"
      - role: view
        name: bind-view-role-to-view
        subjects:
          #- type: User
            #name: user6
          - type: Group
          # For "name", input the Azure AD Group ID name and add a comment on what the Azure AD displayname is that corresponds to the Azure AD Group Name
          # Example: Azure AD Group Object Id "732edc96-9549-45eb-a3c9-b4851dee3380" is tied to the Azure AD Security Group with the display name of "view-role".
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
          # Example: Azure AD Group Object Id "21b55c08-63bd-4119-8bd3-9fa3e2245ad7" is tied to the Azure AD Security Group with the display name of "edit-role".
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

   Example: **Azure AD Group Object Id** "70******-355a-453b-aadf-*********301" is linked to the **Azure AD Security Group** with the display name of "**cluster-admin-role**".
          name: "AZURE AD GROUP ID NAME"




You can also use a 

Group ID Name



![oidc](/client-config.png)

## Results


## References

[Microsoft Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc)
[Credential Plugin Diagram](https://github.com/int128/kubelogin/raw/master/docs/credential-plugin-diagram.svg)
[kubelogin](https://github.com/int128/kubelogin)

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
