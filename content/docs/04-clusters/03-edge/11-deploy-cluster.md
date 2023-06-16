---
title: "Deploy Edge Cluster"
metaTitle: "Deploy Edge Cluster on VMWare VMs"
metaDescription: "Learn how to use the Edge installer ISO image to prepare Edge hosts, create a cluster profile using the provider image, and deploy a cluster on those Edge hosts."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from "shared/components/common/PointOfInterest";

# Deploy Edge Cluster
Deploying a Kubernetes (K3s) cluster on Edge requires all Edge devices to be ready with the required dependencies, user data configurations, and an operating system (OS). It becomes challenging for the IT/Site operations team to prepare Edge hosts if there are many devices. The challenge here is to ensure scale consistency regarding dependencies, user data configurations, and the OS on all those devices. 


For example, imagine you are an IT administrator for a retail company that has decided to expand to 1000 new stores this year. The company wants to deploy K3s clusters on Edge for each new store. Assuming all Edge devices have the same configuration, your job is to prepare all Edge devices so the development team can deploy clusters on all those devices. Here are the primary stages of deploying a K3s cluster on Edge in production:  

- IT administrators build the Edge artifacts - an installer ISO and the provider image. 

- Site operators prepare Edge devices with the installer ISO and identify the additional user data to install on those hosts.

- The development team prepares a cluster profile using the provider image and deploys the clusters.


In this tutorial, you will first build Edge artifacts (Edge installer ISO image and provider images) and use the installer ISO image to prepare Edge hosts. Next, you will use the provider image to create a cluster profile and then deploy a K3s cluster on those Edge hosts. 

The diagram below shows the main steps to prepare Edge hosts and deploy a cluster.


![An overarching diagram showing the tutorial workflow.](/tutorials/edge-native/clusters_edge_deploy-cluster_overarching.png)


Setting up Virtual Machines (VMs) as Edge hosts and deploying the K3s cluster on those VMs is a less complex path to learning and gaining experience with Edge due to not having to connect to a physical Edge device. Therefore, this tutorial uses VMWare VMs as Edge hosts to test the installer ISO image's ease of use for consistent deployments across all sites in production. 
 
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
Use the following instructions on your Linux machine. 

Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code for building Edge artifacts.  
<br />

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

# Build Edge Artifacts

