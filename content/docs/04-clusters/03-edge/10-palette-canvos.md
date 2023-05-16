---
title: "Build Edge Native Artifacts"
metaTitle: "Build Edge Native Image Artifacts using CanvOS"
metaDescription: "Learn how to build your installer and provider images using CanvOS GitHub repository."
icon: "cubes"
category: ["how-to", "edge", "edge-native", "CanvOS"]
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Build Edge Native Image Artifacts using CanvOS
	
Palette's Edge native solution requires edge hosts with [Kairos](https://kairos.io/) installed, allowing you to use the Linux distribution of your choice in an immutable way. 

In this how-to guide, you will leverage the open-source project [Kairos](kairos.io/) to create the following Ubuntu-based immutable and bootable Kubernetes and OS images:
<br/>

* **An Edge installer ISO image** - This ISO image can install or "Flash" an edge device. In this how-to guide, you will customize the installer image to automatically allow the new Edge nodes to register themselves with Palette. Once you transfer the ISO to your Datacenter, and convert it into a VM template, you can provision as many edge hosts as you desire. 


* **Two provider images** - These provider images can be used in a cluster profile to deploy new Kubernetes clusters or to provide upgrades.



# Prerequisites
To complete this how-to guide, you will need the following items:
<br/>

* *Hardware* - A physical or virtual machine with x86_64 processor architecture and the following *minimum* hardware configuration:
	* 4 CPU
	* 8 GiB memory
	* 50 GiB storage

  You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```

* *Operating system* - Either one of Ubuntu 20.04, Ubuntu 22.04, or openSUSE Leap 15.4 is supported.
<br /> 

  <InfoBox>

  You can follow this guide only in a Ubuntu 22.04 environment with *x86_64* processor architecture. To use this guide in an openSUSE Leap 15.4 environment, you must make relevant changes in the **.arg** file discussed later in this guide.

  </InfoBox>


* *Software* - [Git CLI](https://cli.github.com/manual/installation) and [Docker](https://docs.docker.com/engine/install/) installed. Ensure that you can create [privileged containers](https://docs.docker.com/engine/reference/commandline/run/#privileged) on the Ubuntu machine.


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).



* Tenant Admin access to Palette to generate a new registration token for Edge hosts.


# Instructions
The instructions are split into the following subsections:
- Check out the starter code
- Edit the image tag for the provider images
- Create a registration token in Palette
- Create a user data file
- Create Edge artifacts


## Check out the Starter Code
Follow the steps below to check out the GitHub repository containing the starter code for generating the image artifacts. 
<br />

1. Clone the repo at [CanvOS](https://github.com/spectrocloud/CanvOS.git)
<br />

  ```shell
  git clone https://github.com/spectrocloud/CanvOS.git
  ```

2. Change into the `CanvOS` directory.
<br />

  ```shell
  cd CanvOS
  ```

3. View available tags. The files relevant for this guide are present in the **v3.3.3** tag. 
<br />

  ```shell
  git tag
  ```

4. Checkout the desired **v3.3.3** tag.
<br />

  ```shell
  git checkout v3.3.3
  ```
  You can check the HEAD symbolic reference by issuing `git status` command, and expect the following output.
  <br />

  ```bash coloredLines=1-1|#666666
  HEAD detached at v3.3.3
  ```

5. Here are the files *relevant* for the current how-to guide. 
<br />

  ```bash
  .
