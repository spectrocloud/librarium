---
sidebar_label: "Kubernetes Dashboard"
title: "Kubernetes Dashboard"
description:
  "Learn how to manage Kubernetes clusters and applications deployed in them by using the Kubernetes Dashboard
  Monitoring pack."
type: "integration"
hide_table_of_contents: true
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image.webp"
tags: ["packs", "kubernetes-dashboard", "monitoring"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="2.7.x" value="2.7.x">

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized
experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack.
To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide.

:::

## Access Kubernetes Dashboard

<!-- prettier-ignore-start -->
The Kubernetes Dashboard pack requires the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy"/> pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

When connected to the cluster remotely, issue the following command to establish a connection to deploy the Kubernetes
Dashboard on port 8080.
<!-- prettier-ignore-end -->

```bash
kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl --namespace kubernetes-dashboard describe secret  \
$(kubectl --namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Ensure the `service.type` parameter is set to "ClusterIP".

2. To enable ingress, set the `ingress.enabled` parameter to "true".

3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>

<TabItem label="2.6.x" value="2.6.x">

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized
experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack.
To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide.

:::

## Access Kubernetes Dashboard

<!-- prettier-ignore-start -->
The Kubernetes Dashboard pack requires the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy"/> pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

When connected to the cluster remotely, issue the following command to establish a connection to deploy the Kubernetes
Dashboard on port 8080.
<!-- prettier-ignore-end -->

```bash
kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl --namespace kubernetes-dashboard describe secret $(kubectl --namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Ensure the `service.type` parameter is set to "ClusterIP".

2. To enable ingress, set the `ingress.enabled` parameter to "true".

3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>

<TabItem label="2.5.x" value="2.5.x">

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized
experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack.
To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide.

:::

## Access Kubernetes Dashboard

<!-- prettier-ignore-start -->
The Kubernetes Dashboard pack requires the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy"/> pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

When connected to the cluster remotely, issue the following command to establish a connection to deploy the Kubernetes
Dashboard on port 8080.
<!-- prettier-ignore-end -->

```bash
kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl --namespace kubernetes-dashboard describe secret $(kubectl --namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Ensure the `service.type` parameter is set to "ClusterIP".

2. To enable ingress, set the `ingress.enabled` parameter to "true".

3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>

<TabItem label="2.4.x" value="2.4.x">

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized
experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack.
To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide.

:::

## Access Kubernetes Dashboard

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes
Dashboard on port 80.

```bash
kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl --namespace kubernetes-dashboard describe secret $(kubectl --namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Ensure the `service.type` parameter is set to "ClusterIP".

2. To enable ingress, set the `ingress.enabled` parameter to "true".

3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>

<TabItem label="2.1.x" value="2.1.x">

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized
experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack.
To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide.

:::

## Access Kubernetes Dashboard

<!-- prettier-ignore-start -->
The Kubernetes Dashboard pack requires the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy"/> pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes
Dashboard on port 80.
<!-- prettier-ignore-end -->

```bash
kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl --namespace kubernetes-dashboard describe secret $(kubectl --namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Ensure the `service.type` parameter is set to "ClusterIP".

2. To enable ingress, set the `ingress.enabled` parameter to "true".

3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>

<TabItem label="2.0.x" value="02.0.x">

:::warning

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized
experience, we recommend you use the pre-configured version of this dashboard, called Spectro Kubernetes Dashboard pack.
To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](spectro-k8s-dashboard.md) guide.

:::

## Access Kubernetes Dashboard

<!-- prettier-ignore-start -->
The Kubernetes Dashboard pack requires the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy"/> pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the Spectro Proxy pack.

When connected to the cluster remotely, run the following command to establish a connection to to deploy the Kubernetes
Dashboard on port 80.
<!-- prettier-ignore-end -->

```bash
kubectl port-forward --namespace kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.

From the Dashboard login page, run the following command from the terminal window to obtain the bearer token:

```bash
kubectl --namespace kubernetes-dashboard describe secret $(kubectl --namespace kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

## Configure Ingress

Use the following steps to configure ingress for the Kubernetes Dashboard pack.

1. Ensure the `service.type` parameter is set to "ClusterIP".

2. To enable ingress, set the `ingress.enabled` parameter to "true".

3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the ingress
controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

## Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

## Troubleshooting

### Scenario - Kubernetes Dashboard not Accessible

If the Kubernetes Dashboard is not accessible, check the dashboard pod for errors and ensure the dashboard service is in
the **Running** state.

</TabItem>

</Tabs>

## Terraform

You can reference the Kubernetes Dashboard pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "k8s-dashboard" {
  name    = "k8s-dashboard"
  version = "2.7.0"
  type = "monitoring"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
