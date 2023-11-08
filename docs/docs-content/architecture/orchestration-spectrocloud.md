---
sidebar_label: "Order of Operations"
title: "Order of Operations"
description: "The methods of workload cluster provisioning for K8S clusters with Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
---


Spectro Cloud Palette provisions standard, upstream Kubernetes clusters using [Cluster API](https://cluster-api.sigs.k8s.io/).
 
Cluster API is a Kubernetes sub-project focused on providing declarative APIs and tooling to simplify provisioning, upgrading, and operating multiple Kubernetes clusters. 
 
Cluster API demonstratively manages the lifecycle of a cluster (creation, scaling, enhancement, and deletion) and helps in automating the process of cluster lifecycle management for platform operations. Cluster API also helps in consistent and repeated cluster deployment across multiple infrastructure environments.

<br />

## Workload Cluster Provisioning

![workload_cluster_provisioning.png](/architecture_orchestartion-spectrocloud_provision-flow.png)


1. New K8S cluster request from user submitted to the cluster management system.


2. Palette creates the Cluster-API (CAPI) custom-resource specifications for the target cloud, e.g in VMware this would translate to: Cluster, vSphereCluster, KubeadmControlPlane (with replica 1), and VSphereMachineTemplate. These resources are created in the management cluster.


3. Cluster API and corresponding cluster-api provider, e.g: cluster-api-provider-vsphere, provisions the first control-plane node CP-A on the target cloud.


4. When CP-A is operational, the management platform will install a Palette agent into the workload cluster and then perform a pivot of the Cluster API resources.


5. CP-A agent will retrieve the latest specifications for the cluster, e.g: 3 control-plane, and 3 workers. CP-A will generate and update the remaining CAPI resources, e.g: update replicas to 3 for KubeadmControlPlane, create the worker's MachineDeployment or VSphereMachineTemplate. Cluster API running in CP-A will provision the remaining control plane and worker nodes.


6. The Palette agent will install all the additional add-ons as specified by the cluster's cluster profile (e.g: logging, monitoring, security).

  :::info

  We do not hard code credentials. Palette uses the *cloud-init* process to inject the user-defined SSH keys into the clusters. 

  :::


## Why Palette Pivots?


Palette's decentralized model is based on a "decentralized management - local policy enforcement" scalable architecture.


  ![distributed_orchestration.png](/architecture_orchestartion-spectrocloud_distributed-flow.png)


As part of the workload K8s cluster provisioning, only the first control-plane node is launched by Cluster API, running in the Palette management cluster. Once the control-plane node is operational, Cluster API resources are _pivoted_ from the management platform into the target workload cluster.

The target workload cluster is then responsible for provisioning and maintaining the remaining control-plane and worker nodes. All Day-2 operations which result in node changes, including OS/K8s upgrades, scaling, and K8s certificate rotation, are triggered by changes to the Cluster API resources in the target workload cluster.

Palette pivots these clusters for several reasons, related to scalability and availability:

* **Scalability** - The management platform scales to meet the demand of all your workload clusters as the number of tenant clusters and nodes increases in size.

* **Resiliency** - Even if the management platform were to experience an outage, the workload clusters would retain their resiliency capabilities, auto-recovery, launching of new nodes on failures, auto-scaling, and other policies still work!

* **Intermittent network resiliency** - The design supports use cases where the workload clusters can still operate in intermittent and disconnected network availability situations.
