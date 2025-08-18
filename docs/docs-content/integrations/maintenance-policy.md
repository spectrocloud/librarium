---
sidebar_label: "Maintenance Policy"
title: "Packs Maintenance Policy"
description: "Learn about Palette pack update and deprecation schedules."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["packs", "deprecation"]
---

Palette supports two pack categories: _Infrastructure_ and _Add-on_. Infrastructure packs are often sourced from third
parties and are infrastructure-related or support critical container-based environments. Packs are used to create layers
in cluster profiles. Infrastructure packs are grouped as follows:

- Operating System (OS)
- Kubernetes
- Container Network Interface (CNI)
- Container Storage Interface (CSI)

Add-on packs provide additional functionality that you can add to your cluster profile and are grouped as follows:

- AI
- App Services
- Authentication
- Ingress
- Load balancer
- Logging
- Monitoring
- Registry
- Security
- Service Mesh
- System Apps

Check out the [Packs List](integrations.mdx) document, where you can use the filter buttons to display a list of Palette
packs in each category and learn about the individual packs.

## Pack Updates

Packs undergo rigorous vulnerability scans and penetration testing before they become available in Palette. The
following sections describe our update schedule for each infrastructure pack category. For update information about
verified packs, review [Palette Verified Packs](verified_packs.md).

### OS Packs

We provide Ubuntu LTS and CentOS updates for IaaS clusters as follows:

| **Update Version** | **Schedule**                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **Major**          | Added within eight weeks of release.                                                                  |
| **Minor & Patch**  | Updated at runtime using Palette’s on-demand or scheduled OS upgrades and patch-on-boot capabilities. |

### Kubernetes Packs

We provide Cloud Native Computing Foundation (CNCF) Kubernetes updates as follows:

| **Update Version** | **Schedule**                                             |
| ------------------ | -------------------------------------------------------- |
| **Major**          | Assessed based on the extent of changes.                 |
| **Minor**          | Provided within eight weeks of a new Kubernetes release. |
| **Patch**          | Provided within four weeks of a new Kubernetes release.  |

You can learn about our Kubernetes support lifecycle in the [Kubernetes Support Lifecycle](kubernetes-support.md) page.

### CNI Packs

We provide CNI pack updates as follows:

| **Update Version** | **Schedule**                             |
| ------------------ | ---------------------------------------- |
| **Major**          | Assessed based on the extent of changes. |
| **Minor**          | Provided within six weeks of release.    |
| **Patch**          | Provided within four weeks of release.   |

### CSI Packs

We provide CSI pack updates as follows:

| **Update Version** | **Schedule**                             |
| ------------------ | ---------------------------------------- |
| **Major**          | Assessed based on the extent of changes. |
| **Minor**          | Provided within six weeks of release.    |
| **Patch**          | Provided within four weeks of release.   |

### Add-on Packs

We provide add-on pack updates as follows:

| **Update Version** | **Schedule**                             |
| ------------------ | ---------------------------------------- |
| **Major**          | Assessed based on the extent of changes. |
| **Minor**          | Provided within six weeks of release.    |
| **Patch**          | Provided within four weeks of release.   |

## Pack Deprecations

We deprecate and remove packs when a more stable version of the pack is available or when the underlying technology
becomes obsolete. When a pack is deprecated, you will still be able to create new cluster profiles using the pack and
deploy clusters that use profiles containing the pack.

Palette displays the deprecation stage when you click the information icon next to the pack name during profile
creation.

![Screenshot showing how Palette indicates a pack's stage of deprecation.](/integrations_deprecation-stage.webp)

An information icon in the profile stack also displays a message that instructs about required pack versions.

![Screenshot showing message in profile stack that tells you the required pack version to use.](/integrations_deprecation-profile-stack-msg.webp)

:::info

You can review deprecated packs in the [Deprecated Packs](deprecated-packs.md) resource.

:::

We adhere to the following stages of deprecation:

- **Deprecated**: When a pack or a pack version is deprecated, this indicates it will be removed in the future. You will
  still be able to create new cluster profiles using the pack and launch clusters using existing profiles that contain
  the pack. Active and deployed clusters are not affected as the pack is still available in Palette.

  The pack remains in _Deprecated_ state for three months before it moves to _Disabled_ state.

- **Disabled**: When a pack is disabled, it is no longer available for selection in Palette. When creating new profiles,
  you must use a newer version of the pack. You can still launch new clusters using existing profiles that contain the
  disabled pack. Active and deployed clusters are not affected as the pack is still available in Palette.

  The pack remains in _Disabled_ state for three months before it is deleted.

- **Deleted**: When a pack is deleted, it is removed from Palette. You will not be able to deploy a new cluster with a
  cluster profile containing the deleted pack or create a new cluster profile referencing the deleted pack. We recommend
  that you update your existing cluster profiles to use a newer version of the pack and apply the changes to your active
  clusters. Active clusters using the deleted pack will typically not experience issues if a node is rebooted or if a
  new node is added to the cluster. However, if there are any problems with the deleted pack version, such as upstream
  bugs, you may encounter issues if they affect scaling or other cluster operations.

:::info

For important guidelines on updating pack versions, review
[Update the Pack Version](../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#update-the-pack-version).

:::

### Kubernetes Packs

Refer to the [Kubernetes Support Lifecycle](kubernetes-support.md) page to learn about the Kubernetes versions we
support and the duration of support.

### CNI / CSI / Add-on Packs

Palette supports a minor version of CNI, CSI, and add-on packs until two newer versions are available. At that time,
packs in these categories are deprecated.
