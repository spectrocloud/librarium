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

[GHSA-m425-mq94-257g](https://github.com/advisories/ghsa-74fp-r6jw-h4mp)

## Last Update

08/06/2024

## NIST CVE Summary

Kubernetes apimachinery packages vulnerable to unbounded recursion in JSON or YAML parsing

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
