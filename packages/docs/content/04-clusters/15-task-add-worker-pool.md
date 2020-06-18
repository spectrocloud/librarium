---
title: "Task: Add a worker pool"
metaTitle: "Task: Add a worker pool in AWS through Spectro Cloud"
metaDescription: "How to add a worker pool in AWS through Spectro Cloud"
icon: ""
---

# Add worker pool

The following steps need to be performed to add a new worker node pool to a cluster:-

* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page

* Provide node pool settings as follows:
    * A descriptive name for the node pool
    * Number of nodes in the node pool
    * One or more availability zones.  Nodes are distributed across availability zones when multiple zones are selected.
    * Instance type to be used for all the nodes lunched in the node pool
    * Save node pool settings. New worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with ongoing progress of tasks related to addition of new nodes.
    