In this section, you will use the [CanvOS](https://github.com/spectrocloud/CanvOS/blob/main/README.md) utility to build an Edge installer ISO image and provider images for all the Palette-supported Kubernetes versions. The utility builds multiple provider images, so you can use either one that matches the desired Kubernetes version you want to use with your cluster profile. 

The current tutorial will build and use the provider image compatible with K3s v1.25 as an example. 

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

Check out the newest available tag. This guide uses **v3.4.3** tag as an example. 
<br />

```shell
git checkout v3.4.3
```

## Review Arguments
Review the files relevant for the build process. 
  - **.arg.template** - A sample **.arg** file that defines customizable arguments to use during the build process. 
  - **Dockerfile** - Embeds the arguments and other configurations in the image.
  - **Earthfile** - Contains a series of commands to create target artifacts.
  - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
  - **user-data.template** - A sample user-data file.


The **.arg.template** sample file contains customizable arguments, such as image tag, registry, repository, and OS distribution. Rename the sample **.arg.template** file to **.arg** and review the arguments to use in the build process.
<br />

```bash
mv .arg.template .arg && cat .arg
```


CanvOS allows you to customize arguments defined in the **.arg** file. However, this tutorial will use the default values for all arguments, for example, the operating system as `ubuntu` and the tag as `demo`. As a result, the provider image will name as `ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo`. 

Refer to the [Build Edge Artifacts](/clusters/edge/palette-canvos) guide to learn more about customizing arguments, **Dockerfile**, and **user-data** .


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
# Output
palette-edge-installer.iso       
palette-edge-installer.iso.sha256
```


Export the path to the ISO file, the **build** directory, in the `ISOFILEPATH` local variable. Later in the tutorial, you will use this local variable to bind mount the **build** directory to a Docker container. 
<br />

```bash
export ISOFILEPATH=$PWD/build
echo $ISOFILEPATH
```


List the Docker images to review the provider images created. By default, provider images for all the Palette's Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag value you used in the  **.arg** file's `CUSTOM_TAG` variable. 
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


## Push Provider Images
To use the provider image in your cluster profile, push it to the image registry mentioned in the **.arg** file. The current example and default behavior uses the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does not require a sign-up. Images pushed to *ttl.sh* are ephemeral and will expire after the 24 hrs time limit.  


Use the following commands to push the provider image compatible with K3s v1.25 to the *ttl.sh* image registry.  
<br />

```bash
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo
```
<br />

<WarningBox>

As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider images in your cluster profile within 24 hours of pushing to *ttl.sh*, they will expire and must be re-pushed. Refer to the Advanced workflow in the current guide to learn how to use another registry, such as Docker Hub, and tag the docker images accordingly.

</WarningBox>
<br />


# Provision Virtual Machines
In this section, you will prepare a VM template using the Edge installer ISO image and provision VMs by cloning that VM template. Cloning the VM template will ensure the installation of the required dependencies and [user data](/clusters/edge/edge-configuration/installer-reference) configurations on the VMs. 

Creating a VM template needs [Packer](https://www.packer.io/), and cloning the VM template to provision VMs in VMWare vCenter needs [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) installed on your Linux machine. You do not have to install these tools (Packer, GOVC) on your Linux machine. Instead, this section will use Spectro Cloud's tutorials container as a jump host with already installed tools. 
<br />

## Create a VM Template
Use the following heredoc script to create a file, **.packerenv**, containing the VMWare vCenter details as environment variables. You will need the server URL, login credentials, and names of the data center, data store, resource pool, folder, cluster, and network. 
<br />

```bash
cat << EOF > .packerenv
PKR_VAR_vcenter_server=$(read -p 'Enter vCenter Server URL without http:// or https://, for example: vcenter.spectrocloud.dev ' vcenter_server && echo $vcenter_server)
PKR_VAR_vcenter_username=$(read -p 'Enter vCenter Username value: ' vcenter_username && echo $vcenter_username)
PKR_VAR_vcenter_password=$(read -p 'Enter vCenter Password value: ' vcenter_password && echo $vcenter_password)
PKR_VAR_vcenter_datacenter=$(read -p 'Enter vCenter Datacenter name: ' vcenter_datacenter && echo $vcenter_datacenter)
PKR_VAR_vcenter_datastore=$(read -p 'Enter vCenter Datastore name: ' vcenter_datastore && echo $vcenter_datastore)
PKR_VAR_vcenter_resource_pool=$(read -p 'Enter vCenter Resource Pool name: ' vcenter_resource_pool && echo $vcenter_resource_pool)
PKR_VAR_vcenter_folder=$(read -p 'Enter vCenter Folder name: ' vcenter_folder && echo $vcenter_folder)
PKR_VAR_vcenter_cluster=$(read -p 'Enter vCenter Cluster name: ' vcenter_cluster && echo $vcenter_cluster)
PKR_VAR_vcenter_network=$(read -p 'Enter vCenter Network name: ' vcenter_network && echo $vcenter_network)
EOF
```


The `docker run --env-file ...` command ahead will read in this file. 

Next, verify that the `ISOFILEPATH` local variable has the path to the ISO file. The `docker run` command uses this variable to bind mount the host's **build** directory to the container. 
<br />

```bash
echo $ISOFILEPATH
```

<InfoBox>

The environment variable set using `export [var-name]=[var-value]` will not persist across terminal sessions. If you have opened a new terminal session in your development environment, you will lose the `ISOFILEPATH` variable and have to set it again.  

</InfoBox>


Issue the following command to create a VM template in the VMWare vCenter. The `--env-file` option in the command below will read the environment file, `--volume ` option will mount the local directory to the **/edge-native/vmware/packer/build** directory in the container, and ultimately, it changes to the **edge-native/vmware/packer/** directory in the container and executes the `packer build ...` command to create the VM template. 
<br/>

```bash
docker run -it --rm --env-file .packerenv --volume "${ISOFILEPATH}:/edge-native/vmware/packer/build" ghcr.io/spectrocloud/tutorials:1.0.6 sh --cpu-shares  "cd edge-native/vmware/packer/ && packer build -force --var-file=vsphere.hcl build.pkr.hcl"
```

The build process can take up to 7-10 minutes to finish depending on your machine's and network configuration. After the build process is successful, it will create a VM template in the VMWare vCenter data store. 
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

In the `packer build` command above, the `--var-file` option accepts an environment file, and the `-force` flag destroys the existing template, if any. It uses the **vsphere.hcl** as the environment file that defines the VM template name, VM configuration, and ISO file name to use. 

Here is the **vsphere.hcl** file content for your reference; however, you do not have to modify these configuration in this tutorial.  
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

The **vsphere.hcl** file customization is out of the scope of this tutorial. To change these configurations, you must clone the [tutorials](https://github.com/spectrocloud/tutorials.git) repository and edit the **edge-native/vmware/packer/vsphere.hcl** file, rebuild the image using these [local build steps](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#local-builds) and use that image in the previous `docker run` command.  

</InfoBox>
<br />


## Provision VMs
Once the VM template is ready, you can clone it to provision VMs. Note that these VMs will act as Edge hosts during cluster deployment. The next steps will use the [GOVC](https://github.com/vmware/govmomi/tree/main/govc#govc) tool to clone the VM template and provision VMs. 


GOVC will also require the same VMWare vCenter details as environment variables, as you defined earlier in the **.packerenv** file. Use the following command to source the **.packerenv** file and echo one of the variables to ensure the variables are accessible on your host machine. 
<br />

```bash
source .packerenv
echo $PKR_VAR_vcenter_server
```

Use the following heredoc script to create a file, **.goenv**, containing the VMWare vCenter details as environment variables. The script will reuse the values sourced from the **.packerenv** file.
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


Issue the following command to clone the VM template and provision three VMs in the VMWare vCenter. The `--env-file` option in the command below will read the environment file. Then it changes to the **edge-native/vmware/clone_vm_template/** directory in the container and executes the **deploy-edge-host.sh** script to provision three VMs. 
<br />

```bash
docker run -it --rm --env-file .goenv ghcr.io/spectrocloud/tutorials:1.0.6 sh --cpu-shares  "cd edge-native/vmware/clone_vm_template/ && ./deploy-edge-host.sh"
```

The cloning process can take up to 3-4 minutes to finish, and display the following output.
<br />

```bash coloredLines=6-6 hideClipboard
# Sample output
Cloned VM demo-1
Powering on VM demo-1
Powering on VirtualMachine:vm-9919... OK
Getting UUID demo-1
Edge Host ID   VM demo-1 : edge-97f2384233b498f6aa8dec90c3437c28
```

The output on the terminal will display the Edge host ID for all VMs. VMs will use this host ID to auto-register themselves with Palette. 
<br />

<InfoBox>

Copy the Edge host ID for future reference and manual registration if the auto registration fails, for any reason, later in this tutorial. 

</InfoBox>


Note that the **edge-native/vmware/clone_vm_template/** directory in the container has the following files:
- **deploy-edge-host.sh** - Provisions the VMs.
- **delete-edge-host.sh** - Deletes the VMs.
- **setenv.sh** - Defines the GOVC environment variables, the number of VMs, a prefix string for the VM name, and the VM template name. Most of the GOVC environment variables point to the default environment variables you have defined in the **.goenv** file. 

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

The **setenv.sh** file customization is out of the scope of this tutorial. To change the number of VMs to provision, you must clone the [tutorials](https://github.com/spectrocloud/tutorials.git) repository and edit the **edge-native/vmware/clone_vm_template/setenv.sh** file, rebuild the image using these [local build steps](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#local-builds) and use that image in the previous `docker run` command. 
<br />


# Deploy a Cluster
After building the Edge artifacts and provisioning VMs as Edge hosts, the next step is to verify the host registration, create a cluster profile, and deploy a cluster. 
<br />

## Verify Host Registration
Ideally, VMs should automatically register with Palette if you correctly embed the registration token in the ISO image. Log back into Palette to verify, and navigate to the left **Main Menu** > **Clusters** > **Edge Hosts** tab. You should see the VMs registered with Palette automatically.

![A screenshot showing the VMs registered with Palette automatically. ](/tutorials/edge-native/clusters_edge_deploy-cluster_edge-hosts.png)


If you do not see your Edge hosts registered with Palette automatically, you can register the hosts using the Edge host ID manually. Click on the **Add Edge Hosts** button, and paste the Edge host ID returned after provisioning the VMs in one of the previous steps.
<br />

## Create a Cluster Profile
Switch to the **Default** project scope for creating a cluster profile.  
<br />

![A screenshot of the Palette Default scope.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_default-scope.png)

<br />

Select the **Profile** section in the left **Main Menu** to create a cluster profile comprising the core infrastructure layers and a manifest of a sample Kubernetes application, [Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe). 


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
In the **Profile Layers** section, first add the [BYOS Edge OS](/integrations/byoos) pack to the OS layer

|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|OS|Public Repo|BYOS Edge OS|`1.0.0`|

Replace the OS layer manifest with the following custom manifest so that the cluster profile can pull the provider image from the *ttl.sh* image registry. Recall that CanvOS returned the following custom manifest after building the Edge artifacts. The `system.xxxxx` attribute values in the manifest below are as same as what you defined in the **.arg** file while building the Edge artifacts. You must verify and change these attributes' values, as applicable to you, before using them in your cluster profile.     
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

![A screenshot of k3s OS layer in a cluster profile.](/tutorials/edge-native/clusters_edge_deploy-cluster_edit-profile.png)


<WarningBox>

As a second reminder, *ttl.sh* is a short-lived image registry. If you do not use the provider image in your cluster profile within 24 hours of pushing to *ttl.sh*, they will no longer exist and must be re-pushed.

</WarningBox>
<br />

Click on the **Next layer** button to add the following Kubernetes layer to your cluster profile. 


|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|Kubernetes|Public Repo|Palette Optimized K3s|`1.25.x`|


Choose the K3s version 1.25.x because you pushed the provider image compatible with K3s v1.25.2 to the *ttl.sh* image registry earlier in this tutorial. BYOOS pack's `system.uri` attribute will reference the Kubernetes version you select using the `{{ .spectro.system.kubernetes.version }}` [macro](/clusters/cluster-management/macros).


Click on the **Next layer** button, and add the following network layer. This example uses Calico Container Network Interface (CNI). However, you can choose a different CNI pack that fits your needs, such as Flannel, Cilium, or Custom CNI. 


|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|Network|Public Repo|Calico|`3.25.x`|


Finally, click on the **Confirm** button to complete the core infrastructure stack. Palette displays the newly created infrastructure profile as a layered diagram. 

Next, click on the **Add Manifest** button on the top to add the *Hello Universe* application manifest.  

![A screenshot of the add Manifest button.](/tutorials/edge-native/clusters_edge_deploy-cluster_add-manifest.png)

Use the following values to add the Hello Universe manifest metadata.  

|**Field** |**Value**|
|---|---|
|Layer name| hello-universe|
|Layer values (Optional)|Leave default|
|Install order (Optional)|Leave default|
|Manifests|Add new manifest, and name it `hello-universe`|

Entering `hello-universe` file name in the **Manifest** field will open a blank file in Palette's text editor. Copy the following manifest and paste it in Palette's text editor. 
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

The screenshot below shows the manifest pasted into the text editor. Click on the **Confirm & Create** button to finish adding the manifest. 

  ![A screenshot of Hello Universe application manifest.](/tutorials/edge-native/clusters_edge_deploy-cluster_add-manifest-file.png)

The manifest above defines two Kubernetes objects:
<br />

1. **Deployment**: 
It pulls a public image, **ghcr.io/spectrocloud/hello-universe:1.0.12**, and creates a ReplicaSet to bring up two pods for the `hello-universe` application.


2. **Service**: It uses NodePort to expose the `hello-universe` application on each Node at a random port between 30000-32767. 
<br />


If there are no errors or compatibility issues, Palette displays the newly created full cluster profile. Verify the layers you added, and click on the **Next** button. 
<br />

### Review
Review all layers and click **Finish Configuration** to create the cluster profile. 
<br />

## Create a Cluster
Click on the newly created cluster profile to view its details page. Palette displays all the layers again and allows you to edit any of them. Click on the **Deploy** button and refer to the [Create an Edge Native Host Cluster](/clusters/edge/site-deployment/site-installation/cluster-deployment) guide to deploy a new Edge cluster. 
<br />

![Screenshot of the Profile Layers success.](/tutorials/edge-native/clusters_edge_deploy-cluster_profile-success.png)

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

![Screenshot of adding an Edge host to the master pool.](/tutorials/edge-native/clusters_edge_deploy-cluster_add-master-node.png)


Similarly, provide details for the worker pool, and add the remaining two Edge hosts to the worker pool. If you do not have Edge hosts remaining, remove the worker pool. Your master pool has the worker capability already. 

|**Field** | **Value for the worker-pool**| 
|---| --- | 
|Node pool name| worker-pool | 
|Additional Labels (Optional) | None |
|Taints|Off|
|Pool Configuration > Edge Hosts | Choose one or more registered Edge hosts. |

Click **Next** to continue.    
<br /> 

### Settings 
This section displays options for OS patching, scheduled scans, scheduled backups, cluster role binding, and location. Use the default values, and click on the **Validate** button.      
<br /> 

### Review
Review all configurations in this section. The **Review** page displays the cluster name, tags, node pools, and layers. If everything seems good, click on the **Finish Configuration** button to finish deploying the cluster. Deployment may take up to *20 minutes* to finish. 

While deployment is in progress, Palette displays the cluster status as **Provisioning**. While you wait for the cluster to finish deploying, you can explore the various tabs on the cluster details page, such as **Overview**, **Workloads**, and **Events**. 
<br /> 


# Validate
Navigate to the left **Main Menu** and select **Clusters**. Choose your cluster to display the cluster **Overview** page and monitor cluster provisioning progress.  


When cluster status displays **Running** and **Healthy**, you can access the application from the exposed service URL with the port number displayed. One random port between 30000-32767 is exposed for the Hello Universe application. Click on the port number to access the application.

The screenshot below highlights the NodePort to access the application.

![Screenshot of highlighted NodePort to access the application.](/tutorials/edge-native/clusters_edge_deploy-cluster_access-service.png)



Clicking on the exposed NodePort will take you to the Hello Universe application. 
<br />

<WarningBox>

We recommend waiting to click on the service URL, as it takes one to three minutes for DNS to properly resolve the public NodePort URL. This prevents the browser from caching an unresolved DNS request.

</WarningBox>


![Screenshot of successfully accessing the Hello Universe application.](/tutorials/edge-native/clusters_edge_deploy-cluster_hello-universe.png "#width=70%")


You can also review at real-time metrics in Palette, such as CPU and memory consumption, in the cluster's **Overview** tab in Palette. 

![Screenshot of cluster metrics.](/tutorials/edge-native/clusters_edge_deploy-cluster_metrics.png)

You have successfully provisioned an Edge cluster and deployed the Hello Universe application on it. 

<br />

# Cleanup
The following steps will guide you in cleaning up your environment, including the cluster, cluster profile, and Edge hosts. 
<br />

##  Delete the Cluster and Profile
To delete the cluster, view the cluster details page. Click on the **Settings** button to expand the **drop-down Menu**, and select the **Delete Cluster** option, as shown in the screenshot below


![Screenshot of deleting a cluster.](/tutorials/edge-native/clusters_edge_deploy-cluster_delete-cluster.png)


Palette will prompt you to enter the cluster name and confirm the delete action. Type the cluster name to proceed with the delete step. The cluster status will turn to **Deleting**. Deletion takes up to 10 minutes.


After you delete the cluster, click **Profiles** on the left **Main Menu**, and select the profile to delete. Choose the **Delete** option in the **three-dot Menu**, as shown in the screenshot below.


![Screenshot of deleting a cluster profile.](/tutorials/edge-native/clusters_edge_deploy-cluster_delete-profile.png)


Please wait until Palette deletes the resources successfully. 

##  Delete Edge Hosts
Switch back to the **CanvOS** directory in the Linux machine containing the **.goenv** file, and use the following command to delete the Edge hosts. 
<br />

```bash
docker run -it --rm --env-file .goenv tutorials sh -c "cd edge-native/vmware/clone_vm_template/ && ./delete-edge-host.sh"
```

##  Delete Edge Artifacts
If you further want to delete Edge artifacts from your Linux machine, delete the Edge installer ISO image and its checksum by executing the following commands from the **CanvOS/** directory.
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

Note the provider image name and tags, and use the following command syntax to remove all provider images. Similarly, repeat this command for deleting the Earthly image. 

<br />

```bash
docker image rm -f [image repository name]:[tag]
```
<br /> 

# Wrap-Up
This tutorial taught you how to deploy an Edge cluster on VMs acting as Edge hosts. First, you built Edge artifacts (Edge installer ISO image and provider images) using the CanvOS utility and used the installer ISO image to create a VM template. Next, you cloned the VM template to provision multiple VMs. Cloning the VM template ensured that the required dependencies and user data configurations were installed correctly on the VMs. These VMs registered themselves with Palette automatically because you initially embedded a tenant registration token in the installer ISO. 

After preparing the Edge hosts, you used the provider image to create a cluster profile. Although the CanvOS utility built the provider images for all the Palette-supported Kubernetes versions, you chose the specific provider image compatible with K3s v1.25.2 as an example. In your cluster profile, you learned how to refer to the provider image you built and pushed to an image registry. You also ensured to choose a Kubernetes version that matches the one defined in the BYOS Edge OS pack's manifest in the OS layer. Lastly, you deployed a K3s cluster on the Edge hosts. 

Building Edge artifacts (installer ISO and provider images) is the core element of preparing Edge hosts. An installer ISO comprising the desired content, dependencies, and configurations is vital for Edge hosts. The provider image is crucial for the BYOS Edge OS pack in the cluster profile and successfully deploying an Edge cluster. This tutorial used the default arguments and settings to build the artifacts. However, Palette provides many customization options to build desirable Edge artifacts. 

To learn more about deploying Edge clusters, we encourage you to check out the reference resources below.
<br />

- [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos)


- [Build Content Bundle](/clusters/edge/edgeforge-workflow/build-content-bundle)


- [Model Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile)


- [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)


- [Perform Site Install](/clusters/edge/site-deployment/site-installation)