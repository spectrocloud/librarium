---
title: "Kubernetes Dashboard"
metaTitle: "Kubernetes Dashboard"
metaDescription: "Learn how to manage Kubernetes clusters and applications deployed in them by using the Kubernetes Dashboard Monitoring pack."
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

The [Kubernetes Dashboard](https://github.com/kubernetes/dashboard) add-on pack is a general-purpose, web-based UI that allows you to manage clusters and the applications deployed in them. 


## Versions Supported

<Tabs>

<Tabs.TabPane tab="2.7.x" key="2.7.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.

- Users or groups must be mapped to a Kubernetes RBAC role, either a Role or a ClusterRole. You can create a custom role through a manifest and use Palette's roleBinding feature to associate the users or groups with the role. Refer to the Create a Role Binding guide to learn more.

## Parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| k8s-dashboard.namespace | | kubernetes-dashboard | The namespace where you want to run the Kubernetes Dashboard deployment |
| k8s-dashboard.clusterRole | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources. |
| | | | By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| k8s-dashboard.certDuration | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| k8s-dashboard.certRenewal | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| k8s-dashboard.serviceType | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. <WarningBox>It is highly recommended to use ClusterIP service type to restrict access to the cluster</WarningBox> |
| k8s-dashboard.skipLogin | True, False | False | A flag to skip authentications in the Kubernetes Dashboard UI. <WarningBox> Enabling this might expose a security risk. Use this only for demo purposes.</WarningBox> |

<WarningBox>

Starting with Kubernetes Dashboard version 2.7.0, the **Connect** button is no longer available. For an optimized experience, we recommend you use the Spectro Kubernetes Dashboard integrated pack. 

</WarningBox>

## Usage

The Kubernetes Dashboard pack requires the Spectro Proxy pack, which serves as a reverse proxy to expose the Kubernetes dashboard. You must configure the [Spectro Proxy](/integrations/frp) pack.

A pre-configured version of the Kubernetes Dashboard pack is available, called Spectro Kubernetes Dashboard. To learn more about it and start using it, check out the [Spectro Kubernetes Dashboard](/integrations/spectro-k8s-dashboard) guide.

<br />

### Access Kubernetes Dashboard
  
When connected to the cluster remotely, run the following command to establish a connection to deploy the Kubernetes Dashboard on port 8080:

<br />
  
```bash
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8080:443
```
To access Kubernetes Dashboard, navigate to `https://localhost:8080` in a browser of your choice.
  
From the Kubernetes Dashboard login page, run the following command from the terminal window to obtain the bearer token:

<br />
  
```bash
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
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

1. Ensure the `service.type` parameter is set to `ClusterIP`.


2. To enable ingress, set the `ingress.enabled` parameter to `true`.


3. Set ingress rules, such as annotations, path, hosts, and any other rules.

This allows you to access the Kubernetes Dashboard in hostname or IP format using the IP address that the Ingress Controller exposes. 

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn more about which hostname to use.


### Configure LoadBalancer

Use the `service.loadBalancerIP` and `service.externalPort` parameters to connect to the Kubernetes Dashboard.

</Tabs.TabPane>

<Tabs.TabPane tab="2.6.x" key="2.6.x">

2.6.x text here

</Tabs.TabPane>

<Tabs.TabPane tab="2.5.x" key="2.5.x">

2.5.1**

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





# Troubleshooting

* If the Kubernetes Dashboard is not accessible, check the Dashboard pod for errors and ensure the Dashboard service is in the **Running** state.


* When the namespace is customized while deploying the Kubernetes Dashboard, replace the namespace values in the commands shown above.


# References

- [Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)


- [Open Source Kubernetes Dashboard Documentation](https://github.com/kubernetes/dashboard/tree/master/docs)
