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

Palette supports several day-2 operations to manage the end-to-end lifecycle of the Kubernetes clusters launched through Spectro Cloud. It also provides several capabilities across new and imported clusters to keep your clusters secure, compliant, up-to-date, and perform ongoing management operations like backup/restore. Additionally, you can have visibility into the workloads running inside your cluster and cluster costs. 

The following sections describe these capabilities in detail:

* [Reconfigure](/clusters/cluster-management/reconfigure) - Scale your clusters up/down by adding/reducing the number of nodes in a node pool and adding additional worker pools. Resize nodes in a node pool by modifying the node specs (CPU, Memory, or Instance Type for public clouds). Add additional fault domains such as availability zones to a node pool.


* [Updates](/clusters/cluster-management/cluster-updates) - Add/remove add-ons; Upgrade versions of the core packs (Kubernetes, CSI, CNI); Upgrade versions of add-on layers (Monitoring, Security, etc.); Update configuration for packs installed at any layer.


* [Compliance Scans](/clusters/cluster-management/compliance-scan) - Perform continuous compliance checks to ensure your clusters are secure, conformant and compliant.


* [OS Patching](/clusters/cluster-management/os-patching) - Automatically apply latest security patches to cluster nodes to stay up-to-date with latest OS patches.


* [Backup and Restore](/clusters/cluster-management/backup-restore) - Backup your cluster configurations as well as any persistent volumes used by your applications regularly; Choose critical namespaces you would like to backup; Restore as required to new or existing clusters;


* [Cost Visibility](/clusters/cluster-management/cloud-cost) - Get visibility into the estimated cloud cost for the cluster based on cluster node configuration; Get additional insights into per namespace cost (Usage Cost) calculated based on the amount of resources consumed within the namespace.



<InfoBox>
Palette supports new and existing clusters across public and private clouds. Furthermore, in public clouds, we supports managed Kubernetes cluster services such as EKS, AKS, etc. The capabilities described above may not be available for all cluster types or may work slightly different in some cluster types. Relevant sections will highlight these exceptions.
</InfoBox>