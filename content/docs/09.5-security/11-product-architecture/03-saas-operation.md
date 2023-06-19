---
title: "SaaS Operation"
metaTitle: "SaaS Operation"
metaDescription: "Learn about Palette security in a SaaS deployment."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette can be deployed as a multi-tenant SaaS system in which each tenant represents a customer. Palette SaaS infrastructure is hosted in the public cloud within a logically isolated virtual network that has a private and a public subnet. The [control plane and worker nodes](/security/product-architecture/saas-operation#controlplaneandworkernodes) for the Kubernetes cluster are launched in the private network.

<br />

## Cloud Infrastructure Security

In public cloud environments such as AWS, Azure, and GCP, Palette interacts directly with a cloud provider’s API endpoint for access using cloud credentials specified in the tenant. The tenant clusters can be deployed in a virtual private cloud (VPC), as described in [Tenant Cluster Security](/security/product-architecture/tenant-cluster).

This allows the SaaS controller to do the following:

<br />

- Dynamically query cloud resources.


- Act as an orchestrator to initiate SaaS controller requests for deployments.

When a Palette SaaS deployment such as VMware or MAAS environments must connect on-prem to deploy target Kubernetes clusters, a Private Cloud Gateway (PCG) component is deployed in the self-hosted environment as a virtual appliance (OVA). The PCG is Palette's on-prem component to enable support for isolated, private cloud or data center environments. 

The PCG pairs automatically with a tenant based on a randomly generated pairing code similar to the Bluetooth pairing process and acts as a proxy between Palette SaaS and private cloud endpoints, such as vCenter. The PCG uses an outgoing internet connection to the SaaS platform using Static Network Address Translation (NATS) with Transport Layer Security (TLS). Refer to the [System Private Gateway](/clusters/data-center/maas/architecture#systemprivategateway) reference page to learn more.

<br />

## Control Plane and Worker Nodes

Control plane nodes and worker nodes in the Kubernetes cluster hosting Palette SaaS are launched in private subnets. All ports on the nodes are protected from external access.

In self-hosted Palette installations, customers manage their own SSH public keys unless an agreement is in place for Spectro Cloud to maintain their environment.

<br />

# Resources

[Tenant Cluster Security](/security/product-architecture/tenant-cluster)

<br />

<br />

<br />

<br />

