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

## Palette Agent Updates

Palette agent updates are automatically applied to the PCG cluster when a new version of the PCG agent is released.
There are no manual user actions required for agent updates. The PCG agent is updated in the background and does not
require any downtime for the PCG cluster.

:::info

Palette agent updates are tied to the Palette platform version. Self-hosted Palette instances must upgrade to the next
minor or major version to receive the latest PCG agent updates that is compatible with the new version of Palette. For
example, if you are on Palette 4.1.12, you must upgrade to Palette 4.2.0 or greater to receive the latest Palette agent
updates that are compatible with Palette 4.2.x.

:::

If you do not want the PCG agent to be automatically updated, you can disable the automatic agent update feature by
disabling platform updates. Refer to
[Pause Platform Upgrades](../../cluster-management/platform-settings/pause-platform-upgrades.md) for guidance on how to
pause platform upgrades.

## Cluster Profile Updates

The cluster profile for a PCG is locked down and cannot be changed by any user. In the scenario where a cluster profile
is updated, for example, when upgrading the underlying Kubernetes version, the PCG cluster detail's page will display a
notification that a new version of the cluster profile is available.

    ![A PCG details page displaying an eligble update](/clusters_manage-pcg_pcg-upgrade_updates-button.png)

To upgrade the PCG cluster, click the **Updates** button to start the upgrade process.
