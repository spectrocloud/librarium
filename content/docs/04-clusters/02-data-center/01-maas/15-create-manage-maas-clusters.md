---
title: "Create and Manage MAAS Clusters"
metaTitle: "Create and Manage MAAS Clusters"
metaDescription: "Learn how to create and manage MAAS clusters in Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview 

Palette supports creating and managing Kubernetes clusters deployed to a MAAS account. This section guides you on how to create a Kubernetes cluster in MAAS that is managed by Palette.

# Prerequisites

- An installed Private Cloud Gateway (PCG). Review the [Install and Manage MAAS Gateway](/clusters/data-center/maas/install-manage-maas-pcg) for guidance.


- At least one preconfigured MAAS cloud account with credentials.

- A cluster profile for the MAAS environment. Review [Cluster Profiles](/cluster-profiles) for more information. 

# Enablement

To deploy a new MAAS cluster:

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and click **Clusters**. Then click the **Add New Cluster** button.


3. Click **Deploy New Cluster** on the Create a New Cluster page.


4. Select **MAAS** and click the **Start MAAS Configuration** button.


5. Provide basic cluster information: **Cluster name**, **Description**, and **Tags**.


6. Select your cloud account from the **drop-down Menu** and click **Next**.


7. Select the cluster profile for your MAAS cluster. 


8. Review and override pack parameters as desired and click **Next**. By default, parameters for all packs are set with values defined in the cluster profile.


9. Select a MAAS Cloud account and provide placement information.


10. Select a domain from the **Domain drop-down Menu** and click **Next**. 


11. Configure the master and worker node pools. Enter values for properties listed in the following tables.

<br />


#### Master Node Pool

| Property | Description |
|-----------|-------------|
| Name | A descriptive name for the node pool. |
| Size | Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5. |
| Allow worker capability | Select this option to allow workloads to be provisioned on master nodes. |
| [Labels](/clusters/cluster-management/taints#overviewonlabels) | Labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. |
| [Taints](/clusters/cluster-management/taints#overviewontaints) | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. |
| Instance type | The compute instance type to be used for all nodes in the node pool. |
| Availability Zones | These are multiple, isolated locations within a Region. When you choose one or more availability zones, Palette provides fault tolerance to guard against hardware failures and network failures by provisioning nodes across availability zones if multiple zones are selected. |
| Disk Size | Specify the required storage size. |

<br />


#### Worker Node Pool

| Property | Description |
|-----------|-------------|
| Name | A descriptive name for the node pool. |
| Size | Number of VMs to be provisioned for the node pool.|
| Rolling Update | Rolling update has two available options. Review the Update Parameter list below for more details. ?? |
| [Labels](/clusters/cluster-management/taints#overviewonlabels) | Labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. |
| [Taints](/clusters/cluster-management/taints#overviewontaints) | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. |
| Instance type | The compute instance type to be used for all nodes in the node pool. |
| Availability Zones | These are multiple, isolated locations within a Region. When you choose one or more availability zones, Palette provides fault tolerance to guard against hardware failures and network failures by provisioning nodes across availability zones if multiple zones are selected. |
| Disk Size | Specify the required storage size. |


12. You can configure the following cluster management features now if needed, or you can do it later:

- Manage Machines
- Scan Policies
- Backup Policies
- Review settings and deploy the cluster. 

13. Review settings and deploy the cluster. 


# Validation

You can validate your cluster is available by reviewing the cluster details page. Navigate to the left **Main Menu** and click **Clusters**. The **Clusters** page lists all available clusters Palette manages. Select the cluster to review its details page. Ensure the **Cluster Status** field contains the value **Running**.



# Delete a MAAS Cluster

When you delete a MAAS cluster, all virtual machines and associated storage disks that were created for the cluster are removed. 

Follow these steps to delete a MAAS cluster.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and click **Clusters**. 


3. Select the cluster you want to delete.


4. Click the **Settings drop-down Menu**, and choose **Delete**.

The cluster status is updated to Deleting while cluster resources are being deleted. When all resources are successfully deleted, the cluster status is updated to Deleted and the cluster is removed from the list. The delete operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are removed.


## Force Delete a Cluster

If a cluster is stuck in the Deletion state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope. To force delete a cluster follow the same steps outlined in [Delete a MAAS Cluster](/clusters/data-center/maas/create-manage-maas-clusters#deleteamaascluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings drop-down menu**. The drop-down menu will provide you with an estimated time left before the force deletion becomes available.

<br />

<WarningBox>
A force delete can result in Palette-provisioned resources to be missed in the removal process. Verify there are no remaining resources. Failure to remove provisioned resources can result in unexpected costs.
</WarningBox>

# Next Steps

Now that you’ve deployed a MAAS cluster, you can start developing and deploying applications to your cluster. We recommend you review the Day-2 responsibilities and become familiar with the cluster management tasks. Check out the [Manage Clusters](/clusters/cluster-management) documentation to learn more about Day-2 responsibilities.



<br />

<br />
