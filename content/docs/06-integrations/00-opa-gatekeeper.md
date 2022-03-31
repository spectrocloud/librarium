---
title: 'OpenPolicyAgent'
metaTitle: 'OpenPolicyAgent'
metaDescription: 'OpenPolicyAgent security pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['security']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/open-policy-agent/blobs/sha256:fcbad202dc9ca5e7a756562d8f9fc180ee77474034447dabc302d8a5a2bbe148?type=image/png" alt="OpenPolicyAgent logo'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# OpenPolicyAgent

Palette users can leverage OpenPolicyAgent Gatekeeper to strengthen the security administration of Kubernetes environment. The major motivation behind the deployment is admission customization via configurations with out code. Gatekeeper provides an admission control system based on policies or rules implemented through parameterized and admin configurable constraints. Palette supports **Gatekeeper v3.0**. 

The major features of OpenPolicyAgent are:

* Validating Admission Control
* Policies and Constraints
  * Sample Policies:
    * All namespaces must have a label that lists a point-of-contact.
    * All pods must have an upper bound for resource usage.
    * All images must be from an approved repository.
    * Services must all have globally unique selectors.
  * Constraint Properties
    * AND-ed together
    * Schema validation 
    * Selection semantics
* Audit: The periodical evaluation of resources against constraints.
* Data Replication: Constraints to be compared against other objects in the cluster.

## Versions Supported

<Tabs>

<Tabs.TabPane tab="3.7.x" key="3.7.x">

**3.7.0**

</Tabs.TabPane>

<Tabs.TabPane tab="3.6.x" key="3.6.x">

**3.6.0**

</Tabs.TabPane>

<Tabs.TabPane tab="3.5.x" key="3.5.x">

**3.5.1**

</Tabs.TabPane>

</Tabs>

## References

https://kubernetes.io/blog/2019/08/06/opa-gatekeeper-policy-and-governance-for-kubernetes/