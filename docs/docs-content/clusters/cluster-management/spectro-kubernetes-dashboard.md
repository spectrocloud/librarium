---
sidebar_label: Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description: "How to Setup the Spectro Kubernetes Dashboard with Spectro Proxy"
hiddenFromNav: false
sidebar_position: 210
tags: ["clusters", "cluster management", "dashboard"]
---

The **Spectro Kubernetes Dashboard** is a customized version of the open source
[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) project. Kubernetes Dashboard is a general purpose,
web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications, as well as manage the
cluster itself.

## Prerequisites

- An active Palette cluster. This tutorial builds upon steps in. Complete the steps for your preferred cloud provider if
  you need to build a cluster.
  - [Deploy a Cluster with Azure](/getting-started/azure/deploy-k8s-cluster.md)
  - [Deploy a Cluster with AWS](/getting-started/aws/deploy-k8s-cluster.md)
  - [Deploy a Cluster with GCP](/getting-started/gcp/deploy-k8s-cluster.md)
  - [Deploy a Cluster with VMware](/getting-started/vmware/deploy-k8s-cluster.md)

## Enablement

1. In Palette, select **Clusters** from the left Main Menu. Select the name of the cluster you want to provision the
   _Spectro Kubernetes Dashboard_ on.

2. Select the **Profiles** tab and identify the name of the profile your cluster is using.

![Image of the Palette UI, cluster overview screen with the profile name called out](/clusters_cluster-management_spectro-kubernetes-dashboard_cluster-profile.webp)

3. Select **Profiles** from the left Main Menu. Select the profile your desired cluster is using.

4. Select **Create new version** from the drop down menu.

5. Enter the version number you wish to use for the updated profile and select **Confirm**.

6. Select **Add New Pack**

7. Search for _Spectro Kubernetes Dashboard_ in the Search field.

![Image of the pack search screen with the search result shown](/clusters_cluster-management_spectro-kubernetes-dashboard_select-dashboard-pack.webp)

7. The _Spectro Kubernetes Dashboard_ pack exists in multiple registries. We recommend selecting the most recent pack
   version available in the _Palette Registry_ if allowed by your organizations security policies. Select your desired
   pack version, then select **Confirm**

![Image of the pack showing multiple registries](/clusters_cluster-management_spectro-kubernetes-dashboard_pack-registry-select.webp)

:::info

Upgrading the Kubernetes Dashboard from older versions is not supported. We recommend removing any older version of
Kubernetes dashboard version prior to upgrading to the newest version. The Kubernetes dashboard reads metrics from a
data store in the Kubernetes cluster and does not store this data locally. No loss of data will occur during the upgrade
process.

:::

8. No customizations are required for this deployment. Select **Confirm & Create** on the pack customization screen.

9. Select the Kubernetes layer in your profile.

![Image highlighting the Kubernetes layer](/clusters_cluster-management_spectro-kubernetes-dashboard_kube-layer.webp)

10. Ensure the **OIDC Identity Provider** is set to the values your organization requires. Select **Confirm Updates** if
    any changes were made, otherwise select **Close**.

:::info

This guide is using a cluster configured for Palette OIDC for use with this guide only. Ensure your OIDC settings
reflect the configurations required in your environment.

:::

![Image showing the Palette OIDC provider selected for use with the cluster](/clusters_cluster-management_spectro-kubernetes-dashboard_kube-layer.webp)

11. The profile overview screen will reflect the **spectro-k8s-dashboard** pack is now part of your cluster profile.
    Select **Save Changes**.

![Image showing the final graphical state of the profile in the Palette UI](/clusters_cluster-management_spectro-kubernetes-dashboard_final-profile.webp)

12. Select **Clusters** from the left Main Menu. Then select the cluster you wish to update.

13. Select the **Profile** tab.

14. Select the **Project** drop down menu from either the **Infrastructure Layers** or the **ADDON Layers** section.
    Select the new profile version that contains the _Spectro Kubernetes Dashboard_ pack.

![Image showing the selection of the profile version to be applied to the selected cluster](/clusters_cluster-management_spectro-kubernetes-dashboard_apply-profile.webp)

15. Monitor the cluster status with the **Overview** tab until the _Spectro Kubernetes Dashboard 7.11.1_ indicates
    successful deployment.

16. If you have built your cluster using our tutorials, you will need to update the RBAC rules. Select the **Settings**
    drop down, then select **Cluster Settings**.

![Image showing the location of the settings drop down](/clusters_cluster-management_spectro-kubernetes-dashboard_cluster-settings.webp)

17. Select the **RBAC** option, then select **Add New Binding**.

18. Enter `cluster-admin` in the **Cluster Role name** field. Enter the username associated with your account in the
    **Subject name** field. Select **Confirm**. Select **Save Changes**.

![Image showing a sample RBAC configuration](/clusters_cluster-management_spectro-kubernetes-dashboard_rbac.webp)

Once your configuration changes have been applied successfully, continue to the `Validate` section of this guide.

## Validate

1. In Palette, select **Clusters** form the left Main Menu.

2. Select the cluster where the _Spectro Kubernetes Dashboard_ was deployed.

3. On the **Overview** screen, there will be a new row called **Kubernetes Dashboard** with a button titled **Connect**.
   Select the **Connect** button.

:::tip

Depending ou your screen resolution, you may need to scroll down to expose the **Connect** button.

:::

![Image showing the Kubernetes Dashboard Connect button in the cluster overview screen](/clusters_cluster-management_spectro-kubernetes-dashboard_connect.webp)

4. The Spectro Kubernetes Dashboard will be displayed.

:::info

The Spectro Kubernetes Dashboard displays the `default` namespace by default. If there are no deployments there, you
will see messages stating "There is nothing to display here". Select the namespace dropdown menu to view and select
other namespaces in your cluster.

:::

![Image showing a connected k8s dashboard with teh kubernetes-dashboard namespace selected](/clusters_cluster-management_spectro-kubernetes-dashboard_success.webp)

Congratulations! Your deployment of the _Spectro Kubernetes Dashboard_ has been completed! for more information about
the dashboard, visit the
[Official Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) page.
