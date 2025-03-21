---
sidebar_label: "Istio"
title: "Istio"
description: "Choosing Istio as a Service Mesh app within the Spectro Cloud console"
hide_table_of_contents: true
type: "integration"
category: ["service mesh", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/istio/blobs/sha256:c80cf596d4859261ab892e987f835bd11161bd139dd8e4147b652c6b93924cb2?type=image.webp"
tags: ["packs", "istio", "network"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.14.x" value="1.14.x">

## Pack Components

The integration deploys the Istio Operator with the 'demo' profile which deploys the following components:

- Istiod
- Istio Ingress Gateway
- Istio Egress Gateway
- Grafana
- Prometheus
- Istio Tracing
- Kiali

</TabItem>

<TabItem label="1.6.x" value="1.6.x">

## Pack Components

The integration deploys the Istio Operator with the 'demo' profile which deploys the following components:

- Istiod
- Istio Ingress Gateway
- Istio Egress Gateway
- Grafana
- Prometheus
- Istio Tracing
- Kiali

</TabItem>

</Tabs>

## Terraform

You can reference the Istio pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "istio" {
  name    = "istio"
  version = "1.20.1"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
