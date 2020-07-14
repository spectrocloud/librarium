---
title: 'Dex'
metaTitle: 'Dex'
metaDescription: 'Dex Authentication pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['authentication']
logoUrl: 'https://registry.spectrocloud.com/v1/dex/blobs/sha256:78e381fe12509ed94c7c19cd6f6fc4e896ec66485364644dc1a40229fcf9d90d?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Dex

Dex is an identity service to drive authentication for Kubernetes API Server through the [OpenID Connect](https://openid.net/connect/) plugin. Clients such as kubectl can act on behalf users who can login to the cluster through any identity provider dex supports.

## Components

Dex integration in Spectro Cloud will deploy the following components:

* Dex.
* Dex Client (dex-k8s-authenticator).

The integration will create self-signed certificates, will cross-configure Dex, Dex Client components & will set appropriate flags on the Kubernetes API Server.

# Ingress

Follow below steps to configure Ingress on Dex

1. Change Dex serviceType from "LoadBalancer" to "ClusterIP" (line #112)
2. Ingress (line #118)
   * Enable Ingress ; Change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts etc.

Follow below steps to configure Ingress on Dex Client

1. Change dex-k8s-authenticator serviceType from "LoadBalancer" to "ClusterIP" (line #312)
2. Ingress (line #320)
   * Enable Ingress ; Change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts etc.

With these config changes, you can access Dex, Dex Client service(s) on the Ingress Controller LoadBalancer hostname / IP


## References

https://github.com/dexidp/dex
https://github.com/dexidp/dex/blob/master/Documentation/kubernetes.md 
https://github.com/mintel/dex-k8s-authenticator
