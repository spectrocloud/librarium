---
title: 'Fluentbit'
metaTitle: 'Fluentbit'
metaDescription: 'Fluentbit Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['monitoring']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/master/stable/loggging_and_monitoring/fluent-bit/logo.png?token=APOFE6VUBVM4GKRFYCNMV4K7AR624'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Fluentbit

Fluent-Bit is a multi-platform log forwarder. The default integration will help forward logs from the Kubernetes cluster to an external ElasticSearch cluster

## Contents

Fluent-Bit is installed as a DaemonSet & so, an instance of fluent-bit will be running on all the nodes in the cluster.

## References

https://github.com/helm/charts/tree/master/stable/fluent-bit
