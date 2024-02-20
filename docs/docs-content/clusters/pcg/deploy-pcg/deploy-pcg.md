---
sidebar_label: "Deploy a PCG with Palette CLI"
title: "Deploy a PCG"
description: "Learn how to deploy a Private Cloud Gateway (PCG) to support Palette or VerteX deployments."
hide_table_of_contents: false
tags: ["pcg"]
---

You can install a Private Cloud Gateway (PCG) on a Linux server to support Palette or VerteX deployments. Use the
Palette CLI to install the PCG if you are targeting a VMware vSphere environment, MAAS, or OpenStack. For other
environments, refer to the [Deploy PCG to a Kubernetes Cluster](../deploy-pcg-k8s.md) guide.

Select the installation guide that matches your environment in the [Resources](#resources) section to learn how to
deploy a PCG.

## PCG Sizing

The following table provides the recommended sizing for the PCG based on the number of nodes, CPU, memory, storage, and
the maximum concurrent cluster deployments. You can continue to deploy additional clusters once the current clusters
deployment batch is complete.

We recommend using a minimum of 3 nodes for production environments. Single-node clusters are better suited for
development and testing environments.

##### Single-Node Cluster

| **Size** | **Nodes** | **CPU** | **Memory** | **Storage** | **Maximum concurrent cluster deployments** |
| -------- | --------- | ------- | ---------- | ----------- | ------------------------------------------ |
| Small    | 1         | 4       | 4 GB       | 60 GB       | 1-3                                        |
| Medium   | 1         | 8       | 8 GB       | 100 GB      | 4-6                                        |
| Large    | 1         | 16      | 16 GB      | 120 GB      | 7-10                                       |

##### High-Availability (HA) Cluster

| **Size** | **Nodes** | **CPU** | **Memory** | **Storage** | **Maximum concurrent cluster deployments** |
| -------- | --------- | ------- | ---------- | ----------- | ------------------------------------------ |
| Small    | 3         | 4       | 4 GB       | 60 GB       | 4-6                                        |
| Medium   | 3         | 8       | 8 GB       | 100 GB      | 7-10                                       |
| Large    | 3         | 16      | 16 GB      | 120 GB      | 10-15                                      |

## Resources

- [Deploy to MAAS](./maas.md)

- [Deploy to OpenStack](./openstack.md)

- [Deploy to VMware vSphere](./vmware.md)
