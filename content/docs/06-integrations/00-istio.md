---
title: 'Istio'
metaTitle: 'Istio Service Mesh in Spectro Cloud'
metaDescription: 'Choosing Istio as a Service Mesh app within the Spectro Cloud console'
hiddenFromNav: true
isIntegration: true
category: ['service mesh']
logoUrl: 'https://registry.spectrocloud.com/v1/istio/blobs/sha256:c80cf596d4859261ab892e987f835bd11161bd139dd8e4147b652c6b93924cb2?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Istio Operator

This Integration aims to automate and simplify the rollout of the various Istio components which helps with service mesh use cases.

## Versions Supported

<Tabs>
<Tabs.TabPane tab="1.6.x" key="1.6.x">

* **1.6.2** 

</Tabs.TabPane>
</Tabs>

## Contents

The integration deploys the Istio Operator with the 'demo' profile which deploys the following components:

* Istiod
* Istio Ingress Gateway
* Istio Egress Gateway
* Grafana
* Prometheus
* Istio Tracing
* Kiali

For more information on the profiles, view the [official document](https://istio.io/latest/docs/setup/additional-setup/config-profiles/).

## References

https://istio.io/<br />
https://github.com/istio/operator
