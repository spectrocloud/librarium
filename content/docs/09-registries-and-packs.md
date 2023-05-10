---
title: "Registries and Packs"
metaTitle: "Registries and Packs"
metaDescription: "Learn about Packs, how to use and combine Packs, and how to create your Pack ."
icon: "nodes"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import Tabs from "shared/components/ui/Tabs";

# Packs


A **Cluster Profile** is made up of preconfigured layers, each of which is called a pack.  In other words, **Packs** are the building block of a cluster profile to create layers such as operating systems, Kubernetes, network, storage, and add-ons. Packs can be broadly categorized into two types:

- **Core** packs - These packs model the core layers to provision a Kubernetes cluster. These packs include the operating system, Kubernetes, the container network interface (CNI), and the container storage interface (CSI) specifications.  Spectro Cloud builds and maintains these core packs for updates. 


- **Add-On** packs - These packs model the infrastructure integrations and applications that exist on top of the core packs. Examples of applications are system, authentication, security, monitoring, logging, ingress, load balancer, service mesh, or helm charts. 

Both the core and add-on packs described above are configurable, and you can define new add-on custom packs from scratch as well. The use case for defining new add-on packs is to have desired consistent governance across your profile deployments. 
  

## Pack Structure

Palette provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility through custom-built packs. To configure an existing pack (core or add-on) or to define a new add-on custom pack from scratch, it is essential to understand the pack structure. 

Each pack is a collection of files such as manifests, helm charts, Ansible roles, configuration files, and more. Ansible roles, if provided, are used to customize cluster VM images, whereas Kubernetes manifests and Helm charts are applied to the Kubernetes clusters after deployment. The following is a typical pack structure:


| **Pack Name** |**Requirement** | **Description** |
|-|-|-|
| `pack.json` | mandatory| Pack metadata.|
| `values.yaml`| mandatory| Pack configuration, params exposed from the underlying charts, and templated params from ansible-roles|
| `charts/`| mandatory| Mandatory for Helm chart-based packs. Contains the Helm charts to be deployed for the pack. |
| `manifests/`| mandatory| Mandatory for Manifest-based packs. Contains the manifest files to be deployed for the pack.
| `ansible-roles`| optional| Ansible roles used to install the pack.|
| `logo.png`| optional| Contains the pack logo. |
| `README.md`|optional| The pack description. |


Let's look at the examples below to better understand pack structure. <br/> <br/> 



<Tabs>

<Tabs.TabPane tab="Helm chart-based pack" key="helm-chart-pack">

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

</Tabs.TabPane>

<Tabs.TabPane tab="Manifest-based pack" key="manifest-pack">

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

</Tabs.TabPane>

</Tabs>

# Registries


The pack registry is a server-side application to store and serve packs to its clients. Packs from a pack registry are retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of multiple registries.

## Default Registry

The default pack registry is Spectro Cloud's public pack registry. It consists of several packs that make it easy for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Palette maintains all packs in this pack registry and takes care of upgrading packs in the pack registry whenever required.

## Custom Pack Registry

Users can set up a custom pack registry using a Docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the pack registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

# Spectro CLI

The Spectro Cloud Command Line Interface (CLI) is a tool to interact with a Spectro Cloud pack registry. You can use the CLI to upload and download packs. The CLI must authenticate with the pack registry before executing any CLI commands. Review the  [Spectro Cloud CLI](/registries-and-packs/spectro-cli-reference) reference page for usage instructions.

<br />
