---
title: 'Kong'
metaTitle: 'Kong'
metaDescription: 'Kong Ingress pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['ingress']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/ccc4145d9e41965ae825a7caa4706cf046bf079c/stable/addon/ingress/kong_1.4/logo.png?token=APOFE6VTOYZSR5ZRHQXXWPC67GEXS'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Kong Ingress Controller

Kong integration is an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

## Components

Integration will add Kong Ingress Controller which will expose a service of type LoadBalancer

## References
https://github.com/Kong/kubernetes-ingress-controller
