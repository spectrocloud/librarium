---
sidebar_label: "Attach an Add-on Profile"
title: "Attach an Add-on Profile"
description: "Learn how to attach an add-on profile to an imported cluster in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "imported clusters"]
---

Imported clusters lack the ability for Palette to manage the core layers found in a cluster profile, such as the
Operating System, Kubernetes distribution and version, along with the container network interface and storage interface.
You can, however, use add-on cluster profiles to deploy additional software dependencies into your cluster and have
Palette manage these dependencies through the normal cluster profile lifecycle.

In this how-to, you learn how to add an add-on cluster profile to an imported cluster.

## Prerequisites

- An imported cluster with full permissions. Refer to the [Migrate to Full Permissions](migrate-full-permissions.md) to
  learn how to migrate an imported cluster from read-only mode to full-permissions mode.

- An add-on cluster profile. Refer to the
  [Create an Add-on Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)
  to learn how to create an add-on cluster profile.

## Attach an Add-on Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select your imported cluster to access its details page.

4. From the cluster details page, select the **Profile** tab and click on **Attach Profile**.

{" "}

<br />

![The cluster details view when the profile tab is selected](/clusters_imported-clusters_attach-add-on-profile_cluster-details-profile-tab.png)

{" "}

<br />

5. Select an add-on profile and click on **Confirm**.

6. In the following screen, you can update the add-on profile if desired. Click on **Save** to deploy the add-on cluster
   profile.

7. Navigate to the **Overview** tab to monitor the deployment. When the add-on cluster profile is deployed, the
   **Cluster Profile** status displays as a green circle next to the layer.
   <br />

![A cluster profile with an add-on profile deployed successfully](/clusters_imported-clusters_attach-add-on-profile_cluster-details-app-deployed.png)

{" "}

<br />

You now have an add-on cluster profile deployed onto your imported cluster. Use the steps above to add your custom
add-on cluster profile to an imported cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Clusters**.

3. Select your imported cluster to access its details page.

4. Verify the **Cluster Profile** section of the page has a green circle next to each layer. If your application exposes
   a service URL, use the URL to visit the application and verify it's operational.
