---
title: "FIPS"
metaTitle: "FIPS"
metaDescription: "Learn about FIPS compliance in Palette VerteX."
icon: ""
hideToC: false
fullWidth: false
---

# Overview

Palette VerteX is FIPS 140-2 compliant. This means that Palette VerteX uses FIPS 140-2 compliant algorithms and encryption methods. With its additional security scanning capabilities, Palette VerteX is designed to meet the stringent requirements of regulated industries. Palette VerteX operates on FIPS-compliant Ubuntu Pro versions.


## Non-FIPS Enablement

You can deploy non-FIPS-compliant components in your Palette VerteX environment by enabling non-FIPS settings. Refer to the [Enable non-FIPS Settings](/vertex/system-management/enable-non-fips-settings) documentation for more information.

<!-- Palette VerteX consumes certain images with components that are not compiled using FIPS, and it supports a non-FIPS-certified K3s distribution as follows: -->

Something to note when using RKE2 and K3s:

<br />

- Palette VerteX uses compiled images directly from Rancher's RKE2 repository. Some internal RKE2 components may not be FIPS-compliant. Palette displays RKE2 as a FIPS-compliant layer. 


- Although K3s is not available as a FIPS-certified distribution, Palette VerteX supports K3s as a Kubernetes distribution for Edge clusters.

Palette VerteX uses icons to show FIPS compliance status. For information about Palette VerteX status icons, review [FIPS Status Icons](/vertex/fips/fips-status-icons).


## Legal Notice

Spectro Cloud has performed a categorization under FIPS 199 with (client/tenant) for the data types (in accordance with NIST 800-60 Vol. 2 Revision 1) to be stored, processed, and/or transmitted by the Palette Vertex environment. (client/tenant) maintains ownership and responsibility for the data and data types to be ingested by the Palette Vertex SaaS in accordance with the agreed upon Palette Vertex FIPS 199 categorization.


## Resources

- [FIPS Status Icons](/vertex/fips/fips-status-icons)


- [FIPS-Compliant Components](/vertex/fips/fips-compliant-components) 