├── .arg          # Defines the variables 
├── Dockerfile    # Bakes the arguments to use in the image
├── Earthfile     # Series of commands for creating target images
├── earthly.sh    # Script to invoke the Earthfile, and generate target images
└── user-data.template  # A sample user-data file
  ```


## Edit the Image Tag

The **.arg** file contains the following variables:
<br />

```bash
CUSTOM_TAG        # Environment name for provider image naming
IMAGE_REGISTRY    # Image Registry Name
OS_DISTRIBUTION   # OS Distribution (ubuntu, opensuse-leap)
IMAGE_REPO        # Image Repository Name
OS_VERSION        # OS Version, only applies to Ubuntu (20, 22)
K8S_DISTRIBUTION  # Kubernetes Distribution (k3s, rke2, kubeadm)
ISO_NAME          # Name of the Installer ISO
```

Here is an overview of all variables in the **.arg** file:
<br />

* `CUSTOM_TAG` - Environment name for provider image naming.
<br />

* `IMAGE_REGISTRY` - Image registry name that will store the image artifacts. The default value points to the *ttl.sh* image registry, an anonymous and ephemeral Docker image registry where images live for a maximum of 24 hours by default. If you wish to make the artifacts exist longer than 24 hours, you can use any other image registry to suit your needs. 
<br />

* `OS_DISTRIBUTION` - OS distribution of your choice. For example, it can be `ubuntu` or `opensuse-leap`. This example uses `ubuntu` distribution.
<br />

* `IMAGE_REPO` - Image repository name in your chosen registry. 
<br />

* `OS_VERSION` - OS version. For Ubuntu, the possible values are `20`, and `22`. Whereas for openSUSE Leap, the possible value is `15.4`. This example uses `22` for Ubuntu. 
<br />

* `K8S_DISTRIBUTION` - Kubernetes distribution name. It can be one of these: `k3s`, `rke2`, or `kubeadm`.
<br />

* `ISO_NAME` - Name of the Edge installer ISO image. In this example, the name is *palette-edge-installer*. 


Open the **.arg** file in any editor of your choice, and edit the value for `CUSTOM_TAG` variable. You can enter your initials as the value. Ensure that it is made up of all lower case alphanumeric characters. You will use this variable as a suffix in the provider images. The current example uses the following value:

<br />

```bash
CUSTOM_TAG=demo
```
Ensure to save the **.arg** file after your edits. 


By default, the provider images you create will have no username or password. To create a username and password for demo purposes and enable Edge nodes to register themselves with Palette automatically, you can create a **user-data** file. The next sections will guide you through creating an auto-registration token and a **user-data** file. 


## Create a Registration Token
Palette 3.4 onwards, a registration token created by the Tenant Admin, is now *required* for pairing an Edge host with Palette. Log in to [Palette](https://console.spectrocloud.com), and switch to the Tenant Admin view.

Navigate to **Tenant Settings** > **Registration Tokens**. Click on **Add New Registration Token** and enter the following values.

|**Field**|**Value**|
|----|----|
| Registration Token Name | Demo |
| Description | Token for Edge host how-to/tutorial |
| Default Project | Default |
| Expiration Date | 7 days |

Click on **Confirm** button at the bottom to finish generating a token. 
<br />

![Screenshot of a registration token in Palette](/tutorials/palette-canvos/clusters_edge_palette-canvos_registration-token.png)

<br />

Copy the newly created token to a clipboard or notepad file to use later in this guide. 


## Create User Data File
In this section, you will create a **user-data** file, a script in YAML format that executes when you provision an Edge host. You can use this file to configure the host and install software or packages. Refer to this guide, [User Data Parameters](https://docs-latest.spectrocloud.com/clusters/edge/edge-configuration/installer-reference), outlining possible parameters to use and configure. In the next section, the agent will inject the parameters defined in the **user-data** file into the Edge installer ISO image.

To create a minimalistic **user-data** file for the current example, copy and issue the command below. However, before you issue this command, edit the `edgeHostToken` parameter value with the registration token you created above. 
<br />

```shell
cat <<'EOF' > user-data
#cloud-config
stylus:
  site:
    edgeHostToken: aUAxxxxxxxxx0ChYCrO
install:
  poweroff: true
users:
  - name: kairos
    passwd: kairos
