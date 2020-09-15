---
title: "Projects"
metaTitle: "Concept: Projects"
metaDescription: "Understanding what Spectro Cloud projects are"
icon: "cog"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Projects

A project helps to organize the cluster resources in a logical grouping. The resources which are created within a project are scoped to that specific project and not available to other projects. Users and teams with specific roles can be associated with the project.

# Creating a project

Navigate to *Admin > Projects* and click on the **Create Project** button to show the project creation form.

Enter the name, description, and tags to create a project.

# Associating Users and Teams to a Project

The <Tooltip trigger={<u>Users</u>}><a href="/introduction/concept-overviews#users">Users</a> are members of a tenant who are assigned roles that control their access within the platform.</Tooltip> and <Tooltip trigger={<u>Teams</u>}>A <a href="/introduction/concept-overviews#team">Team</a> is a group of users.</Tooltip> can be associated via *Admin > User & Teams* page. Select the user or team and select *Add Roles* under Project Roles for the project association.

The user permission is always the union of the Tenant and Project roles along with the roles inherited from the team association. Hence, if a user is a *Tenant Admin*, then the user has the *Project Admin* role to all the projects, even if an explicit project role is not assigned. If a user has the *Project Viewer* role at tenant scope, then the user gets "view" permissions on all the projects and the user can be provided a *Project Admin* role for a specific project using the *Project Roles*.

# Project Dashboard

The *Admin > Projects* page displays the projects related dashboard cards capturing the usage and metrics about the projects.

# Monthly Kilocore-hours Usage

The monthly usage card shows the daily cluster usage in kilocore hours for a month across all the projects.  The kilocore hours (kCh) is an aggregate measure of how many core hours the worker nodes consume while under management across all your deployments. The metering of the kilocore hours for the node is done in increments of seconds. The monthly usage card also shows the project-wise kilocore hours. Based on the plan type, the kilocore hours' subscription information will be shown. A tenant starts with a Trial plan and can upgrade to a Monthly On-Demand plan or an Annual Subscription plan.

# Cores per Project Usage

The usage of the active worker nodes' CPU cores is grouped across all projects and shown at an hourly interval by default. The interval can be changed to days or months.

# Project Card

Every project card shows the cluster's state information grouped by its health and error states. Cluster health is derived based on the cluster nodes' health. Each node health is determined based on the serval conditions like node state, memory & disk pressure, and network availability.
