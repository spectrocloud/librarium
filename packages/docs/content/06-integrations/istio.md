---
title: 'Istio'
metaTitle: 'Istio Service Mesh in Spectro Cloud'
metaDescription: 'Choosing Istio as a Service Mesh app within the Spectro Cloud console'
hiddenFromNav: true
isIntegration: true
category: ['service mesh']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/master/experimental/addon/service_mesh/istio-1.6.2/logo.png?token=APOFE6X6LCN55TPY3BMRTFK7AR6WI'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Istio Operator

This Integration aims to automate and simplify rollout of the various Istio components which helps with service mesh use cases.

## Contents

The integration deploys the Istio Operator with the 'demo' profile which deploys the following components:
* Istiod
* Istio Ingress Gateway
* Istio Egress Gateway
* Grafana
* Prometheus
* Istio Tracing
* Kiali

For more information on the profiles, view the [official document](https://istio.io/latest/docs/setup/additional-setup/config-profiles/).

## References

https://istio.io/<br />
https://github.com/istio/operator
