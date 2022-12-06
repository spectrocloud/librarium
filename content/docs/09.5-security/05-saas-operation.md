---
title: "SaaS Operation"
metaTitle: "SaaS Operation"
metaDescription: "SaaS security for platform, tenant clusters, control plane, and worker nodes"
icon: ""
hideToC: true
fullWidth: false
---

# SaaS Operation

Spectro Cloud’s SaaS infrastructure is hosted in the public cloud within a logically isolated virtual network that has a private and a public subnet. The [control plane and worker nodes](##control-plane-and-worker-nodes) for the Kubernetes cluster are launched in the private network.
<br />

## Platform Security

Spectro Cloud uses a micro services-based architecture to ensure its platform security.  Product functionality is broken down logically into isolated services within containers. These containers are deployed in a Kubernetes cluster called a management cluster that Spectro Cloud can host and manage (SaaS mode) or that you can host and manage, typically behind the firewall (self-managed mode).

In public clouds like AWS, Azure, and GCP, the SaaS platform interacts directly with the cloud’s API endpoint for access using cloud credentials specified in the tenant. The tenant clusters can be deployed in a virtual private network (VPC) in the cloud, as described in [Tenant Cluster Security](##Tenant-Cluster-Security). 

This allows the SaaS controller to do the following: 

- Dynamically query cloud resources.
- Act as an orchestrator to initiate SaaS controller requests for deployments.

In private clouds like VMware vSphere, a private cloud gateway (PCG) component is deployed in the on-prem environment as a virtual appliance (OVA). The PCG component automatically pairs with a tenant based on a randomly generated pairing code similar to the Bluetooth pairing process and acts as a proxy between Spectro Cloud SaaS and private cloud endpoints, such as vCenter. The PCG uses an outgoing internet connection to the SaaS platform using static network address translation (NATS) with transport layer security (TLS). More details about OVA operation are provided in [Self-Managed Operation](/security/self-managed-operation). 
<br />

## Tenant Cluster Security

Tenant clusters can be deployed in a virtual private network in the cloud (VPC). Each tenant cluster has a management agent that runs as a pod. This agent has an outbound internet connection to the Spectro Cloud SaaS platform using static network address translation (NATS) with transport layer security (TLS) protocol v1.2 or higher and a hardened cipher suite. The agent periodically reports health, heartbeat, and statistics and connects to the Spectro Cloud public repository over HTTPS for any out-of-box integration packs.

The following design principles ensure tenant isolation:

- **Network isolation**: Tenant clusters are created in the tenant’s public cloud accounts or in private data centers. Customers cannot intercept network traffic in other tenant clusters. Access to tenant cluster APIs through the cluster’s kubeconfig file is restricted to the tenant.

- **Data isolation**: Spectro Cloud applies a tenant filter to every operation to ensure user access is restricted to their own tenant.

- **Data encryption**: Tenant data is encrypted, and all message communication uses tenant-specific channels.

## Control Plane and Worker Nodes

Control plane nodes and worker nodes in the Kubernetes cluster that hosts Spectro Cloud’s SaaS platform are launched in private subnets. All ports on the nodes are protected from external access.

The Spectro Cloud SaaS Ops team maintains the SSH public key deployed in the nodes.

<br />
Control plane nodes have the following security group rules:
<br />

|**Type** | **Protocol** | **Port Range** | **Source** | **Description** |
|---------|------------|---------|-----------------|--------------------|
|Custom TCP Rule | TCP | 6443 | 0.0.0.0/0 | Kubernetes API |
|SSH | TCP | 22 | bastion | SSH |
|Custom TCP Rule | TCP | 2379 | control plane | etcd |
|Custom TCP Rule | TCP | 2380 | control plane | etcd peer |
|Custom TCP Rule | TCP | 179 | control plane | etcd (calico)|
|Custom TCP Rule | TCP | 179 | worker node | bgp (calico)|
|Custom Protocol | IPv4 (4) | All | control plane | IP-in-IP (calico)|
|Custom Protocol | IPv4 (4) | All | worker node | IP-in-IP (calico)|

<br />
Worker nodes have the following security group rules: 
<br />

|**Type** | **Protocol** | **Port Range** | **Source** | **Description** |
|---------|------------|---------|-----------------|--------------------|
|SSH | TCP | 22 | bastion | SSH |
|Custom TCP Rule | TCP | 10250 | control plane | Kubelet API |
|Custom TCP Rule | TCP | 10250 | worker node | Kubelet API |
|Custom TCP Rule | TCP | 179 | control plane | bgp (calico)|
|Custom TCP Rule | TCP | 179 | worker node | bgp (calico)|
|Custom Protocol | IPv4 (4) | All | control plane | IP-in-IP (calico)|
|Custom Protocol | IPv4 (4) | All | worker node | IP-in-IP (calico)|
<br />