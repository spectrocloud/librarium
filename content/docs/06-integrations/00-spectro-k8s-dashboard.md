---
title: 'Spectro Kubernetes Dashboard'
metaTitle: "Spectro Cloud's Preconfigured Kubernetes Dashboard"
metaDescription: 'The Preconfigured Kubernetes Dashboard Monitoring pack in Palette reduces the complexity of standing up the Kubernetes dashboard for a cluster'
hiddenFromNav: true
type: "monitoring"
category: ["monitoring"]
logoUrl: 'https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png'
---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Spectro Kubernetes Dashboard

Spectro Kubernetes Dashboard is a web-based UI for Kubernetes clusters that auto-enables the Kubernetes Dashboard using secure ports and conveniently includes [Spectro Proxy](/integrations/frp). When used with the default settings for access control and Identity Provider (IDP), there is nothing to configure.

<br />

<WarningBox>

We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default settings can introduce misconfigurations. Carefully review the changes you make to a pack. 

</WarningBox>


# Versions Supported

**2.7.x**

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
| ingress.enabled | Ingress configuration to access the ClusterIP, loadBalancer, or nodePort. | `false` |

## Usage

To use the Spectro Kubernetes Dashboard pack, you have to add it to your cluster profile. Spectro Kubernetes Dashboard supports the following clouds:

- Amazon Web Services (AWS)
- Amazon Elastic Kubernetes Service (EKS)
- Canonical Metal as a Service (MAAS) 
- Google Cloud Platform (GCP)
- Microsoft Azure
- OpenStack
- VMware vSphere


Spectro Kubernetes Dashboard has the following default settings for **Access** and **Identity Provider**. Changing these default settings may require some additional configuration.
<br /> 

#### Access

The default setting is **Private**. When **Access** is set to **Private**, the latest version of the Spectro Proxy pack is included with Spectro Kubernetes Dashboard when you create your cluster profile.

If you change the setting to **Public** and your cluster is in a public cloud, there is no additional configuration.  

However, if you change **Access** to **Public** and your cluster is in a private cloud, you have to manually add and configure the Spectro Proxy pack to your cluster profile. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.

<br /> 

#### Identity Provider 

The default setting is **Palette**.

<br />

- **Palette**: No configuration is needed. This setting makes Palette the IDP, so any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard.

- **Inherit from Organization**: This setting requires you to configure OpenID Connect (OIDC) in Tenant Settings. In Tenant Admin scope, navigate to **Tenant Settings > SSO**, choose **OIDC**, and provide your third-party IDP details. For more information, check out the [SSO Setup](/user-management/saml-sso) guide. 

- **None**: This setting requires you to configure OIDC manually in the Kubernetes pack.

### Manually Configure OIDC

You only need to configure OIDC manually if you change the **Identity Provider** setting to **None**. The basic method to enable OIDC can be used for all cloud services except Amazon EKS. 

<br />

<Tabs>

<Tabs.TabPane tab="Basic OIDC Setup" key="Basic OIDC Setup">


To configure OIDC manually for clusters managed by most cloud providers, follow these steps: 

<br />

1. Copy ``oidc-`` configuration lines in the following code snippet and add them to the Kubernetes pack under the ``extraArgs`` parameter section. Enter your third-party provider details in quotes. <br /><br />

  ```
  kubeadmconfig:
    apiServer:
      extraArgs:
      oidc-issuer-url: "provider URL"
      oidc-client-id: "client-id"
      oidc-groups-claim: "groups"
      oidc-username-claim: "email"
  ```

2. Under the ``clientConfig`` parameter section of Kubernetes pack, uncomment the ``oidc-`` configuration lines, and enter your provider details in quotes. The provider URL and client-id must be the same in the ``extraArgs`` and ``clientConfig`` parameter sections. <br /><br />

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

To enable OIDC manually for EKS clusters, follow these steps: 

<br />

1. In the Kubernetes pack, uncomment the lines in the ``oidcIdentityProvider`` parameter section of the Kubernetes pack, and enter your third-party provider details.
<br />

  ```
    oidcIdentityProvider:
      identityProviderConfigName: 'Spectro-docs'
      issuerUrl: 'issuer-url'
      clientId: 'user-client-id-from-Palette'
      usernameClaim: "email"
      usernamePrefix: "-"
      groupsClaim: "groups"
      groupsPrefix: ""
      requiredClaims:
  ```

<br />


2. Under the ``clientConfig`` parameter section of Kubernetes pack, uncomment the ``oidc-`` configuration lines. <br /><br />

  ```
  clientConfig:
    oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
    oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
    oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
    oidc-extra-scope: profile,email
  ``` 

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

- [Microsoft Access Control Using Kubernetes RBAC](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.micro[…]icrosoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json&tabs=portal)

- [Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)


