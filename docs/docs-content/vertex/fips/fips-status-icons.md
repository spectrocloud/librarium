---
sidebar_label: "FIPS Status Icons"
title: "FIPS Status Icons"
description:
  "Learn how icons can help you identify FIPS compliance when you consume features that are not FIPS compliant."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["vertex", "fips"]
keywords: ["self-hosted", "vertex"]
---

While Palette VerteX brings FIPS 140-3 cryptographic modules to the Palette management platform and deployed clusters,
it also provides the capability to consume features that are not FIPS compliant. For example, when the cluster import
option is enabled, it allows users to import any type of Kubernetes cluster, including some that are not fully FIPS
compliant. Similarly, when the option to add non-FIPS add-on packs is enabled, users can add packs in cluster profiles
that are not FIPS compliant. For more information about these tenant-level settings, refer to
[Enable non-FIPS Settings](../system-management/enable-non-fips-settings/enable-non-fips-settings.md).

To avoid confusion and compliance issues, Palette VerteX displays icons to indicate the FIPS compliance status of
clusters, profiles, and packs.

The table lists icons used to indicate FIPS compliance status. The partial FIPS compliance icon applies only to clusters
and profiles because these may contain packs with an _Unknown_ or _Not FIPS-compliant_ status.

| **Icon**                                                            | **Description**                                                                                        | **Applies to Clusters** | **Applies to Profiles** | **Applies to Packs** |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- | ----------------------- | -------------------- |
| ![Full FIPS compliance](/vertex_fips-status-icons_compliant.webp)   | Full FIPS compliance. All packs in the cluster are FIPS-compliant.                                     | ✅                      | ✅                      | ✅                   |
| ![Partial FIPS compliance](/vertex_fips-status-icons_partial.webp)  | Partial FIPS compliance. Some packs are FIPS compliant, but there is at least one that is not.         | ✅                      | ✅                      | ❌                   |
| ![Not FIPS-compliant](/vertex_fips-status-icons_not-compliant.webp) | Not FIPS-compliant. None of the packs in the cluster are FIPS-compliant.                               | ✅                      | ✅                      | ✅                   |
| ![Unknown FIPS state](/vertex_fips-status-icons_unknown.webp)       | Unknown state of FIPS compliance. This applies to imported clusters that were not deployed by Palette. | ✅                      | ✅                      | ✅                   |

<!-- As shown in the screenshots below, FIPS status icons are displayed next to packs throughout Palette VerteX.  -->

The screenshots below show how Palette VerteX applies FIPS status icons.

:::tip

When creating a cluster profile, you can filter packs by checking the **FIPS Compliant** checkbox to display only
FIPS-compliant packs.

:::

When you create a profile, icons display next to packs.

![Diagram showing FIPS status icons on profile page.](/vertex_fips-status-icons_icons-on-profile-page.webp)

Icons appear next to each profile layer to indicate FIPS compliance.

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.webp)

In this screenshot, Palette VerteX shows FIPS status for the cluster is partially compliant because one pack in the
profile is not FIPS-compliant.

![Diagram showing FIPS status icons on Cluster Overview page.](/vertex_fips-status-icons_icons-in-cluster-overview.webp)
