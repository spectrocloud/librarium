---
title: "Deploy Edge Cluster"
metaTitle: "Deploy Edge Cluster on VMWare VMs"
metaDescription: "Learn how to use the Edge installer ISO image to prepare Edge hosts, create a cluster profile using the provider OS image, and deploy a cluster on those Edge hosts."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from "shared/components/common/PointOfInterest";

# Deploy Edge Cluster
Deploying a Kubernetes (K3s) cluster on Edge requires all hosts to be ready with the required dependencies, user data configurations, and an operating system (OS). 

In cases where multiple Edge devices require the same configuration, it is challenging for the IT/Site operations team to ensure scale consistency regarding dependencies, user data configurations, and the OS. For example, imagine you are an IT administrator for a retail company that has decided to expand to 1000 new stores this year. Your job is to deploy K3s clusters on Edge for each new store. Assuming all Edge devices have the same configuration, you must prepare all Edge devices so the development/infrastructure team can deploy clusters on all those devices.


Here are the primary stages of deploying a K3s cluster on Edge in production:  

- IT administrators build the Edge artifacts - an installer ISO and the provider OS image. 

- Site operators prepare Edge devices with the installer ISO and identify the additional user data to install on those hosts.

- The development/infrastructure team prepares a cluster profile using the provider OS image and deploys the clusters.


In this tutorial, you will generate Edge artifacts, prepare Edge hosts, and deploy a K3s cluster on those hosts. 


Setting up Virtual Machines (VMs) as Edge hosts and deploying the K3s cluster on those VMs is a less complex path to learning and gaining experience with Edge due to not having to connect to a physical Edge device. Therefore, this tutorial uses VMWare VMs as Edge hosts to test the installer ISO image's ease of use for consistent deployments across all sites in production. 


The diagram below shows the main steps to prepare Edge hosts and deploy a cluster.


![An overarching diagram showing the tutorial workflow.](/tutorials/edge-native/clusters_edge_deploy-cluster_overarching.png)


# Prerequisites
To complete this tutorial, you will need the following items:
<br/>

* VMWare vCenter details where you will provision VMs as Edge hosts. You will need the server URL, login credentials, and names of the data center, data store, resource pool, folder, cluster, and network.


* A physical or virtual Linux machine with *AMD64* (also known as *x86_64*) processor architecture to build the Edge artifacts. You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```
  <br />

  <WarningBox>

  The Linux machine should have connectivity to your VMWare vCenter. 

  </WarningBox>

* Minimum hardware configuration of the Linux machine:
  - 4 CPU
  - 8 GB memory
  - 50 GB storage
 

* [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version` command.


