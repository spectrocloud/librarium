---
title: "Nodes & Clusters"
metaTitle: "Troubleshooting steps for Kubernetes nodes and clusters"
metaDescription: "Troubleshooting steps for Kubernetes nodes and clusters when managed by Palette."
icon: ""
hideToC: false
fullWidth: false
---

# Nodes & Clusters

This page covers common debugging scenarios for nodes and clusters after they have been deployed.

# Nodes

## Scenario - Repaved Nodes

Palette performs a rolling upgrade on nodes when it detects a change in the `kubeadm` config. Below are some actions that cause the `kubeadm` configuration to change and result in nodes being upgraded:
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

<br />

# Clusters

## Scenario -  vSphere Cluster and Stale ARP Table

Sometimes vSphere clusters encounter issues where nodes with an assigned Virtual IP Address (VIP) cannot contact the node with a VIP. The problem is caused by Address Resolution Protocol (ARP) entries becoming stale on non-VIP nodes.

To minimize this situation, vSphere clusters deployed through Palette now have a daemon set that cleans the ARP entry cache every five minutes. The cleaning process forces the nodes to periodically re-request an ARP entry of the VIP node. This is done automatically without any user action.

You can verify the cleaning process by issuing the following command on non-VIP nodes and observing that the ARP cache is never older than 300 seconds.

<br />

```shell
watch ip -statistics neighbour
```


## EKS Cluster Worker Pool Failures

If your EKS cluster worker pool ends up in `Failed`, `Create Failed` or `Error nodes failed to join` state, refer to the Amazon EKS [Runbook](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-troubleshooteksworkernode.html
) for troubleshooting guidance. 

<br />

## Palette Agents Workload Payload Size Issue


A cluster comprised of many nodes can create a situation where the workload report data the agent sends to Palette exceeds the 1 MB threshold and fails to deliver the messages. If the agent encounters too many workload report deliveries, the agent container may transition into a  *CrashLoopBackOff* state. 

If you encounter this scenario, you can configure the cluster to stop sending workload reports to Palette. To disable the workload report feature, create a *configMap* with the following configuration. Use a cluster profile manifest layer to create the configMap.

<br />

```shell
apiVersion: v1
kind: ConfigMap
metadata:
  name: palette-agent-config
  namespace: "cluster-{{ .spectro.system.cluster.uid }}"
data:
  feature.workloads: disable 
```

<br />