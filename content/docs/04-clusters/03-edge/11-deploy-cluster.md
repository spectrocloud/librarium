---
title: "Deploy an Edge Cluster on VMware"
metaTitle: "Deploy an Edge Cluster on VMware"
metaDescription: "Learn how to deploy an Edge host using VMware as the deployment platform. You will learn how to use the Edge Installer ISO, create a cluster profile, and deploy a Kubernetes cluster to the Edge host on VMware."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from "shared/components/common/PointOfInterest";

# Deploy Edge Cluster

Palette supports deploying Kubernetes clusters in remote locations to support edge computing workloads. To deploy Kubernetes on edge, you can use Palette's Edge solution and deploy your edge devices, also called Edge hosts, that contain all the required software dependencies to support Palette-managed Kubernetes cluster deployment.  

Maintaining consistency while preparing edge devices at scale can be challenging for operation teams. For example, imagine you are an IT administrator for a retail company that has decided to expand to 1000 new stores this year. The company needs you to deploy Kubernetes clusters in each new store using edge devices, such as Intel NUC or similar, and ensure each device has the same software and security configurations. Your job is to prepare each device so the development team can deploy Kubernetes clusters on all those devices. You have decided to use Palette's Edge solution to help you meet the organizational requirements. You will prepare a small set of Edge devices and deploy a Kubernetes cluster to verify readiness for consistent deployment across all physical sites.

For an overview, here are the stages of deploying an Edge cluster to a production environment:  

- The Edge artifacts, such as the Edge Installer ISO, the provider images, and content bundles, are created. 

- The Edge device is initialized with the Edge installer ISO, which includes a base OS and other configurations, such as networking, proxy, security, tooling, and user privileges. 

- A cluster profile is created to ensure consistency in all the Edge hosts. The cluster profile lets you declare all the desired software dependencies each Kubernetes should have installed.


In this tutorial, similar to the primary stages outlined above, you will first build the Edge artifacts (Edge installer ISO image and provider images) and use the Edge installer ISO image to prepare Edge hosts. Next, you will use the provider image to create a cluster profile and then deploy a cluster on those Edge hosts. You will use VMware to deploy the Edge hosts to simulate a bare metal environment.


Setting up Virtual Machines (VMs) as Edge hosts and deploying a cluster on the Edge host VMs is a less complex path to learning and gaining experience with Edge due to not having to connect to a physical Edge devices. Therefore, this tutorial uses VMWare VMs as Edge hosts to test the installer ISO image's correctness and ease of use. The diagram below shows the main steps to prepare Edge hosts and deploy a cluster. 


![An overarching diagram showing the tutorial workflow.](/tutorials/edge/clusters_edge_deploy-cluster_overarching.png)

 
# Prerequisites

To complete this tutorial, you will need the following items:
<br/>

* Access to a VMWare vCenter environment where you will provision VMs as Edge hosts. You will need the server URL, login credentials, and names of the data center, data store, resource pool, folder, cluster, and DHCP enabled network.


* A physical or virtual Linux machine with *AMD64* (also known as *x86_64*) processor architecture to build the Edge artifacts. You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```
  <br />

  <WarningBox>

  The Linux machine must have network connectivity to your VMWare Center environment. 

  </WarningBox>

* Minimum hardware configuration of the Linux machine:
  - 4 CPU
  - 8 GB memory
  - 50 GB storage
 

* [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version` command.


