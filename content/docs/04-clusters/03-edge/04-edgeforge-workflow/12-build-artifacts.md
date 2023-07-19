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


Palette's Edge solution supports creating Edge artifacts for edge devices having low or zero internet bandwidth or deployed in *air-gapped* environments. *Air-gapped* environments are those deployment sites with no direct or indirect connectivity to other devices or outside networks. In such environments, you will use a *content bundle* to build Edge artifacts for preparing edge devices.


A content bundle is an archive that includes the operating system image, Kubernetes distribution, any additional packs, and manifest files specified in your cluster profile you wish to deploy to the Edge cluster. Content bundles provide several benefits, such as preloading required software dependencies to remove the need for downloading assets during cluster deployment, optimizing the deployment process in bandwidth-constrained environments, and ensuring that only authorized tools or software are installed on Edge hosts. 

In this how-to guide, you will first build the provider images using the CanvOS utility and create a cluster profile using one of the provider images. Once your cluster profile is ready, you will use it to create a content bundle using the Palette Edge Content CLI. The Palette Edge CLI provides a command-line utility to interact with Palette and perform specific tasks, such as creating a content bundle.


Lastly, when your content bundle is ready, you will again use the CanvOS utility to embed the site-specific Edge installer configuration and user data into a bootable Edge installer ISO image. This bootable ISO image can install the necessary dependencies and configurations on a bare host machine. During installation, the host machine will boot from the Edge installer ISO, partition the disk, copy the image content to the disk, install the Palette Edge host agent and metadata, and perform several other configuration steps. 

The diagram below shows the high-level steps to build Edge artifacts using content bundle.

**>>>>>>>>>>> OVERARCHING DIAGRAM GOES HERE. <<<<<<<<<<**


# Prerequisites

To complete this how-to guide, you will need the following items:
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
  - 100 GB storage
 

