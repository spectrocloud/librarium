---
title: "Building Edge Native Artifacts"
metaTitle: "Build Your Palette Edge Native Images with CanvOS"
metaDescription: "Learn how to build your installer and provider images using our CanvOS GitHub Repository"
icon: "nodes"
category: ["how-to", "edge", "edge-native", "CanvOS"]
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

## Build Edge Native Artifacts

Palette Edge Native is modeled on an immutable operating system.  It is not another linux distribution, but rather a method to consume the distribution of your choice in an immutable way.  Palette Edge Native leverages the open source project, [Kairos](kairos.io/) to create these artifacts.

This how-to-guide will walk you through the basics of creating base Ubuntu images:

* Installer Image - Used to install or "Flash" a device or virtual machine.
* Provider Images - Used to provision new Kubernetes clusters and used to provide upgrades.
In this how-to guide we will create three images.

* 1 x Installer ISO
* 2 x Provider images

We will customize the installer image to support auto registration giving you a low touch feeling when we deploy edge nodes in later [Edge](/knowledgebase/tutorials/edge-native) tutorials.

## Prerequisites

**Software**  

* [Git cli](https://cli.github.com/manual/installation)  
* [Docker](https://docs.docker.com/engine/install/)  

<InfoBox>
The ability to run privileged containers is required.
</InfoBox>

**Hardware**  

* x86 Based Platform
* 4CPU
* 8GB Memory
* 50GB HD

**This how-to guide was written with the following versions:**

**Ubuntu**

```shell
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04.2 LTS
Release:        22.04
Codename:       jammy
```

4-vCPU  
8GB Memory  
100GB Hard Disk  

**Docker CE**

```shell
Docker version 23.0.1, build a5ee5b1
```

**Git cli**

```shell
git version 2.34.1
```

## Enablement

## The GitHub Repo

1. Clone the repo at [CanvOS](https://github.com/spectrocloud/CanvOS.git)

```shell
git clone https://github.com/spectrocloud/CanvOS.git
```

**Sample Output**

```shell
Cloning into 'CanvOS'...
remote: Enumerating objects: 133, done.
remote: Counting objects: 100% (133/133), done.
remote: Compressing objects: 100% (88/88), done.
Receiving objects: 100% (133/133), 40.16 KiB | 5.02 MiB/s, done.
Resolving deltas: 100% (60/60), done.
remote: Total 133 (delta 60), reused 101 (delta 32), pack-reused 0
```

2. Change into the `CanvOS` directory that was created.

```shell
cd CanvOS
```

3. View Available tags

```shell
git tag

v3.3.3
```

4. Checkout the desired tag

```shell
git checkout <tag version>
```

**Sample Output**

```shell
git checkout v3.3.3
Note: switching to 'v3.3.3'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:
```

## Update Variables

1. Edit the `.arg` file.  Only modify the `MY_ENVIRONMENT` value.  Make it your initials in lowercase.  Everything else can stay the same.

<WarningBox>

The MY_ENVIRONMENT variable should adhere to standard image naming conventions which require it to be all lowercase.  We use this variable to name the images as unique for the purposes of this documentation.

</WarningBox>

```shell
vi .arg
```

Depending on your editor the way you save may be different.  This lab was written using VIM. To enable editing in VIM press `i`.  Use the arrow keys to scroll to the value of the `CUSTOM_TAG` variable.  Delete the value `demo` and replace it with your initials in lowercase.

**Sample Output**

```shell
CUSTOM_TAG=demo
IMAGE_REGISTRY=ttl.sh
OS_DISTRIBUTION=ubuntu
IMAGE_REPO=$OS_DISTRIBUTION
OS_VERSION=22
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer


# CUSTOM_TAG-------------------------Environment name for provider image naming
# IMAGE_REGISTRY---------------------Image Registry Name
# OS_DISTRIBUTION--------------------OS Distribution (ubuntu, opensuse-leap)
# IMAGE_REPO-------------------------Image Repository Name
# OS_VERSION-------------------------OS Version, only applies to Ubuntu (20, 22)
# K8S_DISTRIBUTION-------------------Kubernetes Distribution (k3s, rke2, kubeadm)
# ISO Name---------------------------Name of the Installer ISO
```

* To save with VIM, press `esc` then type `:wq!` and press `enter`

<InfoBox>
Depending on your editor the way you save may be different.
</InfoBox>

**Sample Output**

```shell
CUSTOM_TAG=jb
IMAGE_REGISTRY=ttl.sh
OS_DISTRIBUTION=ubuntu
IMAGE_REPO=$OS_DISTRIBUTION
OS_VERSION=22
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer


# CUSTOM_TAG-------------------------Environment name for provider image naming
# IMAGE_REGISTRY---------------------Image Registry Name
# OS_DISTRIBUTION--------------------OS Distribution (ubuntu, opensuse-leap)
# IMAGE_REPO-------------------------Image Repository Name
# OS_VERSION-------------------------OS Version, only applies to Ubuntu (20, 22)
# K8S_DISTRIBUTION-------------------Kubernetes Distribution (k3s, rke2, kubeadm)
# ISO Name---------------------------Name of the Installer ISO
~
~
~
:wq!
```

By default, we do not provide a username or password for the images that are being created.  To create a username and password for lab/demo purposes we will create a `user-data` file with the attributes that are needed.  Additionally, to aid in auto-registration of the nodes that we will create and use in later tutorials, we are going to add a `edgeHostToken` to the user-data file.  This will enable the nodes to automatically register with your Palette Tenant without user intervention.  

<br />

## Create the Registration Token in Palette.

1. Open a browser window and navigate to the [Palette Console](https://console.spectrocloud.com/)

* Login to your organization  
If you have not signed up you can sign up for a free trial [Here](https://www.spectrocloud.com/free-tier/)

2. Navigate `Tenant Settings` on the left hand menu (Bottom Left).

* Select `Registration Tokens`
* Click `Add New Registration Token`
* Set `Token Name` as `Demo`
* Set the `Default Project` as `Default`
* Set the Expiration Date for `7 Days`

![Registration Token](/tutorials/canvos/add_token.png)

* Click `Confirm`
* Copy the newly created token to Clipboard

<InfoBox>
Save this token to a note file as we will use it later.
</InfoBox>

![Registration Token](/tutorials/canvos/registration_token.png)

## Create a user-data file

1. Copy and paste the contents below.

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

5. Edit the `edgeHostToken` value with the registration token we created above.

* Type `vi user-data`

**Sample Output**

```shell
#cloud-config
stylus:
  site:
    edgeHostToken: aUAxxxxxxxxx0ChYCrO
install:
  poweroff: true
users:
  - name: kairos
    passwd: kairos
```

* Press `i` to enable editing.
* Replace the value of `edgeHostToken` variable with the value of the registration token you saved to the note file.

* To save with VIM, press `esc` then type `:wq!` and press `enter`

<InfoBox>
Depending on your editor the way you save may be different.
</InfoBox>

This creates a `user-data` file that will be used by our agent to inject the values when the images are created.  This sets the password for the user `kairos` to `kairos` and instructs the installer to turn the machine off once the installation is complete.  It also tells the agent to use the auto-registration functionality and authenticate with the token we provided.

6. Validate the `user-data` format is valid cloud-init formatting.  We leverage [YIP](https://github.com/mudler/yip) to apply stages and configuration attributes.  The formatting is cloud-init style and therefore should be validated before deployment.

```shell
cloud-init schema --config-file user-data
```

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

2. Copy and save this output and formatting to a notepad, it will be used later for building the cluster profile.

## Validation

1. Validate that the Docker Images are created.

```shell
docker images
```

**Sample Output**

```shell
docker images
REPOSITORY        TAG                       IMAGE ID       CREATED         SIZE
ttl.sh/ubuntu     k3s-1.25.2-v3.3.3-jb      32b869a17579   9 minutes ago   2.55GB
ttl.sh/ubuntu     k3s-1.24.6-v3.3.3-jb      a2596b8bef84   9 minutes ago   2.55GB
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

## Create a Cluster Profile in Palette

Cluster Profiles are what define the desired configuration of our Kubernetes Clusters.  They are reusable abstractions of the manual configuration elements that would be done to provide consistency and repeatability.  
A Cluster Profile can be reused across many clusters.  For these next steps, we will build a Cluster Profile to define our OS, Kubernetes, and CNI layers.


1. Login to [Palette](https://console.spectrocloud.com)

2. Navigate to the `Default` project.

![Default Project](/tutorials/canvos/default_project.png)

3. Navigate to `Profiles` and select `Add Cluster Profile`

4. Provide a name and select `Full` as the Type

![Cluster Profile](/tutorials/canvos/cluster_profile.png)

* For the name we often suggest making it something that describes the deployment type such as `ubuntu-k3s`

Click `Next`

5. Choose `Edge Native` as the Infrastructure Provider

![Cluster Type](/tutorials/canvos/cluster_type.png)

Click `Next`

6. Select `Public Repo` from the Registry dropdown and set the Pack Type to `BYOS Edge OS`

![OS Layer](/tutorials/canvos/os_layer.png)

7. Copy and paste the output you saved earlier replacing ALL of the contents beneath line 9.

<WarningBox>
This is YAML and it is very particular about the formatting.  Our inline YAML validation should notify you of any abnormalities.  They would need to be addressed before continuing.  If you copied directly from the CLI from earlier, the formatting should be correct.
</WarningBox>

Click `Next Layer`

8. Select `Public Repo` from the Registry dropdown, the Pack Type to `Palette Optimized K3S`, and the Pack Version to `1.24.6`

<WarningBox>
The cluster-cidr and service-cidr should be changed if needed should they overlap with your network.  This is to prevent any routing conflicts in the internal pod networking.
</WarningBox>

![Kubernetes Layer](/tutorials/canvos/k8s_layer.png)

Click `Next Layer`

9. Select `Public Repo` from the Registry dropdown, the Pack Type to `Calico`, and the Pack Version to `3.25.0`

<InfoBox>
If you changed the cluster-cidr in the previous step, line 23 should be un-commented (remove the #) and the IP Address should be changed to match your cluster-cidr address pool.  If you made no changes in the previous step, nothing is required to be changed here.
</InfoBox>

![CNI Layer](/tutorials/canvos/cni_layer.png)

![CNI Layer](/tutorials/canvos/cni_layer.png)

Click `Confirm`  
Click `Next`  
Click `Finish Configuration`

![Finish](/tutorials/canvos/finish.png)

## Push the Provider Images to Public Registry

The Cluster Profile we just built references the provider image which will be installed onto the devices.  We need to push those images to a public registry.  The settings we were using have the registry set to `ttl.sh` which is a free public registry requiring no registration.

<WarningBox>
If you use the ttl.sh registry, please note the images will only be present for 24 hours after the image is pushed.  After that, the images are deleted from that registry.  It is adviseable that you use your registry and push the images there, but if that is not available, the ttl.sh registry will provide a temporary environment to work with.
</WarningBox>

1. On your jump host verify the images.

```shell
docker images
```

**SAMPLE OUTPUT**

```shell
docker images
REPOSITORY        TAG                       IMAGE ID       CREATED         SIZE
ttl.sh/ubuntu     k3s-1.25.2-v3.3.3-jb      32b869a17579   9 minutes ago   2.55GB
ttl.sh/ubuntu     k3s-1.24.6-v3.3.3-jb      a2596b8bef84   9 minutes ago   2.55GB
earthly/earthly   v0.7.4                    d771cc8edc38   2 weeks ago     333MB
```

2. Push the images

```shell
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.3.3-jb
docker push ttl.sh/ubuntu:k3s-1.24.6-v3.3.3-jb
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
