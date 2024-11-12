---
sidebar_label: "Upgrade Palette Agent on Airgap Clusters"
title: "Upgrade Palette Agent on Airgap Clusters"
description: "Learn how to upgrade the Palette agent on airgap clusters. "
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge", "architecture"]
---

In connected clusters, the Palette agent gets upgraded automatically with Palette upgrades, unless you explicitly
[pause upgrades](../../cluster-management/platform-settings/pause-platform-upgrades.md). In airgap clusters, this does
not happen automatically. When you want to upgrade the agent version, you can include the new agent version in a new
cluster profile, and upgrade the cluster using the new profile.

## Prerequisites

- An active Edge cluster deployed in airgap mode.

- Linux Machine (Physical or VM) with an AMD64 architecture.

- Palette API key. Refer to the [User Authentication](../../../user-management/authentication/api-key/create-api-key.md)
  resource to learn how to create a Palette API key.

- An Edge type cluster profile. Refer to [Create Edge Native Cluster Profile](../site-deployment/model-profile.md) guide
  to learn how to create an Edge Native cluster profile. You may also have other add-on profiles that you wish to attach
  to your cluster.

- Content tags in your profiles highlight the exact location of container images to be downloaded.

## Procedure

### Identify the Target Agent Version

1. The target agent version depends on the Palette instance you use to build content bundles for your Edge cluster. Use
   the following request to identify the target version. If you are using self-hosted Palette or VerteX, replace
   `api.spectrocloud.com` with the fully qualified domain name of your API endpoints. Replace the `apiKey` field with
   your API key.

   ```shell
   curl --location 'https://api.spectrocloud.com/v1/services/stylus/version' \
   --header 'apiKey: ******'
   ```

   You can expect a response similar to the following. In the following response, the target agent version is 4.5.5.

   ```json {9}
   {
     "metadata": {
       "creationTimestamp": "0001-01-01T00:00:00.000Z",
       "deletionTimestamp": "0001-01-01T00:00:00.000Z",
       "lastModifiedTimestamp": "0001-01-01T00:00:00.000Z"
     },
     "spec": {
       "latestVersion": {
         "content": "name: stylus\nversion: 4.5.5\nbuildId: \"20241025\"\nmajorVersion: \"4.5\"\napplyFilepath: /roar/stylus/4.5/4.5.5/apply/manifest.yaml\ndeleteFilepath: \"\"\n",
         "name": "manifest.yaml",
         "path": "nickfury/4.5/4.5.5/apply/services.yaml"
       },
       "name": "stylus"
     }
   }
   ```

### Upgrade Palette Agent Version

2. Log in to [Palette](https://console.spectrocloud.com).

3. From the left **Main Menu**, select **Profiles**. Select the profile you want your cluster to upgrade to.

4. Create a new version of the profile. For more information, refer to
   [Update a Cluster](../../cluster-management/cluster-updates.md).

5. In the OS layer of the profile, include the following line. Replace `versionNumber` with your target agent version
   number you obtained in the first step.

   ```yaml {9}
   pack:
     content:
       images:
         - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"

   options:
     system.uri: ttl.sh/ubuntu:k3s-1.29.5-v4.5.8-palette-demo

   stylusPackage: container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>
   ```

   :::info

   Following the EdgeForge process, it's likely that your provider image has a `peVersion` parameter. You can use a
   different version value in the `peVersion` parameter from the version you use for `stylusPackage`.

   :::

6. Click **Save Changes** to publish the new version.

7. Follow [Build Content Bundles](../edgeforge-workflow/palette-canvos/build-content-bundle.md) and
   [Export Cluster Definition](../local-ui/cluster-management/export-cluster-definition.md) to build a content bundle
   using your new cluster profile and export the cluster definition.

8. Upload the content bundle to your cluster through Local UI. For more information, refer to
   [Upload Content Bundle](../local-ui/cluster-management/upload-content-bundle.md).

9. Update your cluster using the new cluster definition. For more information, refer to
   [Update Local Cluster](../local-ui/cluster-management/update-cluster.md).

## Validate

1. Log in to [Local UI](../local-ui/host-management/access-console.md).

2. In the **Edge Host** page, confirm that the agent version has been updated in the **Overview** table.
