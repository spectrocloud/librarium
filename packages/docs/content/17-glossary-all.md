---
title: "Glossary"
metaTitle: "Spectro Cloud Glossary"
metaDescription: "Spectro Cloud Glossary"
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

This page gives a quick reference to various object types and concepts within the Spectro Cloud platform.

## Tenant

Tenant represents a customer or an organization in Spectro Cloud. Spectro Cloud is a multi-tenant platform. All tenant resources are isolated from other tenants. Each tenant has a unique encryption key to encrypt any sensitive data such as cloud credentials and tenant user information. [Users](#user) from a tenant do not have access to resources in another tenant.

## User

Users are members of a [tenant](#tenant) who are assigned [roles](#role) that control their access within the platform. For example, users with the tenant admin role get permissions to perform all actions across all [projects](#project) in the tenant whereas users assigned project roles, only get specific permission within the associated projects. The user's personal information (email, name) is treated as sensitive data and fully encrypted using the tenant's unique encryption key.

## Team

A-Team is a group of [users](#user). Users can be part of one or more teams. Teams provide a convenient way to control platform access for a group of users. [Roles](#role) assigned to a team grant associated tenant or [project](#project) [permissions](#permission) to all users that are part of the team.

## Project

Projects provide a way for grouping clusters together for logical separation. Role-based access controls within Spectro Cloud are applied at the project level. [Users](#user) and [teams](#team) can be assigned one or more [roles](#role) within a project for granular control over [permissions](#permission) within the project scope.

## Role

A Role is a collection of [permissions](#permission). There are two kinds of roles in Spectro Cloud: *tenant roles* and *project roles*. *Tenant roles* are a collection of tenant-level permissions such as create a new user, add a new project, etc. *Project roles* consist of permissions for various actions within the scope of a project such as create a cluster profile, create a cluster,  etc.

## Permission

Permissions are associated with specific actions within the platform such as Create New user in a tenant, Add a Cluster Profile in a project, View Clusters within a cluster, etc. Permissions are granted to the [users](#user) and [teams](#team) through [roles](#role).

## Cluster Profile

A cluster profile is a declarative model of a Kubernetes infrastructure stack. A Kubernetes infrastructure stack is broken into multiple layers, from core layers like base OS, Kubernetes, storage, network, to additional add-on layers such as load balancer, ingress controller, logging, monitoring, security, etc. For each layer, Spectro Cloud provides multiple out-of-the-box options and versions. The cluster profile is essentially a configuration of end-to-end Kubernetes stacks and settings that you create based on your needs, which you can reuse every time you need to deploy a cluster matching that configuration. For example, let us say for AI/ML you need a cluster with a base OS with an NVIDIA driver installed and Kubeflow installed in the cluster, but for a production cluster, you need a different stack with Logging (EFK), Monitoring (Prometheus), Security (Twistlock) pre-installed.

The diagram below shows an example of a cluster profile:

![cluster_profile_new](/cluster_profile_new.png)

Read more about Cluster Profiles [here](/cluster-profiles).

## Workload Cluster

A Kubernetes cluster is a collection of master and worker nodes that cooperate to execute container application workloads.

Kubernetes clusters provisioned by users are referred to as Workload Clusters. These clusters are created within [projects](#project) and they are provisioned and managed in the user's cloud environment. Each cluster is provisioned from a [Cluster Profile](#cluster-profile) with additional configuration overrides and cloud-specific settings.

## Cloud Account

Cloud Accounts are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources. Cloud account information is treated as sensitive data and fully encrypted using the tenant's unique encryption key.

## Pack

Spectro Cloud provides multiple integrations/technologies in a [cluster profile](#cluster-profile) for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These integrations are provided in the form of Packs. A pack is a Spectro Cloud content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artifacts required to deploy and manage that integration. Spectro Cloud provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage as well as packs for add-on layers such as ELK Stack, Prometheus, Sysdig Falco, etc.

## Public Pack Registry

Spectro Cloud maintains a public pack registry containing various [packs](#pack) that can be used in any [cluster profile](#cluster-profile). The pack content in this registry is constantly updated with new integrations.

## Private Pack Registry

Spectro Cloud provides extensibility by providing a way for users to define [packs](#pack) for integrations beyond the ones provided by default in Spectro Cloud's public pack registry. These user-defined packs need to be hosted in a private registry which users can bring up in their environment using Spectro Cloud's pack registry software.

## Helm Charts

Helm Charts are Kubernetes YAML manifests that describe a related set of Kubernetes resources into a single package. Just like Spectro Cloud's native Packs, Spectro Cloud supports and orchestrates helm charts hosted in any public or private helm chart registry on to Kubernetes clusters.


## Chart Repositories

Chart Repositories are public or private web servers that host Helm Charts. A few popular chart registries such as Bitnami, are mapped into Spectro Cloud by default. Users may add additional public or private chart repositories as an administration setting to leverage charts from those repositories.


## Attach Manifests

For integrations and add-ons orchestrated via Spectro Cloud [Packs](#pack) or [Charts](#helm-charts), at times it is required to provide additional Kubernetes resources to complete the installation. Resources like additional secrets, or CRDs may need to be installed for the integration or add-on to function correctly. Attach Manifests are additional raw manifests attached to a cluster profile layer built using a Spectro Cloud Pack or a Chart. Multiple attach manifests can be added to a layer in a cluster profile.


## Pack Manifests

Layers in a [cluster profile](#cluster-profile) are typically built using a Spectro Cloud [Pack](#pack) or a [Charts](#helm-charts). There may be certain scenarios where additional Kubernetes resources need to be provisioned, that are not part of any Spectro Cloud pack or a chart. Pack manifests provide a pass-through mechanism to allow provisioning through raw manifests. Pack Manifest layers can be added to a cluster profile stack built using Spectro Packs and Charts.

## Presets

Presets are a subset of properties configured for a layer that is pre-configured with defaults to easily enable or turn on a feature. Spectro Cloud [packs](#pack) and [charts](#helm-charts) provide several settings that can be customized by the user. Although customizable typically in a YAML format, it can be cumbersome to look through a flat list of properties and identify the ones to change for specific functionality. Through presets, Spectro Cloud groups a bunch of related properties that control a feature and provides them as named presets. During construction of a [cluster profile](#cluster-profile), users may be simply enabled or disable a preset to quickly make the desired changes.


## Private Cloud Gateway

A Private Cloud Gateway is a Spectro Cloud component that enables the communication between Spectro Cloud's management console and a private cloud/data center. The gateway needs to be installed by the users in their private cloud environments using a private cloud gateway installer appliance.
