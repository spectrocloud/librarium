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

Palette allows the pause and resume of Palette Virtual Clusters when not in use. This feature enables the users to optimize resource utilization by pausing the Virtual Clusters, not in use. This adds significant flexibility in managing operating costs and resource management for the Palette Virtual Clusters. 

<br />

### Resource Allocation Behaviors

* The quota allocation is independent of a Virtual Cluster's Pause or Resume status.


* The CPU and Memory are freed to the Cluster Group upon pausing a Virtual Cluster.


* Resources such as storage, and Load Balancers remain allocated to a Virtual Cluster regardless of the state.


* The Apps deployed on a Virtual Cluster go to a pause state when the cluster is paused.


* New Apps cannot be deployed on a Virtual Cluster in the paused state.


* Virtual Clusters in a paused state will continue to appear as an entry in the Palette Dev Engine Console. 

<br />

###  Pause and Resume your Palette Virtual Cluster

Invoke the pause and resume operations from the Palette Console. 

* Log in to the **Palette Dev Engine** Console.


* Select Palette Virtual Cluster from the **left ribbon menu**.


* Go to the cluster details page by clicking the name of the Palette Virtual Cluster to be paused.


* Click **Settings** and Select the **Pause** option. To resume a paused Virtual Cluster, select the **Resume** option.



<br />
<br />






