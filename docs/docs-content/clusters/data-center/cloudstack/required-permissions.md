---
sidebar_label: "Required Permissions"
title: "Required Permissions"
description:
  "The permissions required to configure Apache CloudStack to allow Palette to deploy clusters in Apache CloudStack."
hide_table_of_contents: false
sidebar_position: 60
tags: ["data center", "cloudstack", "permissions"]
---

:::preview

This is a Tech Preview feature and is subject to change. Do not use this feature in production workloads. This feature
is supported in self-hosted Palette only.

:::

When Palette creates and manages clusters in an Apache CloudStack environment, it requires certain permissions to
perform actions such as creating, modifying, and deleting resources needed for cluster deployment and management.

These permissions allow Palette to interact with the CloudStack API and manage the lifecycle of the clusters
effectively. They are also needed to deploy the [Palette Cloud Gateway (PCG)](../../pcg/deploy-pcg/cloudstack.md) for
your CloudStack environment.

## Dynamic Permissions

When Palette is configured to deploy Kubernetes clusters using dynamic networking, it automatically provisions and
manages the required CloudStack resources on your behalf. With these permissions, Palette can create and operate
isolated networks and the associated cluster infrastructure, including:

- Virtual machines and instance lifecycle operations
- Network resources such as isolated networks, IP addresses, and firewall rules
- Load balancer configuration and traffic routing
- Affinity groups, tags, and other supporting CloudStack objects
- Retrieval of metadata, templates, service offerings, and other information required during deployment

These permissions must be granted to the CloudStack user account that is used to deploy the
[PCG](../../pcg/deploy-pcg/cloudstack.md) and workload clusters. This is typically a non-admin user account that has
been assigned a custom role with the following permissions.

<PartialsComponent category="permissions" name="cloudstack-dynamic-permissions" />

## Static Permissions

When Palette is configured to deploy Kubernetes clusters using static networking, it does not create or manage
CloudStack networks on your behalf. Instead, you supply the existing VPC, isolated network, or shared network that the
cluster will use. In this model, Palette requires permissions to provision and manage the cluster’s compute and
supporting CloudStack resources, including:

- Virtual machines and instance lifecycle operations
- Public IP associations and related network operations
- Load balancer and firewall rule configuration
- Affinity groups, tags, and other supporting CloudStack objects
- Access to templates, offerings, and account-level metadata needed during deployment

These permissions must be granted to the CloudStack user account that is used to deploy the
[PCG](../../pcg/deploy-pcg/cloudstack.md) and workload clusters. This is typically a non-admin user account that has
been assigned a custom role with the following permissions.

<PartialsComponent category="permissions" name="cloudstack-static-permissions" />
