---
sidebar_label: "Clone a Cluster Profile"
title: "Clone a Cluster Profile"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
sidebar_position: 50
tags: ["profiles", "cluster profiles"]
---


You can clone cluster profile across multiple projects. For example, you can clone a cluster profile created in one project to another project within the same [tenant](../../glossary-all.md#tenant).
## Prerequisites

* A cluster profile created in Palette. Check out [Cluster Profiles](cluster-profiles.md) to learn about the different types of cluster profiles you can create depending on your requirements. 

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **Main Menu**, click on **Profiles**.

3. Click on the **three-dot Menu** in the row of the cluster profile you want to clone and select **Clone**.

4. Provide the following information for your cloned app profile and click **Confirm**.
| **Parameter**           | **Description**  |
|-----------------------------|---------------------|
|**Name** | A custom name for the cloned app profile.|
|**Profile Version** | An optional version number for the new cluster profile. The default value is 1.0.0. You can create multiple versions of a cluster profile using the format `major.minor.patch`. |
|**Source Profile Version**  | The version number of the source profile. | 
|**Scope** | Choose the scope that the cluster profile will apply to. If you choose **project** and there are multiple projects to choose from, select the project to which the profile is to be cloned. If you choose **tenant**, the profile will be cloned to the tenant and be available to the organization. |
|**Project** | The target project to which the profile is to be cloned. Select the project name from the **drop-down Menu**.|

You can now use the cluster profile when deploying clusters in the target project or tenant.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Profiles**. Palette displays a list of all the cluster profiles available to you, including cloned profiles.
   
3. Deploy your application to a cluster using the cloned cluster profile.
