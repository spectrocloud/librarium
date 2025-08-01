---
sidebar_position: 0
sidebar_label: "Deploy an Edge Cluster on VMware"
title: "Deploy an Edge Cluster on VMware"
description:
  "Learn how to deploy an Edge host using VMware as the deployment platform. You will learn how to use the Edge
  Installer ISO, create a cluster profile, and deploy a Kubernetes cluster to the Edge host on VMware."
tags: ["edge", "tutorial"]
category: ["tutorial"]
---

Palette supports deploying Kubernetes clusters in remote locations to support edge computing workloads. Palette's Edge
solution enables you to deploy your edge devices, also called Edge hosts, which contain all the required software
dependencies to support Palette-managed Kubernetes cluster deployment.

Maintaining consistency while preparing edge devices at scale can be challenging for operation teams. For example,
imagine you are an IT administrator for a retail company that has decided to expand to 1000 new stores this year. The
company needs you to deploy Kubernetes clusters in each new store using edge devices, such as Intel NUC, and ensure each
device has the same software and security configurations. Your job is to prepare each device so the development team can
deploy Kubernetes clusters on each device. You have decided to use Palette's Edge solution to help you meet the
organizational requirements. You will prepare a small set of Edge devices and deploy a Kubernetes cluster to verify
readiness for consistent deployment across all physical sites.

The following points summarize the primary stages of Edge cluster deployment to a production environment:

- Create Edge artifacts such as the Edge Installer ISO, provider images, and content bundles.

- Initialize the Edge device with the Edge installer ISO. The ISO includes a base Operating System (OS) and other
  configurations such as networking, proxy, security, tooling, and user privileges.

- Create a cluster profile to ensure consistency in all the Edge hosts. The cluster profile lets you declare the desired
  software dependencies for each Kubernetes cluster.

Following the primary stages outlined above, this tutorial will guide you to build the Edge artifacts (Edge installer
ISO image and provider images) and use the Edge installer ISO image to prepare Edge hosts. Next, you will use the
provider image to create a cluster profile and then deploy a cluster on those Edge hosts. You will use VMware to deploy
the Edge hosts to simulate a bare metal environment.

For learning purposes, you will set up Virtual Machines (VMs) as Edge hosts and deploy a cluster on Edge host VMs. VMs
provide a more accessible Edge learning experience, as you do not require connecting to physical Edge devices. The
diagram below shows the main steps to prepare Edge hosts and deploy a cluster.

![An overarching diagram showing the tutorial workflow.](/tutorials/edge/clusters_edge_deploy-cluster_overarching.webp)

## Prerequisites

To complete this tutorial, you will need the following:

- Access to a VMware vCenter environment where you will provision VMs as Edge hosts. You will need the server URL, login
  credentials, and names of the data center, data store, resource pool, folder, cluster, and DHCP-enabled network.

- The VMs you will prepare as Edge hosts must be attached to a DHCP-enabled network. To ensure DHCP is enabled on the
  network, review the network settings on your ESXi Host. You can refer to the
  [Prepare the DHCP Server for vSphere](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.esxi.install.doc/GUID-9D8333F5-5F5B-4658-8166-119B44895098.html)
  guide from VMware to configure a DHCP server on the network.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture. <br/>

  ```bash
  uname -m
  ```

  :::warning

  The Linux machine must have network connectivity to your VMware vCenter environment.

  :::

- The following minimum hardware configuration:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). Ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  :::info

  If you do not install Earthly, you must install Docker.

  :::

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

- A Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md) guide.
  Copy the newly created token to a clipboard or notepad file to use later in this tutorial.

  The screenshot below shows a sample registration token in the **Tenant Settings** > **Registration Tokens** section in
  Palette.

  ![A screenshot of a registration token in Palette](/tutorials/edge/tutorials_edge_deploy-cluster_registration-token.webp)

## Build Edge Artifacts

