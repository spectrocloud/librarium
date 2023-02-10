---
title: 'Spectro Kubernetes Dashboard'
metaTitle: "Spectro Cloud's Integrated Kubernetes Dashboard"
metaDescription: 'The Integrated Kubernetes Dashboard Monitoring pack in Palette reduces the complexity of standing up the Kubernetes dashboard for a cluster'
hiddenFromNav: true
type: "integration"
category: ['integrations','monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png'
---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Spectro Kubernetes Dashboard

Spectro Kubernetes Dashboard is a web-based UI for Kubernetes clusters that auto-enables the Kubernetes Dashboard. It integrates seamlessly with Spectro Proxy and uses default settings for access control and Identify Provider (IDP).   

When you attach this pack to a cluster profile, the Spectro Proxy pack is added automatically and the Kubernetes Dashboard is pre-enabled using secure ports. When used with the default settings, there is nothing to configure.

<br />

<WarningBox>

Default settings for the dashboard provide best practices for your clusters. Changing the default settings can introduce security issues by exposing your clusters. We recommend using the defaults.

</WarningBox>


# Versions Supported


**2.6.x**

<br />

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.

## Parameters

The Spectro Kubernetes Dashboard supports the following parameters. 
<br />

#### User Selections

These settings are also included in the manifest as `access` and `identityProvider` parameters.

| Parameter | Description | Default |
|-----------|-------------|---------|
| Access | Controls cluster access. Private access means that nodes and pods are isolated from the internet. | Private |
| Identity Provider | You can use Palette as the IDP or a third-party application as the IDP. | Palette |

#### Internal Manifest Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| namespace | The Kubernetes namespace to install the dashboard. | `kubernetes-dashboard` |
| ClusterRole | The ClusterRole to assign to the Kubernetes Dashboard. | `read-only` |
| certDuration | Self-signed certificate duration in hours. | 8760h (365d) |
| certRenewal | Self-signed certificate renewal in hours | 720h (30d) |
| enableInsecureLogin | RBAC ensures secure login. | `false` |
| serviceType | The service type for the dashboard. Supported values are ClusterIP, LoadBalancer, and NodePort. | `ClusterIP` |
| skipLogin | Enables or disables the skip login option on the dashboard. | `false` |
| enableInsecureLogin | Enables non-Secure Sockets Layer (SSL) login. Dashboard login is always restricted to HTTP(S) + localhost or HTTPS and external domain. | `false` |
| ingress:enabled | Ingress configuration to access the ClusterIP, loadBalancer, or nodePort. | `false` |

## Usage

To use the Spectro Kubernetes Dashboard pack, you have to add it to your cluster profile. The Spectro Kubernetes Dashboard pack has default settings for **Access** and **Identity Provider**. These settings automatically install the latest version of the Spectro Proxy pack when you create the cluster.

Changing these default settings may require some additional configuration.
<br /> 

### Access

The default setting is **Private**. If you change the setting to **Public** and your cluster is in a public cloud, there is no additional configuration.  

However, if you change **Access** to **Public** and your cluster is in a private cloud, you have to manually add and configure the Spectro Proxy pack to your cluster profile. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.

<br /> 

### Identity Provider 

The default setting is **Palette**. This makes Palette the IDP, so any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard.

If you change this setting to **Inherit from Organization**, you must configure OpenID Connect (OIDC) authentication. You can configure OIDC two ways:

- In Tenant Admin scope, navigate to **Tenant Settings > SSO**, choose **OIDC**, and provide your third-party IDP details.  

- In **Tenant Settings > SSO**, if you choose **None** or **SAML**, you must configure OIDC manually in the Kubernetes pack. 

For more information, check out the [SSO Setup](/user-management/saml-sso) guide.
<br />

### Enable OIDC Authentication

You only need to manually enable OIDC authentication for this pack if your cluster is in a private cloud and you change the **Access** default setting to **Public**. 

The basic method to enable OIDC authentication can be used for all cloud services except Amazon EKS and Azure AKS. 

<br />

<Tabs>

<Tabs.TabPane tab="Basic OIDC Setup" key="Other Clouds">


To enable RBAC OIDC authentication manually for clusters managed by most cloud providers, update the Kubernetes pack by following these steps: 

<br />

1. Copy ``oidc-`` configuration lines in the example and add them to the Kubernetes pack under the ``extraArgs`` parameter section. Enter your provider details in quotes. <br /><br />

  ```
  kubeadmconfig:
    apiServer:
      extraArgs:
      oidc-issuer-url: "provider URL"
      oidc-client-id: "client-id"
      oidc-groups-claim: "groups"
      oidc-username-claim: "email"
  ```

2. Under the ``clientConfig`` parameter section of Kubernetes pack, uncomment the ``oidc-`` configuration lines, and enter your provider details in quotes. Enter the same provider URL and client-id in the ``extraArgs`` and ``clientConfig`` parameter sections. <br /><br />

  ```
    clientConfig:
      oidc-issuer-url: "provider URL"
      oidc-client-id: "client-id"
      oidc-client-secret: client-secret-value
      oidc-extra-scope: profile,email,openid
    ```

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="AWS EKS" key="AWS EKS">

To enable RBAC OIDC authentication manually for EKS clusters, update the Kubernetes pack by following these steps: 

<br />

1. In the Kubernetes pack, uncomment the lines in the ``oidcIdentityProvider`` parameter section, and enter your third-party IDP details.
<br />

  ```
  ## OIDC related config
    oidcIdentityProvider:
      identityProviderConfigName: 'Spectro-docs'     # The name of the OIDC provider configuration
      issuerUrl: 'issuer-url'       # The URL of the OpenID identity provider
      clientId: 'user-client-id-from-Palette'           # The ID for the client application that makes authentication requests to the OpenID identity provider
      usernameClaim: "email"                     # The JSON Web Token (JWT) claim to use as the username
      usernamePrefix: "-"                        # The prefix that is prepended to username claims to prevent clashes with existing names
      groupsClaim: "groups"                      # The JWT claim that the provider uses to return your groups
      groupsPrefix: ""                          # The prefix that is prepended to group claims to prevent clashes with existing names
      requiredClaims:                            # The key value pairs that describe required claims in the identity token
  ```

<br />


2. Under the ``clientConfig`` parameter section of Kubernetes pack, uncomment the ``oidc-`` configuration lines. <br /><br />

  ```
  ## Client configuration to add OIDC based authentication flags in kubeconfig
  clientConfig:
    oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
    oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
    oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
    oidc-extra-scope: profile,email
  ``` 

</Tabs.TabPane>

<Tabs.TabPane tab="Azure AKS" key="Azure AKS">
 

Kubernetes RBAC is enabled by default during AKS cluster creation. Follow these steps to link users and Roles to Azure AD. 

<br />

1. In the Azure console, verify Kubernetes RBAC is enabled for your cluster. If RBAC wasn't enabled when you originally deployed your cluster, you'll need to delete and re-create your cluster.
<br />

2. In Palette, create a cluster profile using the Spectro RBAC add-on pack available under Authentication packs in the Public Repo. Check out [Creating Cluster Profiles](/cluster-profiles/task-define-profile) to learn about cluster profiles.
<br />

3. Add information in the Spectro RBAC pack for users and groups and their Roles and RoleBindings based on the same information in Azure AD: <br /><br /> 

  ```
  clusterRoleBindings:
      - role: admin
        name: special-override-name
        subjects:
        - {type: User, name: user5}
        - {type: Group, name: group5}
      - role: view
        subjects:
        - {type: User, name: user6}
        - {type: Group, name: group6}
        - {type: ServiceAccount, name: group6, namespace: foo}
      namespaces:
      - namespace: team1
        createNamespace: true
        roleBindings:
      - role: admin
        name: special-override-name-role
        kind: ClusterRole
        subjects:
        - {type: User, name: user3}
        - {type: Group, name: group3}
      - role: view
        kind: ClusterRole
        subjects:
        - {type: User, name: user4}
        - {type: Group, name: group4}
  ```
<br />

  When roles and role bindings are created, they can be linked to the groups created in Azure AD. 


4. To get the user-specific kubeconfig file, run the following command:

  ``az aks get-credentials --resource-group <resource-group> --name <cluster-name>``

?? Should step 4 instead say: You can retrieve the user-specific kubeconfig file by invoking this command: ??  

??Why would users run the command? Is it instead of using UI to modify the manifest? Can they just connect button to display the kubeconfig???



<br />
My first draft replaced by steps above:
<br />
2. In the Azure console, create groups and users in Azure Active Directory (AD), then create Roles and RoleBindings for the users.

3. In Palette, create a cluster profile using the Spectro RBAC add-on pack available under Authentication packs in the Public Repo. Check out [Creating Cluster Profiles](/cluster-profiles/task-define-profile) to learn about cluster profiles.


</Tabs.TabPane>

</Tabs>

# Terraform

You can reference the Spectro Proxy pack in Terraform with a data resource.

```tf
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s-dashboard" {
 name    = "spectro-k8s-dashboard"
 version = "2.6.0"
 type = "spectro"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

Microsoft Access Control Using Kubernetes RBAC (https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.micro[…]icrosoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json&tabs=portal)

[Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)