* [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version` command.


* [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version` command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to create privileged containers.   


* A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a [free trial](https://www.spectrocloud.com/free-tier/).


* Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to generate a new registration token. For detailed instructions, refer to the [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.


* An account with [Docker Hub](https://hub.docker.com/). If you do not have an account with Docker Hub already, refer to the [Create an account](https://docs.docker.com/docker-id/) page for signing-up instructions. 
<br />

  <InfoBox>

  This guide uses Docker Hub as an example. You can use any other image registry that suit your requirements.

  </InfoBox>
  <br />

* A public repository named `opensuse-leap` in your image registry. Refer to the [Create a repository](https://docs.docker.com/docker-hub/repos/create/#create-a-repository) instructions for creating a Docker Hub repository and setting the repository's visibility to `public`. 


# Instructions

The instructions are split into smaller sub-sections to achieve smaller milestones that contribute to the final objective to build Edge artifacts using content bundle. 

<br />

## Build the Provider Images
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


5. Review the files relevant for this guide. 
    - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process. 
    - **Dockerfile** - Embeds the arguments and other configurations in the image.
    - **Earthfile** - Contains a series of commands to create target artifacts.
    - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
    - **user-data.template** - A sample user-data file.


6. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the `CUSTOM_TAG` variable. 
<br />

  ```bash
  export CUSTOM_TAG=palette-learn
  ```
  

7. Issue the command below to create the **.arg** file with the custom tag. It uses the default values for the remaining variables. The remaining arguments will use the default values. For example, `ubuntu` is the default operating system, `demo` is the default tag, and [ttl.sh](https://ttl.sh/) is the default image registry. Refer to the existing **.arg.template** file in the current directory or the [README](https://github.com/spectrocloud/CanvOS#readme) to learn more about the available customizable variables and their default values.
<br />

  <InfoBox>

  The default ttl.sh image registry is free and does not require a sign-up. Images pushed to ttl.sh are ephemeral and will expire after the 24 hrs time limit. Should you need to use a different image registry, refer to the Advanced workflow in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide.

  </InfoBox>

  Using the arguments defined in the **.arg** file, the final provider images you generate will have the following naming convention, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. For example, one of the provider images will be `ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo`.   
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
  

8. Issue the command below to save your tenant registration token to an environment variable. Replace `[your_token_here]` with your actual registration token. 
<br />

  ```bash
  export token=[your_token_here]
  ```
  
  
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

  View the newly created user data file to ensure the token is set correctly.
<br />

  ```bash
  cat user-data
  ``` 
  

10. The CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to start the build process.
<br />

  ```bash
  sudo ./earthly.sh +build-provider-images
  ```

  ```bash coloredLines=2-2 hideClipboard
  # Output condensed for readability
  ===================== Earthly Build SUCCESS ===================== 
  Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
  ```

  This command may take 15-20 minutes to finish depending on the hardware resources of the host machine. Upon completion, the command will display the manifest, as shown in the example below, that you will use in your cluster profile later in this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what you defined earlier in the **.arg** file.

  Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.
  <br />

  ```bash
  pack:
    content:
      images:
        - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
  options:
    system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
    system.registry: ttl.sh
    system.repo: ubuntu
    system.k8sDistribution: k3s
    system.osName: ubuntu
    system.peVersion: v3.4.3
    system.customTag: demo
    system.osVersion: 22
  ```


11. List the Docker images to review the provider images created. By default, provider images for all the Palette's Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag value you used in the  **.arg** file's `CUSTOM_TAG` variable. 
<br />

  ```shell
  docker images --filter=reference='*/*:*palette-learn'
  ```

  ```bash coloredLines=3-4 hideClipboard
  # Output
  REPOSITORY        TAG                                IMAGE ID       CREATED         SIZE
  ttl.sh/ubuntu     k3s-1.25.2-v3.4.3-palette-learn    b3c4956ccc0a   6 minutes ago   2.49GB
  ttl.sh/ubuntu     k3s-1.24.6-v3.4.3-palette-learn    fe1486da25df   6 minutes ago   2.49GB
  ```


12. To use one of the provider images in your cluster profile, use the following command to push it to the image registry mentioned in the **.arg** file. The current example pushes the provider image compatible with K3s v1.25 to the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does not require a sign-up.  
  <br />

  ```bash
  docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-palette-learn
  ```
  <br />

  <WarningBox>

  As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider images in your cluster profile within 24 hours of pushing to ttl.sh, they will expire and must be re-pushed. 
  
  </WarningBox>
<br />

## Create a Cluster Profile

Use the following steps to create a cluster profile that reference to the provider image you pushed to an image registry.
<br />

1. Open a web browser and log in to [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before you proceed to create a cluster profile. 


2. Navigate to the left **Main Menu** and select **Profile**. Click on the **Add Cluster Profile** button, and fill out the required basic information fields to create a cluster profle for Edge. 


3. Add the following OS layer in the **Profile Layers** section.

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |OS|Public Repo|BYOS Edge OS|`1.0.0`|


4. Replace the OS layer manifest with the following custom manifest so that the cluster profile can pull the provider image from the ttl.sh image registry. You may recall that the CanvOS script returned an output containing a custom manifest after building the Edge artifacts. You will copy the CanvOS output into the cluster profile's BYOOS pack YAML file. The `system.xxxxx` attribute values in the manifest below are as same as those you defined in the **.arg** file while building the Edge artifacts.  Copy the code snippet below into the YAML editor for the BYOOS pack.  
<br />

  ```yaml
  pack:
    content:
      images:
        - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
  options:
    system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
    system.registry: ttl.sh
    system.repo: ubuntu
    system.k8sDistribution: k3s
    system.osName: ubuntu
    system.peVersion: v3.4.3
    system.customTag: demo
    system.osVersion: 22
  ``` 
  <br />

  <InfoBox>

  The BYOOS pack's `system.uri` variable references the Kubernetes version selected in the cluster profile through the usage of the `{{ .spectro.system.kubernetes.version }}` [macro](/clusters/cluster-management/macros). This is how the provider images you created and pushed to a registry are tied to the OS and Kubernetes choices you selected or referenced in the **.arg** file.

  </InfoBox>
 
  The screenshot below shows you how to reference a provider image in the BYOOS pack of your cluster profile.
  <br />

  ![A screenshot of k3s OS layer in a cluster profile.](/tutorials/edge/clusters_edge_deploy-cluster_edit-profile.png)

  <WarningBox>

  ttl.sh is a short-lived image registry. If you do not use the provider image in your cluster profile within 24 hours of pushing to ttl.sh, they will no longer exist and must be re-pushed. In a production environment, use a custom registry for hosting provider images.

  </WarningBox>
  <br />

5. Add the following Kubernetes layer to your cluster profile. Select the K3s version 1.25.x because earlier in this how-to guide, you pushed a provider image compatible with K3s v1.25.2 to the ttl.sh image registry. 

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |Kubernetes|Public Repo|Palette Optimized K3s|`1.25.x`|


6. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer. This step completes the core infrastructure layers in the cluster profile.  

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |Network|Public Repo|Calico|`3.25.x`|
    
  
7. Next, you can add add-on layers and manifests to your cluster profile per your requirements. 


8. If there are no errors or compatibility issues, Palette displays the newly created full cluster profile for review. Verify the layers you added, and finish creating the cluster profile. 
<br />


## Download and Install the Palette Edge CLI

Use the steps below to download, install, and verify Palette Edge CLI utility. 
<br />

1. Download the Edge CLI for Linux by issuing the following command. This command uses the `curl` utility to download the Palette Edge CLI binary from the specified URL and save it as **palette-edge** in the current directory.
<br />

  ```bash
  curl https://software.spectrocloud.com/stylus/v3.4.3/cli/linux/palette-edge -o palette-edge
  ```


2. Set the executable permissions for the **palette-edge** binary by issuing the following command.
<br />

  ```bash
  chmod 755 palette-edge
  ```


3. Use the following command to move the **palette-edge** binary to the **/bin/** directory. You will need elevated privileges to perform this operation. This step will allow the `palette-edge`` command to be executed from anywhere in your Linux machine.
<br /> 

  ```bash
  sudo mv palette-edge /bin/
  ```


4. Verify the installation of the Palette Edge CLI by issuing the following command. The output will display information about the installed version of the Palette Edge CLI. It confirms that the CLI is installed and accessible.
<br />

  ```bash
  palette-edge show
  ```

  ```bash hideClipboard
  # Sample output   
  ┌────────────────────────────────────────────────────────────────────────┐
  | OS Flavor     | Description        | Base Image URI                    |
  | opensuse-leap | Opensuse Leap 15.4 | quay.io/kairos/core-opensuse-leap |
  | ubuntu-20     | Ubuntu 20.4 LTS    | quay.io/kairos/core-ubuntu-20-lts |
  | ubuntu-22     | Ubuntu 22.4 LTS    | quay.io/kairos/core-ubuntu-22-lts |
  └────────────────────────────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  | K8S Flavor | Description        | Supported Versions                                        |
  | k3s        | Rancher K3s        | 1.25.2-k3s1,1.24.6-k3s1,1.23.12-k3s1,1.22.15-k3s1         |
  | kubeadm    | Kubernetes kubeadm | 1.25.2,1.24.6,1.23.12,1.22.15                             |
  | rke2       | Rancher RK2        | 1.25.2-rke2r1,1.24.6-rke2r1,1.23.12-rke2r1,1.22.15-rke2r1 |
  └─────────────────────────────────────────────────────────────────────────────────────────────┘
  ┌─────────────────────────────────┐
  | Component             | Version |
  | Spectro Agent Version | v3.4.3  |
  | Kairos Version        | v2.0.3  |
  └─────────────────────────────────┘
  ```
<br />

## Create an Offline Content Bundle
Use the following steps to create an offline content bundle.
<br />

1. To get started with using Palette Edge CLI, you need a Spectro Cloud API key to authenticate and interact with the Palette API endpoint. To add a new API key, log in to Palette, click on the user **User Menu** at the top right, and select **My API Keys**, as shown in the screenshot below. 

  Fill in the required fields, such as the API key name and expiration date, and confirm your changes. Copy the key value to your clipboard to use in the next step.

![Screenshot of generating an API key in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_generate-api-key.png )

  

2. Set the API key by issuing the following command. The Palette Edge CLI will use this API key to authenticate itself when interacting with the Spectro Cloud API. Once authenticated, the Palette Edge CLI can access and manage resources in your Spectro Cloud account.
<br />

  ```bash
  export API_KEY=[USE-YOUR-API-KEY_HERE]
  ```


3. Set the profile ID using the following command. This command sets the profile ID, which identifies the specific cluster profile that you want to use for creating the offline content bundle. 
<br />

  ```bash
  export PROFILE_ID="649133494c39ac0e8e61a9e5"
  ```


4. Set the project ID by issuing the following command. 
This command sets the project ID, which identifies the specific project with which the offline content bundle will be associated. The project ID is used to organize and manage resources within Spectro Cloud.
<br />

  ```bash
  export PROJECT_ID="6342eab2faa0813ead9082e0"
  ```


5. Build the offline content bundle using the following command. The content bundle will have the configuration and settings for the Edge cluster, including the operating system image, Kubernetes distribution, any additional packs, and manifest files specified in your cluster profile you wish to deploy to the Edge cluster.

  The command below uses the palette-edge tool to build the offline content bundle. The `--api-key`, `--project-id`, and `--cluster-profile-ids` options are used to specify the necessary parameters for the build process. The `--palette-endpoint` option specifies the endpoint URL for the Spectro Cloud API. The `--outfile` option specifies the name of the output file for the content bundle.
<br />

  ```bash
  palette-edge build --api-key $API_KEY \
  --project-id $PROJECT_ID \
  --cluster-profile-ids $PROFILE_ID \
  --palette-endpoint api.spectrocloud.com \
  --outfile content
  ```


6. Use the command below to list all files in the current directory, including the newly built content bundle. The content bundle will have the following naming convention, `content-[randon-string]`, for example, **content-8e61a9e5**. The command below will verify that the content bundle with the specified name has been created successfully.
<br />

  ```bash
  ls -al
  ```


7. List the details of the content bundle using the following command. Replace the `content-[randon-string]` with the content bundle in your current directory. The command below will provide information such as file size, permissions, and modification date.
<br />

  ```bash
  ls -l content-[randon-string]
  ```


8. Issue the following command to execute the **earthly.sh** script with elevated privileges. The `+iso` option specifies the build target. This command will generate an ISO image from the content bundle, and other configuration you have specified in the **.arg** file and **user-data** earlier during building the provider images. 
<br />

  ```bash
  sudo ./earthly.sh +iso
  ```


9. List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.
<br />

  ```shell
  ls build/
  ```

  ```shell hideClipboard
  # Output
  palette-edge-installer.iso      
  palette-edge-installer.iso.sha256
  ```

# Validate

To validate the Edge installer ISO image, you can follow these steps:
<br />

1. Create a bootable USB flash drive using any third-party software.


2. Select a physical or virtual host machine to emulate as an edge device. Make sure to enable (Dynamic Host Configuration Protocol) DHCP  on the edge device before proceeding with the installation process. This is necessary for the device to obtain an IP address automatically from the network. 


3. Use the software to flash a bare host machine with the bootable USB drive. Most software that creates a bootable USB drive will automatically validate the ISO image during the installation process. 





