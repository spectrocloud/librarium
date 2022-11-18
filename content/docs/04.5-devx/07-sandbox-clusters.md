---
title: "Sandbox Clusters"
metaTitle: "Palette Dev Engine for Enterprise Developers"
metaDescription: "Explore Palette Dev Engine as Free Developers"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



## Sandbox Clusters

Sandbox Clusters are Kubernetes clusters that run as nested clusters within an existing cluster (also known as a Host Cluster) or Host Cluster groups and share the host cluster resources, such as CPU, memory, and storage. By default, Sandbox Clusters will use k3s as virtual Kubernetes cluster, which is a highly available, certified Kubernetes distribution designed for production workloads.

Palette provisions and orchestrates Sandbox Clusters and makes it easy to use the lightweight, Kubernetes technology stack and tools ecosystem. Deploy Sandbox Clusters on Host Cluster Group as simple as following the wizard and attaching Add-on profiles.

### Create your Sandbox Cluster:

To create your new sandbox cluster:

<br />

1. Log in to the Palette Dev Engine console


2. Select the `Sandbox Clusters` from the left ribbon menu, click `+ Sandbox Clusters,` and provide the following information to the app creation wizard.
   * Select the Cluster Group: From the available host cluster group, select the cluster group to host the new sandbox cluster.
   * Sandbox cluster name: Provide a custom sandbox cluster name or go with the default name.
   * Provide the resource limit in terms of CPU, memory, and storage. 

 <br />

 |**Sandbox Cluster Resource ** | **Default    **   |**Minimum Limit**|
 |------------------------------|-------------------|-----------------|
 | CPU (per request)            | 6                 | 2.5               |
 | Memory (per request)         | 8 GiB             | 2.5 GiB           |
 | Storage (per request)        | 10 GiB            | 0 GiB           |

<br />

   * Review the information and deploy the Palette virtual cluster. The Palette virtual cluster will be provisioned within the next few minutes.

<br />


## Palette Virtual Cluster Pause and Resume

Palette allows the pause and resume of Palette Virtual Clusters when not in use. This feature enables the users to optimize resource utilization by pausing the virtual clusters not in use. This adds significant flexibility in managing operating costs and resource management for the Palette Virtual Clusters. 

<br />

### System and Resource Impact

* The quota allocation is independent of a virtual cluster's pause or resume status.


* The CPU and memory are freed and returned to the cluster group when you pause a virtual cluster.


* Resources such as storage, and load balancers remain allocated to a virtual cluster regardless of the state.


* The Apps deployed on a virtual cluster go to a pause state when the cluster is paused.


* New Apps cannot be deployed on a virtual cluster in the paused state.


* Virtual clusters in a paused state will continue to appear as an entry in the Palette Dev Engine Console. 

<br />

[How to Pause and Release your Palette Virtual Cluster]().

<br />
<br />






