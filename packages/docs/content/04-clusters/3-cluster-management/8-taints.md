---
title: "Node Taint"
metaTitle: "Taint the nodes cluster workloads"
metaDescription: "Apply taints on node pools for appropriate node to pod scheduling."
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';


# Overview
Palette enables Taints to be applied to a node pool to restrict a set of intolerant pods getting scheduled to a node. Once the Taint is applied, pods that can tolerate the tainted nodes will only be scheduled to that particular node. Thus, it makes sure that a pod is not scheduled to an inappropriate node.
## How to apply Taint to your node pool
A Taint can be applied to a node pool while creating the cluster. While configuring the nodes pools during cluster creation:
* Enable the “Taint” select button.
* To apply the Taint, set the following parameters:
	* Key: Custom key for the Taint
	* Value: Custom value for the Taint key
	* Effect: The effects define what will happen to the pods that do not tolerate a Taint. There are 3 Taint effects:
		* NoSchedule : A pod that cannot tolerate the node Taint, should not be scheduled to the node.
		* PreferNoSchedule: The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed. 
		* NoExecute: New pods will not be scheduled on the node, and existing pods on the node if any on the node will be evicted if they do not tolerate the Taint. 

Eg: Key = key1;
 	Value = value1;
	Effect = NoSchedule
<InfoBox>
Palette allows its users to apply/edit the Taints for a running cluster through the “Edit node pool” option under Nodes tab.
</InfoBox>
	
