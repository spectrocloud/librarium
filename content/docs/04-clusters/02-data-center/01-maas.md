---
title: "MAAS"
metaTitle: "Configure MAAS and create MAAS clusters in Palette"
metaDescription: "Learn how to configure MAAS and create MAAS clusters in Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Palette supports integration with Canonical MAAS to give a cloud-like experience to deploying, running, and managing Kubernetes clusters directly on top of bare metal servers. 

# Prerequisite

- Canonical MAAS installed, set up, and available in your environment.

The following steps outline the overall process to install a Private Cloud Gateway (PCG), which is used to manage a MAAS bare metal cloud. The PCG facilitates communication between Palette and MAAS. This is necessary because the MAAS control plane is typically not exposed directly to the internet. 

For detailed steps to install the MAAS PCG, refer to [Install and Manage a MAAS Gateway](??).

<br />

1. You obtain a pairing code in Palette that you will provide when you run the installer.

2. You run a configuration script using a docker image. The script creates a PCG configuration file that the installer will use.

3. You run the installer using the open-source Kind tool. 

4. The installer uses the configuration file to build a cluster that will host the PCG.

    The installer needs access to your Palette account and one machine from your MAAS cluster if you do not want High Availability (HA), or three machines from your MAAS cluster if you want HA.

    The machines in your MAAS must have internet access and be in a ready state.
    <br />

    <InfoBox>

    For production environments, we recommend setting up three nodes. If you initially set up the gateway with one node, you can resize it to three nodes at a later time. 

    </InfoBox>

5. The installer installs one machine (for non-HA) or three machines (for HA) from your MAAS cluster to build a new cluster that will host the PCG.



# Resources














DELETE from here to end.

# Deploying a bare metal cluster using MAAS

`video: title: "maas-cluster-creation": ./cluster-creation-videos/maas.mp4`

The following steps need to be performed to provision a new MAAS cluster:

1. Provide basic cluster information like name, description, and tags.


2. Select a cluster profile created for the MAAS environment. The profile definition will be used as the cluster construction template.


3. Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.


4. Provide a MAAS Cloud account and placement information.

    |**Parameter**| **Description**|
    |:-------------|:----------------|
    |**Cloud Account** | Select the desired cloud account.
    MAAS cloud accounts with credentials need to be preconfigured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.
    |**Domain**|
    

5. Configure the master and worker node pools. Fill out the input fields in the **Add node pool** page. The following table contains an explanation of the available input parameters.

### Master Pool

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Size**          |Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.|
|**Allow worker capability**|Select this option for allowing workloads to be provisioned on master nodes.|
|**[Labels](/clusters/cluster-management/taints#overviewonlabels)**| Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload. 
|**[Taints](/clusters/cluster-management/taints#overviewontaints)**|To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.|
|**Instance type** |Select the compute instance type to be used for all nodes in the node pool.|
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.|
|**Disk Size**|Give the required storage size|

### Worker Pool

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Size**          |Number of VMs to be provisioned for the node pool.|
|**Rolling Update**| Rolling update has two available options. Review the [Update Parameter](#update-parameter-table) table below for more details.
|**[Labels](/clusters/cluster-management/taints#overviewonlabels)**|Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.
|**[Taints](/clusters/cluster-management/taints#overviewontaints)**|To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.|
|**Instance type** |Select the compute instance type to be used for all nodes in the node pool.|
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.|
|**Disk Size**|Provide the required storage size

6. Configure the cluster management features if needed, these features can also be scheduled later for the running clusters.

    * Manage Machines
    * Scan Policies
    * Backup Policies

Click to get details on [cluster management feature](/clusters/cluster-management/#cluster-updates)
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

# Deleting a MAAS Cluster
The deletion of a MAAS cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a MAAS cluster:


1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.


2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Click **Confirm** to delete.


The Cluster Status is updated to **Deleting** while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to **Deleted** and is removed from the list of clusters.


<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, the 'Abort' action is available to stop provisioning and delete all resources.
</InfoBox>


# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope. 

## To force delete a cluster:

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the **Force Delete** button.

<WarningBox>
If there are any cloud resources still on the cloud, the user should clean up those resources before going for the force deletion. 
</WarningBox>

