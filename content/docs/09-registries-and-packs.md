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


A **Cluster Profile** comprises preconfigured layers, each of which is called a pack.  In other words, **Packs** are the building block of a cluster profile to create layers such as operating systems, Kubernetes, network, storage, and add-ons. Packs can be broadly categorised into two types:

- **Core** packs - These packs model the core layers to provision a Kubernetes cluster. These packs include the operating system, Kubernetes, the container network interface (CNI), and the container storage interface (CSI) specifications.  Spectro Cloud builds and maintains these core packs for updates. 


- **Add-On** packs - These packs model the infrastructure integrations and applications that exist on top of the core packs. Examples of applications are system, authentication, security, monitoring, logging, ingress, load balancer, service mesh, or helm charts. 

Both the core and add-on packs described above are configurable, and you can define new add-on custom packs from scratch as well. The use case for defining new add-on packs is to have desired consistent governance across your profile deployments. 
  

## Pack Structure

Palette provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility through custom-built packs. To configure an existing pack (core or add-on) or to define a new add-on custom pack from scratch, it is essential to understand the pack structure. Each Pack is a collection of files such as manifests, helm charts, Ansible roles, configuration files, etc. Ansible roles, if provided, are used to customize cluster VM images whereas Kubernetes manifests and Helm charts are applied to the Kubernetes clusters after deployment. The following is a typical structure of a pack:


| **Pack Name** |**Requirement** | **Description** |
|-|-|-|
| `pack.json` | mandatory| Pack metadata.|
| `values.yaml`| mandatory| Pack configuration, params exposed from the underlying charts, <br /> and templated params from ansible-roles|
|`README.md`|The pack description|
| `logo.png`| optional| pack logo|
| `manifests/`| optional| Directory containing the manifest files|
| `ansible-roles`| optional| Ansible roles used to install the pack|
| `charts/`| optional| Directory containing the Helm charts to be deployed for the pack. <br>A pack can support multiple charts underneath. Note that each chart, in turn, also has a `values.yaml` file and can have nested charts.|


![Pack structure](/pack_structure.png)


# Registries


The pack registry is a server-side application to store and serve packs to its clients. Packs from a pack registry are retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of multiple registries.

## Default Registry

The default pack registry is Spectro Cloud's public pack registry. It consists of several packs that make it easy for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Palette maintains all packs in this pack registry and takes care of upgrading packs in the pack registry whenever required.

## Custom Pack Registry

Users can set up a custom pack registry using a Docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the pack registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

# Spectro CLI



Spectro Cloud CLI is a Command Line Interface to interact with the Spectro Cloud Pack Registry server for uploads and downloads of packs. CLI must authenticate with the pack registry before executing any CLI command.

## Downloads

Spectro CLI is currently available in two platforms - OSX & Linux:





|**OS**  |**Download Site**  |
|---------|---------|
|OSX     |   https://spectro-cli.s3.amazonaws.com/v3.1.0/osx/spectro     |
|Linux   |   https://spectro-cli.s3.amazonaws.com/v3.1.0/linux/spectro      |
