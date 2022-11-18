---
title: "Palette Virtual Clusters"
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




## Palette Virtual Clusters

Palette Virtual Clusters are Kubernetes clusters that run as nested clusters within an existing cluster (also known as a Host Cluster) or Host Cluster groups and share the host cluster resources, such as CPU, memory, and storage. By default, Palette Virtual Clusters will use k3s as virtual Kubernetes cluster, which is a highly available, certified Kubernetes distribution designed for production workloads. Palette Virtual Clusters are powered by [vCluster](https://www.vcluster.com/)

The Palette platform provisions and orchestrates all Palette Virtual CLusters, making it simple to use the lightweight, Kubernetes technology stack and tools ecosystem. Deploy virtual clusters on Host Cluster Group by following the wizard and attaching Add-on profiles.

### Create your Palette Virtual Cluster:

To create your new Palette Virtual Cluster complete the following actions.


<br />

1. Log in to the Palette Dev Engine console

2. Select the `Palette Virtual Clusters` from the left ribbon menu, click `+ Palette Virtual Clusters,` and provide the following information to the app creation wizard.
   * Select the Cluster Group: From the available host cluster group, select the cluster group to host the new virtual cluster.
   * Palette virtual cluster name: Provide a custom virtual cluster name or go with the default name.
   * Provide the resource limit in terms of CPU, memory, and storage. 

 <br />

 |**Palette Virtual Cluster Resource ** | **Default    **   |**Minimum Limit**|
 |------------------------------|-------------------|-----------------|
 | CPU (per request)            | 6                 | 2.5               |
 | Memory (per request)         | 8 GiB             | 2.5 GiB           |
 | Storage (per request)        | 10 GiB            | 0 GiB           |

<br />


3. Review the information and deploy the Palette virtual cluster. The Palette virtual cluster will be provisioned within the next few minutes.

<br />

### Resource Tracking for Palette Virtual Clusters

Palette users can track the available resources within a Cluster Group while launching a virtual cluster. The UI color codes give a rough estimation of available CPU, memory, and storage within the selected Cluster Group. The interpretations are as follows:

<br />

* **Grey**: Resources already in use.


* **Green**: The resources allocated for the Virtual Cluster under deployment.


* **White**: Resources available within the Cluster Group which can be utilized after deploying the new Virtual Cluster.


### Example Scenario

The example screenshot below illustrates the following scenario. The Cluster Group selected in the example has a virtual cluster already running on it. The info box displays the recommended minimum CPU and memory allocated to the new virtual cluster. The color-coded bar summarizes the used, allocated, and available CPU, storage, and memory within the Cluster Group. Users can use this information to plan resource utilization per available resources. 

![color-tracking.png](color-tracking.png) 


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


[Click here to know How to Pause and Release your Palette Virtual Cluster](/devx/palette-virtual-clusters/pause-restore-virtual-clusters).

<br />
<br />
