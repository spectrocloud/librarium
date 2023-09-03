---
sidebar_label: "Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description: "Palette's pre-configured Kubernetes Dashboard Monitoring pack reduces the complexity of standing up the Kubernetes dashboard for a cluster."
hide_table_of_contents: true
type: "integration"
category: ["monitoring", 'arm64', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png'
tags: ['packs', 'spectro-k8s-dashboard', 'monitoring']
---


Spectro Kubernetes Dashboard is a web-based UI for Kubernetes clusters that auto-enables the Kubernetes Dashboard using secure ports and conveniently includes the [Spectro Proxy](/integrations/frp) pack. 


## Versions Supported

**2.7.x**

<br />

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a *Role* or a *ClusterRole*. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) guide to learn more. 


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

All IDP options below require you to map a set of users or groups to a Kubernetes RBAC role. There are two options you can use to get started with the Kubernetes Dashboard and an IDP.

* You can create a custom role by using a manifest file in your cluster profile and specifying the creation of a Role or ClusterRole. You can also specify the roleBinding in the same manifest file. 


* Alternatively, you can use the [default Kubernetes cluster roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) that are available and create a roleBinding for a set of users or groups. As an example, you could assign yourself or another user a roleBinding to the role `view` or `cluster-admin`. By assigning yourself or your users one of the default Kubernetes roles, you will be able to view resources in the Kubernetes Dashboard. Use the [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) guide to learn more.  

![The two options presented above displayed in a diagram](/integrations_spectro-k8s-dashboard_diagram-flow-users.png)

### Selecting Identity Provider 

The default setting is **Palette**.

<br />

- **Palette**: This setting makes Palette the IDP, so any user with a Palette account in the tenant and the proper permissions to view and access the project's resources can log into the Kubernetes dashboard.


- **Inherit from Organization**: This setting requires you to configure OpenID Connect (OIDC) in Tenant Settings. In Tenant Admin scope, navigate to **Tenant Settings > SSO**, choose **OIDC**, and provide your third-party IDP details. For more information, check out the [SSO Setup](/user-management/saml-sso) guide. 

- **None**: This setting requires you to configure OIDC manually in the Kubernetes pack.

### Manually Configure OIDC

You only need to configure OIDC manually if you change the **Identity Provider** setting to **None**. The basic method to enable OIDC can be used for all cloud services except Amazon EKS. 

<br />

<Tabs>

<Tabs.TabPane tab="Basic OIDC Setup" key="Basic OIDC Setup">

<br />

Follow the steps in the [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc) guide.

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

## Terraform

You can reference the Spectro Proxy pack in Terraform with a data resource.

<br />

```hcl
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

## References

- [Microsoft Access Control Using Kubernetes RBAC](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.micro[…]icrosoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json&tabs=portal)

- [Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)


