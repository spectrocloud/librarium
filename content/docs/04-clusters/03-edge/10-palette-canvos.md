---
title: "Build Edge Artifacts"
metaTitle: "Build Edge Artifacts"
metaDescription: "Learn how to build your installer and provider images using CanvOS GitHub repository."
icon: ""
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from "shared/components/common/PointOfInterest";

# Overview
Palette's Edge native solution requires Edge hosts to be ready with the required software and configurations before you deploy a cluster on those hosts. You can prepare Edge hosts for cluster deployment using the following artifacts:
<br />

* **Edge Installer ISO image** - You will use the ISO image to "flash" the Edge hosts. During installation, the host will boot from the Edge Installer ISO, partition the disk, copy the image to the disk, install the software (Palette Edge host agent and metadata), and perform several configuration steps. These configuration steps include registering the host with Palette, setting user privileges, and configuring network or security settings. 
<br />

* **Provider OS image** - It is a [Kairos](https://kairos.io/)-based image. You can use this image to install an immutable Operating System (OS) and software dependencies compatible with a specific Kubernetes version at runtime, i.e., during the cluster deployment.  
<br />

In this guide, you will use Spectro Cloud's utility, CanvOS, to create an Edge Installer ISO image and two provider OS images - one compatible with lightweight Kubernetes (K3s) v1.24.6 and another compatible with K3s v1.25.2.


# Prerequisites
To complete this guide, you will need the following items:
<br/>

* A physical or virtual Linux machine with **AMD64** (also known as **x86_64**) processor architecture. You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```

* Minimum hardware configuration:
  - 4 CPU
  - 8 GB memory
  - 50 GB storage
 

* [Git](https://cli.github.com/manual/installation) version 2.30.x or later. You can check your git version using `git --version` command.


* [Docker Engine](https://docs.docker.com/engine/install/) version 20.10.x or later. Using the ' docker version ' command, you can check the Docker Engine version. Ensure you can create [privileged containers](https://docs.docker.com/engine/reference/commandline/run/#privileged) on your machine.


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).


* Tenant admin access to Palette to generate a new registration token for Edge hosts.


# Build Edge Artifacts

You can follow either of the below workflow - Basic or Advanced. Use Basic for a quick start or Advanced for detailed instructions, and learn about customization options to suit your use case. 
<br />

<Tabs>

<Tabs.TabPane tab="Basic" key="basic_create_artifacts">

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code. 
  <br />

  ```bash
  git clone https://github.com/spectrocloud/CanvOS.git
  ```


2. Change to the **CanvOS/** directory. 
  <br />

  ```bash
  cd CanvOS
  ```


3. The files relevant to the current guide are in the **v3.3.3** tag. Check out the desired tag. You can check out a more recent and stable version if available. 
  <br />

  ```shell
  git checkout v3.3.3
  ```


4. Review the relevant files. 
  <br />

  ```bash
  .
  ├── .arg          # Defines mutiple variables
  ├── Dockerfile    # Bakes the arguments to use in the image
  ├── Earthfile     # Series of commands for creating target images
  ├── earthly.sh    # Script to invoke the Earthfile, and generate target images
  └── user-data.template  # A sample user-data file
  ```
  <br />


5. This step is optional. In this step, you can define a custom image tag for provider OS images. The current example uses `demo` as the default tag. Skip this step if you use the default tag. 

  To change the image tag, edit the value for the `CUSTOM_TAG` variable in the **.arg** file. Ensure that it is of lowercase alphanumeric characters. 
  <br />

  ```bash
  CUSTOM_TAG=[Define a lowercase alphanumeric string]
  ```
  <br />
 

6. Create a registration token in Palette using the instructions available in the [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide. Copy the newly created token to a clipboard or notepad file to use in the next step. The screenshot below shows a sample registration token in **Tenant Settings** > **Registration Tokens** section. 

  ![Screenshot of a registration token in Palette](/tutorials/palette-canvos/clusters_edge_palette-canvos_registration-token.png)

  <br />


7. Switch back to the **CanvOS/** directory in the Linux machine to create a **user-data** file that embeds the Edge host's login credentials and registration token in the Edge Installer ISO image.  

  To create the **user-data** file for the current example, copy and issue the command below. Before you issue this command, ensure to edit the `edgeHostToken` parameter value with the registration token you created in the last step. Also, you can click on the *Points of Interest* numbers below to learn more about main attributes relevant for this example. 
  <br />

  <PointsOfInterest
    points={[
      {
        x: 370,
        y: 185,
        label: 1,
        description: "Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.",
        tooltipPlacement: "rightTop",
      },
      {
        x: 190,
        y: 262,
        label: 2,
        description: "Instructs the installer to turn the host machine off once the installation is complete.",
      },
      {
        x: 190,
        y: 340,
        label: 3,
        description: "Sets the login credentials for Edge hosts. The login credentials will allow you to SSH log into the edge host for debugging purposes.",
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
  <br />


8. Issue the following command to execute the **earthly.sh** file to build the Edge artifacts. The `--PE_VERSION` option in the command below signifies the Palette Edge version to use. The current example uses the **v3.3.3** git tag.
  <br />

  ```shell
  ./earthly.sh +build-all-images --PE_VERSION=$(git describe --abbrev=0 --tags)
  ```

  ```bash coloredLines=2-2
  # Output condensed for readability
  ===================== Earthly Build SUCCESS ===================== 
  Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
  ```
  This command will take up to 15-20 minutes to finish.
  <br />

</Tabs.TabPane>

<Tabs.TabPane tab="Advanced" key="advanced_create_artifacts">

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code. 
  <br />

  ```bash
  git clone https://github.com/spectrocloud/CanvOS.git
  ```
  

2. Change to the **CanvOS/** directory. 
  <br />

  ```bash
  cd CanvOS
  ```


3. The files relevant to the current guide are in the **v3.3.3** tag. Check out the desired tag. You can check out a more recent and stable version if available.
  <br />

  ```shell
  git checkout v3.3.3
  ```


4. Review the relevant files.  
  <br />

  ```bash
  .
  ├── .arg          # Defines mutiple variables
  ├── Dockerfile    # Bakes the arguments to use in the image
  ├── Earthfile     # Series of commands for creating target images
  ├── earthly.sh    # Script to invoke the Earthfile, and generate target images
  └── user-data.template  # A sample user-data file
  ```
  <br />


5. This step is optional. In this step, you can edit the  **.arg** file to define arguments, such as, custom image tag for provider OS images, image registry, image repository, OS distribution, Kubernetes distribution, and ISO file name. 

  Skip this step if you use the following default values. 

  |**Argument**|**Description**|**Default Value**| **Other Possible Values** |
  |---|---|---|---|
  |`CUSTOM_TAG`|Tag for provider image|demo|Lowercase alphanumeric string without spaces|
  |`IMAGE_REGISTRY`|Image registry name|ttl.sh|Your image registry URL, without http or https <br /> Example: hub.docker.com|
  |`OS_DISTRIBUTION`|OS Distribution |ubuntu | opensuse-leap|
  |`IMAGE_REPO`|Image repository name|`$OS_DISTRIBUTION`|Your image repository name|
  |`OS_VERSION`|OS Version, only applies to Ubuntu |22| 20|
  |`K8S_DISTRIBUTION`|Kubernetes Distribution |k3s| rke2, kubeadm |
  |`ISO_NAME`|Name of the Installer ISO|palette-edge-installer|String without spaces|

  Using the default value for all arguments, the provider image name will be similar to `ttl.sh/ubuntu:k3s-1.25.2-v3.4.1-demo`.

  To customize any of the arguments, edit its value in the **.arg** file. For example, if you want to change the image tag, edit the value for the `CUSTOM_TAG` variable. Ensure that it is of lowercase alphanumeric characters. 
  <br />


6. This step is also optional. In this step, you can modify the existing Dockerfile to suit your needs. For example, here is a sample Dockerfile to install [WireGuard](https://www.wireguard.com/install/) on the Edge host. 
  <br />

  ```Dockerfile
  ARG BASE
  FROM $BASE
  # Install WireGuard and required dependencies
  RUN apt-get update && apt-get install -y wireguard

  # Install Netplan
  RUN apt-get -y install netplan.io
  ```
  You can install more tools and dependencies and configure the host as needed.
  <br />



7. Create a registration token in Palette using the instructions available in the [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide to allow Edge hosts to register themselves with Palette automatically. 

  Palette 3.4 onwards, a registration token created by the tenant admin, is now *required* for pairing an Edge host with Palette. Palette offers three registration methods: auto, manual, and QR code. This guide uses the auto-registration method. For more details, refer to the [Register Edge Host](https://docs.spectrocloud.com/clusters/edge/site-deployment/site-installation/edge-host-registration) documentation.

  Copy the newly created token to a clipboard or notepad file to use in the next step. The screenshot below shows a sample registration token in **Tenant Settings** > **Registration Tokens** section. 

  ![Screenshot of a registration token in Palette](/tutorials/palette-canvos/clusters_edge_palette-canvos_registration-token.png)

  <br />


8. Switch back to the **CanvOS/** directory in the Linux machine to create a **user-data** file that embeds the Edge host's login credentials and registration token in the Edge Installer ISO image. 

  If you want further customization, refer to the [Edge Configuration Stages](https://docs.spectrocloud.com/clusters/edge/edge-configuration/cloud-init#edgeconfigurationstages) and [User Data Parameters](https://docs-latest.spectrocloud.com/clusters/edge/edge-configuration/installer-reference) documents outlining different other stages and possible parameters, respectively. 

  To create the **user-data** file for the current example, copy and issue the command below. Before you issue this command, ensure to edit the `edgeHostToken` parameter value with the registration token you created in the last step. Also, you can click on the *Points of Interest* numbers below to learn more about main attributes relevant for this example. 
  <br />

  <PointsOfInterest
    points={[
      {
        x: 370,
        y: 185,
        label: 1,
        description: "Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.",
        tooltipPlacement: "rightTop",
      },
      {
        x: 190,
        y: 262,
        label: 2,
        description: "Instructs the installer to turn the host machine off once the installation is complete.",
      },
      {
        x: 190,
        y: 340,
        label: 3,
        description: "Sets the login credentials for Edge hosts. The login credentials will allow you to SSH log into the edge host for debugging purposes.",
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
  <br />


9. Issue the following command to execute the **earthly.sh** file to build the Edge artifacts. The `--PE_VERSION` option in the command below signifies the Palette Edge version to use. Spectro Cloud generates a git tag for each new Palette release. The current example uses the **v3.3.3** git tag.
  <br />

  ```shell
  ./earthly.sh +build-all-images --PE_VERSION=$(git describe --abbrev=0 --tags)
  ```

  ```bash coloredLines=2-2
  # Output condensed for readability
  ===================== Earthly Build SUCCESS ===================== 
  Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
  ```
  This command will take up to 15-20 minutes to finish.
  <br />
 

</Tabs.TabPane>

</Tabs>

# Validate
1. List the edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.
<br />

  ```shell
  ls build/
  ```

  ```shell
  # Output
  palette-edge-installer.iso      
  palette-edge-installer.iso.sha256
  ```
  <br />

2. List the Docker images to show two provider OS images - one compatible with K3s v1.24.6 and another with K3s v1.25.2.
<br />

  ```shell
  docker images
  ```

  ```bash coloredLines=3-4
  # Output
  REPOSITORY        TAG                       IMAGE ID        CREATED         SIZE
  ttl.sh/ubuntu     k3s-1.25.2-v3.3.3-demo    b3c4956ccc0a    6 minutes ago   2.49GB
  ttl.sh/ubuntu     k3s-1.24.6-v3.3.3-demo    fe1486da25df    6 minutes ago   2.49GB
  earthly/earthly   v0.7.4                    d771cc8edc38     2 weeks ago    333MB
  ```
  
  If you want to use these provider OS images in your cluster profile, push them to the image registry mentioned in the **.arg** file. In the current example, use the following commands to push them to the *ttl.sh* image registry. This image registry is ephemeral; images will be accessible for 24 hours. You can, however, use any other registry of your choice and tag the docker images appropriately before pushing them.
  <br />

  ```bash
  docker push ttl.sh/ubuntu:k3s-1.25.2-v3.3.3-demo
  ```

  ```bash
  docker push ttl.sh/ubuntu:k3s-1.24.6-v3.3.3-demo
  ```

  <WarningBox>

  As a reminder, *ttl.sh* is a short-lived image registry. If you do not use these provider OS images in your cluster profile within 24 hours of pushing to *ttl.sh*, they will no longer exist and must be re-pushed.

  </WarningBox>