---
title: "Build Edge Artifacts using Content Bundle"
metaTitle: "Build Edge Artifacts using Content Bundle"
metaDescription: "Learn how to build Edge artifacts, such as the provider images and Edge Installer ISO using Spectro Cloud's CanvOS and Palette Edge CLI utilities."
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

# Build Edge Artifacts with Content Bundle


Palette's Edge solution supports creating Edge artifacts for devices having low Internet bandwidth or deployed in *air-gapped* environments. Deployment sites with no direct or indirect connectivity to other devices or outside networks are called *air-gapped* environments. Palette supports creating the Edge artifacts using a content bundle to prepare edge devices for such environments. 

A content bundle in Palette is an archive that includes all the required container images, Helm charts, packs, and manifest files needed to deploy an Edge cluster. It can also include artifacts from your applications that you wish to deploy to the Edge cluster. 


Content bundles provide several benefits, such as preloading required software dependencies to remove the need for downloading assets during cluster deployment, optimizing the deployment process in bandwidth-constrained environments, and ensuring that only authorized tools or software are installed on Edge hosts. 


In this how-to guide, you will first build the provider images using the CanvOS utility and create a cluster profile using one of the provider images. Once your cluster profile is ready, you will use it to create a content bundle using the Palette Edge Content CLI. The Palette Edge CLI provides a command-line utility to interact with Palette and perform specific tasks, such as creating a content bundle.


Lastly, when your content bundle is ready, you will again use the CanvOS utility to embed the site-specific Edge installer configuration and user data into a bootable Edge installer ISO image. This bootable ISO image can install the necessary dependencies and configurations on a bare host machine. During installation, the host machine will boot from the Edge installer ISO, partition the disk, copy the image content to the disk, install the Palette Edge host agent and metadata, and perform several other configuration steps. 



# Prerequisites

To complete this advanced guide, you will need the following items:
<br />

* A physical or virtual Linux machine with *AMD64* (also known as *x86_64*) processor architecture to build the Edge artifacts. This guide uses Ubuntu 22.04.2 LTS operating system. You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```
  <br />

  <WarningBox>

  The Linux machine must have Internet connectivity. 

  </WarningBox>

* Minimum hardware configuration of the Linux machine:
  - 4 CPU
  - 8 GB memory
  - 50 GB storage
 

* [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version` command.


* [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version` command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to create privileged containers.   


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).


* A cluster profile for Edge infrastructure in Palette. 


* Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to generate a new registration token. For detailed instructions, refer to the [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.


* An account with [Docker Hub](https://hub.docker.com/). If you do not have an account with Docker Hub already, refer to the [Create an account](https://docs.docker.com/docker-id/) page for signing-up instructions. 
<br />

  <InfoBox>

  This guide uses Docker Hub as an example. You can use any other image registry that suit your requirements.

  </InfoBox>
  <br />

* A public repository named `opensuse-leap` in your image registry. Refer to the [Create a repository](https://docs.docker.com/docker-hub/repos/create/#create-a-repository) instructions for creating a Docker Hub repository and setting the repository's visibility to `public`. 


# Instructions

Use the following instructions on your Linux machine to customize the arguments and Dockerfile and then create all the required Edge artifacts.

<br />

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


3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).
<br />

  ```bash
  git tag
  ```

4. Check out the newest available tag. This guide uses **v3.4.3** tag as an example. 
  <br />

  ```shell
  git checkout v3.4.3
  ```
  <br />



5. Review the files relevant for this guide. 
    - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process. 
    - **Dockerfile** - Embeds the arguments and other configurations in the image.
    - **Earthfile** - Contains a series of commands to create target artifacts.
    - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
    - **user-data.template** - A sample user-data file.
  <br />


6. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the `CUSTOM_TAG` variable. 
<br />

  ```bash
  export CUSTOM_TAG=palette-learn
  ```
  <br />

7. Issue the command below to create the **.arg** file with the custom tag. It uses the default values for the remaining variables. You can refer to the existing **.arg.template** file to learn more about the available customizable variables.  
<br /> 

  ```bash
  cat << EOF > .arg
  CUSTOM_TAG=$CUSTOM_TAG
  IMAGE_REGISTRY=ttl.sh
  OS_DISTRIBUTION=ubuntu
  IMAGE_REPO=ubuntu
  OS_VERSION=22
  K8S_DISTRIBUTION=k3s
  ISO_NAME=palette-edge-installer
  PE_VERSION=$(git describe --abbrev=0 --tags)
  platform=linux/amd64
  EOF
  ```
  
  View the newly created file to ensure the customized variables are set correctly.
  <br />

  ```bash
  cat .arg
  ```
  <br />

8. Issue the command below to save your tenant registration token to an environment variable. Replace `[your_token_here]` with your actual registration token. 
<br />

  ```bash
  export token=[your_token_here]
  ```
  <br />
  
9. Use the following command to create the **user-data** file containing the tenant registration token. Also, you can click on the *Points of Interest* numbers below to learn more about the main attributes relevant to this example. 
  <br />

  <PointsOfInterest
    points={[
      {
        x: 260,
        y: 187,
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
  <br />

  View the newly created user data file to ensure the token is set correctly.
<br />

  ```bash
  cat user-data
  ``` 
  <br />

10. The CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to start the build process.
<br />

  ```bash
  sudo ./earthly.sh +build-provider-images
  ```


```bash
docker images --filter=reference='*/*:*palette-learn'
```

```bash
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-palette-learn
```

## Create a Cluster Profile

## Download and Install the Palette Edge CLI
Download the Edge CLI for your OS type.

```bash
curl https://software.spectrocloud.com/stylus/v3.4.3/cli/linux/palette-edge -o palette-edge
```

```bash
chmod 755 palette-edge
```

```bash
sudo mv palette-edge /bin/
```

```bash
palette-edge show
```


## Create an Offline Content Bundle

```bash
export API_KEY=[USE-YOUR-API-KEY_HERE]
```

```bash
export PROFILE_ID="649133494c39ac0e8e61a9e5"
```

```bash
export PROJECT_ID="6342eab2faa0813ead9082e0"
```


```bash
palette-edge build --api-key $API_KEY \
 --project-id $PROJECT_ID \
 --cluster-profile-ids $PROFILE_ID \
 --palette-endpoint api.spectrocloud.com \
 --outfile content
```

```bash
ls -al
```
**content-8e61a9e5** content bundle is created.


```bash
ls -l content-8e61a9e5
```


```bash
sudo ./earthly.sh +iso
```



# Validate

