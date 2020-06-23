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

Spectro Cloud is a multi-tenant platform. Every customer or organization is added to Spectro Cloud as a unique tenant. All tenant resources are isolated from other tenants. Users from a tenant do not  have access to resources in another tenant.

# Project

Projects provide a way for grouping clusters together for logical separation. Role based access controls within Spectro Cloud are applied at the project level. Users and teams can be assigned one or more roles within a project for granular control over permissions within the project scope.

# Users

Users are members of a tenant who are assigned roles that control their access within the platform. For example, users with the tenant admin role get permissions to perform all actions across all projects in the tenant where as users assigned project roles, only get specific permission within the associated projects.

# Team

Team is a group of users. Users can be part of one or more teams. Teams provide a convenient way to control platform access for a group of users. Roles assigned to a team grant associated tenant or project permissions to all users that are part of the team.

# Roles

A Role is a collection of permissions. There are two kinds of roles in Spectro Cloud: tenant roles and project roles. Tenant roles are a collection of tenant  level permissions such as Create a new user, add a new project etc. Project roles consist of permissions for various actions within the scope of a project such as create a cluster profile, create a cluster etc.

# Permission

Permissions are associated to specific actions within the platform such as Create New user in a tenant, Add a Cluster Profile in a project, View Clusters within a cluster etc. Permissions are granted to the users through roles.

# Cluster Profile

A Cluster profile is a declarative model of a Kubernetes infrastructure stack. A Kubernetes infrastructure stack is broken into multiple layers, from core layers like base OS, Kubernetes, storage, network, to additional add-on layers such as load balancer, ingress controller, logging, monitoring, security, etc. For each layer, Spectro Cloud provides multiple out-of-the-box options and versions - but users can bring their own implementations and content. The cluster profile is essentially a configuration of end-to-end Kubernetes stacks and settings that you create based on your needs, which you can reuse every time you need to deploy a cluster matching that configuration. For example, let us say for AI/ML you need a cluster with a base OS with an NVIDIA driver installed and Kubeflow installed in the cluster, but for a production cluster you need a different stack with logging (EFK), monitoring (Prometheus), security (Twistlock) preinstalled. 

The diagram below shows an example of a cluster profile:

![cluster_profile_new](/cluster_profile_new.png)

# Cluster

A Kubernetes cluster is collections of master and worker nodes that cooperate to execute container application workloads.

Within Spectro Cloud, *Clusters* are where you provision and manage Kubernetes clusters. The clusters are created within projects and they are provisioned and managed in your own cloud account environment. Each cluster is provisioned from a *Cluster Profile* with additional configuration overrides and cloud specific settings.

# Cloud Account

Cloud Accounts are where access credentials are stored for public and private clouds. It is used by the system to provision new cluster infrastructure and cluster resources.

# Pack

Spectro Cloud provides multiple configuration options in a cluster profile for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These configuration options are provided in the form of Packs. A pack is a Spectro Cloud content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artifacts required to deploy and manage that integration. For example, Spectro Cloud provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage. Besides these integrations, Spectro Cloud also provides packs for ELK Stack, Prometheus, Sysdig Falco etc.

A pack is a zip archive that consists of a manifest file called pack.json that describes the pack and additional components such as Helm charts, manifests and Ansible roles.

# Public Registry

Spectro Cloud maintains a public registry containing various packs that can be used in any cluster profile. The pack content in this registry is constantly updated with new integrations.

# Private Registry

Spectro Cloud provides extensibility by providing a way for users to define packs for integrations beyond the ones provided by default tin Specto Cloud's public registry. These user defined packs need to be hosted in a private registry which users can bring up in their own environment using Spectro Cloud's registry software.

# Private Cloud Gateway

A Private Cloud Gateway is a Spectro Cloud component that enables communication between Spectro Cloud's tenant console and a VMware based private data center. The gateway needs to be installed by the users in their VMware environments using a private cloud gateway installer appliance.
