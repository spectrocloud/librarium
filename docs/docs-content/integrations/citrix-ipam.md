---
sidebar_label: "Citrix IPAM"
title: "Citrix IPAM"
description: "Citrix IPAM Load Balancer pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["load balancers", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/lb-citrix-adc/blobs/sha256:17f8ebc0dc69d329a39e5d27fc0ce3574034d18ab1776fabda396c5403b0bd86?type=image/png"
tags: ["packs", "citrix-ipam", "network"]
---

# Citrix IPAM and Ingress controller

The integration helps with IP address management and provides load balancing capabilities for external services deployed on Kubernetes, especially for on-premise deployments.

## Versions Supported

<Tabs queryString="versions">
<TabItem label="1.7.x" value="1.7.x">

- **1.7.6**

</TabItem>
</Tabs>

## Components

Integration deploys the following components:

- IPAM controller.
- Ingress controller.

## Parameters

| Name                                        | Default Value | Description                                                                  |
| ------------------------------------------- | ------------- | ---------------------------------------------------------------------------- |
| vip.addresses                               |               | The IP address range to be used for external Services                        |
| vip.namespace                               | citrix-system | The namespace for IPAM controller                                            |
| citrix-k8s-ingress-controller.namespace     | citrix-system | The namespace for Citrix Ingress controller                                  |
| citrix-k8s-ingress-controller.clusterPrefix |               | The prefix for resources to load balance applications from multiple clusters |
| citrix-k8s-ingress-controller.nsip          |               | The IP address of the Citrix ADC                                             |
| citrix-k8s-ingress-controller.username      |               | Username to connect to Citrix IDC                                            |
| citrix-k8s-ingress-controller.password      |               | Password to connect to Citrix IDC                                            |

## References

- [Citrix IPAM Controller](https://developer-docs.citrix.com/projects/citrix-k8s-ingress-controller/en/latest/crds/vip)

- [Citrix Ingress controller](https://developer-docs.citrix.com/projects/citrix-k8s-ingress-controller/en/latest/network/type_loadbalancer/#expose-services-of-type-loadbalancer-using-an-ip-address-from-the-citrix-ipam-controller)
