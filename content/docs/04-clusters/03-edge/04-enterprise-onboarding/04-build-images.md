---
title: "Build Images"
metaTitle: "Build Images"
metaDescription: "Learn about building your eterprise edge artifacts"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Palette provides a tool called Palette Edge Installer CLI for building your enterprise edge artifacts.

# Pre-requisites

- Linux Machine (Physical or VM)
- Access to a container registry with permissions to push container images

# Steps

1. Download Palette Edge Installer CLI

```
wget S3 Link to CLI
chmod +x ....
```

2. Review options

Run the 'show' command to view the list of options for OS flavors, OS version, K8s flavors, K8s Versions, Spectro Agent Version and Kairos version.

```
./spectro-cli-linux-amd64 show
```

Sample Output:

```
┌────────────────────────────────────────────────────────────────────────┐
| OS Flavor     | Description        | Base Image URI                    |
| opensuse-leap | Opensuse Leap 15.4 | quay.io/kairos/core-opensuse-leap |
| ubuntu-20     | Ubuntu 20.4 LTS    | quay.io/kairos/core-ubuntu-20-lts |
| ubuntu-22     | Ubuntu 22.4 LTS    | quay.io/kairos/core-ubuntu-22-lts |
└────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
| K8S Flavor | Description        | Supported Versions                                        |
| rke2       | Rancher RK2        | 1.25.3-rke2r1,1.24.7-rke2r1,1.23.13-rke2r1,1.22.15-rke2r1 |
| k3s        | Rancher K3s        | 1.25.3-k3s1,1.24.6-k3s1,1.23.12-k3s1,1.22.15-k3s1         |
| kubeadm    | Kubernetes kubeadm | 1.25.3,1.24.6,1.23.12,1.22.15                             |
└─────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────┐
| Component             | Version        |
| Spectro Agent Version | v0.0.0-2b13491 |
| Kairos Version        | v1.5.0         |
└────────────────────────────────────────┘
```

Notes:

- The K8s flavor and K8s versions you choose, need to be from the list displayed. Palette will continuiously release newer versions of K8s as part of its releases.
- If you choose to use your own OS, you will need to build a Kairos image from your OS as described in 'Build Your Own Kairos Image' section.
- Typically, you will not change the Spectro Agent Version and Kairos Version.

2. Generate Scaffold

Generate a scaffold for bulding your images by providing your choice of OS and K8s flavor, output folder for build file, your container registry location and the location of your user data file.

The "generate" command generates files and directories based on os and k8s flavors or even custom base images.

Basic Options:

--os-flavor: OS Flavor
--k8s-flavor: K8s Flavor
--output: Directory for generating build files
--push-image-repository: Repository for generated container images
--content-path: Optional location of content bundle if preloading content
--cache-provider-images: Additional flag to preload generated provider images into the installer ISO

As an example, to create an opensuse + k3s images using upstream kairos opensuse-leap images and to publish to a target repo gcr.io/spectro-testing one could do

```
edge-cli generate --os-flavor opensuse-leap --k8s-flavor k3s --output opensuse-k3s --push-image-repository gcr.io/spectro-testing --content-path /root/work/playground/content-c59a5a88/spectro-content-c59a5a88.zst --cache-provider-images   
 
 INFO  Creating directory  opensuse-k3s
 INFO  Created scaffolding directory structure under directory opensuse-k3s with the following parameters
┌───────────────────────────────────────────────────────────────────────────┐
| Spectro Agent Version | v0.0.0-d155796                                    |
| Base Image            | quay.io/kairos/core-opensuse-leap:v1.5.0          |
| K8S Flavor            | k3s                                               |
| K8S Versions          | 1.25.2-k3s1,1.24.6-k3s1,1.23.12-k3s1,1.22.15-k3s1 |
| Push Image Repository | gcr.io/spectro-testing                            |
| Kairos Version        | v1.5.0                                            |
└───────────────────────────────────────────────────────────────────────────┘
To build an installer iso and target docker images for
various versions supported, run the 'build.sh' in the
'opensuse-k3s' directory. For any customizations to made to
all the generated images e.g adding packages, edit the
'images/Dockerfile' as needed before running
'build.sh'.Files to be copied to the target images can be
places under 'overlay/files' and files for the iso only can
be placed under 'overlay/files-iso
```

To use a custom base image, such as rocky linux you would run the command as follows:

```
$> edge-cli generate --base-image-uri quay.io/kairos/core-rockylinux:v1.5.0  --k8s-flavor k3s --output rockylinux-k3s --push-image-repository gcr.io/spectro-testing 

 INFO  Creating directory  rockylinux-k3s
 INFO  Created scaffolding directory structure under directory rockylinux-k3s with the following parameters
┌───────────────────────────────────────────────────────────────────────────┐
| Spectro Agent Version | v0.0.0-d155796                                    |
| Base Image            | quay.io/kairos/core-rockylinux:v1.5.0             |
| K8S Flavor            | k3s                                               |
| K8S Versions          | 1.25.2-k3s1,1.24.6-k3s1,1.23.12-k3s1,1.22.15-k3s1 |
| Push Image Repository | gcr.io/spectro-testing                            |
└───────────────────────────────────────────────────────────────────────────┘
To build an installer iso and target docker images for
various versions supported, run the 'build.sh' in the
'rockylinux-k3s' directory. For any customizations to made
to all the generated images e.g adding packages, edit the
'images/Dockerfile' as needed before running
'build.sh'.Files to be copied to the target images can be
places under 'overlay/files' and files for the iso only can
be placed under 'overlay/files-iso
```

Running this command will generate a directory structure with specific build files in it at the location specified as '--output' in your command

```
|
├── .versions.env
├── build.sh
├── images
│   └── Dockerfile
└── overlay
    ├── files
    │   └── Readme.txt
    └── files-iso
        ├── boot
        │   └── grub2
        │       └── grub.cfg
        ├── config.yaml
        └── opt
            └── spectrocloud
                └── content
                    └── Readme.txt
```

To see a complete list of options, please run the command

```
edge-cli generate --help
```

3. Review and Modfy Build Configuration

Before you generate the build, you can make changes to customize your build for various options.

- To modify or control the K8s versions, flavors etc. update the .versions.env file. Alternately you can pass these as arguments to the build command in the next step
- To add any custom packages in the target os images using apt-get or zypper, edit the images/Dockerfile to add relevant commands.
- To copy any custom files or directories into the k8s provider container  images , place under "overlay/files". The files directory is copied directly under "/" in the target image.
- To add any custom content to the installer iso only, place them under the "overlay/files-iso" directory. To embedd a content bundle, place it under opt/spectrocloud/content under files-iso.

4. Build Images

Run the following command to build your enterprise edge images.

```
./build.sh
```

The following images will be generated:

- Installer ISO Image
- Container image with Spectro Host Agent
- One or more K8s Provider Container images

Ensure you push the container images to your image repository, either by specifying PUSH_BUILD=true in the '.versions.env'file or pushing them manually after generation.
