---
title: "Concept Overviews"
metaTitle: "Spectrocloud Concepts"
metaDescription: "Most important concepts of Spectro Cloud"
icon: ""
---

# Concept Overviews

## Tenant

Every user is added into the Spectro Cloud platform as  a "tenant." Visualising an actual building with multiple floors where each floor hosts a tenant might help. The floors are accessible only to the respective tenants, making it highly secure. Spectro Cloud ensures a high level of security to prevent breaches.

## Projects

Sticking with the building analogy, a tenant is free to create as many rooms as needed within their space. Each room has a specific need. Similarly, each tenant can create as many projects as needed, providing a logical separation between each of them. This is because each project is created for a specific purpose.

## User

A user is anyone with access to the tenant area/s. Again, just as an occupant of the building can move about within the tenant's space, a user can be created on Spectro Cloud to have access to multiple areas. And just as an occupant can be given access to a particular room (or prevented access from it) a user can be given access to one or more projects, with one or more permissions being granted. More on this in later pages.

## Cluster Profiles

Cluster profiles are easily one of the most important features of the Spectro Cloud platform. Cluster profiles are what you create to preconfigure the components of your cluster to enable an easier and faster deployment. It is essentially a configuration that you create based on your needs, which you can recall every time you need to deploy a cluster matching that configuration. For example, let us say for your testing requirements, you have to have a setup with a load balancer and some monitoring. But your DevOps teams need an auth layer more than the other two. So you create a cluster profile for each of them.

## Cloud Accounts

If you have had to handle more than one cloud account, you know how much of a chore it is to have a look-see on multiple dashboards. They look different and work differently. Spectro Cloud's dashboard brings in all of your cloud accounts - public and private - into one place and simplifies managing your accounts. In combination with the cluster profile management, you won't have to move away from Spectro Cloud into your cloud service providers dashboards.

## Pack Registry - public and private

Spectro Cloud provides multiple configuration options in a cluster profile for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These configuration options are provided in the form of _Packs._ A pack is a Spectro Cloud content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artefacts required to deploy and manage that integration. For example, Spectro Cloud provides packs for ELK Stack, Prometheus, Sysdig Falco etc. Besides these integrations, Spectro Cloud also provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage. Spectro Cloud maintains a public registry containing various packs that can be used in any cluster profile. The pack content in this registry is constantly updated with new integrations. Optionally, a customer can host their own Private Pack Registry.

### Pack Content

A pack is a zip archive that consists of a manifest file called `pack.json` that describes the pack and additional components such as Helm charts, manifests and Ansible roles.

### Private Pack Registry

Spectro Cloud provides the ability to extend the capabilities of the platform. Additional pack registries can be set up with customized packs and synchronized with the Spectro Cloud SaaS, enabling clusters to be built using additional or more customized integrations beyond what's available out of the box. For private cloud environments such as VMWare, a private pack registry is automatically installed and configured with Specto Cloud’s SaaS.

## Private Cloud Accounts

**Pending**
