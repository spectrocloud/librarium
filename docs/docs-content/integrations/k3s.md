---
sidebar_label: 'K3s'
title: 'K3s'
description: 'K3s pack in Palette Edge'
hide_table_of_contents: true
type: "integration"
category: ['kubernetes', 'amd64', 'fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: ''
tags: ["packs", "kubernetes", "k3s", "edge"]
---

K3s is a lightweight distribution of Kubernetes, specifically designed for resource-constrained environments and IoT (Internet of Things) applications. Unlike standard Kubernetes with multiple binaries for its various components, K3s is packaged as a single binary with a lightweight storage backend, with minimal external dependencies. For more information about K3s, refer to [K3s documentation](https://docs.k3s.io/). 

K3s is available for Edge host deployments as well as virtual clusters that you can create from cluster groups. Refer to the Edge documentation and the [Create and Manage Cluster Groups](https://docs.spectrocloud.com/clusters/cluster-groups/create-cluster-group#palette-virtual-cluster-configuration) guide for more information. 

## Versions Supported

<Tabs queryString="versions">
<TabItem label="1.27.X" value="k3s_1.27">

### Prerequisites

- An edge device with AMD64(x86_64) processor architecture
- A minimum of 2 CPU cores and 1GB memory. 

### Parameters

|**Parameter**|**Description** |
|-------------|----------------|
| `cluster.config.cluster-cidr`| Specifies the CIDR range that can be used by pods in the cluster. | 
| `cluster.config.service-cidr`| Specifies the CIDR range that can be used by services in the cluster.|
| `kube-apiserver-arg`| This parameter contains extra arguments for the Kubernetes API server, such as enabling audit logging, enabling certain authorization modes, and setting profiling and secure-port.|
|`kube-controller-manager-arg` | This parameter describes extra arguments for the Kubernetes Controller Manager, such as enabling certain feature gates and setting profiling. |
| `kubelet-arg` |  This parameter contains extra arguments for kubelet during node registration, such as setting feature gates, protecting kernel defaults, and disabling the read-only port. |

### Usage

You can add K3s to an Edge cluster profile as the Kubernetes layer. Refer to the [Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide to learn more.

#### Configure OIDC Identity Provider for Edge Deployments

You can modify the Kubeadm file to configure your Edge cluster to use an OIDC Identity Provider (IDP) for authentication. 
You can use a custom third-party IDP such as Okta or you can use Palette as your IDP. 

When you add the PXK-E pack to a cluster profile, Palette displays the OIDC IDP options listed below:

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](kubernetes-edge.md#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting displays in the YAML file as `palette`.

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](../user-management/saml-sso/enable-saml.md) guide.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings). 

:::info

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::

To configure a custom OIDC IDP, choose **Custom** when adding the K3s pack to your profile, and then follow these steps:

1. Add the following OIDC parameters to the `apiServer.extraArgs` section of your Kubeadm file when creating a cluster profile.

   ```yaml
   cluster:
    config:
      clusterConfiguration:
        apiServer:
          extraArgs:
            oidc-issuer-url: "provider URL"
            oidc-client-id: "client-id"
            oidc-groups-claim: "groups"
            oidc-username-claim: "email"
   ```
2. Add the following `kubeadmconfig.clientConfig` section that contains OIDC parameters to your Kubernetes YAML file and replace the placeholders with your third-party OIDC IDP details.
   ```yaml
   kubeadmconfig:
    clientConfig:
      oidc-issuer-url: "<OIDC-ISSUER-URL>"
      oidc-client-id: "<OIDC-CLIENT-ID>"
      oidc-client-secret: "<OIDC-CLIENT-SECRET>"
      oidc-extra-scope: profile,email,openid
   ```

After you have configured the IDP for authentication, you can proceed to create role bindings to configure authorization in your cluster. Refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) for more guidance. 

#### Configure OIDC Identity Provider for Palette Virtual Clusters

If you are using K3s in a Palette Virtual Cluster inside of a cluster group, you can also configure OIDC for your cluster. Refer to [Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md) for more guidance.


### Terraform

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "edge-k3s"
  version = "1.27.5"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>
</Tabs>




