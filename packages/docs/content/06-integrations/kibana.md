---
title: 'Kibana'
metaTitle: 'Elasticsearch-Fluentd-Kibana'
metaDescription: 'Kibana Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['monitoring']
logoUrl: 'https://www.unixmen.com/wp-content/uploads/2015/08/elasticsearch-kibana-logo.jpg'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

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
