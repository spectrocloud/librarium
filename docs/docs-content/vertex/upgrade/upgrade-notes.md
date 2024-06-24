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

Prior to upgrading VMware vSphere VerteX installations from version 4.3.x to 4.4.x, complete the steps outlined in
[Mongo DNS Configmap Value is Incorrect](../../troubleshooting/palette-upgrade.md#mongo-dns-configmap-value-is-incorrect).
Addressing the [known issue](./../../release-notes/known-issues.md#active-known-issues) will prevent system pods from
experiencing _CrashLoopBackOff_ errors after the upgrade.

After the upgrade, if Enterprise Cluster backups are stuck, refer to the
[Enterprise Backup Stuck](../../troubleshooting/enterprise-install.md#scenario-enterprise-backup-stuck) troubleshooting
guide for resolution steps.