In this section, you will use the [CanvOS](https://github.com/spectrocloud/CanvOS/blob/main/README.md) utility to build
an Edge installer ISO image and provider images for all the Palette-supported Kubernetes versions. The utility builds
multiple provider images, so you can use any image that matches the desired Kubernetes version you want to use with your
cluster profile. You must perform this part of the tutorial on a Linux machine with an AMD64(x86_64) processor
architecture that has network connectivity to your VMware vCenter environment.

This tutorial builds and uses the provider image compatible with K3s v1.32.1.

### Check Out Starter Code

Issue the following and subsequent command-line instructions on your Linux machine, which this tutorial refers to as the
development environment.

Clone the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code to build Edge
artifacts.

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

Change to the `CanvOS` directory.

```bash
cd CanvOS
```

View the available [git tags](https://github.com/spectrocloud/CanvOS/tags).

```bash
git tag
```

Check out the newest available tag. This guide uses **v4.6.12** tag as an example.

```bash
git checkout v4.6.12
```

## Define Arguments

CanvOS requires arguments such as image tag, registry, repository, and OS distribution. The arguments are defined in the
`.arg` file. In this step, you will create the `.arg` file and define all the required arguments.

Issue the command below to assign an image tag value for the provider images. This guide uses the default value `demo`
as an example. However, you can assign any lowercase and alphanumeric string to the `CUSTOM_TAG` variable.

```bash
export CUSTOM_TAG=demo
```

Issue the command below to create the `.arg` file with the custom tag. The remaining arguments will use the default
values. For example, `ubuntu` is the default operating system, `demo` is the default tag, and [ttl.sh](https://ttl.sh/)
is the default image registry. The default ttl.sh image registry is free and does not require a sign-up. Images pushed
to ttl.sh are ephemeral and will expire after the 24 hrs time limit.

Using the arguments defined in the `.arg` file, the final provider images you generate will have the following naming
convention, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. In this example, the provider images will be
`ttl.sh/ubuntu:k3s-1.32.1-v4.6.12-demo`. Refer to the `.arg.template` sample file in the current directory or the
[README](https://github.com/spectrocloud/CanvOS#readme) to learn more about the default values.

```bash
cat << EOF > .arg
CUSTOM_TAG=$CUSTOM_TAG
IMAGE_REGISTRY=ttl.sh
OS_DISTRIBUTION=ubuntu
IMAGE_REPO=ubuntu
OS_VERSION=22
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer
ARCH=amd64
UPDATE_KERNEL=false
EOF
```

:::warning

Future versions of CanvOS may require different arguments. Refer to the CanvOS
[README](https://github.com/spectrocloud/CanvOS#readme) to learn more about the arguments needed for each version tag.

:::

View the newly created file to ensure the arguments are defined per your requirements.

```bash
cat .arg
```

Refer to the [Build Edge Artifacts](../../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md) guide to
learn more about customizing arguments.

## Create User Data

Next, you will create a [`user-data`](../../clusters/edge/edgeforge-workflow/prepare-user-data.md) file that embeds your
[tenant registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md) and Edge
host's login credentials in the Edge Installer ISO image.

Issue the command below to save your tenant registration token to a local variable. Replace
`<your-palette-registration-token>` with your actual registration token.

```bash
export TOKEN=<your-palette-registration-token>
```

Use the following command to create the `user-data` file containing the tenant registration token.

```shell
cat << EOF > user-data
#cloud-config
stylus:
  site:
    edgeHostToken: $TOKEN
    paletteEndpoint: api.spectrocloud.com

users:
  - name: kairos
    passwd: kairos

install:
  poweroff: true
EOF
```

:::warning

If you haven't set a default project for the registration token, ensure that you provide the `stylus.site.projectName`
parameter with the value `Default` in `user-data`.

Ensure that you include the `install.poweroff.true` parameter. This ensures that the Edge host will power off after
installation. If you do not include this parameter, this could lead to a VM you will use in a subsequent step to refuse
to power off automatically and cause a timeout error unless you manually shut down the VM.

:::

Review the newly created `user-data` file.

```bash
cat user-data
```

The expected output should show that the `edgeHostToken` and login credentials for Edge hosts are set correctly. The
`edgeHostToken` value must match your Palette registration token. Otherwise, your Edge hosts will not register with
Palette. Below is a sample output with the token masked. <br />

```hideClipboard bash
#cloud-config
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: ********************************

users:
  - name: kairos
    passwd: kairos
```

## Build Artifacts

The CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
start the build process.

:::warning

Make sure your machine has sufficient disk space for the provider images. Each image is about 4 - 5 GB in size, and
images are created for all the Palette-supported Kubernetes versions by default. In the **4.6.12** branch of `CanvOS`
used in this tutorial, the script builds 60 images. If your machine does not have enough disk space, the build process
will fail silently.

Open the `k8s_version.json` file in the `CanvOS` directory. Remove the Kubernetes versions that you don't need from the
JSON object corresponding to your Kubernetes distribution.

This speeds up build process and reduces the amount of space required for the build process. For an example of excluding
a version from build, refer to
[Build Edge Artifacts guide](../../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md).

:::

<Tabs group="earthly">

<TabItem value="Earthly Installed">

```bash
earthly +build-all-images
```

</TabItem>

<TabItem value="Earthly Not Installed">

```bash
sudo ./earthly.sh +build-all-images
```

</TabItem>

</Tabs>

```hideClipboard bash {2}
# Output condensed for readability
===================== Earthly Build SUCCESS =====================
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```

This command may take 15-20 minutes to finish depending on the hardware resources of the host machine. Upon completion,
the command will display the manifest, as shown in the example below, that you will use in your cluster profile later in
this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what you defined
earlier in the `.arg` file.

Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.

```bash
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
options:
  system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: ttl.sh
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v4.6.12
  system.customTag: demo
  system.osVersion: 22
```

## View Artifacts

After completing the build process, list the edge installer ISO image and checksum by issuing the following command from
the `CanvOS` directory.

```bash
ls build/
```

```hideClipboard bash
palette-edge-installer.iso
palette-edge-installer.iso.sha256
```

Export the path to the ISO file, the `build` directory, in the `ISOFILEPATH` local variable. Later in the tutorial, you
will use this local variable to mount the `build` directory to a Docker container.

```bash
export ISOFILEPATH=$PWD/build
echo $ISOFILEPATH
```

List the Docker images to review the created provider images. By default, provider images are created for all the
Palette-supported Kubernetes versions. You can identify the provider images by the image tag value you used in the
`.arg` file's `CUSTOM_TAG` variable.

```shell
docker images --filter=reference='*/*:*demo*'
```

```hideClipboard bash {2,3}
REPOSITORY      TAG                                    IMAGE ID       CREATED       SIZE
ttl.sh/ubuntu   k3s-1.32.1-v4.6.12-demo                145bc25ff5b4   2 hours ago   4.97GB
ttl.sh/ubuntu   k3s-1.32.1-v4.6.12-demo_linux_amd64    145bc25ff5b4   2 hours ago   4.97GB
ttl.sh/ubuntu   k3s-1.31.5-v4.6.12-demo                52ba5288cccd   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.31.5-v4.6.12-demo_linux_amd64    52ba5288cccd   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.31.4-v4.6.12-demo                8e089cc7292f   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.31.4-v4.6.12-demo_linux_amd64    8e089cc7292f   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.31.1-v4.6.12-demo                6ecfc962d208   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.31.1-v4.6.12-demo_linux_amd64    6ecfc962d208   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.30.9-v4.6.12-demo                34cdeab9d894   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.30.9-v4.6.12-demo_linux_amd64    34cdeab9d894   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.30.8-v4.6.12-demo                6491f9c28be5   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.30.8-v4.6.12-demo_linux_amd64    6491f9c28be5   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.30.6-v4.6.12-demo                dee339f3ceaa   2 hours ago   4.95GB
ttl.sh/ubuntu   k3s-1.30.6-v4.6.12-demo_linux_amd64    dee339f3ceaa   2 hours ago   4.95GB
ttl.sh/ubuntu   k3s-1.30.5-v4.6.12-demo                80f451092b91   2 hours ago   4.96GB
ttl.sh/ubuntu   k3s-1.30.5-v4.6.12-demo_linux_amd64    80f451092b91   2 hours ago   4.96GB
...
```

## Push Provider Images

Push the provider images to the image registry indicated in the `.arg` file so that you can reference the provider image
later in your cluster profile.

Since we used the provider image compatible with K3s v1.32 in the cluster profile, you would use the following command
to push the provider image compatible with K3s v1.32 to the image registry. If you want to use the other provider image,
push that version to the image registry. The example below and default behavior uses the [ttl.sh](https://ttl.sh/) image
registry. This image registry is free and does not require you to sign up to use it. Images pushed to ttl.sh are
ephemeral and will expire after 24 hours.

```bash
docker push ttl.sh/ubuntu:k3s-1.32.1-v4.6.12-demo
```

:::warning

As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider images in
your cluster profile within 24 hours of pushing to _ttl.sh_, they will expire and must be re-pushed. If you want to use
a different image registry, refer to the Advanced workflow in the
[Build Edge Artifacts](../../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md) guide to learn how to
use another registry.

:::

## Provision Virtual Machines

In this section, you will create a VM template in VMware vCenter from the Edge installer ISO image and clone that VM
template to provision three VMs. Think of a VM template as a snapshot that can be used to provision new VMs. You cannot
modify templates after you create them, so cloning the VM template will ensure all VMs have _consistent_ guest OS,
dependencies, and user data configurations installed.

This tutorial example will use [Packer](https://www.packer.io/) to create a VM template from the Edge installer ISO
image. Later, it will use [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) to clone the VM template to
provision three VMs. You do not have to install Packer or GOVC in your Linux development environment. You will use our
official tutorials container that already contains the required tools. <br />

### Create a VM Template

You will use the `heredoc` script to create a VM template. The script prompts you to enter your VMware vCenter
environment details and saves them as environment variables in a file named `.packerenv`. Packer reads the environment
variables during the build process.

Before you invoke the `heredoc` script, have values handy in a notepad for the VMWare vCenter environment variables
listed in the table.

| **Variable**                    | **Description**         | **How to find its value?**                                                                                                                               |
| ------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PKR_VAR_vcenter_server`        | vCenter server URL      | Check with your VMware data center administrator. Omit `http://` or `https://` in the URL. Example: `vcenter.spectrocloud.dev`.                          |
| `PKR_VAR_vcenter_username`      | vSphere client username | Request credentials from your VMware data center administrator. Example: `myusername@vsphere.local`                                                      |
| `PKR_VAR_vcenter_password`      | vSphere client password | --                                                                                                                                                       |
| `PKR_VAR_vcenter_datacenter`    | Data center name        | Expand your vSphere client's main menu and select **Inventory** > **Hosts and Clusters**. The data center name is displayed in the left navigation tree. |
| `PKR_VAR_vcenter_cluster`       | Cluster name            | Expand the data center inventory to view the cluster name in the left navigation tree.                                                                   |
| `PKR_VAR_vcenter_resource_pool` | Resource pool name      | Expand the cluster inventory to view the resource pool name.                                                                                             |
| `PKR_VAR_vcenter_folder`        | Folder name             | Switch to the **VMs and Templates** view in your vSphere client. The folder name is displayed in the left navigation tree.                               |
| `PKR_VAR_vcenter_datastore`     | Datastore name          | Switch to the **Storage** view in your vSphere client. The datastore name is displayed in the left navigation tree.                                      |
| `PKR_VAR_vcenter_network`       | Network name            | Switch to the **Networking** view in your vSphere client. The network name is displayed in the left navigation tree.                                     |

Use the `heredoc` script to create the `.packerenv` file shown below that contains the VMware vCenter details as
environment variables.

```bash
cat << EOF > .packerenv
PKR_VAR_vcenter_server=$(read -ep 'Enter vCenter Server URL without http:// or https://, for example: vcenter.spectrocloud.dev ' vcenter_server && echo $vcenter_server)
PKR_VAR_vcenter_username=$(read -ep 'Enter vCenter Username value: ' vcenter_username && echo $vcenter_username)
PKR_VAR_vcenter_password=$(read -ep 'Enter vCenter Password value: ' vcenter_password && echo $vcenter_password)
PKR_VAR_vcenter_datacenter=$(read -ep 'Enter vCenter Datacenter name: ' vcenter_datacenter && echo $vcenter_datacenter)
PKR_VAR_vcenter_cluster=$(read -ep 'Enter vCenter Cluster name: ' vcenter_cluster && echo $vcenter_cluster)
PKR_VAR_vcenter_resource_pool=$(read -ep 'Enter vCenter Resource Pool name: ' vcenter_resource_pool && echo $vcenter_resource_pool)
PKR_VAR_vcenter_folder=$(read -ep 'Enter vCenter Folder name: ' vcenter_folder && echo $vcenter_folder)
PKR_VAR_vcenter_datastore=$(read -ep 'Enter vCenter Datastore name: ' vcenter_datastore && echo $vcenter_datastore)
PKR_VAR_vcenter_network=$(read -ep 'Enter vCenter Network name: ' vcenter_network && echo $vcenter_network)
EOF
```

View the file to ensure you have filled in the details correctly.

```bash
cat .packerenv
```

You will use the `.packerenv` file later in the tutorial when you start Packer.

After you create the `.packerenv` file, source this file to set the variables in your environment. Echo one of the
variables to ensure the variables are accessible on your host machine.

```shell
source .packerenv
echo $PKR_VAR_vcenter_server
```

After you create the `.packerenv` file, create another environment variable file named `.goenv`.
[GOVC](https://github.com/vmware/govmomi/blob/main/govc/USAGE.md) is the tool you will be using to interact with
vSphere, and it requires the same variables that you provided to Packer.

```shell
cat << EOF > .goenv
vcenter_server=$PKR_VAR_vcenter_server
vcenter_username=$PKR_VAR_vcenter_username
vcenter_password=$PKR_VAR_vcenter_password
vcenter_datacenter=$PKR_VAR_vcenter_datacenter
vcenter_datastore=$PKR_VAR_vcenter_datastore
vcenter_resource_pool=$PKR_VAR_vcenter_resource_pool
vcenter_folder=$PKR_VAR_vcenter_folder
vcenter_cluster=$PKR_VAR_vcenter_cluster
vcenter_network=$PKR_VAR_vcenter_network
EOF
```

View the file to ensure variable values are set correctly.

```shell
cat .goenv
```

Next, verify the `ISOFILEPATH` local variable has the path to the ISO file. The `docker run` command uses this variable
to bind mount the host's `build` directory to the container.

```bash
echo $ISOFILEPATH
```

:::info

The environment variable you set using `export [var-name]=[var-value]` will not persist across terminal sessions. If you
opened a new terminal session in your development environment, you will lose the `ISOFILEPATH` variable and will need to
reset it.

:::

The next step is to use the following `docker run` command to trigger Packer build process to create a VM template. Here
is an explanation of the options and sub-commands used below:

- The `--env-file` option reads the `.packerenv` file.

- The `--volume ` option mounts a local directory to our official tutorials container,
  `ghcr.io/spectrocloud/tutorials:1.1.13`.

- The `sh -c "source /edge/vmware/clone_vm_template/setenv.sh "` shell sub-command defines the GOVC environment
  variables, the number of VMs, a prefix string for the VM name, and the VM template name. Most of the GOVC environment
  variables refer to the variables you have defined in the `.goenv` file.

- The `cd /edge/vmware/packer/ && packer build -force --var-file=vsphere.hcl build.pkr.hcl` shell sub-command changes to
  the container's `/edge/vmware/packer` directory and invokes `packer build` to create the VM template. The
  `packer build` command has the following options:

  - The `-force` flag destroys any existing template.
  - The `--var-file` option reads the `vsphere.hcl` file from the container. This file contains the VM template name, VM
    configuration, and ISO file name to use. The VM configuration conforms to the
    [minimum device requirements](../../clusters/edge/hardware-requirements.md).

  The `vsphere.hcl` file content is shown below for your reference. This tutorial does not require you to modify these
  configurations.

  ```bash hideClipboard
  # VM Template Name
  vm_name                 = "palette-edge-template"
  # VM Settings
  vm_guest_os_type        = "ubuntu64Guest"
  vm_version              = 14
  vm_firmware             = "bios"
  vm_cdrom_type           = "sata"
  vm_cpu_sockets          = 4
  vm_cpu_cores            = 1
  vm_mem_size             = 8192
  vm_disk_size            = 153600
  thin_provision          = true
  disk_eagerly_scrub      = false
  vm_disk_controller_type = ["pvscsi"]
  vm_network_card         = "vmxnet3"
  vm_boot_wait            = "5s"
  # ISO Objects
  iso                 = "build/palette-edge-installer.iso"
  iso_checksum        = "build/palette-edge-installer.iso.sha256"
  ```

  :::info

  Should you need to change the VM template name or VM settings defined in the `vsphere.hcl` file, or review the Packer
  script, you must open a bash session into the container using the
  `docker run --interactive --tty --env-file .packerenv --volume "${ISOFILEPATH}:/edge/vmware/packer/build" ghcr.io/spectrocloud/tutorials:1.1.13 bash`
  command, and change to the `edge/vmware/packer` directory to make the modifications. After you finish the
  modifications, issue the `packer build -force --var-file=vsphere.hcl build.pkr.hcl` command inside the container to
  trigger the Packer build process. This command creates a VM template, so that you can skip the next step.

  :::

Issue the following command to trigger the Packer build process to create a VM template in the VMware vCenter. It will
also delete any existing `packer_cache` before uploading and keeping a copy of the `palette-edge-installer.iso` to the
`packer_cache` directory in the specified datastore.

```bash
docker run --interactive --tty --rm \
  --env-file .packerenv \
  --env-file .goenv \
  --volume "${ISOFILEPATH}:/edge/vmware/packer/build" \
  ghcr.io/spectrocloud/tutorials:1.1.13 \
  sh -c "source /edge/vmware/clone_vm_template/setenv.sh && cd /edge/vmware/packer/ && packer init build.pkr.hcl && packer build -force --var-file=vsphere.hcl build.pkr.hcl"
```

Depending on your machine and network, the build process can take 7-10 minutes to finish.

```hideClipboard bash {10,11}
# Sample output
==> vsphere-iso.edge-template: Power on VM...
    vsphere-iso.edge-template: Please shutdown virtual machine within 20m0s.
==> vsphere-iso.edge-template: Deleting Floppy drives...
==> vsphere-iso.edge-template: Eject CD-ROM drives...
==> vsphere-iso.edge-template: Deleting CD-ROM drives...
==> vsphere-iso.edge-template: Convert VM into template...
Build 'vsphere-iso.edge-template' finished after 7 minutes 13 seconds.
==> Wait completed after 7 minutes 13 seconds
==> Builds finished. The artifacts of successful builds are:
--> vsphere-iso.edge-template: palette-edge-template
```

### Provision VMs

Once Packer creates the VM template, you can use the template when provisioning VMs. In the next steps, you will use the
[GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) tool to deploy a VM and reference the VM template that
Packer created. Remember that the VM instances you are deploying simulate bare metal devices.

GOVC requires the same VMware vCenter details as the environment variables you defined earlier in the `.goenv` file.

The next step is to use the following `docker run` command to clone the VM template and provision three VMs. Here is an
explanation of the options and sub-commands used below:

- The `--env-file` option reads the `.goenv` file in our official `ghcr.io/spectrocloud/tutorials:1.1.13` tutorials
  container.

- The `sh -c "cd edge/vmware/clone_vm_template/ && ./deploy-edge-host.sh"` shell sub-command changes to the container's
  `edge/vmware/clone_vm_template` directory and invokes the `deploy-edge-host.sh` shell script.

The `edge/vmware/clone_vm_template` directory in the container has the following files:

- `deploy-edge-host.sh` - Provisions the VMs.
- `delete-edge-host.sh` - Deletes the VMs.

- `setenv.sh`- Defines the GOVC environment variables, the number of VMs, a prefix string for the VM name, and the VM
  template name. Most of the GOVC environment variables refer to the variables you have defined in the `.goenv` file.

Below is the `setenv.sh` file content for your reference. This tutorial does not require you to modify these
configurations.

```bash hideClipboard
#!/bin/bash
# Number of VMs to provision
export NO_OF_VMS=3
export VM_PREFIX="demo"
export INSTALLER_TEMPLATE="palette-edge-template"

#### DO NOT MODIFY BELOW HERE ####################
# GOVC Properties
export GOVC_URL="https://${vcenter_server}"     # Use HTTPS. For example, https://vcenter.company.com
export GOVC_USERNAME="${vcenter_username}"
export GOVC_PASSWORD="${vcenter_password}"
export GOVC_INSECURE=1 #1 if insecure
export GOVC_DATACENTER="${vcenter_datacenter}"
export GOVC_DATASTORE="${vcenter_datastore}"
export GOVC_NETWORK="${vcenter_network}"
export GOVC_RESOURCE_POOL="${vcenter_resource_pool}"
export GOVC_FOLDER="${vcenter_folder}"
```

:::info

Suppose you have changed the VM template name in the previous step or need to change the number of VMs to provision. In
that case, you must modify the `setenv.sh` script. To do so, you can reuse the container bash session from the previous
step if it is still active, or you can open another bash session into the container using the
`docker run --interactive --tty --env-file .goenv ghcr.io/spectrocloud/tutorials:1.1.13 bash` command. If you use an
existing container bash session, create the `.goenv` file described above and source it in your container environment.
Next, change to the `edge/vmware/clone_vm_template` directory to modify the `setenv.sh` script, and issue the
`./deploy-edge-host.sh` command to deploy the VMs.

:::

Issue the following command to clone the VM template and provision three VMs.

```bash
docker run --interactive --tty --rm \
  --env-file .goenv \
  ghcr.io/spectrocloud/tutorials:1.1.13 \
  sh -c "cd edge/vmware/clone_vm_template/ && ./deploy-edge-host.sh"
```

The cloning process can take 3-4 minutes to finish and displays output similar to that shown below. The output displays
the Edge host ID for each VM, as highlighted in the sample output below. VMs use this host ID to auto-register with
Palette.

```bash hideClipboard {7}
# Sample output for one VM
Cloning /Datacenter/vm/sp-sudhanshu/palette-edge-template to demo-1...OK
Cloned VM demo-1
Powering on VM demo-1
Powering on VirtualMachine:vm-13436... OK
Getting UUID demo-1
Edge Host ID   VM demo-1 : edge-97f2384233b498f6aa8dec90c3437c28
```

For each of the three VMs, copy the Edge host ID. An Edge host ID looks similar to
`edge-97f2384233b498f6aa8dec90c3437c28`.

:::warning

You must copy the Edge host IDs for future reference. In addition, if auto registration fails you will need the Edge
host IDs to manually register Edge hosts in Palette.

:::

## Verify Host Registration

Before deploying a cluster, you must verify Edge host registration status in Palette.

Open a web browser and log in to [Palette](https://console.spectrocloud.com). Navigate to the left **Main Menu** and
select **Clusters**. Click on the **Edge Hosts** tab and verify the three VMs you created are registered with Palette.

![A screenshot showing the VMs automatically registered with Palette. ](/tutorials/edge/clusters_edge_deploy-cluster_edge-hosts.webp)

If the three Edge hosts are not displayed in the **Edge hosts** tab, the automatic registration failed. If this happens,
you can manually register hosts by clicking the **Add Edge Hosts** button and pasting the Edge host ID. Repeat this host
registration process for each of the three VMs. If you need help, the detailed instructions are available in the
[Register Edge Host](../../clusters/edge/site-deployment/site-installation/edge-host-registration.md) guide.

## Deploy a Cluster

Once you verify the host registration, the next step is to deploy a cluster. In this section, you will use the Palette
User Interface (UI) to deploy a cluster that is made up of the three Edge hosts you deployed.

## Create a Cluster Profile

Validate you are in the **Default** project scope before creating a cluster profile.

![A screenshot of Palette's Default scope selected.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_default-scope.webp)

Next, create a cluster profile with the core infrastructure layers and a manifest of a sample application,
[Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe). Navigate to the left **Main Menu** and
select **Profiles**. Click on the **Add Cluster Profile** button, and fill out the required input fields. The cluster
profile wizard contains the following sections.

### Basic Information

Use the following values when filling out the **Basic Information** section.

| **Field**   | **Value**                                                              |
| ----------- | ---------------------------------------------------------------------- |
| Name        | docs-ubuntu-k3s                                                        |
| Version     | `1.0.0`                                                                |
| Description | Cluster profile as part of the edge cluster deployment tutorial.       |
| Type        | Full                                                                   |
| Tags        | `spectro-cloud-education, app:hello-universe, terraform_managed:false` |

Click on **Next** to continue.

### Cloud Type

In the **Cloud Type** section, choose **Edge Native** and click on **Next** at the bottom to proceed to the next
section.

### Profile Layers

<!-- prettier-ignore-start -->

In the **Profile Layers** section, add the following
<VersionedLink text="BYOS Edge OS" url="/integrations/packs/?pack=generic-byoi"/> pack to the OS layer.

<!-- prettier-ignore-end -->

| **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
| ------------- | ------------ | ------------- | ---------------- |
| OS            | Public Repo  | BYOS Edge OS  | Not applicable   |

Replace the OS layer manifest with the custom manifest so that the cluster profile can pull the provider image from the
_ttl.sh_ image registry. You may recall that the CanvOS script returned an output containing a custom manifest after
building the Edge artifacts. Copy the CanvOS output into the cluster profile's BYOOS pack YAML file.

The `system.xxxxx` attribute values in the manifest are as same as those you defined in the `.arg` file while building
the Edge artifacts. The code snippet below serves as an example.

```yaml
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
options:
  system.uri:
    "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo
    }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{
    .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{
    .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: ttl.sh
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v4.6.12
  system.customTag: demo
  system.osVersion: 22
```

The screenshot below shows you how to reference your provider OS image in a cluster profile by using the utility build
output with the BYOOS pack.
![A screenshot of k3s OS layer in a cluster profile.](/tutorials/edge/clusters_edge_deploy-cluster_edit-profile.webp)

:::warning

_ttl.sh_ is a short-lived image registry. If you do not use the provider image in your cluster profile within 24 hours
of pushing to _ttl.sh_, they will no longer exist and must be re-pushed. In a production environment, use a custom
registry for hosting provider images.

:::

Click on the **Next layer** button to add the following Kubernetes layer to your cluster profile.

| **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
| ------------- | ------------ | --------------------- | ---------------- |
| Kubernetes    | Public Repo  | Palette Optimized K3s | `1.32.1`         |

The pack version must match the version pushed to the _ttl.sh_ image registry. The `system.uri` attribute of the BYOOS
pack will reference the Kubernetes version you select using the `{{ .spectro.system.kubernetes.version }}`
[macro](../../clusters/cluster-management/macros.md).

Click on the **Next layer** button, and add the following network layer. This example uses the Calico Container Network
Interface (CNI). However, you can choose a different CNI pack that fits your needs, such as Flannel, Cilium, or Custom
CNI.

| **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
| ------------- | ------------ | ------------- | ---------------- |
| Network       | Public Repo  | Calico        | `3.25.x`         |

Click on the **Confirm** button to complete the core infrastructure stack. Palette displays the newly created
infrastructure profile as a layered diagram.

Finally, click on the **Add Manifest** button to add the
[Hello Universe](https://github.com/spectrocloud/hello-universe#readme) application manifest.

![A screenshot of the add Manifest button.](/tutorials/edge/clusters_edge_deploy-cluster_add-manifest.webp)

Use the following values to add the Hello Universe manifest metadata.

| **Field**                | **Value**                                      |
| ------------------------ | ---------------------------------------------- |
| Layer name               | hello-universe                                 |
| Layer values (Optional)  | Leave default                                  |
| Install order (Optional) | Leave default                                  |
| Manifests                | Add new manifest, and name it `hello-universe` |

When you provide the `hello-universe` value in the **Manifest** field, a blank text editor opens at right. Copy the
following manifest and paste it into the text editor.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-service
spec:
  type: NodePort
  selector:
    app: hello-universe
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-universe-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-universe
  template:
    metadata:
      labels:
        app: hello-universe
    spec:
      containers:
        - name: hello-universe
          image: ghcr.io/spectrocloud/hello-universe:1.0.12
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
```

The screenshot below shows the manifest pasted into the text editor. Click on the **Confirm & Create** button to finish
adding the manifest.

![A screenshot of Hello Universe application manifest.](/tutorials/edge/clusters_edge_deploy-cluster_add-manifest-file.webp)

If there are no errors or compatibility issues, Palette displays the newly created full cluster profile for review.
Verify the layers you added, and click on the **Next** button.

Review all layers and click **Finish Configuration** to create the cluster profile.

## Create a Cluster

Click on the newly created cluster profile to view its details page. Click the **Deploy** button to deploy a new Edge
cluster.

![Screenshot of the Profile Layers success.](/tutorials/edge/clusters_edge_deploy-cluster_profile-success.webp)

The cluster deployment wizard displays the following sections.

### Basic Information

Use the following values in the **Basic Information** section.

| **Field**    | **Value**                                                              |
| ------------ | ---------------------------------------------------------------------- |
| Cluster name | docs-tutorial-cluster                                                  |
| Description  | Cluster as part of the Edge tutorial.                                  |
| Tags         | `spectro-cloud-education, app:hello-universe, terraform_managed:false` |

Click **Next** to continue.

### Parameters

The **Parameters** section offers you another opportunity to change the profile configuration. For example, clicking on
the **BYOS Edge OS 1.0.0** layer allows you to configure the `system.registry`, `system.repo`, and other available
attributes.

Use the default values for all attributes across all layers and click **Next**.

### Cluster configuration

Provide the Virtual IP (VIP) address for the host cluster to use during the cluster configuration process. An Edge
cluster virtual IP represents the entire cluster, and external clients or applications can use it to access services the
Edge cluster provides. Ask your system administrator for an IP address you can use. It must be unique and not conflict
with any other IP addresses in the network.

If available, you can optionally select an SSH key to remote into the host cluster and provide a Network Time Protocol
(NTP) server list.

Click **Next** to continue.

### Nodes configuration

In this section, you will use the Edge hosts to create the cluster nodes. Use one of the Edge hosts as the control plane
node and the remaining two as worker nodes. In this example, the control plane node is called the control plane pool,
and the set of worker nodes is the worker pool.

In the **CONTROL-PLANE POOL CONFIGURATION** section, under **Pool Configuration**, select **Add Edge Hosts**, and choose
one of the registered Edge hosts. The screenshot below shows an Edge host added to the control plane pool.

![Screenshot of an Edge host added to the control plane pool.](/tutorials/edge/tutorials_edge_deploy-cluster_add-control-node.webp)

This tutorial does not require you to modify the default values of the **CONTROL-PLANE POOL CONFIGURATION** fields or
configure the hosts.

In the **WORKER POOL CONFIGURATION** section, under **Pool Configuration**, select **Add Edge Hosts**, and choose the
remaining two Edge hosts. The screenshot below shows two Edge hosts added to the worker pool.

![Screenshot of Edge hosts added to the worker pool.](/tutorials/edge/tutorials_edge_deploy-cluster_add-worker-nodes.webp)

This tutorial does not require you to modify the default values of the **WORKER POOL CONFIGURATION** fields or configure
the hosts.

Click **Next** to continue.

### Settings

This section displays options for OS patching, scheduled scans, scheduled backups, cluster role binding, and location.
Use the default values, and click on the **Validate** button.

### Review

Review all configurations in this section. The **Review** page displays the cluster name, tags, node pools, and layers.
If everything looks good, click on the **Finish Configuration** button to finish deploying the cluster. Deployment may
take up to _20 minutes_ to finish.

While deployment is in progress, Palette displays the cluster status as **Provisioning**. While you wait for the cluster
to finish deploying, you can explore the various tabs on the cluster details page, such as **Overview**, **Workloads**,
and **Events**.

## Validate

In Palette, navigate to the left **Main Menu** and select **Clusters**. Select your cluster to display the cluster
**Overview** page and monitor cluster provisioning progress.

When cluster status displays **Running** and **Healthy**, you can access the application from the exposed service URL
with the port number displayed. One random port between 30000-32767 is exposed for the Hello Universe application. Click
on the port number to access the application.

The screenshot below highlights the NodePort to access the application.

![Screenshot of highlighted NodePort to access the application.](/tutorials/edge/clusters_edge_deploy-cluster_access-service.webp)

Clicking on the exposed NodePort displays the Hello Universe application.

:::warning

We recommend waiting to click on the service URL, as it takes one to three minutes for DNS to properly resolve the
public NodePort URL. This prevents the browser from caching an unresolved DNS request.

:::

![Screenshot of successfully accessing the Hello Universe application.](/tutorials/edge/clusters_edge_deploy-cluster_hello-universe.webp)

You have successfully provisioned an Edge cluster and deployed the Hello Universe application on it.

## Cleanup

The following steps will guide you in cleaning up your environment, including the cluster, cluster profile, and Edge
hosts.

### Delete Cluster and Profile

In Palette, display the cluster details page. Click on the **Settings** button to expand the **drop-down Menu**, and
select the **Delete Cluster** option, as shown in the screenshot below.

![Screenshot of deleting a cluster.](/tutorials/edge/clusters_edge_deploy-cluster_delete-cluster.webp)

Palette prompts you to enter the cluster name and confirm the delete action. Type the cluster name to delete the
cluster. The cluster status changes to **Deleting**. Deletion takes up to 10 minutes.

After you delete the cluster, click **Profiles** on the left **Main Menu**, and select the profile to delete. Choose the
**Delete** option in the **three-dot Menu**, as shown in the screenshot below.

![Screenshot of deleting a cluster profile.](/tutorials/edge/clusters_edge_deploy-cluster_delete-profile.webp)

Wait for Palette to successfully delete the resources.

### Delete Edge Hosts

Switch back to the `CanvOS` directory in the Linux development environment containing the `.goenv` file, and use the
following command to delete the Edge hosts.

```bash
docker run --interactive --tty --rm --env-file .goenv \
  ghcr.io/spectrocloud/tutorials:1.1.13 \
  sh -c "cd edge/vmware/clone_vm_template/ && ./delete-edge-host.sh"
```

### Delete Edge Artifacts

If you want to delete Edge artifacts from your Linux development environment, delete the Edge installer ISO image and
its checksum by issuing the following commands from the `CanvOS` directory.

```bash
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```

Issue the following command to list all images in your current development environment.

```bash
docker images
```

Note the provider image name and tags, and use the following command syntax to remove all provider images.

```bash
docker rmi ttl.sh/ubuntu:k3s-1.32.1-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.32.1-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.31.5-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.31.5-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.31.4-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.31.4-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.31.1-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.31.1-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.30.9-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.30.9-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.30.8-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.30.8-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.30.6-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.30.6-v4.6.12-demo_linux_amd64
docker rmi ttl.sh/ubuntu:k3s-1.30.5-v4.6.12-demo
docker rmi ttl.sh/ubuntu:k3s-1.30.5-v4.6.12-demo_linux_amd64
...
```

### Delete VMware vSphere Resources

Navigate to **Inventory** > **VMs and Templates** in your vSphere client. To delete the **palette-edge-template** VM
template, right-click on it and choose **Delete** option from the **drop-down Menu**.

Switch to the **Storage** view in your vSphere client. To delete the `palette-edge-installer.iso` file from the
`packer_cache` directory in the VMware vCenter datastore, right-click on it and choose **Delete** option from the
**drop-down Menu**. <br />

## Wrap-Up

Building Edge artifacts allows you to prepare Edge hosts and deploy Palette-managed Edge clusters. Edge artifacts
consist of an Edge installer ISO and provider images for all the Palette-supported Kubernetes versions. An Edge
installer ISO assists in preparing the Edge hosts, and the provider image is used in the cluster profile.

In this tutorial, you learned how to build Edge artifacts, prepare VMware VMs as Edge hosts using the Edge installer
ISO, create a cluster profile referencing a provider image, and deploy a cluster.

Palette's Edge solution allows you to prepare your Edge hosts with the desired OS, dependencies, and user data
configurations. It supports multiple Kubernetes versions while building the Edge artifacts and creating cluster
profiles, enabling you to choose the desired Kubernetes version for your cluster deployment.

Before you plan a production-level deployment at scale, you can prepare a small set of Edge devices for development
testing and to validate the devices' state and installed applications. Once the validation is satisfactory and meets
your requirements, you can roll out Edge artifacts and cluster profiles for deployment in production. This approach
maintains consistency while deploying Kubernetes clusters at scale across all physical sites, be it 1000 or more sites.
In addition, you can use Palette to manage the entire lifecycle of Edge clusters.

To learn more about Edge, check out the resources below.

- [Build Edge Artifacts](../../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md)

- [Build Content Bundle](../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md)

- [Model Edge Native Cluster Profile](../../clusters/edge/site-deployment/model-profile.md)

- [Prepare Edge Hosts for Installation](../../clusters/edge/site-deployment/stage.md)

- [Perform Site Install](../../clusters/edge/site-deployment/site-installation/site-installation.md)
