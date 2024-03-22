---
sidebar_label: "Cluster Groups"
title: "Cluster Groups"
description: "Explore Palette Devx as Free Developer"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "object-group"
tags: ["clusters", "cluster groups"]
---

A _Cluster Group_ is a collection of one or more host clusters that together form a computing platform for you and your
users to deploy Palette virtual clusters. Downstream consumers can use the cluster group when using Palette in
[_App Mode_](../../introduction/palette-modes.md#what-is-app-mode).

You can create a cluster group under the Palette [tenant](../../glossary-all.md#tenant) scope. Alternatively, you can
create a cluster group at the [project](../../projects.md) scope.

By default, Palette exposes a managed cluster group called _beehive_ that is available for users in app mode. This
cluster group is managed by Palette and falls under the free tier. The beehive cluster group is located in the eastern
side of the U.S.

You can create a cluster group that is made up of various types of host clusters. You could create a cluster group by
similar cloud providers, Kubernetes versions, or by location. You have the flexibility to define the grouping criteria.
The following image displays a cluster group comprised of various host clusters deployed in a public cloud, private
cloud, and edge environment.

:::warning

Cluster groups support two network endpoints: load balancer and ingress. All host clusters added to a cluster group must
support the endpoint type configured for the cluster. Example: A host cluster configured for ingress as the endpoint
type cannot be added to a cluster group configured for the endpoint type load balancer and vice versa.

:::

![An example cluster group made up of various clusters](/clusters_cluster-groups_index-page.webp)

## Get Started

Learn how to create a cluster group by reviewing the [Create and Manage Cluster Groups](create-cluster-group.md) guide.

<br />

## Resources

- [Create and Manage Cluster Groups](create-cluster-group.md)

- [Enable Disk Backup on Virtual Clusters](cluster-group-backups.md)

- [Set up Ingress for a Cluster Group](ingress-cluster-group.md)
