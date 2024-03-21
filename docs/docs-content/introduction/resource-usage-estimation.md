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

For instance, if you deploy a single-node cluster with 16 CPU cores for 24 hours, you will use about 0.39 kCh.
Alternatively, if you deploy a three-node cluster that has 16 CPUs per node for 24 hours, you will use about 1.2 kCh.

![A diagram that offers a visual representation of how Palette calculates resource usage in kCh.](/introduction_resource-usage-estimation_diagram-kCh-calculation.png)

## Your Current Usage

Palette and Palette Vertex display your current resource usage on the **Project Overview** page.

![Palette interface with the kCh meter highlighted.](/introduction_resourse-usage-estimation_kCh-in-ui.png)

:::warning

You must stay within the resource usage limit in your Palette or Palette VerteX instance to be able to deploy more
clusters.

:::
