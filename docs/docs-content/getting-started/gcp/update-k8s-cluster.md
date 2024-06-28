---
sidebar_label: "Deploy Cluster Profile Updates"
title: "Deploy Cluster Profile Updates"
description: "Learn how to update your deployed clusters using Palette Cluster Profiles."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["getting-started", "gcp"]
---

Palette provides cluster profiles, which allow you to specify layers for your workloads using packs, Helm charts, Zarf
packages, or cluster manifests. Packs serve as blueprints to the provisioning and deployment process, as they contain
the versions of the container images that Palette will install for you. Cluster profiles provide consistency across
environments during the cluster creation process, as well as when maintaining your clusters. Check out the
[cluster profiles](../cluster-profiles.md) page to learn more. Once provisioned, there are three main ways to update
your Palette deployments.

| Method                   | Description                                                                        | Cluster application process                                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster profile versions | Create a new version of the cluster profile with your updates.                     | Select the new version of the cluster profile. Apply this new profile version to the clusters you want to update.                                                                                          |
| Cluster profile updates  | Change the cluster profile in place.                                               | Palette detects the difference between the provisioned resources and this profile. A pending update is available to clusters using this profile. Apply pending updates to the clusters you want to update. |
| Cluster overrides        | Change the configuration of a single deployed cluster outside its cluster profile. | Save and apply the changes you've made to your cluster.                                                                                                                                                    |

This tutorial will teach you how to update a cluster deployed with Palette to Google Cloud Platform (GCP). You will
explore each cluster update method and learn how to apply these changes using Palette.

## Prerequisites

To complete this tutorial, follow the steps described in the [Set up Palette with GCP](./setup.md) guide to authenticate
Palette for use with your AWS cloud account.

Follow the instructions of the [Deploy a Cluster](./deploy-k8s-cluster.md) tutorial to deploy a cluster with the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application. Your cluster should be successfully
provisioned and in a healthy state.

The cluster profile name is `gcp-profile` and the cluster name is `gcp-cluster`.

![Cluster details page with service URL highlighted](/getting-started/gcp/getting-started_deploy-k8s-cluster_service_url.webp)

## Tag and Filter Clusters

Palette provides the ability to add tags to your cluster profiles and clusters. This helps you organize and categorize
your clusters based on your custom criteria. You can add tags during the creation process or by editing the resource
after it has been created.

Adding tags to your clusters helps you find and identify your clusters, without having to rely on cluster naming. This
is especially important when operating with many clusters or multiple cloud deployments.

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Find the `gcp-cluster` you
deployed with the _hello-universe_ application. Click on it to view its **Overview** tab.

Click on the **Settings** drop-down Menu in the upper right corner and select **Cluster Settings**.

Fill **service:hello-universe-frontend** in the **Tags (Optional)** input box. Click on **Save Changes**. Close the
panel.

![Image that shows how to add a cluster tag](/getting-started/gcp/getting-started_update-k8s-cluster_add-service-tag.webp)

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Click on **Add Filter**, then
select the **Add custom filter** option.

Use the drop-down boxes to fill in the values of the filter. Select **Tags** in the left-hand **drop-down Menu**. Select
**is** in the middle **drop-down Menu**. Fill in **service:hello-universe-frontend** in the right-hand input box.

Click on **Apply Filter**.

![Image that shows how to add a frontend service filter](/getting-started/gcp/getting-started_update-k8s-cluster_apply-frontend-filter.webp)

Once you apply the filter, only the `gcp-cluster` with this tag is displayed.

## Version Cluster Profiles

Palette supports the creation of multiple cluster profile versions using the same profile name. This provides you with
better change visibility and control over the layers in your host clusters. Profile versions are commonly used for
adding or removing layers and pack configuration updates.

The version number of a given profile must be unique and use the semantic versioning format `major.minor.patch`. If you
do not specify a version for your cluster profile, it defaults to **1.0.0**.

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile
corresponding to your _hello-universe-frontend_ cluster. It should be named `gcp-profile`. Select it to view its
details.

![Image that shows the frontend cluster profile with cluster linked to it](/getting-started/gcp/getting-started_update-k8s-cluster_profile-with-cluster.webp)

