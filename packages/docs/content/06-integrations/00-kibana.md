---
title: 'Kibana'
metaTitle: 'Elasticsearch-Fluentd-Kibana'
metaDescription: 'Kibana Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['logging']
logoUrl: 'https://registry.spectrocloud.com/v1/elastic-fluentd-kibana/blobs/sha256:3b6d6486eb216d46164fc8b7cb784b0be6b851a85726f18bdf4450d5ed1386eb?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Elasticsearch-Fluentd-Kibana

The logging integration installs a production-grade ElasticSearch cluster with Kibana and Fluentd by default on the Kubernetes cluster. This integration provides a rich set of logging features like forwarding,  aggregating & parsing logs from the Kubernetes cluster.

## Contents

The default integration deployed will have the following components:

* ElasticSearch Master (3 replicas).
* ElasticSearch Data (2 replicas).
* ElasticSearch Client (2 replicas).
* ElasticSearch Curator.
* Fluentd (one per node).
* Kibana.

# Ingress

Follow below steps to configure Ingress on Kibana

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #643)
2. Ingress (line #670)
   * Enable Ingress; change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts, etc.

With these config changes, you can access Kibana service on the Ingress Controller LoadBalancer hostname / IP

## References

https://github.com/helm/charts/tree/master/stable/elasticsearch
https://github.com/helm/charts/tree/master/stable/fluentd 
https://github.com/helm/charts/tree/master/stable/kibana
