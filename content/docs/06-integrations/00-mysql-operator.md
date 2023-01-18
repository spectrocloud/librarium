---
title: 'MySQL Kubernetes Operator'
metaTitle: 'MySQL Kubernetes Operator'
metaDescription: 'MySQL Kubernetes Operator Storage pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/palette-upgrader/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# MySQL Kubernetes Operator Overview

MySQL Operator enables MySQL on Kubernetes. It manages all the necessary resources to deploy and manage a highly available MySQL cluster. MySQL provides scheduled and on demand out-of-the-box backups and point-in-time recovery  while keeping the cluster highly available.

MySQL Operator is maintained and developed by Bitpoke, a self managed WordPress hosting app running cloud-native.

# Prerequisites

- Access to a Kubernetes cluster and to have installed kubectl and helm
- A local ``kubectl`` installation configured to create and access resources on the target Kubernetes deployment.
- The Helm tool for managing Charts.

# Version Supported

MySQL Operator **0.6.2**.


# Notable Parameters

| Parameter             | Description                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------|
| image.repository     | The repository that is the source of truth. |
| image.tag             | The image tag to pull.                     |
| image.pullPolicy | If defined, an imagePullPolicy applied to all MySQL deployments. Defaults to ` IfNotPresent`                              |
| securityContext | A list of security contexts for the MySQL Operator container.
|imagePullSecrets| If defined, uses a Secret to pull an image from a private Docker repository.

# References

[MySQL Operator](https://dev.mysql.com/doc/mysql-operator/en/)
[Bitspoke](https://www.bitpoke.io/docs/mysql-operator/getting-started/)
