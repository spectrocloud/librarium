---
sidebar_label: "Resource Usage Calculation"
title: "How Palette Calculates Your Resource Usage"
description: "Learn what kCh is and how Palette measures your resource usage."
hide_table_of_contents: false
sidebar_position: 30
tags: ["usage", "kCh"]
---

Palette and Palette VerteX measure the usage of clusters deployed to different cloud, data center, and edge
infrastructures. We measure usage in Kilo-Core-Hours (kCh).

This page explains what kCh is, how Palette calculates your resource usage, and where you can find the current usage
metrics.

## What is kCh?

kCh, short for kilo-core-hours, represents a unit of computational time. This value is a product of the cluster node
count, the number of CPUs per node, and the duration of time these nodes are in use. To improve readability, we divide
the product by 1000.

For instance, if you continuously deploy a single-node cluster with 16 CPU for 24 hours, you will use about 0.39 kCh.
Alternatively, if you continuously deploy a three-node cluster that has 16 CPU per node for 24 hours, you will use about
1.2 kCh.

![A diagram that offers a visual representation of how Palette calculates resource usage in kCh.](/introduction_resource-usage-estimation_diagram-kCh-calculation.webp)

## Your Current Usage

Palette and Palette VerteX display your current resource usage on the **Project Overview** page. Because we do not
charge infrastructure costs for Edge and MAAS clusters, the resource usage calculated by Palette and Palette VerteX
excludes resources used by your Edge or MAAS clusters. By default, Palette offers 25 kCh per month, but you can always
request on-demand compute capacity by clicking **Upgrade now** in the bottom-left corner of Palette.

:::warning

To continue deploying clusters, you must stay within the resource usage limit in your Palette or Palette VerteX
instance.

:::

![Palette interface with the kCh meter highlighted.](/introduction_resourse-usage-estimation_kCh-in-ui.webp)

If you have the tenant admin role, you may also view the resource usage by each of your project in the **Tenant
Overview** page. Resource usage by different projects are displayed on the bar chart by different colors. This usage
also does not include Edge or MAAS clusters. For more information about roles and permissions in Palette, refer to
[User & Role Management](../user-management/user-management.md).

![Palette interface of Tenant Overview page with the resource usage chart highlighted.](/introduction_resource-usage_tenant-admin.webp)

:::warning

The exclusion of Edge and MAAS clusters in kCh calculations was implemented in the Palette release 4.5.c and did not
revise historical data. Therefore, it is normal to notice a drop in your resource usage after Jan 18th, 2025 for Palette
SaaS if you have Edge or MAAS workloads in your project. If you are using a self-hosted instance, you may also notice a
drop in project monthly kCh after you upgrade to release 4.5.c or later.

Even though your resource usage in the past may have included Edge and MAAS clusters, we have never charged and will not
charge you for kCh usage by Edge and MAAS clusters since you provide the infrastructure for those clusters yourself.

:::

If you'd like to discuss other compute capacities, contact us at
[support@spectrocloud.com](mailto:support@spectrocloud.com).
