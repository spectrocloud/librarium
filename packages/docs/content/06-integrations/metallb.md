---
title: 'MetalLB'
metaTitle: 'MetalLB'
metaDescription: 'MetalLB Load Balancer pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['load balancers']
logoUrl: 'https://v0-2-0--metallb.netlify.app/images/logo.png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# MetalLB

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters, using standard routing protocols. This integration is recommended for on-prem cloud(s) and will help external service(s) get IP address, when service type is set as LoadBalancer.

## Components

* MetalLB controller
* Speaker (runs on all nodes, deployed as DaemonSet)

## References

https://metallb.universe.tf/
https://github.com/metallb/metallb
