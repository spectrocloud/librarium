---
title: "Canonical Micro Kubernetes"
metaTitle: "Canonical Micro Kubernetes"
metaDescription: "Canonical Micro Kubernetes pack in Spectro Cloud"
hiddenFromNav: true
isIntegration: true
category: ["kubernetes"]
logoUrl: "https://registry.dev.spectrocloud.com/v1/kubernetes-microk8s/blobs/sha256:b971b64f62e2e67b0a166316f96e6f4211aacea6e28459bb89275e8882ade985?type=image/png"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Canonical Micro Kubernetes


Micro Kubernetes is a scalable Kubernetes distribution that provides core Kubernetes functionalities with optimal resource consumption. 

With limited resource requirements, Micro Kubernetes extends its support with the following:

* Turns Kubernetes into a lightweight development tool.


* Makes Kubernetes available for use in minimal environments such as GitHub Continuous Integration (CI).


* Adapts Kubernetes for small-appliance internet of things (IoT) applications.

# Prerequisites

* An Ubuntu Operating System


* 20GB Storage


* 4G Memory


* [AmazonEBSCSIDriverPolicy](/clusters/public-cloud/eks#globalroleadditionalpolicies:) to be added to the AWS Cloud Account



# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.23.x" key="1.23.x">

* ** 1.23.4**

</Tabs.TabPane>

</Tabs>

# Quick Workflow

1. [Create an AWS Cloud Account](/clusters/public-cloud/eks#creatinganawscloudaccount) in the Palette Console.

2. [Create an Infrastructure or Add-on Cluster Profile](/cluster-profiles/task-define-profile) for AWS cloud.

3. Add Micro Kubernetes as the Kubernetes distribution for the `Infrastructure Layer`.

4. Launch Palette [AWS Cluster](/clusters/public-cloud/aws#deployinganawscluster).

5. Wait for provisioning to complete.

<InfoBox>
Currently Palette supports Micro Kubernetes for AWS clusters only.
</InfoBox>

## References

- [Micro k8s](https://microk8s.io/)


- [Canonical Micro k8s](https://github.com/canonical/microk8s)