* [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version` command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to create privileged containers.   


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).


* A Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to generate a new registration token. For detailed instructions, refer to the [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide. Copy the newly created token to a clipboard or notepad file to use later in this tutorial. 

  The screenshot below shows a sample registration token in the **Tenant Settings** > **Registration Tokens** section in Palette. 

  ![A screenshot of a registration token in Palette](/tutorials/edge/clusters_edge_deploy-cluster_registration-token.png)


# Build Edge Artifacts

In this section, you will use the [CanvOS](https://github.com/spectrocloud/CanvOS/blob/main/README.md) utility to build an Edge installer ISO image and provider images for all the Palette-supported Kubernetes versions. The utility builds multiple provider images, so you can use either one that matches the desired Kubernetes version you want to use with your cluster profile. 

The current tutorial will build and use the provider image compatible with K3s v1.25.2 as an example. 
<br />

## Checkout the Starter Code

Issue the following and subsequent command-line instructions on your Linux machine, referred to as the development environment in this tutorial.

Clone the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code for building Edge artifacts. 
<br />

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

Change to the **CanvOS** directory.
<br />

```bash
cd CanvOS
```

View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).
<br />

```bash
git tag
```

Check out the newest available tag. This guide uses **v3.4.3** tag as an example. 
<br />

```shell
git checkout v3.4.3
```
<br />

## Review Arguments

The **.arg.template** sample file in the current directory contains customizable arguments, such as image tag, registry, repository, and OS distribution. Rename the sample **.arg.template** file to **.arg** and review the arguments to use in the build process.
<br />

```bash
mv .arg.template .arg && cat .arg
```


CanvOS allows you to customize arguments defined in the **.arg** file. However, this tutorial will use the default values for all arguments, for example, the operating system as `ubuntu` and the tag as `demo`. As a result, the provider image will name as `ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo`. 

Refer to the [Build Edge Artifacts](/clusters/edge/palette-canvos) guide to learn more about customizing arguments.
<br />

## Create User Data

Next, you will create a **user-data** file that embeds the tenant registration token and Edge host's login credentials in the Edge Installer ISO image.  


Issue the command below to save your tenant registration token to a local variable. Replace `[your_token_here]` placeholder with your actual registration token. 
<br />

```bash
export token=[your_token_here]
```

  
Use the following command to create the **user-data** file containing the tenant registration token. Also, you can click on the *Points of Interest* numbers below to learn more about the main attributes relevant to this example.
<br />


<PointsOfInterest
  points={[
    {
      x: 270,
      y: 160,
      label: 1,
      description: "Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.",
      tooltipPlacement: "rightTop",
    },
    {
      x: 190,
      y: 225,
      label: 2,
      description: "Instructs the installer to turn the host machine off once the installation is complete.",
    },
    {
      x: 190,
      y: 300,
      label: 3,
      description: "Sets the login credentials for Edge hosts. The login credentials will allow you to SSH log into the edge host for debugging purposes.",
      tooltipPlacement: "rightTop",
    },
  ]}
>

```shell
cat << EOF > user-data
#cloud-config
stylus:
  site:
    edgeHostToken: $token
install:
  poweroff: true
users:
  - name: kairos
    passwd: kairos
EOF
```

</PointsOfInterest>

View the newly created user data file to ensure the token is set correctly.
<br />

```bash
cat user-data
```
<br/>

## Build Artifacts

CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to start the build process. 
<br />

```bash
sudo ./earthly.sh +build-all-images
```

```bash coloredLines=2-2 hideClipboard
# Output condensed for readability
===================== Earthly Build SUCCESS ===================== 
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```

This command may take up to 15-20 minutes to finish depending on the hardware resources of the host machine. It will also display the manifest to use in your cluster profile later in this tutorial. See an example below. Notice that the `system.xxxxx` attribute values in the manifest below will be as same as what you defined in the **.arg** file earlier.

Copy and save the output attributes in a notepad or clipboard to use later in the cluster profile.
<br />

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
  system.peVersion: v3.4.3
  system.customTag: demo
  system.osVersion: 22
```
<br />

## View Artifacts

After completing the build process, list the edge installer ISO image and checksum by issuing the following command from the **CanvOS** directory.
<br />

```bash
ls build/
```

```bash
# Output hideClipboard
palette-edge-installer.iso       
palette-edge-installer.iso.sha256
```


Export the path to the ISO file, the **build** directory, in the `ISOFILEPATH` local variable. Later in the tutorial, you will use this local variable to bind mount the **build** directory to a Docker container. 
<br />

```bash
export ISOFILEPATH=$PWD/build
echo $ISOFILEPATH
```


List the Docker images to review the provider images created. By default, provider images for all the Palette-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag value you used in the  **.arg** file's `CUSTOM_TAG` variable. 
<br />

```shell
docker images --filter=reference='*/*:*demo'
```

```bash coloredLines=3-4 hideClipboard
# Output
REPOSITORY      TAG                      IMAGE ID       CREATED          SIZE
ttl.sh/ubuntu   k3s-1.24.6-v3.4.3-demo   3a672a023bd3   45 minutes ago   4.61GB
ttl.sh/ubuntu   k3s-1.25.2-v3.4.3-demo   0217de3b9e7c   45 minutes ago   4.61GB
```
<br />

## Push Provider Images

Push the provider images to the image registry mentioned in the **.arg** file so that you can reference the provider image in your cluster profile later. 

This example will use the provider image compatible with K3s v1.25 in the cluster profile. Therefore, use the following command to push the provider image compatible with K3s v1.25 to the image registry. If you want to use the other provider image compatible with K3s v1.24 instead, push that version to the image registry. The current example and default behavior use the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does not require a sign-up. Images pushed to ttl.sh are ephemeral and will expire after the 24 hrs time limit.  
<br />

```bash
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo
```

<WarningBox>

As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider images in your cluster profile within 24 hours of pushing to *ttl.sh*, they will expire and must be re-pushed. If you want to use a different image registry, refer to the Advanced workflow in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to learn how to use another registry.

</WarningBox>
<br />


# Provision Virtual Machines

In this section, you will create a VM template in VMWare vCenter from the Edge installer ISO image and clone that VM template to provision three VMs. Think of a VM template as a snapshot that can be used to provision new VMs. You cannot modify templates after you create them, so cloning the VM template will ensure all VMs have *consistent* guest OS, dependencies, and user data configurations installed. 

This tutorial example will use [Packer](https://www.packer.io/) to create a VM template from the Edge installer ISO image, and later, it will use [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) to clone the VM template to provision three VMs. You do not have to install these tools (Packer, GOVC) on your Linux development environment. You will use our official tutorials container that already contains the required tools. <br />

## Create a VM Template

Use the following heredoc script to create a file, **.packerenv**, containing the VMWare vCenter details as environment variables. You will need the server URL, login credentials, and names of the data center, data store, resource pool, folder, cluster, and DHCP enabled network.
<br />

```bash
cat << EOF > .packerenv
PKR_VAR_vcenter_server=$(read -ep 'Enter vCenter Server URL without http:// or https://, for example: vcenter.spectrocloud.dev ' vcenter_server && echo $vcenter_server)
PKR_VAR_vcenter_username=$(read -ep 'Enter vCenter Username value: ' vcenter_username && echo $vcenter_username)
PKR_VAR_vcenter_password=$(read -ep 'Enter vCenter Password value: ' vcenter_password && echo $vcenter_password)
PKR_VAR_vcenter_datacenter=$(read -ep 'Enter vCenter Datacenter name: ' vcenter_datacenter && echo $vcenter_datacenter)
PKR_VAR_vcenter_datastore=$(read -ep 'Enter vCenter Datastore name: ' vcenter_datastore && echo $vcenter_datastore)
PKR_VAR_vcenter_resource_pool=$(read -ep 'Enter vCenter Resource Pool name: ' vcenter_resource_pool && echo $vcenter_resource_pool)
PKR_VAR_vcenter_folder=$(read -ep 'Enter vCenter Folder name: ' vcenter_folder && echo $vcenter_folder)
PKR_VAR_vcenter_cluster=$(read -ep 'Enter vCenter Cluster name: ' vcenter_cluster && echo $vcenter_cluster)
PKR_VAR_vcenter_network=$(read -ep 'Enter vCenter Network name: ' vcenter_network && echo $vcenter_network)
EOF
```
View the file to ensure you have filled in the details correctly. 
<br />

```bash
cat .packerenv
```

You will use the **.packerenv** file later in the tutorial when you start Packer.

Next, verify that the `ISOFILEPATH` local variable has the path to the ISO file. The `docker run` command uses this variable to bind mount the host's **build** directory to the container. 
<br />

```bash
echo $ISOFILEPATH
```

<InfoBox>

The environment variable set using `export [var-name]=[var-value]` will not persist across terminal sessions. If you have opened a new terminal session in your development environment, you will lose the `ISOFILEPATH` variable and have to set it again.  

</InfoBox>
<br />

The next step is to use the following `docker run` command to trigger Packer to create a VM template. Here is an explanation of the options and sub-command used below:
- The `--env-file` option will read the **.packerenv** file.
- The `--volume ` option will mount a local directory to the container.
- It uses our official tutorials container, `ghcr.io/spectrocloud/tutorials:1.0.6`.
- The `sh -c "cd edge/vmware/packer/ && packer build -force --var-file=vsphere.hcl build.pkr.hcl` shell sub-command will change to the **edge/vmware/packer/** directory in the container and execute `packer build` to create the VM template. In the `packer build` command: 
  - The `-force` flag will destroy the existing template, if any. 
  - The `--var-file` option will read the **vsphere.hcl** file from the container. It contains the VM template name, VM configuration, and ISO file name to use. The VM configuration conforms to the [minimum device requirements](https://docs.spectrocloud.com/clusters/edge/architecture/#minimumdevicerequirements).

Here is the **vsphere.hcl** file content for your reference; however, you do not have to modify these configurations in this tutorial.  
<br />

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
  vm_disk_size            = 51200
  thin_provision          = true
  disk_eagerly_scrub      = false
  vm_disk_controller_type = ["pvscsi"]
  vm_network_card         = "vmxnet3"
  vm_boot_wait            = "5s"
  # ISO Objects
  iso                 = "build/palette-edge-installer.iso"
  iso_checksum        = "build/palette-edge-installer.iso.sha256"
  ```

  <InfoBox>

  Should you need to review the Packer script or modify the **vsphere.hcl** file, you must clone the [tutorials](https://github.com/spectrocloud/tutorials.git) repository and change to the **edge/vmware/packer/** directory to make the modifications. After modifications, rebuild the tutorials image using these [local build steps](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#local-builds) and use that image in the following `docker run` command.  

  </InfoBox>

Issue the following command to trigger Packer to create a VM template in the VMWare vCenter. It will also upload and keep a copy of **palette-edge-installer.iso** in the **packer_cache/** directory in the VMWare vCenter datastore. 
  
<br />

```bash
docker run -it --rm \
  --env-file .packerenv \
  --volume "${ISOFILEPATH}:/edge/vmware/packer/build" \
  ghcr.io/spectrocloud/tutorials:1.0.6 \
  sh -c "cd edge/vmware/packer/ && packer build -force --var-file=vsphere.hcl build.pkr.hcl"
```

The build process can take up to 7-10 minutes to finish depending on your machine's and network configuration. 
<br />

```bash coloredLines=10-11 hideClipboard
# Sample output
==> vsphere-iso.edge-template: Power on VM...
    vsphere-iso.edge-template: Please shutdown virtual machine within 10m0s.
==> vsphere-iso.edge-template: Deleting Floppy drives...
==> vsphere-iso.edge-template: Eject CD-ROM drives...
==> vsphere-iso.edge-template: Deleting CD-ROM drives...
==> vsphere-iso.edge-template: Convert VM into template...
Build 'vsphere-iso.edge-template' finished after 7 minutes 13 seconds.
==> Wait completed after 7 minutes 13 seconds
==> Builds finished. The artifacts of successful builds are:
--> vsphere-iso.edge-template: palette-edge-template
```
<br />


## Provision VMs

Once Packer creates the VM template, you can use the template when provisioning VMs. In the next steps, you will use the [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) tool to deploy a VMs and reference the VM template that Packer created.  Keep in mind that the VM instances you are deploying are simulating bare metal devices.


GOVC requires the same VMWare vCenter details as the environment variables you defined earlier in the **.packerenv** file. Use the following command to source the **.packerenv** file and echo one of the variables to ensure the variables are accessible on your host machine. 
<br />

```bash
source .packerenv
echo $PKR_VAR_vcenter_server
```

Use the following command to create an environment file titled **.goenv**. The  **.goenv** file contains the required VMWare vCenter credentials and information required to deploy VMs in your VMware environment. 
<br />

```bash
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
View the file to ensure the files have the values set correctly.
<br />

```bash
cat .goenv
```


The next step is to use the following `docker run` command to clone the VM template and provision three VMs. Here is an explanation of the options and sub-command used below:
- The `--env-file` option will read the **.goenv** file.
- It uses our official tutorials container, `ghcr.io/spectrocloud/tutorials:1.0.6`.
- The `sh -c "cd edge/vmware/clone_vm_template/ && ./deploy-edge-host.sh"` shell sub-command will change to the **edge/vmware/clone_vm_template/** directory in the container and execute the **deploy-edge-host.sh** shell script. 

The **edge/vmware/clone_vm_template/** directory in the container has the following files:
- **deploy-edge-host.sh** - Provisions the VMs.
- **delete-edge-host.sh** - Deletes the VMs.
- **setenv.sh** - Defines the GOVC environment variables, the number of VMs, a prefix string for the VM name, and the VM template name. Most of the GOVC environment variables refer to the variables you have defined in the **.goenv** file. 

Here is the **setenv.sh** file content for your reference; however, you do not have to modify these configuration in this tutorial. 
<br />

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

Should you need to review the GOVC commands in the **deploy-edge-host.sh** script or modify the number of VMs to provision, you must clone the [tutorials](https://github.com/spectrocloud/tutorials.git) repository and modify the **edge/vmware/clone_vm_template/setenv.sh** file, rebuild the image using these [local build steps](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#local-builds) and use that image in the following `docker run` command. 

Issue the following command to clone the VM template and provision three VMs.
<br />

```bash
docker run -it --rm \
  --env-file .goenv \
  ghcr.io/spectrocloud/tutorials:1.0.6 \
  sh -c "cd edge/vmware/clone_vm_template/ && ./deploy-edge-host.sh"
```

The cloning process can take 3-4 minutes to finish and display an output similar to the one below. The output will display the Edge host ID for each VM, as highlighted in the sample output below. VMs will use this host ID to auto-register themselves with Palette.
<br />

```bash coloredLines=7-7 hideClipboard
# Sample output for one VM
Cloning /Datacenter/vm/sp-sudhanshu/palette-edge-template to demo-1...OK
Cloned VM demo-1
Powering on VM demo-1
Powering on VirtualMachine:vm-13436... OK
Getting UUID demo-1
Edge Host ID   VM demo-1 : edge-97f2384233b498f6aa8dec90c3437c28
``` 

Copy the Edge host ID, similar to `edge-97f2384233b498f6aa8dec90c3437c28`, for each of the three VMs. 
<br />

<WarningBox>

It is essential to copy the Edge host ID for future reference, manual registration in Palette UI, and use in the Terraform workflow. 

</WarningBox>


# Verify Host Registration

Before you proceed to the deploy a cluster, you must verify the Edge host registration status in Palette UI. 

Open a web browser and log in to [Palette](https://console.spectrocloud.com). Navigate to the left **Main Menu** and select **Clusters**. Click on the **Edge Hosts** tab and verify the three VMs created are registered with Palette.

![A screenshot showing the VMs registered with Palette automatically. ](/tutorials/edge/clusters_edge_deploy-cluster_edge-hosts.png)


The automatic registration fails if the three Edge hosts are not displayed in the list. In that case, you can manually register by clicking on the **Add Edge Hosts** button, and paste the Edge host ID returned after provisioning the VMs in the last step. Repeat the host registration process of each of the three VMs. 
<br />

# Deploy a Cluster

Once you verify the host registration, the next step is to deploy a cluster. This tutorial provides two workflows to deploy a cluster - Palette UI and Terraform. You can choose either of the workflows below.

<br />

<Tabs>

<Tabs.TabPane tab="Palette UI" key="palette_ui_delete">

<br />

In this workflow, you will use the User Interface (UI) to deploy a cluster that is made up if the three Edge hosts you deployed.
<br />

## Create a Cluster Profile

Validate you are in the **Default** project scope before creating a cluster profile.  
<br />

![A screenshot of Palette's Default scope selected.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_default-scope.png)

<br />



Next, create a cluster profile comprising the core infrastructure layers and a manifest of a sample application, [Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe). 
Navigate to the left **Main Menu** and select **Profile**. Click on the **Add Cluster Profile** button, and fill out the required input fields. The cluster profile wizard contains the following sections. 
<br />

### Basic Information

Use the following values when filling out the **Basic Information** section. 

|**Field**|**Value**|
|---|---|
|Name|docs-ubuntu-k3s|
|Version|`1.0.0`|
|Description|Cluster profile as part of the edge cluster deployment tutorial.|
|Type|Full|
|Tags|`spectro-cloud-education, app:hello-universe, terraform_managed:false`|

Click on **Next** to continue. 
<br />


### Cloud Type

In the **Cloud Type** section, choose **Edge Native** and click on **Next** at the bottom to move on to the next section.   
<br />

### Profile Layers

In the **Profile Layers** section, first add the following [BYOS Edge OS](/integrations/byoos) pack to the OS layer.

|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|OS|Public Repo|BYOS Edge OS|`1.0.0`|

Replace the OS layer manifest with the following custom manifest so that the cluster profile can pull the provider image from the *ttl.sh* image registry. You may recall that the CanvOS script returned an output containing a custom manifest after building the Edge artifacts. The CanvOS output is intended to get copied into the cluster profile's BYOOS pack YAML. 

 The `system.xxxxx` attribute values in the manifest below are as same as what you defined in the **.arg** file while building the Edge artifacts.  Copy the code snippet below into the YAML editor for the BYOOS pack.  
<br />

```yaml
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
  system.peVersion: v3.4.3
  system.customTag: demo
  system.osVersion: 22
``` 
<br />

 
The screenshot below shows you how to reference your provider OS image in a cluster profile by using the utility build output with the BYOOS pack. 
<br />

![A screenshot of k3s OS layer in a cluster profile.](/tutorials/edge/clusters_edge_deploy-cluster_edit-profile.png)


<WarningBox>

 *ttl.sh* is a short-lived image registry. If you do not use the provider image in your cluster profile within 24 hours of pushing to *ttl.sh*, they will no longer exist and must be re-pushed. In a production environment, use a custom registry for hosting provider images.

</WarningBox>
<br />

Click on the **Next layer** button to add the following Kubernetes layer to your cluster profile. 


|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|Kubernetes|Public Repo|Palette Optimized K3s|`1.25.x`|


Select the K3s version 1.25.x. 1.25.X is used because you pushed a provider image compatible with K3s v1.25.2 to the *ttl.sh* image registry earlier in this tutorial. BYOOS pack's `system.uri` attribute will reference the Kubernetes version you select using the `{{ .spectro.system.kubernetes.version }}` [macro](/clusters/cluster-management/macros).


Click on the **Next layer** button, and add the following network layer. This example uses the Calico Container Network Interface (CNI). However, you can choose a different CNI pack that fits your needs, such as Flannel, Cilium, or Custom CNI. 


|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|Network|Public Repo|Calico|`3.25.x`|


Finally, click on the **Confirm** button to complete the core infrastructure stack. Palette will display the newly created infrastructure profile as a layered diagram. 

Next, click on the **Add Manifest** button on the top to add the [Hello Universe](https://github.com/spectrocloud/hello-universe#readme) application manifest.  

![A screenshot of the add Manifest button.](/tutorials/edge/clusters_edge_deploy-cluster_add-manifest.png)

Use the following values to add the Hello Universe manifest metadata.  

|**Field** |**Value**|
|---|---|
|Layer name| hello-universe|
|Layer values (Optional)|Leave default|
|Install order (Optional)|Leave default|
|Manifests|Add new manifest, and name it `hello-universe`|

When you provide the value `hello-universe` in the **Manifest** field, a blank text editor will open on the righthand side of the screen. Copy the following manifest and paste it into the text editor. 
<br />

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

The screenshot below shows the manifest pasted into the text editor. Click on the **Confirm & Create** button to finish adding the manifest. 

  ![A screenshot of Hello Universe application manifest.](/tutorials/edge/clusters_edge_deploy-cluster_add-manifest-file.png)


If there are no errors or compatibility issues, Palette will display the newly created full cluster profile for review. Verify the layers you added, and click on the **Next** button. 
<br />

Review all layers and click **Finish Configuration** to create the cluster profile. 
<br />

## Create a Cluster

Click on the newly created cluster profile to view its details page.  Click the **Deploy** button to deploy a new Edge cluster. 
<br />

![Screenshot of the Profile Layers success.](/tutorials/edge/clusters_edge_deploy-cluster_profile-success.png)

The cluster deployment wizard will display the following sections. 
<br />

### Basic Information

Use the following values in the first section, **Basic Information**. 

|**Field**|**Value**|
|---|---|
|Cluster name| docs-tutorial-cluster |
|Description| Cluster as part of the Edge tutorial.|
|Tags|`spectro-cloud-education, app:hello-universe, terraform_managed:false`|

Click **Next** to continue.
<br /> 

### Parameters

The **Parameters** section offers you another opportunity to change the profile configurations. For example, clicking on the **BYOS Edge OS 1.0.0** layer allows you to configure the `system.registry`, `system.repo`, and other available attributes. 

Use the default values for all attributes across all layers and click **Next**.
<br />

### Cluster config

Provide the Virtual IP (VIP) address for the host cluster to use during the cluster configuration process. You can optionally select an SSH key to remote into the host cluster and provide a Network Time Protocol (NTP) server list, if available, with you.  

Click **Next** to continue.    
<br />

### Nodes config

In this section, provide details for the master pool. 

|**Field** | **Value for the master-pool**| 
|---| --- | 
|Node pool name| master-pool | 
|Allow worker capability| Checked | 
|Additional Labels (Optional) | None |
|[Taints](/clusters/cluster-management/taints/)|Off|
|Pool Configuration > Edge Hosts | Choose one of the registered Edge hosts.<br />Palette will automatically display the Nic Name for the selected host. |

The screenshot below shows adding an Edge host to the master pool.

![Screenshot of adding an Edge host to the master pool.](/tutorials/edge/clusters_edge_deploy-cluster_add-master-node.png)


Similarly, provide details for the worker pool, and add the remaining two Edge hosts to the worker pool. Suppose you do not have Edge hosts remaining; in that case, you can remove the worker pool. Your master pool has the worker capability already. 

|**Field** | **Value for the worker-pool**| 
|---| --- | 
|Node pool name| worker-pool | 
|Additional Labels (Optional) | None |
|Taints|Off|
|Pool Configuration > Edge Hosts | Choose one or more registered Edge hosts. |

The screenshot below shows adding two Edge hosts to the worker pool.

![Screenshot of adding Edge hosts to the worker pool.](/tutorials/edge/clusters_edge_deploy-cluster_add-worker-node.png)

Click **Next** to continue.    
<br /> 

### Settings 

This section displays options for OS patching, scheduled scans, scheduled backups, cluster role binding, and location. Use the default values, and click on the **Validate** button.      
<br /> 

### Review

Review all configurations in this section. The **Review** page displays the cluster name, tags, node pools, and layers. If everything seems good, click on the **Finish Configuration** button to finish deploying the cluster. Deployment may take up to *20 minutes* to finish. 

While deployment is in progress, Palette displays the cluster status as **Provisioning**. While you wait for the cluster to finish deploying, you can explore the various tabs on the cluster details page, such as **Overview**, **Workloads**, and **Events**. 
<br /> 

</Tabs.TabPane>

<Tabs.TabPane tab="Terraform" key="terraform_ui_delete">

<br />

In this workflow, you will deploy a cluster on the Edge hosts using Terraform commands. First, familiarize yourself with the Spectro Cloud Terraform provider and Terraform configuration files. 
<br />

The [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) allows you to interact with the Spectro Cloud management API using Terraform. It provides resources that enable you to provision and manage Palette resources. With the provider, you can define your infrastructure as code using Terraform configuration files and use the Terraform CLI to create, update, and delete resources in Palette. The provider supports various features such as cluster provisioning, cloud account management, and more. Using Terraform for deploying Palette resources offers advantages such as automating infrastructure, facilitating collaboration, documenting infrastructure, and keeping all infrastructure in a single source of truth.


You will need the following items before getting started with Terraform code:
<br />

1. Spectro Cloud API key to authenticate and interact with the Palette API endpoint. The following sub-section outlines the steps to create a new API key. 

2. Palette project name where you will deploy your resources. For most users, you can use the **Default** project. 

3. Virtual IP address for your Edge cluster. 

4. Three Edge host IDs, similar to `edge-97f2384233b498f6aa8dec90c3437c28`, one for the master pool node and two for worker pool nodes. 


## Create Spectro Cloud API Key

To create a new API key, log in to [Palette](https://console.spectrocloud.com), click on the user **User Menu** at the top right, and select **My API Keys**, as shown in the screenshot below. 

<br />

![Screenshot of generating an API key in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_generate-api-key.png )

<br />

Palette will present you with a pop-up box and ask for details, such as the API key name and expiration date. Fill in the required fields, and confirm your changes. Copy the key value to your clipboard for the next step. 

<br />

## Checkout Starter Code

The Terraform code for the current section is available in our official tutorials container, and you will have to provide values for a few Terraform input variables before executing the Terraform commands. Therefore, start the container, and open a bash session to view the starter code.
<br />

```bash
docker run --name tutorialContainer --publish 7000:5000 --interactive --tty ghcr.io/spectrocloud/tutorials:1.0.6 bash
```

If port 7000 on your local machine is unavailable, you can use any other port you choose. 

Once you have opened a bash session into the tutorials container, change to the **/terraform/edge-tf** directory, which contains the Terraform code for this tutorial. 
<br />

```bash
cd /terraform/edge-tf
```
<br />

## Review Terraform Files

We recommend that you explore all Terraform files and read through this [README](https://github.com/spectrocloud/tutorials/tree/main/terraform/edge-tf/README.md) before executing the commands ahead. Below is a high-level overview of each file:
<br />

- **provider.tf** contains the provider configuration and version.

-  **profile.tf** contains the configuration for the `spectrocloud_cluster_profile` resource. The cluster profile is made up of the following core layers and [Hello Universe](https://github.com/spectrocloud/hello-universe#readme) application as an add-on layer. The Hello Universe application manifest is available in the **manifests/hello-universe.yaml** file.  

  |**Layer**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |OS|Public Repo|BYOS Edge OS|`1.0.0`|
  |Kubernetes|Public Repo|Palette Optimized K3s|`1.25.x`|
  |Network|Public Repo|Calico|`3.25.x`|

  Here is a brief explanation of each of the core layers. 

    - The OS layer references to the manifest defined in the **manifests/custom-content.yaml** file. This file contains the following custom attributes to pull the provider image from the *ttl.sh* image registry. Recall that CanvOS returned these attributes after building the Edge artifacts. The `system.xxxxx` attribute values are as same as what you defined in the **.arg** file while building the Edge artifacts. You must verify and change these attributes' values, as applicable to you, before using them in your cluster profile.     
    <br />

    ```yaml hideClipboard
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
      system.peVersion: v3.4.3
      system.customTag: demo
      system.osVersion: 22
    ``` 

    - For Kubernetes layer, this example uses Palette Optimized K3s version 1.25.x because you pushed a provider image compatible with K3s v1.25.2 to the *ttl.sh* image registry earlier in this tutorial. BYOOS pack's `system.uri` attribute will reference the Kubernetes version you select using the `{{ .spectro.system.kubernetes.version }}` [macro](/clusters/cluster-management/macros).

    - For the network layer, this example uses the Calico v3.25.x Container Network Interface (CNI). However, you can choose a different CNI pack that fits your needs, such as Flannel, Cilium, or Custom CNI. 
    <br /> 

-  **cluster.tf** contains the configuration for the `spectrocloud_cluster_edge_native` resource, such as the cluster's virtual IP and machine pool configuration. The cluster resource depends upon the `spectrocloud_cluster_profile` resource. 


- **data.tf** contains the data resource definition, such as pre-defined layer names and versions, to retrieve from Palette dynamically. 


- **inputs.tf** contains the list of all variables used in the tutorial, such as the name of cluster profile, cluster, and declarations for all other user-defined variables. Some variables have a default value, but you *must* provide the values for those marked with a `#ToDo` tag, in a separate file, **terraform.tfvars**. 


## Provide Input Variables

The **terraform.tfvars** file contains the following user-defined variables. You *must* provide a value for each one of them. 
<br />

  - `sc_api_key` holds the Spectro Cloud API Key. Provide the API key you created in the previous step. 
  - `sc_project_name` declares the Palette project name. The default project name is "Default`. Change the default value if you want to deploy your cluster in a different project. 
  - `sc_vip` saves the cluster's virtual IP. Provide value as you desire. 
  - `sc_host_one`, `sc_host_two`, and `sc_host_three` contain the Edge host IDs for three hosts, similar to `edge-97f2384233b498f6aa8dec90c3437c28`, one for the master pool node and two for worker pool nodes. Provide the Edge host IDs as you received after provisioning VMs in one of the previous steps. 
  <br />

Open the **terraform.tfvars** file in an editor.
<br />

```bash
vi terraform.tfvars
```

Specify values for the following variables marked with the `"REPLACE ME"` placeholder. The inline comments show an example value for each variable. 
<br />

```bash
sc_api_key      = "REPLACE_ME"            # Example: "Weoh2xxxxxxxXXXXXXXxxxxx"
sc_project_name = "REPLACE_ME"            # Example: "Default"
sc_vip          = "REPLACE_ME"            # Example: "10.10.146.146"
sc_host_one     = "REPLACE_ME"            # Example: edge-ae4c3842a651f6e671cca5901b831edf
sc_host_two     = "REPLACE_ME"
sc_host_three   = "REPLACE_ME"
```
<br /> 

## Deploy Terraform

After you update the **terraform.tfvars** file and, carefully review the other files, initialize the Terraform provider.
<br />

```bash
terraform init
```

The `init` command downloads plugins and providers from the **provider.tf** file. Next, preview the resources Terraform will create. 
<br />

```bash
terraform plan
```

The output displays the resources Terraform will create in an actual implementation. 
<br />

```bash hideClipboard
# Output condensed for readability
Plan: 2 to add, 0 to change, 0 to destroy.
```

Finish creating all the resources. 
<br />

```bash
terraform apply -auto-approve
```

It can take up to 20 minutes to provision the cluster. When cluster provisioning completes, the following message displays. 
<br />

```bash hideClipboard
# Output condensed for readability
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```
<br /> 

</Tabs.TabPane>

</Tabs>

# Validate

In Palette, navigate to the left **Main Menu** and select **Clusters**. Choose your cluster to display the cluster **Overview** page and monitor cluster provisioning progress.  


When cluster status displays **Running** and **Healthy**, you can access the application from the exposed service URL with the port number displayed. One random port between 30000-32767 is exposed for the Hello Universe application. Click on the port number to access the application.

The screenshot below highlights the NodePort to access the application.

![Screenshot of highlighted NodePort to access the application.](/tutorials/edge/clusters_edge_deploy-cluster_access-service.png)



Clicking on the exposed NodePort will take you to the Hello Universe application. 
<br />

<WarningBox>

We recommend waiting to click on the service URL, as it takes one to three minutes for DNS to properly resolve the public NodePort URL. This prevents the browser from caching an unresolved DNS request.

</WarningBox>


![Screenshot of successfully accessing the Hello Universe application.](/tutorials/edge/clusters_edge_deploy-cluster_hello-universe.png)


You have successfully provisioned an Edge cluster and deployed the Hello Universe application on it. 

<br />

# Cleanup

The following steps will guide you in cleaning up your environment, including the cluster, cluster profile, and Edge hosts. Follow the steps for Palette if you used Palette to deploy the cluster. Use Terraform commands to delete the cluster if you used Terraform for deployment. 
<br />

<Tabs>

<Tabs.TabPane tab="Palette UI" key="palette_ui_delete">

<br />

##  Delete the Cluster and Profile using Palette UI

To delete the cluster, view the cluster details page. Click on the **Settings** button to expand the **drop-down Menu**, and select the **Delete Cluster** option, as shown in the screenshot below


![Screenshot of deleting a cluster.](/tutorials/edge/clusters_edge_deploy-cluster_delete-cluster.png)


Palette will prompt you to enter the cluster name and confirm the delete action. Type the cluster name to proceed with the delete step. The cluster status will turn to **Deleting**. Deletion takes up to 10 minutes.


After you delete the cluster, click **Profiles** on the left **Main Menu**, and select the profile to delete. Choose the **Delete** option in the **three-dot Menu**, as shown in the screenshot below.


![Screenshot of deleting a cluster profile.](/tutorials/edge/clusters_edge_deploy-cluster_delete-profile.png)


Please wait until Palette deletes the resources successfully. 
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Terraform" key="terraform_ui_delete">

<br />

##  Delete the Cluster and Profile using Terraform

Switch back to the tutorials container. If you have closed the terminal session, you can reopen another bash session in the tutorials container using the following command. 
<br />

```bash
docker exec -it tutorialContainer bash
``` 

Issue the following command from within the **/terraform/edge-tf** directory.
<br />

```bash
terraform destroy -auto-approve
```

Wait for the resources to clean up. Deleting the Terraform resources may take up to 10 minutes. 
<br />

```bash hideClipboard
# Output condensed for readability
Destroy complete! Resources: 2 destroyed.
```

Exit from the tutorials container to come back to the Linux development environment.
<br />

```bash
exit
```


<br />

</Tabs.TabPane>

</Tabs>

##  Delete Edge Hosts

Switch back to the **CanvOS** directory in the Linux development environment containing the **.goenv** file, and use the following command to delete the Edge hosts. 
<br />

```bash
docker run -it --rm --env-file .goenv \
  ghcr.io/spectrocloud/tutorials:1.0.6 \
  sh -c "cd edge/vmware/clone_vm_template/ && ./delete-edge-host.sh"
```

Also, delete the **palette-edge-installer.iso** file from the **packer_cache/** directory in the VMWare vCenter datastore.

##  Delete Edge Artifacts

If you further want to delete Edge artifacts from your Linux development environment, delete the Edge installer ISO image and its checksum by executing the following commands from the **CanvOS/** directory.
<br />

```bash
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```

Issue the following command to list all images in your current development environment.
<br />

```bash
docker images
```

Note the provider image name and tags, and use the following command syntax to remove all provider images.

<br />

```bash
docker image rm -f ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo
docker image rm -f ttl.sh/ubuntu:k3s-1.24.6-v3.4.3-demo
```
<br /> 

# Wrap-Up

The core component of preparing Edge hosts and deploying Palette-managed Edge clusters is building and utilizing Edge artifacts. Edge artifacts consist of an Edge installer ISO and provider images for all the Palette-supported Kubernetes versions. An Edge installer ISO assists to prepare the Edge hosts, while the provider image is referred to in the cluster profile. 

In this tutorial, you learned how to build Edge artifacts, prepare VMWare VMs as Edge hosts using Edge installer ISO, create a cluster profile referencing a provider image, and deploy a cluster.

Palette's Edge solution allows you to prepare your Edge hosts with the desired OS, dependencies, and user data configurations. It supports multiple Kubernetes versions while building the Edge artifacts and creating cluster profiles, enabling you to choose the desired Kubernetes version for your cluster deployment. Before you plan a production-level deployment at scale, you can prepare a small set of Edge devices for development testing and validate the devices' state and installed applications. Once the validation is satisfactory and meets your requirements, you can roll out Edge artifacts and cluster profiles for deployment in production. This approach maintains consistency while deploying Kubernetes clusters at scale across all physical sites, be it 1000 or more sites. In addition to all these benefits, you can conveniently manage the entire lifecycle of Edge clusters with Palette.

To learn more about Edge,  check out the resources below.
<br />

- [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos)


- [Build Content Bundle](/clusters/edge/edgeforge-workflow/build-content-bundle)


- [Model Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile)


- [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)


- [Perform Site Install](/clusters/edge/site-deployment/site-installation)