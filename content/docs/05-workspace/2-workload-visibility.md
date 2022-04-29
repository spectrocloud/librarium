---
title: "Workspace - Workload Visibility"
metaTitle: "Adding a workspace"
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
|Deployments|All the running deployments specific to clusters belonging to the workspace with namespace to which these deployments belong, pods details, replicas, and age are enumerated|
|DaemonSets|DaemonSet resource utilization is described, with details on namespaces, pods, and age of individual Daemon sets|
|StatefulSets|All the active StatefulSets specific to clusters belonging to the workspace with corresponding namespace, pods details, replicas, and age are enumerated|

