---
sidebar_label: "Version a Cluster Profile"
title: "Version a Cluster Profile"
description: "Learn how to create a new version of an existing cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 70
tags: ["profiles", "cluster profiles"]
---

Palette enables you to create multiple versions of a cluster profile using the same profile name but with a different pack configuration. Cluster profile versions use the format `major.minor.patch` and have a default value of `1.0.0`.

Cluster profile versions are grouped under the same name, and the version number makes them unique. The **drop-down Menu** next to the cluster profile name on the profile details page contains the different versions.

New versions of a cluster profile may add or remove layers, contain new pack versions, or update a pack configuration.

## Prerequisites

- A cluster profile created in Palette. Check out [Cluster Profiles](../cluster-profiles.md) to learn about the different types of cluster profiles you can create.

## Create New Cluster Profile Version

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Click on **Profiles** in the left **Main Menu**, and select the cluster profile that you want to version.

3. From the **drop-down Menu** next to the cluster profile name, select **Create new version**.

4. Provide the version number using `major.minor.patch` format.

5. Click on **Confirm**. Palette displays a versioning successful message.

6. Configure layers as needed and save your changes.

You have successfully created a new pack version.

## Validate

You can validate that the cluster profile is versioned and available in the target project.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Profiles** from the left **Main Menu**.

3. Use the **drop-down Menu** next to the cluster profile and verify the new profile version is listed.

4. Select the new profile version and review its configuration.
