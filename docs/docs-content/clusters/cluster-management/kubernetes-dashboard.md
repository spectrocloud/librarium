---
sidebar_label: "Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description: "How to Setup the Spectro Kubernetes Dashboard"
hiddenFromNav: false
sidebar_position: 210
tags: ["clusters", "cluster management", "dashboard"]
---

The **Spectro Kubernetes Dashboard** is a customized version of the open source
[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) project. Kubernetes Dashboard is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications, as well as manage the cluster itself.

For more information about the Kubernetes dashboard, visit the
[Official Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) page.

## Prerequisites

- An active Palette cluster.

## Enablement

1. In Palette, select **Clusters** from the left Main Menu. Select the name of the cluster you want to provision the _Spectro Kubernetes Dashboard_ on.

2. Select the **Profile** tab and identify the name of the profile your cluster is using.

3. Select **Profiles** from the left Main Menu. Select the profile your desired cluster is using.

4. Select **Create new version** from the version drop down menu.

5. Enter the version number you wish to use for the updated profile and select **Confirm**.

6. Select **Add New Pack**

7. Search for _Spectro Kubernetes Dashboard_ in the Search field and select it.

![Image of the pack search screen with the search result shown](/clusters_cluster-management_spectro-kubernetes-dashboard_select-dashboard-pack.webp)

8. Select the most recent version. Select **Confirm**.

:::info

Upgrading the Kubernetes Dashboard from older versions is not supported. We recommend removing any older version of
Kubernetes dashboard version prior to upgrading to the newest version. The Kubernetes dashboard reads metrics from a
data store in the Kubernetes cluster. No loss of data occurs during the upgrade process.

:::

9. No customizations are required for this deployment. Select **Confirm & Create** on the pack customization screen.

10. The profile overview screen reflects that the **Spectro-k8s-Dashboard** pack is now part of your cluster profile. Select **Save Changes**.

11. Select **Clusters** from the left Main Menu. Then select the cluster you wish to update.

12. Select the **Profile** tab.

13. Select the **Project** drop down menu from either the **Infrastructure Layers** or the **ADDON Layers** section. Select the new profile version that contains the _Spectro Kubernetes Dashboard_ pack.

![Image showing the selection of the profile version to be applied to the selected cluster](/clusters_cluster-management_spectro-kubernetes-dashboard_apply-profile.webp)

14. Monitor cluster status with the **Overview** tab until the _Spectro Kubernetes Dashboard 7.11.1_ indicates
    successful deployment.


## Validate

1. In Palette, select **Clusters** form the left Main Menu.

2. Select the cluster where you deployed the _Spectro Kubernetes Dashboard_ pack.

3. On the **Overview** screen, a new row is displayed called **Kubernetes Dashboard** with a button titled **Connect**. Select the **Connect** button.

![Image showing the Kubernetes Dashboard Connect button in the cluster overview screen](/clusters_cluster-management_spectro-kubernetes-dashboard_connect.webp)

:::info

The Spectro Kubernetes Dashboard displays the `default` namespace by default. If there are no deployments in that
namespace, a message stating "There is nothing to display here" is displayed. Select the namespace drop-down Menu to
review and select other namespaces in your cluster.

:::

4. The _Spectro Kubernetes Dashboard_ is displayed.

![Image showing a connected k8s dashboard with the Kubernetes-dashboard namespace selected](/clusters_cluster-management_spectro-kubernetes-dashboard_success.webp)