---
sidebar_label: "RHEL and PXK"
title: "RHEL and Palette eXtended Kubernetes"
description: "Learn how to build a custom RHEL with PXK for VMware vSphere and use it to deploy a Kubernetes cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["operating system", "byoos", "profiles", "pxk", "vmware"]
---

You can create a custom VMware vSphere RHEL image with
[Palette eXtended Kubernetes](../../../integrations/kubernetes.md) (PXK) and use it to deploy a Kubernetes cluster. You
choose to build the custom RHEL image with PXK using FIPS or opt for a non-FIPS-compliant image.

Use the following steps to build a custom RHEL image with PXK for VMware vSphere and deploy a Kubernetes cluster.

## Prerequisites

Before you begin, ensure that you have the following prerequisites met.

- Access to the VMware vSphere environment, including user credentials allowing you to create virtual machines.

- A valid [RHEL subscription](https://www.redhat.com/en/store/linux-platforms). You will need to provide the username
  and password for the subscription during the build process.

- An x86_64 Linux VM with the following resources:

  - 4 CPU
  - 8 GB of RAM
  - 50 GB of free disk space
  - Internet access
  - Git installed.
  - Ubuntu 20.04 LTS or later.

- The Linux VM must have connectivity to the internet and the VMware vSphere environment.

- Access to the [Red Hat Developer Portal](https://developers.redhat.com/products/rhel/download?source=sso).

## Build Custom Image

Use the following steps to build a custom RHEL image with PXK for VMware vSphere. Select the tab based on whether you
want to create a FIPS-compliant image or a non-FIPS-compliant image.

<Tabs>
<TabItem value="fips" label="FIPS">

1. Open a teminal session and log in to the Linux VM.

2. Download the RHEL ISO from the
   [Red Hat Developer Portal](https://developers.redhat.com/products/rhel/download?source=sso). Make sure you download
   the DVD ISO. This guide will use RHEL 8.8 as an example.

   :::tip

   Use the direct link to download the RHEL ISO locally through either `curl` or `wget`.

   :::

3. Update the system and install the latest packages.

   ```bash
   sudo apt update -y && sudo apt upgrade -y
   ```

4. Install HashiCorp Packer.

   ```bash
   wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt update && sudo apt install packer
   ```

5. Install anisble, make, jq, unzip, and python3.

   ```bash
   sudo apt-get install -y make unzip jq python3-pip git && \
   sudo apt install -y software-properties-common
   sudo add-apt-repository --yes --update ppa:ansible/ansible
   sudo apt install -y ansible
   ```

6. Update the PATH environment variable to include Python.

   ```bash
   export PATH=$PATH:/usr/bin/python3 && \
   echo "export PATH=$PATH:/usr/bin/python3" >> ~/.bashrc
   ```

7. Clone the forked Image Builder that contains customizations for PXK and switch to the `rhel-pxk-fips` branch.

   ```bash
    git clone git@github.com:spectrocloud/image-builder.git
    cd image-builder/images/capi
    git checkout rhel-pxk-fips
   ```

8. Install the VMware and vSphere Packer plugins.

   ```bash
   packer plugins install github.com/hashicorp/vmware
   packer plugins install github.com/hashicorp/vsphere
   ```

9. Prepare the image build by downloading dependencies needed by the image-builder scripts.

   ```bash
   make deps-ova
   ```

   :::tip

   If you encounter an error during the `make deps-ova` command, ensure you set the python3 path in the PATH environment
   variable correctly.

   :::

10. Update the **packer/ova/rhel-8.json** file and provide the path to the RHEL ISO image and the SHA256 checksum. Below
    is an example using RHEL 8.8. The ISO in this example is located at **/home/ubuntu/rhel-isos/**.

    ```json
    "iso_checksum": "517abcc67ee3b7212f57e180f5d30be3e8269e7a99e127a3399b7935c7e00a09",
    "iso_checksum_type": "sha256",
    "iso_url": "file:///home/ubuntu/rhel-isos/rhel-8.8-x86_64-dvd.iso",
    ```

    :::tip

    If you are unable to find the SHA256 checksum for the RHEL ISO, you can calculate it using the following command.
    Replace `/path/to/iso` with the path to the RHEL ISO you downloaded.

    ```bash
    sha256sum /path/to/iso
    ```

    :::

</TabItem>
</Tabs>

## Validate

```

```
