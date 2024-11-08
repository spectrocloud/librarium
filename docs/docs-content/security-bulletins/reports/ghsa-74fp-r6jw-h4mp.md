---
sidebar_label: "GHSA-74fp-r6jw-h4mp"
title: "GHSA-74fp-r6jw-h4mp"
description: "Lifecycle of GHSA-74fp-r6jw-h4mp"
hide_table_of_contents: true
sidebar_class_name: "hide-from-sidebar"
toc_max_heading_level: 2
tags: ["security", "cve"]
---

## CVE Details

[GHSA-74fp-r6jw-h4mp](https://github.com/advisories/ghsa-74fp-r6jw-h4mp)

## Last Update

11/7/2024

## NIST CVE Summary

Kubernetes apimachinery packages vulnerable to unbounded recursion in JSON or YAML parsing.

## Our Official Summary

This vulnerability is reported by govulncheck because of the presence of go library, k8s.io/apimachinery (Affected
versions: \< 0.0.0-20190927203648-9ce6eca90e73). This is a false positive, because it does not affect latest kubernetes
versions as indicated here
([https://nvd.nist.gov/vuln/detail/CVE-2019-11253](https://nvd.nist.gov/vuln/detail/CVE-2019-11253)). Current K8s
version used: 1.28.11

## CVE Severity

[7.5](https://github.com/advisories/ghsa-74fp-r6jw-h4mp)

## Status

Ongoing

## Affected Products & Versions

- Palette VerteX airgap 4.4.11, 4.4.14, 4.4.18, 4.5.3, 4.5.8
- Palette Enterprise airgap 4.4.18, 4.5.3, 4.5.8
- Palette Enterprise 4.5.3, 4.5.8
- Palette VerteX 4.5.3, 4.5.8

## Revision History

- 1.0 08/16/2024 Initial Publication
- 2.0 08/16/2024 Added Palette VerteX airgap 4.4.11 to Affected Products
- 3.0 08/17/2024 Added Palette VerteX airgap 4.4.14 to Affected Products
- 4.0 09/17/2024 Added Palette VerteX airgap 4.4.18 & Palette Enterprise airgap 4.4.18 to Affected Products
- 5.0 10/10/2024 Added Palette VerteX airgap 4.5.3 & Palette Enterprise airgap 4.5.3 to Affected Products
- 6.0 10/14/2024 Added Palette Enterprise and Palette VerteX 4.5.3 to Affected Products
- 7.0 11/7/2024 Added Palette VerteX airgap, Palette Enterprise airgap, Palette Enterprise, and Palette VerteX 4.5.8 to Affected Products 