* [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version` command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to create privileged containers.   


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).


* Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to generate a new registration token. For detailed instructions, refer to the [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide. Copy the newly created token to a clipboard or notepad file to use later in this tutorial. 

  The screenshot below shows a sample registration token in the **Tenant Settings** > **Registration Tokens** section in Palette. 

  ![A screenshot of a registration token in Palette](/tutorials/edge-native/clusters_edge_deploy-cluster_registration-token.png)



# Clone GitHub Repositories
Use the following instructions on your Linux machine to create all the required Edge artifacts. 

Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code for building Edge artifacts.  
<br />

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```


Clone the [Tutorials](https://github.com/spectrocloud/tutorials.git) repository containing the starter code and tools for building a VM template and provision/delete VMs. 
<br />

```bash
git clone https://github.com/spectrocloud/tutorials.git
```


# Build Edge Artifacts

In this section, you will use the utility, [CanvOS](https://github.com/spectrocloud/CanvOS/blob/main/README.md), to build an Edge installer ISO image and provider images for all the Palette-supported Kubernetes versions. The utility builds multiple provider images, so you can use either one that matches the desired Kubernetes version you want to use with your cluster profile.

## Checkout the Starter Code
To get started, change to the **CanvOS** directory.
<br />

```bash
cd CanvOS
```

View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).
<br />

```bash
git tag
```

Check out the repository tag that closely matches your Palette product version. Your Palette product version is displayed in the top left corner, as shown in the screenshot below. 

![Screenshot displaying the Palette product version.](/tutorials/palette-canvos/clusters_edge_palette-canvos_palette-version.png)

You must check out a matching git tag so the Edge installer you generate will be compatible with your Palette product version. This guide uses **v3.4.3** tag as an example. 
<br />

```shell
git checkout v3.4.3
```

## Review Arguments
Review the files relevant for this guide. 
  - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process. 
  - **Dockerfile** - Embeds the arguments and other configurations in the image.
  - **Earthfile** - Contains a series of commands to create target artifacts.
  - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
  - **user-data.template** - A sample user-data file.


The **.arg.template** sample file contains customizable arguments, such as image tag, registry, repository, and OS distribution. This guide uses the default values for all arguments, for example, the operating system as `ubuntu` and the tag as `demo`. As a result, the provider OS image will name as `ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo`. Refer to the [Build Edge Artifacts](/clusters/edge/palette-canvos) guide to learn more about customizing arguments, Dockerfile, and the user data.


Rename the sample **.arg.template** file to **.arg**. 
<br />

```bash
mv .arg.template .arg
```


## Create User Data
Next, you will create a **user-data** file that embeds the Edge host's login credentials and registration token in the Edge Installer ISO image.  


Issue the command below to save your tenant registration token to a local variable. Replace `[your_token_here]` with your actual registration token. 
<br />

```bash
export token=[your_token_here]
```
<br />
  
Use the following command to create the **user-data** file containing the tenant registration token. Also, you can click on the *Points of Interest* numbers below to learn more about the main attributes relevant to this example. 

<br />

<PointsOfInterest
  points={[
    {
      x: 370,
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

This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Save the output attributes to use later in the Cluster Profile.
<br />

## View Artifacts
List the edge installer ISO image and checksum by issuing the following command from the **CanvOS** directory.
<br />

```bash
ls build/
```

```bash
# Output
palette-edge-installer.iso      
palette-edge-installer.iso.sha256
```

Export the path to the ISO file, the **build** directory, in the `ISOFILEPATH` environment variable. Later in the tutorial, you will use this environment variable to bind mount the **build** directory to a Docker container. 
<br />

```bash
export ISOFILEPATH=$PWD/build
echo $ISOFILEPATH
```


List the Docker images to review the provider OS images created. By default, provider images for all the Palette's Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag value you used in the  **.arg** file's `CUSTOM_TAG` variable. 
<br />

```shell
docker images --filter=reference='*/*:*demo'
```

```bash coloredLines=3-4
# Output
REPOSITORY      TAG                      IMAGE ID       CREATED          SIZE
ttl.sh/ubuntu   k3s-1.24.6-v3.4.3-demo   3a672a023bd3   45 minutes ago   4.61GB
ttl.sh/ubuntu   k3s-1.25.2-v3.4.3-demo   0217de3b9e7c   45 minutes ago   4.61GB
```
<br />


# Push Provider Images
To use the provider OS images in your cluster profile, push them to the image registry mentioned in the **.arg** file. The current example and default behavior uses the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does not require a sign-up. Images pushed to *ttl.sh* are ephemeral and will expire after the 24 hrs time limit.  


Use the following commands to push the provider OS image to the *ttl.sh* image registry.  
<br />

```bash
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo
docker push ttl.sh/ubuntu:k3s-1.24.6-v3.4.3-demo
```
<br />

<WarningBox>

As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider OS images in your cluster profile within 24 hours of pushing to *ttl.sh*, they will expire and must be re-pushed. Refer to the Advanced workflow in the current guide to learn how to use another registry, such as Docker Hub, and tag the docker images accordingly.

</WarningBox>
<br />


The next step is provisioning VMs as Edge hosts to test the Edge installer ISO image. 
<br />

# Provision Virtual Machines
In this section, you will provision VMs as Edge hosts using the existing Packer and Go templates. However, it requires [Packer](https://www.packer.io/) and [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) installed on your Linux machine. 

To make it convenient, we offer you a Docker container environment pre-configured with the necessary tools. The container will use the generated installer ISO artifact, existing tools (Packer, GOVC), and scripts to provision/delete VMs in VMWare vCenter. You will use Packer to generate a VM template and GOVC to communicate with VMWare vCenter.


In this section, you will create a tutorial container within your Linux machine. 

## Create a Container
Change to the **tutorials/** directory.
<br />

```bash
cd ../tutorials
```

Use the command below to build the `tutorials` image. This Docker image will be pre-configured with the necessary tools for this tutorial.  
<br />

```bash
docker build --build-arg PALETTE_VERSION=3.3.0 --build-arg PALETTE_CLI_VERSION=3.3.0 -t tutorials .
```


Next, before you create a container from the image you ve just built, issue the following command to ensure the `ISOFILEPATH` variable has the correct path. Recall that the path to the directory containing your ISO file is stored in the `ISOFILEPATH` environment variable. 
<br />

```bash
echo $ISOFILEPATH
```

<InfoBox>

The environment variable set using `export [var-name]=[var-value]` will not persist across terminal sessions. If you have opened a new terminal session in your development environment, you will lose the `ISOFILEPATH` variable and have to set it again.  

</InfoBox>


Next, you will bind mount the directory in the Linux machine containing your ISO file with the **/edge-native/vmware/packer/build** directory in the container. 


After verifying the value of the `ISOFILEPATH` variable, issue the following command to create a container from the `tutorials` image and open a bash session into it.
<br />

```bash
docker run --name tutorialContainer --interactive --tty --volume "${ISOFILEPATH}:/edge-native/vmware/packer/build" tutorials
```

The command above will keep STDIN open, bind mount the directory containing your ISO file to the **/edge-native/vmware/packer/build** directory in the container, and 
allocate a pseudo-TTY to open a bash session into the tutorials container. 

## Create a VM Template
In the tutorials container bash session, define a new file, **.env**, to hold the environment variables to use later in the tutorial.
<br />

```bash
touch .env && vi .env
```

Save the following vCenter environment details in the **.env** file. Enter values for all variables that are marked `"Enter a value"`. This file also creates Packer environment variables, in the `PKR_VAR_[name]` format, pointing to the default environment variables. 
<br />

```bash
export vcenter_server="Enter a value"       # Example: vcenter.spectrocloud.dev
export vcenter_username="Enter a value"
export vcenter_password="Enter a value"
export vcenter_datacenter="Enter a value"
export vcenter_datastore="Enter a value"
export vcenter_resource_pool="Enter a value"
export vcenter_folder="Enter a value"
export vcenter_cluster="Enter a value"
export vcenter_network="Enter a value"

export PKR_VAR_vcenter_server=${vcenter_server}
export PKR_VAR_vcenter_username=${vcenter_username}
export PKR_VAR_vcenter_password=${vcenter_password}
export PKR_VAR_vcenter_datacenter=${vcenter_datacenter}
export PKR_VAR_vcenter_datastore=${vcenter_datastore}
export PKR_VAR_vcenter_resource_pool=${vcenter_resource_pool}
export PKR_VAR_vcenter_folder=${vcenter_folder}
export PKR_VAR_vcenter_cluster=${vcenter_cluster}
export PKR_VAR_vcenter_network=${vcenter_network}
```

Once the **.env** file is ready, execute the following commands to source the environment variables. 
<br/>

```bash
source .env
```

After declaring the environment variables, change to the **packer/** directory.
<br />

```bash
cd edge-native/vmware/packer/
```
This directory has the following files required for Packer build.  
<br />

```bash
.
├── build
│   ├── palette-edge-installer.iso
│   └── palette-edge-installer.iso.sha256
├── build.pkr.hcl
└── vsphere.hcl
```

Packer uses the environment variables you have defined in the **.env** file above. If your target environment differs from what you have already defined in the **.env** file, you can redefine those variables in the **vsphere.hcl** file again. Below is the default file content. It contains the VM template name, VM configuration, and ISO file name from the previous steps. 

Review **vsphere.hcl** file content.
<br />

```bash
# Virtual Machine Settings
########### DO NOT EDIT #################
# VM Template Name
vm_name          = "palette-edge-template"

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

After reviewing and verifying the details in the **vsphere.hcl** file, use the following command to create a VM template using Packer. In this command, `--var-file` option is used to input the file containing the variable, and `-force` flag to destroy the existing template, if any. 
<br />

```bash
packer build -force --var-file=vsphere.hcl build.pkr.hcl
```

The build process can take up to 7-10 minutes to finish depending on your machine's and network configuration. After the build process is successful, it will create a VM template in the VMWare vCenter data store. 

```bash coloredLines=10-11
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

## Provision VMs
Once the VM template is ready, you can clone it to provision as many VMs as you need. The next steps will use the [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) tool to clone the VM template and provision VMs. 

Change to the **clone_vm_template/** directory.
<br />

```bash
cd ../clone_vm_template/
```

This directory contains the following files for GOVC utility. 

```bash
.
├── delete-edge-host.sh
├── deploy-edge-host.sh
└── setenv.sh
```
You will use **deploy-edge-host.sh** and **delete-edge-host.sh** files to deploy and delete the VMs, respectively, in the later steps. The **setenv.sh** file declares the GOVC environment variables for the target vCenter environment, the number of VMs to provision, a prefix string for the VM name, and the VM template name. 

Most of the GOVC environment variables point to the default environment variables you have defined in the **.env** file above. However, you must provide a value for the number of VMs to provision and a prefix string for the VM name. Use the following command to open **setenv.sh** file in an editor to provide a value for `NO_OF_VMS` and `VM_PREFIX` variables. 
<br />

```bash
vi setenv.sh
```

The value for the `NO_OF_VMS` variable is set to create three VMs by default. If you have limited resources, just one VM is sufficient to complete this tutorial. The value for the `VM_PREFIX` variable should be alphanumeric and lowercase. 
<br />

```bash
#!/bin/bash

# GOVC environment variables
# vCenter Endpoint
export GOVC_URL="https://${vcenter_server}"     # Use HTTPS. For example, https://vcenter.company.com
export GOVC_USERNAME="${vcenter_username}"
export GOVC_PASSWORD="${vcenter_password}"
export GOVC_INSECURE=1 #1 if insecure
export GOVC_DATACENTER="${vcenter_datacenter}"
export GOVC_DATASTORE="${vcenter_datastore}"
export GOVC_NETWORK="${vcenter_network}"
export GOVC_RESOURCE_POOL="${vcenter_resource_pool}"
export GOVC_FOLDER="${vcenter_folder}"
# Number of VMs to provision
export NO_OF_VMS=3
export VM_PREFIX="demo"
export INSTALLER_TEMPLATE="palette-edge-template"
```

Review and save the **setenv.sh** file, and execute the **deploy-edge-host.sh** script to provision the VMs.
<br />

```bash
./deploy-edge-host.sh
```

```bash coloredLines=7-7
# Sample output for one VM
Cloning /Datacenter/vm/sp-sudhanshu/palette-edge-template to demo-1...OK
Cloned VM demo-1
Powering on VM demo-1
Powering on VirtualMachine:vm-9919... OK
Getting UUID demo-1
Edge Host ID   VM demo-1 : edge-97f2384233b498f6aa8dec90c3437c28
```
The output on the terminal also displays the Edge host ID. VMs will use this host ID to auto-register themselves with Palette. 
<br />

<InfoBox>

Copy the Edge host ID for future reference and manual registration if the auto registration does not work later in this tutorial. 

</InfoBox>

## Verify Host's Registration
After provisioning, VMs will automatically register themselves with Palette, if you have correctly embedded the registration token in the ISO image.

Log back into Palette, and navigate to the left **Main Menu** > **Clusters** > **Edge Hosts** tab. You should see the VMs registered with Palette automatically.

![A screenshot showing the VMs registered with Palette automatically. ](/tutorials/edge-native/clusters_edge_deploy-cluster_edge-hosts.png)

<InfoBox>

If you do not see your Edge hosts registered with Palette automatically, you can register the hosts using the Edge host ID manually. Click on the **Add Edge Hosts** button, and paste the Edge host ID returned after issuing the `./deploy-edge-host.sh` command in one of the previous steps.

</InfoBox>
<br />

# Deploy a Cluster
After building the Edge native artifacts and provisioning VMs as Edge hosts, the next step is to create a cluster profile and deploy a cluster. 

## Create a Cluster Profile
Switch to the **Default** project scope for creating a cluster profile.  
<br />

![A screenshot of the Palette Default scope.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_default-scope.png)

<br />

Select the **Profile** section in the left **Main Menu** to create a cluster profile made up of the core infrastructure layers and a manifest of a sample Kubernetes application, [Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe). 


Click on the **Add Cluster Profile** button, and provide the details in the wizard that follows. The wizard displays the following sections. 
<br />

### Basic Information
Use the following values in the **Basic Information** section. 

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
In the **Cloud Type** section, choose **Edge Native** as the infrastructure provider for this tutorial, and click on **Next** at the bottom to move on to the next section.   
<br />

### Profile Layers
In the **Profile Layers** section, first add the following OS layer.

|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|OS|Public Repo|BYOS Edge OS|`1.0.0`|

To use one of the provider OS images you pushed to the *ttl.sh* image registry earlier in this tutorial, add the following custom content within the `options` attribute of the **OS layer**.    
<br />

```yaml
options:
  system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: ttl.sh
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v3.3.3
  system.customTag: demo
  system.osVersion: 22
```
The values of the parameters above should be as same as the values defined in the arguments defined in the  **.arg** file while generating the Edge artifacts earlier in this tutorial. You must verify and change these attributes' values, as applicable to you, before using them in your cluster profile. 
<br />

<WarningBox>

As a second reminder, *ttl.sh* is a short-lived image registry. If you do not use the provider OS images in your cluster profile within 24 hours of pushing to *ttl.sh*, they will no longer exist and must be re-pushed.

</WarningBox>
<br />

The screenshot below shows custom content added to the OS layer of a cluster profile.
<br />

![A screenshot of k3s OS layer in a cluster profile.](/tutorials/edge-native/clusters_edge_deploy-cluster_edit-profile.png)


Click on the **Next layer** button to add remaining core layers, Kubernetes and Network. 


|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|Kubernetes|Public Repo|Palette Optimized K3S|`1.25.x`|
|Network|Public Repo|Calico|`3.25.x`|


As you add each layer, click on the **Next layer** button. After you add the **Network** layer, click on the **Confirm** button to complete the core infrastructure stack. Palette displays the newly created infrastructure profile as a layered diagram. 


Next, click on the **Add Manifest** button to add the *Hello Universe* application manifest.  

![A screenshot of the add Manifest button.](/tutorials/edge-native/clusters_edge_deploy-cluster_add-manifest.png)

Use the following values to add the manifest metadata.  

|**Field** |**Value**|
|---|---|
|Layer name| hello-universe|
|Layer values (Optional)|Leave default|
|Install order (Optional)|Leave default|
|Manifests|Add new manifest, and name it `hello-universe`|

Entering `hello-universe` file name in the **Manifest** field will open a blank file in Palette's text editor. Copy the following manifest and paste it in Palette's text editor. The manifest below defines two Kubernetes objects:
1. **Deployment**: 
It pulls a public image, **ghcr.io/spectrocloud/hello-universe:1.0.12**,  and creates a ReplicaSet to bring up two pods running the `hello-universe` application.


2. **Service**: It uses NodePort to expose the `hello-universe` application running on each Node at a random port between 30000-32767. 
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
          image: ghcr.io/spectrocloud/hello-universe:1.0.12     # Static image 
          imagePullPolicy: IfNotPresent
          ports:
          - containerPort: 8080
  ```


  ![A screenshot of Hello Universe application manifest.](/tutorials/edge-native/clusters_edge_deploy-cluster_add-manifest-file.png)


Click on the **Confirm & Create** button to finish adding the manifest. If there are no errors or compatibility issues, Palette displays the newly created full cluster profile. Verify the layers you added, and click on the **Next** button. 



### Review
Review once more and click **Finish Configuration**  to create the cluster profile. 
<br />

## Create a Cluster
From the **Profile** page,  click on the newly created cluster profile to view its details page. Palette displays all the layers and allows you to edit any of them. 
<br />

![Screenshot of the Profile Layers success.](/tutorials/edge-native/clusters_edge_deploy-cluster_profile-success.png)

Click on the **Deploy** button and refer to the [Create an Edge Native Host Cluster](/clusters/edge/site-deployment/site-installation/cluster-deployment) guide to deploy a new Edge cluster. The cluster deployment wizard will display the following sections. 

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
The **Parameters** section allows you to change the profile configurations. For example, clicking on the **BYOS Edge OS 1.0.0** layer allows you to configure the `system.registry`, `system.repo`, and other available parameters. 

Keep the default values for all layers and click **Next**.
<br />

### Cluster config
Provide the Virtual IP (VIP) address for the host cluster to be used by the physical site during the cluster configuration process. You can optionally select an SSH key to remote into the host cluster and provide a Network Time Protocol (NTP) server list, if available, with you.  

Click **Next** to continue.    
<br />

### Nodes config
In the **Nodes config** section, provide details for the master pool. 

|**Field** | **Value for the master-pool**| 
|---| --- | 
|Node pool name| master-pool | 
|Allow worker capability| Checked | 
|Additional Labels (Optional) | None |
|[Taints](/clusters/cluster-management/taints/)|Off|
|Pool Configuration > Edge Hosts | Choose one or more registered Edge hosts.<br />Palette will automatically display the Nic Name for the selected host. |


![Screenshot of adding an Edge host to the master pool.](/tutorials/edge-native/clusters_edge_deploy-cluster_add-master-node.png)


Similarly, provide details for the worker pool, if you have Edge hosts remaining with you. Otherwise, remove the worker pool. Your master pool has the worker capability already. 

|**Field** | **Value for the worker-pool**| 
|---| --- | 
|Node pool name| worker-pool | 
|Additional Labels (Optional) | None |
|Taints|Off|
|Pool Configuration > Edge Hosts | Choose one or more registered Edge hosts. |

Click **Next** to continue.    
<br /> 

### Settings 
The **Settings** section displays options for OS patching, scheduled scans, scheduled backups, cluster role binding, and location. Use the default values, and click on the **Validate** button.      
<br /> 

### Review
Review all configurations in this section. The **Review** page displays the cluster name, tags, node pools, and layers. If everything looks good, click on the **Finish Configuration** button to finish deploying the cluster. Deployment may take up to *20 minutes* to finish. 

While deployment is in progress, Palette displays the cluster status as **Provisioning**. While you wait for the cluster to finish deploying, you can explore the various tabs on the cluster details page, such as **Overview**, **Workloads**, and **Events**. 
<br /> 


# Validate
In Palette, navigate to the left **Main Menu** and select **Clusters**. Next, select your cluster to display the cluster Overview page and monitor cluster provisioning progress.  


When cluster status displays **Running** and **Healthy**, you can access the application from the exposed service URL with the port number displayed. For the Hello Universe application, one of the random port random port between 30000-32767 is exposed. Click on the port number to access the application.

![Screenshot of highlighted NodePort to access the application.](/tutorials/edge-native/clusters_edge_deploy-cluster_access-service.png)

<br />

<WarningBox>

We recommend waiting to click on the service URL, as it takes one to three minutes for DNS to properly resolve the public NodePort URL. This prevents the browser from caching an unresolved DNS request.

</WarningBox>

Clicking on the exposed NodePort will take you to the Hello Universe application. 


![Screenshot of successfully accessing the Hello Universe application.](/tutorials/edge-native/clusters_edge_deploy-cluster_hello-universe.png "#width=70%")


You can also look at real-time metrics, such as CPU and memory consumption, in the cluster's **Overview** tab in Palette. 

![Screenshot of cluster metrics.](/tutorials/edge-native/clusters_edge_deploy-cluster_metrics.png)

You have successfully provisioned an Edge cluster and deployed the Hello Universe application on it. 

<br />

# Cleanup
Delete the cluster, cluster profile, and the Edge hosts. 

The following steps will guide you in cleaning up your environment. Follow the steps for Palette if you used Palette to deploy the cluster. Use Terraform commands to delete the cluster if you used Terraform for deployment. 
<br />

<Tabs>

<Tabs.TabPane tab="Palette" key="palette_ui_delete">

<br />

##  Delete the Cluster and Profile using Palette
To delete the cluster, view the details page of the cluster. Click on the **Settings** button to expand the **drop-down Menu**, and select the **Delete Cluster** option. Palette prompts you to enter the cluster name and confirm the delete action. Type the cluster name to proceed with the delete step. 


![Screenshot of deleting a cluster.](/tutorials/edge-native/clusters_edge_deploy-cluster_delete-cluster.png)


The cluster status will turn to **Deleting**. Deletion takes up to 10 minutes.
<br />


After you delete the cluster, go ahead and delete the profile. From the left **Main Menu**, click **Profiles** and select the profile to delete. Choose the **Delete** option in the **three-dot Menu**. 


![Screenshot of deleting a cluster profile.](/tutorials/edge-native/clusters_edge_deploy-cluster_delete-profile.png)


Wait for the resources to clean up and ensure they are successfully deleted. 
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Terraform Code" key="terraform_ui_delete">

<br />

##  Delete the Cluster and Profile using Terraform
If you've used Terraform to deploy the cluster, switch back to the tutorials container, and issue the following command from within the **/terraform/pack-tf** directory:
<br />

```bash
terraform destroy -auto-approve
```

Wait for the resources to clean up. Deleting the Terraform resources may take up to 10 minutes. 
<br />

```bash
# Output condensed for readability
Destroy complete! Resources: 2 destroyed.
```

<br />

</Tabs.TabPane>

</Tabs>

<br />
To delete the Edge hosts, navigate back to the tutorials container environment. If you have closed the terminal session, you can reopen another bash session in the tutorials container using the following command. 
<br />

```bash
docker exec -it tutorialContainer bash
```
If your container is not active, you can reinstantiate the container using the following command. 
<br />

```bash
docker start `docker ps -q -l` && docker attach `docker ps -q -l`
```
Source the environment varibales again so that the deletion script could read the necessary values. 
<br />

```bash
source .env
```

Change to the **/edge-native/vmware/clone_vm_template** directory containing the **delete-edge-host.sh** script. 
<br />

```bash
cd /edge-native/vmware/clone_vm_template
```

Execute the script to remove all VMs at once. 
<br />

```bash
./delete-edge-host.sh
```

```bash
# Output
Cleaning Previous VMs on vSphere
Getting UUID demo-1
Deleted demo-1
```

Exit the container after deleting the VMs.
<br />

```bash
exit
```

To remove the container and the image from the development environment, issue the following command.
<br />

```bash
docker container rm --force tutorialContainer
```

<br /> 

# Wrap-Up