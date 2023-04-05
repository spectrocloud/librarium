---
title: "Registries and Packs"
metaTitle: "Registries and Packs"
metaDescription: "Learn about Packs, how to use and combine Packs, and how to create your Pack ."
icon: "nodes"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';

# Packs


A **Cluster Profile** is made up of preconfigured layers, each of which is called a pack.  In other words, **Packs** are the building block of a cluster profile to create layers such as operating systems, Kubernetes, network, storage, and add-ons. Packs can be broadly categorized into two types:

- **Core** packs - These packs model the core layers to provision a Kubernetes cluster. These packs include the operating system, Kubernetes, the container network interface (CNI), and the container storage interface (CSI) specifications.  Spectro Cloud builds and maintains these core packs for updates. 


- **Add-On** packs - These packs model the infrastructure integrations and applications that exist on top of the core packs. Examples of applications are system, authentication, security, monitoring, logging, ingress, load balancer, service mesh, or helm charts. 

Both the core and add-on packs described above are customizable, and you can define new custom add-on packs as well. The use case for defining new custom add-on packs is to have desired consistent governance across your profile deployments. 
  

## Structure

Palette provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility through custom-built packs. Each Pack is a collection of files such as manifests, helm charts, Ansible roles, configuration files, etc. Ansible roles, if provided, are used to customize cluster virtual machine images, whereas Kubernetes manifests and Helm charts are applied to the Kubernetes clusters after deployment. The following is a typical structure of a pack:


| **Pack Name** |**Requirement** | **Pack Directory Name** |
|-|-|-|
| pack.json | mandatory| pack config|
| values.yaml| mandatory| pack params + values.yaml from charts <br /> + templated params from ansible-roles + all config from manifests|
| logo.png| optional| pack logo|
| manifests| optional| manifest files for the pack|
| ansible-roles| optional| ansible-roles used to install the pack|
| charts| optional| charts to be deployed for the pack|

# Registries


The pack registry is a server-side application to store and serve packs to its clients. Packs from a pack registry are retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of multiple registries.

## Default Registry

The default pack registry is Spectro Cloud's public pack registry. It consists of several packs that make it easy for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Palette maintains all packs in this pack registry and takes care of upgrading packs in the pack registry whenever required.

## Custom Pack Registry

Users can set up a custom pack registry using a Docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the pack registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

# Spectro CLI

Spectro Cloud Command Line Interface (CLI) is a tool to interact with the Spectro Cloud Pack Registry. You can use the CLI to upload and download Packs. The CLI must authenticate with the pack registry before executing any CLI command. Refer to the  [Spectro Cloud CLI](/registries-and-packs/spectro-cli-reference) reference page for download instructions.

<br />