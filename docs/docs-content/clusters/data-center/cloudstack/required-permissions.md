---
sidebar_label: "Required Permissions"
title: "Required Permissions"
description:
  "The permissions required to configure Apache CloudStack to allow Palette to deploy clusters in Apache CloudStack."
hide_table_of_contents: false
sidebar_position: 60
tags: ["data center", "cloudstack", "permissions"]
---

When Palette creates and manages clusters in an Apache CloudStack environment, it requires certain permissions to
perform actions such as creating, modifying, and deleting resources needed for cluster deployment and management. These
permissions allow Palette to interact with the CloudStack API and manage the lifecycle of the clusters effectively. They
are also needed to deploy the [Palette Cloud Gateway (PCG)](../../pcg/deploy-pcg/cloudstack.md) for your CloudStack
environment.

## Dynamic Permissions

When Palette is configured to deploy Kubernetes clusters using dynamic networking, it creates and manages the necessary
CloudStack network resources for you. With these permissions, Palette can create an isolated network and the associated
cluster resources such as:

- Virtual machines
- Firewall rules
- Load balancer rules
- Public IP associations

These permissions must be granted to the CloudStack user account that is used to deploy the
[PCG](../../pcg/deploy-pcg/cloudstack.md) and workload clusters. This is typically a non-admin user account that has
been assigned a custom role with the following permissions.

<PartialsComponent category="permissions" name="cloudstack-dynamic-permissions" />

## Static Permissions

When Palette is configured to deploy Kubernetes clusters using static networking, it does not create or manage
CloudStack networks on your behalf. Instead, you provide the existing VPC, isolated network, or shared network that the
cluster should use. In this model, Palette needs permissions to create the associated cluster resources, such as:

- Virtual machines
- Public IP associations
- Load balancer rules

These permissions must be granted to the CloudStack user account that is used to deploy the
[PCG](../../pcg/deploy-pcg/cloudstack.md) and workload clusters. This is typically a non-admin user account that has
been assigned a custom role with the following permissions.

<PartialsComponent category="permissions" name="cloudstack-static-permissions" />
