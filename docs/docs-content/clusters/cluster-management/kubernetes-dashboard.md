---
sidebar_label: "Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description: "How to Setup the Spectro Kubernetes Dashboard"
hiddenFromNav: false
sidebar_position: 210
tags: ["clusters", "cluster management", "dashboard"]
---

The Spectro Kubernetes Dashboard is a customized version of the open source
[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) project. Kubernetes Dashboard is a general purpose,
web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications, as well as manage the
cluster itself.

For more information about the Kubernetes dashboard, visit the
[Official Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) page.

## Prerequisites

- An active Palette cluster.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).
2. From the left main menu, select **Clusters**. Select the cluster you want to provision the Spectro Kubernetes
   Dashboard on.

3. Select the **Profile** tab and identify the name of the profile your cluster is using.

4. From the left main menu, select **Profiles**. Select the profile your desired cluster is using.

5. From the version drop-down menu, select **Create new version**.

6. Enter the semantic version number you wish to use for the updated profile and select **Confirm**.

7. Select **Add New Pack**.

8. In the search field, search for and select the **Spectro Kubernetes Dashboard** pack.

![Image of the pack search screen with the search result shown](/clusters_cluster-management_spectro-kubernetes-dashboard_select-dashboard-pack.webp)

9. Select the most recent version and **Confirm** your changes.

:::info

Upgrading the Spectro Kubernetes Dashboard from older versions is not supported. To upgrade versions, you must remove
the old Spectro Kubernetes Dashboard version from your cluster profile and add the desired version. The Spectro
Kubernetes Dashboard reads metrics from a data store in the Kubernetes cluster. No data is lost during the upgrade
process.

:::

10. No customization is required for this deployment. Select **Confirm & Create** on the pack customization screen.

11. The profile overview screen reflects that the `spectro-k8s-dashboard` pack is now part of your cluster profile.
    Select **Save Changes**.

12. From the left main menu, select **Clusters**. Select the cluster you wish to update.

13. Select the **Profile** tab.

14. From the applicable **Infrastructure Layers** or **Addon Layers** version drop-down menu, select the profile version
    that contains the **Spectro Kubernetes Dashboard** pack.

15. **Save** your changes.

![Image showing the selection of the profile version to be applied to the selected cluster](/clusters_cluster-management_spectro-kubernetes-dashboard_apply-profile.webp)

16. Use the **Overview** tab to monitor the cluster's status until the **Spectro Kubernetes Dashboard** layer is
    successfully deployed, indicated by a solid green circle.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Select the cluster where you deployed the Spectro Kubernetes Dashboard pack.

4. On the **Overview** tab, a new **Kubernetes Dashboard** row is displayed. Select the **Connect** button.

![Image showing the Kubernetes Dashboard Connect button in the cluster overview screen](/clusters_cluster-management_spectro-kubernetes-dashboard_connect.webp)

5. The Spectro Kubernetes Dashboard is displayed.

![Image showing a connected k8s dashboard with the Kubernetes-dashboard namespace selected](/clusters_cluster-management_spectro-kubernetes-dashboard_success.webp)

:::info

By default, the Spectro Kubernetes Dashboard displays the `default` namespace. If there are no deployments in that
namespace, the message "There is nothing to display here" is displayed. Select the namespace drop-down menu to review
and select other namespaces in your cluster.

:::
