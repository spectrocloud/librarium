---
title: "Build Edge Native Artifacts"
metaTitle: "Build Edge Native Images using CanvOS"
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

# Build Edge Native Images using CanvOS
	
Palette's Edge native solution requires edge hosts with [Kairos](https://kairos.io/) installed, allowing you to use the Linux distribution of your choice in an immutable way. 

In this how-to guide, you will leverage the open-source project [Kairos](kairos.io/) to create the following Ubuntu-based artifacts:
<br/>

* **An edge installer ISO image** - This ISO image can install or "Flash" an edge device. You will customize the installer image to allow the new Edge nodes automatically register themselves with Palette. 


* **Two provider images** - These provider images can provision new Kubernetes clusters and are used to provide upgrades.

These artifacts will help you provision as many edge hosts as you desire. 

# Prerequisites

This how-to guide can only be followed in an Ubuntu environment having *x86_64* processor architecture. You can issue either of the following command in the terminal to check your processor architecture. 
<br/>

```bash
uname -m
```

To complete the tutorial, you will need the following items:
<br/>

* Operating system: Ubuntu 22.04 or later. 


* Hardware: A (virtual) machine with x86_64 processor architecture and the following *minimum* hardware configuration:
	* 4 CPU
	* 8 GiB memory
	* 50 GiB storage


* Software: [Git CLI](https://cli.github.com/manual/installation) and [Docker](https://docs.docker.com/engine/install/) installed in the Ubuntu (virtual) machine. 

  <InfoBox>
  Ensure that you can create [privileged containers](https://docs.docker.com/engine/reference/commandline/run/#privileged) on the Ubuntu machine.
  </InfoBox>

* A Spectro Cloud account. Visit [https://console.spectrocloud.com](https://console.spectrocloud.com) to create an account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).



* Tenant admin access to Palette for the purpose of generating a new registration token for edge hosts.


# Instructions

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

5. View the files *relevant* for this how-to guide. 
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

Start with editing the **.arg** file that contains the following variables:
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

Open the **.arg** file in any editor of your choice, and edit the value for `CUSTOM_TAG` variable. You can enter your initials as the value. Ensure that it is made up of all lower case alphanumeric characters. You will use this variable as a prefix in the provider image names. The current example uses the following value:

<br />

```bash
CUSTOM_TAG=demo
```
Ensure to save the **.arg** file after your edits. 


By default, the provider images you create will have no username or password. To create a username and password for demo purposes and enable Edge nodes to register themselves with Palette automatically, you can create a **user-data** file. The next sections will guide you through creating an auto-registration token and a **user-data** file. 


## Create a Registration Token

Log in to [Palette](https://console.spectrocloud.com), and switch to the Tenant Admin view.
<br />

![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.png)

<br />

Navigate to **Tenant Settings** > **Registration Tokens**. Click on **Add New Registration Token** and enter the following values.

|**Field**|**Value**|
|----|----|
| Registration Token Name | Demo |
| Description | Token for Edge host how-to/tutorial |
| Default Project | Default |
| Expiration Date | 7 days |

Click on **Confirm** button at the bottom, and Palette will generate a token. Copy the newly created token to a clipboard or notepad file to use later in this guide. 


<br />

![Registration Token](/tutorials/canvos/registration_token.png)

## Create User Data File

In this section, you will create a **user-data** file, a script that runs when you provision an Edge host. You can use this file to configure the host and install software or packages. Refer to this guide, [User Data Parameters](https://docs-latest.spectrocloud.com/clusters/edge/edge-configuration/installer-reference), outlining possible parameters to use and configure. In the next section, the agent will inject the parameters defined in the **user-data** file into the edge installer ISO image.

To create a minimalistic **user-data** file for the current example, copy and issue the command below. However, before you issue this command, edit the `edgeHostToken` parameter value with the registration token you created above in Palette. 
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

Ensure to save the **user-data** file after you update your registration token. This **user-data** file configures the following: 

* Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.

* Instructs the installer to turn the machine off once the installation is complete

* Sets the login credentials for Edge hosts, `{name: kairos, passwd: kairos}`. The login credentials will allow you to SSH log into the Edge host for debugging purposes. 



## Create Edge Artifacts

<InfoBox>

The settings shown above point the image registry to `ttl.sh`.  This is an ephemeral registry where the images live for a maximum of 24 hours (this is the default).  If you wish to use your registry to make the artifacts exist longer than 24 hours you can modify the value of the `IMAGE_REPO` to match your needs.  

This is outside the scope of this quickstart.

</InfoBox>


1. Build the artifacts.

```shell
./earthly.sh +build-all-images --PE_VERSION=$(git describe --abbrev=0 --tags)
```

This will create two `docker images` and an `iso` that can/will be used in the Edge Native Tutorials.

**SAMPLE OUTPU**  

```shell
###################################################################################################

PASTE THE CONTENTS BELOW INTO YOUR CLUSTER PROFILE IN PALETTE BELOW THE "OPTIONS" ATTRIBUTE

###################################################################################################


  system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"


  system.registry: ttl.sh
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v3.3.3
  system.customTag: jb
  system.osVersion: 22
```

## Validation

1. Validate that the Docker Images are created.

```shell
docker images
```

**Sample Output**

```shell
docker images
REPOSITORY        TAG                       IMAGE ID       CREATED         SIZE
ttl.sh/ubuntu     k3s-1.25.2-v3.3.3-demo    32b869a17579   9 minutes ago   2.55GB
ttl.sh/ubuntu     k3s-1.24.6-v3.3.3-demo    a2596b8bef84   9 minutes ago   2.55GB
earthly/earthly   v0.7.4                    d771cc8edc38   2 weeks ago     333MB
```

2. Validate the iso image and checksum are created.

```shell
ls -al build/
```

**Sample Output**

```shell
ls -al build/
total 998544
drwxr-xr-x 2 root root       4096 Apr 29 15:42 .
drwxrwxr-x 6 jb   jb         4096 Apr 29 15:42 ..
-rw-r--r-- 1 root root 1022492672 Apr 16  2020 palette-edge-installer.iso
-rw-r--r-- 1 root root         93 Apr 16  2020 palette-edge-installer.iso.sha256
```

## Cleanup

* Cleanup or Skip to [Next Steps](/knowledgebase/how-to/edge-native/canvos#nextsteps)

1. Cleanup the artifacts that were created.  

* To clean up what you created use `docker rmi <image id>`.  
Repeat this for as many images as were created in the previous steps.

Change the image ids to match the images in your environment.  You can get the ids from the output provided by running `docker images`.  

**Sample Output**

```shell
docker rmi 32b869a17579
docker rmi a2596b8bef84
```

2. Delete the ISO image and ISO checksum.  

```shell
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```

## Next Steps

[Edge Native Tutorials](/knowledgebase/tutorials/edge-native)
