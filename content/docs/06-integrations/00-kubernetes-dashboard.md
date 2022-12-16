---
title: 'Kubernetes Dashboard'
metaTitle: 'Kubernetes Dashboard'
metaDescription: 'Kubernetes Dashboard Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Kubernetes Dashboard

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general-purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them and manage the cluster itself.

<br />

<InfoBox>

Palette supports provisioning a [reverse proxy dashboard](/knowledgebase/how-to/reverse-proxy-dashboard) that can expose the Kubernetes dashboard. Use the [Spectro Proxy](/integrations/frp)  pack to enable this capability.


</InfoBox>

## Versions Supported

<Tabs>

<Tabs.TabPane tab="2.6.x" key="2.6.x">

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

## Notable parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| k8s-dashboard.namespace | | kubernetes-dashboard | The namespace where you want to run the Kubernetes dashboard deployment |
| k8s-dashboard.clusterRole | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources. |
| | | | By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| k8s-dashboard.certDuration | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| k8s-dashboard.certRenewal | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| k8s-dashboard.serviceType | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. <WarningBox>It is highly recommended to use ClusterIP service type to restrict access to the cluster</WarningBox> |
| k8s-dashboard.skipLogin | True, False | False | Flag to skip authentications in the Dashboard UI. <WarningBox> Enabling this might expose a security risk. Use this only for demo purposes.</WarningBox> |

## Accessing the dashboard

* **ClusterIP service type**

When connected to the cluster remotely, run the following command to establish a connection to dashboard deployment on port 8080:

```bash
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

To access Kubernetes Dashboard, go to the below URL in a browser of your choice `https://localhost:8080`

From the Dashboard login page, run the below command from the Terminal window to get the bearer token:

```bash
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```

The output of the above command will look as below, where the token value is in the last line:

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

* **LoadBalancer service type**

Use the Load Balancer service IP & Port to connect to the Dashboard

# Ingress

Follow below steps to configure Ingress on Kubernetes Dashboard

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #17)
2. Ingress (line #23)
   * Enable Ingress: Change enabled from "false" to "true"
   * Set Ingress rules like annotations, path, hosts, etc.

With these configuration changes, you can access Kubernetes Dashboard service on the Ingress Controller LoadBalancer hostname / IP

## Troubleshooting

* If the Dashboard is not accessible, check the dashboard pod for errors and ensure the Dashboard service is in the 'Running' state.
* When the namespace is customized while deploying Dashboard replace the namespace values in the above commands.

## References

https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
https://github.com/kubernetes/dashboard/tree/master/docs
