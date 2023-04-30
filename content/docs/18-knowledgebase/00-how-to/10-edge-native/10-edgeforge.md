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

# Build Edge Native Artifacts

# Prerequisites

x86 Based Platform  
[Github cli](https://cli.github.com/manual/installation)  
[Docker](https://docs.docker.com/engine/install/)  

<InfoBox>

The ability to run privileged containers is required.

</InfoBox>

This how-to was written with the following versions:

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

**Github cli**

```shell
git version 2.34.1
```

# Enablement

## The GitHub Repo

1. Clone the repo at [CanvOS](https://github.com/spectrocloud/CanvOS.git)

```shell
git clone git@github.com:spectrocloud/CanvOS.git
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
IMAGE_REPOSITORY=ttl.sh
OS_DISTRIBUTION=ubuntu
OS_VERSION=22
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer
MY_ENVIRONMENT=demo
```

2. Depending on your editor the way you save may be different.  To save with VIM, press `esc` then type `:wq!` and press `enter`.

**Sample Output**

```shell
IMAGE_REPOSITORY=ttl.sh
OS_DISTRIBUTION=ubuntu
OS_VERSION=22
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer
MY_ENVIRONMENT=jb
~
~
~
~
:wq!
```

By default, we do not provide a username or password for the images that are being created.  To create a username and password for lab/demo purposes we will create a `user-data` file with the attributes that are needed.  A sample, more intricate `user-data` file is located in this repo called `user-data.template`.

<InfoBox>
This sample user-data.template is here for reference only and is NOT used as part of this How-To. 
</InfoBox>

3. Create a `user-data` file.

```shell
cat <<'EOF' > user-data
#cloud-config
install:
  poweroff: true
users:
  - name: kairos
    passwd: kairos
EOF
```

This creates a `user-data` file that will be used by our agent to inject the values when the images are created.  This sets the password for the user `kairos` to `kairos` and instructs the installer to turn the machine off once the installation is complete.

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
Did not push image ttl.sh/ubuntu-demo:k3s-v1.24.7-v3.3.3
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

# Validation

1. Validate that the Docker Images are created.

```shell
docker images
```

**Sample Output**

```shell
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
total 998544
drwxr-xr-x 2 root root       4096 Apr 29 15:42 .
drwxrwxr-x 6 jb   jb         4096 Apr 29 15:42 ..
-rw-r--r-- 1 root root 1022492672 Apr 16  2020 palette-edge-installer.iso
-rw-r--r-- 1 root root         93 Apr 16  2020 palette-edge-installer.iso.sha256
```

# Cleanup

This step is not used when you continue to the next tutorial [Getting Started with Edge Native](/knowledgebase/tutorials/edge-native/edge-native-do)  
These images will be used in that tutorial.  

1. Cleanup the artifacts that were created.  

To clean up what you created use `docker rmi <image id>`.  
Repeat this for as many images as were created in the previous steps.

Change the image ids to match the images in your environment.  You can get the ids from the output provided by running `docker images`.
**Sample Output**
```shell
docker rmi fe5c03df75a9
docker rmi 51bddf269545
```

2. Delete the ISO image and ISO checksum.  

You will also want to delete the `.iso` files.

```shell
rm build/palette-edge-installer.iso
rm build/palette-edge-installer.iso.sha256
```
