---
sidebar_label: "Resource Usage Calculation"
title: "How Palette Calculates Your Resource Usage"
description: "Learn what kCh is and how Palette measures your resource usage."
hide_table_of_contents: false
sidebar_position: 20
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

Palette and Palette Vertex display your current resource usage on the **Project Overview** page. By default, Palette
offers 25 kCh per month, but you can always request on-demand compute capacity by clicking **Upgrade now** in the
bottom-left corner of Palette.

![Palette interface with the kCh meter highlighted.](/introduction_resourse-usage-estimation_kCh-in-ui.webp)

:::warning

To continue deploying clusters, you must stay within the resource usage limit in your Palette or Palette VerteX
instance.

:::

If you'd like to discuss other compute capacities, contact us at
[support@spectrocloud.com](mailto:support@spectrocloud.com).
