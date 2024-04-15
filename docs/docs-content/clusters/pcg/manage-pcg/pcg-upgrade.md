---
sidebar_label: "Upgrade a PCG"
title: "Upgrade a PCG"
description: "Learn how to upgrade a Private Cloud Gateway (PCG) in Palette."
hide_table_of_contents: false
sidebar_position: 40
tags: ["pcg"]
---

A PCG upgrade event can be broken down into two categories: Palette agent updates and cluster profile updates. Depending
on the upgrade event, different steps are required to complete the upgrade. The cluster profile for a PCG is locked down
and cannot be changed by a user. However, when a PCG's cluster profile update is available, you must manually approve
the update to apply changes.

:::info

Upgrading a PCG has no impact on deployed host clusters. The PCG upgrade process only affects the PCG cluster itself.
Refer to the [Cluster Lifecycle Support](../architecture.md#cluster-lifecycle-support) to learn more about how a PCG
supports the lifecycle of a host cluster.

:::

Palette agent updates are tied to the Palette platform version. Self-hosted Palette instances must upgrade to the next
minor or major version to receive the latest Palette agent and cluster profile updates that are compatible with the new
version of Palette. For example, if you are on Palette 4.1.12, you must upgrade to next minor version, Palette 4.2.0 or
greater to receive the latest Palette agent updates that are compatible with Palette 4.2.x. We recommend you check for
cluster profile updates after upgrading your self-hosted Palette instance to a new version.

The table below outlines a high-level overview of the upgrade process for a PCG and each of its components.

| Component       | User Action Required? | Expected PCG Downtime? | Supported PCG Type?                             | Description                                                                                                                                                                                                                                                                                                                                       |
| --------------- | --------------------- | ---------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette Agent   | No                    | No                     | All                                             | Automatically updated unless platform updates or cluster updates are paused. Refer to the [Pause Platform Upgrades](../../cluster-management/platform-settings/pause-platform-upgrades.md) to learn more about pausing updates.                                                                                                                   |
| Cluster Profile | Yes                   | Potentially            | Only PCG clusters installed through Palette CLI | Manually approve the cluster profile update to apply the latest cluster profile changes. Not all Palette version updates introduce cluster profile changes. PCG clusters installed on an existing Kubernetes cluster is not eligible for cluster profile updates. Refer to the [Cluster Profile Updates](#cluster-profile-updates) to learn more. |

Review the following sections to learn more about the upgrade process for a PCG.

## Palette Agent Updates

Palette agent updates are automatically applied to the PCG cluster when a new version of the Palette agent is released.
There are no manual user actions required for agent updates. The Palette agent is updated in the background and does not
require downtime for the PCG cluster.

The Palette agent polls Palette for updates every 15 minutes and applies the update if a new version is available,
unless platform updates or cluster updates are paused. If you do not want the Palette agent to be automatically updated,
you can turn off the automatic agent update feature by disabling platform updates. Refer to
[Pause Platform Upgrades](../../cluster-management/palette-lock-cluster.md) for guidance on how to pause platform
upgrades.

:::tip

To check the current version of the Palette agent, navigate to the PCG cluster details page for the PCG cluster you want
to check. The Palette agent version is displayed in the **Agent Version** field.

:::

## Cluster Profile Updates

The cluster profile for a PCG is locked down and cannot be changed by a user. In the scenario when a cluster profile is
update available, for example, when upgrading the underlying Kubernetes version of the PCG cluster, the PCG cluster
detail's page will display a notification that a new version of the cluster profile is available.

:::warning

A PCG installed onto an [existing Kubernetes cluster](../deploy-pcg-k8s.md) does not support cluster profile updates.
Administrators of the Kubernetes cluster maintain the underlying Kubernetes version, Container Network Interface, and
Container Storage Interface. Discuss Kubernetes updates with the administrator of the Kubernetes cluster. A Palette
agent update is the only update event a PCG installed onto an existing Kubernetes cluster is eligible for and managed
through Palette

:::

    ![A PCG details page displaying an eligible update](/clusters_manage-pcg_pcg-upgrade_updates-button.webp)

To upgrade the PCG cluster, click the **Updates** button to start the upgrade process. A cluster profile editor will
appear, displaying the changes that will be made to the cluster profile. Review the changes and click **Confirm
updates** to start the upgrade process. Depending on the changes, the upgrade process may take some time to complete,
and the PCG cluster may be unavailable during the upgrade process. Refer to the
[Update a Cluster Profile](../../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#update-the-pack-version)
to learn more about the cluster profile update process.

Once a PCG cluster profile update is complete, an event log message stating "all control planes are updated" is
displayed in the event log.

## Upgrade Path

Before upgrading a self-hosted Palette instance to a new minor or major version, allow the Palette agent in the PCG to
automatically upgrade to the latest version and manually approve any pending cluster profile updates. This will help you
avoid compatibility issues between the PCG and the upgraded Palette.

The general guideline is to upgrade self-hosted Palette instances to the lastest patch release of the current minor
version, then upgrade to the next minor version. For a major version upgrade, ensure the latest minor version is applied
before upgrading to the next major version.

In between each version upgrade, ensure the Palette agent in the PCG and its cluster profile updates are applied. We
recommed you allow approximately 30 min for the Palette agent to automatically update, followed by applying cluster
profile updates, if applicable.

For instance, if you are upgrading from Palette v3.4.x to v4.2.x, ensure both Palette agent and cluster profiles updates
are applied for the latest patch release of v3.4.x. Then, upgrade to Palette v4.0.x.

Repeat this process for each subsequent upgrade to Palette v4.1.0 and beyond.
