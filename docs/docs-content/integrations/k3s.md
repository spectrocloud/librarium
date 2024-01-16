---
sidebar_label: 'K3s'
title: 'K3s'
description: "Learn about the K3s pack in Palette Edge and how you can use it within your Kubernetes clusters."
hide_table_of_contents: true
type: "integration"
category: ['kubernetes', 'amd64', 'fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/edge-k3s/blobs/sha256:5b7f8a80330d6938056848905238efbbd085e2f0f86fd03d7be10ccdabf791c7?type=image/png'
tags: ["packs", "kubernetes", "k3s", "edge"]
---

K3s is a lightweight distribution of Kubernetes that is specifically designed for resource-constrained environments and Internet of Things (IoT) applications. Unlike standard Kubernetes with multiple binaries for its various components, K3s is packaged as a single binary with a lightweight storage backend and minimal external dependencies. For more information about K3s, refer to [K3s documentation](https://docs.k3s.io/). 


### Support Lifecycle

We support other Kubernetes distributions such as K3s, Microk8s, and RKE2 until their official EOL. The EOL is set by the respective owner. Once we stop supporting the minor version, we initiate the deprecation process. Refer to the [Kubernetes Support Lifecycle](kubernetes-support.md#palette-extended-kubernetes-support) guide to learn more.

## Versions Supported

<Tabs queryString="versions">
<TabItem label="1.28.X" value="k3s_1.28">

### Prerequisites

- An edge device with AMD64 processor architecture or a Palette Virtual Cluster. 
- A minimum of 2 CPU cores and 1 GB memory. 

### Parameters

Since you can deploy both virtual clusters and Edge clusters using K3s, you have different configuration options depending on the cluster type.

<Tabs queryString="cluster-types">

<TabItem label="Edge" value="edge">

|**Parameter**|**Description** |
|-------------|----------------|
| `cluster.config.cluster-cidr`| Specifies the CIDR range that can be used by pods in the cluster. | 
| `cluster.config.service-cidr`| Specifies the CIDR range that can be used by services in the cluster.|
| `kube-apiserver-arg`| This parameter contains extra arguments for the Kubernetes API server, such as enabling audit logging, enabling certain authorization modes, and setting profiling and secure-port.|
|`kube-controller-manager-arg` | This parameter describes extra arguments for the Kubernetes Controller Manager, such as enabling certain feature gates and setting profiling. |
| `kubelet-arg` |  This parameter contains extra arguments for Kubelet during node registration, such as setting feature gates, protecting kernel defaults, and disabling the read-only port. |
| `pack.palette.config.oidc.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the K3s pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](#configure-custom-oidc). |

You can add cloud-init stages, which allow you to customize your instances declaratively. The cloud-init stages are exposed by [Kairos](https://kairos.io/docs/architecture/cloud-init/), an open source project. For more information, check out the [Cloud Init Stages](../clusters/edge/edge-configuration/cloud-init.md) reference.
</TabItem>

<TabItem label="Palette Virtual Cluster" value="palette-virtual-cluster">

Since you are setting up a virtual cluster inside another Kubernetes cluster, you can configure its pods and services differently than the host cluster. The default configuration file you get includes parameters that offer you a higher degree of customization. These configuration parameters are exposed in the cluster group settings page.  

|**Parameter**|**Description** |
|-------------|----------------|
|`enableHA`| Determines whether the control plane is deployed in high availability mode. If you set this parameter to true, make sure to adjust the number of replicas and use an external datastore. |
|`defaultImageRegistry` | Specifies the default registry from which images are pulled. The value of this parameter will be prepended to all deployed virtual cluster images. If an image has already been deployed as part of the virtual cluster, the deployed images within the virtual cluster will not be rewritten.|
|`sync` | Specifies which Kubernetes resources are synced between the virtual and host clusters. |
|`storage` | Specifies storage settings such as persistence and PVC size. By default, storage of the virtual cluster uses the same storage class as the host cluster, but you can also optionally specify a different storage class. |
|`ingress` | Configures the ingress resource that allows you to access the virtual cluster. |

</TabItem>
</Tabs>


### Usage

K3s is available for Edge host deployments as well as virtual clusters that you can create from cluster groups. Refer to the [Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide and the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide for more information. 

:::info
In order to use K3s as part of an Edge deployment, you need to go through the EdgeForge process and specify K3s as your intended Kubernetes distribution when you build your OS image. For more information, refer to the [EdgeForge Workflow](../clusters/edge/edgeforge-workflow/) guide. 
:::

#### Configure OIDC Identity Provider for Edge

You can modify the configuration file to configure your Edge cluster to use an OpenID Connect (OIDC) Identity Provider (IDP) for authentication. 
You can use a custom third-party IDP, such as Okta, or use Palette as your IDP. 

When you add the K3s pack to a cluster profile, Palette displays the OIDC IDP options listed below:

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](kubernetes-edge.md#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to use kubectl CLI to access cluster. This setting displays in the YAML file as `palette`. When you select **Palette**, all you have to do to enable OIDC for your cluster is create role bindings to configure authorization. You do not need to provide extra parameters such as `oidc-issuer-url` as you need to when you configure a custom OIDC provider. 

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](../user-management/saml-sso/enable-saml.md) guide.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings). 

:::warning

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::

To configure a custom OIDC IDP, choose **Custom** when adding the K3s pack to your profile, and then follow these steps:

1. Add the following OIDC parameters to the `kube-apiserver-arg` section of your configuration file for your Kubernetes layer when creating a cluster profile.

   ```yaml
   cluster:
    config: 
       kube-apiserver-arg:
        - oidc-issuer-url="provider URL"
        - oidc-client-id="client-id"
        - oidc-groups-claim="groups"
        - oidc-username-claim="email"
   ```
2. Add the following `clientConfig` section that contains OIDC parameters to your Kubernetes YAML file and replace the placeholders with your third-party OIDC IDP details. The `clientConfig` section must be placed at the root level of the YAML file. 
   ```yaml
  clientConfig:
    oidc-issuer-url: "OIDC-ISSUER-URL"
    oidc-client-id: "OIDC-CLIENT-ID"
    oidc-client-secret: "OIDC-CLIENT-SECRET"
    oidc-extra-scope: profile,email,openid
   ```

After you have configured the IDP for authentication, you can proceed to create role bindings to configure authorization in your cluster. Refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) for more guidance. 

#### Configure OIDC Identity Provider for Palette Virtual Clusters

If you are using K3s in a virtual cluster inside of a cluster group, you can also configure OIDC for your cluster. Refer to [Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md) for more guidance.

#### Add a Certificate for Reverse Proxy

You can use a reverse proxy with a K3s Kubernetes cluster. The reverse proxy allows you to connect to the cluster API of a Palette-managed Kubernetes cluster in private networks or clusters configured with private API endpoints. For more information, refer to the [Spectro Proxy](frp.md) pack guide.



</TabItem>
<TabItem label="1.27.X" value="k3s_1.27">

### Prerequisites

- An edge device with AMD64(x86_64) processor architecture or a Palette Virtual Cluster. 
- A minimum of 2 CPU cores and 1 GB memory. 

### Parameters

Since you can deploy both virtual clusters and Edge clusters using K3s, you have different configuration options depending on the cluster type.

<Tabs queryString="cluster-types">

<TabItem label="Edge" value="edge">

|**Parameter**|**Description** |
|-------------|----------------|
| `cluster.config.cluster-cidr`| Specifies the CIDR range that can be used by pods in the cluster. | 
| `cluster.config.service-cidr`| Specifies the CIDR range that can be used by services in the cluster.|
| `kube-apiserver-arg`| This parameter contains extra arguments for the Kubernetes API server, such as enabling audit logging, enabling certain authorization modes, and setting profiling and secure-port.|
|`kube-controller-manager-arg` | This parameter describes extra arguments for the Kubernetes Controller Manager, such as enabling certain feature gates and setting profiling. |
| `kubelet-arg` |  This parameter contains extra arguments for Kubelet during node registration, such as setting feature gates, protecting kernel defaults, and disabling the read-only port. |
| `pack.palette.config.oidc.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the K3s pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](#configure-custom-oidc). |

You can add cloud-init stages, which allow you to customize your instances declaratively. The cloud-init stages are exposed by [Kairos](https://kairos.io/docs/architecture/cloud-init/), an open source project. For more information, check out the [Cloud Init Stages](../clusters/edge/edge-configuration/cloud-init.md) reference.
</TabItem>

<TabItem label="Palette Virtual Cluster" value="palette-virtual-cluster">

Since you are setting up a virtual cluster inside another Kubernetes cluster, you can configure its pods and services differently than the host cluster. The default configuration file you get includes parameters that offer you a higher degree of customization. These configuration parameters are exposed in the cluster group settings page.  

|**Parameter**|**Description** |
|-------------|----------------|
|`enableHA`| Determines whether the control plane is deployed in high availability mode. If you set this parameter to true, make sure to adjust the number of replicas and use an external datastore. |
|`defaultImageRegistry` | Specifies the default registry from which images are pulled. The value of this parameter will be prepended to all deployed virtual cluster images. If an image has already been deployed as part of the virtual cluster, the deployed images within the virtual cluster will not be rewritten.|
|`sync` | Specifies which Kubernetes resources are synced between the virtual and host clusters. |
|`storage` | Specifies storage settings such as persistence and PVC size. By default, storage of the virtual cluster uses the same storage class as the host cluster, but you can also optionally specify a different storage class. |
|`ingress` | Configures the ingress resource that allows you to access the virtual cluster. |
</TabItem>
</Tabs>


### Usage

K3s is available for Edge host deployments as well as virtual clusters that you can create from cluster groups. Refer to the [Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide and the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide for more information. 

:::info
In order to use K3s as part of an Edge deployment, you need to go through the EdgeForge process and specify K3s as your intended Kubernetes distribution when you build your OS image. For more information, refer to the [EdgeForge Workflow](../clusters/edge/edgeforge-workflow/) guide. 
:::

#### Configure OIDC Identity Provider for Edge

You can modify the configuration file to configure your Edge cluster to use an OpenID Connect (OIDC) Identity Provider (IDP) for authentication. 
You can use a custom third-party IDP, such as Okta, or use Palette as your IDP. 

When you add the K3s pack to a cluster profile, Palette displays the OIDC IDP options listed below:

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](kubernetes-edge.md#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to use kubectl CLI to access cluster. This setting displays in the YAML file as `palette`. When you select **Palette**, all you have to do to enable OIDC for your cluster is create role bindings to configure authorization. You do not need to provide extra parameters such as `oidc-issuer-url` as you need to when you configure a custom OIDC provider. 

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](../user-management/saml-sso/enable-saml.md) guide.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings). 

:::warning

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::

To configure a custom OIDC IDP, choose **Custom** when adding the K3s pack to your profile, and then follow these steps:

1. Add the following OIDC parameters to the `kube-apiserver-arg` section of your configuration file for your Kubernetes layer when creating a cluster profile.

   ```yaml
   cluster:
    config: 
       kube-apiserver-arg:
        - oidc-issuer-url="provider URL"
        - oidc-client-id="client-id"
        - oidc-groups-claim="groups"
        - oidc-username-claim="email"
   ```
2. Add the following `clientConfig` section that contains OIDC parameters to your Kubernetes YAML file and replace the placeholders with your third-party OIDC IDP details. The `clientConfig` section must be placed at the root level of the YAML file. 

   ```yaml
   clientConfig:
      oidc-issuer-url: "OIDC-ISSUER-URL"
      oidc-client-id: "OIDC-CLIENT-ID"
      oidc-client-secret: "OIDC-CLIENT-SECRET"
      oidc-extra-scope: profile,email,openid
   ```

After you have configured the IDP for authentication, you can proceed to create role bindings to configure authorization in your cluster. Refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) for more guidance. 

#### Configure OIDC Identity Provider for Palette Virtual Clusters

If you are using K3s in a virtual cluster inside of a cluster group, you can also configure OIDC for your cluster. Refer to [Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md) for more guidance.

#### Add a Certificate for Reverse Proxy

You can use a reverse proxy with a K3s Kubernetes cluster. The reverse proxy allows you to connect to the cluster API of a Palette-managed Kubernetes cluster in private networks or clusters configured with private API endpoints. For more information, refer to the [Spectro Proxy](frp.md) pack guide.

</TabItem>

<TabItem label="1.26.X" value="k3s_1.26">

### Prerequisites

- An edge device with AMD64(x86_64) processor architecture or a Palette Virtual Cluster. 
- A minimum of 2 CPU cores and 1 GB memory. 

### Parameters

Since you can deploy both virtual clusters and Edge clusters using K3s, you have different configuration options depending on the cluster type.

<Tabs queryString="cluster-types">

<TabItem label="Edge" value="edge">

|**Parameter**|**Description** |
|-------------|----------------|
| `cluster.config.cluster-cidr`| Specifies the CIDR range that can be used by pods in the cluster. | 
| `cluster.config.service-cidr`| Specifies the CIDR range that can be used by services in the cluster.|
| `kube-apiserver-arg`| This parameter contains extra arguments for the Kubernetes API server, such as enabling audit logging, enabling certain authorization modes, and setting profiling and secure-port.|
|`kube-controller-manager-arg` | This parameter describes extra arguments for the Kubernetes Controller Manager, such as enabling certain feature gates and setting profiling. |
| `kubelet-arg` |  This parameter contains extra arguments for Kubelet during node registration, such as setting feature gates, protecting kernel defaults, and disabling the read-only port. |
| `pack.palette.config.oidc.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the K3s pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](#configure-custom-oidc). |

You can add cloud-init stages, which allow you to customize your instances declaratively. The cloud-init stages are exposed by [Kairos](https://kairos.io/docs/architecture/cloud-init/), an open source project. For more information, check out the [Cloud Init Stages](../clusters/edge/edge-configuration/cloud-init.md) reference.
</TabItem>

<TabItem label="Palette Virtual Cluster" value="palette-virtual-cluster">

Since you are setting up a virtual cluster inside another Kubernetes cluster, you can configure its pods and services differently than the host cluster. The default configuration file you get includes parameters that offer you a higher degree of customization. These configuration parameters are exposed in the cluster group settings page.

|**Parameter**|**Description** |
|-------------|----------------|
|`enableHA`| Determines whether the control plane is deployed in high availability mode. If you set this parameter to true, make sure to adjust the number of replicas and use an external datastore. |
|`defaultImageRegistry` | Specifies the default registry from which images are pulled. The value of this parameter will be prepended to all deployed virtual cluster images. If an image has already been deployed as part of the virtual cluster, the deployed images within the virtual cluster will not be rewritten.|
|`sync` | Specifies which Kubernetes resources are synced between the virtual and host clusters. |
|`storage` | Specifies storage settings such as persistence and PVC size. By default, storage of the virtual cluster uses the same storage class as the host cluster, but you can also optionally specify a different storage class. |
|`ingress` | Configures the ingress resource that allows you to access the virtual cluster. |
</TabItem>
</Tabs>


### Usage

K3s is available for Edge host deployments as well as virtual clusters that you can create from cluster groups. Refer to the [Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide and the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide for more information. 

:::info
In order to use K3s as part of an Edge deployment, you need to go through the EdgeForge process and specify K3s as your intended Kubernetes distribution when you build your OS image. For more information, refer to the [EdgeForge Workflow](../clusters/edge/edgeforge-workflow/) guide. 
:::

#### Configure OIDC Identity Provider for Edge

You can modify the configuration file to configure your Edge cluster to use an OpenID Connect (OIDC) Identity Provider (IDP) for authentication. 
You can use a custom third-party IDP, such as Okta, or use Palette as your IDP. 

When you add the K3s pack to a cluster profile, Palette displays the OIDC IDP options listed below:

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](kubernetes-edge.md#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to use kubectl CLI to access cluster. This setting displays in the YAML file as `palette`. Selecting **Palette** in this setting and creating role bindings to configure authorization are all you need to do to enable OIDC for your cluster. You do not need to provide extra parameters such as `oidc-issuer-url` as you need to when you configure a custom OIDC provider. 

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](../user-management/saml-sso/enable-saml.md) guide.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings). 

:::warning

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::

To configure a custom OIDC IDP, choose **Custom** when adding the K3s pack to your profile, and then follow these steps:

1. Add the following OIDC parameters to the `kube-apiserver-arg` section of your configuration file for your Kubernetes layer when creating a cluster profile.

   ```yaml
   cluster:
    config:  
       kube-apiserver-arg:
        - oidc-issuer-url="provider URL"
        - oidc-client-id="client-id"
        - oidc-groups-claim="groups"
        - oidc-username-claim="email"
   ```
2. Add the following `clientConfig` section that contains OIDC parameters to your Kubernetes YAML file and replace the placeholders with your third-party OIDC IDP details. The `clientConfig` section must be placed at the root level of the YAML file. 
   ```yaml
   clientConfig:
      oidc-issuer-url: "OIDC-ISSUER-URL"
      oidc-client-id: "OIDC-CLIENT-ID"
      oidc-client-secret: "OIDC-CLIENT-SECRET"
      oidc-extra-scope: profile,email,openid
   ```

After you have configured the IDP for authentication, you can proceed to create role bindings to configure authorization in your cluster. Refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) for more guidance. 

#### Configure OIDC Identity Provider for Palette Virtual Clusters

If you are using K3s in a virtual cluster inside of a cluster group, you can also configure OIDC for your cluster. Refer to [Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md) for more guidance.

#### Add a Certificate for Reverse Proxy

You can use a reverse proxy with a K3s Kubernetes cluster. The reverse proxy allows you to connect to the cluster API of a Palette-managed Kubernetes cluster in private networks or clusters configured with private API endpoints. For more information, refer to the [Spectro Proxy](frp.md) pack guide.

</TabItem>

<TabItem label="1.25.X" value="k3s_1.25">

### Prerequisites

- An edge device with AMD64(x86_64) processor architecture or a virtual cluster. 
- A minimum of 2 CPU cores and 1 GB memory. 

### Parameters

Since you can deploy both virtual clusters and Edge clusters using K3s, you have different configuration options depending on the cluster type.

<Tabs queryString="cluster-types">

<TabItem label="Edge" value="edge">

|**Parameter**|**Description** |
|-------------|----------------|
| `cluster.config.cluster-cidr`| Specifies the CIDR range that can be used by pods in the cluster. | 
| `cluster.config.service-cidr`| Specifies the CIDR range that can be used by services in the cluster.|
| `kube-apiserver-arg`| This parameter contains extra arguments for the Kubernetes API server, such as enabling audit logging, enabling certain authorization modes, and setting profiling and secure-port.|
|`kube-controller-manager-arg` | This parameter describes extra arguments for the Kubernetes Controller Manager, such as enabling certain feature gates and setting profiling. |
| `kubelet-arg` |  This parameter contains extra arguments for Kubelet during node registration, such as setting feature gates, protecting kernel defaults, and disabling the read-only port. |
| `pack.palette.config.oidc.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the K3s pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](#configure-custom-oidc). |

You can add cloud-init stages, which allow you to customize your instances declaratively. The cloud-init stages are exposed by [Kairos](https://kairos.io/docs/architecture/cloud-init/), an open source project. For more information, check out the [Cloud Init Stages](../clusters/edge/edge-configuration/cloud-init.md) reference.
</TabItem>

<TabItem label="Palette Virtual Cluster" value="palette-virtual-cluster">

Since you are setting up a virtual cluster inside another Kubernetes cluster, you can configure its pods and services differently than the host cluster. The default configuration file you get includes parameters that offer you a higher degree of customization. These configuration parameters are exposed in the cluster group settings page.

|**Parameter**|**Description** |
|-------------|----------------|
|`enableHA`| Determines whether the control plane is deployed in high availability mode. If you set this parameter to true, make sure to adjust the number of replicas and use an external datastore. |
|`defaultImageRegistry` | Specifies the default registry from which images are pulled. The value of this parameter will be prepended to all deployed virtual cluster images. If an image has already been deployed as part of the virtual cluster, the deployed images within the virtual cluster will not be rewritten.|
|`sync` | Specifies which Kubernetes resources are synced between the virtual and host clusters. |
|`storage` | Specifies storage settings such as persistence and PVC size. By default, storage of the virtual cluster uses the same storage class as the host cluster, but you can also optionally specify a different storage class. |
|`ingress` | Configures the ingress resource that allows you to access the virtual cluster. |
</TabItem>
</Tabs>


### Usage

K3s is available for Edge host deployments as well as virtual clusters that you can create from cluster groups. Refer to the [Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide and the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide for more information. 

:::info
In order to use K3s as part of an Edge deployment, you need to go through the EdgeForge process and specify K3s as your intended Kubernetes distribution when you build your OS image. For more information, refer to the [EdgeForge Workflow](../clusters/edge/edgeforge-workflow/) guide. 
:::

#### Configure OIDC Identity Provider for Edge

You can modify the configuration file to configure your Edge cluster to use an OpenID Connect (OIDC) Identity Provider (IDP) for authentication. 
You can use a custom third-party IDP, such as Okta, or use Palette as your IDP. 

When you add the K3s pack to a cluster profile, Palette displays the OIDC IDP options listed below:

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](kubernetes-edge.md#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to use kubectl CLI to access cluster. This setting displays in the YAML file as `palette`. Selecting **Palette** in this setting and creating role bindings to configure authorization are all you need to do to enable OIDC for your cluster. You do not need to provide extra parameters such as `oidc-issuer-url` as you need to when you configure a custom OIDC provider. 

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](../user-management/saml-sso/enable-saml.md) guide.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings). 

:::warning

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::

To configure a custom OIDC IDP, choose **Custom** when adding the K3s pack to your profile, and then follow these steps:

1. Add the following OIDC parameters to the `kube-apiserver-arg` section of your configuration file for your Kubernetes layer when creating a cluster profile.

   ```yaml
   cluster:
    config:  
       kube-apiserver-arg:
        - oidc-issuer-url="provider URL"
        - oidc-client-id="client-id"
        - oidc-groups-claim="groups"
        - oidc-username-claim="email"
   ```
2. Add the following `clientConfig` section that contains OIDC parameters to your Kubernetes YAML file and replace the placeholders with your third-party OIDC IDP details. The `clientConfig` section must be placed at the root level of the YAML file. 
   ```yaml
   clientConfig:
      oidc-issuer-url: "OIDC-ISSUER-URL"
      oidc-client-id: "OIDC-CLIENT-ID"
      oidc-client-secret: "OIDC-CLIENT-SECRET"
      oidc-extra-scope: profile,email,openid
   ```

After you have configured the IDP for authentication, you can proceed to create role bindings to configure authorization in your cluster. Refer to [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) for more guidance. 

#### Configure OIDC Identity Provider for Palette Virtual Clusters

If you are using K3s in a virtual clusters inside of a cluster group, you can also configure OIDC for your cluster. Refer to [Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md) for more guidance.

#### Add a Certificate for Reverse Proxy

You can use a reverse proxy with a K3s Kubernetes cluster. The reverse proxy allows you to connect to the cluster API of a Palette-managed Kubernetes cluster in private networks or clusters configured with private API endpoints. For more information, refer to the [Spectro Proxy](frp.md) pack guide.

</TabItem>

<TabItem label="Deprecated" value="deprecated">

:::warning
All versions less than v1.25.x are considered deprecated. Upgrade to a newer version to take advantage of new features.
:::

</TabItem>

</Tabs>

### Terraform

You can retrieve details about the K3s pack by using the following Terraform code.

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



