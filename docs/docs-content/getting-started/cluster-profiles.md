---
sidebar_label: "Cluster Profiles"
title: "Cluster Profiles"
description: "Spectro Cloud Palette Cluster Profiles"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["getting-started"]
---

Cluster profiles are the declarative, full-stack models that Palette follows when it provisions, scales, and maintains
your clusters. Cluster profiles are composed of layers using packs, Helm charts, Zarf packages, or cluster manifests to
meet specific types of workloads on your Palette cluster deployments. You can create as many profiles as needed for your
workloads.

Cluster profiles provide you with a repeatable deployment process for all of your development and production
environments. They also give you visibility on the layers, packages and versions present on your deployed clusters.

Finally, if you want to update or maintain your deployed workloads, cluster profiles give you the flexibility to make
changes to all clusters deployed with the profile by removing, swapping or adding a new layer. Palette will then
reconcile the current state of your workloads with the desired state specified by the profile.

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

Packs are the smallest component of a cluster profile. Each layer of a cluster profile is made up of a specific pack.
Palette provides packs that are tailored for specific uses to support the core infrastructure a cluster needs. You can
also use add-on packs, or create your own custom pack to extend Kubernetes functionality.

The diagram below illustrates some of the popular technologies that you can use in your cluster profile layers. Check
out the [Packs List](../integrations/integrations.mdx) page to learn more about individual packs.

![Diagram of stack grouped as a unit](/getting-started/getting-started_cluster-profiles_stack-grouped-packs.png)
