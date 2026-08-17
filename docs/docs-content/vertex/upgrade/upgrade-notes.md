---
sidebar_label: "Upgrade Notes"
title: "Upgrade Notes"
description: "Learn how to upgrade self-hosted Palette instances."
icon: ""
sidebar_position: 0
tags: ["vertex", "self-hosted", "airgap", "kubernetes", "upgrade"]
keywords: ["vertex", "enterprise", "airgap", "kubernetes"]
---

This page offers version-specific reference to help you prepare for upgrading self-hosted Vertex instances.

## Upgrade VerteX 4.3.x to 4.4.x

<!-- prettier-ignore -->
Prior to upgrading VMware vSphere VerteX installations from version 4.3.x to 4.4.x, complete the
steps outlined in the
[Mongo DNS ConfigMap Issue](../../troubleshooting/palette-upgrade.md#mongo-dns-configmap-value-is-incorrect) guide.
Addressing this Mongo DNS issue will prevent system pods from experiencing _CrashLoopBackOff_ errors after the upgrade.

After the upgrade, if Enterprise Cluster backups are stuck, refer to the
[Enterprise Backup Stuck](../../troubleshooting/enterprise-install.md#scenario---enterprise-backup-stuck)
troubleshooting guide for resolution steps.

## Upgrade with VMware

A known issue impacts all self-hosted Palette instances older then 4.4.14. Before upgrading an Palette instance with
version older than 4.4.14, ensure that you execute a utility script to make all your cluster IDs unique in your
Persistent Volume Claim (PVC) metadata. For more information, refer to the
[Troubleshooting Guide](../../troubleshooting/enterprise-install.md#scenario---non-unique-vsphere-cns-mapping).

## VerteX 4.10

Palette VerteX 4.10 validates user-supplied cluster profile and app profile versions against the
[Semantic Versioning](https://semver.org) specification. Before upgrading, audit your existing cluster profiles and app
profiles for malformed version strings. Values such as `2.2.2.develop` or `b0.0.1` that earlier releases accepted are
rejected on any subsequent update until the version is corrected. Values such as `1.2.3` and `1.2.3-rc.1` remain valid.
External registry and chart tags, including Zarf UDS tags, are unaffected.

For the accepted format, refer to
[Version a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) and
[Version an App Profile](../../profiles/app-profiles/modify-app-profiles/version-app-profile.md).
