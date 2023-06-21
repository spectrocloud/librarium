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

Existing Kubernetes clusters that were not deployed through Palette can be imported into the Palette for visibility, limited Day -2 management, and additional capabilities such as application lifecycle management. You can import Kubernetes clusters from various public cloud, private cloud, and bare-metal environments.

Palette supports importing _generic_ or _cloud-specific_ clusters. Cloud-specific clusters enable more functionality because Palette understands how to interact with the cloud provider. Generic clusters are more limited because Palette is unaware of the underlying cloud provider. 

To import a cluster into Palette, refer to the [Import a Cluster](/clusters/imported-clusters/cluster-import) guide.

## Import Modes


| Mode | Description |
|---|---|
| Read-only| This mode allows you to access information about the cluster such as event logs, cost, health checks. Read-only mode does not support Day-2 activities. |
| Full Permission|  This mode provides you with full cluster management, depending on the type of cluster, generic, or cloud-specific.|



## Supported Infrastructure Providers
  
<br />

| Infrastructure Provider | Supported 
|---|---| 
| AWS IaaS | ✅ |
| AWS EKS  | ✅ | 
| Azure IaaS | ✅ | 
| Azure AKS  | ✅ | 
| Google Cloud IaaS | ✅ |
| VMware | ✅ | 
|OpenShift | ✅ | 
| AWS EKS-Anywhere | ✅ | 
| Other management platforms such as Rancher, CCP, etc | ✅ |
| Self-deployed and managed clusters  | ✅ |

### Self-Hosted Support

Self-hosted Palette also supports importing clusters. You must ensure network connectivity is available between the target import cluster and the Palette instance.


## Limitations

There are a few restrictions that apply to all cluster imports.

<br />

| Limitation | Description|
|---|---|
| Cluster Profile usage|  You will not be able to use cloud-specific cluster profiles and are limited to using add-on profiles.|
| Kubeconfig file access| You will not be able to download the cluster's kubeconfig file from Palette. You will have to use the underlying infrastructure provider to access the kubeconfig file.|


<br />


<WarningBox>

Imported generic clusters lack many Day-2 management operations such as scaling nodes, adding worker pools, or any operations that require Palette to have knowledge of the underlying infrastructure.

</WarningBox>

<br />


# Resources

- [Import a Cluster](/clusters/imported-clusters/cluster-import)


- [Attach an Add-on Profile](/clusters/imported-clusters/attach-add-on-profile)


- [Migrate to Full Permissions](/clusters/imported-clusters/migrate-full-permissions)

<br />


