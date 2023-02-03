---
title: "Projects"
metaTitle: "Concept: Projects"
metaDescription: "Understanding what Spectro Cloud projects are"
icon: "cog"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Projects

A **Project** helps you organize the cluster resources in a logical grouping. The resources which are created within a project are scoped to that project and not available to other projects. You can also assign users and teams with specific roles to specific projects.

# Project Dashboard

The **Tenant Admin** > **Projects** page displays the projects-related dashboard cards, capturing the usage and metrics about the projects.

## Monthly kilo-Core hours Usage

The **Monthly Usage** card shows the Daily Cluster Usage in kilo-Core hours (kCh) for a month across all the projects.  The kilo-Core hours is an aggregate measure of how many core hours the worker nodes consume, while under management, across all your deployments. The metering of the kilo-Core hours for the node is done in increments of seconds. The monthly usage card also shows project-wide kilo-Core hours. Based on the plan type, the kilo-Core hours' subscription information will be shown. A tenant starts with a Trial plan and can upgrade to a Monthly On-Demand plan or an Annual Subscription plan.

## Cores per Project Usage

The usage of the active worker nodes' CPU **Cores** is grouped across all projects and shown at an hourly interval, by default. You can change the interval value to days or months.

## Project Card

Every **Project Card** displays the cluster's state. The cluster information is grouped by its health and error states. Cluster health is derived based on the cluster nodes' health. The health of each node is determined based on several conditions such as memory and CPU utilizaiton, disk pressure, and network availability.


# Create a Project

Use the following steps to create a new project.

<br />

<InfoBox>

You can associate users and teams with a project. Check out the [Project Association](/user-management/project-association) page to learn more.

</InfoBox>

## Prerequisites

* Tenant Admin access

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com)


1. Navigate to **Tenant Admin** > **Projects** and click on the **Create Project** button to trigger the project creation wizard.


1. Fill out the the following fields: **Name**, **Description**, and **Tags** to create a Project.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com)

1. Navigate to **Tenant Admin** > **Projects** 

Your newly created project is listed along with other existing projects.


# Delete a Project


You can remove projects by following the steps below.

## Prerequisites

* Tenant Admin access

* No active clusters in the project. 

## Remove Project

1. Log in to [Palette](https://console.spectrocloud.com)

2. Switch to the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Projects**

4. Locate the project card for the project you want to remove.

5. Click on the **three-dot Menu** and select **Delete**.

6. A pop-up box will ask you to confirm the action. Click on **Yes, delete project**.


<WarningBox>

You can force delete projects as long as there are no active clusters. All resources that belong to the project will be deleted.

</WarningBox>


## Validation

1. Log in to [Palette](https://console.spectrocloud.com)

1. Navigate to **Tenant Admin** > **Projects** 

The project you deleted is no longer displayed and available for interaction.