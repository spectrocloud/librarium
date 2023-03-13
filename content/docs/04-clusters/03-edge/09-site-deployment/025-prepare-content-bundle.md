---
title: "Prepare Content Bundle"
metaTitle: "Prepare content bundle consisting of packages required for installation"
metaDescription: "Learn how prepare your content bundle for installation"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

You can create a content bundle that contains all the required packages and artifacts the Edge host need for a successful installation. You only need to create a content bundle for some installation scenarios.

The following table lists the various installation scenarios. Use the table to identify if you need to create a content bundle.

| **Scenario**  | **Description** | **Content Bundle** |
|-|-|-|
| Detached Air gapped Cluster |  You are deploying Edge clusters in a completely air-gapped environment without internet access. The clusters are not managed by the Palette Management System.|Mandatory|
| Connected Cluster |  You are deploying Edge clusters in an environment with internet connectivity, and the Palette Management System manages the clusters. You may build a content bundle for bandwidth optimization, but it is not required.|Optional|
| Managed Air Gapped Cluster |  You are deploying Edge clusters in an environment that is without internet access. However, you have an air-gapped version of the Palette Management system installed in the environment, which will manage your Edge clusters.|Mandatory|
| Cluster with Custom OS |  You are deploying Edge Clusters with a custom operating system.   |Mandatory|


# Prepare Content Bundle

Use the following steps to create a content bundle for the Edge Installer.

# Prerequisites

- [UPX](https://upx.github.io/) or similar executable file compressor utility. The Spectro Cloud CLI is downloaded as a compressed package. Use [uxp](https://upx.github.io/) to extract the CLI from the compressed package.


- Palette API key. Refer to the [User Authentication](/user-management/user-authentication/#apikey) resource to learn how to create a Palette API key.


- An Edge Native cluster profile. Refer to [Create Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile) guide to learn how to create an Edge Native cluster profile.



# Create Content Bundle


1. Download the Spectro Cloud CLI. Use the link for your respective operating system.


2. Unpack the compressed package to access the CLI. Use the following command to extract the CLI.

    ```shell
    upx -d ./spectro-cli-<YourOS>-<yourArchitecture>
    ```

3. Assign the executable bit to the CLI. 
    ```shell
    chmod +x ./spectro-cli-<YourOS>-<yourArchitecture>
    ```

4. Log in to [Palette](https://console.spectrocloud.com).


5. Select the project you want to deploy the Edge host to and copy down the **Project ID**. 
You can find the project id at the top right-hand side corner of the landing page, below the **User drop-down Menu**.


6. Navigate to the left **Main Menu** and select **Profiles**.


7. Use the **drop-down Menu Cloud Types** and select **Edge Native**. 


8. Click on the cluster profile you want to include in the content bundle.


9. You can find the cluster profile id by reviewing the URL of the current page. The cluster profile id is the last value in the URL. Repeat this step for all the cluster profiles you want to specify in the content bundle.

    ```
    https://console.spectrocloud.com/projects/yourProjectId/profiles/cluster/<YourClusterProfileHere>
    ```

10. Navigate back to your terminal window and issue the following command to create the content bundle. Replace the placeholder values with your actual values.

    <br />

    <InfoBox>

    There are several Spectro Cloud CLI flags that you can use to customize the content bundle. Use the command `./spectro-cli-linux-amd64 build --help` to learn more about the available flags.

    </InfoBox>

    <br />

    ```shell
   ./spectro-cli-linux-amd64 build --api-key <API_KEY> \
    --project-id <PROJECT_ID> \ 
    --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
    --palette-endpoint <Palette API Endpoint> \
    --export-for-connected \
    --outfile <bundle-name>.tar \
    --iso
    ```

    Example:
    ```shell
    ./spectro-cli-linux-amd64 build --api-key 12345678910 \
    --project-id 12345678910 \
    --cluster-profile-ids 123456789010 \
    --palette-endpoint api.spectrocloud.com \
    --export-for-connected \
    --outfile my-edge-bundle.tar \
    --iso
    ```

    ```shell
    INFO[0000] getting hubble export for build
    INFO[0001] pulling image gcr.io/spectro-dev-public/stylus:v3.2.0
    INFO[0008] pulling image ghcr.io/kube-vip/kube-vip:v0.4.4
    INFO[0012] pulling image rancher/system-upgrade-controller:v0.8.0
    ...
    ...
    INFO[0191] compressing export at /var/folders/zk/mmckrd310cbd5cwhrxk3_3gr0000gn/T/2146276164/export
    INFO[0198] Creating iso from content
    INFO[0198] converting tar file to iso ./content-6dc7b034/spectro-content-6dc7b034.tar
    INFO[0198] Creating iso from content
    INFO[0198] Creating hybrid image...
    INFO[0214] ISO file created successfull
    ```

The result is a content bundle that you can use to customize your installation environment.  
If you are not customizing your Edge Installer you can transfer the ISO file to a USB drive.

# Validation

You can validate that the ISO image is not corrupted by attempting to flash a bootable device. Most software that creates a bootable device will validate the ISO image before the flash process. 

# Next Steps

Your next step is to [Create an Installer Image](//clusters/edge/site-deployment/installer) step. The Edge Installer image is what you will load into the Edge host before shipping it out to the destination site.