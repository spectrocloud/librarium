---
sidebar_label: "FIPS"
title: "FIPS"
description: "Learn about FIPS compliance in Palette VerteX."
icon: ""
hide_table_of_contents: false
tags: ["vertex", "fips"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX is FIPS 140-3 certified
([#5061](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5061)). This means that
Palette VerteX uses FIPS 140-3 compliant algorithms and encryption methods. With its additional security scanning
capabilities, Palette VerteX is designed to meet the stringent requirements of regulated industries. Palette VerteX
operates on FIPS-compliant Ubuntu Pro versions.

## Non-FIPS Enablement

You can deploy non-FIPS-compliant components in your Palette VerteX environment by enabling non-FIPS settings. Refer to
the [Enable non-FIPS Settings](../system-management/enable-non-fips-settings/enable-non-fips-settings.md) guide for more
information.

Something to note when using RKE2 and K3s:

- When we scan the binaries, which we consume directly from Rancher's RKE2 repository, issues are reported for the
  following components. These components were compiled with a Go compiler that is not FIPS-compliant.

  - `container-suseconnect`
  - `container-suseconnect-zypp`
  - `susecloud`

  Since these components are unrelated to Kubernetes and are instead used to access SUSE’s repositories during the
  Docker build process, RKE2 itself remains fully compliant.

  RKE2 is designated as FIPS-compliant per official Rancher
  [FIPS 140-2 Enablement](https://docs.rke2.io/security/fips_support) security documentation. Therefore, Palette VerteX
  designates RKE2 as FIPS-compliant.

- Although K3s is not available as a FIPS-certified distribution, Palette VerteX supports K3s as a Kubernetes
  distribution for Edge clusters.

Palette VerteX uses icons to show FIPS compliance status. For information about Palette VerteX status icons, review
[FIPS Status Icons](fips-status-icons.md).

## Legal Notice

Spectro Cloud has performed a categorization under FIPS 199 with (client/tenant) for the data types (in accordance with
NIST 800-60 Vol. 2 Revision 1) to be stored, processed, and/or transmitted by the Palette Vertex environment.
(client/tenant) maintains ownership and responsibility for the data and data types to be ingested by the Palette Vertex
SaaS in accordance with the agreed upon Palette Vertex FIPS 199 categorization.

## Resources

- [FIPS Status Icons](fips-status-icons.md)

- [FIPS-Compliant Components](fips-compliant-components.md)

- [RKE2 FIPS 140-2 Enablement](https://docs.rke2.io/security/fips_support)
