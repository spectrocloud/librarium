---
sidebar_label: "GHSA-M425-MQ94-257G"
title: "GHSA-M425-MQ94-257G"
description: "Lifecycle of GHSA-M425-MQ94-257G"
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: false
toc_max_heading_level: 2
tags: ["security", "cve"]
---

## CVE Details

Visit the official vulnerability details page for [GHSA-M425-MQ94-257G](https://github.com/advisories/ghsa-m425-mq94-257g) to learn more.

## Initial Publication

10/25/2024

## Last Update

02/14/2025

## Third Party Dependency 

google.golang.org/grpc


## NIST CVE Summary

gRPC-Go HTTP/2 Rapid Reset vulnerability

## CVE Severity

[7.5](https://github.com/advisories/ghsa-m425-mq94-257g)

## Our Official Summary

In affected releases of gRPC-Go, it is possible for an attacker to send HTTP/2 requests, cancel them, and send subsequent requests, which is valid by the HTTP/2 protocol, but would cause the gRPC-Go server to launch more concurrent method handlers than the configured maximum stream limit.

The containers where this vulnerability is reported are internal components which requires privileged access and do not expose HTTP endpoints. So the risk of explotation is very low and impact is low as well because containers make the attack surface minimal. We will wait for upstream fixes for the libraries.

## Status

Ongoing

## Affected Products & Versions

| Version | Palette Enterprise | Palette Enterprise Airgap | VerteX | VerteX Airgap |
| - | -------- | -------- | -------- | -------- |
| 4.6.6 | ⚠️ Impacted | ✅ No Impact | ⚠️ Impacted | ✅ No Impact |
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
| 02/14/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21, 4.5.22 |
| 02/05/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20, 4.5.21 |
| 01/20/2025 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15, 4.5.20 |
| 12/16/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11, 4.5.15 |
| 12/11/2024 | Official summary revised: In affected releases of gRPC-Go, it is possible for an attacker to send HTTP/2 requests, cancel them, and send subsequent requests, which is valid by the HTTP/2 protocol, but would cause the gRPC-Go server to launch more concurrent method handlers than the configured maximum stream limit.The containers where this vulnerability is reported are internal components which requires privileged access and do not expose HTTP endpoints. So the risk of explotation is very low and impact is low as well because containers make the attack surface minimal. We will wait for upstream fixes for the libraries. |
| 11/15/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10, 4.5.11 |
| 11/15/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8, 4.4.20 to 4.5.4, 4.5.5, 4.5.8, 4.4.20, 4.5.10 |
| 11/13/2024 | Impacted versions changed from 4.5.4, 4.5.5, 4.5.8 to 4.5.4, 4.5.5, 4.5.8, 4.4.20 |
| 11/10/2024 | Impacted versions changed from 4.5.4, 4.5.5 to 4.5.4, 4.5.5, 4.5.8 |
| 10/27/2024 | Impacted versions changed from 4.5.4 to 4.5.4, 4.5.5 |