EOF
```

This **user-data** file configures the following: 

* Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.

* Instructs the installer to turn the machine off once the installation is complete

* Sets the login credentials for Edge hosts, `{name: kairos, passwd: kairos}`. The login credentials will allow you to SSH log into the Edge host for debugging purposes. 


## Create Edge Artifacts
Issue the following command to build the artifacts. 
<br />

```shell
./earthly.sh +build-all-images --PE_VERSION=$(git describe --abbrev=0 --tags)
```
Here is the sample output:
<br />

```bash coloredLines=2-2|#027313
# Output condensed for readability
===================== Earthly Build SUCCESS ===================== 
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```
This command will take up to 15-20 minutes to finish and generate the following image artifacts.  
<br />

* **An Edge installer ISO image** - The command will create an Edge installer ISO image that you can later transfer to your Datacenter, and build a VM template. Once you provision Edge hosts (VMs) using this VM template, it will automatically allow new Edge hosts to register themselves with Palette. This artifact will help you provision as many Edge hosts as you desire. 


* **Two provider images** - The command will push the Ubuntu-based provider (Docker) images to the *ttl.sh* image registry, and output the custom content to add to your cluster profile. In this example, you can add the following custom content within the `options` attribute of the **OS layer** in
your cluster profile to use the newly built images.  
<br />

  ```yaml
    system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
    system.registry: ttl.sh
    system.repo: ubuntu
    system.k8sDistribution: k3s
    system.osName: ubuntu
    system.peVersion: v3.3.3
    system.customTag: demo
    system.osVersion: 22
  ```

  The screenshot below shows custom content added to the OS layer of a cluster profile.
  <br />

  ![Screenshot of k3s OS layer in a cluster profile](/tutorials/palette-canvos/clusters_edge_palette-canvos_edit_profile.png)

  <br />

  <WarningBox>

  Note that if you are using *ttl.sh* image registry, your images will be available for a maximum of 24 hours.

  </WarningBox>



# Validation
List the Edge installer ISO image and checksum by issuing the following command.
<br />

```shell
ls -l build/
```

Here is the sample output:
<br />

```shell
-rw-r--r-- 1 root root 1022492672 Apr 16  2023 palette-edge-installer.iso
-rw-r--r-- 1 root root         93 Apr 16  2023 palette-edge-installer.iso.sha256
```

List the images to validate that the agent has successfully created the Ubuntu-based provider (Docker) images.
<br />

```shell
docker images
```
Here is the sample output:
<br />

```bash
# Output condensed for readability
REPOSITORY                                              TAG                 IMAGE ID       CREATED       SIZE
ttl.sh/ubuntu-demo                                 k3s-1.25.2-v3.3.3   b3c4956ccc0a   6 minutes ago    2.49GB
ttl.sh/ubuntu-demo                                 k3s-1.24.6-v3.3.3   fe1486da25df   6 minutes ago    2.49GB
earthly/earthly                                         v0.7.4              d771cc8edc38   2 weeks ago   333MB
```


# Cleanup
You can skip cleaning up if you continue practicing the [Create Edge Native Cluster](/clusters/edge/create-cluster) tutorial next. Otherwise, clean up the artifacts you created in this guide. 

List all images in your current development environment.
<br />

```bash
docker images
```

Use `docker image rm -f <image repository name>:<tag>` syntax to remove an individual image.
<br />

```bash
docker image rm -f ttl.sh/ubuntu-demo:k3s-1.24.6-v3.3.3
```

Change the image name and tag to match the images in your environment, and repeat this command for all individual images created in the previous steps.

You can delete the Edge installer ISO image and its checksum by executing the following commands from the **CanvOS** directory.
<br />

```bash
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```


# Research

- Palette offers three registration methods: auto, manual, and QR code. Refer to the [Register Edge Host](https://docs.spectrocloud.com/clusters/edge/site-deployment/site-installation/edge-host-registration) documentation to learn more about Edge host registration methods.


- In this guide, you set up the user credentials for the Edge host. You can further customize the **user-data** file to suit your needs. For example, you can customize the product ID location using the following syntax:
  <br />

  ```yaml
  stylus:
  debug: true
  site:
    insecureSkipVerify: false
    paletteEndpoint: api.dev.spectrocloud.com   # Host for hubble api to register device

    # Name of the device, this may also be referred to as the Edge id or Edge host id.  
    # If no Edge host name is specified, one will be generated from the device serial number.  
    # If stylus cannot generate the device serial number a random id will be used instead. 
    # In the case of hardware that does not have a serial number, it is highly recommended to specify the device name because a random name is not deterministic and may lead to a device being registered twice under different names.
    name: $random

    deviceUIDPaths:
      - name: /etc/palette/metadata-regex
        regex: "edge.*"
  ```
  In addition, you can do these additional customizations: 
    - Add an SSH key for the user
    - Assign the user to a group 
    - Configure a registry mirror
    - Erase partitions
    - Install tools
    - Configure network settings
    - Add SSL certificates

  The sample code snippet for all these use cases are present in [Edge Configuration Stages](https://docs.spectrocloud.com/clusters/edge/edge-configuration/cloud-init#edgeconfigurationstages) documentation.


- Refer to [User Data Parameters](https://docs.spectrocloud.com/clusters/edge/edge-configuration/installer-reference#userdataparameters) documentation to learn more about different parameters you can configure in the **user-data** file. 


- Next step - Tutorial on [Creating Edge native cluster](/clusters/edge/create-cluster).