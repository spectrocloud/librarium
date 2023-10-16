---
sidebar_label: "Registries and Packs"
title: "Registries and Packs"
description: "Learn about Packs, how to use and combine Packs, and how to create your Pack ."
hide_table_of_contents: false
sidebar_custom_props: 
  icon: "nodes"
---




# Packs


A **Cluster Profile** is made up of layers, each of which is created using a pack. Packs can be broadly categorized into two types:

- **Infrastructure** packs - These packs are used to create the core infrastructure layers required to provision a Kubernetes cluster. These packs include the operating system, Kubernetes, the container network interface (CNI), and the container storage interface (CSI) specifications.  Spectro Cloud builds and maintains these infrastructure packs for updates. 


- **Add-on** packs - These packs are used to form the integrations and application layers that exist on top of the infrastructure layers. Examples of applications are system, authentication, security, monitoring, logging, ingress, load balancer, service mesh, or helm charts. 

Both the infrastructure and add-on packs described above are configurable, and you can define new add-on custom packs from scratch as well. The use case for defining new add-on packs is to drive consistency across your profile deployments. 
  

## Pack Structure

Palette provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility through custom-built packs. To configure an existing infrastructure or add-on pack or to define a new add-on custom pack, it is essential to understand the pack structure. 

Each pack is a collection of files such as manifests, helm charts, Ansible roles, configuration files, and more. Ansible roles, if provided, are used to customize cluster VM images, whereas Kubernetes manifests and Helm charts are applied to the Kubernetes clusters after deployment. The following is a typical pack structure:


| **Pack Name** |**Requirement** | **Description** |
|-|-|-|
| `pack.json` | mandatory| Pack metadata.|
| `values.yaml`| mandatory| Pack configuration, parameters exposed from the underlying charts, and templated parameters from Ansible roles. |
| `charts/`| mandatory| Mandatory for Helm chart-based packs. Contains the Helm charts to be deployed for the pack. |
| `manifests/`| mandatory| Mandatory for Manifest-based packs. Contains the manifest files to be deployed for the pack.
| `ansible-roles`| optional| Ansible roles used to install the pack.|
| `logo.png`| optional| Contains the pack logo. |
| `README.md`|optional| The pack description. |


Let's look at the examples below to better understand pack structure. 



<Tabs queryString="pack-type">

<TabItem label="Helm chart-based pack" value="helm-chart-pack">

The example shows the structure of a Helm chart-based pack, **istio-1.6.2**, which is made up of two charts: *istio-controlplane* and *istio-operator*.  Each chart has its **values.yaml** file. In this example, we have a pack-level **values.yaml** file and individual chart-level **values.yaml** files.  <br/> <br/> 

```bash
.
├── charts/
│   ├── istio-controlplane.tgz
│   ├── istio-controlplane
│   │   ├── Chart.yaml
│   │   ├── templates/
│   │   └── values.yaml
│   ├── istio-operator.tgz
│   └── istio-operator
│       ├── Chart.yaml
│       ├── templates/
│       └── values.yaml
├── logo.png
├── pack.json
└── values.yaml
```

</TabItem>

<TabItem label="Manifest-based pack" value="manifest-pack">

This example shows the structure of a Manifest-based pack, *kubeflow-1.2.0*, made up of **kubeflow-kfdef.yaml** and **kubeflow-operator.yaml** manifests.

```bash
.
├── manifests/
│   ├── kubeflow-kfdef.yaml
│   └── kubeflow-operator.yaml
├── logo.png    
├── pack.json
└── values.yaml
```  

</TabItem>

</Tabs>

## Registries


The pack registry is a server-side application to store and serve packs to its clients. Packs from a pack registry are retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of multiple registries.

## Default Registry

The default pack registry is Spectro Cloud's public pack registry. It consists of several packs that make it easy for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Palette maintains all packs in this pack registry and takes care of upgrading packs in the pack registry whenever required.

## Custom Pack Registry

Users can set up a custom pack registry using a Docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the pack registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

## Spectro CLI

The Spectro Cloud Command Line Interface (CLI) is a tool to interact with a Spectro Cloud pack registry. You can use the CLI to upload and download packs. The CLI must authenticate with the pack registry before executing any CLI commands. Review the  [Spectro Cloud CLI](spectro-cli-reference.md) reference page for usage instructions.

<br />
