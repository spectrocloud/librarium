---
sidebar_label: "Enable Overlay Network"
title: "Enable Overlay Network"
description: "Learn how to enable a virtual overlay network you can control on top of an often unpredictable physical network."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

In a Kubernetes cluster, several control plane components require stable IP addresses. However, edge clusters are often deployed in locations where network environments are not managed by teams that maintain the edge deployments. In the case of an extended network outage, it's possible that your cluster components would lose their original IP addresses when the cluster expects them to remain stable, causing the cluster to experience degraded performance or become non-operational.

Palette allows you to create a virtual overlay network on top of the physical network. If the cluster experiences an outage with the overlay network enabled, components inside the cluster retain their virtual IP addresses in the overlay network, even if their IP addresses in the underlying physical network has changed, protecting the cluster from an outage. 

## When Should You Consider Enabling Overlay Network?
If your Edge clusters are deployed in network environments that fit the following descriptions, you should consider enabling an overlay network for your cluster:

- Network environments with dynamic IP address management.
- Instable network environments or environments that are out of your control. For example, you are deploying an Edge host in a restaurant located in a commercial building, and the network 

### Example Scenario

The Analytics team of a manufacturing company is deploying an Edge host to their assembly line to collect metrics from the manufacturing process. The building in which the Edge host is deployed has a network that is managed by a DHCP server. The region experiences a bad weather event that causes a sustained outage. 

|Without Overlay Network |With Overlay Network|
|---------------------|-----------------------|
| Upon recovery, each Kubernetes component inside in the Edge host requests an IP address from the DHCP server, and receives a different IP address than their original IP address before the outage happened. Since Kubernetes expects several components in the control plane to have stable IP addresses, the cluster becomes non-operational and assembly line is unable to resume operations | Each Kubernetes component inside in the Edge host has a virtual IP address in the overlay network. Upon recovery, their IP addresses in the overlay network remain the same despite their IP addresses changing in the underlying DHCP network. The Edge host is able to assume its workload and the assembly line resumes operations | 

## Enablement

You can enable an overlay network for your cluster during cluster creation.

1. 

## Access Cluster with Overlay Network Enabled

## Limitations