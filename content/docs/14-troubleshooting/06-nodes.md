---
title: "Nodes & Clusters"
metaTitle: "Troubleshooting steps for Kubernetes nodes and clusters"
metaDescription: "Troubleshooting steps for Kubernetes nodes and clusters when managed by Palette."
icon: ""
hideToC: false
fullWidth: false
---

# Nodes & Clusters

This page is covers common debugging scenarios for nodes and clusters post deployment.

# Nodes

## Scenario - Repaved Nodes

Palette performs a rolling upgrade on the nodes when a chang is detected in the kubeadm config. Below are some of the actions including but not limited to that will cause the kubeadm configuration to change and result in the nodes getting an upgrade:
* OS layer changes
* Kubernetes layer changes
* Kubernetes version upgrade
* Kubernetes control plane upsize
* Machine pool updates for disk size
* Changes in availability zones
* Changes in instance types
* Certificate renewal

Logs are provided in Palette for traceability. However, these logs may be lost when the pods are relaunched. To ensure that the cause and context is persisted across repaving, a field titled **upgrades** is available in the status section of [SpectroCluster object](https://docs.spectrocloud.com/api/v1/clusters/). This field is represented in the Palette UI so that you can understand why and when repaving happened.

For detailed information, review the cluster upgrades [page](/clusters/#clusterupgradedetails).



# Clusters

## Scenario -  vSphere Cluster and Stale ARP Table
Sometimes certain vSphere clusters run into issues where non-VIP nodes are unable to contact the VIP node, primarly because non-VIP nodes' ARP entries became stale.

To minimize this situation, vSphere clusters deployed from Palette now come equiped with a daemonset that cleans the ARP entry cache every 5 minutes. The cleaning process will force the nodes to re-request an ARP entry of the VIP node periodically. This is done automatically without any user action.

You can verify the cleaning process by running the following command on non-VIP nodes and observe that ARP cache is never older than 300 seconds:

```
watch ip -statistics neighbour
```


## Secnario - EKS Cluster Worker Pool Failures

If your EKS cluster  worker pool ends up in `Failed` or `Create Failed` or `Error nodes failed to join` state, please refer to this [Amazon provided Runbook](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-troubleshooteksworkernode.html
)

<br />