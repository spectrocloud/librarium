---
title: 'Spectro Kubernetes Dashboard'
metaTitle: 'Spectro Cloud's Integrated Kubernetes Dashboard'
metaDescription: 'Kubernetes Dashboard Monitoring pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['Spectro Integrations', 'monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Spectro Kubernetes Dashboard

Spectro Kubernetes Dashboard is a web-based UI for Kubernetes clusters. It is similar to [Kubernetes Dashboard](https://github.com/kubernetes/dashboard) in that it allow users to manage and troubleshoot applications running in the cluster and manage the cluster itself. However, Spectro Kubernetes Dashboard doesn’t require configuration. It’s easy to enable and it integrates seamlessly with Spectro Proxy.

When you attach this pack to a cluster profile, it automatically adds the Spectro Proxy pack with the Kubernetes dashboard already enabled and using secure ports. Additionally, when used with the default settings, there is nothing to configure.
<br />

<WarningBox>
Default settings for the dashboard provide best practices for your clusters. Changing the default settings can introduce security issues by exposing your clusters. We recommend using the defaults.
</WarningBox>

# Versions Supported

<Tabs>

<Tabs.TabPane tab="2.6.x" key="2.6.x">

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

To use the Spectro Kubernetes Dashboard pack, you have to add it to your cluster profile. The Spectro Kubernetes Dashboard pack has default settings for **Access** and **Identity Provider**. These settings automatically install the latest version of the Spectro Proxy pack when the cluster is created.

Changing these default settings may require some additional configuration.
<br /> 

### Access

The default setting is **Private**. If you change the setting to **Public** and your cluster is in a public cloud, there is no additional configuration.  

However, if you change **Access** to **Public** and your cluster is in a private cloud, you have to manually add and configure the Spectro Proxy pack to your cluster profile. For more information, refer to the [Spectro Proxy](https://docs.spectrocloud.com/integrations/frp) guide.
<br /> 

### Identity Provider 

The default setting is **Palette**. If you change this setting to **Inherit from Tenant**, you must configure OpenID Connect (OIDC) authentication. You can configure OIDC two ways:

- In Tenant Admin scope, navigate to **Tenant Settings > SSO**, choose **OIDC**, and provide your third-party Identity Provider details.  

- In **Tenant Settings > SSO**, if you choose **None** or **SAML**, you must configure OIDC manually in the Kubernetes pack. 

### Enable OIDC Authentication

To enable OIDC authentication manually, copy the configuration shown in the example to the Kubernetes Pack and provide your third-party Identity Provider details.
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


To add OIDC-based authentication flags in kubeconfig, uncomment the lines as shown in the example.
<br />

```
## Client configuration to add OIDC based authentication flags in kubeconfig
clientConfig:
  oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
  oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
  oidc-client-secret: client-secret-value
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

[Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)
