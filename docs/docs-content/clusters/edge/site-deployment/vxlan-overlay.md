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

## What is an Overlay Network?

Palette uses Virtual Extensible Local Area Network (VxLAN) to create an overlay network that 


## When Should You Consider Enabling Overlay Network?

## Enablement

You can enable an overlay network for your cluster during cluster creation.

## Access Cluster with Overlay Network Enabled

## Limitations