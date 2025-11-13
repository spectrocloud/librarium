---
sidebar_label: "Cluster Groups"
title: "Cluster Groups"
description: "Explore Palette Dev Engine as Free Developer"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "object-group"
tags: ["clusters", "cluster groups"]
---

A _Cluster Group_ is a collection of one or more host clusters that together form a computing platform for you and your
users to deploy Palette virtual clusters. Downstream consumers can use the cluster group when using Palette in
[_App Mode_](../../introduction/palette-modes.md#what-is-app-mode).

You can create a cluster group under the Palette [tenant](../../glossary-all.md#tenant) scope. Alternatively, you can
create a cluster group at the [project](../../tenant-settings/projects/projects.md) scope.

You can create a cluster group that is made up of various types of host clusters. You could create a cluster group by
similar cloud providers, Kubernetes versions, or by location. You have the flexibility to define the grouping criteria.
The following image displays a cluster group comprised of various host clusters deployed in a public cloud, private
cloud, and edge environment.

<br />

:::warning

Cluster groups support two network endpoints: load balancer and ingress. All host clusters added to a cluster group must
support the endpoint type configured for the cluster. Example: A host cluster configured for ingress as the endpoint
type cannot be added to a cluster group configured for the endpoint type load balancer and vice versa.

:::

![An example cluster group made up of various clusters](/clusters_cluster-groups_index-page.webp)

## Edge Cluster Support

You can add Edge clusters to a cluster group and deploy Palette virtual clusters on them. However, when using Edge
clusters in a cluster group, you must consider the following limitations:

- The cluster group must only contain Edge clusters. You cannot mix Edge clusters with other types of clusters in the
  same cluster group.
- The cluster group can only support one Edge cluster.
<!-- prettier-ignore -->
- You must provide the capability to support a load balancer or ingress endpoint for the cluster group. You can use
  solutions such as <VersionedLink text="MetalLB" url="/integrations/packs/?pack=lb-metallb-helm" /> and
  <VersionedLink text="Nginx" url="/integrations/packs/?pack=nginx" /> in your cluster profile to support these types of
  endpoints.

## Get Started

Learn how to create a cluster group by reviewing the [Create and Manage Cluster Groups](create-cluster-group.md) guide.

<br />

## Upgrade Cluster Groups

The [vCluster version](https://www.vcluster.com/releases/en/changelog) may be updated in a Palette release, which can
introduce breaking changes that affect newly created virtual clusters.

To avoid disruptions, Palette locks the vCluster version for each cluster group, ensuring virtual clusters can still be
provisioned successfully within existing groups, even across Palette updates.

If you want to use the latest version of vCluster on your virtual clusters, you must prompt Palette to upgrade your
cluster group at a time that suits you. Refer to [Upgrade Cluster Groups](vcluster-upgrades.md) for guidance.
