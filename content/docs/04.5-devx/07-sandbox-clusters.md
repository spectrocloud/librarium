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

Sandbox Clusters are Kubernetes clusters that run as nested clusters within an existing cluster (also known as a Host Cluster) or Host Cluster groups and share selected resources. By default, Sandbox Clusters will use k3s as virtual Kubernetes cluster, which is a highly available, certified Kubernetes distribution designed for production workloads.

Palette provisions and orchestrates Sandbox Clusters and makes it easy to use the lightweight, Kubernetes technology stack and tools ecosystem. Deploy Sandbox Clusters on Host Cluster Group as simple as following the wizard and attaching Add-on profiles.

### Create your Sandbox Cluster:

To create your new sandbox cluster:

<br />

1. Log in to the Palette Dev Engine console


2. Select the `Sandbox Clusters` from the left ribbon menu, click `+ Sandbox Clusters,` and provide the following information to the app creation wizard.
   * Select the Cluster Group: From the available host cluster group, select the cluster group to host the new sandbox cluster.
   * Sandbox cluster name: Provide a custom sandbox cluster name or go with the default name.
   * Provide the resource Limits in terms of CPU, Memory, and Storage. The maximum limit is 6 CPU, 8 GiB memory, and 10 GiB storage (available to the developer by default), which can be reduced based on the use case.
   * Review the information and deploy the sandbox cluster. The sandbox cluster will get provisioned and start running in a few minutes.

<br />
