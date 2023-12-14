---
sidebar_label: "Create and Manage Nutanix Cluster"
title: "Create and Manage Nutanix Cluster"
description: "Learn how to create and manage Nutanix clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---

Palette supports creating and managing Kubernetes clusters deployed to a Nutanix infrastructure. This section guides you in creating a Kubernetes cluster in a custom Nutanix cloud managed by Palette.

## Prerequisites

- A Nutanix Prism Central cloud account.

- A Private Cloud Gateway (PCG) deployed.

- Minimum supported CAPI version v1.5.3. Refer to the Nutanix [Validated Integrations](https://opendocs.nutanix.com/capx/v1.2.x/validated_integrations/#validated-versions) compatibility matrix.

- A cluster profile created for the Nutanix cloud. To learn how to create a profile, refer to [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/).

- A Cluster API (CAPI) image created for the Nutanix cloud platform. For guidance, refer to [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).

<!-- - The following YAML files obtained and created during cloud registration process:
  - cloudClusterTemplate.yaml
  - controlPlanePoolTemplate.yaml
  - infrastructure-component.yaml
  - workerPoolTemplate.yaml -->


## Deploy a Nutanix Cluster

Use the following steps to deploy a Kubernetes cluster on Nutanix using Palette.

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

6. Select the Nutanix cluster profile you created and click **Next**. Palette displays the cluster profile layers.

7. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer. Click **Next** when you are done.

8. In the Cluster configuration YAML file that Palette displays, edit the file to replace each occurrence of the variables within curly braces listed in the table with values that apply to your Nutanix cloud environment, and make any adjustments to configure your cluster. Click **Next** when you are done.

  | **Variable** | **Description** |
  |--------------|-----------------|
  | `${CLUSTER_NAME}`| The name of the Nutanix workload cluster. |
  | `${CONTROL_PLANE_ENDPOINT_IP}`| The host static IP address. |
  | `${CLUSTER_ENDPOINT}`| The cluster IP address. |  

  :::caution

  The following applies when replacing variables within curly braces in the YAML files.

    - All the variables must be resolved or have a default value.

    - Names you provide must match. Any names in YAML file that do not match your Nutanix cluster configuration will fail.

    - Values that are passed as a string, such as names and keys, must be enclosed in quotes, for example " ".

    - When replacing values, remove the dollar sign and curly braces.

    - Verify the port specified in the YAML.
  
  :::

9. In the Node pool configuration YAML files for the master and worker pools, edit the files to replace each occurrence of the variables within curly braces listed in the tables below with values that apply to your Nutanix cloud environment. You can configure scaling by specifying the number of nodes in the pool, which corresponds to `spec.replicas` in the file.

  #### Master Pool 

  | **Variable** | **Description** |
  |--------------|-----------------|
  | `${CLUSTER_NAME}`| The name of the Nutanix workload cluster. |
  | `${CONTROL_PLANE_ENDPOINT_IP}`| The host static IP address. |
  | `${NUTANIX_SSH_AUTHORIZED_KEY}`| Provide your public SSH key. |
  | `${KUBERNETES_VERSION}`| Specify the Kubernetes version for your cluster, and precede the version number with  'v'. For example: v.1.26.3 |
  | `${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}`| The name of your Nutanix Prism cluster. |
  | `${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME}` | The name of your OS image. |
  | `${NUTANIX_SUBNET_NAME}` | The name of the subnet for your Nutanix Prism cluster. |


<!-- ${CLUSTER_NAME}
${CONTROL_PLANE_ENDPOINT_IP}
${NUTANIX_SSH_AUTHORIZED_KEY}
${KUBERNETES_VERSION} - precede with v
${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}
${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME} - replace with OS image
${NUTANIX_SUBNET_NAME}  -->

  #### Worker-Pool

  | **Variable** | **Description** |
  |--------------|-----------------|
  | `${NUTANIX_SSH_AUTHORIZED_KEY}`| Provide your public SSH key. |
  | `${KUBERNETES_VERSION}`| Specify the Kubernetes version for your cluster, and precede the version number with  'v'. For example: v.1.26.3 |
  | `${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}`| The name of your Nutanix Prism cluster. |
  | `${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME}` | The name of your OS image. |
  | `${NUTANIX_SUBNET_NAME}` | The name of the subnet for your Nutanix Prism cluster. |


<!-- ${NUTANIX_SSH_AUTHORIZED_KEY}
${KUBERNETES_VERSION} - precede with v, no quotes 
${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}
${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME}
${NUTANIX_SUBNET_NAME}  -->


10. Click **Next** when you are done.

11. Review the options for OS Patchine Schedule, scanning, backups, and RBAC. 

12. Click **Validate** and review the cluster configuration and settings summary.

13. Click **Finish Configuration** to deploy the cluster. The cluster details page contains the status and details of the deployment. Use this page to track the deployment progress. Provisioning clusters can take several minutes to complete.

14. To edit node pool configurations, navigate to the cluster details page, click the **Nodes** tab, and select the node pool you wnat to edit. Click the **Edit** button and edit the YAML that Palette displays. 

15. To edit cluster settings, from the cluster details page, click the **Settings** button and select **Cluster Configuration**. Edit the YAML that Palette displays.


## Validate

1.  Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the **left Main Menu** and select **Clusters**. The Clusters page displays a list of all available clusters that Palette manages.

3. Click on the cluster you created to view its details page.

4. Ensure the **Cluster Status** field displays **Running**.

