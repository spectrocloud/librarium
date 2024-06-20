---
sidebar_label: "Clone a Cluster Profile"
title: "Clone a Cluster Profile"
description: "Learn how to clone a cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 60
tags: ["profiles", "cluster profiles"]
---

You can clone a cluster profile across multiple projects within the same [tenant](../../glossary-all.md#tenant).

## Prerequisites

- A cluster profile created in Palette. Check out [Cluster Profiles](cluster-profiles.md) to learn about the different
  types of cluster profiles you can create.

## Clone Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **Main Menu**, click on **Profiles**.

3. Click on the **three-dot Menu** in the row of the cluster profile you want to clone and select **Clone**.

4. Provide the following information for your cloned cluster profile and click **Confirm**.

   | **Parameter**              | **Description**                                                                                                                                                                                                            |
   | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                   | A custom name for the cloned cluster profile.                                                                                                                                                                              |
   | **Profile Version**        | An optional version number for the new cluster profile. The default value is 1.0.0. You can create multiple versions of a cluster profile using the format `major.minor.patch`.                                            |
   | **Source Profile Version** | The version number of the source profile.                                                                                                                                                                                  |
   | **Scope**                  | Choose the target scope the cluster profile will apply to: **project** or **tenant**. When you select **project**, a **Project** field displays. Selecting **tenant** will make the profile available to the organization. |
   | **Project**                | This field displays when you select **project** scope. Select a target project from the **drop-down Menu**.                                                                                                                |

   To learn how to create multiple profile versions that use the same name, check out
   [Version a Cluster Profile](../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

   You can now use the cluster profile when deploying clusters in the target project or tenant.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**. Palette displays a list of all the cluster profiles available to
   you, including cloned profiles.
3. Deploy your application to a cluster using the cloned cluster profile.
