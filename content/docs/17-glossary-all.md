---
title: "Glossary"
metaTitle: "Palette Glossary"
metaDescription: "Palette Glossary"
icon: "about"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Glossary

This page gives a quick reference to various object types and concepts within the Palette platform.
## App Mode
A mode optimized for a simpler and streamlined developer experience that allows you to focus on the building, maintenance, testing, deployment, and monitoring of your applications. App Mode removes the need to worry about the infrastructure management of a Kubernetes cluster and results in a PaaS-like experience, enabling you to focus on deploying [App Profiles](#app-profile), Apps, and [Palette Virtual Clusters](#palette-virtual-cluster).


## App Profile
App Profiles are templates created with preconfigured services required for Palette Virtual Clusters deployment. The App Profile allow creators to integrate various services or tiers, required to run an application, such as cache, databases, and more into a single deliverable. App Profiles provide a way to drive consistency across virtual clusters. You can create as many profiles as required, with multiple tiers serving different functionalities per use case.

## Air-Gapped

Palette on-prem installation supports Air-Gapped, a security measure in which its management platform is installed on VMware environments with no direct or indirect connectivity to any other devices or networks of the outside world. This feature provides airtight security to the platform without the risk of compromise or disaster. In addition, it ensures the total isolation of a given system from other networks, especially those that are not secure.
## Attach Manifests

For integrations and add-ons orchestrated via Palette [Packs](#pack) or [Charts](#helm-charts), at times it is required to provide additional Kubernetes resources to complete the installation. Resources like additional secrets or Custom Resource Definitions may need to be installed for the integration or add-on to function correctly. Attach Manifests are additional raw manifests attached to a cluster profile layer built using a Palette Pack or a Chart. Multiple Attach Manifests can be added to a layer in a cluster profile.

## Bring Your Own Operating System (BYOOS)

A feature in Palette that allows you to bring your own operating system and use it with your Kubernetes clusters. With the BYOOS pack, you can reference your own OS images, configure the necessary drivers, and customize the OS to meet your specific requirements. BYOOS gives you greater flexibility, control, and customization options when it comes to managing your Kubernetes clusters. It is especially useful for enterprises and organizations with strict requirements around security, compliance, or specific hardware configurations.

## Chart Repositories

Chart Repositories are web servers, either public or private, that host Helm Charts. By default, Palette includes several popular chart registries such as Bitnami. As an administrator, you can add additional public or private chart repositories to leverage charts from those sources. This feature provides greater flexibility in managing and deploying applications, allowing you to access and use Helm Charts from various sources in your Palette environment
## Cloud Account

Cloud Accounts are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources. Cloud account information is treated as sensitive data and fully encrypted using the tenant's unique encryption key.

## Cluster Mode
Cluster Mode enables you to create, deploy, and manage Kubernetes clusters and applications. In Cluster Mode, you can deploy Kubernetes clusters to public cloud providers, on-prem data centers, and on the edge. 

## Cluster Profile

A Cluster Profile is a declarative model of a Kubernetes infrastructure stack. A Kubernetes infrastructure stack is broken into multiple layers, from core layers like base OS, Kubernetes, storage, network, to additional add-on layers such as load balancer, ingress controller, logging, monitoring, security, etc. For each layer, Palette provides multiple out-of-the-box options and versions. The cluster profile is essentially a configuration of end-to-end Kubernetes stacks and settings that you create based on your needs, which you can reuse every time you need to deploy a cluster matching that configuration. For example, let us say for AI/ML you need a cluster with a base OS with an NVIDIA driver installed and Kubeflow installed in the cluster, but for a production cluster, you need a different stack with Logging (EFK), Monitoring (Prometheus), Security (Twistlock) pre-installed.

The diagram below shows an example of a cluster profile:

![cluster_profile_new](/cluster_profile_new.png)

Read more about Cluster Profiles [here](/cluster-profiles).
## Edge Appliances

Palette supports several kinds of appliances for the Edge deployment. These appliances can be registered with the Palette Management Console and used for provisioning a Virtualized or a Native OS (Native Edge Deployment). The following is the list of all the Palette supported Edge appliance types:

  | **Appliance Type**              | **Environment**                           |
  | :------------------------------ | :---------------------------------------- |
  | Native Edge Deployment          | Bare Metal Machines or Virtual Appliances |
  | Bare Metal Machine              | Virtualized                               |
  | KVM-based virtual machines      | Virtualized                               |

**Note:** Palette Edge Manager & TUI would be embedded in P6OS.
## Edge Clusters

Edge Clusters are Kubernetes clusters set up on appliances installed in isolated locations such as hospitals, grocery stores, restaurants, etc., unlike a data center or cloud environment. These appliances can be bare metal machines or virtual machines and are managed by operators at these remote sites. Palette provides the provisioning of Workload Clusters on such edge appliances from its SaaS-based management console. Besides provisioning of the cluster, Palette also provides end-to-end management of these clusters through operations such as scaling, upgrades, reconfiguration, etc.
## Helm Charts

Helm Charts are Kubernetes YAML manifests that describe a related set of Kubernetes resources into a single package. Just like Palette's native Packs, Palette supports and orchestrates helm charts hosted in any public or private Helm chart registry on to Kubernetes clusters.

## Host Cluster

A Kubernetes cluster that is managed by Palette. A host cluster may contain several Palette Virtual Clusters.
## Management Clusters

Management Cluster is where Palette core components are hosted and are often referred to in on-prem installations of Palette.  As part of the Kubernetes workload cluster provisioning, the first control-plane node is launched by Palette in the management cluster or the cloud gateway. Once the first control-plane node goes to running state, all the resources are pivoted from the management cluster or the cloud gateway to the target workload cluster. After that, the target cluster self-manages the cluster and application lifecycle. All Day-2 operations which result in node changes, including OS/Kubernetes upgrades, scaling, and nodes certificate rotation, are triggered by changes to the Cluster API resources in the target workload cluster.
## OIDC
 
OpenID Connect [(OIDC)](/user-management/saml-sso/#oidcbasedsso) is an open source, authentication protocol that allows users to verify their identity, based on the authentication performed by an authorization provider.
## Organization 

An organization is the equivalent of a Tenant. Review the [Tenant](#tenant) definition to learn more.
## Pack

Palette provides multiple integrations/technologies in a [cluster profile](#cluster-profile) for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These integrations are provided in the form of Packs. A pack is a Palette content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artifacts required to deploy and manage that integration. Palette provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage as well as packs for add-on layers such as ELK Stack, Prometheus, Sysdig Falco, etc.

## Pack Manifests

Layers in a [cluster profile](#cluster-profile) are typically built using a Palette [Pack](#pack) or a [Charts](#helm-charts). There may be certain scenarios where additional Kubernetes resources need to be provisioned that are not part of any Palette pack or a chart. Pack manifests provide a pass-through mechanism to allow provisioning through raw manifests. Pack Manifest layers can be added to a cluster profile stack built using Spectro Packs and Charts.
## Palette Edge Manager (Local API)

A cmd line API that supports TUI operations & site diagnostics. For Dark Site or Air Gapped environments Palette Edge Manager can be used to upload cluster configurations.

## Palette eXtended Kubernetes (PXK)

Palette eXtended Kubernetes (PXK) is a customized version of the open-source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette. You have the option to choose other Kubernetes distributions, such as MicroK8s, Konvoy, and more, should you want to consume a different Kubernetes distribution. 

PXK is different from the upstream open-source Kubernetes version primarily because of the carefully reviewed and applied hardening of the operating system (OS) and Kubernetes. The hardening ranges from removing unused kernel modules to using an OS configuration that follows industry best practices. Our custom Kubernetes configuration addresses common Kubernetes deployment security pitfalls and implements industry best practices.

A benefit of Palette when used with PXK is the ability to apply different flavors of container storage interface (CSI) plugins and container network interface (CNI) plugins.
Other open-source Kubernetes distributions, such as MicroK8s, RKE2, and K3s, come with a default CSI and CNI. Additional complexity and overhead are required from you to enable different interfaces. PXK supports the ability to select other interface plugins out of the box without any additional overhead or complexity needed from your side.  

There are no changes to the Kubernetes source code and we also follow the same versioning schema as the upstream open-source Kubernetes distribution.

## Palette eXtended Kubernetes Edge (PXK-E)

Palette eXtended Kubernetes Edge (PXK-E) is a customized version of the open-source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes distribution is customized and optimized for edge computing environments and can be deployed through Palette. PXK-E is the Kubernetes distribution Palette defaults to when deploying Edge clusters. 


PXK-E differs from the upstream open-source Kubernetes version by optimizing for operations in an edge computing environment. PXK-E also differentiates itself by using the open-source project, [Kairos](https://kairos.io/) as the base operating system (OS). PXK-E’s use of Kairos means the OS is immutable, which significantly improves the security posture and reduces potential attack surfaces. 

Another differentiator of PXK-E is the carefully reviewed and applied hardening of the OS and Kubernetes. The hardening ranges from removing unused OS kernel modules to using an OS configuration that follows industry best practices. Our custom Kubernetes configuration addresses common deployment security pitfalls and implements industry best practices.

With PXK-E, you can manage automatic OS upgrades while retaining immutability and the flexibility to roll out changes safely. The A/B partition architecture of Kairos allows for new OS and dependency versions to be installed in a separate partition and mounted at runtime. You can fall back to use the previous partition if issues are identified in the new partition.

PXK-E manages the underlying OS and the Kubernetes layer together, which reduces the challenge of upgrading and maintaining two separate components. 

PXK-E allows you to apply different flavors of container storage interfaces (CSI) and container network interfaces (CNI). Other open-source Kubernetes distributions such as MicroK8s, RKE2, and K3s come with a default CSI and CNI. There is additional complexity and overhead when you want to consume different interface plugins with traditional Kubernetes distributions. Using PXK-E, you select the interface plugin you want to apply without additional overhead and complexity.

There  are no changes to the Kubernetes source code used in PXK-E, and it follows the same versioning schema as the upstream open-source Kubernetes distribution.

## Palette Orchestrator
Palette orchestrator supports deploying the clusters as per the specifications desired and modeled in Palette UI. Furthermore, it supports the cluster version upgrades as per the user requirements. The Palette orchestrator also aids in recycling the certificates of the clusters, node health checks, and recycling unhealthy nodes.
## PaletteOS (P6OS)

PaletteOS is a real-time operating system provisioned by Palette. It is embedded with a base Operating System such as Ubuntu, K3OS, etc., and one of the Kubernetes distributions such as CNCF (Cloud Native Computing Foundation), K3s (a Lightweight Kubernetes Distribution), or RKE (Rancher Kubernetes Engine). Palette builds several of these based on the most desired versions of the base operating system and Kubernetes distribution.

**Examples**: (Ubuntu20.0.4+CNCFK8s1.21.3, SLES+K3S). We also encourage our customers to build their own Operating system.
## Palette Upgrade Controller

A Kubernetes controller to be installed into the workload cluster to facilitate upgrades to new P6OS image.

## Palette Virtual Cluster
Palette Virtual Clusters enable operations teams to partition a [host cluster](#host-cluster) and deploy lightweight virtual clusters on top, similar to how virtualization creates logically isolated virtual servers on top of physical machines. This is great for giving developers quick access to a sandbox environment for testing their code. Virtual clusters provide as strong a level of separation without introducing complicated overhead, such as separating physical resources and managing namespaces with complex RBAC configurations. Palette Virtual Clusters is powered by [vCluster](https://www.vcluster.com/). 

## Permissions

Permissions are associated with specific actions within the platform such as Create New user in a tenant, Add a Cluster Profile in a project, View Clusters within a cluster, etc. Permissions are granted to the [users](#user) and [teams](#team) through [roles](#role).
## Presets

Presets are a subset of properties configured for a layer that is pre-configured with defaults to easily enable or turn on a feature. Palette [packs](#pack) and [charts](#helm-charts) provide several settings that can be customized by the user. Although customizable typically in a YAML format, it can be cumbersome to look through a flat list of properties and identify the ones to change for specific functionality. Through presets, Palette groups a bunch of related properties that control a feature and provides them as named presets. During construction of a [cluster profile](#cluster-profile), users may be simply enabled or disable a preset to quickly make the desired changes.

## Private Cloud Gateway

A Private Cloud Gateway is a Palette component that enables the communication between Palette's management console and a private cloud/data center. The gateway needs to be installed by the users in their private cloud environments using a private cloud gateway installer appliance.
## Private Cloud Gateway-Edge (PCG-E)

Deploying Edge Clusters requires a Private Cloud Gateway-Edge (PCG-E) to be installed on the appliances for Palette to discover the appliance and provision workload clusters on them. A PCG-E is Palette's on-premises component to support remote Edge devices. Palette PCG-E, once installed on-premises, registers itself with the Palette's SaaS portal and enables secure communications between the SaaS portal and the Edge Clusters.
## Private Pack Registry

Palette provides extensibility by providing a way for users to define [packs](#pack) for integrations beyond the ones provided by default in Palette's public pack registry. These user-defined packs need to be hosted in a private registry, which users can bring up in their environment using Palette's pack registry software.
## Project

Projects provide a way for grouping clusters together for logical separation. Role-based access controls within Palette are applied at the project level. [Users](#user) and [teams](#team) can be assigned one or more [roles](#role) within a project for granular control over [permissions](#permission) within the project scope.
## Public Pack Registry

Palette maintains a public pack registry containing various [packs](#pack) that can be used in any [cluster profile](#cluster-profile). The pack content in this registry is constantly updated with new integrations.
## Role

A Role is a collection of [permissions](#permission). There are two kinds of roles in Palette: *tenant roles* and *project roles*. *Tenant roles* are a collection of tenant-level permissions such as create a new user, add a new project, etc. *Project roles* consist of permissions for various actions within the scope of a project such as create a cluster profile, create a cluster, etc.
## Site Configuration Text User Interface (TUI)

TUI is initially used as an interface to site operator to provide site-specific settings such as NW Settings (Static IP, DHCP, WAN, GW, Proxy), Palette endpoint, and Device ID override. It can accept inputs from the unattended.yaml file.
## Spectro Agent
Spectro Agent bridges the information transfer between Palette SaaS and Palette Orchestrator. The Spectro Agent collects information such as metrics, workloads, and heartbeats and constantly updates to the SaaS platform for user access. In addition to this, the Spectro Agent is responsible for initiating and controlling Backup, OS-Patch, and Compliance Scan on the running cluster.

## System Console (On-prem System Console)
The console is used to scale up the Enterprise cluster and manage it. The System console supports creating and activating a new tenant in a new instance. It Initiates the installation of a Palette Enterprise Cluster. The On-Prem System Console provides various administrative setup tasks. Most of these are optional and can be performed at any time. To quickly start using the platform's functionality, all that is needed is to create the first tenant and activate it.Initial login:admin/admin.
## System Profiles
System Profiles provide a way to bootstrap an edge appliance with an initial set of virtual and containerized applications. Similar to cluster profiles, System Profiles are templates created using one or more layers that are based on packs or helm charts.
## Team
A Team is a group of [users](#user). Users can be part of one or more teams. Teams provide a convenient way to control platform access for a group of users. [Roles](#role) assigned to a team grant associated tenant or [project](#project) [permissions](#permission) to all users that are part of the team.
## Tenant

Tenant represents a customer or an organization in Palette. Palette is a multi-tenant platform. All tenant resources are isolated from other tenants. Each tenant has a unique encryption key to encrypt any sensitive data such as cloud credentials and tenant user information. [Users](#user) from a tenant do not have access to resources in another tenant.
## User

Users are members of a [tenant](#tenant) who are assigned [roles](#role) that control their access within the platform. For example, users with the tenant admin role get permissions to perform all actions across all [projects](#project) in the tenant whereas users assigned project roles, only get specific permission within the associated projects. The user's personal information (email, name) is treated as sensitive data and fully encrypted using the tenant's unique encryption key.
## Workload
An application running on the Kubernetes cluster is called a Workload. It can be a set of components that work together or a single independent component, run as a set of pods. In Kubernetes terms, a Pod is a set of running containers on your cluster.
## Workload Cluster

Workload / Tenant / Application Clusters are a collection of master and worker nodes that cooperate to execute container application workloads. Kubernetes clusters provisioned by users are referred to as Workload Clusters. These clusters are created within [projects](#project) and they are provisioned and managed in the user's cloud environment. Each cluster is provisioned from a [Cluster Profile](#cluster-profile) with additional configuration overrides and cloud-specific settings.
## Workspace

The multi-cluster management and governance capabilities are supervised with Palette Workspaces. Workspaces enable the logical grouping of clusters and namespaces to provide application or team-specific governance and visibility into workloads, cost, and usage metrics. For example, the application or team workload may be deployed into namespaces across clusters for achieving High Availability (HA), Disaster Recovery (DR), organization-specific placement policies, etc. Grouping the namespaces and clusters into a workspace provide central management and governance in a multi-cluster distributed environment.