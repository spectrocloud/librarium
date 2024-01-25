---
sidebar_label: "Build Content Bundle"
title: "Build Content Bundle"
description: "Learn about building your edge content bundles in order to optimize cluster deployments"
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

Content bundles are archives of all the required container images required for a cluster profiles. The content bundle
includes Helm charts, Packs, and manifest files needed to deploy your Edge host cluster. In addition to core container
images, the content bundle can include artifacts from your applications that you wish to deploy to the Edge cluster.
[Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) are the primary source for building these
content bundles.

:::warning

Currently, the content bundles include Helm charts and Packs. However, keep in mind that the container images of the
Helm Charts and Packs are extracted and predeployed into the container runtime [containerd](https://containerd.io/) for
optimization. In the future, Palette will include a built-in OCI registry to host Helm Charts and other artifacts to
avoid downloading these from the internet if included in a content bundle

:::

## Benefits of Content Bundle

Creating a content bundle provides several benefits that may address common use cases related to deploying Edge hosts.

- Preloading required software dependencies removes the need to download assets during cluster deployment.

- If connectivity to a container registry is unstable or bandwidth limited, preloading the software dependencies can
  address these concerns.

- Preloading required software dependencies optimizes the Edge host deployment process when the Edge host is in an
  internet bandwidth-constrained environment.

- Organizations that want better control over the software used by their Edge hosts can use content bundles to ensure
  that only approved software is consumed.

## Prerequisites

- Linux Machine (Physical or VM) with an AMD64 architecture.

- Palette API key. Refer to the [User Authentication](../../../user-management/authentication/api-key/create-api-key.md)
  resource to learn how to create a Palette API key.

- An Edge Native cluster profile. Refer to [Create Edge Native Cluster Profile](../site-deployment/model-profile.md)
  guide to learn how to create an Edge Native cluster profile. You may also have other add-on profiles that you wish to
  attach to your cluster.

- Content tags in your profiles highlight the exact location of container images to be downloaded.

## Create Content Bundle

1. Download Palette Edge Content CLI and assign the executable bit to the CLI. <br />

   ```shell
   VERSION=4.1.2
   wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
   chmod +x palette-edge
   ```

2. Log in to [Palette](https://console.spectrocloud.com).

3. Select the project you want to deploy the Edge host to and copy down the **Project ID**. You can find the project id
   at the top right side corner of the landing page below the **User drop-down Menu**.

4. Navigate to the left **Main Menu** and select **Profiles**.

5. Use the **Cloud Types drop-down Menu** and select **Edge Native**.

6. Click on the cluster profile you want to include in the content bundle.

7. You can find the cluster profile ID by reviewing the URL of the current page. The cluster profile ID is the last
   value in the URL. Repeat this step for all the cluster profiles you want to specify in the content bundle.

   <br />

   ```text
   https://console.spectrocloud.com/projects/yourProjectId/profiles/cluster/<YourClusterProfileHere>
   ```

8. Navigate back to your terminal window and issue the following command to create the content bundle. Replace the
   placeholder values with your actual values.

   <br />

   :::info

   There are several Spectro Cloud CLI flags that you can use to customize the content bundle. Use the command
   `./palette-edge build --help` to learn more about the available flags.

   :::

   <br />

   ```shell
   ./palette-edge build --api-key <API_KEY> \
    --project-id <PROJECT_ID> \
    --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
    --palette-endpoint <Palette API Endpoint> \
    --outfile <bundle-name>.tar \
    --iso
   ```

   ```hideClipboard shell
   # Output
   INFO[0000] getting hubble export for build
   INFO[0000] Fetching latest version for service 'stylus'
   INFO[0000] stylus version: 3.4.3
   INFO[0000] Fetching manifest for service stylus and version 3.4.3 for action resources
   INFO[0000] Fetching manifest of service stylus and version '3.4.3' for action resources
   INFO[0000] Fetching manifest from service stylus and version '3.4.3' for action resources with file name images.yaml
   INFO[0000] Get manifest with file name: images.yaml
   INFO[0000] Get manifest with file content: image: gcr.io/spectro-images-public/stylus:v3.4.3
   INFO[0002] successfully pulled image : gcr.io/spectro-images-public/calico/cni:v3.25.0
   ...
   ...
   INFO[0143] Total translation table size: 0
   INFO[0143] Total rockridge attributes bytes: 272
   INFO[0143] Total directory bytes: 0
   INFO[0143] Path table size(bytes): 10
   INFO[0143] Max brk space used 0
   INFO[0143] 872027 extents written (1703 MB)
   INFO[0144] ISO file created successfully
   ```

The result is a content bundle that you can use to preload into your installer. Alternatively, you can use the ISO
version of the content bundle and transfer it to a USB drive to be used separately at the time of Edge host
installation.

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.

## Next Steps

Your next step is to build the Edge artifacts so that you can deploy an Edge host. To create an Edge artifacts, check
out the [Build Images](../edgeforge-workflow/palette-canvos.md) guide.
