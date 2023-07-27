---
title: "Build Edge Artifacts using a Content Bundle"
metaTitle: "Build Edge Artifacts using a Content Bundle"
metaDescription: "Learn how to build an Edge installer ISO using the Palette Edge CLI and the CanvOS utilities."
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

# Build Edge Artifacts using a Content Bundle

Palette's Edge solution supports creating Edge artifacts for edge devices deployed in a low internet bandwidth environment or an *air-gapped* environment. An air-gapped environment is a deployment site with no direct internet access. Using a content bundle, you can build Edge artifacts for installation in such environments.


A content bundle is an archive that includes the Operating System (OS) image, the Kubernetes distribution, the Network Container Interface (CNI), and all other dependencies specified in the cluster profiles you want to deploy to the Edge cluster. A content bundle provides several benefits, such as:
<br />

- Software dependencies are pre-loaded into the installer image.


- Optimizes the deployment process for bandwidth-constrained environments or air-gapped environments.


- The ability to more granularly manage the software dependencies available to Edge clusters. 


This how-to guide provides instructions for creating and using a content bundle to build the Edge artifacts. You will begin with installing a necessary tool, the Palette Edge CLI, on your development machine. The Palette Edge CLI is a command-line utility to interact with Palette and perform specific tasks in your development environment, such as creating a content bundle. Next, you will download all the software dependencies mentioned in your cluster profile using the Palette Edge CLI and create a content bundle. Lastly, when your content bundle is ready, you will use the CanvOS utility to embed the content bundle and user data into the Edge installer ISO image.    

The diagram below displays the overarching steps to build the Edge installer ISO using a content bundle. The diagram also highlights the primary prerequisites to create a content bundle.

![An overarching diagram displaying the workflow in the current guide.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_overarching.png)


# Prerequisites

<WarningBox>

  This how-to guide extends the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) workflow. Therefore, you must complete it before proceeding with the current guide. 

</WarningBox>
  

To complete this guide, you will need the following items:
<br />

* A physical or virtual Linux machine with *AMD64* (also known as *x86_64*) processor architecture to build the Edge installer ISO image. You can issue the following command in the terminal to check your processor architecture. 
  <br/>

  ```bash
  uname -m
  ```

* The Linux machine should have the following minimum hardware configuration:
  - 4 CPU
  - 8 GB memory
  - 100 GB storage. The actual storage will depend on the size of the content bundle you will use to build the Edge installer ISO image.


* You must have completed the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to build the provider images and create a cluster profile referencing one of the provider images. 


