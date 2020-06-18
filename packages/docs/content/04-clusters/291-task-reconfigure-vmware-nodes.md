---
title: "Task: Reconfigure VMware nodes"
metaTitle: "Task: Reconfigure VMware nodes"
metaDescription: "The method of reconfiguring VMware nodes for deploying a cluster through Spectro Cloud"
icon: ""
---

# Reconfiguring VMware Nodes

The following steps need to be performed to reconfigure worker pool nodes: -

* Access the nodes view for the the cluster
* Edit the settings of the desired node pool
* Change the CPU, Memory and Disk size to the desired settings
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with the ongoing progress of nodes being deleted and added.
