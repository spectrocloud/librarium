---
title: 'Prometheus Operator'
metaTitle: 'Prometheus Operator'
metaDescription: 'Prometheus Operator Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['monitoring']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/18a24087bb3470c1a0d47f29cea7e1a795be470f/stable/loggging_and_monitoring/prometheus-operator/logo.png?token=APOFE6VF6NFRQEZAT5N6KE267GG7E'
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

## References

https://github.com/coreos/prometheus-operator
