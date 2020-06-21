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

Every user is added into the Spectro Cloud platform as  a "tenant." Visualizing an actual building with multiple floors where each floor hosts a tenant might help. The floors are accessible only to the respective tenants, making it highly secure. Spectro Cloud ensures a high level of security to prevent breaches.

# Projects

Sticking with the building analogy, a tenant is free to create as many rooms as needed within their space. Each room has a specific need. Similarly, each tenant can create as many projects as needed, providing a logical separation between each of them. This is because each project is created for a specific purpose.

# User

A user is anyone with access to the tenant area/s. Again, just as an occupant of the building can move about within the tenant's space, a user can be created on Spectro Cloud to have access to multiple areas. And just as an occupant can be given access to a particular room (or prevented access from it) a user can be given access to one or more projects, with one or more permissions being granted. More on this in later pages.

# Clusters

Kubernetes clusters are collections of master and worker nodes that cooperate to execute workloads.

Within a project, *Clusters* are where you provision and manage Kubernetes clusters. The clusters are provisioned and managed in your own cloud account environment. Each cluster is provisioned from a template called a 'cluster profile'.

# Cluster Profiles

Cluster profiles are easily one of the most important features of the Spectro Cloud platform. Cluster profiles are a declarative model of a Kubernetes infrastructure stack; they are what you create to preconfigure the components of your cluster to enable an easier and faster deployment. It is essentially a configuration that you create based on your needs, which you can recall every time you need to deploy a cluster matching that configuration. For example, let us say for your testing requirements, you have to have a setup with a load balancer and some monitoring. But your DevOps teams need an auth layer more than the other two. So you create a cluster profile for each of them. The following image helps visualize this concept.

![cluster_profile](/cluster_profile.png)

# Cloud Accounts

If you have had to handle more than one cloud account, you know how much of a chore it is to have a look-see on multiple consoles. They look different and work differently. Spectro Cloud's console brings in all of your cloud accounts - public and private - into one place and simplifies managing your accounts. In combination with the cluster profile management, you won't have to move away from Spectro Cloud into your cloud service providers consoles.

# Pack Registry - public and private

Spectro Cloud provides multiple configuration options in a cluster profile for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These configuration options are provided in the form of _Packs._ A pack is a Spectro Cloud content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artefacts required to deploy and manage that integration. For example, Spectro Cloud provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage. Besides these integrations, Spectro Cloud also provides packs for ELK Stack, Prometheus, Sysdig Falco etc. Spectro Cloud maintains a public registry containing various packs that can be used in any cluster profile. The pack content in this registry is constantly updated with new integrations. Optionally, a customer can host their own Private Pack Registry.

## Pack Content

A pack is a zip archive that consists of a manifest file called `pack.json` that describes the pack and additional components such as Helm charts, manifests and Ansible roles.

## Private Pack Registry

Spectro Cloud provides the ability to extend the capabilities of the platform. Additional pack registries can be set up with customized packs and synchronized with the Spectro Cloud SaaS, enabling clusters to be built using additional or more customized integrations beyond what's available out of the box. For private cloud environments such as VMWare, a private pack registry is automatically installed and configured with Specto Cloud’s SaaS.

# Private Cloud Accounts

## Private Cloud Support

Spectro Cloud supports end to end lifecycle and management of Kubernetes Clusters in private cloud environments. Private cloud deployments look different from public cloud ones due to the need for a Spectro Cloud Gateway, an on-prem component to serve as a bridge to the Spectro Cloud SaaS.

The following sections describe various aspects pertaining to support for private cloud environments.

### Spectro Cloud Gateway

Spectro Cloud Gateway is Spectro Cloud's on-prem component to enable support for isolated private datacentre environments. The Spectro Cloud Gateway, once installed on-prem, registers itself with the Spectro Cloud's SaaS portal and enables secure communication between the SaaS portal and private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Spectro Cloud's SaaS portal.

The Spectro Cloud Gateway is itself a multi-node Kubernetes cluster, which is installed and set up from the Spectro Cloud SaaS portal like any other Kubernetes cluster managed by Spectro Cloud. This ensures serviceability and lifecycle management of this component that facilitates the installation of the Spectro Cloud Gateway. Once the gateway is installed, the Spectro Cloud Gateway installer VM can be safely powered down and deleted. Installation and configuration of the gateway involve actions on both the SaaS portal as well as the vSphere environment.

### Architectural Highlights

- Spectro Cloud Gateway provides secure access into a private cloud environment from SaaS portal
- The Gateway watches for new cluster creation and deletion requests originating from the SaaS portal and bootstraps the process
- The Gateway makes relevant vSphere API calls for various orchestration tasks.
- Gateways are authenticated via a pairing code generated on the SaaS portal. The initial handshake after the authentication involves the exchange of keys to enable secure communication over an encrypted TLS channel.

### Gateway Cloud Account

A new vSphere cloud account is auto-created using the vSphere credentials provided during the Gateway configuration. This account is used to retrieve the infrastructure properties like Datacenter names, Folder names, Network names, etc. This account is shared with all projects in this tenant for convenience so that it can be used for orchestrationn of tenant clusters. As of now, this is the default behaviour and there is no option to prevent this account from being shared.

### Private Cloud Private Pack Registry

An instance of the Spectro Cloud Pack registry is installed on the Spectro Cloud Gateway by default, and Spectro Cloud's SaaS portal is configured to regularly synchronize content with this registry. This registry can be used to host customized packs for operating systems, Kubernetes and other integrations that may not be available on Spectro Cloud's public registry by default. Packs from this registry can be combined with those from Spectro Cloud's public registry when constructing Cluster profiles. Spectro Cloud provides a simple CLI tool to manage pack content in this registry.
