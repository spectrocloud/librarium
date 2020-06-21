---
title: 'Nginx'
metaTitle: 'Nginx'
metaDescription: 'Nginx Ingress pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['ingress']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/master/stable/addon/ingress/nginx_0.26.1/logo.png?token=APOFE6VPSO6KG2ZITSBIFFK67CVHC'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Nginx

Ingress resource(s) in Kubernetes helps provide Service(s) externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name based virtual hosting. NGINX integration is an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

## Components

Integration creates the following components:
* Ingress Controller.
* Default Backend.

## Troubleshooting

For basic troubleshooting, refer the below troubleshooting guide:
https://github.com/kubernetes/ingress-nginx/blob/master/docs/troubleshooting.md

## References
https://www.nginx.com/products/nginx/kubernetes-ingress-controller/
