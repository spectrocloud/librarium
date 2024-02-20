---
sidebar_label: "Private Cloud Gateway"
title: "Private Cloud Gateway"
description: "Learn about the Private Cloud Gateway (PCG) and how to use it to support Palette or VerteX deployments."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "network-wired"
tags: ["pcg"]
---

A Private Cloud Gateway (PCG) is a Palette infrastructure support component that enables the communication between
Palette and a private cloud or private data center environment. The PCG is typically deployed into the private cloud
environments through the [Palette CLI](../../palette-cli/install-palette-cli.md).

A PCG is necessary in private cloud environments where Palette does not have direct network access to the environment
where workload clusters are deployed to. When the PCG is installed, it registers itself with a Palette instance and
enables secure communication between the Palette instance and the private cloud environment. The PCG supports the
lifecycle of Kubernetes clusters in private cloud environments. Once a cluster is deployed, the PCG also enables Palette
to monitor the cluster and perform cluster lifecycle operations.

## Supported Environments

You can deploy a PCG into most private cloud environments. Some of the infrastructure environments have first-class
support for PCG deployments through the Palette CLI. Other environments require manually installing the PCG onto an
existing Kubernetes cluster. Refer to the table below to learn more about the supported environments.

| Environment    | Palette CLI Install? | Description                                                                                     | Install Guide                                                         |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| MAAS           | ✅                   | The PCG cluster is deployed into a MAAS environment.                                            | [Deploy to MAAS](deploy-pcg/maas.md)                                  |
| OpenStack      | ✅                   | The PCG cluster is deployed into an OpenStack environment.                                      | [Deploy a OpenStack](deploy-pcg/openstack.md)                         |
| Other          | ❌                   | The PCG cluster is deployed into an existing Kubernetes cluster that is not managed by Palette. | [Deploy a PCG to an Existing Kubernetes Cluster](./deploy-pcg-k8s.md) |
| VMware vSphere | ✅                   | The PCG is deployed into a VMware vSphere environment.                                          | [Deploy a VMware vSphere](./deploy-pcg/vmware.md)                     |

## Resources

- [Architecture](./architecture.md)

- [Deploy a PCG with Palette CLI](./deploy-pcg/deploy-pcg.md)

- [Deploy a PCG to an Existing Kubernetes Cluster](./deploy-pcg-k8s.md)

- [Manage a PCG](./manage-pcg/manage-pcg.md)
