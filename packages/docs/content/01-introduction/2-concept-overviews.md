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

Every customer or organization is added into the Spectro Cloud platform as  a "tenant." Tenants are isolated from one another.

# Project

A project is a group of Clusters for logic separation. A project may be shared amongst multiple users or teams, and in the future may have quota limit, logical namespace and other constructs among the clusters within a project.

# User and Team

Users are members of the tenant organization. Users can be members of one or more teams, a convenient structure for consistent management of users as a group. 

# Role and Permission

Role is a collection of permissions. Role can be assigned to a user or team so that the user or a team member can perform actions based on role's allowed permissions.

# Cluster Profile

Cluster profiles are one of the most important features of the Spectro Cloud platform. Cluster profile is a declarative model of a Kubernetes infrastructure stack. A Kubernetes infrastructure stack is broken into multiple layers, from core layers like base OS, Kubernetes, storage, network, to additional add-on layers such as load balancer, ingress controller, logging, monitoring, security, etc. For each layer, Spectro Cloud provides multiple out-of-the-box options and versions - but users can bring their own implementations and content. The cluster profile is essentially a configuration of end-to-end Kubernetes stacks and settings that you create based on your needs, which you can reuse every time you need to deploy a cluster matching that configuration. For example, let us say for AI/ML you need a  cluster with a base OS with NVIDIA driver installed and Kubeflow installed in the cluster, but for a production cluster you need a different stack with logging (EFK), monitoring (Prometheus), security (Twistlock) preinstalled. 

The diagram below shows an example of cluster profile:

![cluster_profile](/cluster_profile.png)

# Cluster

A Kubernetes cluster is collections of master and worker nodes that cooperate to execute container application workloads.

Within a project, *Clusters* are where you provision and manage Kubernetes clusters. The clusters are provisioned and managed in your own cloud account environment. Each cluster is provisioned from a _Cluster Profile_ with additional configuration overrides and cloud specific settings.

# Cloud Account

Cloud Accounts are where access credentials are stored for public and private clouds. It is used by the system to provision new cluster infrastructure and cluster resources. 

# Pack Registry - public and private

Spectro Cloud provides multiple configuration options in a cluster profile for various system layers, such as OS, Kubernetes, storage, networking, monitoring, security, load balancers, etc. These configuration options are provided in the form of _Packs_. A pack is a Spectro Cloud content package that describes an integration in the Kubernetes infrastructure stack ecosystem and contains relevant artefacts required to deploy and manage that integration. For example, Spectro Cloud provides packs for core layers of the Kubernetes stack; Operating Systems, Kubernetes distributions, Networking and Storage. Besides these integrations, Spectro Cloud also provides packs for ELK Stack, Prometheus, Sysdig Falco etc. Spectro Cloud maintains a public registry containing various packs that can be used in any cluster profile. The pack content in this registry is constantly updated with new integrations. Optionally, a customer can host their own Private Pack Registry for their own private pack contents.

# Pack Content

A pack is a zip archive that consists of a manifest file called `pack.json` that describes the pack and additional components such as Helm charts, manifests and Ansible roles.

# Private Cloud Gateway

Private Cloud Gateway is Spectro Cloud's on-prem component to enable support for isolated private datacentre environments. The Private Cloud Gateway, once installed on-prem, registers itself with the Spectro Cloud's SaaS portal and enables secure communication between the SaaS portal and private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Spectro Cloud's SaaS portal.
