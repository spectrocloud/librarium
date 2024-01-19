---
sidebar_label: "Dex"
title: "Dex"
description: "Dex Authentication pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["authentication", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/dex/blobs/sha256:78e381fe12509ed94c7c19cd6f6fc4e896ec66485364644dc1a40229fcf9d90d?type=image/png"
tags: ["packs", "dex", "security"]
---

Dex is an identity service to drive authentication for Kubernetes API Server through the
[OpenID Connect](https://openid.net/connect/) plugin. Clients such as kubectl can act on behalf of users who can log in
to the cluster through any identity provider that dex supports.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="2.35.x" value="2.35.x">

- **2.35.1**

</TabItem>

<TabItem label="2.30.x" value="2.30.x">

- **2.30.0**

</TabItem>

<TabItem label="2.28.x" value="2.28.x">

- **2.28.0**

</TabItem>

<TabItem label="2.25.x" value="2.25.x">

- **2.25.0**

</TabItem>

<TabItem label="2.21.x" value="2.21.x">

- **2.21.0**

</TabItem>
</Tabs>

## Components

Dex integration in Spectro Cloud will deploy the following components:

- Dex.
- Dex Client (dex-k8s-authenticator).

The integration will create self-signed certificates, will cross-configure Dex, Dex Client components & will set
appropriate flags on the Kubernetes API Server.

## Ingress

Follow below steps to configure Ingress on Dex

1. Change Dex serviceType from "LoadBalancer" to "ClusterIP" (line #112)
2. Ingress (line #118)
   - Enable Ingress; Change enabled from false to "true"
   - Set Ingress rules like annotations, path, hosts, etc.

Follow below steps to configure Ingress on Dex Client

1. Change dex-k8s-authenticator serviceType from "LoadBalancer" to "ClusterIP" (line #312)
2. Ingress (line #320)
   - Enable Ingress; Change enabled from false to "true"
   - Set Ingress rules like annotations, path, hosts, etc.

With these config changes, you can access Dex, Dex Client service(s) on the Ingress Controller LoadBalancer hostname /
IP

## References

- [Dex](https://github.com/dexidp/dex)

- [Dex Documentation](https://dexidp.io/docs)

- [Dex K8s Authenticator](https://github.com/mintel/dex-k8s-authenticator)
