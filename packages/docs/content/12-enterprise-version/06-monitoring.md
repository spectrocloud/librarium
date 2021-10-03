---
title: "Cluster Monitoring Metrics"
metaTitle: "Enterprise Cluster Monitoring Metrics"
metaDescription: "Enterprise Cluster Monitoring Metrics for Spectro Cloud's Enterprise (on-premise) variant."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Enterprise Cluster Monitoring Metrics	
## Pods Monitoring Metrics
### Namespaces to Monitor Pods

|Namespaces |Interpretation|
|-----------|--------------|
|ui-system |Spectro Management UI|
|cp-system |System Management UI|
|nats-system | Message System|
|ingress-nginx | Ingress services|
|hubble-system |Core backend services|
|jet-system |Pivot Tenant Clusters|

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




