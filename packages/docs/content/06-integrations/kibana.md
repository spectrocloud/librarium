---
title: 'Kibana'
metaTitle: 'Elasticsearch-Fluentd-Kibana'
metaDescription: 'Kibana Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['monitoring']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/master/stable/loggging_and_monitoring/elastic-fluentd-kibana-6.7.0/logo.png?token=APOFE6URVNHZHTVKIW2F7BS7AR652'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Elasticsearch-Fluentd-Kibana

The logging integration installs a production grade ElasticSearch cluster with Kibana and Fluentd by default on the Kubernetes cluster. This integration provides a rich set of logging features like forwarding,  aggregating & parsing logs from the Kubernetes cluster.

## Contents

The default integration deployed will have the following components:

* ElasticSearch Master (3 replicas).
* ElasticSearch Data (2 replicas).
* ElasticSearch Client (2 replicas).
* ElasticSearch Curator.
* Fluentd (one per node).
* Kibana.

## References

https://github.com/helm/charts/tree/master/stable/elasticsearch
https://github.com/helm/charts/tree/master/stable/fluentd 
https://github.com/helm/charts/tree/master/stable/kibana
