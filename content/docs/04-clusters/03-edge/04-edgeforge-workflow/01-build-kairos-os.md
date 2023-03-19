---
title: "Bring Your Own OS"
metaTitle: "Bring Your Own OS - Create Kairos Image"
metaDescription: "Learn about building your own Kairos Image"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

To build a system using your own operating system requires you create a Karios based image out of your raw OS image. Please note that this step is *not* required if all you are looking to do is build enterprise edge artifacts from one of Palette's supported OS (Ubuntu20, Ubuntu22, OpenSUSE).

The sections below describe the procedure to build a Kairos based RHEL image as an example. You can modify these as requird for your own operating system. For more infromation on builing your own kairos based OS, refer to ...

# Pre-requisites

- A linux machine (phycial or VM) for building various artifacts
- RHEL Subscription to be able to download the RHEL UBI image for building edge provider image
- Access to a container registry with permissions to push container images

# Steps

1. Prepare Build Server

Run the following commands to prepare your server for VMDK creation.

```
# Install Docker
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

Additional package installation for content creation, compression and preparing your workspace

#Create workspace & download builder code
mkdir -p ~/workspace/
cd workspace/

#Clone repositories
git clone https://github.com/spectrocloud/pxke-samples

```

2. Build Karios Image

In this step we will build a Kairos based core image from a RHEL 8 base operating system. Core images form the basis for k8s provider images used for cluster provisioning. The build is performed using containers. We will use a docker file called Dockerfile.rhel8 in this example. Please review the contents of this file to understand the various steps involved in this process. You will need to supply credentials to your RHEL subscription to the build command.

```
cd pxke-samples/core-images

docker build \
-t [your image repository]/rhel8-kairos:1.0 \
--build-arg USERNAME=[rhel subscription username]\
--build-arg PASSWORD=[rhel subscription password] \
-f Dockerfile.rhel8 .
```

2. Upload to your registry

```
docker push [your image repository]/rhel8-kairos:1.0
``

This image will be used in the 'Build Images' step as the based for rest of your enterprise edge artifacts.