The current version is displayed in the **drop-down Menu** next to the profile name. This profile has the default value
of **1.0.0**, as you did not specify another value when you created it. The cluster profile also shows the host clusters
that are currently deployed with this cluster profile version.

Click on the version **drop-down Menu**. Select the **Create new version** option.

A dialog box appears. Fill in the **Version** input with **1.1.0**. Click on **Confirm**.

Palette creates a new cluster profile version and opens it. The version dropdown displays the newly created **1.1.0**
profile. This profile version is not deployed to any host clusters.

![Image that shows cluster profile version 1.1.0](/getting-started/gcp/getting-started_update-k8s-cluster_new-version-overview.webp)

The version **1.1.0** has the same layers as the version **1.0.0** it was created from. Click on the **hello-universe**
pack layer. The pack manifest appears.

Click on **Presets** on the right-hand side. This pack has two configured presets:

1. **Disable Hello Universe API** configures the [_hello-universe_](https://github.com/spectrocloud/hello-universe)
   application as a standalone frontend application. This is the default preset selection.
2. **Enable Hello Universe API** configures the [_hello-universe_](https://github.com/spectrocloud/hello-universe)
   application as a three-tier application with a frontend, API server, and Postgres database.

Select the **Enable Hello Universe API** preset. The pack manifest changes according to this preset.

The pack manifest has requires two values to be replaced for the authorization token and for the database password.
Replace these values with your own base64 encoded values. The
[_hello-universe_](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#single-load-balancer) repository
provides a token that you can use.

Click on **Confirm Updates**. The manifest editor closes.

Click on **Save Changes** to finish the configuration of this cluster profile version.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the
**service:hello-universe-frontend** tag. Select it to view its **Overview** tab.

Select the **Profile** tab of this cluster. You can select a new version of your cluster profile by using the version
dropdown.

Select the **1.1.0** version.

![Image that shows how to select a new profile version for the cluster](/getting-started/gcp/getting-started_update-k8s-cluster_profile-version-selection.webp)

Click on **Review & Save** to confirm your profile version selection.

The **Changes Summary** dialog appears to show your cluster changes. Click on **Review changes in Editor**. The pack
manifest changes appear in the editor. Click on **Apply Changes** to deploy the new profile version.

![Image that shows the profile 1.1.0 differences](/getting-started/getting-started_update-k8s-cluster_profile-version-changes.webp)

:::warning

Palette has backup and restore capabilities available for your mission critical workloads. Ensure that you have adequate
backups before you make any cluster profile version changes in your production environments. You can learn more in the
[Backup and Restore](../../clusters/cluster-management/backup-restore/backup-restore.md) section.

:::

Palette now makes the required changes to your cluster according to the specifications of the configured cluster profile
version. Once your changes have completed, Palette marks your layers with the green status indicator. The Hello Universe
three-tier application will be successfully deployed.

![Image that shows completed cluster profile updates](/getting-started/gcp/getting-started_update-k8s-cluster_completed-cluster-updates.webp)

Click on the URL for port **:8080** on the **ui** service to access the Hello Universe application. The landing page of
the application indicates that it is connected to the API server.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/getting-started/getting-started_deploy-k8s-cluster_hello-universe-with-api.webp)

## Roll Back Cluster Profiles

One of the key advantages of using cluster profile versions is that they make it possible to maintain a copy of
previously known working states. The ability to roll back to a previously working cluster profile in one action shortens
the time to recovery in the event of an incident.

The process to roll back to a previous version is identical to the process for applying a new version.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the
**service:hello-universe-frontend** tag. Select it to view its **Overview** tab.

Select the **Profile** tab. This cluster is currently deployed using cluster profile version **1.1.0**. Select the
option **1.0.0** in the version dropdown. This process is the reverse of what you have done in the previous section,
[Version Cluster Profiles](#version-cluster-profiles).

Click on **Review & Save** to confirm your changes. The **Changes Summary** dialog appears again.

Click on **Review changes in Editor**. The editor shows that the incoming version no longer contains the three-tier
application configuration.

Click on **Apply Changes**. Select the **Overview** tab.

Palette now makes the changes required for the cluster to return to the state specified in version **1.0.0** of your
cluster profile. Once your changes have completed, Palette marks your layers with the green status indicator.

Click on the URL for port **:8080** on **hello-universe-service** to access the Hello Universe application. The landing
page indicates that the application is deployed as a standalone frontend.

## Pending Updates

Cluster profiles can also be updated in place, without the need to create a new cluster profile version. Palette
monitors the state of your clusters and notifies you when updates are available for your host clusters. You may then
choose to apply your changes at a convenient time.

The previous state of the cluster profile will not be saved once it is overwritten.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag
**service:hello-universe-frontend**. Select it to view its **Overview** tab.

Select the **Profiles** tab. Then, select the **hello-universe** pack. Change the `replicas` field to `2` on line `14`.
Click on **Save**. The editor closes.

This cluster now contains an override over its cluster profile. Palette uses the configuration you have just provided
for the single cluster over its cluster profile and begins making the appropriate changes.

Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

Two replicas of the **hello-universe-deployment** are available, instead of the one specified by your cluster profile.
Your override has been successfully applied.

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile
corresponding to your _hello-universe-frontend_ cluster, named `gcp-profile`.

Click on it to view its details. Select **1.0.0** in the version dropdown.

Select the **hello-universe** pack. The editor appears. Change the `replicas` field to `3` on line `14`. Click on
**Confirm Updates**. The editor closes.

Click on **Save Changes** to confirm the changes you have made to your profile.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of
your clusters match this filter. Palette indicates that the cluster associated with the cluster profile you updated has
updates available.

![Image that shows the pending updates ](/getting-started/gcp/getting-started_update-k8s-cluster_pending-update-clusters-view.webp)

Select this cluster to open its **Overview** tab. Click on **Updates** to begin the cluster update.

![Image that shows the Updates button](/getting-started/gcp/getting-started_update-k8s-cluster_updates-available-button-cluster-overview.webp)

A dialog appears which shows the changes made in this update. Review the changes and ensure the only change is the
`replicas` field value. The pending update removes your cluster override and sets the `replicas` field to `3`. At this
point, you can choose to apply the pending changes or keep it by modifying the right-hand side of the dialog.

![Image that shows the available updates dialog ](/getting-started/gcp/getting-started_update-k8s-cluster_available-updates-dialog.webp)

Click on **Confirm updates** once you have finished reviewing your changes.

Palette updates your cluster according to cluster profile specifications. Once these changes are complete, select the
**Workloads** tab. Then, select the **hello-universe** namespace.

Three replicas of the **hello-universe-deployment** are available. The cluster profile update is now reflected by your
cluster.

## Cleanup

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left **Main Menu** and click on **Clusters**. Select the cluster you want to
delete to access its details page.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

![Delete cluster](/getting-started/gcp/getting-started_deploy-k8s-cluster_delete-cluster-button.webp)

You will be prompted to type in the cluster name to confirm the delete action. Type in the cluster name to proceed with
the delete step. The deletion process takes several minutes to complete.

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for a force delete. To trigger a force
delete, navigate to the cluster’s details page, click on **Settings**, then select **Force Delete Cluster**. Palette
automatically removes clusters stuck in the cluster deletion phase for over 24 hours.

:::

Once the cluster is deleted, navigate to the left **Main Menu** and click on **Profiles**. Find the cluster profile you
created and click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the
selection to remove the cluster profile.

## Wrap-Up

In this tutorial, you created deployed cluster profile updates. After the cluster was deployed to AWS, you updated the
cluster profile through three different methods: create a new cluster profile version, update a cluster profile in
place, and cluster profile overrides. After you made your changes, the Hello Universe application functioned as a
three-tier application with a REST API backend server.

Cluster profiles provide consistency during the cluster creation process, as well as when maintaining your clusters.
They can be versioned to keep a record of previously working cluster states, giving you visibility when updating or
rolling back workloads across your environments.

We recommend that you continue to the [Deploy a Cluster with Terraform](./deploy-k8s-cluster-tf.md) page to learn about
how you can use Palette with Terraform.
