---
sidebar_label: "Upgrade a PCG"
title: "Upgrade a PCG"
description: "Learn how to upgrade a Private Cloud Gateway (PCG) in Palette."
hide_table_of_contents: false
sidebar_position: 40
tags: ["pcg"]
---

A PCG upgrade event can be broken down into two categories: Palette agent updates and cluster profile updates. Depending
on the upgrade event, different steps are required to complete the upgrade.

Palette updates are tied to the Palette platform version. Self-hosted Palette instances must upgrade to the next minor
or major version to receive the latest PCG agent and cluster profile updates that are compatible with the new version of
Palette. For example, if you are on Palette 4.1.12, you must upgrade to Palette 4.2.0 or greater to receive the latest
Palette agent updates that are compatible with Palette 4.2.x.

:::warning

Before upgrading a self-hosted Palette instance to a new minor or major version, allow the PCG agent to automatically
upgrade to the latest version and manually approve any pending cluster profile updates. This will help you avoid
compatibility issues between the PCG and the upgraded Palette.

For instance, if you are upgrading from Palette v3.4.x to v4.2.x, ensure both PCG agent and cluster profiles updates are
applied. Then, upgrade to Palette v4.0.x.

Repeat this process for each subsequent upgrade to Palette v4.1.0 and beyond.

:::

## Palette Agent Updates

Palette agent updates are automatically applied to the PCG cluster when a new version of the PCG agent is released.
There are no manual user actions required for agent updates. The PCG agent is updated in the background and does not
require downtime for the PCG cluster.

If you do not want the PCG agent to be automatically updated, you can turn off the automatic agent update feature by
disabling platform updates. Refer to
[Pause Platform Upgrades](../../cluster-management/platform-settings/pause-platform-upgrades.md) for guidance on how to
pause platform upgrades.

:::tip

To check the current version of the PCG agent, navigate to the PCG cluster details page for the PCG cluster you want to
check. The PCG agent version is displayed in the **Agent Version** field.

:::

## Cluster Profile Updates

The cluster profile for a PCG is locked down and cannot be changed by a user. In the scenario when a cluster profile is
update available, for example, when upgrading the underlying Kubernetes version of the PCG cluster, the PCG cluster
detail's page will display a notification that a new version of the cluster profile is available.

    ![A PCG details page displaying an eligble update](/clusters_manage-pcg_pcg-upgrade_updates-button.png)

To upgrade the PCG cluster, click the **Updates** button to start the upgrade process. A cluster profile editor will
appear, displaying the changes that will be made to the cluster profile. Review the changes and click **Confirm
updates** to start the upgrade process. Depending on the changes, the upgrade process may take some time to complete,
and the PCG cluster may be unavailable during the upgrade process. Refer to the
[Update a Cluster Profile](../../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) to
learn more about the cluster profile update process.

Once a PCG cluster profile update is complete, an event log message stating "all control planes are updated" is
displayed in the event log.
