---
title: "Build Content Bundle"
metaTitle: "Build Content Bundle - Optimize Edge Deployments"
metaDescription: "Learn about building your edge content bundles in order to optimize cluster deployments"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Content bundles are archives of all container images, helm charts, packs, etc that are required to deploy your edge cluster. Besides core container images, these can also include artifacts from your applications that you wish to deploy to the edge clusters. Cluster Profiles are the main source for building these conetnt bundles.

Please note, that currently, although the content bundles contain helm charts and packs, its only the container images that are extracted and pre-deployed into cotnainer runtime (Container-d) for optomization. Furuture releases of the product will include an in-built OCI registry to host charts and other artifacts to avoid these being downloaded from the internet, if part of the content bundle.

# Pre-requisites

- Linux Machine (Physical or VM)
- Palette API key. Refer to the [User Authentication](/user-management/user-authentication/#apikey) resource to learn how to create a Palette API key.
- An Edge Native cluster profile. Refer to [Create Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile) guide to learn how to create an Edge Native cluster profile. You may also have other add-on profiles that you wish to attach to your cluster.
- Content tags in your profiles highlighting the exact location of container images to be downloaded

# Create Content Bundle

1. Download Palette Edge Content CLI

    ```shell
    wget S3 Link to CLI
    chmod +x ....
    ```

2. Assign the executable bit to the CLI.

    ```shell
    chmod +x ./spectro-cli-<YourOS>-<yourArchitecture>
    ```

3. Log in to Palette.

4. Select the project you want to deploy the Edge host to and copy down the **Project ID**.
You can find the project id at the top right side corner of the landing page below the **User drop-down Menu**.

5. Navigate to the left **Main Menu** and select **Profiles**.

6. Use the **Cloud Types drop-down Menu** and select **Edge Native**.

7. Click on the cluster profile you want to include in the content bundle.

8. You can find the cluster profile id by reviewing the URL of the current page. The cluster profile id is the last value in the URL. Repeat this step for all the cluster profiles you want to specify in the content bundle.

    ```
    https://console.spectrocloud.com/projects/yourProjectId/profiles/cluster/<YourClusterProfileHere>
    ```

9. Navigate back to your terminal window and issue the following command to create the content bundle. Replace the placeholder values with your actual values.

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
