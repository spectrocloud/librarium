---
title: "Task: Resize a VMware cloud gateway"
metaTitle: "Task: Resize a VMware cloud gateway"
metaDescription: "The method of resizing a cloud gateway on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Resizing a cloud gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster.  For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially setup with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.

* Invoke the resize action for the relevant cloud gateway instance.

* Update the size from 1 to 3.

* The gateway upgrade begins shortly after the update. Two new nodes are created on vSphere and the gateway is upgraded to a 3-node cluster.

> Scaling a 3-node cluster down to a 1-node cluster is not permitted.

> A load balancer instance is launched even for a 1-node gateway to support future expansion.
