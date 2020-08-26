---
title: 'Kong'
metaTitle: 'Kong'
metaDescription: 'Kong Ingress pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['ingress']
logoUrl: 'https://registry.spectrocloud.com/v1/kong/blobs/sha256:600f20583f85ccad4c515e51542f74aa9acb851d5b03ecb0e7b3435eb51ecf56?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Kong Ingress Controller

Kong integration is an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

## Components

The integration will add Kong Ingress Controller which will expose a service of type LoadBalancer

## References

https://github.com/Kong/kubernetes-ingress-controller
