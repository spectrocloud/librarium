---
title: 'Kubevious'
metaTitle: 'Kubevious'
metaDescription: 'Kubevious Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/kubevious/blobs/sha256:5e33d7b51b1317a834b4552d96fc1cc8463000a7eedbcb4b784ea07236f3d7f7?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Kubevious

Kubevious integration provides a graphical interface which renders easy to understand, application centric Kubernetes configurations.

## Components

This integration deploys the following components:

* Deployment.
* MySql DB.
* UI.
* Parser.

# Ingress

Follow below steps to configure Ingress on Kubevious

1. Change kubevious.ui.svcType from "LoadBalancer" to "ClusterIP" (line #60)
2. Ingress (line #118)
   * Enable Ingress ; Change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts etc.

With these config changes, you can access Kubevious service on the Ingress Controller LoadBalancer hostname / IP

## References

https://github.com/kubevious/kubevious
