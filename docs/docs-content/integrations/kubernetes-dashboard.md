---
sidebar_label: "Kubernetes Dashboard"
title: "Kubernetes Dashboard"
description: "Learn how to manage Kubernetes clusters and applications deployed in them by using the Kubernetes Dashboard Monitoring pack."
type: "integration"
hide_table_of_contents: true
category: ['monitoring', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png"
tags: ['packs', 'kubernetes-dashboard', 'monitoring']
---


[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general-purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them and manage the cluster itself. 

The Kubernetes Dashboard pack you can use to access the dashboard requires the Spectro Proxy pack to expose the dashboard.
<br /> 

:::info

Palette supports provisioning a reverse proxy that can expose the Kubernetes dashboard. Use the [Spectro Proxy](/integrations/frp) pack to enable this capability. 

:::

A user-friendly version of this pack is available, Spectro Kubernetes Dashboard, which requires minimal configuration when used with the default settings. To learn more, check out [Spectro Kubernetes Dashboard](/integrations/spectro-k8s-dashboard).


<br />



## Versions Supported

<Tabs queryString="versions">

<TabItem label="2.7.x" value="2.7.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the [Spectro Proxy](frp.md) reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| `k8s-dashboard.namespace` | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| `k8s-dashboard.clusterRole` | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources.<br /><br />By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| `k8s-dashboard.certDuration` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| `k8s-dashboard.certRenewal` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| `k8s-dashboard.serviceType` | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommend using ClusterIP service type to restrict access to the cluster.|
| `k8s-dashboard.skipLogin` | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. We recommend using this only for demo purposes, as enabling it could expose a security risk. |

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide. 

:::

## Usage

To use the Kubernetes Dashboard pack, you have to add it to your cluster profile. Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Kubernetes Dashboard
- **Pack Version**: 2.0.x or higher

The Kubernetes Dashboard pack requires the [Spectro Proxy](frp.md) pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.


### Access Kubernetes Dashboard

When connected to the cluster remotely, issue the following command to establish a connection to deploy the Kubernetes Dashboard on port 8080. 


<br />

```bash
kubectl port-forward -namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />

```bash
kubectl -namespace kubernetes-dashboard describe secret  \
$(kubectl -namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
  
The following example shows the command output with the token value.

<br />

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

<br />

### Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

<br />

1. Ensure the `service.type` parameter is set to "ClusterIP".


2. To enable ingress, set the `ingress.enabled` parameter to "true".


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.

<br />

### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

</TabItem>



<TabItem label="2.6.x" value="2.6.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the [Spectro Proxy](frp.md) reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| `k8s-dashboard.namespace` | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| `k8s-dashboard.clusterRole` | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources.<br /><br />By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| `k8s-dashboard.certDuration` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| `k8s-dashboard.certRenewal` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| `k8s-dashboard.serviceType` | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommend using ClusterIP service type to restrict access to the cluster.|
| `k8s-dashboard.skipLogin` | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. We recommend using this only for demo purposes, as enabling it could expose a security risk. |
:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide. 

:::

## Usage

To use the Kubernetes Dashboard pack, you have to add it to your cluster profile. Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Kubernetes Dashboard
- **Pack Version**: 2.0.x or higher

The Kubernetes Dashboard pack requires the [Spectro Proxy](frp.md) pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

<br />

### Access Kubernetes Dashboard

When connected to the cluster remotely, run the following command to establish a connection to deploy the Kubernetes Dashboard on port 8080. 

<br />

```bash
kubectl port-forward -namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />

```bash
kubectl -namespace kubernetes-dashboard describe secret $(kubectl -namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
  
The following example shows the command output with the token value.

<br />

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

<br />

### Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

<br />

1. Ensure the `service.type` parameter is set to "ClusterIP".


2. To enable ingress, set the `ingress.enabled` parameter to "true".


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.

<br />

### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

</TabItem>




<TabItem label="2.5.x" value="2.5.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the [Spectro Proxy](frp.md) reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| `k8s-dashboard.namespace` | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| `k8s-dashboard.clusterRole` | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources.<br /><br />By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| `k8s-dashboard.certDuration` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| `k8s-dashboard.certRenewal` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| `k8s-dashboard.serviceType` | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommend using ClusterIP service type to restrict access to the cluster.|
| `k8s-dashboard.skipLogin` | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. We recommend using this only for demo purposes, as enabling it could expose a security risk.|
:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide. 

:::

## Usage

To use the Kubernetes Dashboard pack, you have to add it to your cluster profile. Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Kubernetes Dashboard
- **Pack Version**: 2.0.x or higher

The Kubernetes Dashboard pack requires the [Spectro Proxy](frp.md) pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

<br />

### Access Kubernetes Dashboard

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes Dashboard on port 8080. 

<br />

```bash
kubectl port-forward -namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />

```bash
kubectl -namespace kubernetes-dashboard describe secret $(kubectl -namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
  
The following example shows the command output with the token value.

<br />

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

<br />

### Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

<br />

1. Ensure the `service.type` parameter is set to "ClusterIP".


2. To enable ingress, set the `ingress.enabled` parameter to "true".


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.

<br />

### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.


</TabItem>





<TabItem label="2.4.x" value="2.4.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the [Spectro Proxy](frp.md) reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| `k8s-dashboard.namespace` | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| `k8s-dashboard.clusterRole` | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources.<br /><br />By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| `k8s-dashboard.certDuration` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| `k8s-dashboard.certRenewal` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| `k8s-dashboard.serviceType` | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommend using ClusterIP service type to restrict access to the cluster.|
| `k8s-dashboard.skipLogin` | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. We recommend using this only for demo purposes, as enabling it could expose a security risk.|

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide. 

:::


## Usage

To use the Kubernetes Dashboard pack, you have to add it to your cluster profile. Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Kubernetes Dashboard
- **Pack Version**: 2.0.x or higher

The Kubernetes Dashboard pack requires the [Spectro Proxy](frp.md) pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

<br />

### Access Kubernetes Dashboard

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes Dashboard on port 80. 

<br />

```bash
kubectl port-forward -namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />

```bash
kubectl -namespace kubernetes-dashboard describe secret $(kubectl -namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
  
The following example shows the command output with the token value.

<br />

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

<br />

### Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

<br />

1. Ensure the `service.type` parameter is set to "ClusterIP".


2. To enable ingress, set the `ingress.enabled` parameter to "true".


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.

<br />

### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

</TabItem>




<TabItem label="2.1.x" value="2.1.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the [Spectro Proxy](frp.md) reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| `k8s-dashboard.namespace` | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| `k8s-dashboard.clusterRole` | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources.<br /><br />By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| `k8s-dashboard.certDuration` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| `k8s-dashboard.certRenewal` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| `k8s-dashboard.serviceType` | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommend using ClusterIP service type to restrict access to the cluster.|
| `k8s-dashboard.skipLogin` | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. We recommend using this only for demo purposes, as enabling it could expose a security risk.|

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide. 

:::

## Usage

To use the Kubernetes Dashboard pack, you have to add it to your cluster profile. Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Kubernetes Dashboard
- **Pack Version**: 2.0.x or higher

The Kubernetes Dashboard pack requires the [Spectro Proxy](frp.md) pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

<br />

### Access Kubernetes Dashboard

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes Dashboard on port 80. 

<br />

```bash
kubectl port-forward -namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />

```bash
kubectl -namespace kubernetes-dashboard describe secret $(kubectl -namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
  
The following example shows the command output with the token value.

<br />

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

<br />

### Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

<br />

1. Ensure the `service.type` parameter is set to "ClusterIP".


2. To enable ingress, set the `ingress.enabled` parameter to "true".


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.

<br />

### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.


</TabItem>




<TabItem label="2.0.x" value="02.0.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the [Spectro Proxy](frp.md) reverse proxy.


- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| `k8s-dashboard.namespace` | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| `k8s-dashboard.clusterRole` | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources.<br /><br />By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| `k8s-dashboard.certDuration` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| `k8s-dashboard.certRenewal` | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| `k8s-dashboard.serviceType` | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommend using ClusterIP service type to restrict access to the cluster.|
| `k8s-dashboard.skipLogin` | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. We recommend using this only for demo purposes, as enabling it could expose a security risk.|

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide. 

:::

## Usage

To use the Kubernetes Dashboard pack, you have to add it to your cluster profile. Use the following information to find the Kubernetes Dashboard pack.
- **Pack Type**: Monitoring
- **Registry**: Public Repo
- **Pack Name**: Kubernetes Dashboard
- **Pack Version**: 2.0.x or higher

The Kubernetes Dashboard pack requires the [Spectro Proxy](frp.md) pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

<br />

### Access Kubernetes Dashboard

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes Dashboard on port 80. 

<br />

```bash
kubectl port-forward -namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />

```bash
kubectl -namespace kubernetes-dashboard describe secret $(kubectl -namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
  
The following example shows the command output with the token value.

<br />

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

<br />

### Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

<br />

1. Ensure the `service.type` parameter is set to "ClusterIP".


2. To enable ingress, set the `ingress.enabled` parameter to "true".


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.

<br />

### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

</TabItem>

</Tabs>

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| k8s-dashboard.namespace | | kubernetes-dashboard | The namespace where you want to run the Kubernetes dashboard deployment |
| k8s-dashboard.clusterRole | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources. |
| | | | By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| k8s-dashboard.certDuration | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| k8s-dashboard.certRenewal | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| k8s-dashboard.serviceType | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. We recommended to use ClusterIP service type to restrict access to the cluster.|
| k8s-dashboard.skipLogin | True, False | False | Flag to skip authentications in the Dashboard UI. Enabling this might expose a security risk. Use this only for demo purposes. |

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the Spectro Kubernetes Dashboard integrated pack. 

:::


## Accessing the dashboard

* **ClusterIP Service Type**

When connected to the cluster remotely, run the following command to establish a connection to dashboard deployment on port 8080:

You can reference the Kubernetes Dashboard pack in Terraform with a data resource.

<br />

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "spectro-proxy" {
  name    = "k8s-dashboard"
  version = "2.7.0"
  type = "monitoring"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```

The following example shows the command output with the token value.

```yaml
Name:         kubernetes-dashboard-token-h4lnf
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: kubernetes-dashboard
              kubernetes.io/service-account.uid: 00e729f1-6638-4e68-8df5-afa2e2e38095

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1029 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1bTg3RWM4Y1c3NnhkQ3dXbXNDUXQydVpYQklRUWoxa1BaS0ctVkVTSDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC10b2tlbi1oNGxuZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjAwZTcyOWYxLTY2MzgtNGU2OC04ZGY1LWFmYTJlMmUzODA5NSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDprdWJlcm5ldGVzLWRhc2hib2FyZCJ9.JU4GOJNjGpkHabUyxBt_2rvtXNjpR3w238BF2oMCQUNf_ZkUGSMeAAgIKxbAuk62dtJNDaRh5yAZ9J5KthMcU6k4qVmodUOJdlvigBVNjTDEhPM-sqJus62HMtwjpvm0CX-aP_A_BqHs2yJ3OgXSX0uHmkUO1FMoZSVaRpOvx7f5bPswxd87L3npuZt4p-NJIX32-DGjBnxdANAHcWil3YHIUbDgQIdjDfN6stGU_JByvzfCJpNCWWDinr772W7iZ3uA28F8uGS0ZMd1E5e1moEFBY8BM015Qxg2Y_k7lmv9S8GMkBJyTiJNiqnwLwfsiE1ycE4Tgq_vuQfFToIMNw
```

* **LoadBalancer Service Type**

Use the LoadBalancer service IP and port to connect to the Dashboard.

# Ingress

The following steps guide you to configure ingress in the Kubernetes Dashboard pack.

1. Ensure the `serviceType` parameter is set to "ClusterIP".
2. To enable ingress, set the `enabled` parameter to "true".
3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the Ingress Controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use. 

## Troubleshooting

* If the Dashboard is not accessible, check the dashboard pod for errors and ensure the Dashboard service is in the "Running" state.
* When the namespace is customized while deploying the Dashboard, replace the namespace values in the commands shown above.

## References

- [Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

- [Open Source Kubernetes Dashboard Documentation](https://github.com/kubernetes/dashboard/tree/master/docs)
