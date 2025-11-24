---
sidebar_label: "Upgrade Cluster Groups"
title: "Upgrade Cluster Groups"
description: "Learn how to upgrade a Palette Cluster Group."
hide_table_of_contents: false
sidebar_position: 30
tags: ["clusters", "cluster groups"]
---

Palette provides the ability to upgrade the [vCluster version](https://www.vcluster.com/releases/en/changelog) of your
virtual clusters, allowing you to leverage newly introduced features without having to create new cluster groups or
migrate workloads. This guide covers how to upgrade your cluster groups, which may be running an outdated version if a
new Palette release introduces a new vCluster version.

## Prerequisites

- One or more cluster groups created before a Palette upgrade that updates the
  [vCluster version](https://www.vcluster.com/releases/en/changelog).

## Upgrade Cluster Group

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Cluster Groups**.

3. Select one of the legacy cluster groups. The cluster group overview page displays a banner if a cluster upgrade is
   available for your cluster group.

   :::info

   You will not be able to create new virtual clusters on cluster groups that are pending upgrades.

   :::

   ![Cluster group pending update banner](/clusters_cluster-group_vcluster-upgrades_upgrade-banner.webp)

4. Select the **Update now** button to begin the upgrade process. The **Cluster Group Settings** pane appears. Select
   the newest version from the **Virtual cluster version** dropdown. The **Review changes** editor appears.

   ![Cluster group dropdown list of vCluster versions](/clusters_cluster-group_vcluster-upgrades_cluster-group-settings-version-dropdown.webp)

5. The differential editor displays the changes between the **Current Configuration** and **New Configuration**. The
   left side of the editor displays the current configuration. The right side displays the new vCluster version's
   incoming changes. Review the changes and apply them as needed.

   :::tip

   Ensure that you retain any custom configurations that you have provided in your current configuration.

   :::

   ![Cluster group vCluster upgrade differential editor](/clusters_cluster-group_vcluster-upgrades_diff-editor-cluster-upgrade.webp)

6. Select **Apply changes** once you have finished the review process. The editor closes. Select **Save changes** on the
   **Cluster Group Settings** pane to start the cluster group upgrade. A warning popup appears cautioning you that API
   access to your cluster group will be suspended during the upgrade. Select **OK** to begin the process.

   ![Cluster group vCluster caution popup](/clusters_cluster-group_vcluster-upgrades_caution-popup.webp)

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Cluster Groups**.

3. Select one of the cluster groups that you have upgraded. The cluster group overview page appears.

4. Select **Settings**. The **Cluster Group Settings** pane appears.

5. Select the **Settings** tab. The **Advanced Config** section containing the YAML virtual cluster configuration
   appears. Check the vCluster version set in the `sync.statefulSet.image.tag` field.

   ```yaml hideClipboard {12} title="Example configuration"
   statefulSet:
     # Image is the image for the controlPlane statefulSet container
     image:
       # Configure the registry of the container image, e.g. my-registry.com or ghcr.io
       # It defaults to ghcr.io and can be overriding either by using this field or controlPlane.advanced.defaultImageRegistry
       registry: "us-docker.pkg.dev"
       # Configure the repository of the container image, e.g. my-repo/my-image.
       # It defaults to the vCluster pro repository that includes the optional pro modules that are turned off by default.
       # If you still want to use the pure OSS build, use 'loft-sh/vcluster-oss' instead.
       repository: "palette-images/third-party/vcluster-oss"
       # Tag is the tag of the container image, e.g. latest
       tag: "0.27.1"
   ```
