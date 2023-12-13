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

- A cluster profile created for the Nutanix cloud. To learn how to create a profile, refer to  [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/).

- A Cluster API (CAPI) image created for the Nutanix cloud platform. For guidance, refer to [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).

- The following three YAML files created during cloud registration process:
  - cloudClusterTemplate.yaml
  - controlPlanePoolTemplate.yaml
  - infrastructure-component.yaml
  - workerPoolTemplate.yaml


## Deploy a Nutanix Cluster

Use the following steps to deploy a new Nutanix cluster.

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
  | **Cloud Account** | If your Nutanix account is already added in Palette, select it from the **drop-down Menu**. Otherwise, click on **Add New Account** and add your Nutanix account information. |

6. Select the Nutanix cluster profile you created and click **Next**. Palette displays the cluster profile layers.

7. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer. The table below lists parameters you may need to review in each profile layer.

  | **Profile Layer** | **Parameters to Check** |
  |-------------------|-------------------------|
  | **CSI** | `prismEndPoint`<br />`prismPort`<br />`username`<br />`password`  |

In the Cluster configuration YAML file, replace each occurrence of the variables listed below. Values that are passed as a string, such as names and keys must be enclosed in quotes.

${CLUSTER_NAME}
${CONTROL_PLANE_ENDPOINT_IP}  - replace with your host static IP address
${CLUSTER_ENDPOINT}

In the Node Pool Configuration YAML file for the master pool, replace each occurrence of the variables listed below. 

${CLUSTER_NAME}
${CONTROL_PLANE_ENDPOINT_IP}
${NUTANIX_SSH_AUTHORIZED_KEY}
${KUBERNETES_VERSION} - precede with v
${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}
${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME} - replace with OS image
${NUTANIX_SUBNET_NAME} 

In the Node Pool Configuration YAML file for the worker pool, replace each occurrence of the variables listed below.

${NUTANIX_SSH_AUTHORIZED_KEY}
${KUBERNETES_VERSION} - precede with v, no quotes 
${NUTANIX_PRISM_ELEMENT_CLUSTER_NAME}
${NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME}
${NUTANIX_SUBNET_NAME} 


Other variables will use the default values in the YAML files created during cloud registration.

8. Click **Next** to continue. Palette displays the Cluster configuration YAML file.

9. Review the YAML file that displays and make any adjustments to configure your cluster. Replace everything in curly braces with a value. For example, "${CLUSTER_NAME]" ==> "test-demo" Click **Next** when you are done.

Verify the `prismEndPoint` IP address and `prismPort`.


<<< PLACEHOLDER FOR INFO ABOUT Panel at right to be added - user fills in macro values during (Cluster config step).Macros are in the infrastructure-components.yaml. All the values should be resolved or have a default value. For xmp, {NUTANIX_INSECURE=false} Things that are user input for the cloud account. 
Values input in Palette replace values in the infrastructure-components.yaml and in any other templates where the macro appears.

:::caution
names must match, or cluster configuration will fail. `name: "master-pool"` in the worker pool must match. follow format - "${CLUSTER_NAME-control-plane]" must be `"test-demo-control-demo"`. "${KUBERNETES_VERSION}" must be preceded with a `v`: `"v1.27.5"`
:::

variables within braces must be replaced.

CSI pack changes per cloud - cloud provider interface (CPI ) is included in the pack.

Scaling is specified in the UI and is reflected in the `replicas` parameter.

Update and Delete cluster is also done in a yaml. >>>



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


## Resources

tbs