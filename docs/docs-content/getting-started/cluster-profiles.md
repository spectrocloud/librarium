---
sidebar_label: "Cluster Profiles"
title: "Cluster Profiles"
description: "Spectro Cloud Palette Cluster Profiles"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["getting-started"]
---

Cluster profiles are composed of layers using packs, Helm charts, and custom manifests to meet specific types of
workloads on your Palette cluster deployments. You can create as many profiles as needed for your workload cluster
deployments.

Below are cluster profile types you can create:

- _Infrastructure_ profiles provide the essential components for workload cluster deployments within a
  [tenant](../glossary-all.md#tenant): Operating System (OS), Kubernetes, Network, and Storage. Collectively, these
  layers form the infrastructure for your cluster.

- _Add-on_ profiles are exclusively composed of add-on layers. They usually do not contain infrastructure components and
  are instead designed for reusability across multiple clusters and multiple projects within a tenant. Since they
  provide the flexibility to configure clusters based on specific requirements, _add-on_ profiles can be added to
  _infrastructure_ profiles to create what we call a _full profile_.

- _Full profiles_ combine infrastructure packs with add-on layers. By adding layers, you can enhance cluster
  functionality. For example, you might add system apps, authentication, monitoring, ingress, load balancers, and more
  to your cluster.

The diagram below illustrates the components of these profile types and how you can build on infrastructure layers with
add-on layers to create a full cluster profile. You can also create separate add-on profiles to reuse among multiple
clusters.

![A flow diagram that shows how you can add layers to an infrastructure profile to create a full profile.](/getting-started/getting-started_cluster-profiles_cluster-profiles.png)

## Packs

Palette provides packs that are tailored for specific uses to support the core infrastructure a cluster needs and add-on
packs to extend Kubernetes functionality. Each pack you add to a cluster profile is considered a layer in the profile.
Check out the [Packs List](../integrations/integrations.mdx) page to learn more about individual packs.
