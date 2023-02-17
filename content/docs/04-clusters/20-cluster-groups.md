---
title: "Cluster Groups"
metaTitle: "Palette Devx for Enterprise Developers"
metaDescription: "Explore Palette Devx as Free Developer"
hideToC: false
icon: "object-group"
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview

A *Cluster Group* is a collection of one or more host clusters that together form a computing platform for you and your users to deploy Palette virtual clusters. Downstream consumers can use the cluster group when using Palette in [*App Mode*](/introduction/palette-modes#whatisappmode?). 

You can create a cluster group under the Palette [System Scope](/devx/cluster-groups#systemscope). Alternatively, you can create a cluster group at the [project](/projects) scope.

By default, Palette exposes a managed cluster group called *beehive* that is available for users in app mode. This cluster group is managed by Palette and falls under the free tier. The beehive cluster group is located in the eastern side of the U.S. 

You can create a cluster group that is made up of various types of host clusters. You could create a cluster group by similar cloud providers, Kubernetes versions, or by location. You have the flexibility to define the grouping criteria. The following image displays a cluster group comprised of various host clusters deployed in a public cloud, private cloud, and edge environment.

<br />

<WarningBox>

Cluster groups support two network endpoints: load balancer and ingress. All host clusters added to a cluster group must support the endpoint type configured for the cluster. Example: A host cluster configured for ingress as the endpoint type cannot be added to a cluster group configured for the endpoint type load balancer and vice versa.

</WarningBox>

![An example cluster group made up of various clusters](/clusters_cluster-groups_index-page.png)

Learn how to create a cluster group by reviewing the [Create and Manage Cluster Groups](/clusters/cluster-groups/create-cluster-group) guide.

# Resources

- [Create and Manage Cluster Groups](/clusters/cluster-groups/create-cluster-group)

- [Enable Disk Backup on Virtual Clusters](/clusters/cluster-groups/cluster-group-backups)

- [Set up Ingress for a Cluster Group](/clusters/cluster-groups/ingress-cluster-group)

<br />