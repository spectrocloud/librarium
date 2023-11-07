---
sidebar_label: "PCG"
title: "PCG"
description: "Reference resource for the pcg command."
hide_table_of_contents: false
sidebar_position: 30
tags: ["palette-cli"]
---

The `pcg` command supports Private Cloud Gateway (PCG) operations, such as installing a PCG cluster and validating its installation. A local [kind](https://kind.sigs.k8s.io/) cluster is created to facilitate creating the PCG cluster in the target environment. You do not need to install kind or any other dependencies. The CLI includes all the required dependencies to set up the kind cluster.  


The `pcg` command exposes the following subcommand.

  <br />

  * `install` - Install a PCG through an interactive wizard. A container runtime is required to install a PCG cluster.


<br />

## Install

Use the `install` subcommand to install a PCG cluster in the following environments. The following flags are supported by the `install` subcommand.

<br />

  | **Short Flag** | **Long Flag**              | **Description**                                                              | **Type**    |
  |------------|------------------------|--------------------------------------------------------------------------|---------|
  | `-f`       | `--config-file`      |  Install using a configuration file (optional). Use `-config-only` to generate a configuration file.  | string  |
  | `-o`       | `--config-only`      | Generate configuration file only. This command will not proceed with installation.     | boolean    |
  | `-i`       | `--inspect-only`   | Validate prerequisites for environment. Do not proceed with installation. |  boolean      |


### Supported Environments

You can use the `install` subcommand to install a PCG cluster in the following environments.


| **Platform** | **Install Guide** |
|---|---|
| MAAS | [Link](../../clusters/data-center/maas/install-manage-maas-pcg.md#install-pcg) |
| OpenStack | [Link](../../clusters/data-center/openstack.md#installing-private-cloud-gateway---openstack) |
| VMware | [Link](../../clusters/data-center/vmware.md#create-vmware-cloud-gateway) |

