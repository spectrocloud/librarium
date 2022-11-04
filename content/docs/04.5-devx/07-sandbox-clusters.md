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
 | CPU (per request)            | 6                 | 4               |
 | Memory (per request)         | 8 GiB             | 4 GiB           |
 | Storage (per request)        | 10 GiB            | 2 GiB           |

<br />

   * Review the information and deploy the Palette virtual cluster. The Palette virtual cluster will be provisioned within the next few minutes.

<br />
