---
title: 'Fluentbit'
metaTitle: 'Fluentbit'
metaDescription: 'Fluentbit Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['logging']
logoUrl: 'https://registry.spectrocloud.com/v1/fluentbit/blobs/sha256:012fbab20e3427b6c1f6a73d2ea0b4cc43cf60991774c4800ddf3e23c4b64544?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Fluentbit

Fluent-Bit is a multi-platform log forwarder. The default integration will help forward logs from the Kubernetes cluster to an external ElasticSearch cluster

## Contents

Fluent-Bit is installed as a DaemonSet & so, an instance of fluent-bit will be running on all the nodes in the cluster.

## References

https://github.com/helm/charts/tree/master/stable/fluent-bit
