---
title: "FIPS Status Icons"
metaTitle: "FIPS Status Icons"
metaDescription: "Learn how icons can help you identify FIPS compliance when you consume features that are not FIPS compliant."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

While Palette VerteX brings FIPS 140-2 cryptographic modules to the Palette management platform and deployed clusters, it also provides the capability to consume features that are not FIPS compliant. For example, when the cluster import option is enabled, it allows users to import any type of Kubernetes cluster, including some that are not fully FIPS compliant. 
Similarly, when the option to add non-FIPS add-on packs is enabled, users can add packs in cluster profiles that are not FIPS compliant. For more information about these tenant-level settings, refer to [Enable non-FIPS Settings](/vertex/system-management/enable-non-fips-settings).

To avoid confusion and compliance issues, Palette VerteX displays icons to indicate the FIPS compliance status of clusters and profile layers. 

The icons shown below are used to indicate FIPS compliance status.

| **Icon** | **Description** | 
|---------------|------------|
| ![Full FIPS compliance](/vertex_fips-status-icons_compliant.png) | Full FIPS compliance. All packs in the cluster are FIPS compliant. | 
| ![Partial FIPS compliance](/vertex_fips-status-icons_partial.png) | Partial FIPS compliance. Some packs are FIPS compliant, but there is at least one that is not.|  
| ![Not FIPS-compliant](/vertex_fips-status-icons_not-compliant.png) | Not FIPS compliant. None of the packs in the cluster are FIPS-compliant.| 
|![Unknown FIPS state](/vertex_fips-status-icons_unknown.png) | Unknown state of FIPS compliance. This applies to imported clusters that were not deployed by Palette. |

As shown in the screenshots below, FIPS status icons are displayed next to packs throughout Palette VerteX. 
 
<!-- For example, in the wizard used to build a profile, in the cluster profile stack, on the **Profiles** page, the **Clusters Overview** page.  -->

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.png)

<br />

![Diagram showing FIPS status icons on profile page.](/vertex_fips-status-icons_icons-on-profile-page.png)

<br />

![Diagram showing FIPS status icons on Cluster Overview page.](/vertex_fips-status-icons_icons-in-cluster-overview.png)

<br />

<br />