---
sidebar_label: "Profiles"
title: "Profiles"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
sidebar_custom_props: 
    icon: "bundles"
tags: ["profiles", "cluster profiles", "app profiles", "system profiles"]
---

Profiles are composed of packs, Helm charts, or manifests and are used to ensure consistency across workload cluster deployments and Palette virtual clusters. Simultaneously, they offer the flexibility to tailor deployments to your specific needs.

Palette uses the following profile types:

**Cluster profiles** - You create cluster profiles to meet specific types of workloads on your Palette cluster deployments. Cluster profiles span multiple clusters and projects within a [tenant](../glossary-all.md#tenant).

**App profiles** - You create app profiles to meet specific types of workloads on your Palette virtual clusters deployed using Palette Dev Engine (PDE) *App Mode*. For information about PDE and App Mode, check out the [Palette Dev Engine](../devx/devx.md) reference. For mroe information about app profiles, review [App Profiles](./app-profiles/app-profiles.md) documentation.

**System profiles** - System profiles require Palette console access. These profiles span multiple tenants and are typically used to bootstrap an edge appliance with an initial set of virtual and containerized applications. Refer to [System Profiles](./system-profiles/system-profiles.md) to learn more.

<!-- You must have Palette console access to use system profiles. -->

## Resources

[Cluster Profiles](./cluster-profiles/cluster-profiles.md)

[App Profiles](./app-profiles/app-profiles.md)

[System Profiles](./system-profiles/system-profiles.md)
