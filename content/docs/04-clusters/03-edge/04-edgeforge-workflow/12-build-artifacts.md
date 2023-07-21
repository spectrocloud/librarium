---
title: "Build Edge Artifacts using Content Bundle"
metaTitle: "Build Edge Artifacts using Content Bundle"
metaDescription: "Learn how to build Edge Installer ISO using Spectro Cloud's Palette Edge CLI and CanvOS utilities."
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

# Build Edge Artifacts using Content Bundle

Palette's Edge solution supports creating Edge artifacts for edge devices having low or zero internet bandwidth or deployed in an *air-gapped* environment. An *air-gapped* environment is a deployment site with no direct or indirect connectivity to other devices or outside networks. In such environments, you prepare edge devices using the Edge artifacts built using a *content bundle*.


A content bundle is an archive that includes the operating system image, Kubernetes distribution, additional layers, and packs and manifest files specified in your cluster profile that you want to deploy to the Edge cluster. A content bundle provides several benefits, such as:
<br />

- Preloads required software dependencies to remove the need for downloading assets during cluster deployment, 


- Optimizes the deployment process in bandwidth-constrained environments 


- Installs only authorized tools or software on Edge devices. 

The current guide provides instructions to create and use a content bundle to build the Edge installer ISO image. However, before you proceed with the current guide, you must build provider images by following the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide. 
<br />

<WarningBox>

This guide extends the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) workflow. Therefore, you must follow the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to build the provider images for all the Palette-supported Kubernetes versions and push one of them to an image registry of your choice. This guide uses a provider image compatible with K3s v1.25.x pushed to the [ttl.sh](https://ttl.sh/) image registry. However, you can use any other provider image or registry per your requirements.

</WarningBox>
<br />

In this guide, you will begin with installing the necessary tool, the Palette Edge CLI, on your development machine. Next, you will create a cluster profile in Palette referencing one of the provider images you built using the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) workflow. Then, you will access the cluster profile using the Palette Edge CLI utility to create a content bundle. Lastly, when your content bundle is ready, you will use the CanvOS utility to embed the content bundle, site-specific configuration, and user data into the Edge installer ISO image.  
  

The diagram below displays the high-level steps to build the Edge installer ISO image using a content bundle.

![An overarching diagram displaying the workflow in the current guide.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_overarching.png)


# Prerequisites

To complete this how-to guide, you will need the following items:
<br />

* All prerequisites outlined in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide, except for this guide, your Linux machine must have 100 GB of storage or higher. The actual storage will depend on the size of the content bundle you will use to build the Edge installer ISO image.


* Provider images are built following the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide.


