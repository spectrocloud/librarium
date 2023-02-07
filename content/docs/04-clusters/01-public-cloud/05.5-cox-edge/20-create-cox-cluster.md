---
title: "Create and Manage Cox IaaS Cluster"
metaTitle: "Create and Manage Cox IaaS Cluster"
metaDescription: "Learn how to add and manage a cluster deployed to Cox Edge."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Create and Manage Cox Edge IaaS Cluster


Palette supports creating and managing Kubernetes clusters deployed to a Cox Edge account. This section guides you on how to create a Kubernetes cluster in Cox Edge that is managed by Palette.

## Prerequisites

- A [Spectro Cloud](https://console.spectrocloud.com) account.

- A [Cox Edge](https://portal.coxedge.com/login) account. 

- A Cox Edge account registered in Palette. Check out the [Register and Manage Cox Edge Accounts](/clusters/public-cloud/cox-edge/add-cox-edge-accounts) guide to learn how to register a Cox Edge account in Palette.

- A cluster profile for Cox Edge clusters. If you need guidance in creating a cluster profile, check out the [Creating Cluster Profiles](/cluster-profiles/task-define-profile) guide.


## Create a Cluster

1.  Log in to [Palette](https://console.spectrocloud.com)


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Click on **+ Add New Cluster** and select **Deploy New Cluster**.


4. Pick **Cox Edge** from the list of infrastructure providers.


5. Fill out the input fields and Click on **Next**.
 
    - Cluster name: The name of the new cluster.
    - Description:  A text value that explains the cluster.
    - Tags: Assign tags to the cluster.
    - Cloud Account: Select your Cox Edge account.


6. Select a cluster profile that is compatible with Cox Edge. If you need guidance in creating a cluster profile, check out the [Creating Cluster Profiles](/cluster-profiles/task-define-profile) guide.


7. Review the cluster profile and all of its manifest files. Select **Next** to continue.


8. Fill out the inputs fields and select **Next**.
    - SSH Keys: Select an SSH key pair or create a new key pair. 
    - Load Balancer PoP: The location of where you want to deploy the cluster compute resources.
    - Organization: The Cox Edge organization to target for the deployment.
    - Environment:  The Cox Edge environment to deploy the compute resources.
    - Update worker pools in parallel: Toggle this checkbox if you wish to update worker pool nodes in parallel.

9. Fill out the input fields for both the **master-pool** and the **worker-pool** and select **Next**.
    #### Master Pool configuration:
    - Allow worker capability: Toggle this checkbox to allow the control plane node to handle workloads.
    - Additional Labels: Add Kubernetes values to the cluster.
    - Taints: Toggle to enable taint. If enabled, you will have the option to specify the taint label.
    - Cloud Configuration: 
        - Deployment Name: The name to assign the Cox Edge deployment.
        - PoP: The Cox Edge location to target.
        - Instance Type: The compute size.
        - Network policies: The network rules to apply to the deployment. Review the list of required network policies in the [Network Rules](/clusters/public-cloud/cox-edge/network-rules) documentation.
    
    <br />

    <WarningBox>

    Use the network rules specified in the [Network Rules](/clusters/public-cloud/cox-edge/network-rules) documentation. If you fail to add the required network rules Palette will be unable to deploy the cluster to Cox Edge.

    </WarningBox>

      #### Worker Pool configuration:
      - Node pool name: The name of the worker node pool.
      - Enable Autoscaler: Enable to automatically scale the size of the node pool. Set a minimum and maximum pool size.
      - Rolling update: Apply the update policy. Expand first launches new nodes and then terminates old notes. Contract first terminates old nodes and then launches new nodes.
      - Additional Labels: Add Kubernetes values to the cluster.
      - Taints: Toggle to enable taint. If enabled, you will have the option to specify the taint label.
      - Cloud Configuration: 
        - Deployment Name: The name to assign the Cox Edge deployment.
        - PoP: The Cox Edge location to target.
        - Instance Type: The compute size.
        - Network policies: The network rules to apply to the deployment. Review the list of required network policies in the [Network Rules](/clusters/public-cloud/cox-edge/network-rules) documentation.


10. The settings page is where you can configure patching schedule, security scans, backup settings, setup role based access control (RBAC), and enable [Palette Virtual Clusters](/devx/palette-virtual-clusters). Review the settings and make changes if needed. Click on **Validate**.


11. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning IaaS clusters can take several minutes.

The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.


## Validation

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.


# Delete a Cox Edge IaaS Cluster

The deletion of a Cox Edge cluster results in the removal of all instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps. 


1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.
To force delete a cluster follow the same steps outlined in [Delete a Cox Edge IaaS Cluster](#delete-a-cox-edge-iaas-cluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings** drop-down menu. The **Settings** drop-down menu will provide you with an estimated time left before the force deletion becomes available..

<br />
