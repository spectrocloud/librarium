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

In local clusters, the Palette agent is upgraded automatically only if you update a cluster with a cluster definition
and content bundle built on a Palette instance after a version update. The Palette agent is then updated to match the
version of the Palette instance. This may result in an upgrade if the instance is newer than your Palette agent, or a
downgrade if it is older.

When you want to explicitly trigger the agent version update, you can include the new agent version in a new cluster
profile, and upgrade the cluster using the new profile. This page teaches you how to identify the matching agent version
of a Palette instance, as well as how to specify a Palette agent package in the Operating System (OS) pack of a cluster
profile. This is useful for upgrading the Palette agent on a local Edge cluster and for launching new centrally managed
clusters while using an older version of the Palette agent.

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

### Identify the Latest Palette Agent Version

You can determine whether an Edge host has the latest Palette agent version and, if it does not, identify the latest
version so you can upgrade to it.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**.

3. Click the **Edge Hosts** tab.

4. In the **Stylus Version** column, look for a warning icon, which indicates that the Palette agent on the Edge host is
   not the latest version.

5. Hover over the warning icon and copy the number of the latest Palette agent version. You need this version when you
   upgrade the agent.

### Upgrade Palette Agent Version

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**. Select the profile you want your cluster to upgrade to.

3. Create a new version of the profile. For more information, refer to
   [Update a Cluster](../../cluster-management/cluster-updates.md).

4. In the OS layer of the profile, include the following lines. Replace `versionNumber` with your target agent version
   number you obtained in the first step or any other version number you want to use. Replace `amd64` with `arm64` if
   your hardware uses `arm64` architecture.

   ```yaml {5,10}
   pack:
     content:
       images:
         - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
         - image: "container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>"

   options:
     system.uri: spectrocloud/ubuntu:k3s-1.29.5-v4.5.8-palette-demo

   stylusPackage: container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>
   ```

   :::info

   Following the EdgeForge process, it's likely that your provider image has a `peVersion` parameter. You can use a
   different version value in the `peVersion` parameter from the version you use for `stylusPackage`.

   :::

5. Click **Save Changes** to publish the new version.

<Tabs groupId="deploy">

<TabItem value="Local">

6. Follow [Build Content Bundles](../edgeforge-workflow/palette-canvos/build-content-bundle.md) and
   [Export Cluster Definition](../local-ui/cluster-management/export-cluster-definition.md) to build a content bundle
   using your new cluster profile and export the cluster definition.

   :::warning

   If you are upgrading to an agent version that is 4.6.16 or later, use the Palette CLI. Do not use the Palette Edge
   CLI.

   :::

7. Upload the content bundle to your cluster through Local UI. For more information, refer to
   [Upload Content Bundle](../local-ui/cluster-management/upload-content-bundle.md).

8. Update your cluster using the new cluster definition. For more information, refer to
   [Update Local Cluster](../local-ui/cluster-management/update-cluster.md).

</TabItem>

<TabItem value="Central">

6. Refer to [Update a Cluster](../../cluster-management/cluster-updates.md) to update your cluster with the new profile
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
