---
title: "Task: Scale a VMware cluster"
metaTitle: "Task: Scale a VMware cluster"
metaDescription: "The method of scaling a cluster on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Scaling a VMware Cluster

Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down a VMware cluster:

* Access the ‘nodes’ view for the cluster
* For the desired node pool change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale up/down operation is initiated in a few minutes.
* Provisioning status is updated with ongoing progress of the scale operation.

> The master node pool may be scaled from 1 to 3 or 3 to 5 nodes. Scale down operation is not supported for master nodes.
