---
title: "Nested Clusters"
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



## Nested Clusters

Nested Clusters are Kubernetes clusters that run within an existing cluster (also known as a Host Cluster) or Host Cluster groups and share selected resources. By default, Nested Clusters will use k3s as virtual Kubernetes cluster, which is a highly available, certified Kubernetes distribution designed for production workloads.

Palette provisions and orchestrates Nested Clusters and makes it easy to use the lightweight, Kubernetes technology stack and tools ecosystem. Deploy Nested Clusters on Host Cluster Group as simple as following the wizard and attaching Add-on profiles.

### Create your Nested Cluster:

To create your new nested cluster:

<br />

1. Log in to the Palette Dev Engine console


2. Select the `Nested Clusters` from the left ribbon menu, click `+ Nested Clusters,` and provide the following information to the app creation wizard.
   * Select the Cluster Group: From the available host cluster group, select the cluster group to host the new nested cluster.
   * Nested cluster name: Provide a custom nested cluster name or go with the default name.
   * Provide the resource Limits in terms of CPU, Memory, and Storage. The maximum limit is 6 CPU, 8 GiB memory, and 10 GiB storage (available to the developer by default), which can be reduced based on the use case.
   * Review the information and deploy the nested cluster. The nested cluster will get provisioned and start running in a few minutes.

<br />