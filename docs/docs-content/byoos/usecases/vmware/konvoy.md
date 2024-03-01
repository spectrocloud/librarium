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
guide assumes that you have a basic understanding of VMware vSphere, RHEL and [Konvoy](../../../integrations/konvoy.md).

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
  - [tar](https://www.gnu.org/software/tar/) or similar tool to extract tarballs.
  - [wget](https://www.gnu.org/software/wget/) or similar tool, such as curl to download files from the internet.

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

:::tip

Configure the RHEL VM with the proper users and credentials before creating a VM template of it. Consider adding the
following configuration to the `/etc/sudoers` file so that the root user and the `admin` and `sudo` groups can issue
commands as root without entering a password.

```shell
root ALL=(ALL:ALL) ALL
%admin ALL=(ALL) ALL
%sudo ALL=(ALL) ALL
Defaults        !authenticate
#Defaults   !visiblepw
```

:::

</details>

- SSH credentials to the RHEL template you are specifying in the Konvoy image builder configuration file.

  :::warning

  Reach out to your VMware administrator if you need assistance with the VMware vSphere template. It's critical you
  configure the RHEL template correctly to ensure the Konvoy image builder can use it to create the custom RHEL with
  Konvoy image.

  :::

## Build Image

1.  Open a terminal session in your Linux VM and create a new directory for the Konvoy image builder project.

    ```shell
    mkdir --parents ~/builder
    cd ~/builder
    ```

2.  Download the Konvoud builder release artifact from the GitHub releases page.

    ```shell
    wget https://github.com/mesosphere/konvoy-image-builder/releases/download/v2.8.5/konvoy-image-bundle-v2.8.5_linux_amd64.tar.gz
    ```

3.  Extract the downloaded tarball and navigate to the builder directory.

    ```shell
    tar --extract --file  konvoy-image-bundle-v2.8.5_linux_amd64.tar.gz --directory builder && \
    cd builder
    ```

4.  Export your vSphere and RHEL credentials as environment variables. Replace the placeholders with your credentials.

    ```shell
    export VSPHERE_SERVER=your-vsphere-server-IP
    export VSPHERE_USERNAME=your-vsphere-username
    export VSPHERE_PASSWORD=your-vsphere-password
    export RHSM_USER=your-redhat-email
    export RHSM_PASS=your-redhat-password
    export ANSIBLE_SUDO_PASS=admin
    ```

5.  Modify the Packer configuration file for the version of RHEL you want to use. The RHEL configuration files are
    located in the **images/objects/rhel** directory. In this guide, RHEL 8.8 is used. Use the following command to
    modify the file. You can use `vi` or any other text editor to modify the file.

    ```shell
    vi images/ova/rhel-88.yaml
    ```

6.  Replace the following placeholders in the RHEL configuration file with your vSphere and RHEL template information.

    | Parameter                    | Description                                                                                                                        |
    | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
    | `packer.cluster`             | The name of the vSphere cluster to deploy the Packer VM.                                                                           |
    | `packer.datacenter`          | The name of the vSphere datacenter to deploy the Packer VM.                                                                        |
    | `packer.datastore`           | The name of the vSphere datastore to deploy the Packer VM.                                                                         |
    | `packer.folder`              | The name of the vSphere folder to deploy the Packer VM.                                                                            |
    | `packer.network`             | The name of the vSphere network to deploy the Packer VM.                                                                           |
    | `packer.insecure_connection` | Set to `true` if you are using a self-signed certificate for the vCenter endpoint.                                                 |
    | `packer.resource_pool`       | The name of the vSphere resource pool to deploy the Packer VM.                                                                     |
    | `packer.template`            | The name of the RHEL template in vSphere that you created using the ISO file of the RHEL version you want to use.                  |
    | `packer.ssh_username`        | The username to SSH into the Packer VM. Specify the username you used to log in to the RHEL VM before converting it to a template. |
    | `packer.ssh_password`        | The password to SSH into the Packer VM. Specify the passowrd you used to log in to the RHEL VM before converting it to a template. |

    <details>

    <summary>Example RHEL configuration file</summary>

    The parameters that need to be replaced are highlighted in the example configuration file below.

    ```yaml showLineNumbers {9-16,22,23}
    ---
    download_images: true
    build_name: "rhel-88"
    packer_builder_type: "vsphere"
    guestinfo_datasource_slug: "https://raw.githubusercontent.com/vmware/cloud-init-vmware-guestinfo"
    guestinfo_datasource_ref: "v1.4.0"
    guestinfo_datasource_script: "{{guestinfo_datasource_slug}}/{{guestinfo_datasource_ref}}/install.sh"
    packer:
      cluster: "Cluster2"
      datacenter: "Datacenter"
      datastore: "example-datastore"
      folder: "internal"
      insecure_connection: "true"
      network: "DEV-NETWORK"
      resource_pool: "rp-dev"
      template: "internal/rhel"
      vsphere_guest_os_type: "rhel8_64Guest"
      guest_os_type: "rhel8-64"
      # goss params
      distribution: "RHEL"
      distribution_version: "8.8"
      ssh_username: "**********"
      ssh_password: "*********"
      linked_clone: false
      ansible_sudo_pass: "********"
      use_sudo: false
      NOPASSWD: ALL
    # ssh_private_key_file = "" # can be exported as environment variable 'SSH_PRIVATE_KEY_FILE'
    # ssh_agent_auth: false  # is set to true, ssh_password and ssh_private_key will be ignored
    ```

    </details>
