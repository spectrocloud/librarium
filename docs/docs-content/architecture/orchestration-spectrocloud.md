---
sidebar_label: "Order of Operations"
title: "Order of Operations"
description:
  "Learn about the order of operations make up the workload cluster provisioning process in Palette and how Cluster API
  is used."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
---

Palette provisions standard upstream Kubernetes clusters using [Cluster API](https://cluster-api.sigs.k8s.io/). Cluster
API is a Kubernetes sub-project focused on providing declarative APIs and tooling to simplify provisioning, upgrading,
and operating multiple Kubernetes clusters.

:::info

Check out the [Cluster API concepts](https://cluster-api.sigs.k8s.io/user/concepts) page for a detailed explanation of
the components and concepts used in the Cluster API.

:::

Cluster API manages the lifecycle of a cluster. It helps in automating the process of cluster lifecycle management for
platform operations. The Cluster API also helps ensure a consistent experience in cluster deployment across multiple
infrastructure environments.

## Workload Cluster Provisioning

The following diagram illustrates the order of operations that make up the workload cluster provisioning process.

![workload_cluster_provisioning.webp](/architecture_orchestartion-spectrocloud_provision-flow.webp)

1. A user submits a request for a new Kubernetes cluster to Palette. The request may come from the UI, API, or
   Infrastructure as Code (IaC) tools such as Terraform or Crossplane.

2. Palette creates Cluster-API (CAPI) custom-resource specifications for the target cloud, such as AWS, GCP, etc. For
   example, in VMware, this would translate to the following resources getting created: Cluster, vSphereCluster,
   KubeadmControlPlane, and VSphereMachineTemplate. These resources are created in the Palette internal management
   plane.

3. Cluster API and the respective cluster-api provider, specific to the target platform, such as
   cluster-api-provider-vsphere, provisions the first control-plane node CP-A on the target cloud.

4. When CP-A is operational, the Palette management platform will install a Palette agent into the workload cluster and
   then perform a pivot of Cluster API resources. This means that Cluster API resources and their responsibilities are
   now handled by the workload cluster, not the Palette management plane.

5. CP-A agent will retrieve the required specifications for the cluster, such as the number of nodes. CP-A will generate
   and update the remaining CAPI resources, e.g: update replicas to 3 for KubeadmControlPlane, create the worker's
   MachineDeployment or VSphereMachineTemplate. The Cluster API active in CP-A will provision the remaining control
   plane and worker nodes.

6. The Palette agent will install all the additional add-ons as the cluster profile specifies.

:::info

We do not hard code credentials. Palette uses the _cloud-init_ process to inject the user-defined SSH keys into the
clusters.

:::

## Why Palette Pivots?

Palette's decentralized model is based on a "decentralized management - local policy enforcement" scalable architecture.

![distributed_orchestration.webp](/architecture_orchestartion-spectrocloud_distributed-flow.webp)

As part of the workload Kubernetes cluster provisioning, only the first control-plane node is launched by the Cluster
API active in the Palette management cluster. Once the control plane node is operational, Cluster API resources are
_pivoted_ from the Palette management platform into the target workload cluster.

The target workload cluster is responsible for provisioning and maintaining the remaining control plane and worker
nodes. All Day-2 operations, which may result in node changes, including the operating system and Kubernetes upgrades,
scaling, and Kubernetes SSL certificate rotation, are triggered by changes to Cluster API resources in the target
workload cluster.

Palette pivots these clusters for reasons such as:

- **Scalability** - The management platform scales to meet the demand of all your workload clusters as the number of
  tenant clusters and nodes increase in size.

- **Resiliency** - If the management platform were to experience an outage, the workload clusters would retain their
  resiliency capabilities, auto-recovery, launching of new nodes on failures, auto-scaling, and other features would
  remain operational.

- **Intermittent network resiliency** - The decentralized design supports use cases where the workload clusters can
  still operate in intermittent and disconnected network availability situations.
