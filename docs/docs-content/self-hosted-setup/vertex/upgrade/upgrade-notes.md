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
