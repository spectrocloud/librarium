---
sidebar_label: "Maintenance Policy"
title: "Packs Maintenance Policy"
description: "Learn about Palette pack update and deprecation schedules."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["packs", "deprecation"]
---

Palette supports two pack categories: _Infrastructure_ and _Add-on_. Infrastructure packs are often sourced from third parties and are infrastructure-related or support critical container-based environments. Packs are used to create layers in cluster profiles. Infrastructure packs are grouped as follows:

- Operating System (OS)
- Kubernetes
- Container Network Interface (CNI)
- Container Storage Interface (CSI)

Add-on packs provide additional functionality that you can add to your cluster profile and are grouped as follows:

- Authentication
- Ingress
- Load balancer
- Logging
- Monitoring
- Security
- Service mesh
- System apps

Check out the [Packs List](integrations.mdx) document, where you can use the filter buttons to display a list of Palette packs in each category and learn about the individual packs.

## Pack Updates

Packs undergo rigorous vulnerability scans and penetration testing before they become available in Palette. The following sections describe our update schedule for each infrastructure pack category. For update information about verified packs, review [Palette Verified Packs](verified_packs.md).

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

We deprecate and remove packs when a more stable version of the pack is available or when the underlying technology becomes obsolete. When a pack is deprecated, you will still be able to create new cluster profiles using the pack and deploy clusters that use profiles containing the pack.

Palette displays the deprecation stage when you click the information icon next to the pack name during profile creation.

![Screenshot showing how Palette indicates a pack's stage of deprecation.](/integrations_deprecation-stage.png)

An information icon in the profile stack also displays a message that instructs about required pack versions.

![Screenshot showing message in profile stack that tells you the required pack version to use.](/integrations_deprecation-profile-stack-msg.png)

:::info

You can review deprecated packs in the [Deprecated Packs](deprecated-packs.md) resource.
:::

We adhere to the following stages of deprecation:

- **Deprecated**: When a pack or a pack version is deprecated, this indicates it will be removed in the future. You will still be able to create new cluster profiles using the pack and launch clusters using existing profiles that contain the pack.

  The pack remains in _Deprecated_ state for three months before it moves to _Disabled_ state.

- **Disabled**: When a pack is disabled, it is no longer available for selection in Palette. When creating new profiles, you must use a newer version of the pack. You can still launch clusters using existing profiles that contain the disabled pack.

  The pack remains in _Disabled_ state for three months before it is deleted.

- **Deleted**: When a pack is deleted, it is removed from Palette. An active cluster that contains the deleted pack will continue to operate. However, you will not be able to deploy a new cluster profile that contains the deleted pack.

:::info

For important guidelines on updating pack versions, review [Update the Pack Version](../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#update-the-pack-version).

:::

### Kubernetes Packs

A minor Kubernetes version is deprecated in Palette when the Kubernetes community announces the version is entering End of Life (EOL).

### CNI / CSI / Add-on Packs

Palette supports a minor version of CNI, CSI, and add-on packs until two newer versions are available. At that time, packs in these categories are deprecated.
