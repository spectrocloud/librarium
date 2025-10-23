---
sidebar_label: "Allow Cluster Imports"
title: "Allow Cluster Imports"
description: "Learn how to import clusters to self-hosted Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["self-hosted", "vertex", "non-fips"]
keywords: ["self-hosted", "vertex", "non-fips"]
---

You can allow tenant users to import Kubernetes clusters that were not deployed through Palette, including some that
_are not_ FIPS compliant or are only _partially_ compliant. Prior to enabling cluster import, the **Import Cluster**
option is not available.

Palette VerteX displays icons next to clusters to indicate their FIPS compliance status or when FIPS compliance cannot
be confirmed. To learn about icons that Palette VerteX applies, refer to
[FIPS Status Icons](../../fips.md#fips-status-icons).

## Prerequisites

- You need tenant admin permission to enable this feature.

- Refer to [Cluster Import Prerequisites](../../../../clusters/imported-clusters/cluster-import.md#prerequisites).

## Allow non-FIPS Cluster Import

1. Log in to [Palette VerteX](https://console.spectrocloud.com/) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**. Next, on the **Tenant Settings Menu**, select
   **Platform Settings**.

3. Enable the **Allow non-FIPS cluster import** option. When you enable this option, you are prompted to confirm
   importing clusters into the tenant that may not be FIPS-compliant.

![Diagram showing the Allow non-FIPS cluster import toggle enabled.](/vertex_use-non-fips-settings_nonFips-cluster-import.webp)

To disable the setting, toggle this option off and confirm you want to disable it.

Refer to [Import a Cluster](../../../../clusters/imported-clusters/cluster-import.md) for guidance. Check out
[Import Modes](../../../../clusters/imported-clusters/imported-clusters.md#import-modes) to learn about various import
modes and limitations to be aware of.

## Validate

1. Log in to Palette VerteX.

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on **Add New Cluster**. The **Import Cluster** option is now displayed on the **Create a New Cluster** page.

## Resources

- [Import a Cluster](../../../../clusters/imported-clusters/cluster-import.md)

- [Import Modes](../../../../clusters/imported-clusters/imported-clusters.md#import-modes)

- [Cluster Import Limitations](../../../../clusters/imported-clusters/imported-clusters.md#limitations)
