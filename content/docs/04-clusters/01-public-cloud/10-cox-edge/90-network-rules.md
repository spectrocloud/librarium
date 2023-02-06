---
title: "Network Rules"
metaTitle: "Required Network Rules"
metaDescription: "Cox Edge deployments require the following network rules for a successful Palette deployment."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

To successfully deploy a host cluster to Cox Edge with Palette, you must add the following network rules to each deployment.


| Port | Protocol | Source    | Description                                                               |
|------|----------|-----------|---------------------------------------------------------------------------|
| 22   | TCP      | 0.0.0.0/0 | To support the secure shell (SSH) protocol.                               |
| 179  | TCP      | 0.0.0.0/0 | Required for the Border Gateway Protocol (BGP).                           |
| 6443 | TCP      | 0.0.0.0/0 | Required for Palette to communicate with cluster's Kubernetes API server. |
| 4789 | UDP      | 0.0.0.0/0 | Required for Calico networking with VXLAN.                                |