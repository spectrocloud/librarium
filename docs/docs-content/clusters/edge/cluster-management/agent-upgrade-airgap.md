---
sidebar_label: "Configure Palette Agent Version"
title: "Configure Palette Agent Version"
description: "Learn how to upgrade the Palette agent on local clusters. "
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge", "architecture"]
---

In centrally managed clusters, the Palette agent gets upgraded automatically with Palette upgrades, unless you
explicitly [pause upgrades](../../cluster-management/platform-settings/pause-platform-upgrades.md).

In local clusters, this happens automatically only if you upload a content bundle built after a Palette version upgrade, along with a modified cluster definition, and update the cluster through the Local UI.

When you want to explicitly trigger the agent version update, you can include the new agent version in a new cluster profile, and upgrade the cluster using the new profile. This page teaches you how to identify the matching agent version of a Palette instance, as well as how to specify a Palette agent package in the Operating System (OS) pack of a cluster profile. This is useful for upgrading the Palette agent on a local Edge cluster and for launching new centrally managed clusters while using an older version of the
Palette agent.

## Prerequisites

- An active Edge cluster.

- Linux Machine (Physical or VM) with an AMD64 architecture.

- Palette API key. Refer to the [User Authentication](../../../user-management/authentication/api-key/create-api-key.md)
  resource to learn how to create a Palette API key.

- An Edge type cluster profile. Refer to [Create Edge Native Cluster Profile](../site-deployment/model-profile.md) guide
  to learn how to create an Edge Native cluster profile. You may also have other add-on profiles that you wish to attach
  to your cluster.

- The `pack.content.images` parameter in your profiles contains the exact location of container images to be downloaded.

## Procedure

### Identify the Target Agent Version

If you already know the agent version you want to use for your cluster, you can skip this step.

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

5. In the OS layer of the profile, include the following lines. Replace `versionNumber` with your target agent version
   number you obtained in the first step or any other version number you want to use. Replace `amd64` with `arm64` if
   your hardware uses `arm64` architecture.

   ```yaml {5,10}
   pack:
     content:
       images:
         - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
         - image: "container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>"

   options:
     system.uri: ttl.sh/ubuntu:k3s-1.29.5-v4.5.8-palette-demo

   stylusPackage: container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>
   ```

   :::info

   Following the EdgeForge process, it's likely that your provider image has a `peVersion` parameter. You can use a
   different version value in the `peVersion` parameter from the version you use for `stylusPackage`.

   :::

6. Click **Save Changes** to publish the new version.

<Tabs groupId="deploy">

<TabItem value="Local">

7. Follow [Build Content Bundles](../edgeforge-workflow/palette-canvos/build-content-bundle.md) and
   [Export Cluster Definition](../local-ui/cluster-management/export-cluster-definition.md) to build a content bundle
   using your new cluster profile and export the cluster definition.

   :::warning

   If you are upgrading to an agent version that is 4.6.16 or later, use the Palette CLI. Do not use the Palette Edge
   CLI.

   :::

8. Upload the content bundle to your cluster through Local UI. For more information, refer to
   [Upload Content Bundle](../local-ui/cluster-management/upload-content-bundle.md).

9. Update your cluster using the new cluster definition. For more information, refer to
   [Update Local Cluster](../local-ui/cluster-management/update-cluster.md).

</TabItem>

<TabItem value="Central">

7. Refer to [Update a Cluster](../../cluster-management/cluster-updates.md) to update your cluster with the new profile
   version.

</TabItem>

</Tabs>

## Validate

<Tabs groupId="deploy">

<TabItem value="Local">

1. Log in to Local UI. Refer to [Access Local UI Console](../local-ui/host-management/access-console.md) for guidance.

2. In the **Edge Host** page, confirm that the agent version has been updated in the **Overview** table.

</TabItem>

<TabItem value="Central">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. Select your cluster.

4. In the **Cluster Details** page, ensure that the **Agent version** field is the same as you specified.

</TabItem>

</Tabs>
