---
title: "Task: Delete a VMware cluster"
metaTitle: "Task: Delete a VMware cluster"
metaDescription: "The method of deleting a cluster on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Deleting a VMware Cluster

Deletion of a VMware cluster results in removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a VMware cluster:

* Select the cluster to be deleted from the cluster view and navigate to the the cluster overview page
* Invoke a delete action available on the page
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and it is removed from the list of clusters.

> Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, ‘Abort’ action is available to stop provisioning and delete all resources.
