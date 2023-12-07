---
sidebar_label: "Create and Manage Nutanix Cluster"
title: "Create and Manage Nutanix Cluster"
description: "Learn how to create and manage Nutanix clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---

Palette supports creating and managing Kubernetes clusters deployed to a Nutanix infrastructure. This section guides you in creating a Kubernetes cluster in a custom Nutanix cloud managed by Palette.

## Prerequisites

- A Nutanix cloud and cloud account.

- A Private Cloud Gateway (PCG) deployed.

- Nutanix version <<< PLACEHOLDER >>

- A cluster profile created for the Nutanix cloud. To learn how to create a profile, refer to  [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/).

- A Cluster API (CAPI) image created for the Nutanix cloud platform. For guidance, refer to [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).


## Deploy a Nutanix Cluster

Use the following steps to deploy a new Nutanix cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** select **Clusters**.

3. Click on **Add New Cluster** and select **Deploy New Cluster** on the next page Palette displays. 

4. Select **Nutanix** and click the **Start Nutanix Configuration** button.

5. Fill out the following basic information, and click **Next** to continue.

  <<< TABLE PLACEHOLDER >>>

6. Select the Nutanix cluster profile you created and click **Next**. Palette displays the cluster profile layers.

7. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.

8. Click **Next** to continue. Palette displays the Cluster configuration YAML file.

9. Review the YAML file that displays and make any adjustments to configure your cluster. Click **Next** when you are done.

10. Configure the master and worker pools using the YAML files that Palette displays.

11. Click **Next** to continue.

12. Review the options for OS Patchine Schedule, scanning, backups, and RBAC. 

13. Click **Validate** and review the cluster configuration and setting settings summary.

14. Click **Finish Configuration** to deploy the cluster. The cluster details page contains the status and details of the deployment. Use this page to track the deployment progress. Provisioning clusters can take several minutes to complete.


## Validate

1.  Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the **left Main Menu** and select **Clusters**. The Clusters page displays a list of all available clusters that Palette manages.

3. Click on the cluster you created to view its details page.

4. Ensure the **Cluster Status** field displays **Running**.


