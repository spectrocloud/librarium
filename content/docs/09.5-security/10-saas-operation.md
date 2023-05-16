---
title: "SaaS Operation"
metaTitle: "SaaS Operation"
metaDescription: "Learn about Palette security in a SaaS environment environment."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette is a multi-tenant SaaS system in which every tenant represents a customer. Palette SaaS infrastructure is hosted in the public cloud within a logically isolated virtual network that has a private and a public subnet. The [control plane and worker nodes](/security/saas-operation#controlplaneandworkernodes) for the Kubernetes cluster are launched in the private network.

We ensure tenant isolation through the following design principles and techniques.

<br />

- **Network Isolation**: Tenant clusters are created in the tenant’s public cloud accounts or in private data centers. Customers cannot intercept network traffic in other tenant clusters. Access to tenant cluster APIs through the cluster’s kubeconfig file is restricted to the tenant.


- **Data isolation**: Palette applies a tenant filter to every operation to ensure user access is restricted to the user's tenant.


- **Tenant Data Encryption**: Tenant data is encrypted, and all message communication uses tenant-specific channels.


- **Audit Policies**:  We record all actions taken on the platform and provide a comprehensive report for tracking purposes.


- **Noisy Neighbor Prevention**: We use AWS Load Balancers and AWS CloudFront with a web application firewall (WAF) for all our public-facing services. These frameworks benefit from the protections of AWS Shield Standard which defends against the most common and frequently occurring network and transport layer Distributed Denial-of-Service (DDoS) attacks that target applications. This ensures excessive calls from a tenant do not adversely affect other tenants from utilizing the platform.


## Platform Security

Palette uses a micro services-based architecture to ensure its platform security. Product functionality is broken down logically into isolated services within containers. These containers are deployed in a Kubernetes cluster called a management cluster that Palette hosts and manages in SaaS mode or that users can host and manage in a self-hosted environment. 

In public clouds like AWS, Azure, and GCP, Palette interacts directly with a cloud’s API endpoint for access using cloud credentials specified in the tenant. The tenant clusters can be deployed in a virtual private network (VPC) in the cloud, as described in [Tenant Cluster Security](/security/saas-operation/#tenantclustersecurity). 

This allows the SaaS controller to do the following: 

<br />

- Dynamically query cloud resources.


- Act as an orchestrator to initiate SaaS controller requests for deployments.

In private clouds like VMware vSphere, a Private Cloud Gateway (PCG) component is deployed in the on-prem environment as a virtual appliance (OVA). The PCG component automatically pairs with a tenant based on a randomly generated pairing code similar to the Bluetooth pairing process and acts as a proxy between Spectro Cloud SaaS and private cloud endpoints, such as vCenter. The PCG uses an outgoing internet connection to the SaaS platform using static network address translation (NATS) with transport layer security (TLS). More details about OVA operation are provided in [Self-Hosted Operation](/security/self-hosted-operation). 

<br />

## Tenant Cluster Security

Tenant clusters can be deployed in a virtual private network in the cloud (VPC). Each tenant cluster has a management agent that runs as a pod. This agent has an outbound internet connection to Palette using static network address translation (NATS) with transport layer security (TLS) protocol v1.2 or higher and a hardened cipher suite. The agent periodically reports health, heartbeat, and statistics and connects to Palette's public repository over HTTPS for any out-of-the-box integration packs.

The following design principles ensure tenant isolation:

<br />

- **Network isolation**: Tenant clusters are created in the tenant’s public cloud accounts or in private data centers. Customers cannot intercept network traffic in other tenant clusters. Access to tenant cluster APIs through the cluster’s kubeconfig file is restricted to the tenant.


- **Data isolation**: Palette applies a tenant filter to every operation to ensure user access is restricted to their own tenant.


- **Data encryption**: Tenant data is encrypted, and all message communication uses tenant-specific channels.


## Control Plane and Worker Nodes

Control plane nodes and worker nodes in the Kubernetes cluster that hosts Palette are launched in private subnets. All ports on the nodes are protected from external access. 

In self-hosted Palette installations, customers manage their own SSH public keys unless an agreement is in place for Spectro Cloud to maintain their environment.

<br />

# Resources

[Self-Hosted Operation](/security/self-hosted-operation)

<br />

<br />

<br />

<br />

