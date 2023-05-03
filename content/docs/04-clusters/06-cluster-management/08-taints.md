---
title: "Node Labels and Taints"
metaTitle: "Label and Taint the nodes"
metaDescription: "Apply taints on node pools for appropriate node to pod scheduling."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview on Taints

Node affinity is a property of Pods that attracts them to a set of nodes (either as a preference or a hard requirement. Taints are the opposite -- they allow a node to repel a set of pods.

Tolerations are applied to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.

Taints and tolerations work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node; this marks that the node should not accept any pods that do not tolerate the taints.

Palette enables Taints to be applied to a node pool to restrict a set of intolerant pods getting scheduled to a Palette node pool. Taints can be applied during initial provisioning of the cluster and modified later.

## Apply Taints to nodes

Taints can be applied to worker pools while creation of a new cluster from the node pool configuration page as follows:

* Enable the “Taint” select button.
* To apply the Taint, set the following parameters:
  * Key: Custom key for the Taint
  * Value: Custom value for the Taint key
  * Effect: The effects define what will happen to the pods that do not tolerate a Taint. There are 3 Taint effects:
    * NoSchedule: A pod that cannot tolerate the node Taint, should not be scheduled to the node.
    * PreferNoSchedule: The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.
    * NoExecute: New pods will not be scheduled on the node, and existing pods on the node, if any will be evicted if they do not tolerate the Taint.

Eg: Key = key1;
  Value = value1;
 Effect = NoSchedule

Taints can also be updated on a running cluster by editing a worker node pool from the 'Nodes' tab of the cluster details page.

# Overview on Labels

You can constrain a Pod to only run on a particular set of Node(s). There are several ways to do this and the recommended approaches such as, nodeSelector, node affinity, etc all use label selectors to facilitate the selection. Generally, such constraints are unnecessary, as the scheduler will automatically do a reasonable placement (e.g. spread your pods across nodes so as not place the pod on a node with insufficient free resources, etc.) but there are some circumstances where you may want to control which node the pod deploys to - for example to ensure that a pod ends up on a machine with an SSD attached to it, or to co-locate pods from two different services that communicate a lot into the same availability zone.

Palette enables our users to Label the nodes of a master and worker pool by using key/value pairs. These labels do not directly imply anything to the semantics of the core system but are intended to be used by users to drive use cases where pod affinity to specific nodes is desired. Labels can be attached to node pools in a cluster during creation and can be subsequently added and modified at any time. Each node pool can have a set of key/value labels defined. The key must be unique across all node pools for a given cluster.

## Apply Labels to nodes

Labels are specified in an optional field called 'Additional Labels' in the node pool configuration form. The values are specified as 'key:value'. Multiple such labels may be specified. Labels may be specified from the node pool conifguration form initially during cluster provisioning and updated any time by editing a node pool from the 'Nodes' tab of the cluster details page.
