---
sidebar_label: "Istio"
title: "Istio"
description: "Choosing Istio as a Service Mesh app within the Spectro Cloud console"
hide_table_of_contents: true
type: "integration"
category: ["service mesh", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/istio/blobs/sha256:c80cf596d4859261ab892e987f835bd11161bd139dd8e4147b652c6b93924cb2?type=image/png"
tags: ["packs", "istio", "network"]
---

This Integration aims to automate and simplify the rollout of the various Istio components which helps with service mesh use cases.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.14.x" value="1.14.x">

- **1.14.3**
- **1.14.1**

</TabItem>

<TabItem label="1.6.x" value="1.6.x">

- **1.6.2**

</TabItem>

</Tabs>

## Contents

The integration deploys the Istio Operator with the 'demo' profile which deploys the following components:

- Istiod
- Istio Ingress Gateway
- Istio Egress Gateway
- Grafana
- Prometheus
- Istio Tracing
- Kiali

## References

- [Istio Home](https://istio.io)

- [Istio Documentation](https://istio.io/latest/docs)

- [Istio Operator GitHub](https://github.com/istio/operator)
