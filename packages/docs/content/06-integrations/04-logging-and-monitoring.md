---
title: "Logging and Monitoring Packs"
metaTitle: "Logging and Monitoring Packs"
metaDescription: "Creating Logging and Monitoring Packs in Spectro Cloud"
icon: ""
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Available packs

[Elasticsearch-Fluentd-Kibana](/integrations/logging-and-monitoring#elasticsearch-fluentd-kibana)
[Fluent-Bit](/integrations/logging-and-monitoring#fluentbit)
[Kubernetes Dashboard](/integrations/logging-and-monitoring#kubernetesdashboard)
[Kubevious](/integrations/logging-and-monitoring#kubevious)
[Prometheus Operator](/integrations/logging-and-monitoring#prometheusoperator)

# Elasticsearch-Fluentd-Kibana

The logging integration installs a production grade ElasticSearch cluster with Kibana and Fluentd by default on the Kubernetes cluster. This integration provides a rich set of logging features like forwarding,  aggregating & parsing logs from the Kubernetes cluster.

## Contents

The default integration deployed will have the following components:
* ElasticSearch Master (3 replicas)
* ElasticSearch Data (2 replicas)
* ElasticSearch Client (2 replicas)
* ElasticSearch Curator
* Fluentd (one per node)
* Kibana

## References

https://github.com/helm/charts/tree/master/stable/elasticsearch
https://github.com/helm/charts/tree/master/stable/fluentd 
https://github.com/helm/charts/tree/master/stable/kibana

# Fluentbit

Fluent-Bit is a multi-platform log forwarder. The default integration will help forward logs from the Kubernetes cluster to an external ElasticSearch cluster

## Contents

Fluent-Bit is installed as a DaemonSet & so, an instance of fluent-bit will be running on all the nodes in the cluster.

## References

https://github.com/helm/charts/tree/master/stable/fluent-bit

# Kubernetes Dashboard

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them, as well as manage the cluster itself.

## Notable parameters

| Name | Supported Values | Default Values | Description |
| --- | --- | --- | --- |
| k8s-dashboard.namespace | | kubernetes-dashboard | The namespace where you want to run kubernetes dashboard deployment |
| k8s-dashboard.clusterRole | Any valid clusterRole from the Kubernetes cluster | `k8s-dashboard-readonly` | The ClusterRole to be attached to the ServiceAccount which  defines RBAC to the cluster resources. |
| | | | By default, a ClusterRole (k8s-dashboard-readonly) with ReadOnly access to most of the resources is deployed. |
| k8s-dashboard.certDuration | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `8760h` (365 days) | Validity for the Self-signed certificate, specified in hours. |
| k8s-dashboard.certRenewal | A Go time.Duration string format in s (seconds), m (minutes), and h (hour) suffixes | `720h` (30 days) | Certificate renew before expiration duration |
| k8s-dashboard.serviceType | ClusterIP, LoadBalancer | ClusterIP | The ServiceType for dashboard. <WarningBox>It is highly recommended to use ClusterIP service type to restrict access to the cluster</WarningBox> |
| k8s-dashboard.skipLogin | True, False | False | Flag to skip authentications in the Dashboard UI. <WarningBox> Enabling this might expose security risk. Use this only for demo purposes.</WarningBox> |

## Accessing the dashboard

* **ClusterIP service type**
When connected to the cluster remotely, run the following command to establish a connection to dashboard deployment on port 8080
```
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8080:443
```
To access Kubernetes Dashboard, go to the below URL in a browser of your choice
```
https://localhost:8080
```
When you’re in the Dashboard login page, to get the bearer token, you can run the below command from Terminal window
```
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep kubernetes-dashboard-token | awk '{print $1}')
```
The output of the above command will look like this, where the token value is in the last line
```
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

Use the LB service IP & port to connect to the dashboard

## Troubleshooting

* If the Dashboard is not accessible, check the dashboard pod for any errors and ensure the Dashboard service is in the Running state
* When the namespace is customized while deploying Dashboard, make sure to replace the namespace values in the above commands

## References

https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
https://github.com/kubernetes/dashboard/tree/master/docs

# Kubevious

Kubevious integration provides a graphical interface which renders easy to understand, application centric Kubernetes configurations.

## Components

This integration deploys the following components
* Deployment
* MySql DB
* UI
* Parser

## References

https://github.com/kubevious/kubevious

# Prometheus Operator

The Prometheus Operator uses Kubernetes [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to simplify the deployment and configuration of Prometheus, Alertmanager, and related monitoring components. The default installation is intended to suit monitoring a kubernetes cluster the chart is deployed onto.

## Contents

A Default integration will install the following components:
* [prometheus-operator](https://github.com/coreos/prometheus-operator)
* [prometheus](https://prometheus.io/)
* [alertmanager](https://prometheus.io/)    
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* service monitors to scrape internal kubernetes components
    * kube-apiserver
    * kube-scheduler
    * kube-controller-manager
    * etcd
    * kube-dns/coredns
    * kube-proxy

This integration also includes dashboards and alerts.

## References

https://github.com/coreos/prometheus-operator
