---
title: 'Prometheus Operator'
metaTitle: 'Prometheus Operator'
metaDescription: 'Prometheus Operator Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/prometheus-operator/blobs/sha256:64589616d7f667e5f1d7e3c9a39e32c676e03518a318924e123738693e104ce0?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Prometheus Operator

The Prometheus Operator uses Kubernetes [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to simplify the deployment and configuration of Prometheus, Alertmanager, and related monitoring components. The default installation is intended to suit monitoring a Kubernetes cluster the chart is deployed onto.

## Contents

A Default integration will install the following components:
* [prometheus-operator](https://github.com/coreos/prometheus-operator).
* [prometheus](https://prometheus.io/).
* [alertmanager](https://prometheus.io/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter).
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics).
* [grafana](https://github.com/helm/charts/tree/master/stable/grafana).
* service monitors to scrape internal Kubernetes components:
    * kube-apiserver.
    * kube-scheduler.
    * kube-controller-manager.
    * etcd.
    * kube-dns/coredns.
    * kube-proxy.

This integration also includes dashboards and alerts.

# Ingress

Follow below steps to configure Ingress on Grafana

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #408)
2. Ingress (line #416)
   * Enable Ingress, change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts etc.

With these changes, you can access Grafana service on the Ingress Controller LoadBalancer hostname / IP

## References

https://github.com/coreos/prometheus-operator
