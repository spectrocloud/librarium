---
title: "Kubernetes Dashboard"
metaTitle: "Kubernetes Dashboard"
metaDescription: "Kubernetes Dashboard Monitoring pack in Spectro Cloud"
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['monitoring']
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Kubernetes Dashboard

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general-purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them and manage the cluster itself. 

The Kubernetes Dashboard pack you can use to access the dashboard requires the Spectro Proxy pack to expose the dashboard.
<br /> 

<InfoBox>

Palette supports provisioning a [reverse proxy dashboard](/clusters/cluster-management/reverse-proxy-dashboard) that can expose the Kubernetes dashboard. Use the [Spectro Proxy](/integrations/frp) pack to enable this capability. 

</InfoBox>

A user-friendly version of this pack is available, Spectro Kubernetes Dashboard, which requires minimal configurations when used with the default settings. To learn more, check out [Spectro Kubernetes Dashboard](/integrations/spectro-k8s-dashboard).

<br />



## Versions Supported

<Tabs>

<Tabs.TabPane tab="2.7.x" key="2.7.x">

* **2.7.0**

</Tabs.TabPane>

<Tabs.TabPane tab="2.6.x" key="2.6.x">

* **2.7.0**
* **2.6.1**
* **2.6.0**

</Tabs.TabPane>

<Tabs.TabPane tab="2.5.x" key="2.5.x">

* **2.5.1**

</Tabs.TabPane>

<Tabs.TabPane tab="2.4.x" key="2.4.x">

* **2.4.0**

</Tabs.TabPane>

<Tabs.TabPane tab="2.1.x" key="2.1.x">

* **2.1.0**

</Tabs.TabPane>

<Tabs.TabPane tab="2.0.x" key="02.0.x">

* **2.0.1**

</Tabs.TabPane>

</Tabs>

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| k8s-dashboard.namespace | | kubernetes-dashboard | The namespace where you want to run the Kubernetes dashboard deployment |
| k8s-dashboard.clusterRole | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources. |
| | | | By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| k8s-dashboard.certDuration | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| k8s-dashboard.certRenewal | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| k8s-dashboard.serviceType | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. <WarningBox>It is highly recommended to use ClusterIP service type to restrict access to the cluster</WarningBox> |
| k8s-dashboard.skipLogin | True, False | False | Flag to skip authentications in the Dashboard UI. <WarningBox> Enabling this might expose a security risk. Use this only for demo purposes.</WarningBox> |

<WarningBox>

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the Spectro Kubernetes Dashboard integrated pack. 

</WarningBox>


## Accessing the dashboard

* **ClusterIP Service Type**

When connected to the cluster remotely, run the following command to establish a connection to dashboard deployment on port 8080:

```bash
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8080:443
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
