---
sidebar_label: "Version a Cluster Profile"
title: "Version a Cluster Profile"
description: "Learn how to create a new version of an existing cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 70
tags: ["profiles", "cluster profiles"]
---


You can create multiple versions of a cluster profile using the same profile name but with a different pack configuration. Cluster profile versions use the format `major.minor.patch`. For example version `1.1.2`. 
         
Cluster profiles have a default value of `1.0.0`. When you create a new profile version, you can add or remove packs, and you can add different pack versions. 

## Prerequisites 

- A cluster profile created in Palette. Check out [Cluster Profiles](../cluster-profiles.md) to learn about the different types of cluster profiles you can create depending on your requirements.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select the **Profiles** option from the left **Main Menu**.

3. Select the cluster profile that you want to version.

4. From the **drop-down Menu** next to the cluster profile name, select the **Create New Version**.

5. Provide the version number using `major.minor.patch` format.

6. Click on **Confirm**. Palette displays a versioning successful message.

7. Configure layers as needed.

You have successfully created a new pack version.


## Validate

You can validate that the cluster profile is versioned and available in the target project.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select the **Profiles** option from the left **Main Menu**.     

3. Use the **drop-down Menu** next to the cluster profile name to select the new profile version. Use the versioned profile to deploy a cluster.