* A Spectro Cloud API key. Later in this guide, you will use this API key to authenticate the Palette Edge CLI utility and allow it to interact with the Palette. Refer to the [User Authentication](https://docs.spectrocloud.com/user-management/user-authentication/#apikey) guide to create a new API key. 


# Instructions

Use the following instructions on your Linux machine, which this guide refers to as the development environment. 
<br />

1.  Visit the [Downloads](https://docs.spectrocloud.com/spectro-downloads#paletteedgecli) page and download the latest Palette Edge CLI. You can download the Palette Edge CLI by clicking on the available URL or using the download URL in the following command. Replace the `[PALETTE-EDGE-BINARY-URL]` placeholder with the download URL. 
<br />

  ```bash
  curl [PALETTE-EDGE-BINARY-URL] --output palette-edge
  ```


2. Open a terminal session and navigate to the folder where you have downloaded the palette-edge binary.
 
 

3. Set the executable permissions for the palette-edge binary by issuing the following command.
<br />

  ```bash
  chmod 755 palette-edge
  ```


4. Use the following command to move the palette-edge binary to the **/usr/local/bin** directory to make the binary available in your system $PATH.  This will allow you to issue the `palette-edge` command from any directory in your development environment.
<br /> 

  ```bash
  mv palette-edge /usr/local/bin
  ```


5. Verify the installation of the Palette Edge CLI by issuing the following command. The output will display information about the currently supported OS and Kubernetes distributions. 
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



6. Set the Spectro Cloud API key as an environment variable by issuing the following command. Replace the `[USE-YOUR-API-KEY_HERE]` placeholder with your API key. The Palette Edge CLI will use this API key to authenticate itself when interacting with the Spectro Cloud API. Once authenticated, the Palette Edge CLI can interact with your Palette account.
<br />

  ```bash
  export API_KEY=[USE-YOUR-API-KEY_HERE]
  ```


7. Log in to [Palette](https://console.spectrocloud.com).


8. Copy the Palette project ID to use later in this guide. The project ID is on the top-right corner of your Palette project overview page. For example, the screenshot below highlights a project ID.

  ![A screenshot highlighting the project ID in Palette project overview page](/clusters_edge_edge-forge-workflow_build-images_build-project_id.png)


9. Navigate to the left **Main Menu** and select **Profiles**. 


10. Click on the specific cluster profile to view its details. 


11. Examine the cluster details page URL. The cluster details page URL follows the `[Palette-URL]/projects/[PROJECT-ID]/profiles/cluster/[CLUSTER-PROFILE-ID]` syntax. The cluster details page URL has your project ID and the cluster profile ID. For example, the screenshot below highlights the project ID and the cluster profile ID in a cluster details page URL. 

  ![A screenshot highlighting the cluster profile ID and project ID in the URL of the cluster details page.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_url.png)



12. Copy the cluster profile ID from the cluster details page URL for the next step. 


13. Switch back to your development environment, and set the project ID as an environment variable by issuing the following command. Replace the `[USE-YOUR-PROJECT-ID_HERE]` placeholder with your project ID.
<br />

  ```bash
  export PROJECT_ID=[USE-YOUR-PROJECT-ID_HERE]
  ```


14. Set the cluster profile ID as an environment variable using the following command. Replace the `[USE-YOUR-PROFILE-ID_HERE]` placeholder with your cluster profile ID. The Palette Edge CLI uses the cluster profile ID to reference the correct cluster profile and download all its software dependencies. 
<br />

  ```bash
  export PROFILE_ID=[USE-YOUR-PROFILE-ID_HERE]
  ```


15. Use the command below to create the content bundle. The command uses the following flags:

  |**Command Flag**|**Value**|
  |---|---|
  |`--api-key`|Spectro Cloud API key|
  |`--project-id`|Palette project ID|
  |`--cluster-profile-ids`|Cluster profile IDs. If you want to include multiple cluster profiles in the content bundle, add multiple cluster profile IDs separated by a comma.|
  |`--palette-endpoint`|Palette API endpoint. The default Palette API endpoint is `api.spectrocloud.com`|
  |`--outfile`|Path to write the final content bundle. |
  You can issue `palette-edge build --help` to know about other available flags. 
<br />

  ```bash
  palette-edge build --api-key $API_KEY \
    --project-id $PROJECT_ID \
    --cluster-profile-ids $PROFILE_ID \
    --palette-endpoint api.spectrocloud.com \
    --outfile content
  ```
  


16. Use the command below to list all files in the current directory to verify that you successfully created the content bundle. The content bundle will have the following naming convention, `content-[randon-string]`, for example, **content-8e61a9e5**. 
<br />

  ```bash
  ls -al
  ```


17. List the files in the content bundle folder using the following command. Replace the `content-[randon-string]` with the content bundle in your current directory. The output will display the compressed files for the core and the app content. 
<br />

  ```bash
  ls -l content-[randon-string]
  ```
  ```bash hideClipboard
  # Sample output   
  total 3981104
  -rw-rw-r-- 1 jb jb 1598552722 Jul 26 18:20 app-content-8e61a9e5.zst
  -rw-rw-r-- 1 jb jb 2478086360 Jul 26 18:20 core-content-8e61a9e5.zst
  ```


18. Issue the following command to execute the **earthly.sh** script with elevated privileges. The `+iso` option specifies the build target. This command will generate an ISO image from the content bundle and other configurations you have specified in the **.arg** and **user-data** files. 
<br />

  ```bash
  sudo ./earthly.sh +iso
  ```
  This command may take up to 15-20 minutes to finish depending on the resources of the host machine. 


# Validate

List the Edge installer ISO and checksum by issuing the following command from the **CanvOS/** directory.
<br />

```shell
ls build/
```

```shell hideClipboard
# Output
palette-edge-installer.iso      
palette-edge-installer.iso.sha256
```
<br />

To validate, you can prepare an edge device using the Edge installer ISO by following the steps below:
<br />

1. Create a bootable USB flash drive using any third-party software. Most software that creates a bootable USB drive will validate the ISO image.


2. Select a physical or virtual host machine to emulate as an edge device. Enable (Dynamic Host Configuration Protocol) DHCP on the edge device before proceeding with the installation process. Enabling DHCP is necessary for the device to obtain an IP address automatically from the network. 


3. Flash the edge device with a bootable USB drive. 


Finally, you must deploy an Edge cluster to test the edge device you prepare using the Edge installer ISO. 


# Next Steps

The next step is to use the Edge installer ISO to prepare your Edge host. To learn more about utilizing the Edge artifacts to prepare Edge hosts and deploy Palette-managed Edge clusters, we encourage you to check out the reference resources below.
<br />

- [Deploy an Edge Cluster on VMware](/clusters/edge/site-deployment/deploy-cluster) 


- [Prepare Edge Host for Installation](/clusters/edge/site-deployment/stage)