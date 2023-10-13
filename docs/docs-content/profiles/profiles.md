---
sidebar_label: "Profiles"
title: "Profiles"
description: "Learn how Palette uses cluster profiles to provide both consistency and flexibility across Kubernetes clusters."
hide_table_of_contents: false
sidebar_custom_props: 
  icon: "bundles"
tags: ["profiles", "cluster profiles", "app profiles", "system profiles"]
---

Profiles are composed of packs, Helm charts, and manifests and are used to ensure consistency across workload cluster deployments and Palette virtual clusters. Simultaneously, they offer the flexibility to tailor deployments to your specific needs.

Palette uses the following profile types:

**Cluster profiles** - You create cluster profiles to meet specific types of workloads on your Palette cluster deployments. Cluster profiles span multiple clusters and projects within a [tenant](../glossary-all.md#tenant). For more information about cluster profiles, review [Cluster Profiles](./cluster-profiles/cluster-profiles.md) documentation.

**App profiles** - You create app profiles to meet specific types of workloads on your Palette Virtual Clusters deployed using Palette Dev Engine (PDE). For information about PDE, check out the [Palette Dev Engine](../devx/devx.md) reference. For more information about app profiles, review [App Profiles](./app-profiles/app-profiles.md) documentation.

**System profiles** - System profiles are applied to the Enterprise cluster, which hosts Palette or Palette VerteX. You cannot create a system profile. However, if you have system console access, there may be unique scenarios, such as upgrading major Palette releases, that require updating a system profile. Our Support team would provide guidance on updating system profiles if needed.


## Resources

[Cluster Profiles](./cluster-profiles/cluster-profiles.md)

[App Profiles](./app-profiles/app-profiles.md)
