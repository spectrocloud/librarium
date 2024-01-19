---
sidebar_label: "App Mode and Cluster Mode"
title: "App Mode and Cluster Mode"
description: "Learn about the two modes available in Palette and how they benefit your Kubernetes experience."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["app mode", "cluster mode"]
---

## Palette Modes

Palette supports two consumption modes - each aimed at different use cases and, potentially, different personas. The two
modes are _App Mode_ and _Cluster Mode_. These modes can be used separately but often work together by sharing resources
or relying on resources that each provides.

![App Mode and Cluster Mode](/docs_introduction_palette-modes.png)

### What is Cluster Mode?

Cluster mode gives you the ability to provision Kubernetes clusters to various platforms and cloud providers through
Palette. Palette manages and maintains the lifecycle of these Kubernetes clusters. We call a Kubernetes cluster that
Palette manages and deploys a [_Host Cluster_](../glossary-all.md#host-cluster).

Cluster mode is frequently leveraged by personas such as platform engineers, infrastructure engineers, system
administrators, and others who are in a role that requires them to support infrastructure. These personas frequently
leverage cluster mode to specify attributes that should make up the Kubernetes cluster, and where and how the cluster
should be deployed. These operators leverage a concept we call
[_Cluster Profiles_](../profiles/cluster-profiles/cluster-profiles.md). Other users such as developers, can also
leverage cluster mode and cluster profiles to deploy a Kubernetes cluster for ad-hoc purposes, such as research efforts.

When you operate in cluster mode, you have the ability to specify projects to control the scope of the Kubernetes
cluster. The ability to specify projects is beneficial when segmenting resources for different teams. For example, a
project titled “ml-modeling” could belong to a team focused on machine learning. In the project “modeling,” you could
deploy various Kubernetes clusters for the machine learning team to conduct their work. These Kubernetes clusters could
also be grouped together (Cluster Group) if grouping of similar resources is needed.

Other teams could be prevented from accessing the resources that belong to the project “modeling” by not being a member
of the project. Palette offers role-based access control (RBAC) that enables more fine-grained control of resources.
Lastly, you can also view the utilization of resources from the project level, which is helpful when understanding
utilization and reviewing costs.

Another important feature of cluster mode is the ability to allow specific host clusters to support Palette Virtual
Clusters. Virtual clusters are Kubernetes clusters that run as nested clusters within an existing host cluster. A
virtual cluster looks and feels like a normal Kubernetes cluster, except that it resides inside a larger Kubernetes
cluster or host cluster often deployed in a cloud provider or on-prem. You can control the resources a virtual cluster
is allocated, such as CPU, memory, and storage.

Virtual clusters are powerful and beneficial to teams due to their characteristics:

- Look and feel exactly like a host cluster
- Are up and running within minutes
- Removes the infrastructure overhead for downstream consumers
- Reduces the need to set up or manage complicated Kubernetes namespaces and roles. Teams can instead receive their own
  virtual cluster without worrying about permissions or affecting other teams’ resources.

Virtual clusters help reduce development time by allowing downstream consumers to focus more on application development
versus addressing infrastructure overhead. You can also
[pause and resume](../devx/palette-virtual-clusters/pause-restore-virtual-clusters.md) virtual clusters, which helps
significantly in reducing costs. App mode heavily leverages virtual clusters.

### What is App Mode?

App Mode is a unique experience that Palette provides in that it removes Kubernetes infrastructure overhead as much as
possible. In App mode, you can focus on creating and managing
[_App Profiles_](../profiles/app-profiles/app-profiles.md). App profiles are declarative templates that you use to
define all the required services, containers, and databases that make up an application. Once you define an app profile,
you can deploy your application to any Palette Virtual Cluster by specifying the respective app profile.

App mode comes with an out-of-the-box cluster group managed by us here at Spectro Cloud called _beehive_. This cluster
group, which under the cover is a collection of Kubernetes clusters, is configured to support Palette Virtual Clusters.
As a consumer, you can deploy a new virtual cluster to the beehive cluster group and get started with a Kubernetes
cluster in minutes.

App mode's ability to get you started with a Kubernetes cluster in minutes makes it a powerful development tool. You can
use the virtual clusters temporarily, such as for testing, ad-hoc development, or any other scenario where you want a
short-lived Kubernetes environment up and running quickly.

Alternatively, you could use app mode to offer your own Palette-managed host clusters as a PaaS experience to downstream
consumers. This concept is easier explained through an example. Assume you are a system administrator, and you want to
expose Kubernetes to various in-house development teams. You could deploy several Kubernetes clusters to various
platforms and create a " development " cluster group. You also ensured every cluster is enabled for Palette Virtual
Cluster by selecting the option before deployment. You can now direct your organization members to use app mode and
create Palette Virtual Clusters as needed, or you can create virtual clusters ahead of time for them. The organization
members or downstream consumers can now focus on creating app profiles and deploying their applications. You have
essentially enabled a Kubernetes PaaS experience for your organization.

As the consumer of app mode, you simply focus on deploying your application to a Kubernetes cluster by specifying the
app profile. The overhead of managing infrastructure has essentially been removed for you, thus freeing up your time to
focus on what matters the most, developing an application that solves business problems.

### How to Access Each Mode?

You can quickly toggle between **App Mode** and **Cluster Mode** by navigating to the **User Menu** at top right and
selecting the mode you want.

### App Mode or Cluster Mode?

You might ask yourself, "How do I know which mode I should use?” The answer comes down to your objective.

- Choose cluster mode if you want to enable Kubernetes capabilities for others or configure Palette. Cluster mode,
  provides all the configuration options a power user wants.
- Choose app mode if you want to simply deploy an application using Kubernetes without the infrastructure overhead. If
  you want to simply try out Palette, app mode is a good starting point.

App Mode may not meet your needs if your application requires a lot of resources. The Palette-managed cluster group,
called Beehive, imposes a resource limitation that could prevent a resource-heavy application from launching
successfully. Review the [Resource Quota](../devx/manage-dev-engine/resource-quota.md) documentation to understand App
Mode limits. If you already have Palette-managed Kubernetes host clusters deployed or available to you as a cluster
group with Palette Virtual Clusters enabled, then leveraging App Mode is a great fit so you can focus on the developer
experience aspect.

Below are some of the characteristics of each mode. Use this to help you better understand the differences between the
two modes.

- App Mode

  - Optimized for the developer experience
  - You’re a builder that is not part of an organization and needs quick access to a Kubernetes cluster
  - Expose a PaaS-like experience to organizational members by leveraging Palette-managed Kubernetes clusters
  - Deploy applications without worrying about Kubernetes infrastructure
  - Scope of concerns limited to app profiles

- Cluster Mode
  - Optimized for power users and those that are comfortable with deploying Kubernetes clusters
  - Used to deploy host clusters to different platforms (VMware, AWS, GCP, Azure, etc)
  - Deploy Edge clusters
  - Create cluster groups
  - Create cluster profiles
  - Create projects, workspaces, teams,
  - Leverage specialized hardware for Kubernetes workload
  - Audit logging
  - Enable cloud providers and other platforms
  - Configure registries

## Next Steps

Get started with [Palette](https://console.spectrocloud.com/) today and deploy an application though [app mode](/devx).
Or create a Kubernetes cluster on your favorite platform and let Palette handle the challenges of maintaining Kubernetes
clusters by leveraging cluster mode and [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md).
