---
title: "App Mode and Cluster Mode?"
metaTitle: "App Mode and Cluster Mode"
metaDescription: "Learn about the two modes available in Palette and how they benefit your Kubernetes experience."
icon: ""
hideToC: true
fullWidth: false
---

# Palette Modes
Palette supports two different consumption modes, each aimed at different use cases and, potentially, different personas. The two modes available are; App Mode and Cluster Mode.  The two modes are not mutually exclusive and often work together by sharing resources or relying on resources provided by the other. 

![App Mode and Cluster Mode](/docs_introduction_palette-modes.png)

# What is Cluster Mode?

In Cluster mode, you have the ability to provision Kubernetes clusters to various platforms and cloud providers through Palette. Palette will manage and maintain the lifecycle of these Kubernetes clusters. We call a Kubernetes cluster managed and deployed by Palette a Host Cluster. 

Cluster mode is frequently leveraged by personas such as platform engineers, infrastructure engineers, system administrators, and others that are in a role that requires them to support infrastructure. However, other users, such as members of a team, can also leverage cluster mode to deploy a Kubernetes cluster for ad-hoc purposes, such as research efforts. The personas listed previously frequently leverage cluster mode due to the ability to specify where, how, and what attributes should make up the Kubernetes cluster. These operators leverage a concept we call Cluster Profiles.

When you are operating in cluster mode, you have the ability to specify projects to control the scope of the Kubernetes cluster. The ability to specify projects is beneficial when segmenting resources for different teams. For example, a project titled “ml-modeling” could belong to a team focused on machine learning. In the project “modeling,” you could deploy various Kubernetes clusters for the machine learning team to conduct their work. These Kubernetes clusters could also be grouped together (cluster group) if the grouping of like resources is needed.  

Other teams could be prevented from accessing the resources that belong to the project “modeling” by simply not being a member of the project. Palette offers resource-based access control (RBAC) that enables more fine-grained control of resources.  Lastly, you can also view the utilization of resources from the project level, which is helpful when understanding utilization and reviewing costs.

Another important feature of cluster mode is the ability to allow specific host clusters to support Palette Virtual Clusters. Virtual clusters are Kubernetes clusters that run as nested clusters within an existing host cluster. A virtual cluster looks and feels like a normal Kubernetes cluster, except that it resides inside a larger Kubernetes cluster or host cluster often deployed in a cloud provider or on-prem.  You can control the resources a virtual cluster is allocated, such as CPU, memory, and storage. 

Virtual clusters are powerful and beneficial to teams due to their characteristics:
Look and feel exactly like a host cluster
Are up and running within minutes
Removes the infrastructure overhead for downstream consumers
Reduces the need to set up or manage complicated Kubernetes namespaces and roles. Teams can instead receive their own virtual cluster without worrying about permissions or affecting other teams’ resources.

Virtual clusters help reduce development time by allowing downstream consumers to focus more on application development vs. addressing infrastructure overhead. Virtual clusters also have the ability to be paused and resumed which helps significantly in reducing cost. Virtual clusters are heavily leveraged by App Mode as its one of the core concepts that power the mode. 


# What is App Mode?

App Mode is a unique experience enabled by Palette that aims to remove Kubernetes infrastructure overhead as much as possible. In app mode, you, as the consumer, instead focus on creating and managing App Profiles. App profiles are declarative templates that you can use to define all the required services, containers, and databases that make up an application. Once an app profile is defined, you can deploy the application to any Palette Virtual Cluster by specifying the respective app profile.

App mode comes with an out-of-the-box cluster group managed by us here at Spectro Cloud called beehive.  This cluster group, which under the cover is a collection of Kubernetes clusters, is configured to support Palette Virtual Clusters. As a consumer, you can deploy a new virtual cluster to the beehive cluster group and get started with a Kubernetes cluster in minutes. 

The ability to get started with a Kubernetes cluster in minutes is what makes app mode a powerful development tool. You can use the virtual clusters in an ephemeral manner, such as testing, ad-hoc development, or any other scenario where you would want a short-lived Kubernetes environment up and running in minutes.  

Alternatively, you could also use App Mode to offer your own Palette-managed host clusters as a PaaS experience to downstream consumers. This concept is easier explained through an example. Assume you are a system administrator, and you want to expose Kubernetes to various in-house development teams. You could deploy several Kubernetes clusters to various platforms and create a " development " cluster group. You also ensured every cluster is enabled for Palette Virtual Cluster by selecting the option before deployment. You can now direct your organization members to use app mode and create Palette Virtual Clusters as needed, or you can create virtual clusters ahead of time for them. The organization members or downstream consumers can now focus on creating app profiles and deploying their applications. You have essentially, at this point, enabled a Kubernetes PaaS experience for your organization.

This makes App mode unique from Cluster Mode, the ability to leverage an out-of-the-box host cluster group managed by us here at Spectro Cloud, or you can leverage Palette-managed Kubernetes clusters you already have deployed configured to your organization’s standards and expose them as Kubernetes Paas experience. As the consumer of app mode, you simply focus on deploying your application to a Kubernetes cluster by specifying the app profile. The overhead of managing infrastructure has essentially been removed for you, thus freeing up your time to focus on what matters the most, developing an application that solves business problems.   


# How to access each mode? 

You can quickly toggle between the two modes by navigating to your window's top right-hand side corner and expanding the user drop-down menu. Depending on which mode you are in, the name of the other mode will appear in the menu. Example: If you are in cluster mode, your menu will have the option “Switch to App Mode” and vice versa. 
 

# App Mode or Cluster Mode?

You might ask yourself, "How do I know which mode I should use?” The answer to that question comes down to your intent and objective. If you are enabling Kubernetes capabilities for others or configuring Palette, you will want to be in cluster mode. It’s in cluster mode, where you will find all the configuration options that a power user would want. If you are instead focused on consuming Kubernetes and want to simply deploy an application without worrying about the infrastructure overhead, then starting out with app mode is a good starting point. 
 
However, app mode might not meet your needs out of the box as the Spectro Cloud managed cluster group, beehive, imposes a resource limitation that could prevent an application from launching successfully if it is resource-heavy in nature. Review the resource quotas documentation to understand the limits of app mode better.  If you already have Palette-managed Kubernetes host clusters deployed or available to you in the form of a cluster group with Palette Virtual Mode enabled.  Then leveraging app mode is a great fit if you only want to focus on the developer experience aspect.

Below are some of the characteristics of each mode. Use this to help you better understand the differences between the two modes. 

<br />

- App Mode 
    - Optimized for the developer experience
    - You’re a builder that is not part of an organization and needs quick access to a Kubernetes cluster
    - Expose a PaaS-like experience to organizational members by leveraging Palette-managed Kubernetes clusters
    - Deploy applications without worrying about k8s infrastructure
    - Scope of concerns limited to app profiles

<br />

- Cluster Mode
    - Optimized for power users and those that are comfortable with deploying Kubernetes clusters
    - Used to deploy host clusters to different platforms (VMware, AWS, GCP, Azure, etc)
    - Deploy Edge clusters
    - Create cluster groups
    - Create cluster profiles
    - Create projects, workspaces, teams, 
    - Leverage specialized hardware for k8s workload
    - Audit logging
    - Enable cloud providers and other platforms
    - Configure registries


# Next Steps

Get started with [Palette](https://console.spectrocloud.com/) today and deploy an application though [App Mode](/devx). Or create a Kubernetes cluster on your favorite platform and let Palette handle the challenges of maintaining Kubernetes clusters by leveraging Cluster Mode and [Cluster Profiles](/cluster-profiles).