* One of the provider images is pushed to an image registry. This guide uses a provider image compatible with K3s v1.25.x pushed to the [ttl.sh](https://ttl.sh/) image registry. However, you can use any other provider image and registry per your requirements.


# Instructions

Use the following instructions on your Linux machine, which this guide refers to as the development environment.
<br />

1. The first few steps will guide you to download, install, and verify the Palette Edge CLI. The Palette Edge CLI is a command-line utility to interact with Palette and perform specific tasks in your development environment, such as creating a content bundle. 

  Issue the following command to download the Palette Edge CLI. This command uses `curl` to download the Palette Edge CLI binary from the specified URL and save it as **palette-edge** in the current directory. 
<br />

  ```bash
  curl https://software.spectrocloud.com/stylus/v3.4.3/cli/linux/palette-edge --output palette-edge
  ```


2. Set the executable permissions for the **palette-edge** binary by issuing the following command.
<br />

  ```bash
  chmod 755 palette-edge
  ```


3. Use the following command to move the **palette-edge** binary to the **/bin/** directory. You will need elevated privileges to perform this operation. This step will allow you to issue the `palette-edge` command from any directory in your development environment.
<br /> 

  ```bash
  sudo mv palette-edge /bin/
  ```


4. Verify the installation of the Palette Edge CLI by issuing the following command. The output will display information about the installed version of the Palette Edge CLI. 
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


5. The next few steps will guide you to create a cluster profile referencing the provider image you must have already pushed to an image registry. Check the **Prerequisites** section if you do not have a provider image in an image registry. 

  Open a web browser and log in to [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before creating a cluster profile. 


6. Navigate to the left **Main Menu** and select **Profiles**. Click on the **Add Cluster Profile** button, and fill out the required basic information fields to create a cluster profile for Edge. 


7. Add the following OS layer in the **Profile Layers** section.

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |OS|Public Repo|BYOS Edge OS|`1.0.0`|


8. Replace the OS layer manifest with the following custom manifest so that the cluster profile can pull the provider image from the ttl.sh image registry. This manifest is the output CanvOS returned after building the Edge artifacts in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) workflow.

  The `system.xxxxx` attribute values below refer to the arguments defined in the **.arg** file. If you modified the arguments in the **.arg** file, you must modify the attribute values below accordingly. 

  After you verify the attribute values, copy the following manifest into the cluster profile's BYOOS pack configuration.    
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

  The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using the `{{ .spectro.system.kubernetes.version }}` [macro](/clusters/cluster-management/macros). This is how the provider images you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the **.arg** file.

  </InfoBox>
 
  The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.
  <br />

  ![A screenshot of k3s OS layer in a cluster profile.](/tutorials/edge/clusters_edge_deploy-cluster_edit-profile.png)

  <WarningBox>

  The ttl.sh is a short-lived image registry. If you do not use the provider image in your cluster profile within 24 hours of pushing to ttl.sh, it will no longer exist and must be re-pushed. In a production environment, use a custom registry to host provider images.

  </WarningBox>
  <br />


9. Add the following Kubernetes layer to your cluster profile. Select the K3s version 1.25.x because earlier in this how-to guide, you pushed a provider image compatible with K3s v1.25.2 to the ttl.sh image registry. 

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |Kubernetes|Public Repo|Palette Optimized K3s|`1.25.x`|


10. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer. This step completes the core infrastructure layers in the cluster profile.  

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |Network|Public Repo|Calico|`3.25.x`|
    
  
11. Add add-on layers and manifests to your cluster profile per your requirements. 


12. If there are no errors or compatibility issues, Palette displays the newly created complete cluster profile for review. Verify the layers you added, and finish creating the cluster profile. 


13. The remaining steps will guide you to create an offline content bundle using the Palette Edge CLI and build the Edge installer ISO. 

  To use Palette Edge CLI, you need a Spectro Cloud API key to authenticate and interact with the Palette API endpoint. To add a new API key, log in to Palette, click on the user **User Menu** at the top right, and select **My API Keys**, as displayed in the screenshot below. 

  Fill in the required fields, such as the API key name and expiration date, and confirm your changes. Copy the key value to your clipboard to use in the next step.

  ![Screenshot of generating an API key in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_generate-api-key.png )

  

14. Set the API key by issuing the following command. Replace the `[USE-YOUR-API-KEY_HERE]` placeholder with your API key. The Palette Edge CLI will use this API key to authenticate itself when interacting with the Spectro Cloud API. Once authenticated, the Palette Edge CLI can access and manage resources in your Spectro Cloud account.
<br />

  ```bash
  export API_KEY=[USE-YOUR-API-KEY_HERE]
  ```


15. Copy the cluster profile and project IDs from Palette to use in the next step. To locate these IDs, switch to [Palette](https://console.spectrocloud.com). Navigate to the left **Main Menu** and select **Profiles**. Click on the specific cluster profile to view its details. The cluster profile and project IDs are in the cluster details page URL. The cluster details page URL follows the `[Palette-URL]/projects/[PROJECT-ID]/profiles/cluster/[PROFILE-ID]` syntax. 

  For example, the screenshot below highlights the cluster profile and project IDs in a cluster details page URL. 

  ![A screenshot highlighting the cluster profile and project IDs in the URL of the cluster details page.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_url.png)



16. Set the profile ID using the following command. Replace the `[USE-YOUR-PROFILE-ID_HERE]` placeholder with your cluster profile ID. This command sets the profile ID, which identifies the specific cluster profile that you want to use for creating the offline content bundle. 
<br />

  ```bash
  export PROFILE_ID=[USE-YOUR-PROFILE-ID_HERE]
  ```


17. Set the project ID by issuing the following command. Replace the `[USE-YOUR-PROJECT-ID_HERE]` placeholder with your cluster profile ID.
The offline content bundle will be associated with the project ID you will use in the following command. 
<br />

  ```bash
  export PROJECT_ID=[USE-YOUR-PROJECT-ID_HERE]
  ```


18. Build the offline content bundle using the following command. The content bundle will have the configuration and settings for the Edge cluster, including the operating system image, Kubernetes distribution, any additional packs, and manifest files specified in your cluster profile you wish to deploy to the Edge cluster.

  The command below uses the palette-edge tool to build the offline content bundle. The `--api-key`, `--project-id`, and `--cluster-profile-ids` options specify the necessary parameters for the build process. The `--palette-endpoint` option specifies the endpoint URL for the Spectro Cloud API. The `--outfile` option specifies the name of the output file for the content bundle.
<br />

  ```bash
  palette-edge build --api-key $API_KEY \
  --project-id $PROJECT_ID \
  --cluster-profile-ids $PROFILE_ID \
  --palette-endpoint api.spectrocloud.com \
  --outfile content
  ```


19. Use the command below to list all files in the current directory, including the newly built content bundle. The content bundle will have the following naming convention, `content-[randon-string]`, for example, **content-8e61a9e5**. The command below will verify that you successfully created the content bundle with the specified name.
<br />

  ```bash
  ls -al
  ```


20. List the details of the content bundle using the following command. Replace the `content-[randon-string]` with the content bundle in your current directory. The command below will provide information such as file size, permissions, and modification date.
<br />

  ```bash
  ls -l content-[randon-string]
  ```


21. Issue the following command to execute the **earthly.sh** script with elevated privileges. The `+iso` option specifies the build target. This command will generate an ISO image from the content bundle and other configurations you have specified in the **.arg** and **user-data** files. 
<br />

  ```bash
  sudo ./earthly.sh +iso
  ```


22. List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.
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


2. Select a physical or virtual host machine to emulate as an edge device. Enable (Dynamic Host Configuration Protocol) DHCP on the edge device before proceeding with the installation process. Enabling DHCP is necessary for the device to obtain an IP address automatically from the network. 


3. Use the software to flash a bare host machine with a bootable USB drive. Most software that creates a bootable USB drive will automatically validate the ISO image during the installation process. 