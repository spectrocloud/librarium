---
sidebar_label: 'Kong'
title: 'Kong'
description: 'Kong Ingress pack in Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['ingress', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/kong/blobs/sha256:600f20583f85ccad4c515e51542f74aa9acb851d5b03ecb0e7b3435eb51ecf56?type=image/png'
tags: ['packs', 'kong', 'network']
---

The Kong integration is an Ingress Controller for Kubernetes that configures ingress with a load balancer. You can use the Kong as an application load balancer for your application.

## Version Supported

<Tabs queryString="versions">

<TabItem label="2.13.x" value="2.13.x">

* **2.13.1**

</TabItem>

<TabItem label="1.4.x" value="1.4.x">

* **1.4.0**

</TabItem>

</Tabs>

## Components

The integration adds the Kong Ingress Controller, which exposes a Kubernetes service of type LoadBalancer.

## References

- [Kong Ingress Controller Documentation ](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) 


- [Kong GitHub](https://github.com/Kong/kubernetes-ingress-controller)
