---
sidebar_label: "Registries and Packs"
title: "Registries and Packs"
description: "Learn about Packs, how to use and combine Packs, and how to create your Pack ."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "nodes"
---

# Packs

A **Cluster Profile** is made up of layers, each of which is created using a pack. Packs can be broadly categorized into
two types:

- **Infrastructure** packs - These packs are used to create the core infrastructure layers required to provision a
  Kubernetes cluster. These packs include the operating system, Kubernetes, the container network interface (CNI), and
  the container storage interface (CSI) specifications. Spectro Cloud builds and maintains these infrastructure packs
  for updates.

- **Add-on** packs - These packs are used to form the integrations and application layers that exist on top of the
  infrastructure layers. Examples of applications are system, authentication, security, monitoring, logging, ingress,
  load balancer, service mesh, or helm charts.

Both the infrastructure and add-on packs described above are configurable, and you can define new add-on custom packs
from scratch as well. The use case for defining new add-on packs is to drive consistency across your profile
deployments.

## Pack Structure

Palette provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility
through custom-built packs. To configure an existing infrastructure or add-on pack or to define a new add-on custom
pack, it is essential to understand the pack structure.

Each pack is a collection of files such as manifests, Helm charts, configuration files, and more. Kubernetes manifests
and Helm charts are applied to the Kubernetes clusters after deployment. The following is a typical pack structure:

| **File Name** | **Mandatory / Optional** | **Requirements**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.json`   | Mandatory                | Pack metadata. Must follow JSON syntax and provide the following: <br/ > - A pack name in the `name` field. For example, `"name": "hello-universe"` <br / > - A pack version in the `version` field. For example,`"version": "1.3.1"` <br /> - For manifest-based packs, paths to manifest files in the `kubeManifests` field. For example, `"kubeManifests": ["manifests/hello-universe.yaml"]` <br /> - For Helm chart-based files, paths to chart files in the `charts` field. For example, `"charts": [ "charts/fluent-bit-0.57.0.tgz"]` |
| `values.yaml` | Mandatory                | Pack configuration. Must follow YAML syntax and provide default values to mandatory parameters exposed from the underlying charts or manifests.                                                                                                                                                                                                                                                                                                                                                                                              |
| `charts/`     | Mandatory                | Mandatory for Helm chart-based packs. Contains the Helm charts to be deployed for the pack. Must follow [Helm chart file structure](https://helm.sh/docs/topics/charts/#the-chart-file-structure) and contain a `.tgz` file with the compressed Helm chart files.                                                                                                                                                                                                                                                                            |
| `manifests/`  | Mandatory                | Mandatory for Manifest-based packs. Contains the manifest files to be deployed for the pack. Must contain valid [Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/#describing-a-kubernetes-object).                                                                                                                                                                                                                                                                                                     |
| `logo.png`    | Optional                 | Contains the pack logo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `README.md`   | Optional                 | The pack description.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

The pack files must conform to the following directory structure.

<PartialsComponent category="packs" name="pack-structure" />

## Registries

The pack registry is a server-side application to store and serve packs to its clients. Packs from a pack registry are
retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of
multiple registries.

## Default Registry

The default pack registry is Spectro Cloud's OCI Palette Registry. It consists of several packs for creating a cluster
profile and launch a Kubernetes cluster with their choice of integrations. Palette maintains all packs in this pack
registry and takes care of upgrading packs in the pack registry whenever required.

## Custom Pack Registry

Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations. Use
[ORAS](https://oras.land/docs/) to upload and maintain custom packs in custom registries. Refer to the
[Deploy a Custom Pack](../tutorials/packs-registries/deploy-pack.md) tutorial for further information.

## Spectro CLI

The Spectro Cloud Command Line Interface (CLI) is a tool to interact with a Spectro Cloud pack registry. You can use the
CLI to upload and download packs. The CLI must authenticate with the pack registry before executing any CLI commands.
Review the [Spectro Cloud CLI](spectro-cli-reference.md) reference page for usage instructions.
