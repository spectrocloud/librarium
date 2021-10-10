---
title: "Manage Clusters"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
icon: "envelope-open-text"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Manage Clusters

Sectro Cloud supports several day-2 operations to manage end-to-end lifecycle of the kubernetes clusters launched through Spectro Cloud. It also provides several capabilities across new and imported clusters to keep your clusters secure, complaint, up-to-date as well perform ongoing management operations like backup/restore. Additionally you can  visbility into the workloads running inside your cluster and cluster costs. 

The following sections describe these capabilities in detail:

* [Reconfigure](/clusters/cluster-management/scaling) - Scale your clusters up/down by adding/reducing the number of nodes in a node pool, and add additional worker pools; Resize nodes in a node pool by modifying the node specs (CPU, Memory or Instance Type for public clouds); add additional fault domains such as availability zones to a node pool.


* [Updates](/clusters/cluster-management/cluster-updates) - Add/remove add-ons; Upgrade versions of the core packs (Kubernetes, CSI, CNI); Upgrade versions of add-on layers (Monitroing, Security, etc.); Update configuration for packs installed at any layer


* [Compliance Scans](/clusters/cluster-management/compliance-scan) - Perform continuous compliance checks to ensure your clusters are secure, conformant and complinnt.


* [OS Patching](/clusters/cluster-management/os-patching) - Automatically apply latest security patches to cluster nodes to stay up-to-date with latest OS patches.


* [Backup and Restore](/clusters/cluster-management/backup-restore) - Backup your cluster configurations as well as any persistent volumes used by your applications on a regular basis; Choose critical namespaces you would like to backup; Restore as required to new or existing clusters;


* [Cost Visibility](/clusters/cluster-management/cluster-cost) - Get visibility into the estimated cloud cost for the cluster based on cluster node configuration; Get additional insights into per namespace cost (Usage Cost) calulated based on amount of resources consumed within the namespace.


* [Workload Visibility](/clusters/cluster-management/workloads) - Get visibility into the workloads running in your clusters; Get a near real time update on status of various kubernetes resources such as pods, deployments, replicasets, etc; View detailed resource consumption over a period for pods.


<InfoBox>
Spectro Cloud supports new and existing cluster across public and private clouds. Furthermore in public clouds, Spectro Cloud supports managed kubernetes cluster services such as EKS, AKS, etc. The capabilities descried above may not be available for all cluster types or may work a bit differently in some cluster types. These differences will be highlighted in the relevant sections. 
</InfoBox>