---
sidebar_label: "Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description:
  "Palette's pre-configured Kubernetes Dashboard Monitoring pack reduces the complexity of standing up the Kubernetes
  dashboard for a cluster."
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "arm64", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image.webp"
tags: ["packs", "spectro-k8s-dashboard", "monitoring"]
---

Spectro Kubernetes Dashboard is a web-based UI for Kubernetes clusters that auto-enables the Kubernetes Dashboard using
secure ports and conveniently includes the [Spectro Proxy](frp.md) pack.

## Versions Supported

**2.7.x**

<br />

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the
  [Spectro Proxy](frp.md) reverse proxy.

- Users or groups must be mapped to a Kubernetes RBAC role, either a _Role_ or a _ClusterRole_. You can create a custom
  role through a manifest and use Palette's roleBinding feature to associate users or groups with the role. Refer to the
  [Create a Role Binding](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

<!-- <br />

#### User Selections

These settings are also included in the manifest as `access` and `identityProvider` parameters.

| Parameter | Description | Default |
|-----------|-------------|---------|
| **Proxieds** | Controls cluster access. Private access means that nodes and pods are isolated from the internet. | Private |
| **Direct** | You can use Palette as the IDP or a third-party application as the IDP. | Palette |

#### Internal Manifest Parameters -->

| Parameter             | Description                                                                                                                             | Default                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `namespace`           | The Kubernetes namespace to install the dashboard.                                                                                      | `kubernetes-dashboard` |
| `ClusterRole`         | The ClusterRole to assign to the Spectro Kubernetes Dashboard.                                                                          | `read-only`            |
| `certDuration`        | Self-signed certificate duration in hours.                                                                                              | 8760h (365d)           |
| `certRenewal`         | Self-signed certificate renewal in hours                                                                                                | 720h (30d)             |
| `enableInsecureLogin` | RBAC ensures secure login.                                                                                                              | `false`                |
| `serviceType`         | The service type for the dashboard. Supported values are `ClusterIP`, `LoadBalancer`, and `NodePort`.                                   | `ClusterIP`            |
| `skipLogin`           | Enables or disables the skip login option on the Spectro Kubernetes Dashboard.                                                          | `false`                |
| `enableInsecureLogin` | Enables non-Secure Sockets Layer (SSL) login. Dashboard login is always restricted to HTTP(S) + localhost or HTTPS and external domain. | `false`                |
| `ingress.enabled`     | Ingress configuration to access the `ClusterIP`, `LoadBalancer`, or `NodePort`.                                                         | `false`                |

## Usage

To use the Spectro Kubernetes Dashboard pack, you have to add it to your cluster profile. Spectro Kubernetes Dashboard
supports several public cloud and data center cloud environments. To learn more, refer to [Clusters](/clusters).

Use the following information to find the Kubernetes Dashboard pack.

- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Spectro Kubernetes Dashboard
- **Pack Version**: 2.7.0 or higher

Spectro Kubernetes Dashboard has the following Access options.

<br />

- **Proxied**: This option is useful for access to the Kubernetes Dashboard from anywhere and leverages the Spectro
  Proxy pack, which gets installed automatically. The Service resource for the Kubernetes Dashboard will be configured
  as ClusterIP and is only accessible through the proxy. To learn more, check out the [Spectro Proxy](frp.md) guide.

- **Direct**: This option is meant for a private configuration where a proxy is not implemented or not desired. The
  Service resource for the Kubernetes Dashboard will be configured as LoadBalancer, which you can access directly. This
  option requires you to be on a network that can reach the IP address given to the LoadBalancer service.

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
