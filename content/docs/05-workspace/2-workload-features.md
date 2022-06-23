---
title: "Workspace Management"
metaTitle: "The additional features to optimize workspace performance"
metaDescription: "How to get unified view of workloads in logically grouped namespaces and clusters"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



#  Workload Visibility

Workspace provides visibility into workloads deployed across clusters. 

|Resource|Description availed from Workspace|
|---|-----|
|Namespaces|Cluster Specific namespaces with CPU and Memory utilization|
|Pods|Lists all the pods running on a particular namespace with cluster names with the detailed health status, age, and resource utilization of each of them|
|Deployments|All the running deployments specific to clusters belonging to the Workspace with namespace to which these deployments belong, pods details, replicas, and age are enumerated|
|DaemonSets|DaemonSet resource utilization is described, with details on namespaces, pods, and age of individual Daemon sets|
|StatefulSets|All the active StatefulSets specific to clusters belonging to the Workspace with corresponding namespace, pods details, replicas, and age are enumerated|


# Schedule Backups

Palette users can create cluster backups from within a Workspace (usually consisting of multiple clusters) and restore them later time as desired. Palette allows granular controls within a Workspace for users to perform specific tasks within the Workspace, without having the ability to update Workspace details. Click [Workspace Backup and Restore](/clusters/cluster-management/backup-restore#workspacebackupandrestore) for more information.

# Workspace Quota
 
Palette enables the users to limit resource usage within the Workspace optionally. The Quota is specified in terms of the maximum CPU and memory. Therefore, the resource utilization within the namespace should be below the Quota allocated across all the clusters.

<br />

### To set your Namespace Quota:

* During [Step: 3 Associate Namespaces](/workspace/adding-a-new-workspace#3.associatenamespaces) of Namespace creation, `Workspace Quota` can be set by giving the `Maximum CPU` (Optional) and `Maximum Memory` (Optional). Then, all the clusters launched within the Namespace can utilize the set Quota.

### Namespace Quota can be set for an already deployed Workspace as:

** Workspace Settings -> Namespaces -> Workspace Quota**

# Restricted Container Images

Palette users can restrict a few container images from getting deployed into a specific Namespace. This helps the tenants from accidentally installing a delisted or unwanted container to that specific Namespace.

<br />

### To restrict a container image for a particular Namespace within the Workspace:

* During [Step: 4 Settings](/workspace/adding-a-new-workspace#4.settings) of Workspace creation, select the `**Container Images**' tab from the left ribbon. 


* Click on **Add New Container Image** and provide the `Namespace` and `Restricted Images.` Multiple images can be restricted within a Namespace by separating them with commas.

### The user can add a list of restricted images to an already deployed Workspace as:

* **Workspace Settings -> Container Images**


* Click on `Add New Container Image` and provide the `Namespace` and `Restricted Images.` Multiple images can be restricted within a Namespace by separating them with commas.







