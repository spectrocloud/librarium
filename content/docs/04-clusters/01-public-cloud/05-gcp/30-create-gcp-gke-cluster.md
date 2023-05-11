---
title: "Create and Manage GCP GKE Cluster"
metaTitle: "Create and Manage GKE IaaS Cluster"
metaDescription: "Learn how to add and manage a GKE cluster deployed to GCP with Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Create and Manage GCP IaaS Cluster


Palette supports creating and managing Kubernetes clusters using Google Kubernetes Engine (GKE). This section guides you on how to create a managed Kubernetes cluster that is deployed to GKE and managed by Palette.

# Prerequisites

Ensure the following requirements are met before you attempt to deploy a cluster to GCP:

- Access to a GCP cloud account 


- You have added a GCP account in Palette. Review the [Register and Manage GCP Accounts](/clusters/public-cloud/gcp/add-gcp-accounts) for guidance.


- An infrastructure cluster profile for GKE. Review the [Create Cluster Profiles](/cluster-profiles/task-define-profile) for guidance.


- Palette creates compute, network, and storage resources while provisioning Kubernetes clusters. Ensure there is sufficient capacity in the preferred GCP region for the creation of the following resources:
  - Virtual Private Cloud (VPC) Network
  - Static External IP Address
  - Network Interfaces 
  - Cloud NAT
  - Cloud Load Balancing
  - Persistent Disks
  - Cloud Router


# Deploy a GKE Cluster

1. Log in to [Palette](https://console.spectrocloud.com) and ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on **Add New Cluster**


4. You will receive a prompt asking if you want to deploy or import a new cluster. Click on **Deploy New Cluster**


5. Select **GCP** and click on **Start GCP Configuration**


6. Populate the wizard page with the following information: name, description, tags, and select GCP account. Tags assigned to a cluster are propagated to the VMs deployed to the computing environments. Click on **Next** after completing all the required information.



7. Select the **Managed Kubernetes** row and click on one of your GKE cluster profiles. Click on **Next**.



8. Review and customize pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile. Click on **Next** to continue.


9. Fill out the following parameters. After completing the required information, click on **Next**. 

  <br />

  |Parameter|Description|
  |---|---|
  |**Project**|The project to which the cluster belongs.|
  |**Region**|Choose the desired GCP region to deploy the cluster.|


10. The Node configuration page is where you can specify the availability zones (AZ), instance types, disk size, and the number of nodes. Configure worker node pool.

  <br />

  <InfoBox>

  You can add new worker pools to customize specific worker nodes to run specialized workloads. For example, the default worker pool may be configured with the c2.standarnd-4 instance types for general-purpose workloads. Another worker pool with instance type g2-standard-4 can be configured to run GPU workloads.

  </InfoBox>


11. An optional taint label can be applied to a node pool during the cluster creation. For an existing cluster, the taint label can be edited. Review the [Node Pool](/clusters/cluster-management/node-pool) management page to learn more. Toggle the **Taint** button to create a label. 


13. Enable or disable node pool taints. If tainting is enabled, then you need to provide values for the following parameters:
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Key**      |Custom key for the taint.|
    |**Value**    | Custom value for the taint key.|
    | **Effect**  | Make the choice of effect from the drop-down Menu. Review the [Effect Table](/clusters/public-cloud/gcp/create-gcp-iaas-cluster#effecttable) below for more details. |
  
    #### Effect Table
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    | **NoSchedule**|  A pod that cannot tolerate the node taint and should not be scheduled to the node. 
    | **PreferNoSchedule**| The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.
    | **NoExecute**|  New pods will not be scheduled on the node, and existing pods on the node will be evicted if they do not tolerate the taint. |

14. Click on **Next** after configuring the node pool.



15. The settings page is where you can configure the patching schedule, security scans, backup settings, and setup Role Based Access Control (RBAC). Review the cluster settings and make changes if needed. Click on **Validate**.


16. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning IaaS clusters can take approximately 15 - 30 min depending on the cluster profile and the node pool configuration.

The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.


# Validate

You can validate that your cluster is up and available by reviewing the cluster details page. 

1. Log in to [Palette](https://console.spectrocloud.com).



2. Navigate to the left **Main Menu** and click on **Clusters**. 


3. The **Clusters** page lists all available clusters Palette manages. Click on the row for the cluster you wish to review its details page. 



4. From the cluster details page, verify the **Cluster Status** field contains the value **Running**.