---
sidebar_label: "Create and Manage Nutanix Cluster"
title: "Create and Manage Nutanix Cluster"
description: "Learn how to create and manage Nutanix clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---

Palette supports creating and managing Kubernetes clusters deployed to a Nutanix infrastructure environment. This section guides you in creating a Kubernetes cluster in a Nutanix cloud managed by Palette.

## Prerequisites

- A Nutanix cloud account added to Palette. Refer to [Add Nutanix Cloud Account](add-nutanix-cloud-account.md).

<!-- A Nutanix Prism Central cloud account. For more information, review [Add Nutanix Cloud Account](add-nutanix-cloud-account.md).  -->

- A Nutanix Private Cloud Gateway (PCG) deployed. For guidance, review [Install Private Cloud Gateway](install-pcg.md).

- An infrastructure cluster profile created for the Nutanix cloud. For guidance on creating a profile, refer to [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md). At the **Cloud Type** step of profile creation, select **Nutanix** listed under the **Tech Preview**. Select the custom packs provided at the OS and Kubernetes layers. Palette provides out-of-the-box packs for the network and storage profile layers, including the **Nutanix CSI** storage pack.


## Deploy a Nutanix Cluster

Use the following steps to deploy a Kubernetes cluster in Nutanix.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** select **Clusters**.

3. Click on **Add New Cluster** and select **Deploy New Cluster** on the next page Palette displays. 

4. Select **Nutanix** and click the **Start Nutanix Configuration** button.

5. Fill out the following basic information, and click **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Cluster Name**| A custom name for the cluster. |
  | **Description**| Use the description to provide context about the cluster.|
  | **Tags**| Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments.|
  | **Cloud Account** | Select your Nutanix account from the **drop-down Menu**. If you have not yet added your account, select **Add New Account** and add your Nutanix account information. |

6. Select the Nutanix cluster profile you created and click **Next**. Palette displays the profile layers.

7. Review profile layers, leaving the OS and Kubernetes packs empty, and customize parameters as desired in the YAML files that display when you select the network and storage layers. Click **Next** when you are done.

8. In the Cluster configuration YAML file that Palette displays, edit the file to replace variables within curly braces listed in the table below with values that apply to your Nutanix cloud environment, and make any adjustments to configure your cluster. Click **Next** when you are done.

  | **Variable** | **Description** |
  |--------------|-----------------|
  | `${CLUSTER_NAME}`| The name of the Nutanix workload cluster. |
  | `${CONTROL_PLANE_ENDPOINT_IP}`| The Nutanix Prism Central IP address. |
  | `${NUTANIX_ENDPOINT}`| The Nutanix cluster IP address. |  

  :::caution

  The following applies when replacing variables within curly braces in the YAML configuration files.

    - All the variables must be resolved or have a default value.

    - Names you provide must match. Any names in the YAML files that do not match your Nutanix cluster configuration will result in unsuccessful cluster deployment.

    - Values that are passed as a string, such as names and keys, must be enclosed in quotes, for example `" "`.

    - When replacing values, remove the dollar sign and curly braces.

    - Verify the default values specified in the YAML file (such as the port).
  
  :::

9. In the Node pool configuration YAML files for the master and worker pools, edit the files to replace each occurrence of the variables within curly braces listed in the tables below with values that apply to your Nutanix cloud environment. You can configure scaling in the Palette UI by specifying the number of nodes in the pool. This corresponds to `replicas` in the YAML file.

  #### Master Pool 

  | **Variable** | **Description** |
  |--------------|-----------------|
  | `${CLUSTER_NAME}`| The name of the Nutanix workload cluster. |
  | `${CONTROL_PLANE_ENDPOINT_IP}`| The Nutanix Prism Central IP address. |
  | `${NUTANIX_SSH_AUTHORIZED_KEY}`| Provide your public SSH key. |
  | `${KUBERNETES_VERSION}`| Specify the Kubernetes version for your cluster, and precede the version number with `v`. For example `v1.26.3` |
  | `${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}`| The name of your Nutanix AHV cluster (as defined in Prism). |
  | `${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME}` | The name of your OS image as defined in Prism Central. To locate images, navigate in the Nutanix Prism dashboard to **Compute & Storage** and select **Images**.|
  | `${NUTANIX_SUBNET_NAME}` | The name of the subnet as defined in Prism Central that will be assigned to the virtual machines (VMs) deployed in this cluster. |

  #### Worker-Pool

    | **Variable** | **Description** |
    |--------------|-----------------|
    | `${NUTANIX_SSH_AUTHORIZED_KEY}`| Provide your public SSH key. |
    | `${KUBERNETES_VERSION}`| Specify the Kubernetes version for your cluster, and precede the version number with `v`. For example `v1.26.3` |
    | `${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}`| The name of your Nutanix AHV cluster (as defined in Prism). |
    | `${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME}` | The name of your OS image as defined in Prism Central. To locate images, navigate in the Nutanix Prism dashboard to **Compute & Storage** and select **Images**. |
    | `${NUTANIX_SUBNET_NAME}` | The name of the subnet as defined in Prism Central that will be assigned to the VMs deployed in this cluster. |


10. Click **Next** when you are done.

11. Review the options for OS patching schedule, scanning, backups, and RBAC. 

12. Click **Validate** and review the cluster configuration and settings summary.

13. Click **Finish Configuration** to deploy the cluster. The cluster details page contains the status and details of the deployment. Use this page to track deployment progress. Provisioning clusters can take several minutes to complete.

14. To edit node pool configurations, navigate to the cluster details page, click the **Nodes** tab, and select the node pool you want to edit. Click the **Edit** button and edit the YAML file that Palette displays. 

15. To edit cluster settings, from the cluster details page, click the **Settings** button and select **Cluster Configuration**. Edit the YAML file that Palette displays.


## Validate

1.  Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the **left Main Menu** and select **Clusters**. The Clusters page displays a list of all available clusters that Palette manages.

3. Click on the Nutanix cluster you created to view its details page.

4. Ensure the **Cluster Status** field displays **Running**.

