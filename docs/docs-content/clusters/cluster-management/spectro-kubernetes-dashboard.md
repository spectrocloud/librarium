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
cluster itself. For more information about the Kubernetes Dashboard, visit the
[Official Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) page.

<!-- prettier-ignore-start -->

The Spectro Kubernetes Dashboard is available as a non-FIPS and FIPS 
<VersionedLink text="pack" url="/integrations/packs/?pack=spectro-k8s-dashboard" /> that can be added to your cluster
profile. The pack reduces the complexity of deploying the standard Kubernetes Dashboard by creating required resources
and roles.

:::tip

If you want to learn how to deploy the standard Kubernetes Dashboard instead, visit the
<VersionedLink text="Kubernetes Dashboard pack page" url="/integrations/packs/?pack=k8s-dashboard"/>.

:::

<!-- prettier-ignore-end -->

## Prerequisites

- An active Palette cluster.
- An OIDC Identity Provider. For more information about using a custom OIDC, visit the page on
  [SAML and OIDC SSO](../../user-management/saml-sso/saml-sso.md#palette-oidc-and-pxk).

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**. Select the cluster you want to provision the Spectro Kubernetes
   Dashboard on.

3. Select the **Profile** tab and select the profile your desired cluster is using. If you are using the FIPS Spectro Kubernetes Dashboard, all profile layers (i.e., OS, Kubernetes, network, and storage) must be FIPS compliant.  

4. From the version drop-down menu, select **Create new version**.

5. Enter the semantic version number you wish to use for the updated profile and select **Confirm**.

6. Select **Add New Pack**.

7. In the search field, search for and select the **Spectro Kubernetes Dashboard** pack. Ensure that you are selecting the FIPS version if the Profile is FIPS-based. 


   ![Image of the pack search screen with the search result shown](/clusters_cluster-management_spectro-kubernetes-dashboard_select-dashboard-pack.webp)

8. Select the most recent version and **Confirm** your changes.

   :::info

   Upgrading the Spectro Kubernetes Dashboard from older versions is not supported. To upgrade versions, you must remove
   the old Spectro Kubernetes Dashboard version from your cluster profile and add the desired version. The Spectro
   Kubernetes Dashboard reads metrics from a data store in the Kubernetes cluster. No data is lost during the upgrade
   process.

   :::

9. Leave the default values for the **Spectro Kubernetes Dashboard** pack and select **Confirm & Create** on the pack
   customization screen.

    :::warning

        For FIPS deployments, be aware of the following configuration options that must be applied:
            - In private cloud, enable proxy mode.
            - In public cloud, enable direct mode.
            - In private clusters of public cloud, enable vpn and proxy mode.
            
        Additionally, if the cluster already has nginx ingress running, disable nginx from Presets.

    :::

10. The profile overview screen reflects that the `spectro-k8s-dashboard` pack is now part of your cluster profile.
    Select **Save Changes**.

11. From the left main menu, select **Clusters**. Select the cluster you wish to update.

12. Select the **Profile** tab.

13. From the applicable **Infrastructure Layers** or **Addon Layers** version drop-down menu, select the profile version
    that contains the **Spectro Kubernetes Dashboard** pack.

14. Click **Save Changes**.

    ![Image showing the selection of the profile version to be applied to the selected cluster](/clusters_cluster-management_spectro-kubernetes-dashboard_apply-profile.webp)

15. Select **Settings** from the top right, and click on **Cluster Settings**.

16. Click on **RBAC**, and on the Cluster tab, click **Add New Binding**.

17. On the **Add Cluster Role Binding**, enter `cluster-admin` for **Cluster Role name**.

18. Leave the **Subject type** set to user, and enter the email address of the user in **Subject Name**.

    ![Image showing how to create a Cluster Role Binding](/clusters_cluster-management_spectro-kubernetes-dashboard_add-role-binding.webp)

19. To add additional users, click **Add Subject** and repeat step 18. Click **Confirm** when you have finished.

20. Close the **Settings** page.

21. Select your Kubernetes layer and set the OIDC to **Palette**.

    ![Image of the Kubernetes OIDC selection page](/clusters_cluster-management_spectro-kubernetes-dashboard_select-kubernetes-pack.webp)

22. Click **Save Changes**

23. Use the **Overview** tab to monitor the cluster's status until the **Spectro Kubernetes Dashboard** layer is
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
