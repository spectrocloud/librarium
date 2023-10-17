---
sidebar_label: "Palette Dashboard"
title: "Palette Dashboard"
description: "Spectro Cloud Palette Dashboard"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started"]
---

This section is a tour of Palette's two main dashboards: the **Project** dashboard and the **Tenant Admin** dashboard. The **Project** dashboard is for non-admin users to perform operations related to setting up Kubernetes clusters, creating cluster profiles, creating cloud accounts, and deploying clusters. The **Tenant Admin** dashboard is used to perform administrative tasks such as setting up Single Sign On (SSO), creating users and teams, setting up Role-Based Access Control (RBAC), and setting up additional package registries. 

The **Tenant Admin** dashboard is only available to users who have the Tenant Admin role. Tenant admin users can toggle between the **Project** dashboard and **Tenant Admin** dashboard. Users without the tenant admin role can only view the **Project** dashboard.

## Project Dashboard

The **Project** dashboard shows available views for non-admin users. The list below describes the dashboard elements. 

<!-- Numbered items in the screenshot are described in the list below.  -->

![project-dashboard](/project-dashboard.png)

- Projects are used to organize the cluster resources within a logical group. Use the **drop-down Menu** to shift between projects.

- The left **Main Menu** contains the [Project Overview](../projects.md) of the resource and cost consumption of the selected project. 

- [Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md) are instantiated templates that are created with pre-configured layers needed for cluster deployments.

- The **Main Menu** also contains options for [Kubernetes clusters](../clusters/clusters.md) in Palette, which are instantiated from cluster profiles.

- [Workspaces](../workspace/workspace.md) enable the coupling of relevant namespaces across multiple clusters to manage access, obtain cost, and workload visibility by applications or teams.

- [Audit logs](../audit-logs/audit-logs.md) display the log of activities within a certain timeframe.

- **Project Settings** allow you to configure settings for cloud accounts, backup locations, and alerts. It also allows you to upload SSH keys. Keys can be recalled when deploying a cluster. Platform settings are also available for controlling auto upgrades and auto remediation of unhealthy nodes in Palette-provisioned clusters.



## Tenant Admin Dashboard

The **Tenant Admin** dashboard shows available views for tenant administrators. The list below describes the dashboard elements. 

![admin-dashboard](/admin-dashboard.png)

- The **Tenant Admin** menu contains a **Projects** button, which the **Project** dashboard does not have. The **Projects** button allows tenant admins to create, modify, and delete projects.

- The **Cluster Profiles** button allows tenant admins to create and manage global cluster profiles that can be used for cluster creation across all projects within a tenant.

- Tenant admins can assign [Roles and Permissions](../user-management/user-management.md#rbac) and create [Users](../user-management/user-management.md) and teams or user groups. 

- [Audit logs](../audit-logs/audit-logs.md) in the Tenant Admin dashboard allow tracking user interaction with application resources for all projects and users. For admin users, the **Audit Log** button is visible for each project to view the logs of the resources specific to the project.

-  **Tenant Settings** give tenant admins access to the [pack registries](../registries-and-packs/registries-and-packs.md), [private cloud gateways](../glossary-all.md/#private-cloud-gateway), and [SAML SSO](../user-management/saml-sso/saml-sso.md) configurations.

