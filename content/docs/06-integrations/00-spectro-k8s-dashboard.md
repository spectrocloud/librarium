---
title: 'Spectro Kubernetes Dashboard'
metaTitle: "Spectro Cloud's Pre-configured Kubernetes Dashboard"
metaDescription: 'Palette's pre-configured Kubernetes Dashboard Monitoring pack reduces the complexity of standing up the Kubernetes dashboard for a cluster.'
hiddenFromNav: true
type: "integration"
category: ["monitoring"]
logoUrl: 'https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png'
---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Spectro Kubernetes Dashboard

Spectro Kubernetes Dashboard is a web-based UI for Kubernetes clusters that auto-enables the Kubernetes Dashboard using secure ports and conveniently includes [Spectro Proxy](/integrations/frp). 


# Versions Supported

**2.7.x**

<br />

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a *Role* or a *ClusterRole*. You can create a custom role through a manifest and use Palette's roleBinding feature to associate users or groups with the role. Refer to the [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) guide to learn more. 


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

To use the Spectro Kubernetes Dashboard pack, you have to add it to your cluster profile. Spectro Kubernetes Dashboard supports several public cloud and data center cloud environments. To learn more, refer to [Clusters](/clusters).

Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Spectro Kubernetes Dashboard
- **Pack Version**: 2.7.0 or higher

Spectro Kubernetes Dashboard has the following **Access** options.

<br /> 

- **Proxied**: This option provides private access to your cluster when the cluster is in a private cloud. This option requires the Spectro Proxy pack, which is integrated with the Spectro Kubernetes Dashboard. The latest version of the Spectro Proxy pack is automatically installed when you create the cluster. To learn more, check out the [Spectro Proxy](/integrations/frp) guide.

- **Direct**: This option provides direct access to your cluster when the cluster is in a public cloud.

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
 version = "2.7.0"
 type = "helm"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

- [Microsoft Access Control Using Kubernetes RBAC](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.micro[…]icrosoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json&tabs=portal)


- [Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)


