---
sidebar_label: "Map and Filter Clusters"
title: "Map and Filter Clusters"
description: "Learn how to view your cluster locations and filter your clusters."
hide_table_of_contents: false
sidebar_position: 180
tags: ["clusters", "cluster management"]
---

The Palette Dashboard provides users with the ability to map and filter Kubernetes clusters. You can find these
capabilities on the **Clusters** page. Mapping and filtering is available for clusters deployed to public clouds, data
centers, and Edge hosts.

## Cluster List View

Palette provides the **Cluster List View** as an efficient way to view and search your clusters. The cluster list
contains all Palette clusters deployed in the selected Palette scope. The list view also provides filters that allow you
to narrow down clusters that may be dispersed geographically, across multiple regions, or different cloud providers. You
can also search your clusters by name.

### Prerequisites

- A [Palette](https://console.spectrocloud.com) account with the permissions to view and list clusters. Refer to the
  [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md) guide for more
  information.
- One or more active Kubernetes clusters in Palette.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select **Clusters** from the left **Main Menu**. All the clusters deployed in your selected Palette scope appear in
   the clusters list. The list filters appear at the top of the map. You can filter your clusters by the following
   characteristics.

   | **Filter**      | **Description**                                                   | **Values**                                                                               |
   | --------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
   | **Name**        | Filter and display the cluster matching the specified name.       | Custom string                                                                            |
   | **Environment** | Filter and display clusters based on the cluster type.            | Configured cluster types                                                                 |
   | **Status**      | Filter and display clusters based on their current status.        | **Pending**, **Provisioning**, **Running**, **Deleting**, **Deleted**, **Importing**, and **Unknown** |
   | **Tags**        | Filter and display clusters based on the configured cluster tags. | Configured cluster tags                                                                  |

   ![Cluster list view](/clusters_cluster-management_cluster-map-filters_cluster-list-view.webp)

3. Click on the **Environment** drop-down Menu and select a cluster type. The cluster list displays matching clusters.

4. Click on the **Status** drop-down Menu and select the **Running** status. The cluster list displays clusters matching
   the selected cluster type and status. You can combine as many filters as you require. Only clusters that satisfy all
   filter requirements are displayed.

5. Click on **Clear All**. The filters are removed and the cluster list displays all clusters in your selected scope.

6. Enter and select cluster tags in the **Tags** field. The cluster list displays all clusters deployed with the
   specified cluster tags.

7. Click on **Clear All**. The filters are removed and the cluster list displays all clusters in your selected scope.

8. Enter a cluster name in the **Search** field. The cluster list displays the cluster matching the specified name.
   Select the row of the matching cluster. The cluster details appear in the **Overview** tab of the selected cluster.

9. Select **Clusters** from the left **Main Menu**. All the clusters deployed in your selected scope appear in the
   clusters list. Click on the **Filter** button. The **All Filters** pane appears.

   ![Cluster All Filters pane](/clusters_cluster-management_cluster-map-filters_cluster-all-filters.webp)

   The **All Filters** pane provides additional filter capabilities. You can filter your clusters by the following
   characteristics.

   | **Filter**          | **Description**                                                                                                                                                                                         | **Values**                                                                               |
   | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
   | **Updates Pending** | Filter and display clusters that have pending updates. Refer to the [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) for further guidance. |                                                                                          |
   | **Imported**        | Filter and display clusters that have been imported to Palette. Refer to the [Imported Clusters](../imported-clusters/imported-clusters.md) section for further guidance.                               |                                                                                          |
   | **Environment**     | Filter and display deployed clusters based on the cluster type.                                                                                                                                         | Configured cluster types                                                                 |
   | **Status**          | Filter and display clusters based on their current status.                                                                                                                                              | **Pending**, **Provisioning**, **Running**, **Deleting**, **Deleted**, **Importing**, and **Unknown** |
   | **Profiles**        | Filter and display clusters based on the name of the configured cluster profile.                                                                                                                        | Custom string                                                                            |
   | **Tags**            | Filter and display clusters with the specified tag. Tags can be specified during cluster deployment or from the **Cluster Settings** tab.                                                               | Custom string                                                                            |
   | **Health Status**   | Filter and display clusters based on their current health status.                                                                                                                                       | **Healthy** and **UnHealthy**                                                            |
   | **Cloud Account**   | Filter and display clusters based on the cloud account they are deployed to.                                                                                                                            | Configured cloud accounts                                                                |
   | **Repave Status**   | Filter and display clusters based on their repave status. Refer to the [Repave Behavior and Configuration](./node-pool.md#repave-behavior-and-configuration) section for further guidance.              | **Pending**                                                                              |
   | **Import Mode**     | Filter and display clusters based on the mode used to import them to Palette. Refer to the [Imported Clusters](../imported-clusters/imported-clusters.md) section for further guidance.                 | **read-only** and **full**                                                               |
   | **Architecture**    | Filter and display clusters based on the host architecture.                                                                                                                                             | **AMD64** and **ARM64**                                                                  |
   | **Country**         | Filter and display clusters based on the cluster location country.                                                                                                                                      | Any country where a cluster is deployed.                                                 |
   | **Region**          | Filter and display clusters based on the cluster location region                                                                                                                                        | Any region where a cluster is deployed                                                   |
   | **Projects**        | Filter and display clusters based on the project they are deployed to. This filter is only available in tenant scope.                                                                                   | Any project belonging to this tenant                                                     |

   Just as with the list view filters, you can combine as many filters as you require and only clusters that satisfy all
   filter requirements are displayed.

## Clusters Map View

Palette provides a **Clusters Map View** as an alternative way to visualize and search your clusters. The map is
constructed based on the configured cluster location and region. The map view provides filters that allow you to filter
and search through your deployed clusters. You can also search your clusters by name.

### Prerequisites

- A [Palette](https://console.spectrocloud.com) account with the permissions to view and list clusters. Refer to the
  [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md) guide for more
  information.
- One or more active Kubernetes clusters in Palette.

### Enablement

1. Login to [Palette](https://console.spectrocloud.com).

2. Select **Clusters** from the left **Main Menu**. Clusters deployed to data centers or edge hosts need to have their
   locations set manually. Expand the following section to learn how to configure cluster locations. You can skip this
   step for clusters deployed to public clouds.

   <details>

   <summary>Configure Cluster Location</summary>

   1. Select the cluster to you want to update.

   2. Click on **Settings**. Then, select **Cluster Settings**. The **Settings** pane appears.

   3. Select the **Location** option. Search for the cluster location and click on **Save Changes**.

   4. Repeat these steps for all the clusters that are missing a location.

   </details>

3. Click on **Clusters Map View** from the right-hand side. The clusters map appears and displays a location pin for
   each cluster. The map filters appear at the top of the map. You can filter your clusters by the following
   characteristics.

   | **Filter**      | **Description**                                                   | **Values**                                                                               |
   | --------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
   | **Name**        | Filter and display the cluster matching the specified name.       | Custom string                                                                            |
   | **Environment** | Filter and display clusters based on the cluster type.            | Configured cluster types                                                                 |
   | **Status**      | Filter and display clusters based on their current status.        | **Pending**, **Provisioning**, **Running**, **Deleting**, **Deleted**, **Importing**, and **Unknown** |
   | **Tags**        | Filter and display clusters based on the configured cluster tags. | Configured cluster tags                                                                  |

   ![Cluster map view](/clusters_cluster-management_cluster-map-filters_cluster-map-view.webp)

4. Click on the **Environment** drop-down Menu and select a cluster type. The map displays matching clusters.

5. Click on the **Status** drop-down Menu and select **Running** status. The map displays clusters matching the selected
   cluster type and status. You can combine as many filters as you require. Only clusters that satisfy all filter
   requirements are displayed.

6. Click on **Clear All**. The filters are removed and the map displays all clusters.

7. Enter and select cluster tags in the **Tags** field. The map displays all clusters deployed with the specified
   cluster tags.

8. Click on **Clear All**. The filters are removed and the map displays all clusters.

9. Enter a cluster name in the **Search** field. The map displays the cluster matching the specified name. Click on the
   map location pin of the matching cluster. The cluster details card appears. Click on **View Details**. The cluster
   details appear in the **Overview** tab of the selected cluster.

   ![Cluster details](/clusters_cluster-management_cluster-map-filters_cluster-details.webp)
