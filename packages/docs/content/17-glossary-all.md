---
title: "Glossary"
metaTitle: "Palette Glossary"
metaDescription: "Palette Glossary"
icon: "about"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Glossary

This page gives a quick reference to various object types and concepts within the Palette platform.

## Tenant

Tenant represents a customer or an organization in Palette. Palette is a multi-tenant platform. All tenant resources are isolated from other tenants. Each tenant has a unique encryption key to encrypt any sensitive data such as cloud credentials and tenant user information. [Users](#user) from a tenant do not have access to resources in another tenant.

## User

Users are members of a [tenant](#tenant) who are assigned [roles](#role) that control their access within the platform. For example, users with the tenant admin role get permissions to perform all actions across all [projects](#project) in the tenant whereas users assigned project roles, only get specific permission within the associated projects. The user's personal information (email, name) is treated as sensitive data and fully encrypted using the tenant's unique encryption key.

## Team

A Team is a group of [users](#user). Users can be part of one or more teams. Teams provide a convenient way to control platform access for a group of users. [Roles](#role) assigned to a team grant associated tenant or [project](#project) [permissions](#permission) to all users that are part of the team.

## Project

Projects provide a way for grouping clusters together for logical separation. Role-based access controls within Palette are applied at the project level. [Users](#user) and [teams](#team) can be assigned one or more [roles](#role) within a project for granular control over [permissions](#permission) within the project scope.

## Role

A Role is a collection of [permissions](#permission). There are two kinds of roles in Palette: *tenant roles* and *project roles*. *Tenant roles* are a collection of tenant-level permissions such as create a new user, add a new project, etc. *Project roles* consist of permissions for various actions within the scope of a project such as create a cluster profile, create a cluster, etc.

## Permissions

Permissions are associated with specific actions within the platform such as Create New user in a tenant, Add a Cluster Profile in a project, View Clusters within a cluster, etc. Permissions are granted to the [users](#user) and [teams](#team) through [roles](#role).

## Cluster Profile

A Cluster Profile is a declarative model of a Kubernetes infrastructure stack. A Kubernetes infrastructure stack is broken into multiple layers, from core layers like base OS, Kubernetes, storage, network, to additional add-on layers such as load balancer, ingress controller, logging, monitoring, security, etc. For each layer, Palette provides multiple out-of-the-box options and versions. The cluster profile is essentially a configuration of end-to-end Kubernetes stacks and settings that you create based on your needs, which you can reuse every time you need to deploy a cluster matching that configuration. For example, let us say for AI/ML you need a cluster with a base OS with an NVIDIA driver installed and Kubeflow installed in the cluster, but for a production cluster, you need a different stack with Logging (EFK), Monitoring (Prometheus), Security (Twistlock) pre-installed.

The diagram below shows an example of a cluster profile:

![cluster_profile_new](/cluster_profile_new.png)

Read more about Cluster Profiles [here](/cluster-profiles).

## Workload
An application running on the Kubernetes cluster is called a Workload. It can be a set of components that work together or a single independent component, run as a set of pods. In Kubernetes terms, a Pod is a set of running containers on your cluster.

## Workload Cluster

Workload / Tenant / Application Clusters are a collection of master and worker nodes that cooperate to execute container application workloads. Kubernetes clusters provisioned by users are referred to as Workload Clusters. These clusters are created within [projects](#project) and they are provisioned and managed in the user's cloud environment. Each cluster is provisioned from a [Cluster Profile](#cluster-profile) with additional configuration overrides and cloud-specific settings.

## Management Clusters
Management Cluster is where Palette core components are hosted and are often referred to in on-prem installations of Palette.  As part of the Kubernetes workload cluster provisioning, the first control-plane node is launched by Palette in the management cluster or the cloud gateway. Once the first control-plane node goes to running state, all the resources are pivoted from the management cluster or the cloud gateway to the target workload cluster. After that, the target cluster self-manages the cluster and application lifecycle. All Day-2 operations which result in node changes, including OS/Kubernetes upgrades, scaling, and nodes certificate rotation, are triggered by changes to the Cluster API resources in the target workload cluster.

## Cloud Account

Cloud Accounts are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources. Cloud account information is treated as sensitive data and fully encrypted using the tenant's unique encryption key.

## System Console (On-prem System Console)

The console is used to scale up the Enterprise cluster and manage it. The System console supports creating and activating a new tenant in a new instance. It Initiates the installation of a Palette Enterprise Cluster. The On-Prem System Console provides various administrative setup tasks. Most of these are optional and can be performed at any time. To quickly start using the platform's functionality, all that is needed is to create the first tenant and activate it.Initial login:admin/admin.

## Air-Gapped

Palette on-prem installation supports Air-Gapped, a security measure in which its management platform is installed on VMware environments with no direct or indirect connectivity to any other devices or networks of the outside world. This feature provides airtight security to the platform without the risk of compromise or disaster. In addition, it ensures the total isolation of a given system from other networks, especially those that are not secure.

## OIDC
 
OpenID Connect [(OIDC)](/user-management/saml-sso/#oidcbasedsso) is an open source, authentication protocol that allows users to verify their identity, based on the authentication performed by an authorization provider.


## Pack

Palette provides multiple integrations/technologies in a [cluster profile](#cluster-profile) for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These integrations are provided in the form of Packs. A pack is a Palette content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artifacts required to deploy and manage that integration. Palette provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage as well as packs for add-on layers such as ELK Stack, Prometheus, Sysdig Falco, etc.

## Public Pack Registry

Palette maintains a public pack registry containing various [packs](#pack) that can be used in any [cluster profile](#cluster-profile). The pack content in this registry is constantly updated with new integrations.

## Private Pack Registry

Palette provides extensibility by providing a way for users to define [packs](#pack) for integrations beyond the ones provided by default in Palette's public pack registry. These user-defined packs need to be hosted in a private registry, which users can bring up in their environment using Palette's pack registry software.

## Helm Charts

Helm Charts are Kubernetes YAML manifests that describe a related set of Kubernetes resources into a single package. Just like Palette's native Packs, Palette supports and orchestrates helm charts hosted in any public or private Helm chart registry on to Kubernetes clusters.


## Chart Repositories

Chart Repositories are public or private web servers that host Helm Charts. A few popular chart registries, such as Bitnami, are mapped into Palette by default. Users may add additional public or private chart repositories as an administration setting to leverage charts from those repositories.


## Attach Manifests

For integrations and add-ons orchestrated via Palette [Packs](#pack) or [Charts](#helm-charts), at times it is required to provide additional Kubernetes resources to complete the installation. Resources like additional secrets or Custome Resource Definisions may need to be installed for the integration or add-on to function correctly. Attach Manifests are additional raw manifests attached to a cluster profile layer built using a Palette Pack or a Chart. Multiple Attach Manifests can be added to a layer in a cluster profile.


## Pack Manifests

Layers in a [cluster profile](#cluster-profile) are typically built using a Palette [Pack](#pack) or a [Charts](#helm-charts). There may be certain scenarios where additional Kubernetes resources need to be provisioned that are not part of any Palette pack or a chart. Pack manifests provide a pass-through mechanism to allow provisioning through raw manifests. Pack Manifest layers can be added to a cluster profile stack built using Spectro Packs and Charts.

## Presets

Presets are a subset of properties configured for a layer that is pre-configured with defaults to easily enable or turn on a feature. Palette [packs](#pack) and [charts](#helm-charts) provide several settings that can be customized by the user. Although customizable typically in a YAML format, it can be cumbersome to look through a flat list of properties and identify the ones to change for specific functionality. Through presets, Palette groups a bunch of related properties that control a feature and provides them as named presets. During construction of a [cluster profile](#cluster-profile), users may be simply enabled or disable a preset to quickly make the desired changes.


## Private Cloud Gateway

A Private Cloud Gateway is a Palette component that enables the communication between Palette's management console and a private cloud/data center. The gateway needs to be installed by the users in their private cloud environments using a private cloud gateway installer appliance.

## Workspace

The multi-cluster management and governance capabilities are supervised with Palette Workspaces. Workspaces enable the logical grouping of clusters and namespaces to provide application or team-specific governance and visibility into workloads, cost, and usage metrics. For example, the application or team workload may be deployed into namespaces across clusters for achieving High Availability (HA), Disaster Recovery (DR), organization-specific placement policies, etc. Grouping the namespaces and clusters into a workspace provide central management and governance in a multi-cluster distributed environment. 


## Edge Clusters

Edge Clusters are Kubernetes clusters set up on appliances installed in isolated locations such as hospitals, grocery stores, restaurants, etc., unlike a data center or cloud environment. These appliances can be bare metal machines or virtual machines and are managed by operators at these remote sites. Palette provides the provisioning of Workload Clusters on such edge appliances from its SaaS-based management console. Besides provisioning of the cluster, Palette also provides end-to-end management of these clusters through operations such as scaling, upgrades, reconfiguration, etc.

### PCG-E
Deploying Edge clusters requires a Private Cloud Gateway - Edge (PCG-E) to be installed on the appliances for Palette to discover the appliance and provision Workload Clusters on them. PCG-E is similar to Palette [PCG](/glossary-all/#privatecloudgateway).

### System Profiles
System Profiles provide a way to bootstrap an edge appliance with an initial set of virtual and containerized applications. Similar to cluster profiles, System Profiles are templates created using one or more layers that are based on packs or helm charts.



