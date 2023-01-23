---
title: 'Argo CD'
metaTitle: 'Argo CD'
metaDescription: 'Argo CD for Spectro Cloud Palette'
hiddenFromNav: true
type: "integration"
category: ['system app']
logoUrl: 'https://registry.spectrocloud.com/v1/argo-cd/blobs/sha256:647cd3df6fec421e6580589ea7229762d8e828c77036f835f14f4c15c2a44c4c?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

[Argo CD](https://argo-cd.readthedocs.io/en/stable/) is a declarative, GitOps continuous delivery tool for Kubernetes. Argo CD follows the GitOps pattern of using Git repositories as the source of truth for defining the desired application state. Argo CD automates the deployment of the desired application states in the specified target environments. Application deployments can track updates to branches, tags, or pinned to a specific version of manifests at a Git commit. Start using Argo CD with Palette today by consuming this pack.


# Prerequisites

- Kubernetes 1.7+

# Version Supported

<Tabs>
<Tabs.TabPane tab="3.3.x" key="3.3.x">

* **3.3.5**



</Tabs.TabPane>

<Tabs.TabPane tab="3.2.x" key="3.2.x">

* **3.2.6**

</Tabs.TabPane>
</Tabs>


# Notable Parameters

| Parameter             | Description                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------|
| global.image.repository     | The repository that is the source of truth. |
| global.image.tag             | The image tag to pull.                     |
| global.image.imagePullPolicy | If defined, a imagePullPolicy applied to all ArgoCD deployments. Defaults to ` IfNotPresent`                              |
| global.securityContext | A list of security contexts
|imagePullSecrets| If defined, uses a Secret to pull an image from a private Docker registry or repository.
|hostAliases| A list of mapping between IP and hostnames that will be injected as entries in the pod's hosts files



# References

[Argo CD](https://argo-cd.readthedocs.io/en/stable/)
