---
title: "Concept Overviews"
metaTitle: "Spectrocloud Concepts"
metaDescription: "Most important concepts of Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Concept Overviews

This page gives a quick introduction to various concepts that constitute the unique selling proposition of Spectro Cloud.

# Tenant

Tenant represents a customer or an organization in Spectro Cloud. Spectro Cloud is a multi-tenant platform. All tenant resources are isolated from other tenants. Users from a tenant do not  have access to resources in another tenant.

# Project

Projects provide a way for grouping clusters together for logical separation. Role-based access controls within Spectro Cloud are applied at the project level. Users and teams can be assigned one or more roles within a project for granular control over permissions within the project scope.

# Users

Users are members of a tenant who are assigned roles that control their access within the platform. For example, users with the tenant admin role get permissions to perform all actions across all projects in the tenant whereas users assigned project roles, only get specific permission within the associated projects.

# Team

A Team is a group of users. Users can be part of one or more teams. Teams provide a convenient way to control platform access for a group of users. Roles assigned to a team grant associated tenant or project permissions to all users that are part of the team.

# Roles

A Role is a collection of permissions. There are two kinds of roles in Spectro Cloud: tenant roles and project roles. Tenant roles are a collection of tenant-level permissions such as Create a new user, add a new project, etc. Project roles consist of permissions for various actions within the scope of a project such as create a cluster profile, create a cluster,  etc.

# Permission

Permissions are associated with specific actions within the platform such as Create New user in a tenant, Add a Cluster Profile in a project, View Clusters within a cluster, etc. Permissions are granted to the users and teams through roles.

# Cluster Profile

A cluster profile is a declarative model of a Kubernetes infrastructure stack. A Kubernetes infrastructure stack is broken into multiple layers, from core layers like base OS, Kubernetes, storage, network, to additional add-on layers such as load balancer, ingress controller, logging, monitoring, security, etc. For each layer, Spectro Cloud provides multiple out-of-the-box options and versions. The cluster profile is essentially a configuration of end-to-end Kubernetes stacks and settings that you create based on your needs, which you can reuse every time you need to deploy a cluster matching that configuration. For example, let us say for AI/ML you need a cluster with a base OS with an NVIDIA driver installed and Kubeflow installed in the cluster, but for a production cluster, you need a different stack with Logging (EFK), Monitoring (Prometheus), Security (Twistlock) preinstalled.

The diagram below shows an example of a cluster profile:

![cluster_profile_new](/cluster_profile_new.png)

Read more about Cluster Profiles [here](/cluster-profiles).

# Workload Cluster

A Kubernetes cluster is a collection of master and worker nodes that cooperate to execute container application workloads.

Kubernetes clusters provisioned by users are referred to as Workload Clusters. These clusters are created within projects and they are provisioned and managed in the user's cloud environment. Each cluster is provisioned from a *cluster profile* with additional configuration overrides and cloud-specific settings.

# Cloud Account

Cloud Accounts are where access credentials are stored for public and private clouds. It is used by the system to provision new cluster infrastructure and cluster resources.

# Pack

Spectro Cloud provides multiple integrations/technologies in a cluster profile for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These integrations are provided in the form of Packs. A pack is a Spectro Cloud content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artifacts required to deploy and manage that integration. Spectro Cloud provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage as well as packs for add-on layers such as ELK Stack, Prometheus, Sysdig Falco, etc.

# Public Pack Registry

Spectro Cloud maintains a public pack registry containing various packs that can be used in any cluster profile. The pack content in this registry is constantly updated with new integrations.

# Private Pack Registry

Spectro Cloud provides extensibility by providing a way for users to define packs for integrations beyond the ones provided by default in Specto Cloud's public pack registry. These user-defined packs need to be hosted in a private registry which users can bring up in their own environment using Spectro Cloud's pack registry software.

# Helm Charts

Helm Charts are Kubernetes YAML manifests that describe a related set of Kubernetes resources into a single package. Just like Spectro Cloud's native Packs, Spectro Cloud supports and orchestrates helm charts hosted in any public or private helm chart registry on to Kubernetes clusters. 


# Chart Repositories

Chart Repositories are public or private web servers that host Helm Charts. A few popular chart registries such as Bitnami, are mapped into Spectro Cloud by default. Users may add additional public or private chart repositories as an administration setting to leverage charts from those repositories. 


# Attach Manifests

For integrations and add-ons orchestrated via Spectro Cloud Packs or Charts, at times it is required to provison additional kubernetes resources to complete the installation. Resources like additional secrets, or CRDs may need to be installed for the integration or add-on to function correctly. Attach Manifests are additional raw manifests attached to a cluster profile layer built using a Spectro Cloud Pack or a Chart. Multple attach manifests can be added to a layer in a cluster profile. 


# Pack Manifests

Layers in a cluster profile are typically built using a Spectro Pack or a Chart. There may be certain scenarios where additional kubernetes resources need to be provisioned, that are not part of any Spectro pack or a chart. Pack manifests provide a pass through mechanism to allow provisioning through raw manifests. Pack Manifest layers can be added to a cluster profile stack built using Spectro Packs and Charts. 

# Presets

Presets are a subset of properties configured for a layer which are preconfigured with defaults to easily enable or turn on a feature. Spectro packs and charts provide several settings that can be customized by the user. Although customizable typically in a YAML format, it can be cumbersome to look through a flat list of properties and identify the ones to change for a specific functionality. Through presets, Spectro Clouds groups a bunch of related properties that control a feature and provides them as named presets. During construction of a cluster profile, users maybe simply enable or dispable a preset to quickly make the desired changes. 


# Private Cloud Gateway

A Private Cloud Gateway is a Spectro Cloud component that enables the communication between Spectro Cloud's management console and a VMware based private data center. The gateway needs to be installed by the users in their VMware environments using a private cloud gateway installer appliance.
