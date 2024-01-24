---
sidebar_label: "Public Cloud Clusters"
title: "Public Cloud Clusters"
description: "The methods of creating clusters for a speedy deployment on any CSP"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "server"
---

Palette supports provisioning new workload clusters on public clouds using cloud providers' infrastructure. It achieves
this by provisioning new virtual machines (VMs) for the control plane and worker pools and uses their managed Kubernetes
services such as EKS, AKS, GKE, TKE, and more.

Workload clusters are instantiated from cloud-specific \_Cluster Profiles\_\_](/cluster-profiles) templates that are
created with pre-configured layers and components required for cluster deployments. You can use one of the cluster
profiles provided or create a new one.

## Get Started

Learn how to deploy a cluster to a public cloud provider by using Palette. Check out the
[Deploy a Cluster with Palette](deploy-k8s-cluster.md) tutorial to get started.

## Supported Environments

The following pages provide detailed instructions for setting up new workload clusters in the various environments.

- [Amazon Web Services](aws/aws.md)

- [Azure](azure/azure.md)

- [Cox Edge](cox-edge/cox-edge.md)

- [Google Cloud](gcp/gcp.md)

- [Tencent](tke.md)
