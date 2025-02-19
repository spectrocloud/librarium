---
sidebar_label: "GHSA-74FP-R6JW-H4MP"
title: "GHSA-74FP-R6JW-H4MP"
description: "Lifecycle of GHSA-74FP-R6JW-H4MP"
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: false
toc_max_heading_level: 2
tags: ["security", "cve"]
---

## CVE Details

Visit the official vulnerability details page for [GHSA-74FP-R6JW-H4MP](https://github.com/advisories/ghsa-74fp-r6jw-h4mp) to learn more.

## Initial Publication

10/25/2024

## Last Update

02/18/2025

## Third Party Dependency 

k8s.io/apimachinery


## NIST CVE Summary

Kubernetes apimachinery packages vulnerable to unbounded recursion in JSON or YAML parsing

## CVE Severity

[7.5](https://github.com/advisories/ghsa-74fp-r6jw-h4mp)

## Our Official Summary

This vulnerability is reported by govulncheck because of the presence of go library, k8s.io/apimachinery (Affected versions: \< 0.0.0-20190927203648-9ce6eca90e73). This is a false positive, because it does not affect latest kubernetes versions as indicated here (https://nvd.nist.gov/vuln/detail/CVE-2019-11253). Current K8s version used: 1.28.11

## Status

Ongoing

## Affected Products & Versions

| Version | Palette Enterprise | Palette Enterprise Airgap | VerteX | VerteX Airgap |
| - | -------- | -------- | -------- | -------- |
| 4.6.6 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.22 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.21 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.20 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.15 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.11 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.10 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.8 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.5 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.5.4 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |
| 4.4.20 | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted | ⚠️ Impacted |


## Revision History

| Date | Revision |
| --- | --- |
| 02/18/2025 | Advisory assigned with HIGH severity |
| 02/17/2025 | Advisory severity revised to UNKNOWN from HIGH |
| 02/17/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21, 4.5.22 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21, 4.5.22, 4.6.6 |
| 02/14/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21, 4.5.22 |
| 02/05/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21 |
| 01/20/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20 |
| 12/16/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15 |
| 12/11/2024 | Official summary added |
| 11/15/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11 |
| 11/15/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10 |
| 11/13/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8 to 4.5.4, 4.5.5, 4.5.8, 4.4.20 |
| 11/10/2024 | Impacted versions changed from 4.5.4, 4.5.5 to 4.5.4, 4.5.5, 4.5.8 |
| 10/27/2024 | Impacted versions changed from 4.5.4 to 4.5.4, 4.5.5 |
