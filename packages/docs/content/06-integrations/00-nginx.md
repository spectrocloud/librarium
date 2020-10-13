---
title: 'Nginx'
metaTitle: 'Nginx'
metaDescription: 'Nginx Ingress pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['ingress']
logoUrl: 'https://registry.spectrocloud.com/v1/nginx/blobs/sha256:a36bf7e8023f018298ddbf0c82a49c38e872db4b0e480a39c285ae002916a83f?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Nginx

Ingress resource(s) in Kubernetes helps provide Service(s) externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name-based virtual hosting. NGINX integration is an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

## Components

Integration creates the following components:

* Ingress Controller.
* Default Backend.

## Default SSL certificate

NGINX Ingress controller provides an option to set a default SSL certificate to be used for requests that do not match any of the configured server names. The default certificate will also be used for ingress tls: sections that do not have a secretName option.
Below steps will come in handy to set the default certificate.
 
1. Create a secret with key and certificate 
    ```bash
    kubectl -n kube-system create secret tls ingress-tls --cert server.crt --key server.key
    ```
2. Edit Nginx ingress pack values to include extraArgs.default-ssl-certificate section which will reference the secret created above
    <pre>
    charts:
      nginx-ingress:
        fullnameOverride: "nginx-ingress"
        controller:
          ...
          ...
          extraArgs:
            default-ssl-certificate: "kube-system/ingress-tls"
    </pre>  


## Troubleshooting

For basic troubleshooting, refer the below troubleshooting guide:
https://github.com/kubernetes/ingress-nginx/blob/master/docs/troubleshooting.md

## References

https://www.nginx.com/products/nginx/kubernetes-ingress-controller/
