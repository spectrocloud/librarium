---
title: "Task: Reconfigure nodes"
metaTitle: "Task: Reconfigure nodes"
metaDescription: "How to reconfigure nodes in AWS through Spectro Cloud"
icon: ""
---

# Task: Reconfigure nodes

The following steps need to be performed to reconfigure worker pool nodes:-

* Access the nodes view for the the cluster
* Edit settings of the desired node pool
* Change the instance type to the desired instance type
* Save node pool settings. After node pool settings are updated node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with ongoing progress of nodes being deleted and added.
