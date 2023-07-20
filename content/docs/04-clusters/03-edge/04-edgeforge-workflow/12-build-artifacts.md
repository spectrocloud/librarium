---
title: "Build Edge Artifacts using Content Bundle"
metaTitle: "Build Edge Artifacts using Content Bundle"
metaDescription: "Learn how to build Edge Installer ISO using Spectro Cloud's CanvOS and Palette Edge CLI utilities."
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

The current guide extends the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide and uses a content bundle to build the Edge installer ISO image. 
<br />

<WarningBox>

Before you proceed, you must follow the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to build the provider images for all the Palette-supported Kubernetes versions and push one of them to an image registry of your choice. This guide uses a provider image compatible with K3s v1.25.x pushed to the [ttl.sh](https://ttl.sh/) image registry. However, you can use any other provider image or registry per your requirements.

</WarningBox>


In this how-to guide, you will create a cluster profile using one of the provider images. Then you will use that cluster profile to create a content bundle using the Palette Edge CLI. The Palette Edge CLI provides a command-line utility to interact with Palette and perform specific tasks, such as creating a content bundle. Lastly, when your content bundle is ready, you will use the CanvOS utility to embed the site-specific Edge installer configuration and user data into a bootable Edge installer ISO image.  

The diagram below shows the high-level steps to build Edge artifacts using content bundle.

![An overarching diagram showing the workflow in the current guide.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_overarching.png)


# Prerequisites

To complete this how-to guide, you will need the following items:
<br />

* Provider images are built following the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide.


* One of the provider images is pushed to any image registry. This guide uses a provider image compatible with K3s v1.25.x pushed to the [ttl.sh](https://ttl.sh/) image registry. However, you can use any other provider image and image registry per your requirements.


* All other prerequisites remain the same as outlined in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide, except for this guide needs your Linux machine to have 100 GB of storage or higher. The actual storage will depend on the size of the content bundle you will use to build the Edge installer ISO image.




# Instructions

Use the following instructions on your Linux machine to customize the arguments and Dockerfile and then create all the required Edge artifacts.
<br />

1. The first few steps will guide you to download, install, and verify Palette Edge CLI utility. Download the Edge CLI for Linux by issuing the following command. This command uses the `curl` utility to download the Palette Edge CLI binary from the specified URL and save it as **palette-edge** in the current directory.
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


5. The next few steps will guide you to create a cluster profile that reference to the provider image you must have pushed to an image registry already. Check the prerequisites for more details. 

  Open a web browser and log in to [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before you proceed to create a cluster profile. 


6. Navigate to the left **Main Menu** and select **Profile**. Click on the **Add Cluster Profile** button, and fill out the required basic information fields to create a cluster profle for Edge. 


7. Add the following OS layer in the **Profile Layers** section.

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |OS|Public Repo|BYOS Edge OS|`1.0.0`|


8. Replace the OS layer manifest with the following custom manifest so that the cluster profile can pull the provider image from the ttl.sh image registry. You may recall that the CanvOS script returned an output containing a custom manifest after building the Edge artifacts. You will copy the CanvOS output into the cluster profile's BYOOS pack YAML file. The `system.xxxxx` attribute values in the manifest below are as same as those you defined in the **.arg** file while building the Edge artifacts.  Modify the code snippet below based on the values you have specified in your **.arg** file, and paste it into the YAML editor for the BYOOS pack.  
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

9. Add the following Kubernetes layer to your cluster profile. Select the K3s version 1.25.x because earlier in this how-to guide, you pushed a provider image compatible with K3s v1.25.2 to the ttl.sh image registry. 

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |Kubernetes|Public Repo|Palette Optimized K3s|`1.25.x`|


10. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer. This step completes the core infrastructure layers in the cluster profile.  

  |**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
  |---|---|---|---|
  |Network|Public Repo|Calico|`3.25.x`|
    
  
11. Next, you can add add-on layers and manifests to your cluster profile per your requirements. 


12. If there are no errors or compatibility issues, Palette displays the newly created full cluster profile for review. Verify the layers you added, and finish creating the cluster profile. 


13. The remaining steps will guide you to create an offline content bundle using the Palette Edge CLI, and build the Edge installer ISO. 

  To get started with using Palette Edge CLI, you need a Spectro Cloud API key to authenticate and interact with the Palette API endpoint. To add a new API key, log in to Palette, click on the user **User Menu** at the top right, and select **My API Keys**, as shown in the screenshot below. 

  Fill in the required fields, such as the API key name and expiration date, and confirm your changes. Copy the key value to your clipboard to use in the next step.

![Screenshot of generating an API key in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_generate-api-key.png )

  

14. Set the API key by issuing the following command. The Palette Edge CLI will use this API key to authenticate itself when interacting with the Spectro Cloud API. Once authenticated, the Palette Edge CLI can access and manage resources in your Spectro Cloud account.
<br />

  ```bash
  export API_KEY=[USE-YOUR-API-KEY_HERE]
  ```


15. Set the profile ID using the following command. This command sets the profile ID, which identifies the specific cluster profile that you want to use for creating the offline content bundle. 
<br />

  ```bash
  export PROFILE_ID="649133494c39ac0e8e61a9e5"
  ```


16. Set the project ID by issuing the following command. 
This command sets the project ID, which identifies the specific project with which the offline content bundle will be associated. The project ID is used to organize and manage resources within Spectro Cloud.
<br />

  ```bash
  export PROJECT_ID="6342eab2faa0813ead9082e0"
  ```


17. Build the offline content bundle using the following command. The content bundle will have the configuration and settings for the Edge cluster, including the operating system image, Kubernetes distribution, any additional packs, and manifest files specified in your cluster profile you wish to deploy to the Edge cluster.

  The command below uses the palette-edge tool to build the offline content bundle. The `--api-key`, `--project-id`, and `--cluster-profile-ids` options are used to specify the necessary parameters for the build process. The `--palette-endpoint` option specifies the endpoint URL for the Spectro Cloud API. The `--outfile` option specifies the name of the output file for the content bundle.
<br />

  ```bash
  palette-edge build --api-key $API_KEY \
  --project-id $PROJECT_ID \
  --cluster-profile-ids $PROFILE_ID \
  --palette-endpoint api.spectrocloud.com \
  --outfile content
  ```


18. Use the command below to list all files in the current directory, including the newly built content bundle. The content bundle will have the following naming convention, `content-[randon-string]`, for example, **content-8e61a9e5**. The command below will verify that the content bundle with the specified name has been created successfully.
<br />

  ```bash
  ls -al
  ```


19. List the details of the content bundle using the following command. Replace the `content-[randon-string]` with the content bundle in your current directory. The command below will provide information such as file size, permissions, and modification date.
<br />

  ```bash
  ls -l content-[randon-string]
  ```


20. Issue the following command to execute the **earthly.sh** script with elevated privileges. The `+iso` option specifies the build target. This command will generate an ISO image from the content bundle, and other configuration you have specified in the **.arg** file and **user-data** earlier during building the provider images. 
<br />

  ```bash
  sudo ./earthly.sh +iso
  ```


21. List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.
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





