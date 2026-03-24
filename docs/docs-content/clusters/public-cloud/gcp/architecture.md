---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support Google Cloud using Palette."
hide_table_of_contents: false
tags: ["public cloud", "gcp", "architecture"]
sidebar_position: 0
---

Palette supports Google Cloud Platform (GCP) as one of its public cloud environments. Using Palette, you can effectively
manage the entire lifecycle of any combination of new or existing, simple or complex, small or large Kubernetes
environments in GCP. Palette gives IT teams complete control, visibility, and production-scale efficiencies to provide
developers with highly curated Kubernetes stacks and tools with enterprise-grade security.

## IaaS Architecture

The following are some architectural highlights of GCP clusters deployed by Palette:

- Control plane nodes and worker nodes are placed within a single private subnet that spans different availability zones
  within a region.

- A new Virtual Private Cloud (VPC) Network is created with all the network infrastructure components, such as Cloud NAT
  and a Cloud Router. In addition, firewall rules are created to protect all the API endpoints.

- The Kubernetes API server endpoint is exposed through a Global Load Balancer. Applications deployed into the cluster
  can use a Regional Load Balancer to expose internal Kubernetes services.

![A GCP IaaS architecture diagram](/gcp_cluster_architecture.webp)

## GKE Architecture

The following are some architectural highlights of Google Kubernetes Engine (GKE) clusters deployed by Palette:

- Cluster resources can be provisioned into new dedicated network infrastructure created automatically by Palette, or
  into a shared VPC owned by another GCP project.

- A GKE cluster can include multiple node pools, each with its own machine type and configuration, distributed across
  multiple availability zones.

- When Palette provisions the network, nodes can be configured to use only private IP addresses and access the internet
  through Cloud NAT.

![A GCP GKE architecture diagram](/clusters_gcp_architecture_gke-diagram.webp)
