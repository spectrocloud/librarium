---
title: 'Prometheus Operator'
metaTitle: 'Prometheus Operator'
metaDescription: 'Prometheus Operator Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['monitoring']
logoUrl: 'https://dyltqmyl993wv.cloudfront.net/assets/stacks/prometheus-operator/img/prometheus-operator-stack-110x117.png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

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
