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



```bash
sudo ./earthly.sh +build-all-images
```

```bash
docker images --filter=reference='*/*:*demo'
```

```bash
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo
```


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

