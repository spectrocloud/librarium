---
title: "FIPS-status Icons"
metaTitle: "FIPS-Status Icons"
metaDescription: "TBD."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Although Palette VerteX brings FIPS 140-2 cryptographic modules to the Palette management platform and deployed clusters, it provides the capability to consume features that are not FIPS-compliant. For example, when the **Allow non-FIPS cluster import** option is enabled, it allows users to import any type of Kubernetes cluster, including some that are not FIPS-compliant. 
Similarly, when the  **Allow non-FIPS add-on packs** option is enabled, users can add add-on packs in cluster profiles that are not FIPS-compliant.

To avoid confusion and compliance issues, Palette VerteX displays icons to indicate the FIPS compliance status of clusters and profile layers. 

The icons shown below indicate FIPS compliance status.

| Icon | Description | 
|---------------|------------|
| ![Full FIPS compliance](/vertex_fips-status-icons_compliant.png) | Full FIPS compliance. All packs in the cluster are FIPS-compliant. | 
| ![Partial FIPS compliance](/vertex_fips-status-icons_partial.png) | Partial FIPS compliance. Some packs are FIPS-compliant, but there is at least one that is not.|  
| ![Not FIPS-compliant](/vertex_fips-status-icons_not-compliant.png) | Not FIPS-compliant. None of the packs in the cluster are FIPS compliant.| 
|![Unknown FIPS state](/vertex_fips-status-icons_unknown.png) | Unknown state of FIPS compliance. This applies to imported clusters that were not deployed by Palette. |

Icons are displayed next to packs in the cluster profile and on the Clusters page and on the Cluster Details page to indicate when a cluster has been deployed from VerteX or imported. 

<<<< SCREENSHOT PLACEHOLDER >>>>
<br />

<br />