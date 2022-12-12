---
title: 'Reverse Proxy Dashboard'
metaTitle: 'Kubernetes Dashboard with Spectro Proxy'
metaDescription: 'Kubernetes Dashboard with Spectro Proxy'
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';





# Overview

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general-purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them and manage the cluster itself. 

Spectro Proxy is a fast and straightforward reverse proxy that lets you forward a port of your local server behind a NAT or firewall to a public server. The proxy server pack is available as an add on pack for authentication. Users can attach this layer to the cluster profile while profile creation. This installs the FRP client in the workload clusters and configures it with a FRP server. Spectro Cloud provides hosts FRP server and by default the pack is configrued to connect to this server. Spectro Cloud detects the presence of this pack in the cluster and automatically updates the Kubeconfig file to use the FRP server as the endpoint. 
This section talks about how we can configure the Kubernetes Dashboard exposed to external traffic using Spectro Proxy pack, with RBAC authentication enabled.

# Prerequisite

* [Kubernetes Dashboard Pack](/integrations/kubernetes-dashboard) to be part of the Cluster Profile.

* To expose the dashboard, use [Spectro-Proxy Pack (1.1.0)](/integrations/frp). If the Kubernetes Dashboard is not using a load balancer. Make the following changes to the Spectro-Proxy pack.
 
<br />

```

/ We enabled the k8sDashboard by making the enabled flag at line 4 to true.
k8sDashboardIntegration:
      enabled: true
      useInsecurePort: false

```
<br />

* OIDC authentication enabled for the cluster.


# Quick Workflow:


1. [Create a cluster profile](/cluster-profiles) with required Infrastructure layers and Add-on layers per use case, in addition to the Kubernetes Dashboard Pack and Spectro-Proxy packs to the cluster profile as briefed in the Prerequisites.


2. [Enable OIDC authentication](/knowledgebase/how-to/reverse-proxy-dashboard#enableoidcauthentication) to the Kubernetes pack.


3. [Launch a new cluster](/clusters) using the cluster profile.


4. Configure the Role Binding for the user. The two options available for Role Binding are:
    * [Cluster Role Binding](/clusters/cluster-management/cluster-rbac)
    * [Workspace Role Binding](/workspace/workload-features#configureclusterrolebindings)


5. Now, from the cluster overview page of Palette UI, click [connect](/clusters/cluster-management/palette-webctl#overview) to redirect to the IDP for authentication or dashboard if already authorized.
 

6. The Palette Kubernetes Dashboard with Spectro-Proxy is ready for monitoring.

# Enable OIDC Authentication

To enable OIDC authentication, make the following configuration to Kubernetes Pack:


## Sample scenario

<br />

### OIDC Related Configuration to Kubernetes Pack

```
## OIDC related config
  oidcIdentityProvider:
    identityProviderConfigName: 'Spectro-docs'     # The name of the OIDC provider configuration
    issuerUrl: 'issuer-url'       # The URL of the OpenID identity provider
    clientId: 'user-client-id-from-Palette'           # The ID for the client application that makes authentication requests to the OpenID identity provider
    usernameClaim: "email"                     # The JSON Web Token (JWT) claim to use as the username
    usernamePrefix: "-"                        # The prefix that is prepended to username claims to prevent clashes with existing names
    groupsClaim: "groups"                      # The JWT claim that the provider uses to return your groups
    groupsPrefix: ""                          # The prefix that is prepended to group claims to prevent clashes with existing names
    requiredClaims:                            # The key value pairs that describe required claims in the identity token
```
<br />

### Client Configuration to Add OIDC Based Authentication in kubeconfig

```
## Client configuration to add OIDC based authentication flags in kubeconfig
clientConfig:
  oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
  oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
  oidc-client-secret: client-secret-value
  oidc-extra-scope: profile,email
```





