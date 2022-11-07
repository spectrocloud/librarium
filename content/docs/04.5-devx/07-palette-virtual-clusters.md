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

Palette Virtual Clusters (PVC) are Kubernetes clusters that run as nested clusters within an existing cluster (also known as a Host Cluster) or Host Cluster groups and share the host cluster resources, such as CPU, memory, and storage. By default, PVC will use k3s as virtual Kubernetes cluster, which is a highly available, certified Kubernetes distribution designed for production workloads. PVC is powered by [vCluster](https://www.vcluster.com/)

The Palette platform provisions and orchestrates all PVC, making it simple to use the lightweight, Kubernetes technology stack and tools ecosystem. Deploy Palette Virtual Clusters on Host Cluster Group by following the wizard and attaching Add-on profiles.

### Create your Palette Virtual Cluster:

To create your new Palette Virtual Cluster complete the following actions.

<br />

1. Log in to the Palette Dev Engine console


2. Select the `Palette Virtual Clusters` from the left ribbon menu, click `+ Palette Virtual Clusters,` and provide the following information to the app creation wizard.
   * Select the Cluster Group: From the available host cluster group, select the cluster group to host the new PVC.
   * Palette virtual cluster name: Provide a custom PVC name or go with the default name.
   * Provide the resource limit in terms of CPU, memory, and storage. 

 <br />

 |**Palette Virtual Cluster Resource ** | **Default    **   |**Minimum Limit**|
 |------------------------------|-------------------|-----------------|
 | CPU (per request)            | 6                 | 2.5               |
 | Memory (per request)         | 8 GiB             | 2.5 GiB           |
 | Storage (per request)        | 10 GiB            | 0 GiB           |

<br />

   * Review the information and deploy the PVC. The PVC will be provisioned within the next few minutes.

<br />
