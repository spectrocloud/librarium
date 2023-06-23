---
title: "Imported Clusters"
metaTitle: "Imported Clusters"
metaDescription: "Learn how to manage imported clusters and what operations are supported with Palette."
icon: "cloud-download-alt"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Existing Kubernetes clusters not deployed through Palette can be imported into Palette for visibility, limited Day -2 management, and additional capabilities such as application lifecycle management. You can import Kubernetes clusters from various infrastructure providers, such as public and private clouds and bare-metal environments.

Palette supports importing _generic_ or _cloud-specific_ clusters. Cloud-specific clusters enable more functionality because Palette understands how to interact with the cloud provider's API. Generic clusters are more limited because Palette is unaware of the underlying cloud provider. 

To get started with a cluster import, refer to the [Import a Cluster](/clusters/imported-clusters/cluster-import) guide to learn more.

## Import Modes

To determine Palette's control over the imported cluster, you can choose the management mode you prefer. Refer to the table below for more information on each mode.


| Mode | Description |
|---|---|
| Read-only| This mode allows you to access information about the cluster, such as event logs, cost, and health checks. The read-only mode does not support Day-2 activities. |
| Full Permission|  This mode provides full cluster management, depending on the cluster, generic, or cloud-specific. This mode also supports the ability to deploy add-on cluster profiles. |



## Supported Infrastructure Providers
  
<br />

| Infrastructure Provider | Type 
|---|---| 
| AWS IaaS | Cloud Specific |
| AWS EKS  | Cloud Specific| 
| Azure IaaS | Cloud Specific | 
| Azure AKS  | Cloud Specific| 
| Google Cloud IaaS | Cloud Specific |
| VMware | Cloud Specific | 
|OpenShift |Cloud Specific | 
| AWS EKS-Anywhere | Cloud Specific | 
| Other management platforms such as Rancher, CCP, etc | Generic |
| Self-deployed and managed clusters  | Generic |

### Self-Hosted Support

Self-hosted Palette also supports importing clusters. You must ensure network connectivity is available between the target import cluster and the Palette instance.


## Limitations

A few restrictions apply to all cluster imports that you need to be aware of before importing a cluster.

<br />

| Limitation | Description|
|---|---|
| Full Cluster Profile usage|  You cannot use a full cluster profile. You are limited to using add-on profiles when deploying cluster profiles to imported clusters.|
| Kubeconfig file access| You cannot download the cluster's kubeconfig file from Palette. You must use the underlying infrastructure provider to access the kubeconfig file.|


<br />


<WarningBox>

Imported generic clusters lack many Day-2 management operations such as scaling nodes, adding worker pools, or any operations that require Palette to have knowledge of the underlying infrastructure.

</WarningBox>

<br />

## Delete Imported Cluster

You can remove a cluster by following the standard cluster removal steps. Refer to the [Delete a Cluster](/clusters/cluster-management/remove-clusters) for instructions. Be aware that Palette will not delete the actual cluster. Palette will remove the link to the imported cluster and instruct the Palette agent to remove itself from the cluster and all of the agent's dependencies that were installed during the import process. To delete the cluster, you must manually perform the delete action in the hosting infrastructure provider. 


# Resources

- [Import a Cluster](/clusters/imported-clusters/cluster-import)


- [Attach an Add-on Profile](/clusters/imported-clusters/attach-add-on-profile)


- [Migrate to Full Permissions](/clusters/imported-clusters/migrate-full-permissions)

<br />


