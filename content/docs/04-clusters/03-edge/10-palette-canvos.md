---
title: "Build Edge Native Artifacts"
metaTitle: "Build Edge Native Image Artifacts using CanvOS"
metaDescription: "Learn how to build your installer and provider images using CanvOS GitHub repository."
icon: ""
category: ["how-to", "edge", "edge-native", "CanvOS"]
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from "shared/components/common/PointOfInterest";

# Build Edge Native Image Artifacts
	
Palette's edge native solution requires edge hosts with [Kairos](https://kairos.io/) installed, allowing you to use the Linux distribution of your choice. In this how-to guide, you will create the following images for edge hosts:
<br/>

* **An Edge installer ISO image** - This ISO image can "Flash" or install  Kairos-based immutable Linux operating system on edge hosts. 

* **Provider OS images** - These provider images can be used in a cluster profile to deploy new Kubernetes clusters or to provide upgrades.


# Prerequisites
To complete this how-to guide, you will need the following items:
<br/>

* A physical or virtual machine as a *Development Environment*  to generate edge installation artifacts. The machine should have **x86** or **x86_64** (also know as **amd64**) processor architecture. You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```

* Minimum hardware configuration - 4 CPU, 8 GB memory, and 50 GB storage.


* Either one of Ubuntu 20.04, Ubuntu 22.04, or openSUSE Leap 15.4 operating system (OS). This guide uses Ubuntu 22.04 as an example. 
 

* [Git CLI](https://cli.github.com/manual/installation) 2.30.x or later. You can check Git CLI version using `git --version` command.


* [Docker Engine](https://docs.docker.com/engine/install/) 20.10.x or later. You can check Docker Engine version using `docker version` command. Ensure that you can create [privileged containers](https://docs.docker.com/engine/reference/commandline/run/#privileged) on your machine.


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).


* Tenant admin access to Palette to generate a new registration token for Edge hosts.


# Instructions
The instructions are split into the following subsections:
- Check out the starter code
- Edit the image tag for the provider images
- Create a registration token in Palette
- Create a user data file
- Create edge artifacts


## Check out the Starter Code
Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code. 
<br />

```shell
git clone https://github.com/spectrocloud/CanvOS.git
```
CanvOS repository follows [EdgeForge workflow](clusters/edge/edgeforge-workflow) and leverages [Earthly](https://earthly.dev/) and Kairos to build all artifacts. Change into the **CanvOS** directory.
<br />

```shell
cd CanvOS
```

View available tags. The files relevant for this guide are present in the **v3.3.3** tag. 
<br />

```shell
git tag
```

Checkout the desired **v3.3.3** tag.
<br />

```shell
git checkout v3.3.3
```

You can check the HEAD symbolic reference by issuing `git status` command, and expect the following output.
<br />

```bash coloredLines=1-1|#666666
HEAD detached at v3.3.3
```

Here are the files *relevant* for the current guide. 
<br />

```bash
.
├── .arg          # Defines the variables 
├── Dockerfile    # Bakes the arguments to use in the image
├── Earthfile     # Series of commands for creating target images
├── earthly.sh    # Script to invoke the Earthfile, and generate target images
└── user-data.template  # A sample user-data file
```
Next, edit the **.arg** file and create a new **user-data** file. 

## Edit the Image Tag

The **.arg** file defines the following variables:
<br />

* `CUSTOM_TAG` - Environment name for provider image tagging. The default value is `demo`. 
<br />

* `IMAGE_REGISTRY` - Image registry name that will store the image artifacts. The default value points to the *ttl.sh* image registry, an anonymous and ephemeral Docker image registry where images live for a maximum of 24 hours by default. If you wish to make the images exist longer than 24 hours, you can use any other image registry to suit your needs. 
<br />

* `OS_DISTRIBUTION` - OS distribution of your choice. For example, it can be `ubuntu` or `opensuse-leap`. This example uses `ubuntu` distribution.
<br />

* `IMAGE_REPO` - Image repository name in your chosen registry. 
<br />

* `OS_VERSION` - OS version. For Ubuntu, the possible values are `20`, and `22`. Whereas for openSUSE Leap, the possible value is `15.4`. This example uses `22` for Ubuntu. 
<br />

* `K8S_DISTRIBUTION` - Kubernetes distribution name. It can be one of these: `k3s`, `rke2`, or `kubeadm`.
<br />

* `ISO_NAME` - Name of the edge installer ISO image. In this example, the name is *palette-edge-installer*. 


Open the **.arg** file in any editor of your choice, and edit the value for `CUSTOM_TAG` variable. You can enter your initials as the value. Ensure that it is made up of all lower case alphanumeric characters. Agent will use this variable as a suffix in the provider image tags. The current example uses the following value:

<br />

```bash
CUSTOM_TAG=demo
```
Ensure to save the **.arg** file after your edits. 


Next, create a **user-data** file containing the login credentials for edge hosts and a token to allow edge hosts to register themselves with Palette automatically. 

## Create a Registration Token
Palette 3.4 onwards, a registration token created by the Tenant admin, is now *required* for pairing an edge host with Palette. Palette offers three registration methods: auto, manual, and QR code. This guide uses the auto-registration method. Refer to the [Register Edge Host](https://docs.spectrocloud.com/clusters/edge/site-deployment/site-installation/edge-host-registration) documentation for more details.


Log in to [Palette](https://console.spectrocloud.com), and switch to the Tenant admin view.

Navigate to **Tenant Settings** > **Registration Tokens**. Click on **Add New Registration Token** and enter the following values.

|**Field**|**Value**|
|----|----|
| Registration Token Name | DemoToken |
| Description | Token for Build Edge Native Image Artifacts how-to/tutorial |
| Default Project | Default |
| Expiration Date | 7 days |

Click on **Confirm** button at the bottom to finish generating a token. 
<br />

![Screenshot of a registration token in Palette](/tutorials/palette-canvos/clusters_edge_palette-canvos_registration-token.png)

<br />

Copy the newly created token to a clipboard or notepad file to use later in this guide. 


## Create User Data File
Create a **user-data** file to configure the edge host's login credentials and auto-registration token to automatically allow the new edge hosts to register themselves with Palette. If you want further customization, refer to the [Edge Configuration Stages](https://docs.spectrocloud.com/clusters/edge/edge-configuration/cloud-init#edgeconfigurationstages) and [User Data Parameters](https://docs-latest.spectrocloud.com/clusters/edge/edge-configuration/installer-reference) documents outlining different other stages and possible parameters, respectively, you can configure in the **user-data** file. 


To create a minimalistic **user-data** file for the current example, copy and issue the command below. Before you issue this command, ensure to edit the `edgeHostToken` parameter value with the registration token you created above. You can click on the *Points of Interest* numbers below to learn more about each attribute. 
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
      y: 224,
      label: 2,
      description: "Instructs the installer to turn the host machine off once the installation is complete.",
    },
    {
      x: 190,
      y: 300,
      label: 3,
      description: "Sets the login credentials for edge hosts. The login credentials will allow you to SSH log into the edge host for debugging purposes.",
      tooltipPlacement: "rightTop",
    },
  ]}
>


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

</PointsOfInterest>

## Build Edge Native Image Artifacts
Issue the following command to build the artifacts. 
<br />

```shell
./earthly.sh +build-all-images --PE_VERSION=$(git describe --abbrev=0 --tags)
```

```bash coloredLines=2-2|#006622
# Output condensed for readability
===================== Earthly Build SUCCESS ===================== 
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```
This command will take up to 15-20 minutes to finish.
<br />

# Validate
List the edge installer ISO image and checksum by issuing the following command from the **CanvOS** directory.
<br />

```shell
ls build/
```

```shell coloredLines=2-3|#666666
# Output
palette-edge-installer.iso      
palette-edge-installer.iso.sha256
```
You can provision as many edge hosts using this ISO image as you desire.

List the Docker images to show two provider OS images, one compatible with lightweight Kubernetes (K3s) v1.24.6 and another with K3s v1.25.2.
<br />

```shell
docker images
```

```bash coloredLines=3-4|#666666
# Output
REPOSITORY        TAG                       IMAGE ID        CREATED         SIZE
ttl.sh/ubuntu     k3s-1.25.2-v3.3.3-demo    b3c4956ccc0a    6 minutes ago   2.49GB
ttl.sh/ubuntu     k3s-1.24.6-v3.3.3-demo    fe1486da25df    6 minutes ago   2.49GB
earthly/earthly   v0.7.4                    d771cc8edc38     2 weeks ago    333MB
```

Suppose you want to use these provider images in your cluster profile. In that case, you can push them to the *ttl.sh* or any other image registry and add the following custom content within the `options` attribute if the **OS layer** of your cluster profile.    
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
You must verify and change these attributes' values, as applicable to you, before using them in your cluster profile. 
<br />

<WarningBox>

If you are using *ttl.sh* image registry, your images will be available for a maximum of 24 hours.

</WarningBox>

The screenshot below shows custom content added to the OS layer of a cluster profile.
<br />

![Screenshot of k3s OS layer in a cluster profile](/tutorials/palette-canvos/clusters_edge_palette-canvos_edit_profile.png)



# Cleanup
Clean up the artifacts you created in this guide. You can skip cleaning up if you continue to the [Deploy Edge Native Cluster](/clusters/edge/deploy-cluster) tutorial next.  

Issue `docker images` to list all images in your current development environment, and use the following command syntax to remove provider OS images.
<br />

```bash
docker image rm -f [image repository name]:[tag]
```

Change the image name and tag to match the images in your environment, and repeat this command for all individual images created in the previous steps. 


You can delete the edge installer ISO image and its checksum by executing the following commands from the **CanvOS** directory.
<br />

```bash
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```