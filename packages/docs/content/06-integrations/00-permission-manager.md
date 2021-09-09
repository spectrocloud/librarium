---
title: 'Permission Manager'
metaTitle: 'Permission Manager'
metaDescription: 'Permission Manager Authentication pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['authentication']
logoUrl: 'https://registry.spectrocloud.com/v1/permission-manager/blobs/sha256:15d08b02d78823c12616b72d1b5adb0520940016b89bae1f758e6f1a105597ff?type=image/png'
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";


# Permission Manager

This integration provides a graphical user interface for RBAC management in Kubernetes. You can create users, assign namespaces/permissions, and distribute Kubeconfig YAML files quickly.


## Versions Supported

<Tabs>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

* **1.0.0** 

</Tabs.TabPane>
</Tabs>

## Configuration

| Name | Supported Value | Description |
| --- | --- | --- |
| namespace| Any valid namespace string | The namespace under which this integration should be deployed onto|
| authPassword | | Login password for the web interface |

## Customizing the permission templates

Create a ClusterRole starting with `template-namespaced-resources___` or `template-cluster-resources___` and apply it to the cluster. Permission manager will honor any custom resources with this naming convention and will populate on the user interface.

# Ingress

Follow below steps to configure Ingress on Permission Manager

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #10)
2. Ingress (line #13)
   * Enable Ingress; Change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts, etc.

With these config changes, you can access Permission manager service on the Ingress Controller LoadBalancer hostname / IP

## References

<https://github.com/sighupio/permission-manager>
