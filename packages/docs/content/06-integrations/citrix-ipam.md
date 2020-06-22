---
title: 'Citrix IPAM'
metaTitle: 'Citrix IPAM'
metaDescription: 'Citrix IPAM Load Balancer pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['load balancers']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/5587659e06a24cec3df66102e07522c82ae5d9b0/stable/addon/loadbalancers/citrix-adc/logo.png?token=APOFE6UC2PHSAY63QZME4U267GD4G'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Citrix IPAM and Ingress controller

The integration helps with IP address management and provides load balancing capabilities for external services deployed on Kubernetes, especially on on-premise deployments.

## Components

Integration deploys the following components:

* IPAM controller.
* Ingress controller.

## Notable parameters

| Name | Default Value | Description |
| --- | --- | --- |
| vip.addresses | | The IP address range to be used for external Services |
| vip.namespace | citrix-system | The namespace for IPAM controller |
| citrix-k8s-ingress-controller.namespace | citrix-system | The namespace for Citrix Ingress controller |
| citrix-k8s-ingress-controller.clusterPrefix | | The prefix for resources to load balance applications from multiple clusters |
| citrix-k8s-ingress-controller.nsip | | The IP address of the Citrix ADC |
| citrix-k8s-ingress-controller.username | | Username to connect to Citrix IDC |
| citrix-k8s-ingress-controller.password | | Password to connect to Citrix IDC |

## References

[Citrix IPAM Controller](https://developer-docs.citrix.com/projects/citrix-k8s-ingress-controller/en/latest/crds/vip/)

[Citrix Ingress controller](https://developer-docs.citrix.com/projects/citrix-k8s-ingress-controller/en/latest/network/type_loadbalancer/#expose-services-of-type-loadbalancer-using-an-ip-address-from-the-citrix-ipam-controller)
