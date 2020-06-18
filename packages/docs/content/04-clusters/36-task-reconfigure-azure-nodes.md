---
title: "Reconfiguring an Azure worker pool"
metaTitle: "Reconfiguring an Azure worker pool"
metaDescription: "Detailed instructions on how to reconfigure an Azure worker pool in Spectro Cloud"
icon: ""
---

# Reconfiguring Azure nodes

The following steps need to be performed to reconfigure worker pool nodes:-

* Access the nodes view for the the cluster
* Edit the settings of the desired node pool
* Change the instance type to the desired instance type
* Update the Managed Disk  type and Size of the storage to be used.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with ongoing progress of nodes being deleted and added.
