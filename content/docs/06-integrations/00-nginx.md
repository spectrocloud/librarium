---
title: 'Nginx'
metaTitle: 'Nginx'
metaDescription: 'Nginx Ingress pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
category: ['ingress', 'amd64', 'arm64']
logoUrl: 'https://registry.spectrocloud.com/v1/nginx/blobs/sha256:a36bf7e8023f018298ddbf0c82a49c38e872db4b0e480a39c285ae002916a83f?type=image/png'
---

import WarningBox from 'shared/components/WarningBox';
import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Nginx

Ingress resource(s) in Kubernetes helps provide Service(s) externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name-based virtual hosting. NGINX integration is an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.4.x" key="1.4.x">

* **1.4.0**

</Tabs.TabPane>

<Tabs.TabPane tab="1.3.x" key="1.3.x">

* **1.3.0**

</Tabs.TabPane>


<Tabs.TabPane tab="1.2.x" key="1.2.x">

* **1.2.5**

  <br />

  **1.2.4**

    <br />

  **1.2.3**

  <br />

  **1.2.1** (deprecated)

  <br />

  **1.2.0** (deprecated)

</Tabs.TabPane>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

* **1.0.4**

</Tabs.TabPane>

<Tabs.TabPane tab="0.26.x" key="0.26.x">

* **0.26.1**

</Tabs.TabPane>

<Tabs.TabPane tab="0.43.x" key="0.43.x">

  * **0.43.0**

</Tabs.TabPane>

</Tabs>


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
    ```bash
    charts:
      nginx-ingress:
        fullnameOverride: "nginx-ingress"
        controller:
          ...
          ...
          extraArgs:
            default-ssl-certificate: "kube-system/ingress-tls"
    ```

## Troubleshooting

For basic troubleshooting, refer the below troubleshooting guide:
https://github.com/kubernetes/ingress-nginx/blob/master/docs/troubleshooting.md

## References

- [Nginx Ingress Controller](https://www.nginx.com/products/nginx-ingress-controller/)
