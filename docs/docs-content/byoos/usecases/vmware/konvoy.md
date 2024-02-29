---
sidebar_label: "RHEL and Konvoy"
title: "RHEL and Konvoy"
description:
  "Learn how to build a custom RHEL with Konvoy image for VMware vSphere and use it to deploy a Kubernetes cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["operating system", "byoos", "profiles", "konvoy", "vmware"]
---

This guide provides instructions for building a custom image using Red Hat Linux Enterprise (RHEL) with Konvoy. The
guide assumes that you have a basic understanding of VMware vSphere, RHEL and
[Konvoy](https://d2iq.com/products/konvoy).

You will use the [Konvoy image builder](https://github.com/mesosphere/konvoy-image-builder) project to build the custom
RHEL image with Konvoy. The custom image will be used to deploy a Kubernetes cluster on VMware vSphere.

Carefully review the prerequisites and follow the steps in the order provided to build and use a custom RHEL with
Konvoy. Make sure you have met all the prerequisites before you begin.

## Prerequisites

- A x86_64 Linux VM with the following resources:

  - 4 CPU
  - 8 GB of RAM
  - 50 GB of free disk space

- The Linux VM must have connectivity to the internet and the VMware vSphere environment.

- The following software must be installed on the Linux VM:

  - [Docker Engine](https://docs.docker.com/engine/install/) version 25.0.0 or later.
  - [Git](https://git-scm.com/) version 2.30 or later.
  - [Go](https://golang.org/) version 1.18 or later.
  - [HashiCorp Packer](https://developer.hashicorp.com/packer/) version 1.10.1 or later.
  - [Make](https://www.gnu.org/software/make/) 4.0 or later.

- A valid [RHEL subscription](https://www.redhat.com/en/store/linux-platforms). You will need to provide the username
  and password for the subscription during the build process.

- VMware vSphere template for RHEL 8.8 or later. The Konvoy image builder will use this template to create the custom
  RHEL with Konvoy image.

<details>
<summary>Click to learn more about VMware vSphere RHEL templates</summary>

You can download RHEL 8.8 or later ISO files from the
[Red Hat Developer Portal](https://developers.redhat.com/products/rhel/download?source=sso). The ISO can be uploaded to
your vSphere Datastore and be used to deploy a VM. Deploy the VM and reference the ISO you uploaded to your Datastore as
the input for the **CD/DVD Drive**.

![A View of the ISO selection](/byoos_vmware_konvoy_iso-selection.png)

After the VM is deployed, and you have completed the RHEL installation, verify you can SSH into the VM. If you can SSH
and login to the VM, you can use it as a template for the Konvoy image builder. Save the VM as a template in vSphere.
Reference the template in the Konvoy image builder configuration file.

:::warning

Reach out to your VMware administrator if you need assistance with the VMware vSphere template. It's critical you
configure the RHEL template correctly to ensure the Konvoy image builder can use it to create the custom RHEL with
Konvoy image.

:::

</details>

- SSH credentials to the RHEL template you are specifying in the Konvoy image builder configuration file.
