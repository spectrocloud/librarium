---
title: 'Outcold Solutions'
metaTitle: 'Outcold Solutions'
metaDescription: 'Outcold Solutions - Monitoring pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['monitoring', 'amd64']
logoUrl: 'https://registry.spectrocloud.com/v1/outcold-monitoring/blobs/sha256:3140960d1f39649ad821cfc59450d3c164079b03d15387b2e638eae07442af41?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Outcold Solutions - Monitoring Kubernetes

Integration provides Kubernetes monitoring solution that includes log aggregation, performance and system metrics, metrics from the control plane and application metrics, a dashboard for reviewing network activity, and alerts to notify you about cluster or application performance issues.

## Versions Supported

<Tabs>
<Tabs.TabPane tab="5.0.x" key="5.0.x">

* **5.0.0**

</Tabs.TabPane>
</Tabs>

## Prerequisites

This integration forwards logs and metrics to [Splunk](https://www.splunk.com/). Pre-requisites for Splunk are
1. [Install Kubernetes Monitoring application](https://www.outcoldsolutions.com/docs/monitoring-kubernetes/v5/installation/#install-monitoring-kubernetes-application)
2. [Enable HTTP Event Collector (HEC) in Splunk](https://www.outcoldsolutions.com/docs/monitoring-kubernetes/v5/installation/#enable-http-event-collector-in-splunk)
3. Make sure to configure the forwarder settings below while setting up the pack

```YAML
[general]

acceptEULA = false

license =

fields.kubernetes_cluster = -

...

# Splunk output
[output.splunk]

# Splunk HTTP Event Collector url
url =

# Splunk HTTP Event Collector Token
token =

# Allow invalid SSL server certificate
insecure = false

# Path to CA certificate
caPath =

# CA Name to verify
caName =

```
## Components

The following workloads gets deployed on collectorforkubernetes namespace, by default
* Collectorforkubernetes - Daemonset
* Collectorforkubernetes Master - Daemonset
* Collectorforkubernetes Addon - Deployment

## References

* https://www.outcoldsolutions.com/docs/monitoring-kubernetes/v5/
* https://www.outcoldsolutions.com/docs/monitoring-kubernetes/v5/installation/
