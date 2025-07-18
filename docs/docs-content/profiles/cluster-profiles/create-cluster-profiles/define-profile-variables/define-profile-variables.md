---
sidebar_label: "Cluster Profile Variables"
title: "Cluster Profile Variables"
description: "Learn what cluster profile variables are and how to use them."
sidebar_position: 40
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

Use cluster profile variables to create placeholders for parameters in profile-layer configurations, which you can
populate for individual clusters during deployment. With cluster profile variables, you can use a single cluster profile
to deploy multiple clusters with unique requirements for security, networking, resource allocation, and more. You can
also set specific constraints on the expected values, such as format, optionality, and masking to ensure scalable,
error-free cluster deployments.

Cluster profile variables can be used with any Palette cluster, including public cloud, data center, bare metal, and
edge clusters, and can also be managed via
[Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

You can use cluster profile variables with any number of packs, manifests, and Helm charts, but only in the scope of
their parent cluster profile. If you want to create placeholders to use across different cluster profiles, consider
using [Palette Macros](../../../../clusters/cluster-management/macros.md).

The following table describes the differences between profile variables and macros.

| **Capability**                                                             | **Profile Variable** | **Macro** |
| -------------------------------------------------------------------------- | :------------------: | :-------: |
| Belongs to the cluster profile scope.                                      |          ✅          |    ❌     |
| Belongs to the project scope.                                              |          ❌          |    ✅     |
| Belongs to the tenant scope.                                               |          ❌          |    ✅     |
| Supports data format restrictions.                                         |          ✅          |    ❌     |
| Supports optionality restrictions.                                         |          ✅          |    ❌     |
| Supports [sprig template functions](https://masterminds.github.io/sprig/). |          ❌          |    ✅     |

## Limitations

- Palette does not support nesting profile variables within macros or other profile variables.

- The variable must satisfy any existing schema constraint defined in the pack. Refer to the
  [Pack Constraints](../../../../registries-and-packs/pack-constraints.md) page for more information.

- You cannot define a profile variable for the `pack.content` parameter because Palette populates it automatically. You
  can create a profile variable for the `system.uri` parameter so long as a macro is not already being used.

- In [Edge](../../../../clusters/edge/edge.md) deployments, cluster profile variables must be created and defined in
  Palette SaaS, but their values can be edited in [Local UI](../../../../clusters/edge/local-ui/local-ui.md) prior to
  deploying a cluster.

## Next Steps

Refer to the [Create Cluster Profile Variables](./create-cluster-profile-variables.md) guide to learn how to begin using
cluster profile variables to streamline cluster deployment and Day-2 operations.
