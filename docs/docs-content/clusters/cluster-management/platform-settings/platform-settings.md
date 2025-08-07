---
sidebar_label: "Platform Settings"
title: "Platform Settings"
description: "Learn about Palette's Platform Settings options."
hiddenFromNav: false
tags: ["clusters", "cluster management"]
---

Palette provides three platform settings in **Tenant Settings**:

- **Pause Agent Upgrades** excludes a cluster or group of clusters from being upgraded once Palette upgrades.

- **Cluster Auto Remediation** controls whether unhealthy nodes in Palette-provisioned clusters will automatically be
  replaced with new nodes.

- **Automatic Cluster Role Bindings** injects Palette IDP users into Kubernetes clusters with necessary role bindings.   

These settings can be enabled at different scopes.

## Resources

- [Pause Platform Upgrades](./pause-platform-upgrades.md)

- [Cluster Auto Remediation](./cluster-auto-remediation.md)

- [Automatic Cluster Role Bidnings](./cluster-auto-rbac.md)
