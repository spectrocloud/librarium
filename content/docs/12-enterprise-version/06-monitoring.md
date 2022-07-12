---
title: "Cluster Monitoring Metrics"
metaTitle: "Enterprise Cluster Monitoring Metrics"
metaDescription: "Enterprise Cluster Monitoring Metrics for Palette's Enterprise (on-premises) variant."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Enterprise Cluster Monitoring Metrics    
## Pods Monitoring Metrics
### Namespaces to Monitor Pods

|**Namespaces** |**Interpretation**|
|-----------|--------------|
|**ui-system** |Palette Management UI|
|**cp-system** |System Management UI|
|**nats-system**| Message System|
|**ingress-nginx**| Ingress services|
|**hubble-system**|Core backend services|
|**jet-system**|Pivot Tenant Clusters|

### Exceptions

The below pods are dynamically created from jobs and can be excluded from monitoring.

* ingress-nginx-admission-patch-* [ ns: ingress-nginx ]
* ingress-nginx-admission-create-* [ ns: ingress-nginx ]
* packsync-* [ ns: hubble-system ]
* cleanup-* [ ns: hubble-system ]


## CPU and Memory Monitoring Metrics

### Default Specifications
* CPU: 4 vCPU
* RAM: 8 GB RAM
* CP Nodes: 3

### Thresholds
* CPU warn [per node ] > 70%
* CPU alert [per node] > 80%
* Memory Warn [per node] > 80%
* Memory Alert [per node] > 90%

### Node Monitoring Metrics
 #### Number of Nodes: 3
 #### Node Alerts
* Node up
* Node down
* Node unreachable


# Add-on Pack Monitoring

Add-on packs are installed, and you may need a way to monitor which are in progress of installing and which are failed. When there are just a few packs added to the cluster profile, it is easy to observe its status, but when you have many packs, it gets a little tricky. The Cluster Profile page allows you to see the list of packs associated with the cluster you are monitoring, the status of each Add-on pack, and the install progress of the pack.  



<br />
<br />

