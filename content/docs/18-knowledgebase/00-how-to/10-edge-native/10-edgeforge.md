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

This How-To will walk you through the basics of creating base Ubuntu images:

* Installer Image - Used to install or "Flash" a device or virtual machine.
* Provider Images - Used to provision new Kubernetes clusters and used to provide upgrades.

In this how-to we will create three images.

* 1 x Installer ISO
* 2 x Provider images (For both K3s 1.24.7 and K3s 1.25.2)

We will customize the installer image to support auto registration giving you a low touch feeling when we actually deploy edge nodes in later [Edge](/knowledgebase/tutorials/edge-native) tutorials.

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

**This how-to was written with the following versions:**

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
git https://github.com/spectrocloud/CanvOS.git
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

Depending on your editor the way you save may be different.  This lab was written using VIM. To enable editing in VIM press `i`.  Use the arrow keys to scroll to the value of the `MY_ENVIRONMENT` variable.  Delete the value `demo` and replace it with your initials in lowercase.

**Sample Output**

```shell
MY_ENVIRONMENT=demo   # Environment name for provider image naming
IMAGE_REGISTRY=ttl.sh    # Image Registry Name
OS_DISTRIBUTION=ubuntu    # OS Distribution (ubuntu, opensuse-leap)
IMAGE_REPOSITORY=$OS_DISTRIBUTION   # Image Repository Name
OS_VERSION=22   # OS Version, only applies to Ubuntu (20, 22)
K8S_DISTRIBUTION=k3s   # Kubernetes Distribution (K3s, RKE2, Kubeadm)
ISO_NAME=palette-edge-installer   # ISO Name
# Image path to tag images.  By default the path is:
### # IMAGE_TAG=$K8S_DISTRIBUTION-$K8S_VERSION-$STYLUS_VERSION
### # IMAGE_PATH=$IMAGE_REGISTRY/$IMAGE_REPOSITORY-$MY_ENVIRONMENT:$IMAGE_TAG
# Which would translate to the below based on the variables in this file.  This is an example and can be overridden by 
# commenting the below "IMAGE_TAG" and "IMAGE_PATH" variables out and providing your custom path


#### EXAMPLE #######
### IMAGE_PATH=ttl.sh/ubuntu-demo:k3s-1.25.2-v3.3.3
####################
```

* To save with VIM, press `esc` then type `:wq!` and press `enter`

<InfoBox>
Depending on your editor the way you save may be different.
</InfoBox>

**Sample Output**

```shell
MY_ENVIRONMENT=jb   # Environment name for provider image naming
IMAGE_REGISTRY=ttl.sh    # Image Registry Name
OS_DISTRIBUTION=ubuntu    # OS Distribution (ubuntu, opensuse-leap)
IMAGE_REPOSITORY=$OS_DISTRIBUTION   # Image Repository Name
OS_VERSION=22   # OS Version, only applies to Ubuntu (20, 22)
K8S_DISTRIBUTION=k3s   # Kubernetes Distribution (K3s, RKE2, Kubeadm)
ISO_NAME=palette-edge-installer   # ISO Name
# Image path to tag images.  By default the path is:
### # IMAGE_TAG=$K8S_DISTRIBUTION-$K8S_VERSION-$STYLUS_VERSION
### # IMAGE_PATH=$IMAGE_REGISTRY/$IMAGE_REPOSITORY-$MY_ENVIRONMENT:$IMAGE_TAG
# Which would translate to the below based on the variables in this file.  This is an example and can be overridden by
# commenting the below "IMAGE_TAG" and "IMAGE_PATH" variables out and providing your custom path


#### EXAMPLE #######
### IMAGE_PATH=ttl.sh/ubuntu-demo:k3s-1.25.2-v3.3.3
####################
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
* Set the `Default Project` as `default`
* Set the Expiration Date for `7 Days`

![Registration Token](/tutorials/edgeforge/add_token.png)

* Click `Confirm`
* Copy the newly created token to Clipboard

<InfoBox>
Save this token to a note file as we will use it later.
</InfoBox>

![Registration Token](/tutorials/edgeforge/registration_token.png)

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

## Create Edge Artifacts

<InfoBox>

The settings shown above point the image registry to `ttl.sh`.  This is an ephemeral registry where the images live for a maximum of 24 hours (this is the default).  If you wish to use your registry to make the artifacts exist longer than 24 hours you can modify the value of the `IMAGE_REPOSITORY` to match your needs.  

This is outside the scope of this quickstart.

</InfoBox>


1. Build the artifacts.

```shell
./earthly.sh +build-all-images
```

This will create two `docker images` and an `iso` that can/will be used in the Edge Native Tutorials.

```shell
....truncated for brevity

output | [----------] 100% transferring (via tar) ttl.sh/ubuntu-demo:k3s-v1.24.7-v3.3.3

 Push Summary ⏫ (disabled)
————————————————————————————————————————————————————————————————————————————————

To enable pushing use earthly --push
Did not push image ttl.sh/ubuntu-demo:k3s-v1.24.6-v3.3.3
Did not push image ttl.sh/ubuntu-demo:k3s-v1.25.2-v3.3.3

 Local Output Summary 🎁
————————————————————————————————————————————————————————————————————————————————

Artifact +build-iso/palette-edge-installer.iso output as build/palette-edge-installer.iso
Artifact +build-iso/palette-edge-installer.iso.sha256 output as build/palette-edge-installer.iso.sha256
Image +provider-image output as ttl.sh/ubuntu-demo:k3s-v1.24.7-v3.3.3
Image +provider-image output as ttl.sh/ubuntu-demo:k3s-v1.25.2-v3.3.3


========================== 🌍 Earthly Build  ✅ SUCCESS ==========================

Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev
```

## Validation

1. Validate that the Docker Images are created.

```shell
docker images
```

**Sample Output**

```shell
docker images
REPOSITORY              TAG                  IMAGE ID       CREATED         SIZE
ttl.sh/ubuntu-jb-demo   k3s-v1.25.2-v3.3.3   fe5c03df75a9   3 minutes ago   2.49GB
ttl.sh/ubuntu-jb-demo   k3s-v1.24.7-v3.3.3   51bddf269545   3 minutes ago   2.49GB
earthly/earthly         v0.7.4               d771cc8edc38   2 weeks ago     333MB
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

* Cleanup or Skip to [Next Steps](/knowledgebase/how-to/edge-native/edgeforge#nextsteps)

1. Cleanup the artifacts that were created.  

* To clean up what you created use `docker rmi <image id>`.  
Repeat this for as many images as were created in the previous steps.

Change the image ids to match the images in your environment.  You can get the ids from the output provided by running `docker images`.  

**Sample Output**

```shell
docker rmi fe5c03df75a9
docker rmi 51bddf269545
```

2. Delete the ISO image and ISO checksum.  

```shell
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```

## Next Steps

Complete one of the [Edge Native Tutorials](/knowledgebase/tutorials/edge-native)
