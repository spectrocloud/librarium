---
title: "ABCCD"
metaTitle: "Spectrocloud Concepts"
metaDescription: "Most important concepts of Spectro Cloud"
icon: ""
---

# What is Spectro Cloud? (and concepts)

## Overview and Architecture

Spectro Cloud's SaaS based product brings the managed Kubernetes experience to users' own unique enterprise. Kubernetes stacks running in any publi clod, private cloud, or bare-metal environments, allowing users to not have to trade-off between ease of use and control. Spectro Cloud provides an as-a-service experience to users by automating the deployment, management and maintenance of multiple Kubernetes clusters based on user-defined Kubernetes stacks.

Spectro Cloud consists of three main pieces:
    - the SaaS management component,
    - a Registry and Repository, and
    - the managed clusters themselves.
    
Registries and repositories can be Spectro Cloud managed or hosted by users themselves. Repositories host Kubernetes infrastructure stack components and versions.

The Spectro Cloud SaaS component is the "multi tenant nerve centre" of Spectro Cloud deployments. This component is a cloud based offer that provides central visibility and management of Spectro Cloud Kubernetes deployments. It provides a single pane of glass for users to define composable Kubernetes cluster profile templates, deploy and manage Kubernetes clusters with full visibility in multi-cloud environments, as well as manage the governance policies to control who can do what, when and where.<br /><br />

A Spectro Cloud managed Kubernetes cluster contains two main pieces - the Kubernetes tenant cluster, as well as a Spectro Cloud Management Agent. The Spectro Cloud Management Agent is responsible for:
    - Communicating with the SaaS platform for heartbeat, cluster status and system metrics
    - Taking commands from the SaaS platform for checking cluster desired state changes and updating cluster to conform with the desired state, and
    - Establishing an optional on-demand secured tunnel to allow the SaaS platform access to the Kubernetes API server via a cloud shell.

<br />

<br />

## Organization

Spectro Cloud is a multi-tenant SaaS platform. Each customer is a *tenant* on the platform. Tenants are isolated from one another.

Each tenant has some number of *users* and *projects.* Users are members of the tenant organization, each with their own login accounts. Users can be members of one or more *teams*, a convenient structure for consistent management of users as a group.

A project is a grouping of resoures that are a part of a logical application. A project may be shared amongst multiple users or teams.

<br />

<br />