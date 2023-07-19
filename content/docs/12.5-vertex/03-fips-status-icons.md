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

Although Palette VerteX is FIPS-compliant, it provides the capability to use some features that are not FIPS-compliant. For example, when the **Allow non-FIPS cluster import** option is enabled, it allows users to import any type of Kubernetes cluster, including some that are not FIPS-compliant. 
Similarly, when **Allow non-FIPS add-on packs** is enabled, users can add add-on packs in cluster profiles that are not FIPS-compliant.

To avoid confusion and compliance issues, Palette VerteX displays icons to indicate the FIPS compliance status of clusters and profile layers. 

The icons shown below indicate FIPS compliance status.

| Icon | Description | 
|---------------|------------|
| ![Full FIPS compliance](/vertex_fips-status-icons_compliant.png) | Full FIPS compliance. All packs in the cluster are FIPS-compliant. | 
| ![Partial FIPS compliance](vertex_fips-status-icons_partial.png)        | Partial FIPS compliance. Some packs are FIPS-compliant, but there is at least one that is not.|  
|         | Not FIPS-compliant. None of the packs in the cluster are FIPS compliant.| 
|         | Unknown state of FIPS compliance. This applies to imported clusters that were not deployed by Palette. |

![Full FIPS compliance](vertex_fips-status-icons_compliant.png)    Full FIPS compliance. All packs in the cluster are FIPS-compliant. 




<br />

<br />

<br />

<br />


Icons are displayed on the Clusters page and on the Cluster Details page to indicate when a cluster has been deployed from VerteX or imported from Palette. 



For example, you can add non-FIPS-compliant add-on packs in cluster profiles and import Kubernetes clusters. uses icons to indicate FIPS compliance status.

use FIPS-compliant and profiles that that are not FIPS-compliant. 

<br />

<br />