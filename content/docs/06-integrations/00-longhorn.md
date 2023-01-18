---
title: 'Longhorn'
metaTitle: 'Longhorn Integration with Palette'
metaDescription: 'Longhorn pack in Palette'
hiddenFromNav: true
type: "integration"
category: ["storage"]
logoUrl: 'https://registry.spectrocloud.com/v1/csi-longhorn/blobs/sha256:8257bd6697941139cea8ace907e25b3859cb8de48f965a5b6011d518cad0a2db?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Longhorn Overview

Longhorn is a lightweight distributed block storage system for cloud native storage Kubernetes that allows you to replicate storage to Kubernetes clusters. Once Longhorn is installed, it adds persistent volume support to the Kubernetes cluster using containers and microservices.

Longhorn creates a dedicated storage controller for each block device volume and replicates the volume across multiple nodes.

# Prerequisites

- Kubernetes cluster is at least version 1.22 and not higher than 1.24.

# Version Supported

Longhorn version **1.3.1**.

# Notable Features

- Enterprise-grade distributed storage with no single point of failure.
- Incremental snapshots of block storage.
- Backup to secondary storage (NFSv4 or S3-compatible object storage) built on change block detection
- Recurring snapshot and backup


# References

[Longhorn](https://longhorn.io/)
