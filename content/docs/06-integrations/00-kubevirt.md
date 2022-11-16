---
title: 'KubeVirt'
metaTitle: 'KubeVirt'
metaDescription: 'Choosing KubeVirt within the Palette console'
hiddenFromNav: true
isIntegration: true
category: ['system app']
logoUrl: 'https://registry.spectrocloud.com/v1/kubevirt/blobs/sha256:185e7a7658c05ab478f2822b080a7e21da9113b4a8bf5fb7fb3338d9a5796eed?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

KubeVirt is a virtual machine management add-on for Kubernetes clusters. Create predefine virtual machines using KubeVirt, and Palette will provision KubeVirt as an Add-on Pack to manage the VM resources within the orchestrator.

<br />

## Version Supported

<Tabs>
<Tabs.TabPane tab="0.51.x" key="0.51.x">

**0.51.0**

</Tabs.TabPane>
<Tabs.TabPane tab="0.55.x" key="0.55.x">

**0.55.0**

</Tabs.TabPane>
</Tabs>

<br />
<br />

## Notable Parameters

```yaml
manifests:
  KubeVirt-operator:
    # Enable Emulation (when no nested virtualization enabled)
    useEmulation: true
  KubeVirt-cr:
    contents: |
    apiVersion: KubeVirt.io/v1
      kind: KubeVirt
      metadata:
        name: KubeVirt
        namespace: KubeVirt
      spec:
        certificateRotateStrategy: {}
        configuration:
          developerConfiguration:
            featureGates: []
        customizeComponents: {}
        imagePullPolicy: IfNotPresent
        workloadUpdateStrategy: {}
```

## References

[Installing KubeVirt on Kubernetes](https://KubeVirt.io/user-guide/operations/installation/#installing-KubeVirt-on-kubernetes)

[Github KubeVirt](https://github.com/KubeVirt/KubeVirt/releases/tag/v0.51.0)

