---
sidebar_label: "Non-FIPS Settings"
title: "Non-FIPS Settings"
description:
  "Enable settings in Palette VerteX that allow you to use non-FIPS resources and perform non-FIPS compliant actions."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["vertex", "non-fips"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX is FIPS-enforced by default, incorporating the Spectro Cloud Cryptographic Module into the Kubernetes
Management Platform and the infrastructure components of target clusters. To learn more about our cryptographic library,
check out [FIPS 140-3 Certification](../../../legal-licenses/compliance.md#fips-140-3).

If desired, you can allow the consumption of certain non-FIPS functionality in Palette VerteX at the tenant level.
**Platform Settings** at the tenant level provide toggles to allow non-FIPS-compliant packs and non-FIPS features such
as scans, backup, and restore. You can also allow importing clusters created external to Palette.

## Resources

- [Use non-FIPS Packs](../../system-management/enable-non-fips-settings/use-non-fips-addon-packs.md)

- [Use non-FIPS Features](../../system-management/enable-non-fips-settings/use-non-fips-features.md)

- [Allow Cluster Import](../../system-management/enable-non-fips-settings/allow-cluster-import.md)

- [Spectro Cloud FIPS 140-3 Certification](../../../legal-licenses/compliance.md#fips-140-3)
